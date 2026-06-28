---
artifact: technical_guidelines
metadata_schema_version: "1.0"
artifact_version: "1.7.0"
project: ShipFlow
created: "2026-05-01"
updated: "2026-06-11"
status: active
source_skill: 102-sf-start
scope: technical-docs-corpus
owner: Diane
confidence: high
risk_level: medium
security_impact: yes
docs_impact: yes
linked_systems:
  - shipflow_data/technical/
  - shipflow_data/technical/code-docs-map.md
  - shipflow_data/technical/design-system-authority.md
  - shipflow_data/technical/external-platforms/
  - templates/artifacts/project_platform_usage.md
  - templates/artifacts/technical_module_context.md
  - skills/300-sf-docs/SKILL.md
depends_on:
  - artifact: "shipflow_data/technical/code-docs-map.md"
    artifact_version: "1.1.0"
    required_status: reviewed
supersedes: []
evidence:
  - "Ready spec requires a skill-facing reference for technical docs loading."
  - "300-sf-docs first-run bootstrap and update adoption now treat missing code-docs maps as recoverable bootstrap state."
  - "External platform corpus added for global Freshness Gate source notes and governance-root provider usage docs."
  - "Operator decision on 2026-05-24: provider usage notes are risk-driven, not mandatory per technology."
  - "Operator decision on 2026-05-24: monorepos use one root shipflow_data corpus with scoped app/package coverage."
  - "Operator decision on 2026-06-11: UI projects need an explicit design-system authority so agents cannot bypass centralized tokens."
next_review: "2026-06-01"
next_step: "/300-sf-docs technical audit"
---

# Technical Docs Corpus

## Purpose

This reference tells ShipFlow skills how to use the internal `shipflow_data/technical/` layer without loading the whole repository or turning agent entry files into mega-docs.

## Loading Rule

1. Resolve the governance root first. In a monorepo, use the monorepo-root `shipflow_data/`, not a nested app/package `shipflow_data/`.
2. Read `shipflow_data/technical/code-docs-map.md` first for any code-changing task when it exists; if it is missing, report a technical governance bootstrap trigger and route to `/300-sf-docs technical`. Legacy `docs/technical/code-docs-map.md` is a migration source only.
3. Match changed or target paths to the map when present.
4. Load only the primary technical doc and necessary secondary docs.
5. Produce a `Documentation Update Plan` after every code-changing execution wave and again during end verification.
6. Keep shared docs sequential unless the ready spec assigns disjoint ownership.
7. When a task depends on an external provider, SDK, framework, hosting platform, API, or toolchain behavior, read the matching global note under `shipflow_data/technical/external-platforms/` when it exists. Then read the governance-root usage note under `shipflow_data/technical/platforms/` only when it exists or when the task is materially affected by project-specific provider configuration.
8. For UI projects, read the surface-scoped design-system authority such as `shipflow_data/technical/<surface>/design-system-authority.md`, or the documented equivalent, before UI/design implementation, audits, scaffolding, verification, or platform parity work. If it is missing, report a technical governance bootstrap trigger and route to `/300-sf-docs technical` or `/006-sf-design` before visual changes.

## `300-sf-docs` Technical Mode Contract

`300-sf-docs technical` or `300-sf-docs technical audit` should:

- treat a missing `shipflow_data/technical/code-docs-map.md` as a first-run bootstrap trigger, not as an immediate read failure
- create baseline `shipflow_data/technical/README.md` and `shipflow_data/technical/code-docs-map.md` governance scaffolding for code projects when safe
- in monorepos, create or update the technical layer only at the monorepo root, prefer theme-first folders, and scope surfaces inside `shipflow_data/technical/<surface>/` or `code-docs-map.md`
- report nested app/package `shipflow_data/` directories as migration debt unless a standalone-project exception is documented
- record an explicit `non-coverage` reason when no major code area can be mapped
- verify that every major code area in `code-docs-map.md` has a primary technical doc or explicit non-coverage reason
- scaffold missing subsystem docs from `templates/artifacts/technical_module_context.md`
- check stale path references, missing validations, missing `Maintenance Rule` sections, and missing Reader triggers
- check whether UI projects declare `shipflow_data/technical/<surface>/design-system-authority.md` or an equivalent authority covering brand contract, token source, theme carrier, component bridge, layout/motion authority, forbidden bypasses, and validation
- check global external platform notes when provider behavior is part of the documented technical contract
- report a governance-root platform usage gap only when provider use is project-specific enough to affect validation, auth, deploy, runtime, SDK behavior, storage, security, migrations, secrets handling, observability, compliance, or production proof
- verify that `technical_module_context` files pass `tools/shipflow_metadata_lint.py`
- fail or report a blocking gap when a mapped code area changed but no impacted doc appears in the `Documentation Update Plan`

`300-sf-docs update` should also detect missing technical governance in existing projects and report one of `created`, `already existed`, `needs audit`, `skipped - no code areas detected`, or `blocked` with `/300-sf-docs technical` as the recovery command.

## Documentation Update Plan

Use the format defined in `shipflow_data/technical/code-docs-map.md`. The owner role is usually `executor` for the subsystem doc and `integrator` for shared files such as `code-docs-map.md`, `AGENT.md`, `shipflow_data/technical/context.md`, `shipflow_data/technical/guidelines.md`, and `shipflow-spec-driven-workflow.md`.

## External Platform Corpus

Global provider notes live under `shipflow_data/technical/external-platforms/`. They preserve source maps and ShipFlow decision rules for the Freshness Gate, but they must not duplicate vendor documentation.

Provider usage lives under the governance root at `shipflow_data/technical/platforms/<provider>.md`. In a monorepo, the same note can cover one app/package or multiple surfaces; use explicit scope and path references instead of duplicating notes under each subdirectory. These files document actual adoption: environments, validation surface, domains/callback expectations, env var keys, MCP/CLI evidence route, and local exceptions.

Do not require one usage note per technology. Create one from `templates/artifacts/project_platform_usage.md` only when local usage changes the agent's decisions or proof route. For standard, low-risk usage where the code/config plus the global platform note are enough, record `not needed - standard usage covered by code/config and global note` instead of creating filler documentation.

Use the global note to decide what current external sources to check. Use the governance-root usage note to decide whether local, preview, production, MCP, CLI, browser, or manual proof is authoritative for that project or monorepo surface.

## Safety Rules

- The Reader diagnoses impact; it does not silently edit docs unless explicitly assigned.
- `shipflow_data/technical/` is internal-only in v1.
- Do not copy secrets, tokens, private URLs, raw logs, cookies, or credentials into technical docs.
- Do not copy vendor documentation into the corpus; keep source links, operational rules, freshness evidence, and project-specific adoption details.
- Do not add per-file `last_verified_against` fields in v1.
- If `AGENTS.md` exists, it must be a symlink to `AGENT.md`.

## Maintenance Rule

Update this reference when the technical docs map, template, Reader plan format, or `300-sf-docs` technical mode contract changes.
