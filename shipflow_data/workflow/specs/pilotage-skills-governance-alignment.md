---
artifact: spec
metadata_schema_version: "1.0"
artifact_version: "1.0.0"
project: "ShipFlow"
created: "2026-05-23"
created_at: "2026-05-23 20:57:04 UTC"
updated: "2026-05-23"
updated_at: "2026-05-23 21:02:35 UTC"
status: ready
source_skill: sf-spec
source_model: "GPT-5 Codex"
scope: "skill-maintenance"
owner: "Diane"
user_story: "En tant qu'utilisatrice ShipFlow, je veux que les skills de pilotage utilisent la gouvernance projet locale et le control-plane externe correctement, afin que backlog, priorités, review et status ne déplacent pas le travail dans les mauvais trackers."
confidence: high
risk_level: medium
security_impact: none
docs_impact: yes
linked_systems:
  - "skills/sf-backlog/SKILL.md"
  - "skills/sf-priorities/SKILL.md"
  - "skills/sf-review/SKILL.md"
  - "skills/sf-status/SKILL.md"
  - "site/src/content/skills/sf-backlog.md"
  - "site/src/content/skills/sf-priorities.md"
  - "site/src/content/skills/sf-review.md"
  - "site/src/content/skills/sf-status.md"
  - "skills/REFRESH_LOG.md"
depends_on:
  - artifact: "skills/references/canonical-paths.md"
    artifact_version: "1.1.0"
    required_status: active
  - artifact: "skills/references/reporting-contract.md"
    artifact_version: "1.2.0"
    required_status: active
  - artifact: "skills/references/question-contract.md"
    artifact_version: "1.0.0"
    required_status: active
  - artifact: "skills/references/operational-record-format.md"
    artifact_version: "1.0.0"
    required_status: active
supersedes: []
evidence:
  - "2026-05-23 audit: sf-backlog, sf-priorities, and sf-review still describe the external TASKS.md as a single master source of truth and require always-updating it."
  - "2026-05-23 audit: sf-status still uses a local AskUserQuestion block and lacks Report Modes."
  - "Current canonical paths distinguish external control-plane registry/tracker files from project-local shipflow_data/{business,technical,editorial,workflow} governance."
next_step: "/sf-skill-build pilotage-skills-governance-alignment"
---

# Title

Pilotage Skills Governance Alignment

# Status

Ready.

# User Story

En tant qu'utilisatrice ShipFlow, je veux que les skills de pilotage utilisent la gouvernance projet locale et le control-plane externe correctement, afin que backlog, priorites, review et status ne deplacent pas le travail dans les mauvais trackers.

# Minimal Behavior Contract

`sf-backlog`, `sf-priorities`, and `sf-review` use the current project's `shipflow_data/workflow/TASKS.md` and `shipflow_data/workflow/BACKLOG.md` as the primary operational trackers when a project is selected. `${SHIPFLOW_DATA_DIR:-$HOME/shipflow_data}` remains an external control-plane for project registry and optional portfolio coordination, not the default project source of truth. `sf-status` remains read-only, reads the external registry only as a control-plane dashboard input, and all four skills load shared reporting and question contracts before final reports or user-facing questions.

# Scope In

- `skills/sf-backlog/SKILL.md`
- `skills/sf-priorities/SKILL.md`
- `skills/sf-review/SKILL.md`
- `skills/sf-status/SKILL.md`
- public skill pages when public promises need path/coherence updates
- `skills/REFRESH_LOG.md`
- validation and runtime sync for touched skills

# Scope Out

- No broad rewrite of `sf-tasks`.
- No migration of existing tracker data.
- No change to the external `${SHIPFLOW_DATA_DIR:-$HOME/shipflow_data}` files.
- No commit or push.

# Implementation Tasks

- [x] Task 1: Update `sf-backlog` contract.
- [x] Task 2: Update `sf-priorities` contract.
- [x] Task 3: Update `sf-review` contract.
- [x] Task 4: Update `sf-status` contract.
- [x] Task 5: Update public pages if needed.
- [x] Task 6: Log and validate.

# Acceptance Criteria

- [x] All four skills have `Report Modes` and load `reporting-contract`.
- [x] User-facing selection questions load `question-contract`.
- [x] `sf-backlog`, `sf-priorities`, and `sf-review` no longer call the external `TASKS.md` the single source of truth.
- [x] Project-local `shipflow_data/workflow/TASKS.md` and `shipflow_data/workflow/BACKLOG.md` are primary for project work.
- [x] External `${SHIPFLOW_DATA_DIR:-$HOME/shipflow_data}` is described as registry/portfolio coordination only.
- [x] `sf-status` remains read-only and does not imply tracker mutation.
- [x] Validation passes or any remaining limit is explicitly reported.

# Test Strategy

Proof path: `scenario-first`.

Pressure scenario: an operator runs pilotage from inside a project with local `shipflow_data/workflow/TASKS.md`, while the external control-plane also has a portfolio `TASKS.md` and `PROJECTS.md`. Backlog, priority, and review skills must default to local workflow trackers for project work and touch the external tracker only for explicit portfolio coordination. Status must read the external registry for dashboard discovery without mutating it. Any project/scope/time questions must use `question-contract`, and final reports must use `reporting-contract`.

# Risks

- Existing users may still rely on the external portfolio tracker. Mitigation: keep explicit portfolio coordination supported when requested.
- Public pages are short and may not need path details. Mitigation: update only if the public promise would otherwise drift.

# Skill Run History

| Date UTC | Skill | Model | Action | Result | Next step |
| --- | --- | --- | --- | --- | --- |
| 2026-05-23 20:57:04 UTC | sf-spec | GPT-5 Codex | Created ready spec for bounded pilotage skill governance alignment. | ready | `/sf-skill-build pilotage-skills-governance-alignment` |
| 2026-05-23 21:01:30 UTC | sf-skill-build | GPT-5 Codex | Updated pilotage skill contracts, READMEs, public skill pages, and refresh log; validation pending. | implemented | `/sf-verify pilotage-skills-governance-alignment` |
| 2026-05-23 21:02:35 UTC | sf-verify | GPT-5 Codex | Verified scenario-first acceptance criteria with focused rg checks, metadata lint, budget audit, runtime sync, diff check, and Astro build. | verified | `no commit or push requested` |

# Current Chantier Flow

| Skill | Status | Notes |
| --- | --- | --- |
| sf-spec | ready | Ready spec created directly from the confirmed next batch. |
| sf-ready | ready | Scope, pressure scenario, acceptance criteria, and validation are explicit. |
| sf-skill-build | implemented | Contract, README, public page, and refresh log edits complete. |
| sf-skills-refresh | completed | Refresh log records the four pilotage skill updates. |
| sf-verify | passed | Scenario-first checks passed; build succeeded with duplicate-id warnings. |
| sf-end | pending | Not started. |
| sf-ship | pending | Not started; no commit/push requested. |
