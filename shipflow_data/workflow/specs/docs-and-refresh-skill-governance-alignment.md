---
artifact: spec
metadata_schema_version: "1.0"
artifact_version: "1.0.0"
project: "ShipFlow"
created: "2026-05-22"
created_at: "2026-05-22 12:16:25 UTC"
updated: "2026-05-22"
updated_at: "2026-05-22 12:24:00 UTC"
status: ready
source_skill: sf-spec
source_model: "GPT-5 Codex"
scope: "skill-maintenance"
owner: "Diane"
user_story: "En tant qu'utilisatrice ShipFlow, je veux que les skills de documentation et de fraîcheur restent alignées avec la gouvernance actuelle, afin que les prochains travaux de skills ne contournent pas les gates de reporting, question, docs, budget, runtime et surfaces publiques."
confidence: high
risk_level: medium
security_impact: none
docs_impact: yes
linked_systems:
  - "skills/sf-skills-refresh/SKILL.md"
  - "skills/sf-docs/SKILL.md"
  - "skills/REFRESH_LOG.md"
  - "site/src/content/skills/sf-skills-refresh.md"
  - "site/src/content/skills/sf-docs.md"
depends_on:
  - artifact: "skills/references/reporting-contract.md"
    artifact_version: "1.2.0"
    required_status: active
  - artifact: "skills/references/question-contract.md"
    artifact_version: "1.0.0"
    required_status: active
  - artifact: "skills/references/master-delegation-semantics.md"
    artifact_version: "1.2.2"
    required_status: active
  - artifact: "skills/references/skill-context-budget.md"
    artifact_version: "0.3.1"
    required_status: draft
supersedes: []
evidence:
  - "User request 2026-05-22: skills that handle skills, documentation, and freshness must be up to date as priority."
  - "Quick audit found sf-skills-refresh missing Report Modes, question-contract loading, current delegation wording, docs/help/public-surface gates, and self-refresh recovery path."
  - "Quick audit found sf-docs broadly current but missing explicit question-contract and skill-documentation coherence gates."
next_step: "/sf-skill-build docs-and-refresh-skill-governance-alignment"
---

# Title

Docs And Refresh Skill Governance Alignment

# Status

Ready.

# User Story

En tant qu'utilisatrice ShipFlow, je veux que les skills de documentation et de fraîcheur restent alignées avec la gouvernance actuelle, afin que les prochains travaux de skills ne contournent pas les gates de reporting, question, docs, budget, runtime et surfaces publiques.

# Minimal Behavior Contract

`sf-skills-refresh` must refresh target skills against both current external practice and current local ShipFlow governance, using current reporting, question, delegation, budget, docs, public-surface, and runtime visibility gates. `sf-docs` must explicitly own documentation coherence for skill contracts and skill public pages. If these skills themselves are stale, the system must provide a safe manual `sf-skill-build` path instead of leaving them permanently excluded from refresh.

# Success Behavior

- `sf-skills-refresh` loads the current shared contracts before user selection, delegation/research, reporting, budget, and docs/public-surface decisions.
- `sf-docs` names skill-documentation coherence as an explicit governed surface.
- Public skill pages describe the updated behavior without adding ShipFlow governance frontmatter to Astro runtime content.
- Validation proves skill budget, runtime links, targeted references, metadata, and public site build remain healthy.

# Error Behavior

If a refresh would change public promises, invocation keys, runtime links, or governance policy without a ready skill-maintenance contract, it must stop or route through `sf-skill-build` instead of applying opportunistic edits.

# Problem

`sf-skills-refresh` still used older runtime language and omitted newer reporting/question/delegation/docs gates. `sf-docs` was mostly aligned but did not explicitly gate skill docs and public skill-page coherence. These gaps can let future skill-maintenance work pass while stale docs, public skill pages, or runtime visibility drift.

# Solution

Apply targeted contract edits to `sf-skills-refresh` and `sf-docs`, then update the corresponding public skill pages and refresh log. Keep edits additive and avoid broad refactors.

# Scope In

- Update `skills/sf-skills-refresh/SKILL.md`.
- Update `skills/sf-docs/SKILL.md`.
- Update public pages for `sf-skills-refresh` and `sf-docs`.
- Add a refresh log entry.
- Validate skill budget, runtime links, metadata, targeted contract strings, and site build.

# Scope Out

- No invocation key rename.
- No broad rewrite of unrelated skill contracts.
- No edits to existing dirty files outside this target set unless validation proves a direct dependency.
- No commit or push.

# Constraints

- Internal skill contracts stay in English.
- User-facing French reports keep accents.
- Runtime Astro content frontmatter must remain schema-compatible.
- Do not add governance frontmatter to `site/src/content/skills/*.md`.
- Respect existing dirty worktree changes.

# Dependencies

- `skills/references/reporting-contract.md`
- `skills/references/question-contract.md`
- `skills/references/master-delegation-semantics.md`
- `skills/references/documentation-freshness-gate.md`
- `skills/references/skill-context-budget.md`
- `skills/references/skill-instruction-layering.md`
- `skills/sf-docs/references/core-governance.md`
- `skills/sf-docs/references/mode-playbooks.md`

Fresh external docs: `fresh-docs not needed` — this change is governed by local ShipFlow skill contracts and public Astro content structure, not by external framework behavior.

# Invariants

- `sf-skills-refresh` remains additive and conservative.
- `sf-docs` remains the documentation/governance corpus owner.
- `sf-skill-build` remains the lifecycle pilot for non-trivial skill-maintenance work.
- Current-user Claude/Codex skill links must remain valid.

# Links & Consequences

- Skill-maintenance quality improves because refresh cannot skip reporting, question, budget, docs, public-surface, and runtime gates.
- Public skill pages stay aligned with the internal contracts.
- Future work on `sf-veille` can rely on a fresher `sf-skills-refresh` and `sf-docs` foundation.

# Documentation Coherence

Documentation impact is required for changed public skill pages and refresh log. Technical docs appear already aligned; update only if validation reveals drift.

# Edge Cases

- `sf-skills-refresh` cannot safely refresh itself in ordinary mode; the safe recovery path is manual `sf-skill-build` with scenario-first proof.
- Empty-argument skill selection must load the shared question contract before asking.
- Public skill pages are runtime content, not governance artifacts.

# Implementation Tasks

- [x] Task 1: Create ready chantier spec.
  - File: `shipflow_data/workflow/specs/docs-and-refresh-skill-governance-alignment.md`
  - Action: Define scope, gates, validation, and run history.
  - User story link: Establishes the source of truth.
  - Depends on: None.
  - Validate with: `python3 tools/shipflow_metadata_lint.py shipflow_data/workflow/specs/docs-and-refresh-skill-governance-alignment.md`

- [x] Task 2: Refresh `sf-skills-refresh` contract.
  - File: `skills/sf-skills-refresh/SKILL.md`
  - Action: Add current reporting, question, delegation, freshness, budget, docs/public-surface, and self-refresh recovery gates.
  - User story link: Keeps freshness skill aligned with governance.
  - Depends on: Task 1.
  - Validate with: `rg -n "Report Modes|question-contract|master-delegation-semantics|Documentation Update Plan|Editorial Update Plan|sf-skill-build" skills/sf-skills-refresh/SKILL.md`

- [x] Task 3: Refresh `sf-docs` skill-documentation gates.
  - File: `skills/sf-docs/SKILL.md`
  - Action: Add explicit question contract, freshness gate, and skill-doc/public-page coherence gates.
  - User story link: Keeps documentation skill aligned with skill maintenance.
  - Depends on: Task 1.
  - Validate with: `rg -n "question-contract|documentation-freshness-gate|skill public|skill_budget_audit|shipflow_sync_skills" skills/sf-docs/SKILL.md`

- [x] Task 4: Update public skill pages.
  - File: `site/src/content/skills/sf-skills-refresh.md`, `site/src/content/skills/sf-docs.md`
  - Action: Align public promises with updated internal behavior.
  - User story link: Keeps public docs coherent with skill truth.
  - Depends on: Tasks 2-3.
  - Validate with: `rg -n "reporting|question|public skill|skill budget|governance" site/src/content/skills/sf-skills-refresh.md site/src/content/skills/sf-docs.md`

- [x] Task 5: Validate changed surfaces.
  - File: changed surfaces.
  - Action: Run skill budget, runtime sync, metadata lint, targeted rg checks, and site build.
  - User story link: Proves the correction.
  - Depends on: Tasks 2-4.
  - Validate with: validation commands in Test Strategy.

# Acceptance Criteria

- [x] `sf-skills-refresh` has explicit `Report Modes`.
- [x] `sf-skills-refresh` loads `question-contract` before selection prompts.
- [x] `sf-skills-refresh` uses current delegation semantics instead of stale hard-coded agent wording.
- [x] `sf-skills-refresh` requires docs/help/public-surface review when refresh changes skill promises.
- [x] `sf-docs` explicitly governs skill documentation and public skill pages.
- [x] Public pages match internal contracts.
- [x] Skill budget audit and runtime skill sync pass.
- [x] Astro site builds.

# Test Strategy

Proof path: `scenario-first`.

Pressure scenario: a future operator asks `sf-skills-refresh sf-veille` after governance changed; the skill must load the current contracts, avoid stale user-question/delegation behavior, update skill docs/public pages when promises change, and route self/major lifecycle drift through `sf-skill-build`.

Validation commands:

```bash
python3 tools/skill_budget_audit.py --skills-root skills --format markdown
tools/shipflow_sync_skills.sh --check --skill sf-docs
tools/shipflow_sync_skills.sh --check --skill sf-skills-refresh
python3 tools/shipflow_metadata_lint.py shipflow_data/workflow/specs/docs-and-refresh-skill-governance-alignment.md skills/REFRESH_LOG.md
rg -n "Report Modes|question-contract|master-delegation-semantics|Documentation Update Plan|Editorial Update Plan|sf-skill-build" skills/sf-skills-refresh/SKILL.md
rg -n "question-contract|documentation-freshness-gate|skill public|skill_budget_audit|shipflow_sync_skills" skills/sf-docs/SKILL.md
npm --prefix site run build
```

# Risks

- Over-expanding `sf-skills-refresh` could dilute the activation body. Mitigation: additive compact gates only.
- Public page claims could overpromise automation. Mitigation: keep wording about gates and maintenance, not guaranteed freshness.
- Existing dirty files could confuse validation. Mitigation: keep write set bounded and report dirty-worktree limits.

# Execution Notes

No external docs needed; local ShipFlow governance contracts are the source of truth.

# Open Questions

None.

# Skill Run History

| Date UTC | Skill | Model | Action | Result | Next step |
| --- | --- | --- | --- | --- | --- |
| 2026-05-22 12:16:25 UTC | sf-spec | GPT-5 Codex | Created ready spec from the user's priority request and earlier audits of `sf-skills-refresh` and `sf-docs`. | ready | `/sf-skill-build docs-and-refresh-skill-governance-alignment` |
| 2026-05-22 12:16:25 UTC | sf-ready | GPT-5 Codex | Evaluated the bounded skill-maintenance spec for actor, scope, tasks, validation, docs impact, and open questions. | ready | `/sf-skill-build docs-and-refresh-skill-governance-alignment` |
| 2026-05-22 12:20:42 UTC | sf-skill-build | GPT-5 Codex | Updated `sf-skills-refresh`, `sf-docs`, refresh log, and public skill pages; ran budget, runtime sync, metadata lint, focused rg checks, diff check, and Astro build. | implemented | `/sf-verify docs-and-refresh-skill-governance-alignment` |
| 2026-05-22 12:24:00 UTC | sf-verify | GPT-5 Codex | Verified the scenario-first pressure case, acceptance criteria, skill coherence, metadata, language/docs coherence, fresh-docs verdict, runtime sync, budget audit, and public site build. | verified | `no commit or push requested` |

# Current Chantier Flow

| Skill | Status | Notes |
| --- | --- | --- |
| sf-spec | ready | Ready spec created directly for bounded skill-maintenance work. |
| sf-ready | ready | Readiness satisfied by explicit scope, tasks, risks, and validation. |
| sf-skill-build | implemented | Contract edits and validation complete. |
| sf-skills-refresh | completed | Refresh log records local governance refresh for `sf-skills-refresh` and `sf-docs`. |
| sf-verify | passed | Scenario-first proof path satisfied by focused checks and build. |
| sf-end | pending | Not started. |
| sf-ship | pending | Not started; no commit/push requested. |
