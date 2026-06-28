---
artifact: spec
metadata_schema_version: "1.0"
artifact_version: "1.0.0"
project: "ShipFlow"
created: "2026-05-22"
created_at: "2026-05-22 12:22:56 UTC"
updated: "2026-05-22"
updated_at: "2026-05-22 12:27:46 UTC"
status: ready
source_skill: sf-spec
source_model: "GPT-5 Codex"
scope: "skill-maintenance"
owner: "Diane"
user_story: "En tant qu'utilisatrice ShipFlow, je veux que sf-veille respecte la gouvernance actuelle des projets, de la recherche et du contenu, afin que les URLs triées deviennent des décisions fiables sans écrire dans les mauvais dossiers ni inventer des surfaces éditoriales."
confidence: high
risk_level: medium
security_impact: none
docs_impact: yes
linked_systems:
  - "skills/sf-veille/SKILL.md"
  - "skills/sf-veille/README.md"
  - "site/src/content/skills/sf-veille.md"
  - "shipflow_data/workflow/research/"
  - "shipflow_data/editorial/content-map.md"
  - "shipflow_data/workflow/TASKS.md"
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
  - artifact: "skills/references/editorial-content-corpus.md"
    artifact_version: "1.3.0"
    required_status: active
supersedes: []
evidence:
  - "User listed five concrete sf-veille governance gaps on 2026-05-22."
  - "sf-veille currently treats ~/shipflow_data as global business source of truth instead of separating control-plane registry from project-local governance corpora."
  - "Existing ShipFlow veille reports live under shipflow_data/workflow/research/."
  - "shipflow_data/workflow/TASKS.md contains a deferred item to align sf-veille with content governance."
next_step: "/sf-skill-build sf-veille-governance-content-alignment"
---

# Title

sf-veille Governance Content Alignment

# Status

Ready.

# User Story

En tant qu'utilisatrice ShipFlow, je veux que sf-veille respecte la gouvernance actuelle des projets, de la recherche et du contenu, afin que les URLs triées deviennent des décisions fiables sans écrire dans les mauvais dossiers ni inventer des surfaces éditoriales.

# Minimal Behavior Contract

`sf-veille` accepts URLs or pasted content, fetches/analyzes them, scores relevance across registered projects, and asks one triage decision per source. It must use `${SHIPFLOW_DATA_DIR:-$HOME/shipflow_data}` only as the cross-project control plane for registry/master tracking, use each target project's local `shipflow_data/` governance corpus for business/editorial/technical context, save veille reports and tools under canonical `shipflow_data/workflow/research/`, and route blog/newsletter/public-content ideas through `sf-content` or report `surface missing: blog` when no declared surface exists.

# Success Behavior

- URLs are triaged against project-local business/editorial/technical context.
- Reports and tools are saved under canonical workflow research paths.
- Content ideas do not invent blog/newsletter surfaces.
- User-facing questions follow `question-contract`.
- Final reports follow `reporting-contract`.

# Error Behavior

If a target project lacks local governance context, `sf-veille` reports a context gap and lowers confidence. If a content action needs an undeclared blog/article surface, it reports `surface missing: blog` and routes through `sf-content` or `sf-docs editorial` instead of writing a task that assumes the surface exists.

# Problem

`sf-veille` still encodes older ShipFlow assumptions: global `~/shipflow_data` as business truth, `~/shipflow/research` outputs, local AskUserQuestion rules, no report mode contract, and direct content backlog actions without editorial surface gates.

# Solution

Update the `sf-veille` activation contract, README, public skill page, and existing tracker item so the skill follows current path, content, report, and question governance.

# Scope In

- `skills/sf-veille/SKILL.md`
- `skills/sf-veille/README.md`
- `site/src/content/skills/sf-veille.md`
- `shipflow_data/workflow/TASKS.md` status for the explicit deferred item
- validation and refresh log if needed

# Scope Out

- No implementation of an actual veille run.
- No new blog/newsletter surface.
- No broad rewrite of `sf-content`, `sf-repurpose`, `sf-research`, or `sf-market-study`.
- No commit or push.

# Constraints

- Internal skill contract text stays English where it defines durable behavior.
- User-facing French prompts/reports keep natural accented French.
- Runtime Astro content keeps its existing frontmatter schema.
- Do not touch unrelated dirty files.

# Dependencies

- `skills/references/canonical-paths.md`
- `skills/references/reporting-contract.md`
- `skills/references/question-contract.md`
- `skills/references/editorial-content-corpus.md`
- `shipflow_data/editorial/content-map.md`
- `shipflow_data/editorial/blog-and-article-surface-policy.md`

Fresh external docs: `fresh-docs not needed` — this is local ShipFlow governance alignment, not an external framework behavior change.

# Invariants

- `sf-veille` remains `source-de-chantier`.
- `sf-content` owns content lifecycle orchestration.
- Operational trackers remain lightweight and do not receive governance frontmatter.
- Research reports are workflow artifacts, not runtime content.

# Links & Consequences

- Cross-project registry remains `${SHIPFLOW_DATA_DIR:-$HOME/shipflow_data}/PROJECTS.md`.
- Cross-project master tasks can still use `${SHIPFLOW_DATA_DIR:-$HOME/shipflow_data}/TASKS.md` when explicitly adding portfolio tasks.
- Project-local decision context comes from `[project]/shipflow_data/{business,editorial,technical,workflow}/`.
- Public skill docs must reflect the corrected paths and content gates.

# Documentation Coherence

Update `skills/sf-veille/README.md` and `site/src/content/skills/sf-veille.md`. Mark the existing deferred task complete if validation passes.

# Edge Cases

- A link can be useful for a project but only as research, not as content, when no content surface exists.
- A project can be listed in the master registry but lack local governance docs; score with lower confidence and report the gap.
- A content idea can route to `sf-content` without creating a blog article.

# Implementation Tasks

- [x] Task 1: Update `sf-veille` activation contract.
  - File: `skills/sf-veille/SKILL.md`
  - Action: Add report modes, question contract, editorial corpus, canonical context/output paths, and content-surface routing.
  - User story link: Prevents stale governance behavior during URL triage.
  - Depends on: None.
  - Validate with: `rg -n "Report Modes|question-contract|editorial-content-corpus|surface missing: blog|shipflow_data/workflow/research|sf-content" skills/sf-veille/SKILL.md`

- [x] Task 2: Update skill README.
  - File: `skills/sf-veille/README.md`
  - Action: Replace stale output paths and describe project-local governance/content routing.
  - User story link: Keeps operator docs aligned.
  - Depends on: Task 1.
  - Validate with: `rg -n "shipflow_data/workflow/research|project-local|sf-content|surface missing" skills/sf-veille/README.md`

- [x] Task 3: Update public skill page.
  - File: `site/src/content/skills/sf-veille.md`
  - Action: Align public description with governance-aware triage and content-surface limits.
  - User story link: Keeps public promise aligned with internal truth.
  - Depends on: Task 1.
  - Validate with: `rg -n "governance|content surface|sf-content|surface missing|project-local" site/src/content/skills/sf-veille.md`

- [x] Task 4: Update explicit deferred tracker item.
  - File: `shipflow_data/workflow/TASKS.md`
  - Action: Mark the sf-veille content-governance item done when validation passes.
  - User story link: Closes the known backlog gap.
  - Depends on: Tasks 1-3.
  - Validate with: `rg -n "Aligner .+sf-veille.+gouvernance contenu" shipflow_data/workflow/TASKS.md`

- [x] Task 5: Validate changed surfaces.
  - File: changed surfaces.
  - Action: Run skill budget, runtime sync, metadata lint, focused rg checks, and site build.
  - User story link: Proves the corrected contract is coherent.
  - Depends on: Tasks 1-4.
  - Validate with: commands in Test Strategy.

# Acceptance Criteria

- [x] `sf-veille` no longer names `~/shipflow_data/` as global business source of truth.
- [x] `sf-veille` writes reports/tools under `shipflow_data/workflow/research/`.
- [x] `sf-veille` loads `reporting-contract` and supports `report=user` / `report=agent`.
- [x] `sf-veille` loads `question-contract` before user-facing triage questions.
- [x] `sf-veille` loads editorial governance for public-content opportunities and reports `surface missing: blog`.
- [x] Public and README docs match the internal contract.
- [x] The explicit deferred task is no longer deferred.
- [x] Validation passes.

# Test Strategy

Proof path: `scenario-first`.

Pressure scenario: an operator passes three competitor/content URLs. `sf-veille` must discover projects from the control-plane registry, score each against project-local governance docs, ask triage through the shared question contract, route blog/newsletter ideas through `sf-content`, report `surface missing: blog` when no declared blog exists, and save outputs under `shipflow_data/workflow/research/`.

Validation commands:

```bash
rg -n "Report Modes|question-contract|editorial-content-corpus|surface missing: blog|shipflow_data/workflow/research|sf-content" skills/sf-veille/SKILL.md
rg -n "shipflow_data/workflow/research|project-local|sf-content|surface missing" skills/sf-veille/README.md
rg -n "governance|content surface|sf-content|surface missing|project-local" site/src/content/skills/sf-veille.md
python3 tools/skill_budget_audit.py --skills-root skills --format markdown
tools/shipflow_sync_skills.sh --check --skill sf-veille
python3 tools/shipflow_metadata_lint.py shipflow_data/workflow/specs/sf-veille-governance-content-alignment.md
pnpm --dir shipflow-site build
```

# Risks

- Cross-project scoring could become slower if too many project-local docs are loaded. Mitigation: load project docs only for plausible matches and report lower confidence otherwise.
- Content routing could become too conservative. Mitigation: still allow non-blog actions, benchmarks, product/architecture tasks, and `sf-content` handoff.
- Tracker update could collide with unrelated task edits. Mitigation: one-line targeted status update only.

# Execution Notes

Read first: `skills/sf-veille/SKILL.md`, `skills/references/editorial-content-corpus.md`, `shipflow_data/editorial/content-map.md`, `skills/sf-content/SKILL.md`, and existing `shipflow_data/workflow/research/tools.md`.

# Open Questions

None.

# Skill Run History

| Date UTC | Skill | Model | Action | Result | Next step |
| --- | --- | --- | --- | --- | --- |
| 2026-05-22 12:22:56 UTC | sf-spec | GPT-5 Codex | Created ready spec from user-provided sf-veille gap list and local governance references. | ready | `/sf-skill-build sf-veille-governance-content-alignment` |
| 2026-05-22 12:22:56 UTC | sf-ready | GPT-5 Codex | Confirmed the spec is ready because scope, target files, content-gate behavior, paths, validation, and open questions are explicit. | ready | `/sf-skill-build sf-veille-governance-content-alignment` |
| 2026-05-22 12:27:46 UTC | sf-skill-build | GPT-5 Codex | Updated `sf-veille`, README, public skill page, refresh log, and the explicit deferred task; ran budget, runtime sync, metadata lint, focused rg checks, diff check, and Astro build. | implemented | `/sf-verify sf-veille-governance-content-alignment` |
| 2026-05-22 12:27:46 UTC | sf-verify | GPT-5 Codex | Verified the scenario-first pressure case, acceptance criteria, skill coherence, docs coherence, tracker update, runtime sync, metadata, and public site build. | verified | `no commit or push requested` |

# Current Chantier Flow

| Skill | Status | Notes |
| --- | --- | --- |
| sf-spec | ready | Ready spec created from concrete gap list. |
| sf-ready | ready | Scope, files, criteria, and validation are explicit. |
| sf-skill-build | implemented | Contract edits and validation complete. |
| sf-skills-refresh | completed | Refresh log records local governance refresh for `sf-veille`. |
| sf-verify | passed | Scenario-first proof path satisfied by focused checks and build. |
| sf-end | pending | Not started. |
| sf-ship | pending | Not started; no commit/push requested. |
