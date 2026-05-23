import { describe, expect, it } from "bun:test";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { readDashboardData } from "../src/sources/readers.ts";
import {
  buildDashboardViewModel,
  DEFAULT_DASHBOARD_VIEW_STATE,
  reduceDashboardViewState
} from "../src/viewModels/dashboard.ts";

describe("readDashboardData", () => {
  it("reads core files and specs", async () => {
    const appRoot = await mkdtemp(path.join(tmpdir(), "sf-tui-app-"));
    const projectRoot = path.join(appRoot, "app");
    const shipflowData = path.join(appRoot, "shipflow_data");
    const shipflowRepo = path.join(appRoot, "shipflow");

    await mkdir(path.join(projectRoot, "shipflow_data/workflow/specs"), { recursive: true });
    await mkdir(path.join(projectRoot, "shipflow_data/workflow"), { recursive: true });
    await mkdir(shipflowData, { recursive: true });
    await mkdir(path.join(shipflowRepo, "skills/sf-spec"), { recursive: true });

    await writeFile(
      path.join(shipflowData, "PROJECTS.md"),
      "# Projects Registry\n\n## Project Registry\n\n| Name | Path | Stack |\n| --- | --- | --- |\n| alpha | /tmp/alpha | Astro |\n| beta | /tmp/beta | Flutter |\n\n## Domain Applicability\n\n| Project | Code |\n| --- | --- |\n| alpha | yes |\n",
      "utf8"
    );
    await writeFile(path.join(shipflowData, "TASKS.md"), "task a\ntask b\n", "utf8");
    await writeFile(path.join(shipflowData, "AUDIT_LOG.md"), "audit a\n", "utf8");
    await writeFile(path.join(shipflowData, "OPERATIONS_LOG.md"), "op a\n", "utf8");
    await writeFile(path.join(shipflowData, "DEPENDENCY_LOG.md"), "dep a\n", "utf8");
    await writeFile(path.join(projectRoot, "AGENT.md"), "---\nproject: shipflow_app\n---\n", "utf8");
    await writeFile(path.join(projectRoot, "shipflow_data/workflow/TASKS.md"), "local task\n", "utf8");
    await writeFile(path.join(projectRoot, "shipflow_data/workflow/AUDIT_LOG.md"), "local audit\n", "utf8");
    await writeFile(path.join(shipflowRepo, "skills/sf-spec/SKILL.md"), "name: sf-spec\n", "utf8");

    await writeFile(
      path.join(projectRoot, "shipflow_data/workflow/specs/demo.md"),
      [
        "status: ready",
        "project: alpha",
        "user_story: \"story\"",
        "next_step: \"step\"",
        "",
        "# Title",
        "",
        "Demo Spec",
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
        "| sf-start | done | implemented | /sf-verify |",
        ""
      ].join("\n"),
      "utf8"
    );

    const data = await readDashboardData({
      projectRoot,
      shipflowDataRoot: shipflowData,
      shipflowRepoRoot: shipflowRepo
    });

    expect(data.projects.length).toBe(3);
    expect(data.projects.map((project) => project.name)).toContain("shipflow_app");
    expect(data.specs.length).toBe(1);
    expect(data.specs[0]?.project).toBe("alpha");
    expect(data.specs[0]?.title).toBe("Demo Spec");
    expect(data.specs[0]?.runHistorySummary[0]).toContain("sf-ready");
    expect(data.specs[0]?.chantierFlowSummary[0]).toContain("sf-start=done");
    expect(data.tasks.lines).toContain("local task");
    expect(data.audits.lines).toContain("local audit");
    expect(data.skills.lines).toContain("sf-spec");
    expect(data.diagnostics.length).toBe(0);
  });

  it("summarizes task and audit table entries instead of markdown headings", async () => {
    const appRoot = await mkdtemp(path.join(tmpdir(), "sf-tui-app-"));
    const projectRoot = path.join(appRoot, "app");
    const shipflowData = path.join(appRoot, "shipflow_data");
    const shipflowRepo = path.join(appRoot, "shipflow");

    await mkdir(path.join(projectRoot, "shipflow_data/workflow/specs"), { recursive: true });
    await mkdir(path.join(projectRoot, "shipflow_data/workflow"), { recursive: true });
    await mkdir(shipflowData, { recursive: true });
    await mkdir(path.join(shipflowRepo, "skills"), { recursive: true });

    await writeFile(path.join(shipflowData, "PROJECTS.md"), "", "utf8");
    await writeFile(path.join(shipflowData, "OPERATIONS_LOG.md"), "", "utf8");
    await writeFile(path.join(shipflowData, "DEPENDENCY_LOG.md"), "", "utf8");
    await writeFile(path.join(projectRoot, "AGENT.md"), "---\nproject: shipflow_app\n---\n", "utf8");
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
        "| 🔴 | Legacy task should stay hidden | 📋 todo |",
        ""
      ].join("\n"),
      "utf8"
    );
    await writeFile(
      path.join(shipflowData, "TASKS.md"),
      [
        "# ShipFlow — Master Tasks",
        "",
        "## Dashboard",
        "",
        "| Project | Status | Top Priority |",
        "|---------|--------|--------------|",
        "| ShipFlow | 🔄 in progress | Harden installer |",
        "| shipflow_app | 🔄 in progress | Preserve project underscores |",
        "",
        "## replayglowz",
        "",
        "| Pri | Task | Status |",
        "| --- | --- | --- |",
        "| 🟡 | Keep worker checks visible | 📋 todo |",
        ""
      ].join("\n"),
      "utf8"
    );
    await writeFile(
      path.join(projectRoot, "shipflow_data/workflow/AUDIT_LOG.md"),
      [
        "# Audit Log",
        "",
        "> Intro should not be rendered as an audit entry.",
        "",
        "| Date | Scope | Overall | Issues |",
        "| ---- | ----- | ------- | ------ |",
        "| 2026-05-19 | old audit | C | 1/1/1 |",
        "| 2026-05-20 | recent audit | B | 0/1/2 |",
        ""
      ].join("\n"),
      "utf8"
    );
    await writeFile(path.join(shipflowData, "AUDIT_LOG.md"), "# Audit Log\n\nNo rows\n", "utf8");

    const data = await readDashboardData({
      projectRoot,
      shipflowDataRoot: shipflowData,
      shipflowRepoRoot: shipflowRepo
    });

    expect(data.tasks.lines[0]).toContain("🔴 [shipflow_app] Fix activity parsing");
    expect(data.tasks.lines[0]?.startsWith("🔴")).toBe(true);
    expect(data.tasks.lines[0]).not.toContain("# Tasks");
    expect(data.tasks.lines.some((line) => line.includes("🟠 [onboarding] Align project prefixes"))).toBe(true);
    expect(data.tasks.lines.some((line) => line.includes("Legacy task should stay hidden"))).toBe(false);
    expect(data.tasks.lines.some((line) => line.includes("Harden installer"))).toBe(true);
    expect(data.tasks.lines.some((line) => line.includes("[shipflow_app]"))).toBe(true);
    expect(data.tasks.lines.some((line) => line.includes("🟡 [replayglowz] Keep worker checks visible"))).toBe(true);
    expect(data.tasks.lines.every((line) => /^[🔴🟠🟡🟢]/u.test(line))).toBe(true);
    expect(data.audits.lines[0]).toContain("2026-05-20");
    expect(data.audits.lines[0]?.startsWith("🟢")).toBe(true);
    expect(data.audits.lines[0]).toContain("shipflow_app");
    expect(data.audits.lines[0]).toContain("recent audit");
    expect(data.audits.lines[0]).not.toContain("Intro should not be rendered");
  });

  it("prefers canonical task/audit lines and removes canonical/legacy duplicates", async () => {
    const appRoot = await mkdtemp(path.join(tmpdir(), "sf-tui-app-"));
    const projectRoot = path.join(appRoot, "app");
    const shipflowData = path.join(appRoot, "shipflow_data");
    const shipflowRepo = path.join(appRoot, "shipflow");

    await mkdir(path.join(projectRoot, "shipflow_data/workflow/specs"), { recursive: true });
    await mkdir(path.join(projectRoot, "shipflow_data/workflow"), { recursive: true });
    await mkdir(shipflowData, { recursive: true });
    await mkdir(path.join(shipflowRepo, "skills"), { recursive: true });

    await writeFile(path.join(shipflowData, "PROJECTS.md"), "", "utf8");
    await writeFile(path.join(shipflowData, "OPERATIONS_LOG.md"), "", "utf8");
    await writeFile(path.join(shipflowData, "DEPENDENCY_LOG.md"), "", "utf8");
    await writeFile(path.join(projectRoot, "AGENT.md"), "---\nproject: shipflow_app\n---\n", "utf8");
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
        "| 🟢 | Keep local legacy task | ✅ done |",
        ""
      ].join("\n"),
      "utf8"
    );
    await writeFile(
      path.join(shipflowData, "TASKS.md"),
      [
        "# ShipFlow — Master Tasks",
        "",
        "## shipflow_app",
        "",
        "| Pri | Task | Status |",
        "| --- | --- | --- |",
        "| 🟢 | Master-only task | ✅ done |",
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
        "| 2026-05-20 | old scope | B | 0/1/2 |",
        ""
      ].join("\n"),
      "utf8"
    );
    await writeFile(path.join(shipflowData, "AUDIT_LOG.md"), "# Audit Log\n\nNo rows\n", "utf8");

    const data = await readDashboardData({
      projectRoot,
      shipflowDataRoot: shipflowData,
      shipflowRepoRoot: shipflowRepo
    });

    expect(data.tasks.lines[0]).toContain("🔴 [shipflow_app] Replace canonical parser in TUI — todo");
    expect(data.tasks.lines.some((line) => line.includes("Keep local legacy task"))).toBe(true);
    expect(data.tasks.lines.some((line) => line.includes("✅ Replace canonical parser in TUI"))).toBe(false);
    expect(data.tasks.lines.some((line) => line.includes("Master-only task"))).toBe(true);
    expect(data.audits.lines.some((line) => line.includes("🟠 [shipflow_app] 2026-05-21 — parser — C — 1/0/0"))).toBe(true);
    expect(data.audits.lines.some((line) => line.includes("| 2026-05-21 | parser | C | 1/0/0 |"))).toBe(false);
  });

  it("reads canonical spec operational summary fields and keeps canonical precedence", async () => {
    const appRoot = await mkdtemp(path.join(tmpdir(), "sf-tui-app-"));
    const projectRoot = path.join(appRoot, "app");
    const shipflowData = path.join(appRoot, "shipflow_data");
    const shipflowRepo = path.join(appRoot, "shipflow");

    await mkdir(path.join(projectRoot, "shipflow_data/workflow/specs"), { recursive: true });
    await mkdir(path.join(projectRoot, "shipflow_data/workflow"), { recursive: true });
    await mkdir(shipflowData, { recursive: true });
    await mkdir(path.join(shipflowRepo, "skills/sf-spec"), { recursive: true });

    await writeFile(path.join(shipflowData, "PROJECTS.md"), "", "utf8");
    await writeFile(path.join(shipflowData, "TASKS.md"), "", "utf8");
    await writeFile(path.join(projectRoot, "AGENT.md"), "---\nproject: shipflow_app\n---\n", "utf8");
    await writeFile(path.join(shipflowData, "AUDIT_LOG.md"), "", "utf8");
    await writeFile(path.join(shipflowData, "OPERATIONS_LOG.md"), "", "utf8");
    await writeFile(path.join(shipflowData, "DEPENDENCY_LOG.md"), "", "utf8");
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
        "| sf-ready | done | canonical parser | /sf-ready |",
        ""
      ].join("\n"),
      "utf8"
    );

    const data = await readDashboardData({
      projectRoot,
      shipflowDataRoot: shipflowData,
      shipflowRepoRoot: shipflowRepo
    });

    expect(data.specs).toHaveLength(1);
    expect(data.specs[0]?.title).toBe("Canonical Spec");
    expect(data.specs[0]?.status).toBe("ready");
    expect(data.specs[0]?.nextStep).toBe("/sf-ready Canonical Spec");
    expect(data.specs[0]?.path).toBe("shipflow_data/workflow/specs/spec-canonical.md");
    expect(data.specs[0]?.project).toBe("shipflow_app");
  });

  it("preserves filtering on canonical task/audit/spec project prefixes", async () => {
    const appRoot = await mkdtemp(path.join(tmpdir(), "sf-tui-app-"));
    const projectRoot = path.join(appRoot, "app");
    const shipflowData = path.join(appRoot, "shipflow_data");
    const shipflowRepo = path.join(appRoot, "shipflow");

    await mkdir(path.join(projectRoot, "shipflow_data/workflow/specs"), { recursive: true });
    await mkdir(path.join(projectRoot, "shipflow_data/workflow"), { recursive: true });
    await mkdir(shipflowData, { recursive: true });
    await mkdir(path.join(shipflowRepo, "skills"), { recursive: true });

    await writeFile(path.join(shipflowData, "PROJECTS.md"), "", "utf8");
    await writeFile(path.join(projectRoot, "AGENT.md"), "---\nproject: shipflow_app\n---\n", "utf8");
    await writeFile(path.join(shipflowData, "OPERATIONS_LOG.md"), "", "utf8");
    await writeFile(path.join(shipflowData, "DEPENDENCY_LOG.md"), "", "utf8");
    await writeFile(path.join(shipflowData, "TASKS.md"), "", "utf8");
    await writeFile(path.join(shipflowData, "AUDIT_LOG.md"), "", "utf8");
    await writeFile(
      path.join(projectRoot, "shipflow_data/workflow/TASKS.md"),
      [
        "🔴 [shipflow_app] task: Shipflow task | status: todo | area: alpha",
        "🟢 [Beta Project] task: Beta task | status: done | area: beta",
        ""
      ].join("\n"),
      "utf8"
    );
    await writeFile(
      path.join(projectRoot, "shipflow_data/workflow/AUDIT_LOG.md"),
      [
        "🟠 [shipflow_app] audit: shipflow scope | date: 2026-05-21 | overall: C | issues: 1/0/0 | scope: shipflow",
        "🟢 [Beta Project] audit: beta scope | date: 2026-05-21 | overall: B | issues: 0/0/0 | scope: beta",
        ""
      ].join("\n"),
      "utf8"
    );
    await writeFile(
      path.join(projectRoot, "shipflow_data/workflow/specs/shipflow.md"),
      [
        "status: ready",
        "project: shipflow_app",
        "# Title",
        "ShipFlow Spec",
        ""
      ].join("\n"),
      "utf8"
    );
    await writeFile(
      path.join(projectRoot, "shipflow_data/workflow/specs/beta.md"),
      [
        "status: draft",
        "project: beta",
        "# Title",
        "Beta Spec",
        ""
      ].join("\n"),
      "utf8"
    );

    const data = await readDashboardData({
      projectRoot,
      shipflowDataRoot: shipflowData,
      shipflowRepoRoot: shipflowRepo
    });

    const filteredState = "shipflow_app".split("").reduce(
      (state, letter) => reduceDashboardViewState(data, state, { name: letter, sequence: letter }),
      DEFAULT_DASHBOARD_VIEW_STATE
    );
    const activityState = reduceDashboardViewState(data, filteredState, { name: "tab", sequence: "\t" });
    const auditsState = reduceDashboardViewState(data, activityState, { name: "tab", sequence: "\t" });
    const vm = buildDashboardViewModel(data, auditsState);

    expect(vm.activityLines.join("\n")).toContain("[shipflow_app] Shipflow task");
    expect(vm.activityLines.join("\n")).not.toContain("Beta task");
    expect(vm.auditsLines.join("\n")).toContain("[shipflow_app]");
    expect(vm.auditsLines.join("\n")).not.toContain("Beta Project");
    expect(vm.specLines.join("\n")).toContain("ShipFlow Spec");
    expect(vm.specLines.join("\n")).not.toContain("Beta Spec");
  });
});
