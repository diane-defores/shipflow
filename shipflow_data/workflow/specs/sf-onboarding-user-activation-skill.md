---
artifact: spec
metadata_schema_version: "1.0"
artifact_version: "1.0.0"
project: ShipFlow
created: "2026-05-31"
updated: "2026-05-31"
status: ready
source_skill: sf-spec
scope: skill
owner: Diane
confidence: high
risk_level: medium
security_impact: yes
docs_impact: yes
user_story: "As a ShipFlow operator who ships product features, I want a dedicated onboarding skill that turns shipped capabilities into contextual, assistive user activation experiences, so users understand why the feature matters, what to do first, and how to get maximum value regardless of their technical level."
linked_systems:
  - skills/sf-onboarding/SKILL.md
  - skills/shipflow/SKILL.md
  - skills/sf-design/SKILL.md
  - skills/sf-build/SKILL.md
  - skills/sf-test/SKILL.md
  - skills/sf-help/SKILL.md
  - skills/sf-help/references/help-catalog.md
  - skills/references/entrypoint-routing.md
  - skills/references/master-workflow-lifecycle.md
  - skills/references/decision-quality-contract.md
  - skills/references/spec-driven-development-discipline.md
  - skills/references/skill-context-budget.md
  - skills/references/skill-instruction-layering.md
  - site/src/content/skills/sf-onboarding.md
  - site/src/content/skills/shipflow.md
  - site/src/pages/skill-modes.astro
  - site/src/pages/skills/index.astro
  - docs/skill-launch-cheatsheet.md
  - README.md
  - shipflow-spec-driven-workflow.md
  - shipflow_data/technical/skill-runtime-and-lifecycle.md
depends_on:
  - artifact: "skills/references/master-workflow-lifecycle.md"
    artifact_version: "1.3.0"
    required_status: active
  - artifact: "skills/references/decision-quality-contract.md"
    artifact_version: "1.0.0"
    required_status: active
  - artifact: "skills/references/spec-driven-development-discipline.md"
    artifact_version: "1.2.0"
    required_status: active
  - artifact: "skills/references/skill-context-budget.md"
    artifact_version: "0.3.1"
    required_status: draft
supersedes: []
evidence:
  - "User request 2026-05-31: create a reusable onboarding skill so agents stop needing the same principles repeated after feature work."
  - "WinFlowz onboarding implementation on 2026-05-31 introduced independent setup steps, why/how copy, active/validated/skipped visual states, permission recovery actions, refresh actions, and a final accessibility ordering decision."
  - "Existing `sf-design` owns UI/UX lifecycle, but does not specialize in user activation, progressive education, contextual setup, or feature-adoption handoff after implementation."
next_step: "/sf-skill-build sf-onboarding"
---

# Spec: sf-onboarding User Activation Skill

## Title

sf-onboarding User Activation Skill

## Status

Ready.

The skill placement decision is explicit: create a new ShipFlow skill named `sf-onboarding`. This should not be a generic UI design skill. It owns the product-onboarding and user-activation layer that follows or accompanies feature work: assistance, context, why/how explanation, setup sequencing, recovery paths, progressive disclosure, and value-realization checks.

## User Story

As a ShipFlow operator who ships product features, I want a dedicated onboarding skill that turns shipped capabilities into contextual, assistive user activation experiences, so users understand why the feature matters, what to do first, and how to get maximum value regardless of their technical level.

## Minimal Behavior Contract

`sf-onboarding` accepts a feature, product flow, implemented change, or onboarding audit target; reads the product context and changed user-facing behavior; identifies the user's first-success path, required setup, optional enhancers, blockers, recovery actions, and value moments; then produces or routes an onboarding plan, implementation checklist, copy/interaction contract, verification scenarios, and documentation impact. If the onboarding change requires code, multi-surface UI changes, permissions, auth, billing, data, security-sensitive setup, or public promises, it routes through `sf-spec`, `sf-ready`, `sf-build`/`sf-start`, proof, and `sf-verify` instead of acting as a shortcut. The easy edge case is treating onboarding as a popup or tooltip; the skill must cover the full activation experience across in-app guidance, empty states, progressive setup, status feedback, docs/support alignment, and success confirmation.

## Success Behavior

- Given a user asks how to onboard users for a feature, when the feature scope is clear, then `sf-onboarding` returns a concrete onboarding contract covering audience, first-success path, why/how copy, required setup, optional setup, states, recovery actions, and verification.
- Given a feature has required permissions, external setup, integration keys, auth, billing, or device settings, then `sf-onboarding` orders the steps by dependency and user readiness, avoids dead-end setup, and provides recovery paths.
- Given a feature can be ignored, skipped, deferred, completed, or needs review later, then `sf-onboarding` defines distinct states and visual/status semantics that make the next best action obvious.
- Given the onboarding requires UI implementation, then `sf-onboarding` routes to a ready spec and `sf-build`/`sf-start`, and uses widget/browser/manual proof appropriate to the surface.
- Given user-facing docs, support copy, README, FAQ, or public claims need to match the onboarding promise, then it produces a Documentation Update Plan and Editorial Update Plan or routes to `sf-docs`/`sf-content`.

## Error Behavior

- If the feature, target user, or activation goal is unclear and one targeted question cannot settle it, route to `sf-explore` before writing a spec or implementation plan.
- If the requested onboarding conflicts with security, privacy, platform permission rules, accessibility, billing truth, or product capability, block and name the safer route.
- If the flow could trick users into granting permissions or enabling risky setup without clear value and control, block until the permission/value explanation is explicit.
- If an onboarding implementation would span multiple surfaces or change behavior without a ready spec, block before edits.
- If the feature has no observable success state, define the missing product state as a blocker instead of inventing empty reassurance.
- If validation cannot prove the user can reach first success or recover from skipped/failed setup, report the proof gap.

## Problem

New features often ship with functional code but weak activation. Users can miss the feature, misunderstand why it matters, grant permissions in the wrong order, ignore required setup, or fail to recover after deferring a step. The operator currently has to restate the onboarding philosophy each time: assist the user, explain why and how, show what matters now, preserve optionality, and help every technical level reach value.

## Solution

Create `skills/sf-onboarding/SKILL.md` as the ShipFlow entrypoint for onboarding and user activation. It should operate after or alongside feature work, extracting product context and turning it into a clear onboarding contract. It complements `sf-design`: design owns UI/UX quality broadly; onboarding owns the learning, activation, setup, sequencing, state feedback, recovery, and value-realization layer.

## Scope In

- Create `skills/sf-onboarding/SKILL.md`.
- Create public skill page `site/src/content/skills/sf-onboarding.md`.
- Update router/help docs, public site pages, `README.md`, `docs/skill-launch-cheatsheet.md`, `shipflow-spec-driven-workflow.md`, and `shipflow_data/technical/skill-runtime-and-lifecycle.md` for discoverability.
- Sync current-user Claude/Codex runtime links for `sf-onboarding`.
- Define onboarding principles from the WinFlowz flow: independent modules, dependency-aware order, why/how copy, status badges, active/current states, skipped-state visibility, refresh/recheck actions, defer/resume paths, and completion grouping.
- Define routing to `sf-design`, `sf-build`, `sf-test`, `sf-docs`, `sf-content`, `sf-browser`, and `sf-verify` when the onboarding work crosses into their owner domains.

## Scope Out

- Rewriting `sf-design` or duplicating design audit internals.
- Implementing a concrete product onboarding flow in this ShipFlow skill-build run.
- Inventing product capabilities, permissions, claims, billing promises, or setup requirements not supported by the project.
- Creating manipulative onboarding, dark patterns, or permission coercion.
- Shipping unrelated dirty work.

## Constraints

- Internal skill contracts and stable section names use English.
- User-facing examples and final reports use the active user language.
- `sf-onboarding` must ask targeted questions only when the answer changes audience, activation promise, setup dependency, permission posture, security/privacy, proof, docs impact, or implementation scope.
- Broad onboarding implementation requires a ready spec before source edits.
- Permission and access onboarding must explain value, scope, optionality, and recovery without overstating capability.
- Onboarding guidance must support non-technical users without hiding important technical consequences.

## Dependencies

- Existing ShipFlow lifecycle and design/build/test/doc skills.
- Skill budget and instruction layering policies.
- Runtime sync helper.
- Public site skill content schema.
- Fresh external docs verdict: `fresh-docs not needed` for creating this local skill contract. Future executions of `sf-onboarding` must use fresh official docs when platform permission, accessibility, billing, app-store policy, SDK, or provider behavior affects onboarding.

## Invariants

- Onboarding is a product activation layer, not just visual decoration.
- The first-success path must be explicit.
- Required setup, optional enhancers, and deferrable steps must be distinct.
- Every setup step should explain why it matters, how to do it, and what happens if skipped.
- The flow must expose current, completed, skipped, blocked, unsupported, and recoverable states where relevant.
- Users must keep control over permissions and optional modules.
- Documentation and support copy must not contradict in-app onboarding.

## Links & Consequences

Upstream:
- Feature specs, product context, recent implementation diffs, docs/support promises, platform constraints, permission models, and user segments.

Downstream:
- In-app onboarding UI, empty states, tooltips, checklists, settings recovery paths, docs, support copy, manual QA scripts, and verification scenarios.

Consequences:
- Feature work gains a reusable activation pass after implementation.
- Agents get a stable language for onboarding quality instead of repeating Diane's principles in each task.
- Future onboarding implementation can be verified against a concrete product-first contract.

## Documentation Coherence

Required updates:
- `skills/sf-onboarding/SKILL.md`
- `site/src/content/skills/sf-onboarding.md`
- `skills/shipflow/SKILL.md`
- `skills/references/entrypoint-routing.md`
- `skills/sf-help/references/help-catalog.md`
- `site/src/content/skills/shipflow.md`
- `site/src/pages/skill-modes.astro`
- `site/src/pages/skills/index.astro`
- `README.md`
- `docs/skill-launch-cheatsheet.md`
- `shipflow-spec-driven-workflow.md`
- `shipflow_data/technical/skill-runtime-and-lifecycle.md`

No project product docs are changed by the skill creation itself. Future `sf-onboarding` runs must assess docs, FAQ, README, support copy, changelog, screenshots, and public pages for the target product feature.

## Edge Cases

- A permission appears unavailable before prerequisite setup: order later and explain dependency.
- A user skips a step: show a visible recoverable skipped state, not silent disappearance.
- A feature has multiple user levels: provide a direct path for beginners and shortcuts for advanced users.
- A feature is useful without optional modules: keep the base value clear and do not make optional setup feel mandatory.
- A setup action leaves the app for system settings: provide recovery, refresh/recheck, and resume behavior.
- A completed setup later becomes invalid: show revoked/expired state and recovery path.
- A product claim promises instant value but setup is slow: adjust copy or block the claim.

## Implementation Tasks

- [x] Task 1: Create the skill contract.
  - File: `skills/sf-onboarding/SKILL.md`
  - Action: Encode activation scope, principles, intake, routing, implementation gates, proof paths, docs/editorial impact, and stop conditions.
  - Validate with: `rg -n "name: sf-onboarding|Activation Principles|Onboarding Contract|First success|Proof Paths|Stop Conditions" skills/sf-onboarding/SKILL.md`

- [x] Task 2: Create public skill content.
  - File: `site/src/content/skills/sf-onboarding.md`
  - Action: Explain when to use the skill, inputs, outputs, limits, and related skills.
  - Validate with: `test -f site/src/content/skills/sf-onboarding.md`

- [x] Task 3: Update discoverability docs.
  - Files: `skills/shipflow/SKILL.md`, `skills/references/entrypoint-routing.md`, `skills/sf-help/references/help-catalog.md`, `site/src/content/skills/shipflow.md`, `site/src/pages/skill-modes.astro`, `site/src/pages/skills/index.astro`, `README.md`, `docs/skill-launch-cheatsheet.md`, `shipflow-spec-driven-workflow.md`, `shipflow_data/technical/skill-runtime-and-lifecycle.md`
  - Action: Add `sf-onboarding` as the activation/onboarding entrypoint without overstating it as a UI design replacement.
  - Validate with: `rg -n "sf-onboarding|onboarding|activation" skills/shipflow/SKILL.md skills/references/entrypoint-routing.md skills/sf-help/references/help-catalog.md site/src/content/skills/shipflow.md site/src/pages/skill-modes.astro site/src/pages/skills/index.astro README.md docs/skill-launch-cheatsheet.md shipflow-spec-driven-workflow.md shipflow_data/technical/skill-runtime-and-lifecycle.md`

- [x] Task 4: Sync runtime links.
  - Files: `$HOME/.claude/skills/sf-onboarding`, `$HOME/.codex/skills/sf-onboarding`
  - Action: Run the shared sync helper.
  - Validate with: `tools/shipflow_sync_skills.sh --check --skill sf-onboarding`

- [x] Task 5: Validate skill build.
  - Action: Run budget audit, metadata lint, site build, runtime sync check, and focused leak checks.
  - Validate with commands in Test Strategy.

## Acceptance Criteria

- [x] AC 1: Given a feature or product flow, `sf-onboarding` can produce a user activation contract with first-success path, why/how guidance, setup ordering, states, and proof obligations.
- [x] AC 2: Given onboarding work crosses into UI implementation, docs, testing, or broad product behavior, the skill routes to the proper owner skill and spec-first lifecycle.
- [x] AC 3: Given permission or setup steps exist, the skill requires dependency-aware ordering, value explanation, optionality, and recovery paths.
- [x] AC 4: Given users skip or defer onboarding steps, the skill requires visible recoverable states rather than silent completion.
- [x] AC 5: Given the skill is created, `sf-help`, README/workflow docs, public skill page, and runtime links expose it.
- [x] AC 6: Given validation runs, skill budget audit, metadata lint, runtime sync, public site build, and focused `rg` checks pass or report blockers.

## Test Contract

- surface: ShipFlow skill runtime, public skill page, help/docs discoverability.
- proof_profile: scenario-first for skill contract behavior plus mechanical validation for metadata, runtime links, budget, and site build.
- proof_order:
  1. Read placement/overlap evidence from existing skills.
  2. Create `SKILL.md` and public skill page.
  3. Update help/docs discovery.
  4. Sync runtime links.
  5. Run budget, metadata, site, and focused `rg` checks.
- required_scenario_ids:
  - `feature-after-ship`: agent asks how to onboard users after implementing a feature.
  - `permission-setup`: feature needs permissions/settings in a dependency-aware order.
  - `skipped-step`: user defers or skips optional setup and needs a recoverable state.
  - `broad-implementation`: onboarding requires source edits and must route through spec/build.
- required_results:
  - scenario behavior is explicitly represented in `SKILL.md`
  - runtime sync passes
  - budget audit passes
  - metadata lint passes for changed governance artifacts
  - site build passes when public skill page changes
- exception_with_proof: If site build cannot run for environment reasons, run schema/content focused checks and report the gap.
- exception_without_proof: Not allowed for skill creation.

## Test Strategy

- `test -f skills/sf-onboarding/SKILL.md`
- `test -f site/src/content/skills/sf-onboarding.md`
- `rg -n "name: sf-onboarding|Activation Principles|Onboarding Contract|First success|Proof Paths|Stop Conditions" skills/sf-onboarding/SKILL.md`
- `rg -n "sf-onboarding|onboarding|activation" skills/shipflow/SKILL.md skills/references/entrypoint-routing.md skills/sf-help/references/help-catalog.md site/src/content/skills/shipflow.md site/src/pages/skill-modes.astro site/src/pages/skills/index.astro README.md docs/skill-launch-cheatsheet.md shipflow-spec-driven-workflow.md shipflow_data/technical/skill-runtime-and-lifecycle.md site/src/content/skills/sf-onboarding.md`
- `tools/shipflow_sync_skills.sh --check --skill sf-onboarding`
- `python3 tools/skill_budget_audit.py --skills-root skills --format markdown`
- `python3 tools/shipflow_metadata_lint.py shipflow_data/workflow/specs/sf-onboarding-user-activation-skill.md shipflow_data/technical/skill-runtime-and-lifecycle.md docs/skill-launch-cheatsheet.md shipflow-spec-driven-workflow.md README.md skills/references/entrypoint-routing.md skills/sf-help/references/help-catalog.md`
- `npm --prefix site run build`
- `rg -n "BEGIN .*KEY|PRIVATE KEY|PASSWORD=|SECRET=|TOKEN=|CREDENTIAL=" skills/sf-onboarding/SKILL.md site/src/content/skills/sf-onboarding.md`

## Risks

- Overlap with `sf-design`: mitigated by making `sf-onboarding` own activation and education, while routing visual design questions to `sf-design`.
- Manipulative permission prompts: mitigated by explicit value, optionality, control, and recovery requirements.
- Scope creep into implementation: mitigated by spec-first routing for broad or behavior-changing source edits.
- Public promise drift: mitigated by docs/editorial impact checks.
- Skill budget growth: mitigated by compact description and validation audit.

## Execution Notes

Read first:
- `skills/sf-design/SKILL.md`
- `skills/sf-build/SKILL.md`
- `skills/sf-test/SKILL.md`
- `skills/sf-help/SKILL.md`
- `skills/references/skill-context-budget.md`
- `skills/references/skill-instruction-layering.md`

Recommended approach:
1. Keep `SKILL.md` compact and move no large checklist unless needed.
2. Use the WinFlowz onboarding flow only as evidence for principles, not as product-specific hardcoding.
3. Preserve owner boundaries: `sf-onboarding` should route implementation to `sf-build`/`sf-start`, visual audit to `sf-design`, proof to `sf-test`/`sf-browser`, and docs to `sf-docs`/`sf-content`.
4. Use `scenario-first` proof for the skill contract.
5. Do not commit or push.

Stop conditions:
- duplicate skill responsibility remains unresolved
- runtime sync blocked by non-symlink paths
- budget audit hard-fails
- public site build fails for changed public content
- metadata lint fails on changed governance artifacts
- validation shows stale public/help discoverability

## Open Questions

None. The user explicitly proposed `onboarding`; placement evidence supports `sf-onboarding` as a distinct ShipFlow skill rather than an `sf-design` mode.

## Skill Run History

| Date UTC | Skill | Model | Action | Result | Next step |
|----------|-------|-------|--------|--------|-----------|
| 2026-05-31 21:16:00 UTC | sf-spec | GPT-5 Codex | Created the `sf-onboarding` user activation skill spec from Diane's request and existing ShipFlow skill taxonomy. | ready spec created | `/sf-ready shipflow_data/workflow/specs/sf-onboarding-user-activation-skill.md` |
| 2026-05-31 21:16:00 UTC | sf-ready | GPT-5 Codex | Evaluated placement, overlap with `sf-design`/`sf-build`, behavior contract, docs/public impact, validation, and security posture. | ready | `/sf-skill-build sf-onboarding` |
| 2026-05-31 21:25:28 UTC | sf-skill-build | GPT-5 Codex | Created the `sf-onboarding` skill contract, public skill page, router/help/docs discoverability updates, runtime links, and refresh log entry. | implemented | `/sf-verify shipflow_data/workflow/specs/sf-onboarding-user-activation-skill.md` |
| 2026-05-31 21:26:46 UTC | sf-verify | GPT-5 Codex | Verified skill contract coverage, route/help/site discoverability, metadata lint, runtime sync, budget audit, site build, and focused leak scan. | verified locally; not shipped | no commit requested |
| 2026-05-31 21:42:00 UTC | sf-skill-build | GPT-5 Codex | Added progressive disclosure, small-step sequencing, visual cue semantics, and visual ambiguity stop conditions to `sf-onboarding`. | refined and validated locally | no commit requested |
| 2026-05-31 21:46:04 UTC | sf-skill-build | GPT-5 Codex | Added a post-implementation onboarding gate to `sf-build` and mixed build-plus-onboarding routing guidance to `shipflow`. | refined and validated locally | no commit requested |
| 2026-05-31 21:49:41 UTC | sf-ship | GPT-5 Codex | Quick-shipped the `sf-onboarding` skill, public page, routing/docs integration, and `sf-build` post-implementation onboarding gate. | shipped | pushed to `origin/main` |

## Current Chantier Flow

sf-spec ✅ -> sf-ready ✅ -> sf-skill-build ✅ -> sf-verify ✅ -> sf-docs/help ✅ -> sf-ship ✅🎯
