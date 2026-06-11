---
name: 001-sf-build
description: "Orchestrate story-to-ship product implementation."
argument-hint: "[spark|codex|mini|agents|sous-agent|no-agents] <story, bug, or goal>"
---

## Canonical Paths

Before resolving any ShipFlow-owned file, load `$SHIPFLOW_ROOT/skills/references/canonical-paths.md` (`$SHIPFLOW_ROOT` defaults to `$HOME/shipflow`). ShipFlow tools, shared references, skill-local `references/*`, templates, workflow docs, and internal scripts must resolve from `$SHIPFLOW_ROOT`, not from the project repo where the skill is running. Project artifacts and source files still resolve from the current project root unless explicitly stated otherwise.

## Chantier Tracking

Trace category: `obligatoire`.
Process role: `lifecycle`.

Before executing, load `$SHIPFLOW_ROOT/skills/references/chantier-tracking.md`. If exactly one chantier spec is in scope, read `Skill Run History` and `Current Chantier Flow`, append a current `001-sf-build` row with result `implemented`, `partial`, `blocked`, or `rerouted`, update `Current Chantier Flow`, and end with the compact `Chantier` block from `$SHIPFLOW_ROOT/skills/references/reporting-contract.md`. If no unique spec exists, do not write to a spec and report `Chantier: non applicable` or `Chantier: non trace` with the reason.

## Report Modes

Before producing the final report, load `$SHIPFLOW_ROOT/skills/references/reporting-contract.md`.

Default to `report=user`: concise, outcome-first, and using the compact chantier block. Use `report=agent` only when explicitly requested or when `001-sf-build` is preparing an internal handoff for another agent. When invoking downstream skills for internal evidence, pass `report=agent` or `handoff` only when detailed evidence is needed.

## Master Delegation

Before choosing execution topology, load `$SHIPFLOW_ROOT/skills/references/master-delegation-semantics.md`.

This skill owns end-to-end lifecycle orchestration through `104-sf-end` and `005-sf-ship`, with `main-only`, `delegated sequential`, and `spec-gated parallel` as reportable execution modes.

`spark`, `codex`, `mini`, `agents`, `subagent`, and `sous-agent` force delegated sequential execution; if unavailable for file work or validation, stop/report degraded. They never mean parallel execution.

## Master Workflow Lifecycle

Before resolving lifecycle gates, load `$SHIPFLOW_ROOT/skills/references/master-workflow-lifecycle.md`.

Use the shared skeleton for intake, work item resolution, readiness, model/topology routing, execution through owner skills, validation, verification, and post-verify closure/ship. Local sections below define `001-sf-build` routes and stop conditions only.

Before choosing a route, model, topology, mini-contract, or implementation path, load `$SHIPFLOW_ROOT/skills/references/decision-quality-contract.md`. When an owner handoff or fix is itself a failure finding, load `$SHIPFLOW_ROOT/skills/references/actionable-failure-contract.md` and choose the most specific owner route before implementation.

## Required References

Load `$SHIPFLOW_ROOT/skills/001-sf-build/references/build-lifecycle-workflow.md` for the detailed execution-mode playbook, question framing, governance/documentation gates, browser evidence routing, onboarding gate, and final report templates.

Before asking a user-facing question, load `$SHIPFLOW_ROOT/skills/references/question-contract.md`.

Before `102-sf-start`, load `$SHIPFLOW_ROOT/skills/704-sf-model/references/model-routing.md` and choose model profile based on complexity, ambiguity, failure cost, expected duration, and topology.

Before UI, mobile, component, layout, typography, spacing, color, shadow/elevation, motion, safe-area, keyboard/IME, overlay, responsive, token, theme, or visual proof work, load `$SHIPFLOW_ROOT/skills/references/design-system-token-contract.md` and route design-system changes through the canonical token/theme/component source.

## Mission

`001-sf-build` is the user-facing lifecycle orchestrator. It keeps user interaction high level while executing:

`intake -> existing chantier check -> spec/readiness loop -> governance corpus gate -> model routing gate -> start -> verify -> end -> ship`

The objective is an excellent professional lifecycle that removes manual detours while preserving quality, security, performance, durability, and proof.

`102-sf-start` may continue into local, bounded verification when safe, but that is an implementation-side optimization only. Full lifecycle ownership (`103-sf-verify` routing, `104-sf-end`, and `005-sf-ship`) remains with `001-sf-build`.

## Execution Modes

- `main-only`: only for pure conversational output, explicit planning without mutation, or an explicit no-subagent request.
- `delegated sequential` (default): `/001-sf-build <story>` or `$001-sf-build <story>` is bounded delegation consent for the current chantier; run one bounded implementation/validation owner at a time.
- `spec-gated parallel`: allowed only when a ready spec defines safe `Execution Batches`. Without explicit safe batches, parallelism is blocked.

Report `Agents: used`, `Agents: not needed`, or `Agents: degraded: <reason>` only when topology affects trust.

## Existing Chantier Check

Before creating any spec:

1. Search active specs in `specs/*.md` and `shipflow_data/workflow/specs/*.md` as allowed by the project layout.
2. Compare user story, expected result, linked systems, impacted files/surfaces, and `Current Chantier Flow`.
3. Prefer continuing the matching active spec.
4. Create a new spec only when promise or outcome is genuinely new.
5. If multiple specs are plausible, ask a user decision instead of guessing.

## Spec And Readiness Loop

For non-trivial work, run or route through `100-sf-spec`, then `101-sf-ready`, and do not run `102-sf-start` until the spec is `ready`. If readiness fails, apply one correction pass and rerun readiness; stop after the bounded loop with `blocked` or a user decision.

For trivial and local work that is safe without a full spec, allow a direct mini-contract only when the decision-quality contract is satisfied.

## Proof Owner Routing

Do not treat browser/manual proof as generic:

- `108-sf-browser`: non-auth browser evidence.
- `109-sf-auth-debug`: auth/session/callback/cookie/provider/tenant/protected-route issues.
- `405-sf-prod`: hosted deployment/runtime truth, logs, serverless/edge behavior, or live deployment health.
- `107-sf-test`: durable manual QA scripts, retests, and structured test logs.

In `vercel-preview-push` or preview-required `hybrid` mode, ship first, then route to `405-sf-prod`, then to the downstream proof owner.

## Stop Conditions

Stop and ask or reroute when:

- spec ownership is ambiguous
- readiness does not pass
- requested parallelism has no safe `Execution Batches`
- file ownership overlaps in a parallel plan
- subagent mode was requested but unavailable or not applied for file work, validation, closure, or ship preparation
- governance corpus state is missing/stale and unresolved
- a change would alter existing behavior without explicit decision
- proposed execution would act as a quick-fix shortcut instead of preserving root cause, owner routing, shared structure, and proof
- proposed UI/design execution would add or tolerate visual values outside the centralized design-system source without drift-check evidence and a named exception
- permission/data/security semantics remain ambiguous
- docs freshness is required and unresolved
- verification is insufficient for the promised user outcome
- ship scope includes unrelated dirty files and user did not authorize it

## Final Report

Apply `$SHIPFLOW_ROOT/skills/references/reporting-contract.md`. The default user-facing report is concise; the detailed phase report is reserved for `report=agent`, blocked runs, or explicit handoff. Use `build-lifecycle-workflow.md` for the full user-mode and agent-mode templates.

## Rules

- Orchestrate; do not duplicate every atomic skill.
- Preserve user changes and avoid unrelated refactors.
- Keep technical and editorial coherence gates explicit.
- Follow `$SHIPFLOW_ROOT/skills/references/master-delegation-semantics.md`.
- Do not commit or push directly from `001-sf-build`; delegate closure and ship through `104-sf-end` and `005-sf-ship`.
- Do not make the user manually run `104-sf-end` or `005-sf-ship` after successful verification unless a named stop condition blocks automatic orchestration.
- Treat `102-sf-start` auto-verify as an allowed local optimization only; do not interpret it as automatic completion of lifecycle orchestration.

## Validation

Validate this skill after edits with:

- `rg -n "Trace category|Process role|Master Delegation|Master Workflow Lifecycle|Existing Chantier Check|Question Gate|Stop Conditions|Final Report|build-lifecycle-workflow" skills/001-sf-build/SKILL.md`
- `python3 tools/skill_budget_audit.py --skills-root skills --format markdown`
- `python3 tools/shipflow_metadata_lint.py skills/001-sf-build/references/build-lifecycle-workflow.md`
