---
artifact: technical_guidelines
metadata_schema_version: "1.0"
artifact_version: "1.1.0"
project: ShipFlow
created: "2026-05-24"
updated: "2026-06-10"
status: active
source_skill: sf-skill-build
scope: decision-quality-contract
owner: Diane
confidence: high
risk_level: high
security_impact: yes
docs_impact: yes
linked_systems:
  - skills/*/SKILL.md
  - skills/references/master-workflow-lifecycle.md
  - skills/references/spec-driven-development-discipline.md
  - skills/references/master-delegation-semantics.md
  - skills/references/question-contract.md
  - skills/sf-model/references/model-routing.md
  - shipflow-spec-driven-workflow.md
  - README.md
depends_on:
  - artifact: "skills/references/question-contract.md"
    artifact_version: "1.3.0"
    required_status: active
  - artifact: "skills/references/spec-driven-development-discipline.md"
    artifact_version: "1.4.0"
    required_status: active
supersedes: []
evidence:
  - "User directive 2026-05-24: ShipFlow must optimize for maximum performance, maximum security, excellence, and durability, not convenience, speed, or the shortest path."
  - "User directive 2026-05-24: the operator wants high-quality code, modern effective tools, and current best practices; time pressure is not the primary constraint."
  - "User decision 2026-06-10: central skill rules should stay compact enough for agents to retain the decision signal."
next_review: "2026-06-24"
next_step: "/sf-verify decision-quality-contract"
---

# Decision Quality Contract

## Purpose

This reference defines the default decision quality bar for ShipFlow agents, skills, model routing, implementation, fixes, audits, documentation, and verification.

Excellence is an instruction-level requirement: choose the strongest professional path that fits the product contract, risk, and evidence needs. Ease, speed, token economy, and local convenience are tie-breakers only after the quality bar is satisfied.

## Primary Decision Metrics

Optimize first for:

1. Correctness and reliability against the user story, spec, bug file, or accepted mini-contract.
2. Security, privacy, permission boundaries, tenant isolation, data safety, and abuse resistance.
3. Performance and operational robustness when the affected surface can impact latency, throughput, resource use, reliability, or user trust.
4. Maintainability, clarity, durability, upgradeability, and future evolution.
5. Professional excellence: current best practices, proven modern tools, appropriate libraries or engines, coherent architecture, high-quality code, careful UX/API ergonomics, and evidence that matches the risk.

Speed, cost, latency, token use, local simplicity, or implementation convenience may decide only between options that are already equivalent on correctness, security, performance, maintainability, durability, excellence, and evidence.

## Forbidden Optimizations

Do not choose the quickest, easiest, cheapest, or shortest path when it weakens the product contract, security, durability, maintainability, proof quality, or operator trust.

Do not use phrases such as "minimal change to make it work" when they imply shortcut quality. Use "bounded professional implementation" or "smallest safe path" only with the definition below.

## Smallest Safe Path

"Smallest safe path" means the smallest complete, professional, best-practice implementation that satisfies the product contract and preserves security, performance, maintainability, and future evolution.

It never means the fastest hack, the easiest patch, or the least ambitious acceptable workaround.

Small blast radius remains good engineering. A change may be small in file surface, but it must be complete in quality.

## Minimal Targeted Edits

Minimal targeted edits are allowed only as an edit-safety discipline:

- update the intended row, section, function, module, or file when the correct solution is known
- avoid whole-file rewrites from stale context
- avoid unrelated refactors and metadata churn
- keep the diff reviewable and connected to the contract

This does not lower the solution bar. A targeted edit must still satisfy the primary decision metrics, excellence bar, proof path, and documentation/security gates.

## Best Practices And Tools

Prefer modern, proven, effective tools and libraries when the domain has established solutions for rules, parsing, security, cryptography, authentication, migrations, accessibility, UI primitives, testing, observability, performance measurement, or deployment.

Do not hand-roll domain logic for convenience when a maintained library, framework feature, or official provider path is the professional choice for reliability and safety. When current external behavior matters, use the documentation freshness gate and primary sources before deciding.

## Questions And Tradeoffs

Ask a user-facing question only when the high-quality route changes a material decision:

- architecture, framework, provider, dependency, migration, or data model
- security posture, permissions, privacy, destructive behavior, or tenant boundary
- public behavior, pricing, claims, SEO/content surface, or support promise
- cost, runtime, operational burden, or release risk in a way the operator should own

When asking, recommend the option that best preserves the primary decision metrics. Do not recommend the easiest or fastest option unless it is also the best professional default.

## Model And Tool Routing

Model, subagent, and tool choices must follow the same order:

- choose the model or tool that is reliable enough for the risk
- use cheaper or faster fallbacks only when they remain quality-equivalent for the task
- escalate reasoning, model strength, validation, specialist tools, or implementation scope when excellence or the cost of error requires it
- report degraded execution when the available runtime cannot meet the quality bar

## Reporting Language

In user-facing reports, do not frame shortcuts as virtues. It is acceptable to say a change is bounded, focused, or targeted. It is not acceptable to imply that ShipFlow chose a lower-quality path because it was faster for the agent.
