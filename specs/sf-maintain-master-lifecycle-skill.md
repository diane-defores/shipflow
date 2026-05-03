---
artifact: spec
metadata_schema_version: "1.0"
artifact_version: "1.0.0"
project: "shipflow"
created: "2026-05-03"
created_at: "2026-05-03 19:10:22 UTC"
updated: "2026-05-03"
updated_at: "2026-05-03 19:24:14 UTC"
status: ready
source_skill: sf-spec
source_model: "GPT-5 Codex"
scope: "skill-lifecycle"
owner: "Diane"
user_story: "As a ShipFlow operator maintaining an existing project, I want sf-maintain to act as a master maintenance skill that can create or continue a spec, delegate bounded implementation work, verify results, and route shipping, so maintenance findings are resolved instead of becoming another list of commands."
confidence: high
risk_level: high
security_impact: yes
docs_impact: yes
linked_systems:
  - "skills/sf-maintain/SKILL.md"
  - "skills/sf-maintain/agents/openai.yaml"
  - "skills/references/chantier-tracking.md"
  - "skills/sf-help/SKILL.md"
  - "README.md"
  - "shipflow-spec-driven-workflow.md"
  - "docs/technical/skill-runtime-and-lifecycle.md"
  - "site/src/content/skills/sf-maintain.md"
depends_on:
  - artifact: "shipflow-spec-driven-workflow.md"
    artifact_version: "0.11.0"
    required_status: draft
supersedes:
  - "specs/sf-maintain-project-maintenance-skill.md"
evidence:
  - "User correction on 2026-05-03: sf-maintain is useless if it only routes; it must become a true master skill that implements and ships when needed."
  - "Existing sf-build master skill defines delegated sequential execution as the default and spec-gated parallelism only with safe Execution Batches."
  - "Validation passed on 2026-05-03: metadata lint, skill budget audit, runtime skill sync check, targeted rg checks, and Astro site build."
next_step: "none"
---

# Spec: sf-maintain Master Lifecycle Skill

## Title

sf-maintain Master Lifecycle Skill

## Status

ready

## User Story

As a ShipFlow operator maintaining an existing project, I want `sf-maintain` to act as a master maintenance skill that can create or continue a spec, delegate bounded implementation work, verify results, and route shipping, so maintenance findings are resolved instead of becoming another list of commands.

## Minimal Behavior Contract

`sf-maintain` must become a lifecycle master skill for project maintenance.

Default invocation should run the maintenance lifecycle as far as safely possible:

```text
maintenance intake -> triage -> existing chantier/spec gate -> spec/readiness when needed -> delegated execution -> checks/docs/audits/security lanes -> verification -> ship/deploy route
```

`quick` remains the explicit read-only mode. Other modes may focus the lane, but they should still execute through the lifecycle when the evidence calls for it.

## Success Behavior

- Preconditions: the current directory is a maintainable project or `global` selects one project at a time.
- Trigger: the user invokes `/sf-maintain`, `$sf-maintain`, or asks for project maintenance to be handled.
- User/operator result: maintenance work is either completed through verification and ship routing, or blocked at a named safety gate with the next concrete action.
- System effect: `sf-maintain` uses specialist skills and bounded subagents instead of duplicating their internals.
- Success proof: the final report names the chantier/spec state, execution mode, checks, documentation/editorial status, verification result, and ship/deploy route.
- Silent success: not allowed. If nothing needed maintenance, report that result with the evidence checked.

## Non-Goals

- Do not make `quick` write-capable.
- Do not bypass `sf-spec`, `sf-ready`, `sf-start`, `sf-verify`, `sf-end`, `sf-ship`, or `sf-deploy` gates.
- Do not duplicate the internals of dependency, docs, audit, bug, check, fix, build, or deploy skills.
- Do not ship with unresolved high/critical security, data, auth, production, or secret risk unless the user explicitly accepts the risk.
- Do not run parallel write agents unless a ready spec defines non-overlapping `Execution Batches`.

## Acceptance Criteria

- [x] AC 1: `sf-maintain` frontmatter and chantier doctrine classify it as `obligatoire` / `lifecycle`.
- [x] AC 2: Default `/sf-maintain` is a master lifecycle run, while `/sf-maintain quick` is the read-only triage escape hatch.
- [x] AC 3: The skill defines `main-only`, `delegated sequential`, and `spec-gated parallel` execution modes.
- [x] AC 4: The lifecycle can create or continue a spec, run readiness, delegate implementation, verify, and route to ship/deploy.
- [x] AC 5: Public/help/workflow docs describe `sf-maintain` as a master maintenance skill, not a small router.
- [x] AC 6: Validation covers skill budget, metadata, runtime skill sync, targeted role checks, and site build.

## Validation Plan

- `python3 tools/shipflow_metadata_lint.py specs/sf-maintain-master-lifecycle-skill.md README.md shipflow-spec-driven-workflow.md docs/technical/skill-runtime-and-lifecycle.md skills/references/chantier-tracking.md`
- `python3 tools/skill_budget_audit.py --skills-root skills --format markdown`
- `tools/shipflow_sync_skills.sh --check --skill sf-maintain`
- `rg -n "sf-maintain.*lifecycle|sf-maintain.*ship|delegated sequential|spec-gated parallel" skills/sf-maintain/SKILL.md README.md shipflow-spec-driven-workflow.md skills/sf-help/SKILL.md docs/technical/skill-runtime-and-lifecycle.md site/src/content/skills/sf-maintain.md`
- `npm --prefix site run build`

## Skill Run History

| Date UTC | Skill | Model | Action | Result | Next step |
|----------|-------|-------|--------|--------|-----------|
| 2026-05-03 19:10:22 UTC | sf-spec | GPT-5 Codex | Created ready spec for transforming sf-maintain into a master lifecycle skill | ready | /sf-start sf-maintain master lifecycle skill |
| 2026-05-03 19:14:40 UTC | sf-skill-build | GPT-5 Codex | Updated sf-maintain contract, runtime label, chantier doctrine, help, workflow, technical docs, README, public skill page, and superseded the prior router spec | implemented | /sf-verify sf-maintain master lifecycle skill |
| 2026-05-03 19:14:40 UTC | sf-verify | GPT-5 Codex | Ran metadata lint, skill budget audit, runtime sync check, targeted rg checks, and Astro site build | passed | /sf-ship "Promote sf-maintain to master maintenance lifecycle" after selecting bounded ship scope |
| 2026-05-03 19:24:14 UTC | sf-ship | GPT-5 Codex | Ran full close bookkeeping, metadata lint, skill budget audit, runtime sync check, targeted rg checks, git diff check, and site build for the bounded sf-maintain scope | shipped | none |

## Current Chantier Flow

- `sf-spec`: done, ready spec created.
- `sf-ready`: ready by direct user clarification and bounded acceptance criteria.
- `sf-start`: implemented through sf-skill-build.
- `sf-verify`: passed.
- `sf-end`: done through sf-ship full close bookkeeping.
- `sf-ship`: shipped for the bounded sf-maintain scope; unrelated dirty files remain outside this chantier.

Next step: none
