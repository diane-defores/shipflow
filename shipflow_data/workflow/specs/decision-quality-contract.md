---
artifact: spec
metadata_schema_version: "1.0"
artifact_version: "1.0.0"
project: "ShipFlow"
created: "2026-05-24"
created_at: "2026-05-24 08:44:23 UTC"
updated: "2026-05-24"
updated_at: "2026-05-24 09:03:02 UTC"
status: ready
source_skill: sf-spec
source_model: "GPT-5 Codex"
scope: "skill-governance"
owner: "Diane"
user_story: "En tant qu'operatrice ShipFlow, je veux que les agents privilegient performance, securite, excellence et perennite au lieu de la facilite, de la rapidite ou du chemin le plus court, afin que les decisions et implementations restent professionnelles et durables."
confidence: high
risk_level: high
security_impact: yes
docs_impact: yes
linked_systems:
  - "skills/references/decision-quality-contract.md"
  - "skills/references/master-workflow-lifecycle.md"
  - "skills/references/spec-driven-development-discipline.md"
  - "skills/references/master-delegation-semantics.md"
  - "skills/references/question-contract.md"
  - "skills/sf-model/SKILL.md"
  - "skills/sf-model/references/model-routing.md"
  - "skills/sf-build/SKILL.md"
  - "skills/sf-start/SKILL.md"
  - "skills/sf-start/references/execution-workflow.md"
  - "skills/sf-fix/SKILL.md"
  - "skills/sf-verify/SKILL.md"
  - "skills/sf-skill-build/SKILL.md"
  - "skills/shipflow/SKILL.md"
  - "skills/sf-help/SKILL.md"
  - "skills/sf-help/references/help-catalog.md"
  - "README.md"
  - "shipflow-spec-driven-workflow.md"
  - "shipflow_data/technical/skill-runtime-and-lifecycle.md"
  - "skills/REFRESH_LOG.md"
depends_on:
  - artifact: "skills/references/canonical-paths.md"
    artifact_version: "1.1.0"
    required_status: active
  - artifact: "skills/references/master-workflow-lifecycle.md"
    artifact_version: "1.2.2"
    required_status: active
  - artifact: "skills/references/spec-driven-development-discipline.md"
    artifact_version: "1.0.0"
    required_status: active
  - artifact: "skills/references/question-contract.md"
    artifact_version: "1.0.0"
    required_status: active
supersedes: []
evidence:
  - "User directive 2026-05-24: primary objectives are maximum performance, maximum security, excellence, and durability; the agent must not choose convenience, speed, or the shortest path for its own sake."
  - "User directive 2026-05-24: the operator wants high-quality code, modern effective tools, and best practices; she is not pressed by time."
  - "Focused audit 2026-05-24: sf-model and shared execution references still frame fast or cheap options as default decision criteria without an explicit quality-first boundary."
next_step: "/sf-skill-build decision-quality-contract"
---

# Title

Decision Quality Contract

# Status

Ready.

# User Story

En tant qu'operatrice ShipFlow, je veux que les agents privilegient performance, securite, excellence et perennite au lieu de la facilite, de la rapidite ou du chemin le plus court, afin que les decisions et implementations restent professionnelles et durables.

# Minimal Behavior Contract

ShipFlow decisions must optimize first for correctness, reliability, security and data safety, performance where relevant, maintainability, durability, operator trust, and current professional best practices. Speed, cost, token economy, local convenience, and the shortest path are secondary tie-breakers only after the primary quality bar is already satisfied.

The phrase "smallest safe path" must mean the smallest complete, professional, best-practice implementation that satisfies the product contract and preserves security, performance, maintainability, and future evolution. It must never mean the fastest hack, the easiest patch, or the least ambitious acceptable workaround.

Minimal targeted edits remain allowed only as a file-safety discipline: edit the smallest relevant row, section, or module when the correct solution is already known. They do not lower solution quality, proof obligations, security posture, or architecture standards.

# Scope In

- Add `skills/references/decision-quality-contract.md`.
- Wire the contract into shared lifecycle, delegation, proof, question, model-routing, build, start, fix, verify, skill-build, router, and help surfaces.
- Reframe speed/cost/fallback wording so fast or cheap choices are allowed only when quality-equivalent and safe for the risk.
- Update README, workflow docs, technical lifecycle docs, and refresh log for discoverability.
- Validate with scenario-first checks, metadata lint, budget audit, runtime sync checks, stale wording search, and diff hygiene.

# Scope Out

- No new runtime skill invocation key for `decision-quality-contract`; it is a shared reference, not a user-facing skill.
- No broad rewrite of every ShipFlow skill that mentions small edits or quick checks.
- No change to public product claims beyond internal workflow documentation.
- No commit or push.

# Implementation Tasks

- [x] Task 1: Create the shared decision-quality reference.
- [x] Task 2: Update shared lifecycle, proof, delegation, and question references.
- [x] Task 3: Update model routing and core execution skills.
- [x] Task 4: Update help and official workflow documentation.
- [x] Task 5: Log the refresh and run validation.

# Acceptance Criteria

- [x] `skills/references/decision-quality-contract.md` exists, is active, and states the primary decision metrics explicitly.
- [x] Master lifecycle, proof discipline, delegation, and question contracts load or cite the new reference.
- [x] `sf-model` and `model-routing.md` no longer present speed, cost, or cheap fallbacks as primary defaults when quality, security, performance, or reliability is not equivalent.
- [x] Core execution skills distinguish bounded professional implementation from "minimal solution" shortcuts.
- [x] Help and official workflow docs expose the doctrine so future skill edits can find it.
- [x] Focused `rg` checks show no stale "fastest/easiest/shortest path" doctrine outside forbidden examples or explicitly bounded edit-safety language.
- [x] Required validations pass or any remaining gap is reported as blocking/partial.

# Test Strategy

Proof path: `scenario-first`.

Pressure scenario: an agent is fixing or implementing a non-trivial change and is tempted to say, "I will make the minimal modification so it works." Under the updated contracts, the agent must instead choose a bounded professional implementation that satisfies the user story, proof path, security posture, performance expectations, maintainability, and current best practices. If the robust path changes architecture, cost, migration, public behavior, or security posture materially, the agent must ask a numbered decision question with the high-quality route recommended by default.

Mechanical checks:

- Search for the new contract across shared references, core skills, help, and docs.
- Search for stale speed/cost/shortcut language and verify remaining occurrences are either forbidden examples, compatible fast-path labels, or explicit edit-safety constraints.
- Run metadata lint on the new spec and reference.
- Run skill budget audit.
- Run runtime sync checks for touched runtime skills.
- Run `git diff --check` on touched files.

# Risks

- Over-correcting all "small" wording could remove useful blast-radius discipline. Mitigation: preserve minimal targeted edits as a safety practice, while forbidding shortcut solution quality.
- Model routing still needs fallback options. Mitigation: keep fallbacks, but require quality equivalence for the active risk.
- Broad skill sweep could create unrelated churn. Mitigation: update central shared references and only the core skills/docs that shape decisions.

# Content Extension

User directive 2026-05-24: before shipping the internal contract, inform ShipFlow users of the positioning.

Scope added for `sf-content`:

- homepage positioning components
- docs overview
- FAQ
- why-not-just-prompts page
- skill launch modes page
- selected public skill pages for `sf-build`, `sf-start`, `sf-verify`, and `sf-model`
- editorial governance maps and claim register

Claim boundary: public wording may say ShipFlow prioritizes correctness, security posture, maintainability, relevant performance, and proof before speed, cost, or convenience. It must not claim guaranteed security, guaranteed performance, bug-free output, or quantified gains without evidence.

# Skill Run History

| Date UTC | Skill | Model | Action | Result | Next step |
| --- | --- | --- | --- | --- | --- |
| 2026-05-24 08:44:23 UTC | sf-spec | GPT-5 Codex | Created ready spec for decision-quality governance. | ready | `/sf-skill-build decision-quality-contract` |
| 2026-05-24 08:52:06 UTC | sf-skill-build | GPT-5 Codex | Added decision-quality contract, updated shared references/core skills/help/docs/refresh log, and ran validation. | implemented | `no commit or push requested` |
| 2026-05-24 08:52:06 UTC | sf-verify | GPT-5 Codex | Verified scenario-first acceptance criteria with metadata lint, budget audit, runtime sync, focused rg checks, diff check, and site build. | verified | `no commit or push requested` |
| 2026-05-24 09:02:22 UTC | sf-content | GPT-5 Codex | Applied public positioning copy across declared site and skill-page surfaces. | implemented | `/sf-verify decision-quality-contract` |
| 2026-05-24 09:03:02 UTC | sf-verify | GPT-5 Codex | Verified public content updates with editorial metadata lint, claim scan, leak scan, diff check, and Astro build. | verified | `no commit or push requested` |

# Current Chantier Flow

| Skill | Status | Notes |
| --- | --- | --- |
| sf-spec | ready | Ready spec created from explicit user directive. |
| sf-ready | ready | Scope, acceptance criteria, pressure scenario, and validation are explicit. |
| sf-skill-build | implemented | Contract, shared references, core skills, docs, help, and refresh log updated. |
| sf-skills-refresh | completed | Refresh log records the decision-quality update. |
| sf-content | implemented | Public positioning copy and editorial governance updates applied. |
| sf-verify | passed | Public content validation passed; Astro build succeeded with duplicate-id warnings on touched skill pages. |
| sf-end | pending | Not started. |
| sf-ship | pending | Not started; no commit/push requested. |
