---
artifact: technical_guidelines
metadata_schema_version: "1.0"
artifact_version: "1.0.0"
project: ShipFlow
created: "2026-06-28"
updated: "2026-06-28"
status: active
source_skill: 007-sf-content
scope: content-router
owner: Diane
confidence: high
risk_level: medium
security_impact: yes
docs_impact: yes
linked_systems:
  - skills/007-sf-content/SKILL.md
  - skills/references/source-intake-classification.md
  - skills/references/editorial-content-corpus.md
  - skills/references/content-quality-rubric.md
depends_on:
  - artifact: "skills/references/source-intake-classification.md"
    artifact_version: "1.0.0"
    required_status: "active"
  - artifact: "skills/references/editorial-content-corpus.md"
    artifact_version: "1.4.0"
    required_status: "active"
  - artifact: "skills/references/content-quality-rubric.md"
    artifact_version: "1.0.0"
    required_status: "active"
supersedes: []
evidence:
  - "007-sf-content currently carries both lifecycle routing and detailed owner/delegation doctrine."
  - "Instruction layering calls for detailed matrices and long workflow detail to move into references."
next_review: "2026-07-05"
next_step: "/300-sf-docs update if the routing model changes"
---

# Content Router

## Purpose

Shared routing detail for `007-sf-content`.

## Source Intake

When a pasted source, email, URL, transcript, note, article, or example arrives without a settled project, surface, angle, or owner route, load `$SHIPFLOW_ROOT/skills/references/source-intake-classification.md` before choosing the content lane.

## Mode Map

- `plan`, `strategy`, `calendar`, `content plan` -> content plan, use `100-sf-spec` when durable or multi-surface.
- `repurpose`, `source`, `conversation`, `faq`, `release notes`, `site update` -> `202-sf-repurpose`.
- `draft`, `write`, `article`, `blog`, `guide`, `editorial` -> `200-sf-redact` after surface and claim gates.
- `enrich`, `refresh`, `update @file`, `improve` -> `201-sf-enrich`.
- `audit`, `copy`, `copywriting`, `seo` -> `206-sf-audit-copy`, `207-sf-audit-copywriting`, and/or `406-sf-audit-seo`.
- `docs`, `readme`, `editorial`, `content governance` -> `300-sf-docs`.
- `veille`, URLs, pasted external trend/source content -> `205-sf-veille`, `203-sf-research`, or `204-sf-market-study`.
- `apply`, `publish`, `ship` -> validate, then `103-sf-verify` and `005-sf-ship` when bounded.

## Spec Gate

Use spec-first when:

- multiple public surfaces are affected;
- a new content surface, route, collection, newsletter, social repository, or blog path is needed;
- sensitive public claims are added or strengthened;
- content strategy, SEO architecture, funnel narrative, pricing copy, or support copy changes materially;
- parallel content work would touch shared maps, public pages, shared components, `site/src/content.config.ts`, README, FAQ, docs overview, pricing, or claim register;
- the work needs validation or ship routing beyond one direct local edit.

Route to `/700-sf-explore <idea>` before `/100-sf-spec` when source truth or surface placement is fuzzy.

## Content Governance Gate

For public or potentially public content:

1. Read `shipflow_data/editorial/content-map.md` when present.
2. Read `$SHIPFLOW_ROOT/skills/references/editorial-content-corpus.md` when available.
3. Check `public-surface-map`, `page-intent-map`, `claim-register`, `blog-and-article-surface-policy`, and `astro-content-schema-policy` when present.
4. Produce `Editorial Update Plan` and `Claim Impact Plan` when relevant.
5. Stop if no declared blog/article surface exists and the request needs one.

## Owner Skill Routing

| Need | Owner |
| --- | --- |
| External URL/source triage | `205-sf-veille` |
| Deep research report | `203-sf-research` |
| Market/keyword/competitor demand study | `204-sf-market-study` |
| Source-faithful content pack or applied repurposing | `202-sf-repurpose` |
| Original long-form article, guide, or editorial draft | `200-sf-redact` |
| Upgrade existing content with research and better structure | `201-sf-enrich` |
| Clarity, tone, CTA, and page-level copy audit | `206-sf-audit-copy` |
| Persona, offer, persuasion, and conversion audit | `207-sf-audit-copywriting` |
| Technical/on-page SEO and search intent audit | `406-sf-audit-seo` |
| README/docs/content governance update | `300-sf-docs` |
| Public browser proof | `108-sf-browser` |
| Verification | `103-sf-verify` |
| Ship | `005-sf-ship` |

## Validation

Use the content-quality rubric whenever `007-sf-content` emits or consumes a scored editorial output.
