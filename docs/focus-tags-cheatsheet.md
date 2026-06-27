---
artifact: documentation
metadata_schema_version: "1.0"
artifact_version: "1.0.0"
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
| `#end-user` | real user usefulness, first success, clarity, and beginner adoption to dominate the decision | `skills/008-sf-onboarding/SKILL.md` |

## Execution Discipline Tags

Use these when you want to tighten how the agent executes, not just what it optimizes for.

| Tag | Use when you want... | Canonical source |
| --- | --- | --- |
| `#quality` | the quality bar, anti-shortcut doctrine, and bounded excellence to dominate the decision | `skills/references/decision-quality-contract.md` |
| `#routing` | owner-skill selection and direct handoff rules to dominate the decision | `skills/references/entrypoint-routing.md` |
| `#proof` | proof paths, validation proportion, and evidence-backed claims to dominate the decision | `skills/references/spec-driven-development-discipline.md` |

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
#end-user #quality
This solves the bug but still feels too hard for a normal user.
```

```text
#shipflow #proof
Work on the ShipFlow system itself and make the contract more testable.
```

## Default Rule

If you use one or more focus tags, ShipFlow should reload those canonical documents first and keep them as high-priority context for the current turn.

If you combine several tags, ShipFlow should merge them in the narrowest coherent way instead of treating them as conflicting by default.
