---
artifact: documentation
metadata_schema_version: "1.0"
artifact_version: "1.1.0"
project: ShipFlow
created: "2026-06-27"
updated: "2026-06-27"
status: reviewed
source_skill: 300-sf-docs
scope: focus-tags-cheatsheet
owner: unknown
confidence: high
risk_level: low
security_impact: none
docs_impact: yes
linked_systems:
  - skills/references/shipflow-terms.md
  - skills/references/entrypoint-routing.md
  - skills/references/operator-partnership-contract.md
  - skills/references/decision-quality-contract.md
  - skills/008-sf-onboarding/SKILL.md
  - shipflow_data/business/gtm.md
  - README.md
  - shipflow-site/src/pages/docs.astro
  - shipflow-site/src/pages/fr/docs.astro
  - shipflow_data/editorial/content-map.md
depends_on:
  - artifact: "skills/references/shipflow-terms.md"
    artifact_version: "1.0.0"
    required_status: active
supersedes: []
evidence:
  - "Public focus-tag families requested on 2026-06-27 so the operator can recenter the agent without invoking a full skill."
  - "Focus tags are now defined canonically in skills/references/shipflow-terms.md and loaded by entrypoint-routing."
next_review: "2026-07-11"
next_step: "/300-sf-docs audit docs/focus-tags-cheatsheet.md"
---

# Focus Tags Cheatsheet

Use focus tags when you want to recenter the agent fast without launching a whole new skill just to restate doctrine.

These tags are lightweight conversation cues. They do not replace owner-skill routing. They tell ShipFlow which contract to reload before it answers, routes, edits, or verifies.

## Business Recenter Tags

Use these when you want the agent to think like a business partner instead of a neutral code mechanic.

| Tag | Use when you want... | Canonical source |
| --- | --- | --- |
| `#partner` | a business-partner stance, more initiative, and less passive assistant behavior | `skills/references/operator-partnership-contract.md` |
| `#growth` | growth, distribution, conversion, leverage, and GTM usefulness to dominate the decision | `shipflow_data/business/gtm.md` |
| `#offer` | the offer, promise, packaging, and commercial clarity to dominate the decision | `shipflow_data/business/gtm.md` |
| `#roi` | expected impact versus effort, drag, and cost to dominate the decision | `skills/references/operator-partnership-contract.md` |
| `#funnel` | acquisition, activation, conversion, and retention flow fit to dominate the decision | `shipflow_data/business/gtm.md` |
| `#positioning` | differentiation, category framing, and market angle to dominate the decision | `shipflow_data/business/gtm.md` |
| `#distribution` | channels, SEO, affiliates, and partner-led reach to dominate the decision | `shipflow_data/business/gtm.md` |
| `#monetization` | revenue fit, paywalls, upsell paths, and pricing pressure to dominate the decision | `shipflow_data/business/business.md` |
| `#retention` | repeat usage, stickiness, and product loops to dominate the decision | `shipflow_data/business/product.md` |
| `#decision-maker` | the buyer or approver perspective to dominate the decision | `shipflow_data/business/business.md` |
| `#end-user` | real user usefulness, first success, clarity, and beginner adoption to dominate the decision | `skills/008-sf-onboarding/SKILL.md` |
| `#trust` | trust, public-promise discipline, claim safety, and credibility to dominate the decision | `shipflow_data/business/branding.md` |
| `#leverage` | operator leverage, compounding impact, and drag reduction to dominate the decision | `skills/references/operator-partnership-contract.md` |
| `#founder-mode` | a founder-facing decision surface instead of technician-level back-and-forth | `skills/references/operator-partnership-contract.md` |

## Content Recenter Tags

Use these when the issue is mostly about message shape, reader understanding, or content-surface fit.

| Tag | Use when you want... | Canonical source |
| --- | --- | --- |
| `#cta` | the next action to be clearer and stronger | `shipflow_data/business/gtm.md` |
| `#clarity` | readability, explicit structure, and less vague wording | `shipflow_data/business/branding.md` |
| `#faq` | objections, reassurance, and friction-killing answers | `shipflow_data/business/gtm.md` |
| `#voice` | tone and brand-language discipline | `shipflow_data/business/branding.md` |
| `#audience` | the target persona and sophistication level to dominate the decision | `shipflow_data/business/business.md` |
| `#repurpose` | the best downstream format or surface for an existing source | `shipflow_data/editorial/content-map.md` |
| `#pillar` | pillar-page role and semantic structure to dominate the decision | `shipflow_data/editorial/content-map.md` |
| `#seo-intent` | search intent and query-to-page fit to dominate the decision | `shipflow_data/editorial/content-map.md` |

## Governance Recenter Tags

Use these when the issue is mostly about documentation truth, ownership, and system coherence.

| Tag | Use when you want... | Canonical source |
| --- | --- | --- |
| `#canon` | the canonical source of truth to dominate the decision | `shipflow_data/technical/code-docs-map.md` |
| `#drift` | divergence between code, docs, and public surfaces to dominate the decision | `shipflow_data/technical/code-docs-map.md` |
| `#owner` | artifact or decision ownership to dominate the decision | `skills/references/canonical-paths.md` |
| `#freshness` | document or claim recency to dominate the decision | `shipflow_data/editorial/content-map.md` |
| `#traceability` | trace links between decision, source, implementation, and proof | `shipflow-spec-driven-workflow.md` |
| `#entrypoint` | the fastest correct entrypoint doc or workflow to dominate the decision | `AGENT.md` |
| `#contract` | non-optional rules and invariants to dominate the decision | `skills/references/decision-quality-contract.md` |
| `#public-docs` | public-facing docs and external readability to dominate the decision | `shipflow_data/editorial/content-map.md` |
| `#internal-docs` | internal operator truth and execution-facing docs to dominate the decision | `shipflow_data/technical/context.md` |
| `#single-source` | one authoritative artifact instead of duplicated explanations | `shipflow_data/technical/code-docs-map.md` |

## Execution Discipline Tags

Use these when you want to tighten how the agent executes, not just what it optimizes for.

| Tag | Use when you want... | Canonical source |
| --- | --- | --- |
| `#quality` | the quality bar, anti-shortcut doctrine, and bounded excellence to dominate the decision | `skills/references/decision-quality-contract.md` |
| `#scope` | the narrowest justified owner layer and bounded scope to dominate the decision | `skills/references/decision-quality-contract.md` |
| `#ship` | ship readiness, checks, proof, closure, and release discipline to dominate the decision | `skills/004-sf-deploy/SKILL.md` |
| `#routing` | owner-skill selection and direct handoff rules to dominate the decision | `skills/references/entrypoint-routing.md` |
| `#proof` | proof paths, validation proportion, and evidence-backed claims to dominate the decision | `skills/references/spec-driven-development-discipline.md` |
| `#no-drift` | staying on target, choosing, and acting without exploratory drift to dominate the decision | `skills/references/entrypoint-routing.md` |

## System Recenter Tags

Use these when the current conversation risks drifting toward the wrong repository or the wrong abstraction layer.

| Tag | Use when you want... | Canonical source |
| --- | --- | --- |
| `#shipflow` | the internal ShipFlow system, not the current project repo | `skills/references/entrypoint-routing.md` |
| `#shupflow` | the same thing as `#shipflow`, with a typo-tolerant fast alias | `skills/references/entrypoint-routing.md` |
| `#shipflow-core` | ShipFlow hardening, execution fidelity, or internal doctrine work | `skills/900-shipflow-core/SKILL.md` |

## Quick Examples

```text
#partner #growth
This flow is technically fine but not helping conversion enough.
```

```text
#offer #cta #clarity
The page explains a lot but still does not make the offer obvious.
```

```text
#end-user #quality
This solves the bug but still feels too hard for a normal user.
```

```text
#faq #trust #seo-intent
Turn this objection-heavy draft into something users can find and believe.
```

```text
#canon #drift #public-docs
Recenter on the source of truth and fix the docs that are now out of sync.
```

```text
#shipflow #proof
Work on the ShipFlow system itself and make the contract more testable.
```

```text
#founder-mode #growth #no-drift
Do the most useful thing for adoption and stop wandering.
```

## Default Rule

If you use one or more focus tags, ShipFlow should reload those canonical documents first and keep them as high-priority context for the current turn.

If you combine several tags, ShipFlow should merge them in the narrowest coherent way instead of treating them as conflicting by default.
