---
artifact: editorial_content_context
metadata_schema_version: "1.0"
artifact_version: "1.0.0"
project: ShipFlow
created: "2026-05-01"
updated: "2026-05-01"
status: reviewed
source_skill: sf-start
scope: blog-and-article-surface-policy
owner: Diane
confidence: high
risk_level: high
security_impact: yes
docs_impact: yes
content_surfaces:
  - future_blog
  - future_articles
  - public_site
claim_register: docs/editorial/claim-register.md
page_intent: docs/editorial/page-intent-map.md
linked_systems:
  - CONTENT_MAP.md
  - docs/editorial/public-surface-map.md
  - site/src/pages/
  - site/src/content.config.ts
depends_on:
  - artifact: "CONTENT_MAP.md"
    artifact_version: "0.3.0"
    required_status: draft
supersedes: []
evidence:
  - "CONTENT_MAP.md lists no dedicated blog directory or newsletter/social publishing surface."
  - "Current site/src/pages inventory has no blog route and site/src/content.config.ts has no blog collection."
next_review: "2026-06-01"
next_step: "/sf-verify ShipFlow Editorial Content Governance Layer for AI Agents"
---

# Blog And Article Surface Policy

## Current Decision

No dedicated blog path is declared yet.

ShipFlow can prepare governance for blog and article work, but agents must not create article content under invented paths such as `blog/`, `posts/`, `articles/`, `site/src/content/blog/`, or `site/src/pages/blog/` until a separate spec or explicit surface decision declares the route and content collection.

## Required Response When Blog Is Requested

If a user requests blog, article, newsletter, or long-form editorial output and no declared surface exists, report:

```text
surface missing: blog
```

Then propose the next safe step:

- `/sf-spec ShipFlow blog/article surface` when the request implies repository routes, collections, RSS, SEO, or public publishing.
- A draft-only content pack in chat or a non-runtime governance artifact when the user only wants strategy or outlines.
- A specific existing public surface when the idea belongs in FAQ, docs overview, pricing, landing page, README, or a public skill page instead of a new article.

## What A Future Blog Surface Must Declare

A separate spec or explicit surface decision must define:

- route path, such as an Astro route under `site/src/pages/`
- content collection path, if using Markdown or MDX
- `site/src/content.config.ts` schema fields
- rendering route and `getCollection()` / `getStaticPaths()` behavior when dynamic pages are used
- source contracts for claims
- target audience and page intent
- publication validation, including `npm --prefix site run build`
- internal link rules from `CONTENT_MAP.md`
- claim review through `docs/editorial/claim-register.md`

## Stop Conditions

Stop before writing article files when:

- no blog path is declared in `CONTENT_MAP.md`
- no Astro route exists for the requested article surface
- no content collection schema accepts the proposed frontmatter
- the request would publish sensitive claims without evidence
- the article would expose internal-only technical details
- the work would require adding CMS, RSS, search, analytics, or newsletter tooling outside a ready spec

## Allowed Work Before A Blog Exists

Agents may still:

- produce an article brief in chat when the user asks for draft-only strategy
- add a governance note to `CONTENT_MAP.md` or `docs/editorial/` under an explicit contract
- route the idea to existing FAQ, docs, README, landing, pricing, or public skill surfaces
- create a spec for the blog/article surface

## Maintenance Rule

Update this policy when a blog path, article surface, content collection, newsletter repository surface, RSS route, or CMS integration is explicitly declared.
