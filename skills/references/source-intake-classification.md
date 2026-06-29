---
artifact: technical_guidelines
metadata_schema_version: "1.0"
artifact_version: "1.0.0"
project: ShipFlow
created: "2026-06-29"
updated: "2026-06-29"
status: active
source_skill: 000-shipflow
scope: source-intake-classification
owner: unknown
confidence: high
risk_level: medium
security_impact: yes
docs_impact: yes
linked_systems:
  - skills/000-shipflow/SKILL.md
  - skills/007-sf-content/SKILL.md
  - skills/202-sf-repurpose/SKILL.md
  - skills/emailing/SKILL.md
  - shipflow_data/editorial/content-map.md
  - shipflow_data/business/business.md
  - shipflow_data/business/product.md
  - shipflow_data/business/branding.md
  - shipflow_data/business/gtm.md
depends_on:
  - artifact: "shipflow_data/editorial/content-map.md"
    artifact_version: "0.9.0"
    required_status: draft
  - artifact: "shipflow_data/business/business.md"
    artifact_version: "1.2.0"
    required_status: reviewed
  - artifact: "shipflow_data/business/product.md"
    artifact_version: "1.2.0"
    required_status: reviewed
  - artifact: "shipflow_data/business/branding.md"
    artifact_version: "1.1.0"
    required_status: reviewed
  - artifact: "shipflow_data/business/gtm.md"
    artifact_version: "1.2.0"
    required_status: reviewed
supersedes: []
evidence:
  - "Operator request 2026-06-29: centralize source analysis and project/angle classification instead of repeating it in every transforming skill."
  - "Existing content and email skills need shared source intake before deciding whether to repurpose, draft, audit, classify, or route."
next_review: "2026-07-29"
next_step: "/103-sf-verify source-intake-classification"
---

# Source Intake Classification

## Purpose

This reference defines the shared first pass for user-provided sources: pasted emails, notes, transcripts, URLs, articles, screenshot text, feedback, docs, or other raw material.

It answers:

```text
What is this source, where does it belong, which angle is useful, and which owner skill should act next?
```

It does not replace `202-sf-repurpose`, `007-sf-content`, `emailing`, research, copy audit, or docs owners. It prevents each of them from reinventing the same classification step.

## Trigger

Load this reference when:

- the user provides a source and asks what to do with it
- the user uses `#source`
- a skill receives an external email, URL, transcript, article, note, or competitor/content example as inspiration
- a route could be `emailing`, `202-sf-repurpose`, `200-sf-redact`, `007-sf-content`, `203-sf-research`, `204-sf-market-study`, `205-sf-veille`, `206-sf-audit-copy`, `207-sf-audit-copywriting`, `300-sf-docs`, or a project-specific business/content route

## Required Context

Before final classification, load only the relevant canonical context:

- `shipflow_data/business/business.md` when audience, buyer, market, or monetization matters
- `shipflow_data/business/product.md` when product fit, user problem, workflow, or non-goals matter
- `shipflow_data/business/branding.md` when voice, trust posture, vocabulary, or claim boundaries matter
- `shipflow_data/business/gtm.md` when offer, CTA, funnel, distribution, or positioning matters
- `shipflow_data/editorial/content-map.md` when public content, repurposing, docs, FAQ, article, landing page, or skill-page placement matters
- `shipflow_data/business/portfolio-project-pitch-links.md` when choosing between several portfolio projects matters

Do not load every corpus by default. Load the smallest set that changes classification quality.

## Classification Output

Return a compact classification before transforming the source:

```text
Source type: <email | article | transcript | note | URL | feedback | competitor example | unknown>
Primary project or corpus: <project | ShipFlow | portfolio scan needed | unknown>
Best angle: <email sequence | repurpose | draft | audit | research | market study | docs | FAQ | landing page | backlog | unknown>
Owner skill: <skill name>
Why: <one sentence>
Risks: <claims | copyright | brand voice | consent | public surface | source freshness | none>
Next action: <direct action or owner route>
```

Use `unknown` when the source cannot be classified safely. Ask one targeted question only when the missing answer changes project, audience, claim safety, compliance, or owner skill.

## Routing Rules

- Email or campaign example intended for an audience sequence -> `emailing`.
- Source that should become several content formats -> `202-sf-repurpose` through `007-sf-content` when surface/governance matters.
- Source that needs a new original article, guide, or editorial -> `200-sf-redact` after content surface and claim gates.
- Source that needs better existing content -> `201-sf-enrich`.
- Source that is mainly external trend, competitor, product, market, or keyword signal -> `205-sf-veille`, `203-sf-research`, or `204-sf-market-study`.
- Source that should become docs, README, help, FAQ, or governance content -> `300-sf-docs` or `007-sf-content` depending on lifecycle scope.
- Source that is mainly copy quality, offer, CTA, persuasion, or positioning critique -> `206-sf-audit-copy` or `207-sf-audit-copywriting`.
- Source that requires a product, pricing, public claim, content-surface, or multi-step implementation decision -> `100-sf-spec` through the relevant master skill.

## Source-Inspiration Rules

When the source is an inspiration example, such as an email the operator likes:

- extract reusable structure, angle, promise logic, proof pattern, CTA shape, sequence role, and objection handling
- do not copy distinctive phrasing, private details, testimonials, proprietary claims, or unsupported proof
- translate the useful pattern into the governed audience, product, brand, and GTM context
- preserve copyright and source-faithfulness boundaries
- surface risky tactics instead of normalizing them

For `emailing`, this means the source can inspire a sequence pattern, but the output must be rewritten for the operator's audience and business rather than imitating the original substance.

## Stop Conditions

Stop or ask a targeted question when:

- the source could belong to multiple projects and the project choice changes the output
- the source includes sensitive, private, customer, credential, or legal material that should not be persisted or reused verbatim
- the source relies on claims, proof, testimonials, pricing, guarantees, scarcity, or compliance assumptions that are not governed locally
- the requested output would create a new public content surface that is not declared
- the user asks to copy or closely imitate protected source text instead of adapting the structure

## Validation

Validate references after edits with:

```bash
rg -n "#source|source-intake-classification|Source type|Source-Inspiration|Owner skill" skills/references/source-intake-classification.md skills/references/shipflow-terms.md skills/references/entrypoint-routing.md skills/000-shipflow/SKILL.md skills/007-sf-content/SKILL.md skills/202-sf-repurpose/SKILL.md skills/emailing/SKILL.md docs/focus-tags-cheatsheet.md
python3 tools/skill_budget_audit.py --skills-root skills --format markdown
```
