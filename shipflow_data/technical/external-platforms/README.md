---
artifact: technical_module_context
metadata_schema_version: "1.0"
artifact_version: "0.2.0"
project: ShipFlow
created: "2026-05-24"
updated: "2026-05-24"
status: draft
source_skill: sf-docs
scope: external-platforms-corpus
owner: Diane
confidence: high
risk_level: high
security_impact: yes
docs_impact: yes
linked_systems:
  - skills/references/documentation-freshness-gate.md
  - skills/references/technical-docs-corpus.md
  - shipflow_data/technical/code-docs-map.md
  - templates/artifacts/project_platform_usage.md
depends_on:
  - artifact: "skills/references/documentation-freshness-gate.md"
    artifact_version: "unknown"
    required_status: "active"
supersedes: []
evidence:
  - "Operator decision on 2026-05-24: maintain a global source corpus for Freshness Gate and project-local usage docs for precise project adoption."
  - "Initial common provider set added: Vercel, Firecrawl, Convex, Clerk, Firebase, Google Cloud, Supabase, Sentry, Astro, Python, Bash, and Gum."
next_review: "2026-06-24"
next_step: "/sf-docs technical audit"
---

# External Platforms Corpus

## Purpose

This directory is the global ShipFlow technical source layer for external platforms, SDKs, providers, and tools that often affect implementation quality, security, deployment proof, dependency upgrades, and technical freshness.

It is not a mirror of vendor documentation. Each platform note is a short, source-backed operational cheat sheet that tells agents where to verify current behavior and how that provider usually affects ShipFlow decisions.

## Global vs Project-Local

Use two layers:

- Global platform note: `shipflow_data/technical/external-platforms/<provider>.md`
- Project-local usage note: `<project>/shipflow_data/technical/platforms/<provider>.md`

The global note records official sources, freshness anchors, recurring risks, command/tool routing, and ShipFlow decision rules. The project-local note records how one project actually uses the provider: environment, domains, validation surface, integrations, secrets locations by name only, and known exceptions.

Do not put project secrets, private deployment URLs, tokens, raw logs, or account-specific identifiers in either layer. Project-local notes may name expected environment variable keys, provider features, and validation commands, but not secret values.

## When Agents Should Read This Corpus

Read the relevant global platform note when a task depends on:

- deployment, build, runtime, environment, caching, logs, or preview/production semantics
- SDK behavior, API shape, release notes, deprecations, migrations, or security advisories
- auth callbacks, cookies, domains, webhooks, storage, AI providers, background jobs, or external APIs
- dependency upgrades where release notes may imply code or configuration changes
- an `sf-deps`, `sf-audit-code`, `sf-migrate`, `sf-prod`, `sf-auth-debug`, `sf-verify`, or future `sf-tech-watch` decision

Then read the project-local usage note if the current project uses that provider. If the project clearly uses a provider but has no local note, report a documentation gap and recommend creating one from `templates/artifacts/project_platform_usage.md`.

## Freshness Policy

Global platform notes must keep links to primary sources:

- official docs overview or canonical guide
- official CLI/API reference when relevant
- changelog or releases feed
- security/advisory/status source when relevant

Changelogs, release notes, GitHub issues, and blogs can explain symptoms or trigger review, but implementation decisions still need official docs or primary source confirmation unless the platform has no better source.

## Platform Note Minimum Sections

Each provider note should include:

- Purpose
- Source Map
- Freshness Gate Use
- ShipFlow Decision Rules
- Common Project-Local Fields
- Security Notes
- Validation
- Reader Checklist
- Maintenance Rule

## Current Global Notes

- `astro.md`
- `bash.md`
- `clerk.md`
- `convex.md`
- `firebase.md`
- `firecrawl.md`
- `google-cloud.md`
- `gum.md`
- `python.md`
- `sentry.md`
- `supabase.md`
- `vercel.md`

## Maintenance Rule

Update this index when a global provider note is added, renamed, removed, or when the project-local usage template changes.
