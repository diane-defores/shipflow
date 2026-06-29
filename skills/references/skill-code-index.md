---
artifact: technical_guidelines
metadata_schema_version: "1.0"
artifact_version: "2.2.0"
project: ShipFlow
created: "2026-06-10"
updated: "2026-06-11"
status: active
source_skill: 102-sf-start
scope: skill-code-index
owner: Diane
confidence: high
risk_level: high
security_impact: none
docs_impact: yes
linked_systems:
  - skills/
  - skills/000-shipflow/SKILL.md
  - skills/302-sf-help/SKILL.md
  - docs/skill-launch-cheatsheet.md
  - tools/skill_code_index_lint.py
  - skills/900-shipflow-core/SKILL.md
depends_on:
  - artifact: "shipflow_data/workflow/specs/three-digit-runtime-skill-names.md"
    artifact_version: "1.0.0"
    required_status: ready
supersedes:
  - artifact: "shipflow_data/workflow/specs/numeric-skill-code-index.md"
    artifact_version: "1.0.0"
evidence:
  - "User decision 2026-06-10: use three digits directly before the skill name for the real runtime-visible skill identity."
  - "User decision 2026-06-10: no symbol-heavy names; keep lowercase letters, numbers, and hyphens only."
  - "2026-06-11 900-shipflow-core added as an internal operator skill in the reserved meta band."
  - "2026-06-11 310-sf-github-hygiene added as the git/GitHub sync, stale branch, PR drift, and Dependabot hygiene skill."
next_review: "2026-07-10"
next_step: "/103-sf-verify Three Digit Runtime Skill Names"
---

# Skill Code Index

## Purpose

This is the canonical ShipFlow runtime skill-name map.

The code is now part of the runtime-visible skill identity. For example:

```text
old name: 001-sf-build
runtime name: 001-sf-build
operator invocation: $001-sf-build
```

## Resolution Rules

- Runtime skill names use `NNN-<old-name>`.
- The three-digit code is stable after ship.
- The suffix preserves the old skill name exactly.
- Old unprefixed names may appear only as legacy aliases, historical evidence, or natural-language route hints.
- Do not create wrapper skills for old names unless a future ready spec explicitly accepts duplicate picker entries.

## Family Bands

| Band | Family | Memory rule |
| --- | --- | --- |
| `000-099` | Master and high-frequency entrypoints | Most frequent and highest-level commands get the easiest codes. |
| `100-199` | Lifecycle and proof | Spec, readiness, execution, verification, checks, fixes, browser/auth/test proof. |
| `200-299` | Content, research, and copy | Writing, enrichment, repurposing, market/research/watch, and copy audits. |
| `300-399` | Docs, context, and support | Docs, help, context, changelog, init, scaffold, status, tasks. |
| `400-499` | Audit, quality, and ops risk | Audit master, code/deps/perf/migrate/prod/SEO/i18n/GTM/a11y. |
| `500-599` | Design and components | Design-system, playground, design audit, tokens, component audit. |
| `600-699` | Data and activation | Local-cloud sync, entitlements, parity, and future account/data surfaces. |
| `700-799` | Pilotage and session helpers | Explore, backlog, priorities, review, model choice, resume helpers. |
| `800-899` | Conversation and transcript helpers | Conversation capture and transcript tooling. |
| `900-999` | Reserved rare meta space | Reserved for future rare or migration-only skills. |

Frequency wins over family when a skill belongs to both. For example `007-sf-content` stays in the master band.

## Code Table

| Code | Old name | Runtime skill | Family |
| --- | --- | --- | --- |
| `000` | `shipflow` | `000-shipflow` | Master |
| `001` | `sf-build` | `001-sf-build` | Master |
| `002` | `sf-maintain` | `002-sf-maintain` | Master |
| `003` | `sf-bug` | `003-sf-bug` | Master |
| `004` | `sf-deploy` | `004-sf-deploy` | Master |
| `005` | `sf-ship` | `005-sf-ship` | Master |
| `006` | `sf-design` | `006-sf-design` | Master |
| `007` | `sf-content` | `007-sf-content` | Master |
| `008` | `sf-end-user` | `008-sf-end-user` | Master |
| `009` | `sf-skill-build` | `009-sf-skill-build` | Master |
| `100` | `sf-spec` | `100-sf-spec` | Lifecycle/proof |
| `101` | `sf-ready` | `101-sf-ready` | Lifecycle/proof |
| `102` | `sf-start` | `102-sf-start` | Lifecycle/proof |
| `103` | `sf-verify` | `103-sf-verify` | Lifecycle/proof |
| `104` | `sf-end` | `104-sf-end` | Lifecycle/proof |
| `105` | `sf-check` | `105-sf-check` | Lifecycle/proof |
| `106` | `sf-fix` | `106-sf-fix` | Lifecycle/proof |
| `107` | `sf-test` | `107-sf-test` | Lifecycle/proof |
| `108` | `sf-browser` | `108-sf-browser` | Lifecycle/proof |
| `109` | `sf-auth-debug` | `109-sf-auth-debug` | Lifecycle/proof |
| `200` | `sf-redact` | `200-sf-redact` | Content/research/copy |
| `201` | `sf-enrich` | `201-sf-enrich` | Content/research/copy |
| `202` | `sf-repurpose` | `202-sf-repurpose` | Content/research/copy |
| `203` | `sf-research` | `203-sf-research` | Content/research/copy |
| `204` | `sf-market-study` | `204-sf-market-study` | Content/research/copy |
| `205` | `sf-veille` | `205-sf-veille` | Content/research/copy |
| `206` | `sf-audit-copy` | `206-sf-audit-copy` | Content/research/copy |
| `207` | `sf-audit-copywriting` | `207-sf-audit-copywriting` | Content/research/copy |
| `300` | `sf-docs` | `300-sf-docs` | Docs/context/support |
| `301` | `sf-context` | `301-sf-context` | Docs/context/support |
| `302` | `sf-help` | `302-sf-help` | Docs/context/support |
| `303` | `sf-resume` | `303-sf-resume` | Docs/context/support |
| `304` | `sf-changelog` | `304-sf-changelog` | Docs/context/support |
| `305` | `sf-init` | `305-sf-init` | Docs/context/support |
| `306` | `sf-scaffold` | `306-sf-scaffold` | Docs/context/support |
| `307` | `sf-skills-refresh` | `307-sf-skills-refresh` | Docs/context/support |
| `308` | `sf-status` | `308-sf-status` | Docs/context/support |
| `309` | `sf-tasks` | `309-sf-tasks` | Docs/context/support |
| `310` | `sf-github-hygiene` | `310-sf-github-hygiene` | Docs/context/support |
| `400` | `sf-audit` | `400-sf-audit` | Audit/quality/ops |
| `401` | `sf-audit-code` | `401-sf-audit-code` | Audit/quality/ops |
| `402` | `sf-deps` | `402-sf-deps` | Audit/quality/ops |
| `403` | `sf-perf` | `403-sf-perf` | Audit/quality/ops |
| `404` | `sf-migrate` | `404-sf-migrate` | Audit/quality/ops |
| `405` | `sf-prod` | `405-sf-prod` | Audit/quality/ops |
| `406` | `sf-seo` | `406-sf-seo` | Audit/quality/ops |
| `407` | `sf-audit-translate` | `407-sf-audit-translate` | Audit/quality/ops |
| `408` | `sf-audit-gtm` | `408-sf-audit-gtm` | Audit/quality/ops |
| `409` | `sf-audit-a11y` | `409-sf-audit-a11y` | Audit/quality/ops |
| `500` | `sf-design-from-scratch` | `500-sf-design-from-scratch` | Design/components |
| `501` | `sf-design-playground` | `501-sf-design-playground` | Design/components |
| `502` | `sf-audit-design` | `502-sf-audit-design` | Design/components |
| `503` | `sf-audit-design-tokens` | `503-sf-audit-design-tokens` | Design/components |
| `504` | `sf-audit-components` | `504-sf-audit-components` | Design/components |
| `600` | `sf-local-cloud-sync` | `600-sf-local-cloud-sync` | Data/activation |
| `601` | `sf-product-entitlements` | `601-sf-product-entitlements` | Data/activation |
| `602` | `sf-platform-parity` | `602-sf-platform-parity` | Data/activation |
| `700` | `sf-explore` | `700-sf-explore` | Pilotage/session |
| `701` | `sf-backlog` | `701-sf-backlog` | Pilotage/session |
| `702` | `sf-priorities` | `702-sf-priorities` | Pilotage/session |
| `703` | `sf-review` | `703-sf-review` | Pilotage/session |
| `704` | `sf-model` | `704-sf-model` | Pilotage/session |
| `705` | `sf-conversation-audit` | `705-sf-conversation-audit` | Pilotage/session |
| `706` | `continue` | `706-continue` | Pilotage/session |
| `707` | `name` | `707-name` | Pilotage/session |
| `800` | `tmux-capture-conversation` | `800-tmux-capture-conversation` | Conversation/transcript |
| `801` | `clean-conversation-transcript` | `801-clean-conversation-transcript` | Conversation/transcript |
| `900` | `shipflow-core` | `900-shipflow-core` | Meta/internal |

## Maintenance

Run this after adding, removing, or renaming a skill:

```bash
python3 tools/skill_code_index_lint.py
python3 tools/skill_budget_audit.py --skills-root skills --format markdown
tools/shipflow_sync_skills.sh --check --all
```

The linter must fail when:

- a code is duplicated
- a runtime skill appears twice
- a listed runtime skill directory is missing
- a `skills/*/SKILL.md` directory has no active code row
- the runtime skill does not equal `<code>-<old-name>`
