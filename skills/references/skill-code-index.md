---
artifact: technical_guidelines
metadata_schema_version: "1.0"
artifact_version: "1.0.0"
project: ShipFlow
created: "2026-06-10"
updated: "2026-06-10"
status: active
source_skill: sf-build
scope: skill-code-index
owner: Diane
confidence: high
risk_level: medium
security_impact: none
docs_impact: yes
linked_systems:
  - skills/
  - skills/shipflow/SKILL.md
  - skills/sf-help/SKILL.md
  - docs/skill-launch-cheatsheet.md
  - tools/skill_code_index_lint.py
depends_on:
  - artifact: "shipflow_data/workflow/specs/numeric-skill-code-index.md"
    artifact_version: "1.0.0"
    required_status: ready
supersedes: []
evidence:
  - "User decision 2026-06-10: numeric prefixes only, no symbol-heavy aliases."
  - "User decision 2026-06-10: put a numeric code before the displayed skill name without changing canonical skill names."
  - "User decision 2026-06-10: reserve the 00 family for master skills, then use understandable families."
next_review: "2026-07-10"
next_step: "/sf-verify Numeric Skill Code Index"
---

# Skill Code Index

## Purpose

This is the canonical ShipFlow `code -> skill` lookup table.

The code is a discovery and routing aid. It is not a runtime rename.

Canonical skill directories and `name:` frontmatter stay unchanged. For example:

```text
code: 01
display: 01-sf-build
canonical skill: sf-build
```

## Resolution Rules

Accepted user-facing forms:

- `01`
- `01-sf-build`
- `01sfbuild`
- `01 sf-build`

Resolution rules:

1. Extract the leading two digits.
2. Resolve those digits in the table below.
3. If a trailing skill-like label exists and conflicts with the resolved code, prefer the numeric code and mention the canonical skill.
4. Hand off to the canonical skill name, not to the display label.

Do not create wrapper skills, duplicate skill directories, or numeric symlinks for this index unless a future spec explicitly changes the runtime contract.

## Family Bands

| Band | Family | Memory rule |
| --- | --- | --- |
| `00-09` | Global and master entrypoints | Most frequent and highest-level commands get the easiest codes. |
| `10-19` | Lifecycle and proof | Spec, readiness, execution, verification, checks, fixes, browser/auth/test proof. |
| `20-29` | Content, research, and copy | Writing, enrichment, repurposing, market/research/watch, and copy audits. |
| `30-39` | Docs, context, and support | Docs, help, context, changelog, init, scaffold, status, tasks. |
| `40-49` | Audit, quality, ops risk | Audit master, code/deps/perf/migrate/prod/SEO/i18n/GTM/a11y. |
| `50-59` | Design and components | Design-system, playground, design audit, tokens, component audit. |
| `60-69` | Data and activation | Local-cloud sync and future account/data/activation surfaces. |
| `70-79` | Pilotage and session helpers | Explore, backlog, priorities, review, model choice, resume helpers. |
| `80-89` | Conversation and transcript helpers | Conversation audit and transcript tooling. |
| `90-99` | Reserved rare meta space | Reserved for future rare or migration-only skills. |

Frequency wins over family when a skill belongs to both. For example `sf-content` is a master entrypoint, so it gets `07` instead of `20`.

## Code Table

| Code | Skill | Family | Display label |
| --- | --- | --- | --- |
| `00` | `shipflow` | Global/master | `00-shipflow` |
| `01` | `sf-build` | Global/master | `01-sf-build` |
| `02` | `sf-maintain` | Global/master | `02-sf-maintain` |
| `03` | `sf-bug` | Global/master | `03-sf-bug` |
| `04` | `sf-deploy` | Global/master | `04-sf-deploy` |
| `05` | `sf-ship` | Global/master | `05-sf-ship` |
| `06` | `sf-design` | Global/master | `06-sf-design` |
| `07` | `sf-content` | Global/master | `07-sf-content` |
| `08` | `sf-onboarding` | Global/master | `08-sf-onboarding` |
| `09` | `sf-skill-build` | Global/master | `09-sf-skill-build` |
| `10` | `sf-spec` | Lifecycle/proof | `10-sf-spec` |
| `11` | `sf-ready` | Lifecycle/proof | `11-sf-ready` |
| `12` | `sf-start` | Lifecycle/proof | `12-sf-start` |
| `13` | `sf-verify` | Lifecycle/proof | `13-sf-verify` |
| `14` | `sf-end` | Lifecycle/proof | `14-sf-end` |
| `15` | `sf-check` | Lifecycle/proof | `15-sf-check` |
| `16` | `sf-fix` | Lifecycle/proof | `16-sf-fix` |
| `17` | `sf-test` | Lifecycle/proof | `17-sf-test` |
| `18` | `sf-browser` | Lifecycle/proof | `18-sf-browser` |
| `19` | `sf-auth-debug` | Lifecycle/proof | `19-sf-auth-debug` |
| `20` | `sf-redact` | Content/research/copy | `20-sf-redact` |
| `21` | `sf-enrich` | Content/research/copy | `21-sf-enrich` |
| `22` | `sf-repurpose` | Content/research/copy | `22-sf-repurpose` |
| `23` | `sf-research` | Content/research/copy | `23-sf-research` |
| `24` | `sf-market-study` | Content/research/copy | `24-sf-market-study` |
| `25` | `sf-veille` | Content/research/copy | `25-sf-veille` |
| `26` | `sf-audit-copy` | Content/research/copy | `26-sf-audit-copy` |
| `27` | `sf-audit-copywriting` | Content/research/copy | `27-sf-audit-copywriting` |
| `30` | `sf-docs` | Docs/context/support | `30-sf-docs` |
| `31` | `sf-context` | Docs/context/support | `31-sf-context` |
| `32` | `sf-help` | Docs/context/support | `32-sf-help` |
| `33` | `sf-resume` | Docs/context/support | `33-sf-resume` |
| `34` | `sf-changelog` | Docs/context/support | `34-sf-changelog` |
| `35` | `sf-init` | Docs/context/support | `35-sf-init` |
| `36` | `sf-scaffold` | Docs/context/support | `36-sf-scaffold` |
| `37` | `sf-skills-refresh` | Docs/context/support | `37-sf-skills-refresh` |
| `38` | `sf-status` | Docs/context/support | `38-sf-status` |
| `39` | `sf-tasks` | Docs/context/support | `39-sf-tasks` |
| `40` | `sf-audit` | Audit/quality/ops | `40-sf-audit` |
| `41` | `sf-audit-code` | Audit/quality/ops | `41-sf-audit-code` |
| `42` | `sf-deps` | Audit/quality/ops | `42-sf-deps` |
| `43` | `sf-perf` | Audit/quality/ops | `43-sf-perf` |
| `44` | `sf-migrate` | Audit/quality/ops | `44-sf-migrate` |
| `45` | `sf-prod` | Audit/quality/ops | `45-sf-prod` |
| `46` | `sf-audit-seo` | Audit/quality/ops | `46-sf-audit-seo` |
| `47` | `sf-audit-translate` | Audit/quality/ops | `47-sf-audit-translate` |
| `48` | `sf-audit-gtm` | Audit/quality/ops | `48-sf-audit-gtm` |
| `49` | `sf-audit-a11y` | Audit/quality/ops | `49-sf-audit-a11y` |
| `50` | `sf-design-from-scratch` | Design/components | `50-sf-design-from-scratch` |
| `51` | `sf-design-playground` | Design/components | `51-sf-design-playground` |
| `52` | `sf-audit-design` | Design/components | `52-sf-audit-design` |
| `53` | `sf-audit-design-tokens` | Design/components | `53-sf-audit-design-tokens` |
| `54` | `sf-audit-components` | Design/components | `54-sf-audit-components` |
| `60` | `sf-local-cloud-sync` | Data/activation | `60-sf-local-cloud-sync` |
| `70` | `sf-explore` | Pilotage/session | `70-sf-explore` |
| `71` | `sf-backlog` | Pilotage/session | `71-sf-backlog` |
| `72` | `sf-priorities` | Pilotage/session | `72-sf-priorities` |
| `73` | `sf-review` | Pilotage/session | `73-sf-review` |
| `74` | `sf-model` | Pilotage/session | `74-sf-model` |
| `75` | `sf-conversation-audit` | Pilotage/session | `75-sf-conversation-audit` |
| `76` | `continue` | Pilotage/session | `76-continue` |
| `77` | `name` | Pilotage/session | `77-name` |
| `78` | `tmux-capture-conversation` | Conversation/transcript | `78-tmux-capture-conversation` |
| `79` | `clean-conversation-transcript` | Conversation/transcript | `79-clean-conversation-transcript` |

## Maintenance

Run this after adding, removing, or renaming a skill:

```bash
python3 tools/skill_code_index_lint.py
```

The linter must fail when:

- a code is duplicated
- a skill appears twice
- a listed skill directory is missing
- a `skills/*/SKILL.md` directory has no active code row
- the display label does not equal `<code>-<skill>`
