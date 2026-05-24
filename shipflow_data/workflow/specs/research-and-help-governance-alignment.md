---
artifact: spec
metadata_schema_version: "1.0"
artifact_version: "1.0.0"
project: "ShipFlow"
created: "2026-05-23"
created_at: "2026-05-23 20:45:30 UTC"
updated: "2026-05-23"
updated_at: "2026-05-23 20:50:00 UTC"
status: ready
source_skill: sf-spec
source_model: "GPT-5 Codex"
scope: "skill-maintenance"
owner: "Diane"
user_story: "En tant qu'utilisatrice ShipFlow, je veux que sf-research et sf-help reflètent la gouvernance actuelle des chemins, rapports et questions, afin que la recherche et l'aide ne réintroduisent pas les anciens dossiers ni l'ancien modèle de vérité globale."
confidence: high
risk_level: medium
security_impact: none
docs_impact: yes
linked_systems:
  - "skills/sf-research/SKILL.md"
  - "skills/sf-help/references/help-catalog.md"
  - "site/src/content/skills/sf-research.md"
  - "skills/REFRESH_LOG.md"
  - "shipflow_data/workflow/research/"
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
  - artifact: "skills/references/documentation-freshness-gate.md"
    artifact_version: "1.0.0"
    required_status: active
supersedes: []
evidence:
  - "2026-05-23 audit: sf-research still saved root research reports to a legacy ShipFlow research folder and lacked Report Modes/question-contract/fresh-docs gates."
  - "2026-05-23 audit: sf-help help-catalog still described the external ShipFlow data directory as the broad control plane and could mislead operators away from project-local shipflow_data governance."
next_step: "/sf-build research-and-help-governance-alignment"
---

# Title

Research And Help Governance Alignment

# Status

Ready.

# User Story

En tant qu'utilisatrice ShipFlow, je veux que sf-research et sf-help reflètent la gouvernance actuelle des chemins, rapports et questions, afin que la recherche et l'aide ne réintroduisent pas les anciens dossiers ni l'ancien modèle de vérité globale.

# Minimal Behavior Contract

`sf-research` writes reusable research artifacts to project-local `shipflow_data/workflow/research/` or ShipFlow's own `shipflow_data/workflow/research/` for cross-project/global ShipFlow research. It loads shared question/reporting contracts and the documentation freshness gate when research depends on current external behavior. `sf-help` explains `${SHIPFLOW_DATA_DIR:-$HOME/shipflow_data}` as the external control-plane registry/tracker only, while project-local `shipflow_data/{business,technical,editorial,workflow}` remains the source for project governance.

# Scope In

- `skills/sf-research/SKILL.md`
- `site/src/content/skills/sf-research.md`
- `skills/sf-help/references/help-catalog.md`
- `skills/REFRESH_LOG.md`
- validation and runtime sync for touched skills

# Scope Out

- No broad rewrite of all audit/global-mode skills.
- No commit or push.
- No external-doc refresh beyond local ShipFlow governance gates unless validation requires it.

# Implementation Tasks

- [x] Task 1: Update `sf-research` activation contract.
- [x] Task 2: Update public `sf-research` page.
- [x] Task 3: Update `sf-help` catalog path doctrine.
- [x] Task 4: Log and validate.

# Acceptance Criteria

- [x] `sf-research` has `Report Modes` and loads `reporting-contract`.
- [x] `sf-research` loads `question-contract` before user-facing topic questions.
- [x] `sf-research` names `documentation-freshness-gate` for current external behavior.
- [x] `sf-research` no longer writes to legacy ShipFlow root research folders.
- [x] Research outputs use `shipflow_data/workflow/research/`.
- [x] `sf-help` no longer teaches the external control-plane directory as broad project truth.
- [x] Validation passes or any remaining limit is explicitly reported.

# Test Strategy

Proof path: `scenario-first`.

Pressure scenario: an operator at `/home` asks `sf-research` for current docs or a strategic topic. The skill must ask through `question-contract` when no topic is provided, verify current external behavior through the freshness gate when needed, save the report under canonical workflow research paths, and report with the shared reporting contract. A second operator reads `sf-help` and must understand that the external control plane is for registry/tracker coordination, not project business/editorial/technical truth.

# Risks

- `sf-research` still names Claude-specific research tools that may not exist in all runtimes. Mitigation: keep them as preferred examples but add current-source/freshness requirements.
- `sf-help` is a long catalog; patch only stale doctrine hotspots to avoid unrelated churn.

# Skill Run History

| Date UTC | Skill | Model | Action | Result | Next step |
| --- | --- | --- | --- | --- | --- |
| 2026-05-23 20:45:30 UTC | sf-build | GPT-5 Codex | Created ready spec and started bounded skill-maintenance execution for `sf-research` and `sf-help`. | implemented | `/sf-verify research-and-help-governance-alignment` |
| 2026-05-23 20:50:00 UTC | sf-verify | GPT-5 Codex | Verified scenario-first acceptance criteria with focused rg checks, metadata lint, budget audit, runtime sync, diff check, and Astro build. | verified | `no commit or push requested` |

# Current Chantier Flow

| Skill | Status | Notes |
| --- | --- | --- |
| sf-spec | ready | Ready spec created directly for bounded skill-maintenance work. |
| sf-ready | ready | Scope, pressure scenario, acceptance criteria, and validation are explicit. |
| sf-build | implemented | Contract, public page, help catalog, refresh log, and validation complete. |
| sf-verify | passed | Scenario-first checks passed; build succeeded with existing duplicate-id warning. |
| sf-end | pending | Not started. |
| sf-ship | pending | Not started; no commit/push requested. |
