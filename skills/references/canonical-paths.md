---
artifact: technical_guidelines
metadata_schema_version: "1.0"
artifact_version: "1.3.0"
project: ShipFlow
created: "2026-04-27"
updated: "2026-06-28"
status: active
source_skill: 102-sf-start
scope: canonical-path-resolution
owner: unknown
confidence: high
risk_level: medium
security_impact: none
docs_impact: yes
linked_systems:
  - skills/
  - tools/
  - templates/
  - shipflow_data/
depends_on: []
supersedes: []
evidence:
  - "Repeated skill path-resolution failures when running from project repositories"
  - "Project governance layout decision moved ShipFlow artifacts out of project roots and into shipflow_data/."
  - "Operator decision on 2026-05-24: monorepos must keep one governance corpus at the monorepo root instead of repeating shipflow_data in each app/package."
  - "Operator decision on 2026-06-28: generated build and preview folders such as .vercel/output remain disposable local outputs, not canonical project artifacts."
next_review: "2026-05-27"
next_step: "/103-sf-verify canonical path policy"
---

# ShipFlow Canonical Paths

ShipFlow skills often run from a project repository, but ShipFlow-owned tools and references live in the ShipFlow installation. Resolve paths by ownership, not by the current working directory.

## Roots

- ShipFlow root: `${SHIPFLOW_ROOT:-$HOME/shipflow}`
- Legacy tracking compatibility path: `${SHIPFLOW_DATA_DIR:-$HOME/shipflow_data}` (read-only historical, not active source of truth)
- Project root: current working directory, unless the user explicitly gives another project path
- Governance root: the nearest canonical root for project-owned ShipFlow artifacts. In a single-project repo, this is the repository root. In a monorepo, this is the monorepo root, not an app/package subdirectory.

## Resolution Rules

- ShipFlow-owned tools, shared references, skill references, templates, workflow docs, and internal scripts must be loaded from `$SHIPFLOW_ROOT`.
- Skill-local references such as `references/foo.md` mean `$SHIPFLOW_ROOT/skills/<skill-name>/references/foo.md`, not `./references/foo.md` in the project repo.
- Project-owned artifacts are resolved from the governance-root `shipflow_data` umbrella.

  - `shipflow_data/technical/*`
  - `shipflow_data/business/*`
  - `shipflow_data/editorial/*`
  - `shipflow_data/workflow/*`

- In monorepos, prefer theme-first paths inside `shipflow_data/`, then scope by surface only when needed, for example:

  - `shipflow_data/branding/branding.md`
  - `shipflow_data/business/site/business.md`
  - `shipflow_data/product/app/product.md`
  - `shipflow_data/technical/site/*`

- Root compatibility exceptions remain at repository root:

  - `AGENT.md`
  - `CLAUDE.md`
  - `README.md`
  - `AGENTS.md` (must be a compatibility symlink to `AGENT.md`)
  - `CHANGELOG.md` (optional public/project changelog)

- `shipflow_data/` remains the project governance corpus for this phase; the external `${SHIPFLOW_DATA_DIR:-$HOME/shipflow_data}` is legacy, read-only, and not used as project-document source of truth.
- Monorepo rule: keep exactly one canonical `shipflow_data/` at the monorepo root. Do not create parallel `shipflow_data/` directories inside `apps/*`, `packages/*`, or sibling app/site/lab folders unless that subdirectory is intentionally a separately cloned and shipped standalone project.
- When running from a monorepo subdirectory, source files resolve from the target subdirectory but governance artifacts resolve from the monorepo root `shipflow_data/`.
- If both a monorepo root `shipflow_data/` and nested subproject `shipflow_data/` directories exist, treat nested copies as migration debt unless the repo documents a standalone exception.
- `shipflow_data/workflow/` holds project-level workflow artifacts such as `specs/`, `bugs/`, `audits/`, `reviews/`, `verification/`, and project-local operational trackers.
- Project-local `TASKS.md` and `AUDIT_LOG.md` live at `shipflow_data/workflow/TASKS.md` and `shipflow_data/workflow/AUDIT_LOG.md`. Root `TASKS.md` and `AUDIT_LOG.md` are legacy project tracker locations unless an external project tool explicitly requires them.
- `PROJECTS.md` is a legacy compatibility artifact when present in `${SHIPFLOW_DATA_DIR:-$HOME/shipflow_data}`; treat it as migration/degraded-discovery input only, not primary governance.
- Legacy root ShipFlow governance files such as `BUSINESS.md`, `PRODUCT.md`, `BRANDING.md`, `GTM.md`, `ARCHITECTURE.md`, `CONTENT_MAP.md`, `CONTEXT.md`, `CONTEXT-FUNCTION-TREE.md`, `GUIDELINES.md`, `TASKS.md`, and `AUDIT_LOG.md` are migration sources only. They are not compliant project artifact locations.
- Generated local-output directories such as `node_modules/`, `dist/`, `.astro/`, `.vercel/`, `.vercel/output/`, and `.playwright-mcp/` are disposable runtime artifacts, not governance artifacts, evidence artifacts, or source-of-truth project documents.
- If a ShipFlow-owned file is missing from `$SHIPFLOW_ROOT`, report a ShipFlow installation gap. Do not report it missing just because it is absent from the project repository.

## ShipFlow-Owned Tool Preflight

Before running any ShipFlow-owned tool, follow this preflight order exactly:

1. resolve `$SHIPFLOW_ROOT`
2. confirm the owned path exists under `$SHIPFLOW_ROOT`
3. confirm the target tool file exists
4. run the tool

Do not infer ShipFlow-owned tool paths from the current working directory. If this preflight is still agent-runnable, do not ask the operator to run the tool instead.

## Canonical Project Artifact Map

| Legacy root file | Canonical project path |
| --- | --- |
| `BUSINESS.md` | `shipflow_data/business/<surface>/business.md` or shared `shipflow_data/business/business.md` |
| `PRODUCT.md` | `shipflow_data/product/<surface>/product.md` or shared `shipflow_data/product/product.md` |
| `BRANDING.md` | shared `shipflow_data/branding/branding.md` |
| `GTM.md` | `shipflow_data/gtm/<surface>/gtm.md` or shared `shipflow_data/gtm/gtm.md` |
| `INSPIRATION.md` | `shipflow_data/business/<surface>/project-competitors-and-inspirations.md` |
| `AFFILIATES.md` | `shipflow_data/business/<surface>/affiliate-programs.md` |
| `CONTEXT.md` | `shipflow_data/technical/<surface>/context.md` |
| `CONTEXT-FUNCTION-TREE.md` | `shipflow_data/technical/<surface>/context-function-tree.md` |
| `ARCHITECTURE.md` | `shipflow_data/technical/<surface>/architecture.md` |
| `GUIDELINES.md` | `shipflow_data/technical/<surface>/guidelines.md` |
| `CONTENT_MAP.md` | `shipflow_data/editorial/<surface>/content-map.md` |
| `TASKS.md` | `shipflow_data/workflow/TASKS.md` |
| `AUDIT_LOG.md` | `shipflow_data/workflow/AUDIT_LOG.md` |
| `specs/*.md` | `shipflow_data/workflow/specs/*.md` |

## Command Pattern

```bash
SHIPFLOW_ROOT="${SHIPFLOW_ROOT:-$HOME/shipflow}"
"$SHIPFLOW_ROOT/tools/shipflow_metadata_lint.py"
```

Use the same pattern for other ShipFlow-owned tools and scripts.
