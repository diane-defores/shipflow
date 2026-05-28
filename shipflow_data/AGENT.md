---
artifact: documentation
metadata_schema_version: "1.0"
artifact_version: "0.1.0"
project: "shipflow_data"
created: "2026-04-26"
updated: "2026-04-26"
status: draft
source_skill: manual
scope: "agent-entrypoint"
owner: "unknown"
confidence: "medium"
risk_level: "low"
security_impact: "none"
docs_impact: "yes"
linked_systems:
  - "shipflow_data/CLAUDE.md"
  - "shipflow_data/CONTEXT.md"
  - "shipflow_data/CONTEXT-FUNCTION-TREE.md"
  - "shipflow_data/ARCHITECTURE.md"
  - "shipflow_data/TASKS.md"
  - "shipflow_data/AUDIT_LOG.md"
  - "shipflow_data/PROJECTS.md"
  - "shipflow_data/migrations/shipflow_data_metadata_inventory.md"
evidence:
  - "shipflow_data/CLAUDE.md"
  - "shipflow_data/PROJECTS.md"
  - "shipflow_data/migrations/shipflow_data_metadata_inventory.md"
depends_on: []
supersedes: []
next_step: "/sf-docs update AGENT.md"
---

# AGENT — shipflow_data

This is the first file to read when working in `/home/claude/shipflow_data`.

## Read Order (required)

1. Read `CLAUDE.md` for workspace-level constraints and cross-project conventions.
2. Read `CONTEXT.md` for purpose, scope, and routing.
3. Read `CONTEXT-FUNCTION-TREE.md` for operational structure.
4. Read `ARCHITECTURE.md` if your change affects cross-project coordination.
5. Read `TASKS.md` + `AUDIT_LOG.md` when touching planning or historical traceability.

## Routing by Task

- Project tracking updates:
  - Open `PROJECTS.md` for registry changes and `TASKS.md` for global backlog status.
- Project-level backlog work:
  - Open `projects/<name>/TASKS.md` for project-specific execution details.
- Content/guideline docs (AI/UX/gamification):
  - Open `autre/*.md`.
- Metadata migration and doc hardening:
  - Start from `migrations/shipflow_data_metadata_inventory.md`.
  - Continue in `AGENT.md`, then `CONTEXT.md`.
- Audit history:
  - Open `AUDIT_LOG.md`, then update related project/task artifacts as needed.

## Operational Rules

- Preserve the root `TASKS.md`, `AUDIT_LOG.md`, and `PROJECTS.md` as operational files.
- Keep decisions in `shipflow_data` durable only when they are cross-project contracts.
- Do not migrate every legacy file blindly; classify first, then add metadata where useful.
- Avoid changing file scopes (project registry vs project-local files) without checking project `CLAUDE.md`.
- If a task touches only one project, keep changes in that project’s local docs unless there is a global coordination reason.

## Quick Entry Points

- `shipflow_data/CLAUDE.md`: workspace overview and global workflow constraints.
- `shipflow_data/PROJECTS.md`: project list and stack matrix.
- `shipflow_data/TASKS.md`: master operational plan.
- `shipflow_data/AUDIT_LOG.md`: global audit timeline.
- `shipflow_data/autre/AI_GUIDELINES.md`: AI operating constraints.
- `shipflow_data/autre/UX_GUIDELINES.md`: UX-related shared standards.
