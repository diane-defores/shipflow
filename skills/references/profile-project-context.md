---
artifact: contract
metadata_schema_version: "1.0"
artifact_version: "1.1.0"
project: ShipFlow
created: "2026-06-28"
updated: "2026-06-29"
status: active
source_skill: 900-shipflow-core
scope: profile-project-context
owner: Diane
confidence: high
risk_level: medium
security_impact: none
docs_impact: yes
linked_systems:
  - skills/references/profile-activation.md
  - skills/000-shipflow/SKILL.md
  - skills/302-sf-help/SKILL.md
  - shipflow_data/business/
  - shipflow_data/technical/
  - shipflow_data/editorial/content-map.md
depends_on:
  - artifact: "skills/references/canonical-paths.md"
    artifact_version: "1.0.0"
    required_status: active
supersedes: []
evidence:
  - "Operator request 2026-06-28: named profiles must load useful project context, not only their role contract."
next_review: "2026-07-12"
next_step: "/103-sf-verify profile-project-context"
---

# Profile Project Context

## Purpose

This contract defines which project context documents named profiles should load beyond their role contract.

Profiles must not answer from role posture alone. They should ground arbitration in the target project's business, product, editorial, and technical context when those documents exist and the task needs them.

## Core Rule

After resolving a named profile and its operator role:

1. identify the relevant project context layer
2. load the smallest useful project-specific context bundle
3. shape the answer from both the role contract and the loaded project truth

Do not load every project document by default. Load the narrowest coherent bundle for the current question.

## Context Bundles By Profile

### `growth-operations-lead` -> `Victoire`

Default bundle:

- `shipflow_data/business/business.md`
- `shipflow_data/business/product.md`
- `shipflow_data/business/gtm.md`

Load additionally when relevant:

- `shipflow_data/business/project-competitors-and-inspirations.md`
- `shipflow_data/business/affiliate-programs.md`
- `shipflow_data/editorial/content-map.md`

Use this bundle for prioritization, leverage, positioning, growth sequencing, offer, SEO leverage, and distribution tradeoffs.

### `risk-and-coherence-guardian` -> `Prudence`

Default bundle:

- `shipflow_data/business/product.md`
- `shipflow_data/technical/context.md`
- `shipflow_data/technical/code-docs-map.md`

Load additionally when relevant:

- `shipflow_data/business/gtm.md`
- `shipflow_data/technical/guidelines.md`
- `shipflow_data/technical/architecture.md`

Use this bundle for coherence checks, hidden dependencies, scope risk, governance drift, proof weakness, and contradiction surfacing.

### `product-architecture-planner` -> `Ariane`

Default bundle:

- `shipflow_data/business/product.md`
- `shipflow_data/technical/context.md`
- `shipflow_data/technical/architecture.md`

Load additionally when relevant:

- `shipflow_data/business/business.md`
- `shipflow_data/technical/code-docs-map.md`
- `shipflow_data/technical/guidelines.md`
- `shipflow-spec-driven-workflow.md`

Use this bundle for phase planning, slice definition, dependency mapping, sequencing, and execution framing.

### `end-user-adhesion-reviewer` -> `Adhesion`

Default bundle:

- `shipflow_data/business/product.md`
- `shipflow_data/business/gtm.md`
- `shipflow_data/branding/branding.md`

Load additionally when relevant:

- `shipflow_data/editorial/content-map.md`
- `skills/008-sf-end-user/SKILL.md`
- `shipflow_data/business/business.md`

Use this bundle for value perception, trust, comprehension, CTA friction, onboarding friction, and user desire to continue.

### `seo-specialist` -> `SEO Specialist`

Default bundle:

- `shipflow_data/editorial/content-map.md`
- `shipflow_data/business/gtm.md`
- `shipflow_data/branding/branding.md`

Load additionally when relevant:

- `shipflow_data/business/product.md`
- `shipflow_data/technical/code-docs-map.md`
- `README.md`

Use this bundle for search intent fit, discoverability, content structure, claim safety, and SEO-related surface coherence.

### `traffic-manager` -> `Tariq`

Default bundle:

- `shipflow_data/business/business.md`
- `shipflow_data/business/gtm.md`
- `shipflow_data/business/product.md`

Load additionally when relevant:

- `shipflow_data/business/affiliate-programs.md`
- `shipflow_data/business/project-competitors-and-inspirations.md`
- `shipflow_data/editorial/content-map.md`
- `README.md`

Use this bundle for acquisition-channel arbitration, source-to-landing fit, tracking readiness, conversion measurement, paid/organic sequencing, affiliate/referral opportunities, and traffic-quality tradeoffs.

## Missing Context Rule

If one or more context files in the relevant bundle do not exist:

- continue with the existing project truth that is available
- name the missing context only when it materially weakens the answer
- do not invent product, audience, or business truth that the project has not declared

## Cross-Project Rule

When the active repository is not ShipFlow itself, resolve project context from the current project root first.

When the task is explicitly about ShipFlow governance or internal behavior, resolve from `${SHIPFLOW_ROOT:-$HOME/shipflow}`.

## Maintenance Rule

Update this contract when profile families, role semantics, or project-context loading rules change.
