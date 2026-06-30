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
  - skills/references/private-memory-store.md
  - shipflow_data/editorial/content-map.md
  - shipflow_data/business/business.md
  - shipflow_data/business/product.md
  - shipflow_data/branding/branding.md
  - shipflow_data/business/gtm.md
  - shipflow_data/business/portfolio-project-pitch-links.md
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
  - artifact: "shipflow_data/branding/branding.md"
    artifact_version: "1.1.0"
    required_status: reviewed
  - artifact: "shipflow_data/business/gtm.md"
    artifact_version: "1.2.0"
    required_status: reviewed
  - artifact: "shipflow_data/business/portfolio-project-pitch-links.md"
    artifact_version: "0.1.0"
    required_status: draft
  - artifact: "skills/references/private-memory-store.md"
    artifact_version: "1.0.0"
    required_status: active
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

## Invocation Pattern

If the operator already knows what to do with the source, treat that as a routing constraint instead of rediscovering intent.

Good input shapes:

```text
#source project=Winflowz angle=email sequence
<source email>
```

```text
#source output=landing-page project=ShipFlow
<source notes>
```

```text
#source owner=emailing goal="turn this into a 4-email launch sequence"
<source email>
```

Supported hints:

- `project=<name>`: preferred project or corpus
- `owner=<skill>`: preferred owner skill when already known
- `angle=<use>` or `output=<format>`: intended transformation or destination
- `audience=<persona>`: intended reader or segment
- `constraints=<notes>`: claim, tone, channel, compliance, or scope constraints

Hints are binding unless they conflict with safety, project truth, public-claim rules, or owner-skill boundaries. If a hint is unsafe or mismatched, report the mismatch and recommend the safer owner route.

## Required Context

Before final classification, load only the relevant canonical context:

- `shipflow_data/business/business.md` when audience, buyer, market, or monetization matters
- `shipflow_data/business/product.md` when product fit, user problem, workflow, or non-goals matter
- `shipflow_data/branding/branding.md` when voice, trust posture, vocabulary, or claim boundaries matter
- `shipflow_data/business/gtm.md` when offer, CTA, funnel, distribution, or positioning matters
- `shipflow_data/editorial/content-map.md` when public content, repurposing, docs, FAQ, article, landing page, or skill-page placement matters
- `shipflow_data/business/portfolio-project-pitch-links.md` when choosing between several portfolio projects matters
- `skills/references/private-memory-store.md` when cached private pitch contents or reusable private source memory could change classification

Do not load every corpus by default. Load the smallest set that changes classification quality.

## Portfolio Project Index

When the source could belong to more than one project, load `shipflow_data/business/portfolio-project-pitch-links.md` before choosing the project. Use it as an index, not as a substitute for each project's own business, product, brand, or GTM docs.

Project selection should consider:

- explicit project hint from the operator
- audience match
- product/problem match
- business angle match
- source vocabulary and channel
- whether the pitch entry is `reviewed`, `candidate`, `stale`, or `archived`

If the index points to a project pitch URL, use that URL only as routing context unless the task requires deeper project truth. Do not infer private details beyond what the pitch and local governed docs support.

## Private Memory Store

When portfolio routing needs reusable pitch contents, use the private memory contract in `skills/references/private-memory-store.md`.

The approved private root is:

```text
${SHIPFLOW_PRIVATE_ROOT:-$HOME/.shipflow/private}
```

Use `${SHIPFLOW_PRIVATE_ROOT:-$HOME/.shipflow/private}/project-pitches/` for cached project pitches and summaries. Use `${SHIPFLOW_PRIVATE_ROOT:-$HOME/.shipflow/private}/source-cache/` only for operator-approved reusable source material.

Do not cache source text in `$SHIPFLOW_ROOT`, project repos, public specs, public docs, or generated files under version control.

## Cache Policy

Do not create a public repo cache of fetched pitch content, pasted sources, private emails, customer text, or source excerpts.

Allowed durable state in the public ShipFlow repo:

- the portfolio index of project names, pitch URLs, short routing notes, statuses, and source-of-truth pointers
- source-intake doctrine and routing rules
- redacted summaries inside specs or reports when a lifecycle skill explicitly owns them

Not allowed in the public ShipFlow repo:

- copied email examples from the operator's inbox
- private pitch contents fetched from another repo
- customer or audience source material
- unredacted screenshots, transcripts, or notes
- generated cache files containing source text

If reusable private source memory is needed, use `${SHIPFLOW_PRIVATE_ROOT:-$HOME/.shipflow/private}` under the rules in `skills/references/private-memory-store.md`.

## Classification Output

Return a compact classification before transforming the source:

```text
Source type: <email | article | transcript | note | URL | feedback | competitor example | unknown>
Primary project or corpus: <project | ShipFlow | portfolio scan needed | unknown>
Best angle: <email sequence | repurpose | draft | audit | research | market study | docs | FAQ | landing page | backlog | unknown>
Intent hint: <operator-provided action | none>
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
python3 tools/shipflow_metadata_lint.py skills/references/source-intake-classification.md skills/references/private-memory-store.md
```
