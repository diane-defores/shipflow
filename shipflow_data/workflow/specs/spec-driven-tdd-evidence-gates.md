---
artifact: spec
metadata_schema_version: "1.0"
artifact_version: "1.0.0"
project: "shipflow"
created: "2026-05-17"
created_at: "2026-05-17 21:39:40 UTC"
updated: "2026-05-18"
updated_at: "2026-05-18 17:59:27 UTC"
status: ready
source_skill: sf-spec
source_model: "GPT-5 Codex"
scope: "skill-development-discipline"
owner: "Diane"
user_story: "As the ShipFlow operator, I want spec-driven development to include explicit test-first or evidence-first gates where they fit, so execution keeps its product/architecture contract while reducing unverified implementation changes."
confidence: high
risk_level: medium
security_impact: yes
docs_impact: yes
linked_systems:
  - "skills/sf-start/SKILL.md"
  - "skills/sf-fix/SKILL.md"
  - "skills/sf-bug/SKILL.md"
  - "skills/sf-skill-build/SKILL.md"
  - "skills/sf-verify/SKILL.md"
  - "skills/references/master-workflow-lifecycle.md"
  - "skills/references/master-delegation-semantics.md"
  - "skills/references/skill-instruction-layering.md"
  - "skills/references/skill-context-budget.md"
depends_on:
  - artifact: "skills/references/master-workflow-lifecycle.md"
    artifact_version: "1.2.1"
    required_status: "active"
  - artifact: "skills/references/master-delegation-semantics.md"
    artifact_version: "1.2.1"
    required_status: "active"
  - artifact: "skills/references/skill-instruction-layering.md"
    artifact_version: "0.1.0"
    required_status: "draft"
  - artifact: "skills/references/skill-context-budget.md"
    artifact_version: "0.3.1"
    required_status: "draft"
supersedes: []
evidence:
  - "User decision 2026-05-17: keep ShipFlow spec-driven development as the outer lifecycle, and try TDD as an implementation gate rather than a replacement methodology."
  - "Research artifact /home/claude/contentglowz/research/superpowers-shipflow-skills-research.md recommends adapting Superpowers patterns, not installing the plugin directly."
  - "Superpowers exposes strong TDD, systematic-debugging, writing-skills, verification-before-completion, review, and worktree patterns."
  - "Current ShipFlow skill budget audit from the research run: 61 skills, 0 hard violations, 0 warnings, 0 separate risks, absolute estimate 6805/8000."
  - "2026-05-17 sf-ready verdict: not ready because open implementation questions and optional scope decisions remained."
  - "2026-05-18 sf-spec decision: create a separate compact discipline reference, keep sf-check out of the first iteration, and update delegation doctrine now."
next_step: "none"
---

# Spec: Spec-Driven TDD Evidence Gates

## Title

Spec-Driven TDD Evidence Gates

## Status

ready

## User Story

As the ShipFlow operator, I want spec-driven development to include explicit test-first or evidence-first gates where they fit, so execution keeps its product/architecture contract while reducing unverified implementation changes.

## Minimal Behavior Contract

When a ShipFlow execution skill modifies behavior, fixes a bug, or changes a skill contract, it must keep the spec or bug file as the source of truth and choose the strongest practical proof path before implementation: test-first for testable behavior, reproduction/regression-first for bugs, scenario-first for skill changes, or evidence-first for UI, docs, auth, infra, deploy, and other flows where automated tests are not the right proof. If no test-first path applies, the skill must say why and name the alternate proof. The easy edge case is turning TDD into a blanket rule that blocks visual, operational, or documentation work, or treating "no test" as permission to ship without evidence.

## Success Behavior

- Preconditions: ShipFlow remains spec-first for non-trivial work; bug work remains bug-file-first; small local work may still use a mini-contract.
- Trigger: an operator runs `sf-start`, `sf-fix`, `sf-bug`, or `sf-skill-build` on work that changes behavior or a skill contract.
- User/operator result: the final report says whether the work used test-first, regression-first, scenario-first, or evidence-first, and names the validation performed.
- System effect: execution skills gain a compact shared discipline reference and local insertion points without duplicating large doctrine.
- Proof of success: changed skills stay under budget; `skill_budget_audit.py` passes; `shipflow_sync_skills.sh --check --all` passes; targeted `rg` checks confirm the gate is visible in each touched skill.

## Error Behavior

- If a task is non-trivial but has no spec, bug file, or mini-contract, execution must stop or route to `sf-spec` or `sf-bug`.
- If behavior is testable and no failing test, regression test, or explicit exception is recorded, verification should fail.
- If the proof path is evidence-first, the skill must name concrete evidence: browser proof, screenshot, manual QA, log, prod check, metadata lint, sync check, or another relevant command.
- If a repeated bug fix attempt lacks cause-root evidence, route to deeper diagnosis instead of another patch.
- Must never happen: replacing the spec with tests as the source of truth, shipping a behavioral change with no proof, logging secrets while collecting proof, or importing third-party skills as trusted instructions without vetting.

## Problem

ShipFlow currently uses spec-driven development for non-trivial work. That is the right outer lifecycle because it captures user story, scope, contracts, risks, dependencies, documentation impact, execution order, and acceptance criteria. Superpowers adds a useful pressure: before changing behavior, agents should prove the current behavior fails, then implement the minimum change, then verify the result.

The risk is applying TDD too literally. ShipFlow work includes code, UI, docs, skills, browser checks, auth, deployment, content, governance, and operational workflows. A universal RED-GREEN-REFACTOR mandate would create friction and false exceptions. The useful version is narrower: keep specs as the contract, then require test-first where appropriate and evidence-first everywhere else.

## Solution

Add a shared ShipFlow discipline reference and small local hooks in execution skills:

- `spec-first`: non-trivial work starts from a spec; bugs start from a bug file; narrow work starts from a mini-contract.
- `test-first`: behavioral code changes should start with a failing automated test when a reasonable test surface exists.
- `regression-first`: bug fixes should start with reproduction and, where practical, a failing regression test.
- `scenario-first`: skill changes should start with one or more pressure scenarios that demonstrate the old contract is ambiguous or insufficient.
- `evidence-first`: UI, docs, auth, deployment, content, visual, operational, and integration work must name concrete evidence before claiming completion.
- `exception-with-proof`: when test-first is not practical, record why and require the alternate proof path.

This is an implementation discipline inside spec-driven development, not a replacement for specs.

## Scope In

- Create one compact shared reference for development discipline, likely `skills/references/spec-driven-development-discipline.md`.
- Update `sf-start` to load or cite the reference when implementing ready specs or mini-contract work.
- Update `sf-fix` and `sf-bug` with root-cause, reproduction, regression-first, and exception-with-proof gates.
- Update `sf-skill-build` with scenario-first validation for skill contract changes.
- Update `sf-verify` or its verification reference so completion claims are checked against the chosen proof path.
- Update `master-workflow-lifecycle.md` with one compact canonical sentence: spec-first is the outer contract; proof-first is the implementation discipline.
- Update `master-delegation-semantics.md` so delegated coding, bug-fix, and skill-maintenance missions name the expected proof path when it affects trust or validation.
- Update changelog and any relevant technical docs if the operator-facing behavior changes.

## Scope Out

- Installing Superpowers as a runtime plugin.
- Copying Superpowers skill bodies directly into ShipFlow.
- Replacing `sf-spec`, `sf-ready`, `sf-start`, `sf-verify`, `sf-end`, or `sf-ship`.
- Making automated TDD mandatory for every UI, docs, visual, deploy, auth, or governance task.
- Adding many new skills to the discovery inventory.
- Renaming skills, changing invocation keys, or deleting existing skills.
- Changing project application tests unrelated to ShipFlow skill behavior.
- Teaching `sf-check` the proof taxonomy in the first iteration; it remains a technical command runner and validation surface.

## Constraints

- Preserve ShipFlow's spec-driven lifecycle as the source of truth for non-trivial product and skill work.
- Keep top-level `SKILL.md` bodies compact; move reusable doctrine to references.
- Do not increase skill discovery descriptions unless a routing distinction truly needs it.
- Keep `Trace category`, `Process role`, canonical-path, report mode, and chantier blocks visible where they already exist.
- The proof gate must not require unavailable tooling. It must degrade to an explicit alternate proof path.
- For security-sensitive proof, do not log secrets, cookies, tokens, private env values, or raw provider credentials.
- External docs freshness is not required for the initial local doctrine unless implementation relies on current third-party APIs or plugin behavior.

## Dependencies

- `skills/references/master-workflow-lifecycle.md`: lifecycle source of truth.
- `skills/references/master-delegation-semantics.md`: delegated mission contract and ownership.
- `skills/references/skill-instruction-layering.md`: where to place shared doctrine vs local activation text.
- `skills/references/skill-context-budget.md`: budget constraints for adding or expanding skill instructions.
- `skills/sf-start/SKILL.md`: spec implementation entrypoint.
- `skills/sf-fix/SKILL.md` and `skills/sf-bug/SKILL.md`: bug diagnosis and fix loops.
- `skills/sf-skill-build/SKILL.md`: skill maintenance lifecycle.
- `skills/sf-verify/SKILL.md`: proof and coherence gate.
- Fresh external docs verdict: `fresh-docs not needed` for the local ShipFlow doctrine. If the implementation cites current Claude Code or Agent Skills platform constraints beyond local references, check official docs before changing policy.

## Invariants

- Specs and bug files remain the durable source of truth.
- Tests prove implementation behavior; they do not define product scope by themselves.
- Evidence-first is a real gate, not a loophole around testing.
- Every execution path must end with proof matching the changed surface.
- Repeated bug patches without root-cause evidence are blocked.
- Skill changes are validated by pressure scenarios or explicit mechanical checks.
- Delegated agents receive the proof path as part of their mission when it affects trust or validation.

## Links & Consequences

- `sf-start` reports may become more explicit about proof strategy.
- `sf-fix` and `sf-bug` may stop earlier when reproduction or root cause is missing.
- `sf-skill-build` may require scenario examples before changing a skill body.
- `sf-verify` can reject completion claims when proof and changed surface do not match.
- `sf-check`, `sf-test`, `sf-browser`, `sf-auth-debug`, and `sf-prod` remain proof owners for different surfaces.
- The change may improve reliability but can add small upfront friction for quick fixes.

## Documentation Coherence

- Update `CHANGELOG.md` when the discipline is implemented.
- Update `shipflow_data/technical/skill-runtime-and-lifecycle.md` if it documents execution lifecycle details affected by this gate.
- Update `skills/references/master-workflow-lifecycle.md` only if the relationship between spec-first and proof-first should become canonical.
- Update public site/docs only if command behavior or user-facing promises change enough to affect users.

## Edge Cases

- UI visual work has no useful unit test but needs screenshot/browser proof.
- A docs-only change has no automated test but needs metadata lint, link checks, or targeted content review.
- A bug is reproduced manually but lacks a practical automated regression test; the exception must name the manual retest proof.
- A flaky test fails first but does not prove the bug; root-cause gate should reject it as insufficient.
- A refactor claims no behavior change; validation must still prove existing checks pass.
- A skill wording change has no code test; scenario-first validation should show before/after routing or behavior clarity.
- A delegated agent edits code but omits the proof path in its report.
- A small mini-contract task would become slower than useful if forced through full spec and full TDD.

## Implementation Tasks

- [x] Task 1: Create the shared discipline reference.
  - File: `skills/references/spec-driven-development-discipline.md`
  - Action: Define spec-first outer loop, proof-first implementation loop, proof path taxonomy, exception rules, and stop conditions.
  - User story link: Establishes the shared contract without bloating individual skills.
  - Depends on: None.
  - Validate with: `python3 tools/shipflow_metadata_lint.py skills/references/spec-driven-development-discipline.md`
  - Notes: Keep compact and reusable; do not copy Superpowers text directly.

- [x] Task 2: Add the execution hook to `sf-start`.
  - File: `skills/sf-start/SKILL.md`
  - Action: Require choosing test-first, scenario-first, or evidence-first before implementation, and report the chosen proof path.
  - User story link: Applies the discipline to spec implementation.
  - Depends on: Task 1.
  - Validate with: `rg -n "spec-driven-development-discipline|test-first|evidence-first|proof path" skills/sf-start/SKILL.md`
  - Notes: Preserve compact activation body and existing reference loading.

- [x] Task 3: Add root-cause and regression-first hooks to bug workflows.
  - File: `skills/sf-fix/SKILL.md`
  - Action: Clarify reproduction, root-cause hypothesis, regression-first when practical, and exception-with-proof requirements.
  - User story link: Reduces unverified bug patches.
  - Depends on: Task 1.
  - Validate with: `rg -n "root cause|regression-first|reproduction|exception|proof" skills/sf-fix/SKILL.md`
  - Notes: Avoid duplicating long debugging doctrine.

- [x] Task 4: Align bug lifecycle orchestration with the proof gate.
  - File: `skills/sf-bug/SKILL.md`
  - Action: Ensure bug-file-driven paths require reproduction/proof strategy before fix, retest, verify, or ship-risk claims.
  - User story link: Keeps bug lifecycle coherent with the new discipline.
  - Depends on: Task 1 and Task 3.
  - Validate with: `rg -n "proof path|reproduction|root cause|regression" skills/sf-bug/SKILL.md`
  - Notes: Do not change bug file source-of-truth rules.

- [x] Task 5: Add scenario-first validation to skill maintenance.
  - File: `skills/sf-skill-build/SKILL.md`
  - Action: Require pressure scenarios or mechanical validation before modifying skill contracts.
  - User story link: Applies TDD-like behavior to skills without pretending skills are ordinary code.
  - Depends on: Task 1.
  - Validate with: `rg -n "scenario-first|pressure scenario|skill contract|spec-driven-development-discipline" skills/sf-skill-build/SKILL.md`
  - Notes: Keep compatibility with existing `skill-instruction-layering` and budget checks.

- [x] Task 6: Teach verification to check proof-path fit.
  - File: `skills/sf-verify/SKILL.md`
  - Action: Verify that completion evidence matches the changed surface and chosen proof path.
  - User story link: Prevents "done" claims without appropriate evidence.
  - Depends on: Task 1.
  - Validate with: `rg -n "proof path|evidence-first|test-first|scenario-first" skills/sf-verify/SKILL.md`
  - Notes: Verification should fail when proof is absent or mismatched.

- [x] Task 7: Canonicalize the spec-first/proof-first relationship in the lifecycle reference.
  - File: `skills/references/master-workflow-lifecycle.md`
  - Action: Add one compact paragraph defining spec-first as the outer lifecycle contract and proof-first as the implementation discipline.
  - User story link: Makes the relationship canonical across master skills.
  - Depends on: Tasks 1-6.
  - Validate with: `python3 tools/shipflow_metadata_lint.py skills/references/master-workflow-lifecycle.md`
  - Notes: Keep this short; do not duplicate the new discipline reference.

- [x] Task 8: Add proof-path expectations to delegated missions.
  - File: `skills/references/master-delegation-semantics.md`
  - Action: Require bounded coding, bug-fix, and skill-maintenance missions to state the expected proof path and report whether it was satisfied.
  - User story link: Prevents delegated execution from bypassing the new gate.
  - Depends on: Task 1 and Task 7.
  - Validate with: `python3 tools/shipflow_metadata_lint.py skills/references/master-delegation-semantics.md`
  - Notes: Do not create a new parallelism mode; this only enriches mission contracts.

- [x] Task 9: Run validation and update docs/changelog.
  - File: `CHANGELOG.md`
  - Action: Record the new discipline if implementation changes skill behavior; update technical lifecycle docs if touched.
  - User story link: Keeps the governance corpus coherent.
  - Depends on: Tasks 1-8.
  - Validate with: `python3 tools/skill_budget_audit.py --skills-root skills --format markdown` and `tools/shipflow_sync_skills.sh --check --all`
  - Notes: Validation and technical lifecycle docs were updated in `sf-start`; `CHANGELOG.md` was updated in `sf-end`.

## Acceptance Criteria

- [x] CA 1: Given a ready spec that changes testable behavior, when `sf-start` executes it, then the run chooses a test-first path or records a concrete exception with alternate evidence.
- [x] CA 2: Given a bug fix request with reproducible behavior, when `sf-fix` or `sf-bug` executes it, then the run captures reproduction, a root-cause hypothesis, and a regression-first path where practical.
- [x] CA 3: Given a skill contract change, when `sf-skill-build` executes it, then it defines pressure scenarios or mechanical checks before changing the skill.
- [x] CA 4: Given UI, docs, auth, deploy, or operational work where automated TDD is not appropriate, when execution completes, then the final proof is concrete and surface-specific.
- [x] CA 5: Given a completion claim with no test, no evidence, and no exception, when `sf-verify` reviews it, then verification fails.
- [x] CA 6: Given the changed ShipFlow skills, when `skill_budget_audit.py` runs, then there are 0 hard violations, 0 warnings, and 0 body-size risks.
- [x] CA 7: Given the changed ShipFlow skills, when `shipflow_sync_skills.sh --check --all` runs, then runtime skill sync passes.
- [x] CA 8: Given changed references or specs with frontmatter, when `shipflow_metadata_lint.py` runs on them, then metadata validation passes.
- [x] CA 9: Given a delegated coding, bug-fix, or skill-maintenance mission, when the mission is created, then it names the expected proof path and the returned report says whether that path was satisfied.

## Test Strategy

- Run `python3 tools/skill_budget_audit.py --skills-root skills --format markdown` before and after implementation.
- Run `tools/shipflow_sync_skills.sh --check --all`.
- Run `python3 tools/shipflow_metadata_lint.py` on changed frontmatter docs and references.
- Run targeted `rg` checks listed in the implementation tasks.
- Manually inspect the touched skill bodies to confirm local hooks remain compact and point to the shared reference.
- Use one adversarial example per proof path:
  - test-first: a behavior change with an existing test surface.
  - regression-first: a bug with reproducible output.
  - scenario-first: a skill wording change.
  - evidence-first: docs/UI/prod/auth style work.

## Risks

- The new gate could become dogma and slow small work if exceptions are not clear.
- The new reference could duplicate lifecycle doctrine and increase instruction dilution.
- `sf-verify` could become too strict for surfaces where manual evidence is the correct proof.
- Bug workflows could over-focus on writing tests before understanding cause root.
- Directly copying Superpowers wording could create license, tone, or doctrine mismatch risk.
- A third-party plugin could be treated as trusted supply-chain input without review if the policy is written too loosely.

## Execution Notes

- Read first:
  - `skills/references/master-workflow-lifecycle.md`
  - `skills/references/master-delegation-semantics.md`
  - `skills/references/skill-instruction-layering.md`
  - `skills/sf-start/SKILL.md`
  - `skills/sf-fix/SKILL.md`
  - `skills/sf-bug/SKILL.md`
  - `skills/sf-skill-build/SKILL.md`
  - `skills/sf-verify/SKILL.md`
- Implementation approach:
  1. Add one compact shared reference.
  2. Add short local pointers and proof-path requirements in execution skills.
  3. Keep changes small enough to avoid body-size budget regressions.
  4. Validate mechanically before any broader docs updates.
- Avoid:
  - new always-enabled skills unless a separate routing case proves the need.
  - direct plugin installation.
  - broad rewrites of lifecycle docs.
  - changing `name:` or `description:` fields unless unavoidable.
- Stop conditions:
  - a touched skill exceeds budget thresholds.
  - the new gate conflicts with chantier tracking or existing lifecycle roles.
  - verification cannot define a fair evidence-first path.
  - dirty unrelated ShipFlow files overlap the target write set.

## Open Questions

None.

## Skill Run History

| Date UTC | Skill | Model | Action | Result | Next step |
|----------|-------|-------|--------|--------|-----------|
| 2026-05-17 21:39:40 UTC | sf-spec | GPT-5 Codex | Created draft spec for integrating TDD/evidence gates into ShipFlow's spec-driven lifecycle. | Draft saved. | /sf-ready spec-driven-tdd-evidence-gates |
| 2026-05-17 21:46:38 UTC | sf-ready | GPT-5 Codex | Evaluated readiness against structure, ambiguity, proof strategy, adversarial, security, and language gates. | not ready: open implementation questions and optional scope decisions remain. | /sf-spec spec-driven-tdd-evidence-gates |
| 2026-05-18 08:45:13 UTC | sf-spec | GPT-5 Codex | Resolved open decisions: separate discipline reference, sf-check out of first iteration, delegation reference in scope. | Spec updated to reviewed. | /sf-ready spec-driven-tdd-evidence-gates |
| 2026-05-18 15:11:51 UTC | sf-ready | GPT-5 Codex | Re-evaluated readiness after open decisions were resolved. | ready: structure, metadata, proof strategy, security, language doctrine, and execution plan pass. | /sf-start spec-driven-tdd-evidence-gates |
| 2026-05-18 16:12:44 UTC | sf-start | GPT-5 Codex | Implemented shared proof-path discipline, skill hooks, verification gate, master lifecycle/delegation updates, technical docs, and validation. | partial: implementation complete; CHANGELOG.md deferred to sf-end per sf-start rule. | /sf-verify spec-driven-tdd-evidence-gates |
| 2026-05-18 17:55:57 UTC | sf-end | GPT-5 Codex | Closed the proof-first discipline chantier, updated task trackers, and added the changelog entry. | closed: implementation and bookkeeping complete; separate sf-verify was not launched by operator decision. | /sf-ship spec-driven-tdd-evidence-gates |
| 2026-05-18 17:59:27 UTC | sf-ship | GPT-5 Codex | Quick-shipped the proof-first discipline chantier after focused metadata, skill budget, and runtime sync checks. | shipped | none |

## Current Chantier Flow

- sf-spec: done
- sf-ready: ready
- sf-start: implemented; changelog gap closed by sf-end
- sf-verify: not launched by operator decision
- sf-end: closed
- sf-ship: shipped

Next command: none
