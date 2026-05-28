import { readdir } from "node:fs/promises";
import path from "node:path";
import { SourcePolicy, type SourceReadResult } from "./sourcePolicy.ts";
import type { DashboardData, Diagnostic, ProjectItem, SpecItem, TextSummary } from "../types/models.ts";

export interface ReaderConfig {
  projectRoot: string;
  workspaceRoots?: string[];
  shipflowRepoRoot: string;
  projectDiscoveryDepth?: number;
  projectDiscoveryDirectoryEntriesLimit?: number;
  projectDiscoveryMaxProjects?: number;
}

type CanonicalKind = "task" | "audit" | "spec";

interface CanonicalOperationalRecord {
  kind: CanonicalKind;
  traffic: string;
  project: string;
  title: string;
  fields: Record<string, string>;
  line: number;
  raw: string;
}

interface MarkdownTableRow {
  headers: string[];
  cells: string[];
  context?: string;
  lineNumber: number;
}

interface DedupEntry {
  type: "canonical" | "legacy";
  source: string;
  line: number;
}

interface TaskSource {
  content: string;
  defaultProject?: string;
  sourcePath: string;
  redactedSourcePath: string;
}

function canonicalRecordDiagnostics(
  diagnostics: Diagnostic[],
  code: string,
  sourcePath: string,
  line: number,
  message: string
): void {
  diagnostics.push({
    code,
    severity: "warning",
    source: `${sourcePath}:${line}`,
    message
  });
}

function addDedupDiagnostic(
  diagnostics: Diagnostic[],
  recordKind: CanonicalKind,
  key: string,
  existing: DedupEntry,
  duplicate: DedupEntry
): void {
  diagnostics.push({
    code: `${recordKind.toUpperCase()}_DEDUPE`,
    severity: "warning",
    source: `${duplicate.source}:${duplicate.line}`,
    message: `Duplicate ${recordKind} key "${key}" ignored in favor of ${existing.type} record at ${existing.source}:${existing.line}`
  });
}

const DEFAULT_PROJECT_DISCOVERY_DEPTH = 4;
const DEFAULT_PROJECT_DISCOVERY_DIRECTORY_ENTRIES_LIMIT = 2500;
const DEFAULT_PROJECT_DISCOVERY_MAX_PROJECTS = 200;

interface ProjectCandidate {
  name: string;
  path: string;
  source: string;
  stack?: string;
}

interface QueueNode {
  dir: string;
  depth: number;
}

function parseMetadataValue(content: string | undefined, key: string): string | undefined {
  const match = content?.match(new RegExp(`^${key}:\\s*"?([^\\n"]+?)"?\\s*$`, "m"));
  return match?.[1]?.trim().replace(/^["']|["']$/g, "");
}

function projectNameFromMetadata(content: string | undefined): string | undefined {
  return parseMetadataValue(content, "project");
}

function projectStackFromMetadata(content: string | undefined): string | undefined {
  return parseMetadataValue(content, "stack");
}

function hasProjectMarkers(entries: string[]): boolean {
  const markers = new Set([
    "AGENT.md",
    "CLAUDE.md",
    "package.json",
    "pyproject.toml",
    "Cargo.toml",
    "go.mod",
    "pubspec.yaml"
  ]);
  return entries.some((entry) => markers.has(entry));
}

function disambiguateProjectNames(items: ProjectCandidate[]): ProjectItem[] {
  const counts = new Map<string, number>();
  return items.map((item) => {
    const normalized = normalizedProjectKey(item.name);
    const existing = counts.get(normalized) ?? 0;
    counts.set(normalized, existing + 1);
    const name = existing === 0 ? item.name : `${item.name} (${path.basename(item.path)})`;
    return { name, path: item.path, stack: item.stack, source: item.source };
  });
}

async function discoverLocalProjects(config: {
  projectRoot: string;
  workspaceRoots?: string[];
  policy: SourcePolicy;
  discoveryDepth: number;
  directoryEntriesLimit: number;
  maxProjects: number;
  diagnostics: Diagnostic[];
}): Promise<ProjectCandidate[]> {
  const roots = Array.from(new Set(
    [config.projectRoot, ...(config.workspaceRoots ?? []), path.dirname(config.projectRoot)]
      .filter(Boolean)
      .map((root) => path.resolve(root))
  ));
  const nodes: QueueNode[] = roots.map((root) => ({ dir: root, depth: 0 }));
  const visited = new Set<string>();
  const candidates: ProjectCandidate[] = [];

  while (nodes.length) {
    if (candidates.length >= config.maxProjects) {
      break;
    }

    const node = nodes.shift();
    if (!node) {
      break;
    }
    if (node.depth > config.discoveryDepth) {
      continue;
    }

    let entries: Array<{ name: string; isDirectory: boolean; isSymbolicLink: boolean; }>;
    try {
      const dirEntries = await readdir(node.dir, { withFileTypes: true });
      entries = dirEntries.map((entry) => ({
        name: entry.name,
        isDirectory: entry.isDirectory(),
        isSymbolicLink: entry.isSymbolicLink()
      }));
    } catch {
      config.diagnostics.push({
        code: "PROJECT_DISCOVERY_DIR_UNREADABLE",
        severity: "warning",
        message: "Project discovery directory unreadable",
        source: config.policy.redactPath(node.dir)
      });
      continue;
    }

    const childNames = entries.map((entry) => entry.name);
    if (entries.length > config.directoryEntriesLimit) {
      config.diagnostics.push({
        code: "PROJECT_DISCOVERY_DIR_TOO_LARGE",
        severity: "warning",
        message: "Skipping directory scan because too many entries",
        source: config.policy.redactPath(node.dir)
      });
      continue;
    }

    const shipflowDataEntry = entries.find((entry) => entry.name === "shipflow_data" && entry.isDirectory && !entry.isSymbolicLink);
    if (shipflowDataEntry) {
      if (path.basename(node.dir) !== "shipflow_data" && path.basename(node.dir) !== ".git") {
        const markerEntries = childNames;
        if (hasProjectMarkers(markerEntries)) {
          const sourceMarker = path.join(node.dir, "AGENT.md");
          const localAgentResult = await config.policy.safeRead(sourceMarker);
          const localClaudeResult = await config.policy.safeRead(path.join(node.dir, "CLAUDE.md"));
          const localProjectName = localAgentResult.ok
            ? parseMetadataValue(localAgentResult.content, "project")
            : parseMetadataValue(localClaudeResult.ok ? localClaudeResult.content : undefined, "project");
          const projectName = localProjectName || path.basename(node.dir);
          const stack = projectStackFromMetadata(
            localAgentResult.ok
              ? localAgentResult.content
              : localClaudeResult.ok
                ? localClaudeResult.content
                : undefined
          );

          const candidate: ProjectCandidate = {
            name: projectName,
            path: node.dir,
            source: localAgentResult.ok
              ? (localAgentResult.realPath ?? sourceMarker)
              : localClaudeResult.ok
                ? (localClaudeResult.realPath ?? path.join(node.dir, "CLAUDE.md"))
                : node.dir,
            stack
          };
          if (!candidates.some((item) => normalizedProjectKey(item.path) === normalizedProjectKey(candidate.path))) {
            candidates.push(candidate);
          }
        }
      }
    }

    if (node.depth === config.discoveryDepth) {
      continue;
    }

    for (const name of childNames) {
      const entry = entries.find((item) => item.name === name);
      if (!entry || !entry.isDirectory || entry.isSymbolicLink) {
        continue;
      }
      if (name.startsWith(".") || name === "node_modules" || name === ".git" || name === "dist" || name === "build") {
        continue;
      }
      const next = path.join(node.dir, name);
      if (visited.has(next)) {
        continue;
      }
      if (name.toLowerCase() === "shipflow_data") {
        continue;
      }
      const normalizedPath = path.resolve(next);
      if (visited.has(normalizedPath)) {
        continue;
      }
      visited.add(normalizedPath);
      nodes.push({ dir: normalizedPath, depth: node.depth + 1 });
    }
  }

  return candidates;
}

function normalizedProjectKey(value: string | undefined): string {
  return (value ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function normalizedFieldValue(value: string | undefined): string {
  return (value ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function extractTableRows(content: string, heading: string): string[][] {
  const lines = content.split("\n");
  const headingIndex = lines.findIndex((line) => line.trim().toLowerCase() === heading.toLowerCase());
  if (headingIndex === -1) {
    return [];
  }

  const rows: string[][] = [];
  for (const rawLine of lines.slice(headingIndex + 1)) {
    const line = rawLine.trim();
    if (line.startsWith("# ")) {
      break;
    }
    if (!line.startsWith("|")) {
      continue;
    }
    const cells = line.split("|").map((cell) => cell.trim()).filter(Boolean);
    if (!cells.length || cells.every((cell) => /^-+$/.test(cell)) || cells[0]?.toLowerCase() === "date utc") {
      continue;
    }
    rows.push(cells);
  }

  return rows;
}

function parseCanonicalRecords(content: string, sourcePath: string, diagnostics: Diagnostic[]): CanonicalOperationalRecord[] {
  const lines = content.split("\n");
  const records: CanonicalOperationalRecord[] = [];
  const hasCanonicalPrefix = (line: string): boolean =>
    line.startsWith("🔴") || line.startsWith("🟠") || line.startsWith("🟡") || line.startsWith("🟢") || line.startsWith("✅");

  for (const [index, rawLine] of lines.entries()) {
    const line = rawLine.trim();
    if (!hasCanonicalPrefix(line)) {
      continue;
    }

    const match = line.match(/^(🔴|🟠|🟡|🟢|✅)\s+\[([^\]]+)\]\s+(.*)$/u);
    if (!match) {
      continue;
    }

    const rawTraffic = match[1] ?? "";
    const project = (match[2] ?? "").trim();
    const summary = (match[3] ?? "").trim();

    const cells = splitCanonicalCells(summary);
    if (cells.length === 0) {
      canonicalRecordDiagnostics(diagnostics, "CANONICAL_RECORD_MALFORMED", sourcePath, index + 1, "Canonical operational line has no fields");
      continue;
    }

    const [firstCell, ...fieldCells] = cells;
    const kindSeparator = (firstCell ?? "").indexOf(": ");
    if (kindSeparator === -1) {
      canonicalRecordDiagnostics(
        diagnostics,
        "CANONICAL_RECORD_MALFORMED",
        sourcePath,
        index + 1,
        "Canonical operational line missing kind/title separator"
      );
      continue;
    }

    const kindToken = firstCell.slice(0, kindSeparator).trim().toLowerCase();
    if (kindToken !== "task" && kindToken !== "audit" && kindToken !== "spec") {
      canonicalRecordDiagnostics(
        diagnostics,
        "CANONICAL_RECORD_KIND_UNKNOWN",
        sourcePath,
        index + 1,
        `Unknown operational kind "${kindToken}"`
      );
      continue;
    }

    const title = unescapeCanonicalField(firstCell.slice(kindSeparator + 2).trim());
    if (!title) {
      canonicalRecordDiagnostics(
        diagnostics,
        "CANONICAL_RECORD_MISSING_FIELD",
        sourcePath,
        index + 1,
        "Canonical operational line missing title"
      );
      continue;
    }

    const fields: Record<string, string> = {};
    for (const fieldCell of fieldCells) {
      const fieldSeparator = fieldCell.indexOf(": ");
      if (fieldSeparator === -1) {
        canonicalRecordDiagnostics(
          diagnostics,
          "CANONICAL_RECORD_MALFORMED",
          sourcePath,
          index + 1,
          `Malformed field "${fieldCell}"`
        );
        continue;
      }

      const key = fieldCell.slice(0, fieldSeparator).trim().toLowerCase();
      const value = unescapeCanonicalField(fieldCell.slice(fieldSeparator + 2).trim());
      if (key) {
        fields[key] = value;
      }
    }

    records.push({
      kind: kindToken,
      traffic: rawTraffic === "✅" ? "🟢" : rawTraffic,
      project,
      title,
      fields,
      line: index + 1,
      raw: line
    });
  }
  return records;
}

function splitCanonicalCells(value: string): string[] {
  const cells: string[] = [];
  let current = "";

  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];
    if (char === "|" && index > 0 && value[index - 1] === " " && value[index + 1] === " ") {
      const normalized = current.endsWith(" ") ? current.slice(0, -1) : current;
      cells.push(normalized.trim());
      current = "";
      index += 1;
      continue;
    }
    current += char;
  }

  const tail = current.trim();
  if (tail) {
    cells.push(tail);
  }
  return cells;
}

function unescapeCanonicalField(value: string): string {
  return value.replace(/\\([\\|n\[\]])/g, (_match, escaped: string) => {
    if (escaped === "n") {
      return "\n";
    }
    return escaped;
  });
}

function taskDedupeKey(project: string, id: string | undefined, title: string, area: string | undefined): string {
  const normalizedProject = normalizedFieldValue(project);
  if (id) {
    return `${normalizedProject}|id:${normalizedFieldValue(id)}`;
  }
  return `${normalizedProject}|title:${normalizedFieldValue(title)}${area ? `|area:${normalizedFieldValue(area)}` : ""}`;
}

function auditDedupeKey(project: string, id: string | undefined, date: string, overall: string, scope: string, title: string): string {
  const normalizedProject = normalizedFieldValue(project);
  if (id) {
    return `${normalizedProject}|id:${normalizedFieldValue(id)}`;
  }
  const scopeOrTitle = scope || title;
  return `${normalizedProject}|${normalizedFieldValue(date)}|${normalizedFieldValue(overall)}|${normalizedFieldValue(scopeOrTitle)}`;
}

function specDedupeKey(project: string, id: string | undefined, filePath: string | undefined, title: string): string {
  const normalizedProject = normalizedFieldValue(project);
  if (id) {
    return `${normalizedProject}|id:${normalizedFieldValue(id)}`;
  }
  if (filePath) {
    return `${normalizedProject}|path:${normalizedFieldValue(filePath)}`;
  }
  return `${normalizedProject}|title:${normalizedFieldValue(title)}`;
}

function registerDedupe(
  seen: Map<string, DedupEntry>,
  key: string,
  recordKind: CanonicalKind,
  source: string,
  line: number,
  type: "canonical" | "legacy",
  diagnostics: Diagnostic[]
): boolean {
  const existing = seen.get(key);
  if (!existing) {
    seen.set(key, { type, source, line });
    return true;
  }
  addDedupDiagnostic(diagnostics, recordKind, key, existing, { type, source, line });
  return false;
}

function parseSpecs(content: string, filePath: string, diagnostics: Diagnostic[]): SpecItem {
  const canonicalRecords = parseCanonicalRecords(content, filePath, diagnostics).filter((record) => record.kind === "spec");
  const canonicalByKey = new Map<string, CanonicalOperationalRecord>();

  let canonicalSpec: CanonicalOperationalRecord | undefined;
  for (const record of canonicalRecords) {
    const key = specDedupeKey(record.project, record.fields.id, record.fields.path, record.title);
    if (!canonicalByKey.has(key)) {
      canonicalByKey.set(key, record);
      if (!canonicalSpec) {
        canonicalSpec = record;
      }
      continue;
    }

    const existing = canonicalByKey.get(key);
    if (existing) {
      diagnostics.push({
        code: "SPEC_RECORD_DUPLICATE",
        severity: "warning",
        source: `${filePath}:${record.line}`,
        message: `Duplicate spec canonical record "${record.title}" ignored; canonical record kept from ${filePath}:${existing.line}`
      });
    }
  }

  const specProject = canonicalSpec?.project ??
    content.match(/^project:\s*"?(.+?)"?$/m)?.[1]?.trim();

  const canonicalTitle = canonicalSpec?.title;
  const explicitTitle = content.match(/^#\s+Title\s*\n+([^\n#].+)$/m)?.[1]?.trim();
  const headingTitle = content.match(/^#\s+(.+)$/m)?.[1]?.trim();
  const title = canonicalTitle ?? explicitTitle ?? headingTitle ?? path.basename(filePath);

  const frontmatterStatus = content.match(/^status:\s*(.+)$/m)?.[1]?.trim();
  const canonicalStatus = canonicalSpec?.fields.status?.trim();
  const status = canonicalStatus ?? frontmatterStatus ?? "unknown";
  const userStory = content.match(/^user_story:\s*"?(.+?)"?$/m)?.[1]?.trim() ?? "n/a";

  const frontmatterNextStep = content.match(/^next_step:\s*"?(.+?)"?$/m)?.[1]?.trim();
  const canonicalNextStep = canonicalSpec?.fields.next?.trim();
  const nextStep = canonicalNextStep ?? frontmatterNextStep ?? "n/a";

  const canonicalPath = canonicalSpec?.fields.path?.trim();
  const specPath = canonicalPath ?? filePath;

  if (canonicalSpec) {
    if (!canonicalStatus) {
      diagnostics.push({
        code: "SPEC_RECORD_MISSING_FIELD",
        severity: "warning",
        source: `${filePath}:${canonicalSpec.line}`,
        message: `Canonical spec summary missing required "status" field for ${canonicalSpec.title}`
      });
    }
    if (!canonicalSpec.fields.path) {
      diagnostics.push({
        code: "SPEC_RECORD_MISSING_FIELD",
        severity: "warning",
        source: `${filePath}:${canonicalSpec.line}`,
        message: `Canonical spec summary missing required "path" field for ${canonicalSpec.title}`
      });
    }
    if (!canonicalSpec.fields.next) {
      diagnostics.push({
        code: "SPEC_RECORD_MISSING_FIELD",
        severity: "warning",
        source: `${filePath}:${canonicalSpec.line}`,
        message: `Canonical spec summary missing required "next" field for ${canonicalSpec.title}`
      });
    }
  }

  const runHistorySummary = extractTableRows(content, "# Skill Run History")
    .slice(-4)
    .map((cells) => `${cells[1] ?? "unknown"}: ${cells[4] ?? "unknown result"}`);
  const chantierFlowSummary = extractTableRows(content, "# Current Chantier Flow")
    .filter((cells) => cells[0]?.toLowerCase() !== "phase")
    .map((cells) => `${cells[0] ?? "phase"}=${cells[1] ?? "unknown"}`);

  return {
    path: specPath,
    project: specProject,
    title,
    status,
    userStory,
    nextStep,
    runHistorySummary,
    chantierFlowSummary
  };
}

function topLines(label: string, content: string, max = 12): TextSummary {
  const lines = content
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, max);
  return { label, lines };
}

function tableCells(line: string): string[] {
  return line
    .trim()
    .split("|")
    .map((cell) => cell.trim())
    .filter(Boolean);
}

function isTableSeparator(cells: string[]): boolean {
  return Boolean(cells.length) && cells.every((cell) => /^:?-{3,}:?$/.test(cell));
}

function parseMarkdownTableRows(content: string): MarkdownTableRow[] {
  const lines = content.split("\n");
  const rows: MarkdownTableRow[] = [];
  let headers: string[] | undefined;
  let context: string | undefined;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]?.trim() ?? "";
    const sectionMatch = line.match(/^#{2,6}\s+(.+)$/);
    if (sectionMatch) {
      context = cleanInlineMarkdown(sectionMatch[1] ?? "");
      headers = undefined;
      continue;
    }
    if (line.startsWith("# ")) {
      context = undefined;
      headers = undefined;
      continue;
    }
    if (!line.startsWith("|")) {
      headers = undefined;
      continue;
    }

    const cells = tableCells(line);
    const nextCells = tableCells(lines[index + 1] ?? "");
    if (isTableSeparator(nextCells)) {
      headers = cells.map((cell) => cell.toLowerCase());
      index += 1;
      continue;
    }

    if (!headers || isTableSeparator(cells)) {
      continue;
    }

    rows.push({ headers, cells, context, lineNumber: index + 1 });
  }

  return rows;
}

function cellFor(row: MarkdownTableRow, names: string[]): string | undefined {
  const index = row.headers.findIndex((header) => names.includes(header));
  return index === -1 ? undefined : row.cells[index];
}

function cleanInlineMarkdown(value: string): string {
  return value
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[`*]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function trafficFromText(value: string | undefined): string | undefined {
  return value?.match(/(?:^|\s)(🔴|🟠|🟡|🟢|✅)(?:\s|$)/u)?.[1]?.replace("✅", "🟢");
}

function stripLeadingTraffic(value: string): string {
  return value.replace(/^(?:🔴|🟠|🟡|🟢|✅)\s*/u, "").trim();
}

function trafficFromStatus(status: string): string {
  const normalized = status.toLowerCase();
  if (normalized.includes("blocked") || normalized.includes("failed") || normalized.includes("error") || normalized.includes("🔴")) {
    return "🔴";
  }
  if (normalized.includes("in progress") || normalized.includes("partial") || normalized.includes("active") || normalized.includes("🟠")) {
    return "🟠";
  }
  if (normalized.includes("todo") || normalized.includes("draft") || normalized.includes("pending") || normalized.includes("🟡")) {
    return "🟡";
  }
  if (normalized.includes("done") || normalized.includes("ready") || normalized.includes("verified") || normalized.includes("deferred") || normalized.includes("✅") || normalized.includes("💤") || normalized.includes("🟢")) {
    return "🟢";
  }
  return "🟡";
}

function isDoneOrDeferred(status: string): boolean {
  const normalized = status.toLowerCase();
  return normalized.includes("done") || normalized.includes("deferred") || normalized.includes("✅") || normalized.includes("💤");
}

function activeTaskContent(content: string): string {
  return content.split(/\n# Legacy Tasks\b/)[0] ?? content;
}

function projectFromTaskContext(context: string | undefined, defaultProject: string | undefined): string | undefined {
  const normalized = context?.trim();
  if (!normalized) {
    return defaultProject;
  }

  const genericSections = new Set([
    "audit",
    "audits",
    "backlog",
    "current active backlog",
    "dashboard",
    "done",
    "tasks"
  ]);
  return genericSections.has(normalized.toLowerCase()) ? defaultProject : normalized;
}

function summarizeTasks(sources: TaskSource[], diagnostics: Diagnostic[], max = 12): TextSummary {
  const seen = new Map<string, DedupEntry>();
  const openLines: string[] = [];
  const completedLines: string[] = [];

  const collectCanonicalTasks = (source: TaskSource) => {
    const canonicalRecords = parseCanonicalRecords(source.content, source.sourcePath, diagnostics).filter((record) => record.kind === "task");
    for (const record of canonicalRecords) {
      const status = record.fields.status?.trim();
      if (!status) {
        canonicalRecordDiagnostics(
          diagnostics,
          "TASK_RECORD_MISSING_FIELD",
          source.redactedSourcePath,
          record.line,
          `Canonical task missing required status field for "${record.title}"`
        );
        continue;
      }

      const project = record.project?.trim() ?? source.defaultProject ?? "";
      const key = taskDedupeKey(project, record.fields.id, record.title, record.fields.area);
      if (!registerDedupe(seen, key, "task", source.redactedSourcePath, record.line, "canonical", diagnostics)) {
        continue;
      }

      const traffic = record.traffic;
      const projectPrefix = project ? `[${project}] ` : "";
      const line = cleanInlineMarkdown(`${traffic} ${projectPrefix}${stripLeadingTraffic(record.title)} — ${status}`);
      const isOpen = !isDoneOrDeferred(status);
      if (isOpen) {
        openLines.push(line);
      } else {
        completedLines.push(line);
      }
    }
  };

  const collectLegacyTasks = (source: TaskSource) => {
    const taskRows = parseMarkdownTableRows(activeTaskContent(source.content)).map((row) => ({ row, source }));
    for (const { row } of taskRows) {
      const task = cellFor(row, ["task", "top priority"]);
      const status = cellFor(row, ["status"]);
      if (!task || !status) {
        continue;
      }

      const project = cellFor(row, ["project"]) ?? projectFromTaskContext(row.context, source.defaultProject);
      const rowArea = row.context ?? undefined;
      const key = taskDedupeKey(project ?? "", undefined, task, rowArea);
      if (!registerDedupe(seen, key, "task", source.redactedSourcePath, row.lineNumber, "legacy", diagnostics)) {
        continue;
      }

      const priority = cellFor(row, ["pri"]);
      const traffic = trafficFromText(priority) ?? trafficFromText(task) ?? trafficFromStatus(status);
      const projectPrefix = project ? `[${project}] ` : "";
      const line = cleanInlineMarkdown(`${traffic} ${projectPrefix}${stripLeadingTraffic(task)} — ${status}`);
      const isOpen = !isDoneOrDeferred(status);
      if (isOpen) {
        openLines.push(line);
      } else {
        completedLines.push(line);
      }
    }
  };

  for (const source of sources) {
    collectCanonicalTasks(source);
  }
  for (const source of sources) {
    collectLegacyTasks(source);
  }

  const lines = [...openLines, ...completedLines].slice(0, max);
  return lines.length ? { label: "Tasks", lines } : topLines("Tasks", sources.map((source) => source.content).join("\n"), max);
}

function summarizeAudits(sources: TaskSource[], diagnostics: Diagnostic[], max = 12): TextSummary {
  const seen = new Map<string, DedupEntry>();
  const lines: string[] = [];

  const collectCanonicalAudits = (source: TaskSource) => {
    const canonicalRecords = parseCanonicalRecords(source.content, source.sourcePath, diagnostics).filter((record) => record.kind === "audit");
    for (const record of canonicalRecords) {
      const date = record.fields.date?.trim() ?? "";
      const overall = record.fields.overall?.trim() ?? "";
      const issues = record.fields.issues?.trim() ?? "";
      const scope = record.fields.scope?.trim() ?? "";
      if (!date || !overall || !issues) {
        canonicalRecordDiagnostics(
          diagnostics,
          "AUDIT_RECORD_MISSING_FIELD",
          source.redactedSourcePath,
          record.line,
          `Canonical audit missing required fields for "${record.title}"`
        );
        continue;
      }
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        canonicalRecordDiagnostics(
          diagnostics,
          "AUDIT_RECORD_BAD_DATE",
          source.redactedSourcePath,
          record.line,
          `Invalid audit date "${date}" for "${record.title}"`
        );
        continue;
      }

      const project = record.project?.trim() ?? source.defaultProject ?? "";
      const key = auditDedupeKey(project, record.fields.id, date, overall, scope, record.title);
      if (!registerDedupe(seen, key, "audit", source.redactedSourcePath, record.line, "canonical", diagnostics)) {
        continue;
      }

      const traffic = record.traffic;
      const projectPrefix = project ? `[${project}] ` : "";
      const titleOrScope = scope || record.title;
      const detail = [date, titleOrScope, [overall, issues].filter(Boolean).join(" — ")].filter(Boolean).join(" — ");
      lines.push(cleanInlineMarkdown(`${traffic} ${projectPrefix}${detail}`));
    }
  };

  const collectLegacyAudits = (source: TaskSource) => {
    const auditRows = parseMarkdownTableRows(source.content)
      .filter((row) => cellFor(row, ["date", "date utc"]))
      .reverse()
      .map((row) => ({ row, source }));
    for (const { row } of auditRows) {
      const date = cellFor(row, ["date", "date utc"]) ?? "";
      const project = cellFor(row, ["project"]) ?? source.defaultProject;
      const scope = cellFor(row, ["scope"]) ?? "";
      const overall = cellFor(row, ["overall"]) ?? "";
      const issues = cellFor(row, ["issues"]) ?? "";
      if (!date || !overall || !issues) {
        continue;
      }

      const key = auditDedupeKey(project ?? "", undefined, date, overall, scope, row.context ?? "");
      if (!registerDedupe(seen, key, "audit", source.redactedSourcePath, row.lineNumber, "legacy", diagnostics)) {
        continue;
      }

      const traffic = trafficFromAudit(overall, issues);
      const projectPrefix = project ? `[${project}] ` : "";
      const detail = [date, scope, `${overall} — ${issues}`].filter(Boolean).join(" — ");
      lines.push(cleanInlineMarkdown(`${traffic} ${projectPrefix}${detail}`));
    }
  };

  for (const source of sources) {
    collectCanonicalAudits(source);
  }
  for (const source of sources) {
    collectLegacyAudits(source);
  }

  return lines.length ? { label: "Audits", lines: lines.slice(0, max) } : topLines("Audits", sources.map((source) => source.content).join("\n"), max);
}

function trafficFromAudit(overall: string | undefined, issues: string | undefined): string {
  const normalizedOverall = (overall ?? "").trim().toUpperCase();
  const grade = [...normalizedOverall.matchAll(/[A-F]/g)].at(-1)?.[0];
  if (grade === "A" || grade === "B") {
    return "🟢";
  }
  if (grade === "C") {
    return "🟠";
  }
  if (grade === "D" || grade === "F") {
    return "🔴";
  }

  const counts = (issues ?? "")
    .match(/\d+/g)
    ?.slice(0, 3)
    .map((count) => Number.parseInt(count, 10)) ?? [];
  if ((counts[0] ?? 0) > 0) {
    return "🔴";
  }
  if ((counts[1] ?? 0) > 0) {
    return "🟠";
  }
  if ((counts[2] ?? 0) > 0) {
    return "🟡";
  }
  return "🟢";
}

export async function readDashboardData(config: ReaderConfig): Promise<DashboardData> {
  const diagnostics: Diagnostic[] = [];
  const discoveryDepth = config.projectDiscoveryDepth ?? DEFAULT_PROJECT_DISCOVERY_DEPTH;
  const directoryEntriesLimit = config.projectDiscoveryDirectoryEntriesLimit ?? DEFAULT_PROJECT_DISCOVERY_DIRECTORY_ENTRIES_LIMIT;
  const maxProjects = config.projectDiscoveryMaxProjects ?? DEFAULT_PROJECT_DISCOVERY_MAX_PROJECTS;
  const workspaceRoots = config.workspaceRoots ? config.workspaceRoots.filter(Boolean) : [];
  const skillsRoot = path.join(config.shipflowRepoRoot, "skills");
  const policy = new SourcePolicy({
    roots: [config.projectRoot, ...workspaceRoots, config.shipflowRepoRoot]
  });

  const read = async (filePath: string) => {
    const result = await policy.safeRead(filePath);
    if (!result.ok && result.diagnostic) {
      diagnostics.push(result.diagnostic);
    }
    return result;
  };
  const readOptional = async (filePath: string) => policy.safeRead(filePath);
  const readFirstExisting = async (filePaths: string[], reportMissing = false): Promise<SourceReadResult | undefined> => {
    for (const filePath of filePaths) {
      const result = await policy.safeRead(filePath);
      if (result.ok) {
        return result;
      }
      if (reportMissing && result.diagnostic) {
        diagnostics.push(result.diagnostic);
      }
    }
    return undefined;
  };
  const summarizeTopLines = (label: string, values: string[], max = 12): TextSummary =>
    values.length ? { label, lines: values.slice(0, max) } : topLines(label, "", max);

  const discoveredProjects = await discoverLocalProjects({
    projectRoot: config.projectRoot,
    workspaceRoots,
    policy,
    discoveryDepth,
    directoryEntriesLimit,
    maxProjects,
    diagnostics
  });

  const normalizedNameCount = new Map<string, number>();
  for (const candidate of discoveredProjects) {
    const count = normalizedNameCount.get(normalizedProjectKey(candidate.name)) ?? 0;
    normalizedNameCount.set(normalizedProjectKey(candidate.name), count + 1);
  }
  for (const [normalized, count] of normalizedNameCount.entries()) {
    if (count > 1) {
      const duplicateCandidates = discoveredProjects.filter((candidate) => normalizedProjectKey(candidate.name) === normalized);
      for (const duplicate of duplicateCandidates.slice(1)) {
        diagnostics.push({
          code: "PROJECT_NAME_DUPLICATE",
          severity: "warning",
          source: policy.redactPath(duplicate.path),
          message: `Duplicate project name "${duplicate.name}" detected; keeping separate entries by path`
        });
      }
    }
  }

  const projects = disambiguateProjectNames(discoveredProjects).map((project) => ({
    name: project.name,
    path: project.path ?? config.projectRoot,
    stack: project.stack ?? undefined,
    source: project.source
  }));

  const localAgentResult = await readOptional(path.join(config.projectRoot, "AGENT.md"));
  const localClaudeResult = localAgentResult.ok
    ? undefined
    : await readOptional(path.join(config.projectRoot, "CLAUDE.md"));
  const localProjectFallbackName =
    projectNameFromMetadata(localAgentResult.ok ? localAgentResult.content : undefined) ??
    projectNameFromMetadata(localClaudeResult?.ok ? localClaudeResult.content : undefined) ??
    path.basename(config.projectRoot);
    if (!projects.some((project) => normalizedProjectKey(project.path) === normalizedProjectKey(config.projectRoot))) {
    projects.push({
      name: localProjectFallbackName,
      path: config.projectRoot,
      stack: undefined,
      source: localAgentResult.ok ? localAgentResult.realPath ?? "AGENT.md" : config.projectRoot
    });
  }

  const dedupedProjects: Array<{ name: string; path: string; stack: string | undefined; source: string }> = [];
  const seenProjectPaths = new Set<string>();
  for (const project of projects) {
    const projectPath = project.path ?? config.projectRoot;
    const normalizedPath = path.resolve(projectPath).toLowerCase();
    if (seenProjectPaths.has(normalizedPath)) {
      continue;
    }
    seenProjectPaths.add(normalizedPath);
    dedupedProjects.push(project);
  }
  projects.splice(0, projects.length, ...dedupedProjects);

  const specs: SpecItem[] = [];
  const seenSpecs = new Map<string, DedupEntry>();
  for (const project of projects) {
    const projectPath = project.path ?? config.projectRoot;
    const specsRoot = path.join(projectPath, "shipflow_data/workflow/specs");
    try {
      const entries = await readdir(specsRoot, { withFileTypes: true });
      for (const entry of entries) {
        if (!entry.isFile() || !entry.name.endsWith(".md")) {
          continue;
        }
        const specPath = path.join(specsRoot, entry.name);
        const specResult = await read(specPath);
        if (!specResult.ok || !specResult.content) {
          continue;
        }
        const spec = parseSpecs(specResult.content, specPath, diagnostics);
        const specPathForDedupe = spec.path;
        const dedupeKey = specDedupeKey(spec.project ?? "", undefined, specPathForDedupe, spec.title);
        if (!registerDedupe(seenSpecs, dedupeKey, "spec", policy.redactPath(specPath), 1, "canonical", diagnostics)) {
          continue;
        }
        specs.push(spec);
      }
    } catch {
      diagnostics.push({
        code: "SPECS_DIR_UNREADABLE",
        severity: "warning",
        message: "Specs directory missing or unreadable",
        source: policy.redactPath(specsRoot)
      });
    }
  }

  const skills: string[] = [];
  try {
    const entries = await readdir(skillsRoot, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory() && !entry.name.startsWith(".")) {
        skills.push(entry.name);
      }
    }
  } catch {
    diagnostics.push({
      code: "SKILLS_DIR_UNREADABLE",
      severity: "warning",
      message: "Skills directory missing or unreadable",
      source: policy.redactPath(skillsRoot)
    });
  }

  const taskSources: TaskSource[] = [];
  for (const project of projects) {
    const projectPath = project.path ?? config.projectRoot;
    const fallback = await readFirstExisting([
      path.join(projectPath, "shipflow_data/workflow/TASKS.md"),
      path.join(projectPath, "shipflow_data/TASKS.md")
    ]);
    if (!fallback?.ok || !fallback.content) {
      continue;
    }
    const sourcePath = fallback.realPath ?? path.join(projectPath, "shipflow_data/workflow/TASKS.md");
    taskSources.push({
      content: fallback.content,
      defaultProject: project.name,
      sourcePath,
      redactedSourcePath: policy.redactPath(sourcePath)
    });
  }

  const auditSources: TaskSource[] = [];
  for (const project of projects) {
    const projectPath = project.path ?? config.projectRoot;
    const fallback = await readFirstExisting([
      path.join(projectPath, "shipflow_data/workflow/AUDIT_LOG.md"),
      path.join(projectPath, "shipflow_data/AUDIT_LOG.md")
    ]);
    if (!fallback?.ok || !fallback.content) {
      continue;
    }
    const sourcePath = fallback.realPath ?? path.join(projectPath, "shipflow_data/workflow/AUDIT_LOG.md");
    auditSources.push({
      content: fallback.content,
      defaultProject: project.name,
      sourcePath,
      redactedSourcePath: policy.redactPath(sourcePath)
    });
  }

  const operationLines: string[] = [];
  const dependencyLines: string[] = [];
  for (const project of projects) {
    const projectPath = project.path ?? config.projectRoot;
    const ops = await readFirstExisting([
      path.join(projectPath, "shipflow_data/workflow/OPERATIONS_LOG.md"),
      path.join(projectPath, "shipflow_data/OPERATIONS_LOG.md")
    ]);
    if (ops?.ok && ops.content) {
      operationLines.push(...ops.content.split("\n").map((line) => line.trim()).filter(Boolean));
    }
    const deps = await readFirstExisting([
      path.join(projectPath, "shipflow_data/workflow/DEPENDENCY_LOG.md"),
      path.join(projectPath, "shipflow_data/DEPENDENCY_LOG.md")
    ]);
    if (deps?.ok && deps.content) {
      dependencyLines.push(...deps.content.split("\n").map((line) => line.trim()).filter(Boolean));
    }
  }

  const taskLines = summarizeTasks(taskSources, diagnostics);
  const auditLines = summarizeAudits(auditSources, diagnostics);

  const opsLines = summarizeTopLines("Operations", operationLines);
  const depLines = summarizeTopLines("Dependencies", dependencyLines);

  return {
    projects,
    specs,
    tasks: taskLines,
    audits: auditLines,
    operations: opsLines,
    dependencies: depLines,
    skills: topLines("Skills", skills.join("\n")),
    diagnostics
  };
}
