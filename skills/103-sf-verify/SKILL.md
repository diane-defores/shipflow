---
name: 103-sf-verify
description: "Verify ship readiness, correctness, coherence, and risk."
argument-hint: [optional: tâche ou scope à vérifier]
---

## Canonical Paths

Before resolving any ShipFlow-owned file, load `$SHIPFLOW_ROOT/skills/references/canonical-paths.md` (`$SHIPFLOW_ROOT` defaults to `$HOME/shipflow`). ShipFlow tools, shared references, skill-local `references/*`, templates, workflow docs, and internal scripts must resolve from `$SHIPFLOW_ROOT`, not from the project repo where the skill is running. Project artifacts and source files still resolve from the current project root unless explicitly stated otherwise.

## Instruction Layering

Load `$SHIPFLOW_ROOT/skills/references/skill-instruction-layering.md` before execution. This skill keeps local verdict semantics and six verification dimensions, while detailed gate playbooks are loaded from references.

## Chantier Tracking

Trace category: `obligatoire`.
Process role: `lifecycle`.

Before verifying a spec-first chantier, load `$SHIPFLOW_ROOT/skills/references/chantier-tracking.md`, then read the spec's `Skill Run History` and `Current Chantier Flow` when a unique spec exists. Append a current `103-sf-verify` row with result `verified`, `not verified`, `partial`, or `blocked`, update `Current Chantier Flow`, and end the report with the compact `Chantier` block from `$SHIPFLOW_ROOT/skills/references/reporting-contract.md`. If no unique spec is available, do not write to a spec; report `Chantier: non applicable` or `Chantier: non trace` with the reason.

Verification semantics:

- `partial`: implementation appears complete but required proof is missing (manual QA, preview/prod proof, browser/auth proof, Sentry pointer, device-only validation). Each missing proof gap must be routed to a concrete next owner (`405-sf-prod`, `108-sf-browser`, `109-sf-auth-debug`, `107-sf-test`, `005-sf-ship`, etc.) with proof type, scenario, and target/environment when knowable; if target/environment is unknown, route to `405-sf-prod` with explicit target discovery task and do not claim readiness.
- Never downgrade completed `102-sf-start` implementation semantics only because verification evidence is incomplete.
- Keep the distinction explicit: `102-sf-start: implemented` vs `103-sf-verify: partial`.

When `103-sf-verify` partial is caused by hosted/deployed/provider proof, the next routing contract is mandatory:

- `103-sf-verify`: `partial` -> `005-sf-ship -> 405-sf-prod` if deploy is needed -> proof owner (`108-sf-browser`, `109-sf-auth-debug`, or `107-sf-test`) with target and scenario.


Before judging implementation quality, load `$SHIPFLOW_ROOT/skills/references/decision-quality-contract.md`. Verification must fail or report partial when the work merely takes the fastest/easiest path and leaves correctness, security, performance, maintainability, durability, excellence, or proof quality below the accepted contract.
When reporting any failure state, load `$SHIPFLOW_ROOT/skills/references/actionable-failure-contract.md` and include the concrete owner route for each evidence-backed issue.

## Report Modes

Before producing the final report, load `$SHIPFLOW_ROOT/skills/references/reporting-contract.md`.

Default to `report=user`: concise, findings-first when verification fails, compact chantier block.
Use `report=agent` for handoff, blocked runs, or explicit verbose request.

## Mission

Verify ship readiness against the user story, implementation completeness, correctness, coherence, dependencies, proof quality, and risk.

## Context

- Current directory: !`pwd`
- Current date: !`date '+%Y-%m-%d'`
- Project name: !`basename $(pwd)`
- Git branch: !`git branch --show-current 2>/dev/null || echo "unknown"`
- Git diff stat: !`git diff HEAD --stat 2>/dev/null || echo "no changes"`
- Recent commits: !`git log --oneline -10 2>/dev/null || echo "no commits"`

## Verification Contract

Verify ship-readiness across six dimensions:

1. User story outcome
2. Completeness
3. Correctness
4. Coherence
5. Dependencies
6. Risks

7. Manual checklist gate: required rows are `PASS` or explicitly exception-handled; unresolved `NOT_RUN`/`FAIL`/`BLOCKED` required rows block clean verification.

Mandatory explicit checks:

- `Success Behavior` pass/partial/fail/not demonstrated
- `Error Behavior` pass/partial/fail/not demonstrated
- `Proof Path Fit` pass/partial/fail/not chosen: test-first, regression-first, scenario-first, evidence-first, or exception-with-proof matches the changed surface
- `Fast Fix Shortcut Gate` pass/partial/fail: implementation does not bypass root cause, owner routing, shared structure, documentation, or required proof to make a symptom disappear.
- `Flutter Mobile Proof Ladder` pass/partial/fail/not applicable: widget tests -> agent-run Flutter Web smoke through `108-sf-browser`/`109-sf-auth-debug` -> APK/device proof order is respected for Flutter mobile UI work
- `Bug Gate` (clear/partial-risk/blocks ship/not assessed)
- `UI Design-System Shortcut Gate` pass/partial/fail/not applicable: UI, IME, keyboard, overlay, responsive, spacing, typography, color, motion, target-size, layout, or component work does not rely on unexplained one-off hardcoded visual values; any unavoidable literal is named, scoped, platform-bound, and proven.
- `Runtime Diagnostics Gate` pass/partial/fail/not applicable: runtime projects preserve or add Sentry, safe diagnostics/log-copy, and commit/build + Paris/UTC build-time header, or document a valid static-site exception.
- `Operator Autonomy Gate` pass/partial/fail: the agent used available safe tools, files, browser/app diagnostics, logs, and checks before asking the operator; any user request is limited to a real decision, secret, unavailable environment, device/manual-only proof, or unsafe side effect.
- project development mode and validation surface
- fresh external docs verdict (`fresh-docs checked|not needed|gap|conflict`)
- documentation coherence verdict
- language doctrine verdict for ShipFlow artifacts
- decision quality and excellence verdict: pass/partial/fail for the primary metrics in `decision-quality-contract.md`
- editorial score gate verdict when a spec/workflow requires content quality proof

## Required References

Always load:

1. `$SHIPFLOW_ROOT/skills/103-sf-verify/references/verification-gates.md`
2. `$SHIPFLOW_ROOT/skills/references/project-development-mode.md`
3. `$SHIPFLOW_ROOT/skills/references/documentation-freshness-gate.md`
4. `$SHIPFLOW_ROOT/skills/references/spec-driven-development-discipline.md`
5. `$SHIPFLOW_ROOT/skills/references/decision-quality-contract.md`
6. `$SHIPFLOW_ROOT/skills/references/content-quality-rubric.md` when scope includes an editorial score or content quality gate.

Load on demand:

- `$SHIPFLOW_ROOT/skills/references/sentry-observability.md` when runtime failures/observability/deployed behavior are in scope.
- `$SHIPFLOW_ROOT/skills/references/runtime-diagnostics-surface.md` when verifying a runtime app, support/error handling, settings, auth callback, Sentry, browser-debug, log-copy, or deploy-proof surface.
- `/109-sf-auth-debug` evidence for auth/session/callback/protected-route proof.
- `/108-sf-browser` evidence for non-auth browser proof.

## Editorial Score Gate

When a chantier asks for an editorial score or content quality gate:

- Validate the rubric schema from `content-quality-rubric.md`: `schema_version`, `run_id`, `run_signature`, `project_id`, `surface`, `evaluator`, `input_refs`, `applied_rules_revision`, `scores`, `weights`, `status`, `blocked_reasons`, `evidence`, `recommendations`, `confidence`, `expires_at_utc`.
- Reject stale or mismatched signatures with `stale_or_mismatched_score`.
- Reject recoverable/non-final statuses as verification proof: `needs retry`, `duplicate_in_progress`, `conflicting_score_state`, `stale_or_mismatched_score`.
- Accept only final statuses: `ready`, `needs revision`, `blocked`, `publishable with caveats`.
- Treat any blocking criterion or blocking code as non-verified for ship-readiness.

## Skill Coherence Check (when scope touches ShipFlow skills)

When verified changes include `skills/*/SKILL.md`:

- each changed skill must expose `Trace category` and `Process role`
- changed `source-de-chantier` skills must still contain chantier-potential guidance
- changed helper skills must not present themselves as chantier sources
- skill contract changes must show `scenario-first` pressure scenarios, mechanical checks, or `exception-with-proof`
- if runtime-discoverable skills changed, run `tools/shipflow_sync_skills.sh --check --skill <name>` or `--check --all`

## Tracker Rule

`103-sf-verify` can patch code/docs when contract is stable, but shared trackers are read-only in this skill:

- do not edit `TASKS.md`, `AUDIT_LOG.md`, `PROJECTS.md` from `103-sf-verify`
- if verification only reads task, audit, or `spec:` operational records, treat `$SHIPFLOW_ROOT/skills/references/operational-record-format.md` as reader context; load it before any exceptional spec-summary repair.
- do not treat tracker frontmatter absence as defect

## Stop Conditions

Report `not verified` or `blocked` when:

- no reliable scope/work-item contract can be identified
- high/critical bug in scope is still open
- required validation surface is missing for `vercel-preview-push`/`hybrid` scope
- completion evidence does not match the chosen proof path, or no proof path was chosen for behavioral, bug, skill-contract, UI/docs/auth/deploy, or operational work
- critical security/data/workflow risk is unproven or failing
- the implementation is a shortcut that violates the decision-quality contract
- the implementation is a quick-fix shortcut that bypasses durable process, ownership, root cause, shared structure, documentation, or required proof
- UI/design work hides a defect through hardcoded sizes, offsets, breakpoints, z-indexes, colors, font sizes, spacing, animation timings, IME/keyboard insets, overlay positions, or viewport constants instead of repairing the token/theme/component/layout/measurement source of truth

## Validation

Run focused checks based on scope and diff:

```bash
rg -n "Trace category|Process role|Success Behavior|Error Behavior|Proof Path Fit|decision quality|proof path|evidence-first|test-first|scenario-first|fresh-docs|Chantier" skills/103-sf-verify/SKILL.md
python3 tools/skill_budget_audit.py --skills-root skills --format markdown
```
