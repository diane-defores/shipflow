---
artifact: technical_guidelines
metadata_schema_version: "1.0"
artifact_version: "1.2.0"
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
  - "User decision 2026-05-24: for Flutter mobile work, prove common UI first with widget tests and Flutter Web smoke before asking for APK/device testing."
next_review: "2026-06-18"
next_step: "/sf-verify spec-driven-tdd-evidence-gates"
---

# Spec-Driven Development Discipline

## Purpose

ShipFlow stays spec-driven at the lifecycle level. Specs, bug files, release scopes, and mini-contracts define what must be true. Tests and evidence prove that an implementation satisfied that contract.

Use this reference when a ShipFlow skill modifies behavior, fixes a bug, changes a skill contract, or verifies a completion claim.

Before implementation, also load `skills/references/decision-quality-contract.md`. Proof-first discipline must prove a professional solution against the quality and excellence bar; it must not be used to justify the smallest change that merely makes a local check pass.

## Core Rule

Before implementation, name the proof path that fits the changed surface:

- `test-first`: for behavior with a reasonable automated test surface. Start with a failing or focused test, then implement the smallest complete excellent professional change that makes it pass without weakening security, performance, maintainability, product coherence, or future evolution.
- `regression-first`: for bugs. Capture reproduction and cause-root hypothesis first; add a failing regression test when practical.
- `scenario-first`: for skill, prompt, routing, or governance contract changes. Define pressure scenarios or mechanical checks before editing the contract.
- `evidence-first`: for UI, docs, auth, deployment, operational, visual, content, and integration work where automated TDD is not the right proof. Name concrete evidence before claiming completion.
- `exception-with-proof`: when the strongest path is not practical, record why and name the alternate evidence.

The proof path is part of the execution contract. It does not replace the source-of-truth work item.

## Stack-Agnostic Test and Proof Contract

For every spec or execution task that includes behavior, add a proof ladder with stack-aware order and explicit exceptions:

- **Automated checks first** when the behavior is testable without external state risk.
- **Agent-run browser/auth proof** when observable behavior includes UI, redirects, routes, session/state, or public runtime surfaces.
- **Contract/integration proof** when service boundaries or external behavior is changed.
- **Provider/device/manual proof** only for provider-native behavior, native-only app behavior, or irreversible user-impacting paths.

For non-trivial changes, proof may be mixed: automated + agent-run proof + manual checklist only for remaining gaps.

When automation and required manual evidence are both impossible, use `exception-with-proof` with:
- what was impossible,
- why it is justified,
- and what alternate proof was run.

## Validation Proportionality

Not every change needs heavy checks.

Small, low-risk edits (docs-only copy, comments, narrow config updates, no behavior change, no auth/data boundary change) should prefer scoped checks and explicit `no functional impact` when that is true.

High-risk or behavior-sensitive changes still use stronger proof, including checks listed in the proof contract.

Do not default to full framework-heavy checks for low-risk edits; do not bypass stronger checks for high-risk behavior changes.

## CI Surface Gate (Path-Proportional CI)

CI strategy follows the same proportionality rule as testing:

- `docs` / `editorial` / `skills` / `workflow-tracker` edits should not force app or APK pipelines.
- app/site/backend edits should trigger only the matching heavy pipelines.
- cheap checks stay local and cheap; heavy checks are run when scope is materially impacted.

When path-filtered workflows are used:

- prefer explicit positive `paths` ownership over only `paths-ignore`
- require `workflow_dispatch` for full-surface manual reruns
- avoid branch protection setups that block unrelated PRs because filtered workflows were skipped

## Flutter Mobile Proof Ladder

For Flutter mobile work, do not ask the operator to install or test an APK until cheaper proof surfaces have been used or explicitly ruled out.

Default order:

1. Widget tests first for ordinary Flutter UI behavior, state transitions, form validation, crashes, regressions, loaders, empty states, and error states.
2. Flutter Web smoke next for UI surfaces that share the same Flutter widget/app code. The agent should run or route this proof itself when a local, preview, or production Web target is available: use `sf-browser` for non-auth UI proof and `sf-auth-debug` for auth/session/callback/protected-route proof.
3. Android APK/device proof last for behavior Flutter Web cannot prove: IME/keyboard behavior, permissions, overlays, notifications, background/foreground services, native plugins, platform channels, file pickers, camera/mic, storage, install/update behavior, and real-device performance.

For classic Flutter UI flows, the execution contract should list agent-run Web smoke scenarios before APK testing. Examples: manual clipboard add, edit, cancel, save without change, save with change, search, pin/unpin, and visual onboarding/settings.

Use `exception-with-proof` only when widget tests or Flutter Web are not practical, and name the reason before routing to APK/device evidence.

## Stop Conditions

Stop, reroute, or report `partial`/`not verified` when:

- non-trivial work has no ready spec, bug file, release scope, or mini-contract
- testable behavior changes without a test-first path or a recorded exception
- a bug fix lacks reproduction or cause-root evidence
- a skill contract change lacks pressure scenarios or mechanical checks
- evidence-first work names no concrete evidence surface
- proof collection would expose secrets, cookies, tokens, credentials, private payloads, production PII, or sensitive screenshots
- a Flutter UI change routes straight to APK/manual device testing while widget tests or agent-run Flutter Web smoke via `sf-browser`/`sf-auth-debug` can reasonably prove the shared UI behavior
- the proposed implementation is merely the fastest/easiest patch and does not satisfy the decision-quality contract
- the proposed implementation is adequate but visibly below the excellence bar for the risk

## Reporting

Final reports for execution and verification skills should state:

- chosen proof path
- validation or evidence actually performed
- explicit exception reason when test-first or regression-first was skipped
- remaining proof gap, if any

Good evidence examples: unit test, typecheck, build, lint, metadata lint, skill budget audit, runtime sync check, browser proof, screenshot, manual QA, redacted log, retest history, production check, or targeted `rg` confirmation.
