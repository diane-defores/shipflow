---
artifact: editorial_content_context
metadata_schema_version: "1.0"
artifact_version: "1.0.0"
project: ShipFlow
created: "2026-05-01"
updated: "2026-05-01"
status: reviewed
source_skill: sf-start
scope: editorial-governance-index
owner: Diane
confidence: high
risk_level: high
security_impact: yes
docs_impact: yes
content_surfaces:
  - public_site
  - repo_docs
  - public_skill_pages
  - future_blog
claim_register: docs/editorial/claim-register.md
page_intent: docs/editorial/page-intent-map.md
linked_systems:
  - CONTENT_MAP.md
  - site/src/pages/
  - site/src/content/skills/
  - README.md
  - skills/references/editorial-content-corpus.md
depends_on:
  - artifact: "specs/shipflow-editorial-content-governance-layer-for-ai-agents.md"
    artifact_version: "1.0.0"
    required_status: ready
  - artifact: "CONTENT_MAP.md"
    artifact_version: "0.3.0"
    required_status: draft
supersedes: []
evidence:
  - "Ready spec defines docs/editorial as the public-content governance layer."
  - "CONTENT_MAP.md remains the canonical content routing artifact."
next_review: "2026-06-01"
next_step: "/sf-verify ShipFlow Editorial Content Governance Layer for AI Agents"
---

# Editorial Governance

## Purpose

`docs/editorial/` is the public-content governance layer for ShipFlow. It tells agents where public content lives, which contracts bound each surface, which claims need proof, and how Astro runtime content schemas constrain edits.

This layer complements, but does not replace, `CONTENT_MAP.md`.

- `CONTENT_MAP.md` maps content surfaces and routing rules.
- `docs/editorial/` defines governance, page intent, claim boundaries, update gates, and runtime schema policy.
- `docs/technical/` remains internal code-proximate documentation and must not be published as public site content.

## Read Order

1. Open `CONTENT_MAP.md` to identify the canonical content surface map.
2. Open `docs/editorial/public-surface-map.md` to find affected public surfaces.
3. Open `docs/editorial/page-intent-map.md` for route intent, source contracts, CTA, and shared-file risk.
4. Open `docs/editorial/claim-register.md` when the change affects public claims.
5. Open `docs/editorial/editorial-update-gate.md` to produce an `Editorial Update Plan` and, when needed, a `Claim Impact Plan`.
6. Open `docs/editorial/astro-content-schema-policy.md` before editing `site/src/content/**`.
7. Open `docs/editorial/blog-and-article-surface-policy.md` before proposing blog or article output.

## Documents

| Doc | Open when the task touches |
| --- | --- |
| `public-surface-map.md` | Public pages, README, FAQ, pricing, docs overview, skill pages, or future content surfaces |
| `page-intent-map.md` | Astro routes, public page purpose, CTA, source of truth, or shared-file risk |
| `claim-register.md` | Security, privacy, compliance, AI, automation, speed, savings, availability, pricing, or business-outcome claims |
| `editorial-update-gate.md` | Any workstream that changes visible behavior, public docs, public copy, skill promises, FAQ, support copy, pricing, or claims |
| `astro-content-schema-policy.md` | `site/src/content/**`, public skill content, content collections, frontmatter, or Astro build risk |
| `blog-and-article-surface-policy.md` | Blog, article, newsletter, editorial post, or long-form content requests |

## Invariants

- `CONTENT_MAP.md` remains the canonical content surface map.
- Public content must stay inside `BUSINESS.md`, `PRODUCT.md`, `BRANDING.md`, `GTM.md`, specs, verified behavior, and explicit evidence.
- The Editorial Reader diagnoses public-content impact and claim impact. It does not edit, stage, format, or run destructive commands.
- Shared editorial files are sequential integration surfaces unless a ready spec assigns exclusive write ownership.
- Astro runtime content keeps the schema declared in `site/src/content.config.ts`.
- ShipFlow artifact metadata belongs in governance docs and reports, not in runtime content unless that runtime schema explicitly accepts it.
- A missing blog surface is reported as `surface missing: blog`; agents do not invent a blog route or collection.

## Editorial Reader Output

The Editorial Reader produces:

- `Editorial Update Plan`: impacted surface, source of truth, required action, owner role, parallel-safety, validation, and closure status.
- `Claim Impact Plan`: sensitive claim, evidence, allowed wording, mismatch or proof gap, affected surfaces, and stop condition.

## Maintenance Rule

Update this index when an editorial governance doc is added, renamed, removed, or when `CONTENT_MAP.md` changes the role of public surfaces. Keep this file as an entrypoint; put detailed rules in the dedicated docs.
