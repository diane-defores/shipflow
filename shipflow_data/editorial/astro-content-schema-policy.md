---
artifact: editorial_content_context
metadata_schema_version: "1.0"
artifact_version: "1.0.0"
project: ShipFlow
created: "2026-05-01"
updated: "2026-05-01"
status: reviewed
source_skill: sf-start
scope: astro-content-schema-policy
owner: Diane
confidence: high
risk_level: high
security_impact: yes
docs_impact: yes
content_surfaces:
  - public_skill_pages
  - public_site
  - runtime_content
claim_register: docs/editorial/claim-register.md
page_intent: docs/editorial/page-intent-map.md
linked_systems:
  - site/package.json
  - site/package-lock.json
  - site/src/content.config.ts
  - site/src/content/skills/
  - site/src/pages/skills/[slug].astro
depends_on:
  - artifact: "specs/shipflow-editorial-content-governance-layer-for-ai-agents.md"
    artifact_version: "1.0.0"
    required_status: ready
supersedes: []
evidence:
  - "Local Astro version is 5.18.1 from site/package-lock.json."
  - "Context7 /withastro/docs confirms src/pages file-based routing, content collections with defineCollection and Zod schema, and getCollection/getStaticPaths routing."
next_review: "2026-06-01"
next_step: "/sf-verify ShipFlow Editorial Content Governance Layer for AI Agents"
---

# Astro Content Schema Policy

## Purpose

This policy keeps ShipFlow editorial work from breaking the public Astro site. Runtime content is not a ShipFlow governance artifact unless its collection schema explicitly allows ShipFlow metadata fields.

## Local Astro Setup

- Local Astro version: `Astro 5.18.1`.
- Runtime package files: `site/package.json` and `site/package-lock.json`.
- Content schema file: `site/src/content.config.ts`.
- Current content collection: `skills`.
- Public skill entries: `site/src/content/skills/*.md`.
- Dynamic route: `site/src/pages/skills/[slug].astro`.

## Current Skills Collection Schema

`site/src/content.config.ts` defines the `skills` collection with `defineCollection` and a strict `z.object` schema. Current required fields include:

- `title`
- `tagline`
- `summary`
- `category`
- `audience`
- `problem`
- `outcome`
- `founder_angle`
- `when_to_use`
- `what_you_give`
- `what_you_get`
- `example_prompts`
- `limits`
- `related_skills`
- `order`

Current optional/defaulted fields include:

- `argument_modes`
- `featured`

Do not add `metadata_schema_version`, `artifact_version`, `depends_on`, or other ShipFlow governance metadata to `site/src/content/skills/*.md` unless `site/src/content.config.ts` is explicitly changed to accept those fields.

## Current Astro Docs Evidence

Context7 `/withastro/docs` confirms the rules this repo depends on:

- Files in `src/pages/` become routes through file-based routing.
- Content collections are registered from `src/content.config.ts` with `defineCollection` and Zod schema validation.
- Collection entries are queried with `getCollection()`.
- Dynamic pages use `getStaticPaths()` to generate static routes.

This matches the current implementation: `site/src/pages/skills/[slug].astro` calls `getCollection("skills")` and returns `params` plus `props` in `getStaticPaths()`.

## Runtime Content Rules

- Preserve frontmatter fields exactly inside the active schema.
- Add public-copy fields only after checking `site/src/content.config.ts`.
- Record ShipFlow context versions in the work report, Editorial Update Plan, or governance doc when the runtime schema does not accept them.
- Validate with `npm --prefix site run build` after content collection edits.
- If schema validation fails, fix the runtime content or route the schema change through a separate explicit contract.

## Governance Content Rules

- `docs/editorial/**` uses ShipFlow metadata and is linted as `editorial_content_context`.
- `templates/artifacts/editorial_content_context.md` is the template for future editorial governance artifacts.
- Runtime content and governance content are separate. Do not solve governance traceability by polluting Astro content frontmatter.

## Failure Behavior

- If an agent needs to add a field to `site/src/content/skills/*.md`, it must first confirm the field is accepted by `site/src/content.config.ts`.
- If a content collection schema rejects additional fields, preserve the schema and report the context in the plan/report.
- If a task needs a new collection or route, route to a separate spec unless the ready contract already includes that schema change.

## Maintenance Rule

Update this file when `site/src/content.config.ts`, Astro major version, collection names, required skill fields, dynamic routes, or runtime content policy changes.
