---
name: sf-tasks
description: "Update task trackers and suggest next steps."
disable-model-invocation: false
argument-hint: [optional focus area or task type]
---

## Canonical Paths

Before resolving any ShipFlow-owned file, load `$SHIPFLOW_ROOT/skills/references/canonical-paths.md` (`$SHIPFLOW_ROOT` defaults to `$HOME/shipflow`). ShipFlow tools, shared references, skill-local `references/*`, templates, workflow docs, and internal scripts must resolve from `$SHIPFLOW_ROOT`, not from the project repo where the skill is running. Project artifacts and source files still resolve from the current project root unless explicitly stated otherwise.

## Chantier Tracking

Trace category: `conditionnel`.
Process role: `pilotage`.

Before producing the final report, load `$SHIPFLOW_ROOT/skills/references/chantier-tracking.md` when this run is attached to a spec-first chantier. If exactly one active `specs/*.md` chantier is identified, append the current run to `Skill Run History`, update `Current Chantier Flow` when the run changes the chantier state, and include a final `Chantier` block. If no unique chantier is identified, do not write to any spec; report `Chantier: non applicable` or `Chantier: non trace` with the reason.


## Context

- Current directory: !`pwd`
- Project-local dashboard (primary): !`cat shipflow_data/workflow/TASKS.md 2>/dev/null || echo "No local project TASKS.md"`
- Legacy cross-project dashboard fallback: disabled; use project-local trackers or explicit migration evidence only.
- Local project tracker (if exists): !`cat TASKS.md 2>/dev/null || cat shipflow_data/workflow/TASKS.md 2>/dev/null || echo "No local project TASKS.md"`
- Recent git status: !`git status --short 2>/dev/null || echo "Not a git repository"`
- Current branch: !`git branch --show-current 2>/dev/null || echo "N/A"`
- Project CLAUDE.md (if exists): !`head -30 CLAUDE.md 2>/dev/null || echo "No CLAUDE.md found"`
- Workspace CLAUDE.md: !`head -20 $HOME/CLAUDE.md 2>/dev/null || echo "N/A"`

## Multi-project tracking system

**CRITICAL**: This workspace tracks projects through local project trackers (`shipflow_data/workflow/TASKS.md`). Local project trackers are the active source of truth.

- `TASKS.md` is an operational tracker, not a ShipFlow decision artifact. Do not add YAML frontmatter or metadata schema fields to `TASKS.md`.
- If a task contains a durable decision, spec, business rule, research conclusion, or product contract, keep the task entry concise and extract the durable content into a separate metadata-bearing artifact via `/sf-docs`, `/sf-spec`, `/sf-research`, or the relevant skill.
- **Prioritize local tracker updates** (`TASKS.md` or `shipflow_data/workflow/TASKS.md`) as the operational source of truth.
- Do not update a central master tracker during normal task work. Treat old master files as migration evidence only.

## Shared tracking file write protocol

- Before creating or mutating task operational records, load `$SHIPFLOW_ROOT/skills/references/operational-record-format.md` and follow its traffic-first grammar for new `TASKS.md` entries.
- Treat the TASKS snapshots loaded at skill start as informational only.
- Right before editing the project-local TASKS file, re-read the target from disk and use that version as authoritative.
- Apply the smallest possible patch to the relevant project section or backlog block; never rewrite the whole file from stale context.
- If the expected anchor moved or changed, re-read once and recompute.
- If it is still ambiguous after the second read, stop and ask the user instead of forcing the write.
- If the file is still missing after that authoritative re-read, create it from the canonical format.

## Tracker synchronization rules

- Distinguish clearly between:
  - the project-local `shipflow_data/workflow/TASKS.md` file
  - legacy root `TASKS.md` files inside old projects
  - archived central trackers used only as migration evidence
- There is no active central master tracker for normal task updates.
- The local tracker (`TASKS.md` or `shipflow_data/workflow/TASKS.md`) should represent the active project backlog and may include a small `Historical completed work` section when older project work exists only in the legacy master.
- Completed historical entries from archived central trackers must not be copied into the local active backlog.
- If a local `TASKS.md` is created after project work already exists in the legacy master tracker, first audit the existing project entries there, then split them into:
  - active backlog
  - historical completed context
- Do not claim that a tracker "did not exist" without specifying whether you mean:
  - the legacy master tracker
  - the project section in the legacy master tracker
  - the local `TASKS.md` file

## Your task

Intelligently manage the TASKS.md file by:
1. Checking off completed tasks
2. Adding remaining tasks to be done
3. Suggesting the next priority action
4. **Keeping local and legacy master trackers in sync** (`shipflow_data/workflow/TASKS.md` primary, legacy master optional)

### Workspace root detection

If the current directory has no project markers (not inside a specific project) — you are at the **workspace root**. Use the runtime's structured question tool when available, or a concise plain-text question:
- Question: "Which project(s) should I update tasks for?"
- `multiSelect: true`
- Options:
  - **All projects** — "Review and update tasks across the full workspace" (Recommended)
  - One option per project: label = project name, description = number of open tasks in local project tracker

### Steps

1. **Analyze current state**:
   - Read TASKS.md if it exists (shown in context above)
   - Check the git status and file changes to identify what's been done
   - Look for project-specific patterns in CLAUDE.md to understand the project structure

2. **Identify completed tasks**:
   - Review unchecked tasks in TASKS.md
   - Cross-reference with actual project state (files, git commits, running processes)
   - Mark tasks as complete by changing `- [ ]` to `- [x]` for done items
   - Add completion timestamps where helpful

3. **Identify remaining tasks**:
   - Based on the project context and any arguments provided by the user (`$ARGUMENTS`)
   - Consider common next steps: tests, documentation, deployment, refactoring
   - Think about the project lifecycle: setup → development → testing → deployment → maintenance
   - Look for TODOs in code, pending PRs, failing tests, or incomplete features

4. **Update TASKS.md**:
   - **Always check if TASKS.md exists first.** If it does not exist, create it using a concise project heading plus task operational records that follow `$SHIPFLOW_ROOT/skills/references/operational-record-format.md` — do NOT create a bare-minimum file.
  - If project work already exists in the legacy master tracker for this repo, import only the still-active items into the local active backlog. Historical `done` items may be copied into a short context section, but never into the active backlog.
   - If TASKS.md doesn't exist, create it with this compact structure (adapt section titles to the detected project):
     ```markdown
     # Tasks — [Project Name]

     > Operational task records follow `$SHIPFLOW_ROOT/skills/references/operational-record-format.md`.

     ---

     ## Active

     [traffic-first task records]

     ## Historical completed work

    Optional. Use only when older project work already exists in the legacy master tracker and would otherwise be lost locally.

     ---

     ## Backlog

     [traffic-first task records for deferred work]

     ---

     ## Audit Findings
     <!-- Populated by /sf-audit with traffic-first task records when findings become tasks. -->
     ```
   - When **audit findings** are added to TASKS.md (by `/sf-audit` or manually), add or update task operational records using the shared traffic-first contract.
   - If TASKS.md exists, update it:
     - Update existing canonical task records in place when present, preserving unknown fields.
     - Treat legacy tables or checklist rows as migration input only; do not add new legacy-only task rows.
     - Preserve existing audit sections — never remove dated `### Audit:` blocks
     - Keep traffic markers consistent with `$SHIPFLOW_ROOT/skills/references/operational-record-format.md`: 🔴 🟠 🟡 🟢.

5. **Update CHANGELOG.md**:
   - Look for a `CHANGELOG.md` in the current project directory
   - If it doesn't exist, create it with a standard Keep a Changelog structure
   - Add an entry under `## [Unreleased]` (or today's date if releasing) for every task marked done in this session
   - Group entries by type: `### Added`, `### Changed`, `### Fixed`
   - Keep entries concise and user-facing (what changed, not how)
   - Example format:
     ```markdown
     ## [Unreleased]
     ### Added
     - Page /quiz dédiée fullscreen (FR + EN) avec redirection de tous les CTAs
     - Minimum 2 semaines imposé avant toute réservation (validation Zod + Calendar)
     ### Changed
     - BookingForm : typography et spacing réduits pour tenir sur un écran sans scroll
     ```

6. **Suggest next steps**:
   - Analyze the remaining tasks
   - Recommend the highest priority item based on:
     - Blockers (tasks that unblock other work)
     - Dependencies (what needs to happen first)
     - High-ROI bounded-effort opportunities
     - User's argument/focus area if provided
   - Explain why this task should be next (1-2 sentences)

### Important

- Do not update legacy central trackers for cross-project visibility; use local project discovery and project-local files.
- If a root project `TASKS.md` also exists (e.g., `winflowz/TASKS.md`), treat it as a legacy project tracker and prefer `shipflow_data/workflow/TASKS.md` when available.
- Use the Edit tool to update existing TASKS.md or Write tool to create a new one
- Be intelligent about what's "done" - check actual evidence, don't just guess
- Keep task descriptions clear and actionable
- Use sections to organize tasks logically
- The suggestion should be specific and immediately actionable
- If the user provided arguments, use them to focus on specific task types or areas
- Preserve any manual notes or custom sections the user has added
- Add context/notes when a task is more complex than it appears
- Update the master Dashboard table's "Status" and "Top Priority" columns when significant changes occur
