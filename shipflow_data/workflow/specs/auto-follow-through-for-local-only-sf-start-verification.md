---
artifact: spec
metadata_schema_version: "1.0"
artifact_version: "1.0.0"
project: "shipflow"
created: "2026-06-10"
created_at: "2026-06-10 19:34:59 UTC"
updated: "2026-06-10"
updated_at: "2026-06-10 20:04:03 UTC"
status: ready
source_skill: sf-spec
source_model: "GPT-5 Codex"
scope: "workflow-lifecycle"
owner: "Diane"
user_story: "As a ShipFlow operator, I want sf-start to continue into verification when verification is local, safe, and non-destructive, so I do not have to manually relaunch an obvious command after an implementation that already passed local checks."
confidence: high
risk_level: medium
security_impact: yes
docs_impact: yes
linked_systems:
  - "skills/sf-start/SKILL.md"
  - "skills/sf-start/references/execution-workflow.md"
  - "skills/sf-build/SKILL.md"
  - "skills/sf-build/references/build-lifecycle-workflow.md"
  - "skills/references/master-workflow-lifecycle.md"
  - "skills/references/reporting-contract.md"
  - "skills/references/spec-driven-development-discipline.md"
  - "shipflow_data/workflow/conversation-audits/2026-06-10-sf-start-stopped-before-verify.md"
depends_on:
  - artifact: "skills/references/decision-quality-contract.md"
    artifact_version: "1.1.0"
    required_status: active
  - artifact: "skills/references/spec-driven-development-discipline.md"
    artifact_version: "1.4.0"
    required_status: active
  - artifact: "skills/references/reporting-contract.md"
    artifact_version: "1.4.0"
    required_status: active
  - artifact: "skills/references/chantier-tracking.md"
    artifact_version: "0.5.0"
    required_status: draft
  - artifact: "skills/references/skill-instruction-layering.md"
    artifact_version: "1.0.0"
    required_status: active
supersedes: []
evidence:
  - "Conversation audit 2026-06-10: sf-start stopped after local implementation and routed to /sf-verify, creating operator friction."
  - "The same run completed local validation: plugin audit, skill budget audit, metadata lint, focused rg checks, git diff check, and skill sync check."
  - "sf-start currently defines implemented as complete within sf-start scope while verification can remain pending."
  - "sf-build currently owns full start -> verify -> end -> ship orchestration."
  - "ShipFlow Core plugin audit after the conversation audit reported 66 skills and 0 findings, so this is a lifecycle contract gap, not a mechanical skill-quality finding."
next_step: "/sf-ship Auto-follow-through for local-only sf-start verification"
---

# Spec: Auto-follow-through for local-only sf-start verification

## Title

Auto-follow-through for local-only sf-start verification

## Status

ready

## User Story

As a ShipFlow operator, I want `sf-start` to continue into verification when verification is local, safe, and non-destructive, so I do not have to manually relaunch an obvious command after an implementation that already passed local checks.

## Minimal Behavior Contract

When `sf-start` finishes implementation for a unique spec and the only remaining lifecycle work is local, tool-backed, non-destructive verification that does not require preview, production, auth/browser proof, Sentry, device testing, manual QA, secret access, a user decision, commit, push, or any external side effect, the agent must run the relevant local verification itself or explicitly explain why verification is outside the current scope. If local verification fails, the run must stay inside the lifecycle with `partial`, `blocked`, or a concrete correction route. The easiest edge case to miss is turning `sf-start` into a full orchestrator: auto-follow-through must stay limited to safe local verification and must never include `sf-end`, `sf-ship`, production, preview, manual tests, or external actions.

## Success Behavior

- Preconditions: one unique spec is in scope, `sf-start` completed the planned edits and local checks, and every auto-follow-through criterion is true.
- Trigger: `sf-start` reaches its final phase and the next command would only be `/sf-verify <scope>`.
- Operator result: the final report says whether local verification was run or why auto-follow-through was skipped.
- System effect: the chantier trace does not leave `sf-verify` pending when the agent could safely run it in the same turn; out-of-scope proof gaps still route to the correct owner.
- Proof of success: ShipFlow checks prove that `sf-start`, `sf-build`, and lifecycle references expose the auto-follow-through criteria, stop conditions, scope boundaries, and reporting labels.

## Error Behavior

- If verification requires preview, production, auth/browser proof, Sentry, device testing, manual QA, secret access, a user decision, commit, push, or an external environment, `sf-start` must not auto-continue; it must route to the exact owner with scenario and target/environment when applicable.
- If `sf-start` local checks fail, auto-verify must not hide the failure; the run must continue to a correction when possible or report `partial`/`blocked`.
- If the spec or chantier is ambiguous, verification must not be guessed; route to `/sf-ready`, `/sf-spec`, or a targeted user question based on the gap.
- Must never happen: auto-ship, auto-commit, auto-push, destructive tests, secret exposure, or making `sf-start` equivalent to `sf-build`.

## Problem

A conversation audit found operator friction: after a successful local implementation of `Residual ShipFlow Skill Body Risk Cleanup`, the agent ran local validation and then stopped with `Next step: /sf-verify...`. That behavior matched the current `sf-start` boundary, but it frustrated the operator because the remaining verification was local and non-destructive.

The issue is not that the agent skipped all testing. It did test locally. The issue is that current contracts do not say when `sf-start` may continue into `sf-verify`, or how to distinguish that bounded continuation from the full lifecycle orchestration owned by `sf-build`.

## Solution

Add a bounded local auto-follow-through contract:

- `sf-start` remains an implementation skill.
- `sf-build` remains the full lifecycle orchestrator.
- `sf-start` may run local verification only when every safety and scope criterion is true.
- Reports must make either `auto-verify: run` or `auto-verify: skipped` visible with an actionable reason.
- Lifecycle references must name stop conditions and out-of-scope proof owners.

## Scope In

- Clarify `skills/sf-start/SKILL.md` around local auto-follow-through.
- Update `skills/sf-start/references/execution-workflow.md` with criteria, stop conditions, and reporting behavior.
- Adjust `skills/sf-build/SKILL.md` or `skills/sf-build/references/build-lifecycle-workflow.md` to keep the boundary clear between bounded `sf-start` auto-verify and full orchestration.
- Update `skills/references/master-workflow-lifecycle.md` only if shared lifecycle doctrine would otherwise contradict the new rule.
- Add focused `rg` checks and pressure scenarios for allowed and forbidden continuation.
- Update technical docs only if the ShipFlow runtime/lifecycle map documents these transitions at this level.

## Scope Out

- Automatically running `sf-end`, `sf-ship`, commits, pushes, previews, production checks, browser/auth proof, Sentry reads, APK/device tests, or manual QA.
- Changing skill names, invocation keys, or the central role of `sf-build`.
- Editing the ShipFlow Core plugin audit script.
- Resolving existing unrelated chantiers or relaunching all pending specs.
- Making `sf-start` responsible for proof surfaces it cannot validate locally.

## Constraints

- Keep `sf-start` as implementation, not as master orchestration.
- Keep `sf-build` as the `start -> verify -> end -> ship` orchestrator.
- Follow `spec-driven-development-discipline.md`: every missing proof route must name owner, scenario, and target/environment.
- Auto-follow-through applies only to local, non-destructive, tool-backed validation.
- Stop conditions must remain visible in top-level `SKILL.md`; detailed matrices may live in references.
- No new behavior may weaken preview, production, auth, Sentry, manual, device, secret, commit, push, or external-side-effect gates.

## Test Contract

- Surface profile: Markdown skill contracts and ShipFlow lifecycle references.
- Automated proof available: metadata lint, skill budget audit, ShipFlow Core plugin audit, focused `rg` checks, sync check, and diff check.
- Non-automated proof required: scenario-first review of allowed and forbidden follow-through cases.
- Proof path: `scenario-first` with mechanical checks.
- Manual checklist path: not required.
- Fresh external docs: not needed; this is local ShipFlow instruction architecture.

## Dependencies

- `skills/references/decision-quality-contract.md` for bounded professional behavior.
- `skills/references/spec-driven-development-discipline.md` for proof owner routing.
- `skills/references/reporting-contract.md` for concise visible reporting.
- `skills/references/chantier-tracking.md` for lifecycle trace semantics.
- `skills/references/skill-instruction-layering.md` for what stays local versus reference.
- Conversation audit: `shipflow_data/workflow/conversation-audits/2026-06-10-sf-start-stopped-before-verify.md`.

## Invariants

- `sf-start` still uses `implemented` for completed local implementation scope.
- `sf-start` still reports `partial` or `blocked` when local implementation or local verification fails in a way that prevents continuation.
- `sf-build` remains the only skill expected to continue through verification, closure, and ship as a master lifecycle.
- Hosted, production, provider, browser, auth, manual, and device proof gaps must name a concrete owner route instead of being hidden by auto-follow-through.
- No secrets, private payloads, external side effects, commits, pushes, or deployment actions are introduced by verification.

## Links & Consequences

- Better default follow-through can reduce operator friction after local-only work.
- Too broad an implementation could blur skill ownership and make `sf-start` unsafe.
- Reporting changes affect operator trust: concise reports must say whether verification actually ran or why it was skipped.
- Verification semantics affect `sf-verify`, `sf-build`, `sf-end`, and `sf-ship` flow expectations.

## Documentation Coherence

- Internal docs: update `shipflow_data/technical/skill-runtime-and-lifecycle.md` only if it currently documents lifecycle boundaries at this level.
- Public docs/site: no impact expected unless skill pages expose lifecycle promises.
- Changelog: update only during ship/closure.
- Help catalog: no impact unless skill descriptions change.

## Edge Cases

- A local check passes but `sf-verify` would require fresh context or a broader adversarial review: skip auto-follow-through and route explicitly.
- A spec asks for manual QA: do not auto-run `sf-test`; route to `sf-test` with scenario.
- A project is `vercel-preview-push` or `hybrid`: local checks may run, but preview/browser proof must follow `sf-ship -> sf-prod`.
- Dirty unrelated files exist: auto-follow-through may run read-only verification but must not stage, commit, push, ship, or claim dirty-worktree cleanliness.
- The user explicitly asked only for implementation, not verify: auto-follow-through may still run safe local verification unless the user says not to.
- The user invoked `sf-build`: full orchestration remains under `sf-build`, not this limited path.

## Implementation Tasks

- [x] Task 1: Define auto-follow-through criteria in `sf-start`.
  - File: `skills/sf-start/SKILL.md`
  - Action: Add a concise local section stating when `sf-start` may run local `sf-verify` automatically and when it must not.
  - User story link: prevents manual relaunch when verification is safe and obvious.
  - Depends on: none.
  - Validate with: `rg -n "auto-follow-through|auto-verify|sf-verify|preview|production|manual|Sentry|device" skills/sf-start/SKILL.md`
  - Notes: Keep the role boundary clear.

- [x] Task 2: Add detailed workflow and stop conditions.
  - File: `skills/sf-start/references/execution-workflow.md`
  - Action: Add criteria matrix, run/skipped reporting, failure handling, and owner routing for non-local proof.
  - User story link: gives future agents an executable contract.
  - Depends on: Task 1.
  - Validate with: `rg -n "auto-follow-through|auto-verify: run|auto-verify: skipped|owner_skill|target_or_environment" skills/sf-start/references/execution-workflow.md`
  - Notes: Keep examples out of the activation body.

- [x] Task 3: Preserve `sf-build` orchestration boundary.
  - File: `skills/sf-build/SKILL.md`, `skills/sf-build/references/build-lifecycle-workflow.md`
  - Action: Clarify that `sf-build` remains the full lifecycle owner; `sf-start` auto-verify is a bounded local exception, not end/ship orchestration.
  - User story link: prevents future ambiguity about which skill owns full continuation.
  - Depends on: Task 1.
  - Validate with: `rg -n "sf-start|auto-verify|full lifecycle|sf-end|sf-ship" skills/sf-build/SKILL.md skills/sf-build/references/build-lifecycle-workflow.md`
  - Notes: Do not make `sf-build` noisier in user mode.

- [x] Task 4: Update shared lifecycle doctrine only if needed.
  - File: `skills/references/master-workflow-lifecycle.md`
  - Action: Add a short shared note if current lifecycle doctrine would otherwise contradict auto-verify.
  - User story link: keeps downstream lifecycle skills coherent.
  - Depends on: Tasks 1-3.
  - Validate with: `rg -n "auto-verify|sf-start|sf-verify|local verification" skills/references/master-workflow-lifecycle.md`
  - Notes: Skip if local skill docs are sufficient.

- [x] Task 5: Validate skill quality and scenario pressure cases.
  - File: `skills/sf-start/SKILL.md`, `skills/sf-start/references/execution-workflow.md`, `skills/sf-build/SKILL.md`, `skills/sf-build/references/build-lifecycle-workflow.md`
  - Action: Run mechanical checks and review scenarios: local-only allowed, preview denied, manual QA denied, dirty unrelated files read-only, failed verification reroutes.
  - User story link: proves the new behavior is safer and clearer.
  - Depends on: Tasks 1-4.
  - Validate with: `python3 ~/plugins/shipflow-core/scripts/audit_shipflow_skills.py`; `python3 tools/skill_budget_audit.py --skills-root skills --format markdown`; `python3 tools/shipflow_metadata_lint.py <changed-frontmatter-files> shipflow_data/workflow/specs/auto-follow-through-for-local-only-sf-start-verification.md`; `tools/shipflow_sync_skills.sh --check --all`; `git diff --check`
  - Notes: No app/browser tests required.

## Acceptance Criteria

- [x] AC 1: Given `sf-start` completes local implementation and all auto-follow-through criteria are true, when its final phase runs, then it runs local verification or records `auto-verify: run` with validation evidence.
- [x] AC 2: Given verification requires preview, production, auth/browser, Sentry, manual QA, device proof, secret access, commit, or push, when `sf-start` finishes implementation, then it records `auto-verify: skipped` with exact owner route and does not run that proof.
- [x] AC 3: Given local verification fails, when `sf-start` reports, then it does not claim lifecycle success; it reports `partial` or a concrete correction route.
- [x] AC 4: Given the user invokes `sf-build`, when implementation passes verification, then `sf-build` remains responsible for closure and ship orchestration.
- [x] AC 5: Given unrelated dirty files exist, when auto-verify is local/read-only, then no staging, commit, push, ship, or dirty-scope claim occurs.
- [x] AC 6: Given a future agent reads only top-level `sf-start`, then it can identify the auto-follow-through rule and the forbidden proof surfaces without opening long examples.
- [x] AC 7: Given skill audits run after implementation, then ShipFlow Core plugin audit and skill budget audit report no new hard/review/style/body-risk findings.
- [x] AC 8: Given the implementation changes frontmatter docs or references, then metadata lint passes for changed artifacts.

## Test Strategy

- Scenario-first proof:
  - ALLOWED-LOCAL: local skill-governance verification after all checks pass.
  - DENY-PREVIEW: preview-push/browser proof must route to `sf-ship -> sf-prod`.
  - DENY-MANUAL: manual QA must route to `sf-test`, not auto-run.
  - FAIL-VERIFY: local verification failure reports `partial` or correction route.
  - DIRTY-READONLY: unrelated dirty files do not block read-only verification but block ship claims.
- Mechanical checks:
  - focused `rg` for criteria and stop conditions
  - metadata lint
  - skill budget audit
  - ShipFlow Core plugin audit
  - sync check
  - `git diff --check`

## Risks

- Medium workflow risk: too much automation could hide proof gaps.
- Medium trust risk: too little automation keeps frustrating the operator after safe local work.
- Low security risk: no auth/data behavior should change, but proof routing must avoid secrets and external targets.
- Documentation risk: lifecycle docs can become inconsistent if only one skill is updated.

## Execution Notes

- Read first:
  - `skills/sf-start/SKILL.md`
  - `skills/sf-start/references/execution-workflow.md`
  - `skills/sf-build/SKILL.md`
  - `skills/sf-build/references/build-lifecycle-workflow.md`
  - `skills/references/spec-driven-development-discipline.md`
  - `skills/references/reporting-contract.md`
- Proof path: `scenario-first`.
- Fresh external docs verdict: `fresh-docs not needed`.
- Stop and reroute if implementation would require changing `sf-verify` behavior materially; that would expand scope.
- Do not edit public docs unless user-facing skill promise text changes.

## Open Questions

None. The intended policy is bounded: auto-continue only for safe local verification, never for external proof or ship actions.

## Skill Run History

| Date UTC | Skill | Model | Action | Result | Next step |
|----------|-------|-------|--------|--------|-----------|
| 2026-06-10 19:34:59 UTC | sf-spec | GPT-5 Codex | Created spec from conversation audit finding about sf-start stopping before local verification follow-through. | draft saved | /sf-ready Auto-follow-through for local-only sf-start verification |
| 2026-06-10 19:42:23 UTC | sf-ready | GPT-5 Codex | Validated structure, user-story fit, bounded scope, language doctrine, security posture, adversarial cases, and proof path; corrected internal-contract language before readiness. | ready | /sf-start Auto-follow-through for local-only sf-start verification |
| 2026-06-10 19:48:10 UTC | sf-start | GPT-5 Codex + gpt-5.3-codex-spark subagent | Implemented bounded sf-start local auto-verify contract across sf-start, sf-build, shared lifecycle, and technical docs; local validation passed. | implemented; auto-verify: run | /sf-end Auto-follow-through for local-only sf-start verification |
| 2026-06-10 20:04:03 UTC | sf-end | GPT-5 Codex | Closed bookkeeping after local auto-verification, updated task tracking and changelog prep, and left commit/push to sf-ship. | closed | /sf-ship Auto-follow-through for local-only sf-start verification |

## Current Chantier Flow

- sf-spec: draft saved.
- sf-ready: ready.
- sf-start: implemented.
- sf-verify: local auto-verify completed by sf-start.
- sf-end: closed.
- sf-ship: not launched.
- Next step: `/sf-ship Auto-follow-through for local-only sf-start verification`.
