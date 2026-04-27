---
artifact: technical_guidelines
metadata_schema_version: "1.0"
artifact_version: "1.0.0"
project: ShipFlow
created: "2026-04-27"
updated: "2026-04-27"
status: active
source_skill: sf-start
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
next_review: "2026-05-27"
next_step: "/sf-verify canonical path policy"
---

# ShipFlow Canonical Paths

ShipFlow skills often run from a project repository, but ShipFlow-owned tools and references live in the ShipFlow installation. Resolve paths by ownership, not by the current working directory.

## Roots

- ShipFlow root: `${SHIPFLOW_ROOT:-/home/claude/shipflow}`
- ShipFlow tracking data: `/home/claude/shipflow_data`
- Project root: current working directory, unless the user explicitly gives another project path

## Resolution Rules

- ShipFlow-owned tools, shared references, skill references, templates, workflow docs, and internal scripts must be loaded from `$SHIPFLOW_ROOT`.
- Skill-local references such as `references/foo.md` mean `$SHIPFLOW_ROOT/skills/<skill-name>/references/foo.md`, not `./references/foo.md` in the project repo.
- Project-owned artifacts such as `BUSINESS.md`, `PRODUCT.md`, `specs/*.md`, `docs/**/*.md`, source code, package files, and tests are resolved from the project root.
- Global trackers and registries such as `TASKS.md`, `PROJECTS.md`, and `AUDIT_LOG.md` are resolved from `/home/claude/shipflow_data` when the skill names the master tracker.
- If a ShipFlow-owned file is missing from `$SHIPFLOW_ROOT`, report a ShipFlow installation gap. Do not report it missing just because it is absent from the project repository.

## Command Pattern

```bash
SHIPFLOW_ROOT="${SHIPFLOW_ROOT:-/home/claude/shipflow}"
"$SHIPFLOW_ROOT/tools/shipflow_metadata_lint.py"
```

Use the same pattern for other ShipFlow-owned tools and scripts.
