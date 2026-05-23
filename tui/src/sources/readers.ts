import { readdir } from "node:fs/promises";
import path from "node:path";
import { SourcePolicy } from "./sourcePolicy.ts";
import type { DashboardData, Diagnostic, ProjectItem, SpecItem, TextSummary } from "../types/models.ts";

export interface ReaderConfig {
  projectRoot: string;
  shipflowDataRoot: string;
  shipflowRepoRoot: string;
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

function parseProjects(content: string, source: string): ProjectItem[] {
  const projectsFromBullets = content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => ({ name: line.replace(/^-\s+/, ""), source }));

  const projectsFromRegistryTable: ProjectItem[] = [];
  let inRegistry = false;
  for (const rawLine of content.split("\n")) {
    const line = rawLine.trim();
    if (line.startsWith("## ")) {
      inRegistry = line.toLowerCase() === "## project registry";
      continue;
    }
    if (!inRegistry || !line.startsWith("|")) {
      continue;
    }
    const cells = line.split("|").map((cell) => cell.trim()).filter(Boolean);
    const [name, projectPath, stack] = cells;
    if (!name || name.toLowerCase() === "name" || /^-+$/.test(name)) {
      continue;
    }
    projectsFromRegistryTable.push({ name, path: projectPath, stack, source });
  }

  return projectsFromRegistryTable.length ? projectsFromRegistryTable : projectsFromBullets;
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

function projectNameFromMetadata(content: string | undefined): string | undefined {
  return content?.match(/^project:\s*"?(.+?)"?$/m)?.[1]?.trim().replace(/^["']|["']$/g, "");
}

export async function readDashboardData(config: ReaderConfig): Promise<DashboardData> {
  const diagnostics: Diagnostic[] = [];
  const policy = new SourcePolicy({
    roots: [config.projectRoot, config.shipflowDataRoot, config.shipflowRepoRoot]
  });

  const read = async (filePath: string) => {
    const result = await policy.safeRead(filePath);
    if (!result.ok && result.diagnostic) {
      diagnostics.push(result.diagnostic);
    }
    return result;
  };
  const readOptional = async (filePath: string) => policy.safeRead(filePath);

  const projectsResult = await read(path.join(config.shipflowDataRoot, "PROJECTS.md"));
  const localAgentResult = await readOptional(path.join(config.projectRoot, "AGENT.md"));
  const localClaudeResult = localAgentResult.ok
    ? undefined
    : await readOptional(path.join(config.projectRoot, "CLAUDE.md"));
  const masterTasksResult = await read(path.join(config.shipflowDataRoot, "TASKS.md"));
  const localTasksResult = await read(path.join(config.projectRoot, "shipflow_data/workflow/TASKS.md"));
  const masterAuditsResult = await read(path.join(config.shipflowDataRoot, "AUDIT_LOG.md"));
  const localAuditsResult = await read(path.join(config.projectRoot, "shipflow_data/workflow/AUDIT_LOG.md"));
  const opsResult = await read(path.join(config.shipflowDataRoot, "OPERATIONS_LOG.md"));
  const depsResult = await read(path.join(config.shipflowDataRoot, "DEPENDENCY_LOG.md"));
  const skillsRoot = path.join(config.shipflowRepoRoot, "skills");

  const projects = projectsResult.ok && projectsResult.content
    ? parseProjects(projectsResult.content, projectsResult.realPath ?? "PROJECTS.md")
    : [];
  const localProjectName =
    projectNameFromMetadata(localAgentResult.ok ? localAgentResult.content : undefined) ??
    projectNameFromMetadata(localClaudeResult?.ok ? localClaudeResult.content : undefined) ??
    path.basename(config.projectRoot);
  if (!projects.some((project) =>
    normalizedProjectKey(project.name) === normalizedProjectKey(localProjectName) ||
    normalizedProjectKey(project.path) === normalizedProjectKey(config.projectRoot)
  )) {
    projects.push({
      name: localProjectName,
      path: config.projectRoot,
      source: localAgentResult.ok ? localAgentResult.realPath ?? "AGENT.md" : config.projectRoot
    });
  }

  const specs: SpecItem[] = [];
  const specsRoot = path.join(config.projectRoot, "shipflow_data/workflow/specs");
  const seenSpecs = new Map<string, DedupEntry>();
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

  const taskSources: TaskSource[] = [
    localTasksResult.ok && localTasksResult.content
      ? {
          content: localTasksResult.content,
          defaultProject: localProjectName,
          sourcePath: localTasksResult.realPath ?? path.join(config.projectRoot, "shipflow_data/workflow/TASKS.md"),
          redactedSourcePath: policy.redactPath(localTasksResult.realPath ?? path.join(config.projectRoot, "shipflow_data/workflow/TASKS.md"))
        }
      : undefined,
    masterTasksResult.ok && masterTasksResult.content
      ? {
          content: masterTasksResult.content,
          sourcePath: masterTasksResult.realPath ?? path.join(config.shipflowDataRoot, "TASKS.md"),
          redactedSourcePath: policy.redactPath(masterTasksResult.realPath ?? path.join(config.shipflowDataRoot, "TASKS.md"))
        }
      : undefined
  ].filter((source): source is TaskSource => Boolean(source?.content));

  const auditSources: TaskSource[] = [
    localAuditsResult.ok && localAuditsResult.content
      ? {
          content: localAuditsResult.content,
          defaultProject: localProjectName,
          sourcePath: localAuditsResult.realPath ?? path.join(config.projectRoot, "shipflow_data/workflow/AUDIT_LOG.md"),
          redactedSourcePath: policy.redactPath(localAuditsResult.realPath ?? path.join(config.projectRoot, "shipflow_data/workflow/AUDIT_LOG.md"))
        }
      : undefined,
    masterAuditsResult.ok && masterAuditsResult.content
      ? {
          content: masterAuditsResult.content,
          sourcePath: masterAuditsResult.realPath ?? path.join(config.shipflowDataRoot, "AUDIT_LOG.md"),
          redactedSourcePath: policy.redactPath(masterAuditsResult.realPath ?? path.join(config.shipflowDataRoot, "AUDIT_LOG.md"))
        }
      : undefined
  ].filter((source): source is TaskSource => Boolean(source?.content));

  return {
    projects,
    specs,
    tasks: summarizeTasks(taskSources, diagnostics),
    audits: summarizeAudits(auditSources, diagnostics),
    operations: topLines("Operations", opsResult.ok ? opsResult.content ?? "" : ""),
    dependencies: topLines("Dependencies", depsResult.ok ? depsResult.content ?? "" : ""),
    skills: topLines("Skills", skills.join("\n")),
    diagnostics
  };
}
