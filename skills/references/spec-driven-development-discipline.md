---
artifact: technical_guidelines
metadata_schema_version: "1.0"
artifact_version: "1.1.0"
project: ShipFlow
created: "2026-05-18"
updated: "2026-05-24"
status: active
source_skill: sf-start
scope: spec-driven-development-discipline
owner: Diane
confidence: high
risk_level: medium
security_impact: yes
docs_impact: yes
linked_systems:
  - skills/sf-start/SKILL.md
  - skills/sf-fix/SKILL.md
  - skills/sf-bug/SKILL.md
  - skills/sf-skill-build/SKILL.md
  - skills/sf-verify/SKILL.md
  - skills/references/master-workflow-lifecycle.md
  - skills/references/master-delegation-semantics.md
  - skills/references/decision-quality-contract.md
depends_on:
  - artifact: "skills/references/decision-quality-contract.md"
    artifact_version: "1.0.0"
    required_status: active
  - artifact: "skills/references/master-workflow-lifecycle.md"
    artifact_version: "1.3.0"
    required_status: active
  - artifact: "skills/references/skill-instruction-layering.md"
    artifact_version: "0.1.0"
    required_status: draft
supersedes: []
evidence:
  - "Spec spec-driven-tdd-evidence-gates.md keeps ShipFlow spec-driven development as the outer lifecycle and adds proof-first implementation discipline."
  - "User decision 2026-05-24: proof paths must support high-quality code and durable decisions, not just the quickest passing change."
next_review: "2026-06-18"
next_step: "/sf-verify spec-driven-tdd-evidence-gates"
---

# Spec-Driven Development Discipline

## Purpose

ShipFlow stays spec-driven at the lifecycle level. Specs, bug files, release scopes, and mini-contracts define what must be true. Tests and evidence prove that an implementation satisfied that contract.

Use this reference when a ShipFlow skill modifies behavior, fixes a bug, changes a skill contract, or verifies a completion claim.

Before implementation, also load `skills/references/decision-quality-contract.md`. Proof-first discipline must prove a professional solution against the quality bar; it must not be used to justify the smallest change that merely makes a local check pass.

## Core Rule

Before implementation, name the proof path that fits the changed surface:

- `test-first`: for behavior with a reasonable automated test surface. Start with a failing or focused test, then implement the smallest complete professional change that makes it pass without weakening security, performance, maintainability, or product coherence.
- `regression-first`: for bugs. Capture reproduction and cause-root hypothesis first; add a failing regression test when practical.
- `scenario-first`: for skill, prompt, routing, or governance contract changes. Define pressure scenarios or mechanical checks before editing the contract.
- `evidence-first`: for UI, docs, auth, deployment, operational, visual, content, and integration work where automated TDD is not the right proof. Name concrete evidence before claiming completion.
- `exception-with-proof`: when the strongest path is not practical, record why and name the alternate evidence.

The proof path is part of the execution contract. It does not replace the source-of-truth work item.

## Stop Conditions

Stop, reroute, or report `partial`/`not verified` when:

- non-trivial work has no ready spec, bug file, release scope, or mini-contract
- testable behavior changes without a test-first path or a recorded exception
- a bug fix lacks reproduction or cause-root evidence
- a skill contract change lacks pressure scenarios or mechanical checks
- evidence-first work names no concrete evidence surface
- proof collection would expose secrets, cookies, tokens, credentials, private payloads, production PII, or sensitive screenshots
- the proposed implementation is merely the fastest/easiest patch and does not satisfy the decision-quality contract

## Reporting

Final reports for execution and verification skills should state:

- chosen proof path
- validation or evidence actually performed
- explicit exception reason when test-first or regression-first was skipped
- remaining proof gap, if any

Good evidence examples: unit test, typecheck, build, lint, metadata lint, skill budget audit, runtime sync check, browser proof, screenshot, manual QA, redacted log, retest history, production check, or targeted `rg` confirmation.
