import { describe, expect, it } from "bun:test";
import { mkdir, mkdtemp, writeFile, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { readDashboardData } from "../src/sources/readers.ts";
import {
  buildDashboardViewModel,
  DEFAULT_DASHBOARD_VIEW_STATE,
  reduceDashboardViewState
} from "../src/viewModels/dashboard.ts";

async function makeProjectFixture(baseDir: string, projectName: string): Promise<string> {
  const projectRoot = path.join(baseDir, projectName);
  await mkdir(path.join(projectRoot, "shipflow_data/workflow/specs"), { recursive: true });
  await writeFile(path.join(projectRoot, "AGENT.md"), `---\nproject: ${projectName}\n---\n`, "utf8");
  return projectRoot;
}

describe("readDashboardData", () => {
  it("reads local project corpora and specs from discovered projects", async () => {
    const appRoot = await mkdtemp(path.join(tmpdir(), "sf-tui-app-"));
    const projectRoot = await makeProjectFixture(appRoot, "shipflow_app");
    const shipflowRepo = path.join(appRoot, "shipflow");

    await writeFile(
      path.join(projectRoot, "shipflow_data/workflow/TASKS.md"),
      [
        "🔴 [shipflow_app] task: Review local task reader | status: todo | area: shipflow_app",
        ""
      ].join("\n"),
      "utf8"
    );
    await writeFile(
      path.join(projectRoot, "shipflow_data/workflow/AUDIT_LOG.md"),
      [
        "🟢 [shipflow_app] audit: Local audit scope | date: 2026-05-21 | overall: B | issues: 0/0/0 | scope: reader",
        ""
      ].join("\n"),
      "utf8"
    );
    await writeFile(
      path.join(projectRoot, "shipflow_data/workflow/specs/demo.md"),
      [
        "status: ready",
        "project: shipflow_app",
        "user_story: \"check local discovery\"",
        "next_step: \"run tui\"",
        "",
        "# Title",
        "",
        "Local Discovery Spec",
        "",
        "# Skill Run History",
        "",
        "| Date UTC | Skill | Model | Action | Result | Next step |",
        "|----------|-------|-------|--------|--------|-----------|",
        "| 2026-05-17 00:00:00 UTC | sf-ready | GPT-5 | checked | ready | /sf-start |",
        "",
        "# Current Chantier Flow",
        "",
        "| Phase | Status | Evidence | Next step |",
        "|-------|--------|----------|-----------|",
        "| sf-start | done | implemented | /sf-verify |"
      ].join("\n"),
      "utf8"
    );

    await mkdir(path.join(shipflowRepo, "skills/sf-spec"), { recursive: true });

    const data = await readDashboardData({
      projectRoot,
      workspaceRoots: [appRoot],
      shipflowRepoRoot: shipflowRepo
    });

    expect(data.projects.map((project) => project.name)).toContain("shipflow_app");
    expect(data.projects.length).toBe(1);
    expect(data.specs).toHaveLength(1);
    expect(data.specs[0]?.title).toBe("Local Discovery Spec");
    expect(data.specs[0]?.path).toContain("shipflow_data/workflow/specs/demo.md");
    expect(data.tasks.lines[0]).toContain("Review local task reader");
    expect(data.audits.lines[0]).toContain("reader");
    expect(data.skills.lines).toContain("sf-spec");
    expect(data.diagnostics).toHaveLength(0);
  });

  it("summarizes task and audit table entries from local project tables", async () => {
    const appRoot = await mkdtemp(path.join(tmpdir(), "sf-tui-app-"));
    const projectRoot = await makeProjectFixture(appRoot, "shipflow_app");

    await writeFile(
      path.join(projectRoot, "shipflow_data/workflow/TASKS.md"),
      [
        "# Tasks",
        "",
        "## Current Active Backlog",
        "",
        "| Pri | Task | Status |",
        "| --- | --- | --- |",
        "| 🔴 | Fix activity parsing | 📋 todo |",
        "| ✅ | Old completed task | ✅ done |",
        "",
        "## onboarding",
        "",
        "| Pri | Task | Status |",
        "| --- | --- | --- |",
        "| 🟠 | Align project prefixes | 📋 todo |",
        "",
        "# Legacy Tasks",
        "",
        "| Pri | Task | Status |",
        "| --- | --- | --- |",
        "| 🔴 | Legacy task should stay hidden | 📋 todo |"
      ].join("\n"),
      "utf8"
    );

    await writeFile(
      path.join(projectRoot, "shipflow_data/workflow/AUDIT_LOG.md"),
      [
        "# Audit Log",
        "",
        "| Date | Scope | Overall | Issues |",
        "| ---- | ----- | ------- | ------ |",
        "| 2026-05-19 | old audit | C | 1/1/1 |",
        "| 2026-05-20 | recent audit | B | 0/1/2 |",
        ""
      ].join("\n"),
      "utf8"
    );

    const data = await readDashboardData({
      projectRoot,
      workspaceRoots: [appRoot],
      shipflowRepoRoot: appRoot
    });

    expect(data.tasks.lines[0]).toContain("🔴 [shipflow_app] Fix activity parsing");
    expect(data.tasks.lines[0]?.startsWith("🔴")).toBe(true);
    expect(data.tasks.lines.every((line) => /^[🔴🟠🟡🟢]/u.test(line))).toBe(true);
    expect(data.tasks.lines).not.toContain("Legacy task should stay hidden");
    expect(data.audits.lines[0]).toContain("2026-05-20");
    expect(data.audits.lines[0]?.startsWith("🟢")).toBe(true);
  });

  it("prefers canonical task/audit lines and removes canonical/legacy duplicates", async () => {
    const appRoot = await mkdtemp(path.join(tmpdir(), "sf-tui-app-"));
    const projectRoot = await makeProjectFixture(appRoot, "shipflow_app");

    await writeFile(
      path.join(projectRoot, "shipflow_data/workflow/TASKS.md"),
      [
        "🔴 [shipflow_app] task: Replace canonical parser in TUI | status: todo | area: shipflow_app",
        "",
        "# Tasks",
        "",
        "## shipflow_app",
        "",
        "| Pri | Task | Status |",
        "| --- | --- | --- |",
        "| 🟢 | Replace canonical parser in TUI | ✅ done |",
        ""
      ].join("\n"),
      "utf8"
    );
    await writeFile(
      path.join(projectRoot, "shipflow_data/workflow/AUDIT_LOG.md"),
      [
        "🟠 [shipflow_app] audit: Dependency scan | date: 2026-05-21 | scope: parser | overall: C | issues: 1/0/0",
        "",
        "# Audit Log",
        "",
        "| Date | Scope | Overall | Issues |",
        "| ---- | ----- | ------- | ------ |",
        "| 2026-05-21 | parser | C | 1/0/0 |",
        "| 2026-05-20 | old scope | B | 0/1/2 |"
      ].join("\n"),
      "utf8"
    );

    const data = await readDashboardData({
      projectRoot,
      workspaceRoots: [appRoot],
      shipflowRepoRoot: appRoot
    });

    expect(data.tasks.lines[0]).toContain("🔴 [shipflow_app] Replace canonical parser in TUI — todo");
    expect(data.audits.lines.some((line) => line.includes("🟠 [shipflow_app] 2026-05-21 — parser — C — 1/0/0"))).toBe(true);
    expect(data.audits.lines.some((line) => line.includes("| 2026-05-21 | parser | C | 1/0/0 |"))).toBe(false);
  });

  it("reads canonical spec summary fields and keeps canonical precedence", async () => {
    const appRoot = await mkdtemp(path.join(tmpdir(), "sf-tui-app-"));
    const projectRoot = await makeProjectFixture(appRoot, "shipflow_app");

    await writeFile(
      path.join(projectRoot, "shipflow_data/workflow/specs/spec-canonical.md"),
      [
        "status: draft",
        "project: shipflow_app",
        "user_story: \"read canonical first\"",
        "next_step: \"legacy step\"",
        "",
        "# Spec: Canonical Spec",
        "",
        "🟢 [shipflow_app] spec: Canonical Spec | status: ready | path: shipflow_data/workflow/specs/spec-canonical.md | next: /sf-ready Canonical Spec",
        "",
        "# Current Chantier Flow",
        "",
        "| Phase | Status | Evidence | Next step |",
        "|-------|--------|----------|-----------|",
        "| sf-ready | done | canonical parser | /sf-ready |"
      ].join("\n"),
      "utf8"
    );

    const data = await readDashboardData({
      projectRoot,
      workspaceRoots: [appRoot],
      shipflowRepoRoot: appRoot
    });

    expect(data.specs).toHaveLength(1);
    expect(data.specs[0]?.title).toBe("Canonical Spec");
    expect(data.specs[0]?.status).toBe("ready");
    expect(data.specs[0]?.nextStep).toBe("/sf-ready Canonical Spec");
    expect(data.specs[0]?.path).toBe("shipflow_data/workflow/specs/spec-canonical.md");
    expect(data.specs[0]?.project).toBe("shipflow_app");
  });

  it("preserves filtering on canonical task/audit/spec project prefixes across discovered projects", async () => {
    const appRoot = await mkdtemp(path.join(tmpdir(), "sf-tui-app-"));
    const primaryRoot = await makeProjectFixture(appRoot, "shipflow_app");
    const betaRoot = await makeProjectFixture(appRoot, "beta");

    await writeFile(
      path.join(primaryRoot, "shipflow_data/workflow/TASKS.md"),
      "🔴 [shipflow_app] task: shipflow task | status: todo | area: alpha\n",
      "utf8"
    );
    await writeFile(
      path.join(betaRoot, "shipflow_data/workflow/TASKS.md"),
      "🟢 [beta] task: beta task | status: todo | area: beta\n",
      "utf8"
    );

    await writeFile(
      path.join(primaryRoot, "shipflow_data/workflow/AUDIT_LOG.md"),
      "🟠 [shipflow_app] audit: shipflow scope | date: 2026-05-21 | overall: C | issues: 1/0/0 | scope: shipflow\n",
      "utf8"
    );
    await writeFile(
      path.join(betaRoot, "shipflow_data/workflow/AUDIT_LOG.md"),
      "🟢 [beta] audit: beta scope | date: 2026-05-21 | overall: B | issues: 0/0/0 | scope: beta\n",
      "utf8"
    );

    await writeFile(
      path.join(primaryRoot, "shipflow_data/workflow/specs/shipflow.md"),
      [
        "status: ready",
        "project: shipflow_app",
        "# Title",
        "ShipFlow Spec"
      ].join("\n"),
      "utf8"
    );
    await writeFile(
      path.join(betaRoot, "shipflow_data/workflow/specs/beta.md"),
      [
        "status: draft",
        "project: beta",
        "# Title",
        "Beta Spec"
      ].join("\n"),
      "utf8"
    );

    const data = await readDashboardData({
      projectRoot: primaryRoot,
      workspaceRoots: [appRoot],
      shipflowRepoRoot: appRoot
    });

    const filteredState = "shipflow_app".split("").reduce(
      (state, letter) => reduceDashboardViewState(data, state, { name: letter, sequence: letter }),
      DEFAULT_DASHBOARD_VIEW_STATE
    );
    const activityState = reduceDashboardViewState(data, filteredState, { name: "tab", sequence: "\t" });
    const auditsState = reduceDashboardViewState(data, activityState, { name: "tab", sequence: "\t" });
    const vm = buildDashboardViewModel(data, auditsState);

    expect(vm.activityLines.join("\n")).toContain("[shipflow_app] shipflow task");
    expect(vm.activityLines.join("\n")).not.toContain("beta task");
    expect(vm.auditsLines.join("\n")).toContain("[shipflow_app]");
    expect(vm.auditsLines.join("\n")).not.toContain("beta");
    expect(vm.specLines.join("\n")).toContain("ShipFlow Spec");
    expect(vm.specLines.join("\n")).not.toContain("Beta Spec");
  });

  it("discovers multiple projects and ignores symlinked non-directories", async () => {
    const appRoot = await mkdtemp(path.join(tmpdir(), "sf-tui-app-"));
    const realProject = await makeProjectFixture(appRoot, "shipflow_app");
    const realSibling = await makeProjectFixture(appRoot, "beta");

    await writeFile(path.join(realProject, "shipflow_data/workflow/TASKS.md"), "🔴 [shipflow_app] task: base\n", "utf8");
    await writeFile(path.join(realSibling, "shipflow_data/workflow/TASKS.md"), "🟢 [beta] task: beta\n", "utf8");

    const symlinkTarget = path.join(appRoot, "symlinked");
    await symlink(realProject, symlinkTarget);

    const data = await readDashboardData({
      projectRoot: realProject,
      workspaceRoots: [appRoot],
      shipflowRepoRoot: appRoot
    });

    expect(data.projects.map((project) => project.name).sort()).toEqual(["beta", "shipflow_app"]);
    expect(data.tasks.lines.some((line) => line.includes("symlink"))).toBe(false);
  });

  it("skips oversized discovery directories and records diagnostics", async () => {
    const appRoot = await mkdtemp(path.join(tmpdir(), "sf-tui-app-"));
    const projectRoot = await makeProjectFixture(appRoot, "shipflow_app");
    const noisyDir = path.join(appRoot, "noisy");
    await mkdir(noisyDir, { recursive: true });
    await Promise.all([
      writeFile(path.join(noisyDir, "a.md"), "", "utf8"),
      writeFile(path.join(noisyDir, "b.md"), "", "utf8"),
      writeFile(path.join(noisyDir, "c.md"), "", "utf8")
    ]);

    const data = await readDashboardData({
      projectRoot,
      workspaceRoots: [appRoot],
      shipflowRepoRoot: appRoot,
      projectDiscoveryDirectoryEntriesLimit: 2
    });

    expect(data.projects.some((project) => project.name === "shipflow_app")).toBe(true);
    expect(data.diagnostics.some((diagnostic) => diagnostic.code === "PROJECT_DISCOVERY_DIR_TOO_LARGE")).toBe(true);
  });
});
