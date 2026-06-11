---
artifact: documentation
metadata_schema_version: "1.0"
artifact_version: "1.0.0"
project: ShipFlow
created: "2026-06-11"
updated: "2026-06-11"
status: reviewed
source_skill: 300-sf-docs
scope: shipflow-data-index
owner: Diane
confidence: high
risk_level: medium
security_impact: yes
docs_impact: yes
linked_systems:
  - shipflow_data/business/
  - shipflow_data/technical/
  - shipflow_data/editorial/
  - shipflow_data/workflow/
  - skills/references/canonical-paths.md
  - shipflow_data/technical/code-docs-map.md
depends_on:
  - artifact: "skills/references/canonical-paths.md"
    artifact_version: "1.2.0"
    required_status: active
supersedes: []
evidence:
  - "2026-06-11 README updated from legacy central-control-plane wording to canonical shipflow_data layout."
  - "Current repository stores active trackers under shipflow_data/workflow and decision contracts under business, technical, and editorial folders."
next_review: "2026-06-18"
next_step: "/300-sf-docs update shipflow_data README"
---

# shipflow_data

`shipflow_data/` is ShipFlow's canonical governance and workflow corpus for this repository.

It stores durable project truth close to the repo: business decisions, technical contracts, editorial/public-content rules, specs, trackers, audits, test checklists, and evidence. Legacy root files and the old external `~/shipflow_data` control-plane model are migration context only.

## Directory Map

| Path | Role |
| --- | --- |
| `business/` | Product, business, brand, GTM, competitor, and affiliate decision contracts |
| `technical/` | Internal technical docs, architecture, code-docs map, subsystem contracts, external platform notes |
| `editorial/` | Public-content governance, claim register, page intent, content map, and Astro content schema policy |
| `workflow/` | Operational trackers, specs, audits, research, evidence, test checklists, conversations, and archives |
| `workflow/TASKS.md` | Active executable work tracker |
| `workflow/AUDIT_LOG.md` | Operational audit tracker |
| `workflow/PROJECTS.md` | Workspace/project registry compatibility tracker |
| `workflow/specs/` | Spec-first chantier contracts and run history |
| `workflow/conversation-audits/` | Audits of agent conversations and recurring execution failures |

## Read Order

1. Start with `AGENT.md` at the repository root for agent routing.
2. Use `shipflow_data/technical/context.md` for the compact operational map.
3. Use `shipflow_data/technical/code-docs-map.md` when code or packaging changes require docs alignment.
4. Use `shipflow_data/business/` before product, pricing, positioning, onboarding, or public-promise work.
5. Use `shipflow_data/editorial/` before changing public pages, claims, docs, FAQ, pricing copy, or skill pages.
6. Use `shipflow_data/workflow/specs/` for non-trivial implementation contracts and chantier history.
7. Use `shipflow_data/workflow/TASKS.md` only for active operational tracking, not durable decisions.

## Maintenance Rules

- Keep durable decisions in versioned artifacts with frontmatter.
- Keep fast-changing trackers in `workflow/`; do not force frontmatter onto operational trackers.
- Move stale legacy root governance files into the canonical folder only through an explicit migration pass.
- Do not publish `shipflow_data/technical/` as public website content.
- Keep `site/`, `README.md`, and public docs aligned with `editorial/` and `business/` before making public claims.
- Keep packaging and plugin claims aligned with `shipflow_data/technical/codex-plugin-packaging.md`.

## Validation

Run focused metadata checks after editing versioned artifacts:

```bash
python3 tools/shipflow_metadata_lint.py shipflow_data/README.md
```

For technical-doc changes, also use the code-docs map:

```bash
python3 tools/shipflow_metadata_lint.py shipflow_data/technical
rg -n "Maintenance Rule|Validation|Owned Files|Entrypoints" shipflow_data/technical templates/artifacts/technical_module_context.md
```
