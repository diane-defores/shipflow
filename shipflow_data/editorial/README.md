---
artifact: editorial_content_context
metadata_schema_version: "1.0"
artifact_version: "1.3.0"
project: ShipFlow
created: "2026-05-01"
updated: "2026-06-28"
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
claim_register: shipflow_data/editorial/claim-register.md
page_intent: shipflow_data/editorial/page-intent-map.md
linked_systems:
  - shipflow_data/editorial/content-map.md
  - site/src/pages/
  - site/src/content/skills/
  - README.md
  - skills/references/editorial-content-corpus.md
depends_on:
  - artifact: "shipflow_data/workflow/specs/shipflow-editorial-content-governance-layer-for-ai-agents.md"
    artifact_version: "1.0.0"
    required_status: ready
  - artifact: "shipflow_data/editorial/content-map.md"
    artifact_version: "0.7.0"
    required_status: draft
supersedes: []
evidence:
  - "Ready spec defines shipflow_data/editorial as the public-content governance layer."
  - "shipflow_data/editorial/content-map.md remains the canonical content routing artifact."
next_review: "2026-06-01"
next_step: "/sf-verify ShipFlow Editorial Content Governance Layer for AI Agents"
---

# Editorial Governance

## Purpose

`shipflow_data/editorial/` is the public-content governance layer for ShipFlow. It shows where public content lives, which contracts govern each surface, which claims need proof, and how Astro runtime content schemas constrain edits.

This layer complements, but does not replace, `shipflow_data/editorial/content-map.md`.

- `shipflow_data/editorial/content-map.md` maps content surfaces and routing rules.
- `shipflow_data/editorial/` defines governance, page intent, claim boundaries, update gates, runtime schema policy, and the declared blog/article publishing surface.
- `shipflow_data/technical/` remains internal code-proximate documentation and must not be published as public site content.

## Read Order

1. Open `shipflow_data/editorial/content-map.md` to identify the canonical content surface map.
2. Open `shipflow_data/editorial/public-surface-map.md` to find affected public surfaces.
3. Open `shipflow_data/editorial/page-intent-map.md` for route intent, source contracts, CTA, and shared-file risk.
4. Open `shipflow_data/editorial/claim-register.md` when the change affects public claims.
5. Open `shipflow_data/editorial/editorial-update-gate.md` to produce an `Editorial Update Plan` and, when needed, a `Claim Impact Plan`.
6. Open `shipflow_data/editorial/astro-content-schema-policy.md` before editing `site/src/content/**`.
7. Open `shipflow_data/editorial/blog-and-article-surface-policy.md` before proposing blog or article output.

## Documents

| Doc | Open when the task touches |
| --- | --- |
| `public-surface-map.md` | Public pages, README, FAQ, pricing, docs overview, skill pages, or future content surfaces |
| `page-intent-map.md` | Astro routes, public page purpose, CTA, source of truth, or shared-file risk |
| `claim-register.md` | Security, privacy, compliance, AI, automation, speed, savings, availability, pricing, or business-outcome claims |
| `editorial-update-gate.md` | Any workstream that changes visible behavior, public docs, public copy, skill promises, FAQ, support copy, pricing, or claims |
| `astro-content-schema-policy.md` | `site/src/content/**`, public skill content, content collections, frontmatter, or Astro build risk |
| `blog-and-article-surface-policy.md` | Blog, article, newsletter, editorial post, or long-form content requests |

## Content Quality Scoring

Use `skills/references/content-quality-rubric.md` when a workflow, spec, or operator asks whether content is good enough for a specific project. The rubric is shared across `sf-content`, `sf-repurpose`, `sf-redact`, `sf-enrich`, `sf-audit-copy`, `sf-audit-copywriting`, `sf-seo`, and `sf-verify`; do not create a project-specific skill for scoring.

The scoring context comes from `shipflow_data/business/business.md`, `shipflow_data/business/product.md`, `shipflow_data/branding/branding.md`, `shipflow_data/business/gtm.md`, `shipflow_data/business/portfolio-project-pitch-links.md`, `shipflow_data/editorial/content-map.md`, `shipflow_data/editorial/page-intent-map.md`, and `shipflow_data/editorial/claim-register.md`. A valid report includes the global score, criterion scores, weights, final status, blocked reasons, evidence, recommendations, confidence, and applied project-rule revisions.

Allowed final statuses are `ready`, `needs revision`, `blocked`, and `publishable with caveats`. Blocking criteria such as unsupported sensitive claims, unresolved project context, missing or invalid surfaces, stale rules, conflicting score state, or missing required schema fields override the numeric score.

## Invariants

- `shipflow_data/editorial/content-map.md` remains the canonical content surface map.
- Public content must stay inside `shipflow_data/business/business.md`, `shipflow_data/business/product.md`, `shipflow_data/branding/branding.md`, `shipflow_data/business/gtm.md`, `shipflow_data/business/portfolio-project-pitch-links.md`, specs, verified behavior, and explicit evidence.
- The Editorial Reader diagnoses public-content impact and claim impact. It does not edit, stage, format, or run destructive commands.
- Shared editorial files are sequential integration surfaces unless a ready spec assigns exclusive write ownership.
- Astro runtime content keeps the schema declared in `site/src/content.config.ts`.
- ShipFlow artifact metadata belongs in governance docs and reports, not in runtime content unless that runtime schema explicitly accepts it.
- The declared indexed blog surface lives in `site/src/content/articles/` plus `/blog` and `/fr/blog` routes. Agents do not invent parallel article systems outside that contract.
- Any declared product must appear in a governed product inventory, and any product with public marketing or conversion intent must also declare its sales/product/delivery surfaces somewhere in the governed corpus; if required URLs or proof surfaces are absent, report `surface missing` or `pending final copy` instead of guessing.
- Any public product claim must be traceable to a governing source, a real surface, or explicit proof. If a claim cannot be verified, downgrade it to `pending final copy`, `surface missing`, or remove it.
- Product claims must be checked against the product registry, delivery path, public route, screenshot, video, or observed behavior before they are treated as validated.
- When in doubt, prefer a reference to `editorial-update-gate.md` for claim handling and to `page-intent-map.md` for page-level public surfaces.

## Editorial Reader Output

The Editorial Reader produces:

- `Editorial Update Plan`: impacted surface, source of truth, required action, owner role, parallel-safety, validation, and closure status.
- `Claim Impact Plan`: sensitive claim, evidence, allowed wording, mismatch or proof gap, affected surfaces, and stop condition.

## Maintenance Rule

Update this index when an editorial governance doc is added, renamed, removed, or when `shipflow_data/editorial/content-map.md` changes the role of public surfaces. Keep this file as an entrypoint; put detailed rules in the dedicated docs.
