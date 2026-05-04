---
artifact: spec
metadata_schema_version: "1.0"
artifact_version: "1.0.0"
project: "ShipFlow"
created: "2026-05-04"
created_at: "2026-05-04 10:47:41 UTC"
updated: "2026-05-04"
updated_at: "2026-05-04 10:47:41 UTC"
status: ready
source_skill: sf-spec
source_model: "GPT-5 Codex"
scope: skill-maintenance
owner: Diane
confidence: high
user_story: "En tant qu'utilisatrice ShipFlow qui repurpose des conversations et du contenu produit, je veux que sf-repurpose sorte d'abord des idees de noms d'articles, des titres pour la conversation actuelle et des prochaines actions concretes, afin de transformer le rapport en decision editoriale exploitable sans tri manuel."
risk_level: medium
security_impact: none
docs_impact: yes
linked_systems:
  - skills/sf-repurpose/SKILL.md
  - skills/sf-repurpose/references/output-pack.md
  - site/src/content/skills/sf-repurpose.md
  - skills/REFRESH_LOG.md
  - CONTENT_MAP.md
  - docs/editorial/
depends_on:
  - artifact: "CONTENT_MAP.md"
    artifact_version: "0.5.0"
    required_status: draft
  - artifact: "skills/references/editorial-content-corpus.md"
    artifact_version: "1.1.0"
    required_status: active
supersedes: []
evidence:
  - "User feedback 2026-05-04: current sf-repurpose reports are too messy and not actionable."
  - "User requested article-name ideas linked to existing content."
  - "User requested article-title ideas for directly repurposing the current conversation."
  - "Existing sf-repurpose contract already owns source-faithful repurposing and uses skills/sf-repurpose/references/output-pack.md."
next_step: "/sf-verify specs/sf-repurpose-actionable-article-ideas-output.md"
---

# Spec: sf-repurpose Actionable Article Ideas Output

## Status

Ready.

The placement decision is explicit: update the existing `sf-repurpose` skill. This is a report-shape and output-quality improvement inside its existing source-faithful repurposing domain, not a new skill.

## User Story

En tant qu'utilisatrice ShipFlow qui repurpose des conversations et du contenu produit, je veux que `sf-repurpose` sorte d'abord des idees de noms d'articles, des titres pour la conversation actuelle et des prochaines actions concretes, afin de transformer le rapport en decision editoriale exploitable sans tri manuel.

## Behavior Contract

`sf-repurpose` must lead pack-mode reports with actionable editorial outputs before detailed source analysis. The first user-facing sections are `Best Next Actions`, `Article Name Ideas`, `Titles For This Conversation`, `Source Pack`, and `Evidence Ledger`. Article ideas and titles must be ranked, short, source-grounded, and include destination status. If no article/blog surface is declared, the skill still gives usable ideas but marks destination as `surface missing: blog`.

## Acceptance Criteria

- [x] `sf-repurpose` requires an action-first report shape.
- [x] `Article Name Ideas` is required for repurposing idea output and includes working name, angle, source proof, surface, and next step.
- [x] `Titles For This Conversation` is mandatory in workstream mode and includes title, promise, source support, and destination.
- [x] The output pack reference mirrors the new section order.
- [x] The public skill page tells operators they get article ideas, conversation titles, and next actions.
- [x] Existing source-faithfulness, claim safety, and missing blog surface rules remain intact.

## Scope

In:

- Update `skills/sf-repurpose/SKILL.md`.
- Update `skills/sf-repurpose/references/output-pack.md`.
- Update `site/src/content/skills/sf-repurpose.md`.
- Log the skill refresh.
- Validate skill budget, metadata, runtime link, and site build.

Out:

- Creating a blog/article runtime surface.
- Writing actual articles.
- Changing `sf-content`, `sf-redact`, or `sf-enrich` behavior.
- Shipping unrelated dirty files.

## Test Strategy

Run:

```bash
tools/shipflow_sync_skills.sh --check --skill sf-repurpose
python3 tools/skill_budget_audit.py --skills-root skills --format markdown
python3 tools/shipflow_metadata_lint.py specs/sf-repurpose-actionable-article-ideas-output.md
npm --prefix site run build
rg -n "Actionability Contract|Article Name Ideas|Titles For This Conversation|Best Next Actions|surface missing: blog" skills/sf-repurpose/SKILL.md skills/sf-repurpose/references/output-pack.md site/src/content/skills/sf-repurpose.md
git diff --check
```

Fresh external docs verdict: `fresh-docs not needed`, because this change only updates local skill/report contracts and validates through the local site build.

## Documentation Update Plan

Status: complete.

- Code changed: none.
- Skill contract changed: `skills/sf-repurpose/SKILL.md`.
- Reference changed: `skills/sf-repurpose/references/output-pack.md`.
- Public skill page changed: `site/src/content/skills/sf-repurpose.md`.
- Technical docs: no impact; no runtime or lifecycle doctrine changed.

## Editorial Update Plan

Status: complete.

- Public surface: `site/src/content/skills/sf-repurpose.md`.
- Claim impact: low; the page now describes report shape and actionable outputs, not new product capability.
- Blog/article surface: unchanged; missing surface policy remains active.

## Skill Run History

| Date UTC | Skill | Model | Action | Result | Next step |
|----------|-------|-------|--------|--------|-----------|
| 2026-05-04 10:47:41 UTC | sf-spec | GPT-5 Codex | Created the actionable report-shape contract for `sf-repurpose`. | ready | `/sf-skill-build skills/sf-repurpose/SKILL.md` |
| 2026-05-04 10:47:41 UTC | sf-ready | GPT-5 Codex | Checked that placement, behavior, scope, acceptance criteria, and validations are explicit. | ready | edit `sf-repurpose` |
| 2026-05-04 10:47:41 UTC | sf-skill-build | GPT-5 Codex | Updated `sf-repurpose`, its output pack reference, public page, and refresh log. | implemented | validation |
| 2026-05-04 10:50:24 UTC | sf-skills-refresh | GPT-5 Codex | Logged the local refresh from user feedback and applied no external-research additions. | completed | skill budget audit |
| 2026-05-04 10:50:26 UTC | sf-verify | GPT-5 Codex | Verified runtime sync, metadata lint, skill budget audit, targeted rg checks, diff check, placeholder scan, and Astro build. | verified; build passed with non-blocking duplicate-id warning in the dirty worktree | scoped ship |
| 2026-05-04 10:50:26 UTC | sf-ship | GPT-5 Codex | Shipped only `sf-repurpose` actionability files and excluded unrelated dirty worktree changes. | shipped | None |

## Current Chantier Flow

```text
sf-spec: ready
sf-ready: ready
sf-start: implemented via sf-skill-build
sf-verify: verified
sf-end: completed
sf-ship: shipped
```

## Current State

- Chantier identified: yes.
- Current spec: `specs/sf-repurpose-actionable-article-ideas-output.md`.
- Dirty scope must stay bounded because unrelated worktree changes already exist.
- Required next step: None.
