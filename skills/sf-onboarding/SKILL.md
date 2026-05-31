---
name: sf-onboarding
description: "User onboarding, activation paths, setup guidance, and first-success recovery."
argument-hint: <feature, flow, shipped change, or onboarding audit target>
---

## Canonical Paths

Before resolving any ShipFlow-owned file, load `$SHIPFLOW_ROOT/skills/references/canonical-paths.md` (`$SHIPFLOW_ROOT` defaults to `$HOME/shipflow`). ShipFlow tools, shared references, skill-local `references/*`, templates, workflow docs, and internal scripts must resolve from `$SHIPFLOW_ROOT`, not from the project repo where the skill is running. Project artifacts and source files still resolve from the current project root unless explicitly stated otherwise.

## Chantier Tracking

Trace category: `conditionnel`.
Process role: `source-de-chantier`.

Before producing the final report, load `$SHIPFLOW_ROOT/skills/references/chantier-tracking.md` when this run is attached to a spec-first chantier. If exactly one active chantier spec is identified, append the current run to `Skill Run History`, update `Current Chantier Flow` when the run changes chantier state, and include a final `Chantier` block. If no unique chantier is identified, do not write to any spec; report `Chantier: non applicable` or `Chantier: non trace` with the reason.

Because this skill can produce product-activation findings, evaluate whether non-trivial follow-up needs `/sf-spec` before implementation.

## Report Modes

Before producing the final report, load `$SHIPFLOW_ROOT/skills/references/reporting-contract.md`.

Default to `report=user`: concise, outcome-first, and in the user's active language. Use `report=agent`, `handoff`, `verbose`, or `full-report` when another skill needs the full onboarding contract, file list, validation matrix, or unresolved decisions.

## Required References

Load only the references required by the active run:

- `$SHIPFLOW_ROOT/skills/references/decision-quality-contract.md` before choosing route, defaults, proof, or implementation scope.
- `$SHIPFLOW_ROOT/skills/references/spec-driven-development-discipline.md` before changing behavior or defining implementation proof.
- `$SHIPFLOW_ROOT/skills/references/master-workflow-lifecycle.md` before routing non-trivial onboarding implementation through lifecycle gates.
- `$SHIPFLOW_ROOT/skills/references/question-contract.md` before asking user-facing decisions.
- `$SHIPFLOW_ROOT/skills/references/documentation-freshness-gate.md` when onboarding depends on current platform permissions, billing/provider rules, app-store policy, accessibility standards, SDK behavior, or external integration behavior.

## Context

- Current directory: !`pwd`
- Current date: !`date '+%Y-%m-%d'`
- Project name: !`basename $(pwd)`
- Git branch: !`git branch --show-current 2>/dev/null || echo "unknown"`
- Git status: !`git status --short 2>/dev/null || echo "not a git repo"`
- Project product docs: !`ls shipflow_data/business/product.md shipflow_data/business/business.md shipflow_data/business/branding.md shipflow_data/technical/guidelines.md PRODUCT.md BUSINESS.md BRANDING.md GUIDELINES.md 2>/dev/null || echo "no project product docs found"`
- Available specs: !`find shipflow_data/workflow/specs specs docs -maxdepth 3 -type f -name "*.md" 2>/dev/null | sort | head -80`

## Mission

`sf-onboarding` is the ShipFlow entrypoint for user activation.

It turns a feature, flow, shipped change, or onboarding audit target into a practical onboarding contract:

```text
product context
  -> target user and first-success path
  -> small steps and progressive disclosure
  -> required setup, optional setup, and dependency order
  -> why/how guidance and value explanation
  -> visual cues, icons, colors, and clear current-state feedback
  -> states, recovery, refresh, and resume behavior
  -> docs/support/editorial impact
  -> proof path or implementation routing
```

This skill complements `sf-design`. Design owns broad UI/UX quality. Onboarding owns activation: helping users understand what to do, why it matters, what state they are in, how to recover, and how to get value regardless of technical level. Onboarding may specify visual semantics when they directly support comprehension, but detailed layout, component systems, and visual polish route to `sf-design`.

## Mode Detection

Parse `$ARGUMENTS` as an onboarding target.

| Intent | Route |
| --- | --- |
| Read-only onboarding advice for a clear feature | Produce an Onboarding Contract in the final report |
| Audit an existing onboarding flow | Review against Activation Principles and report findings |
| Onboarding implementation across UI, routing, data, permissions, docs, or multiple surfaces | Route to `sf-spec -> sf-ready -> sf-build/sf-start` |
| Visual hierarchy, layout, component polish, or design-system quality dominates | Route to `sf-design` |
| Product copy, public docs, FAQ, support, public claims, or content surfaces dominate | Route to `sf-content` or `sf-docs` |
| Manual/human proof is required | Route to `sf-test`; use `sf-browser` for non-auth browser proof and `sf-auth-debug` for auth/session proof |
| Feature target, audience, or activation promise is too fuzzy | Route to `sf-explore` before spec or edits |

When two routes are materially plausible, load `question-contract.md` and ask one concise numbered decision question.

## Activation Principles

Every onboarding recommendation or implementation contract should cover:

- **First success**: the earliest meaningful value moment the user should reach.
- **Context**: what feature this is, who it helps, and why it matters now.
- **Why and how**: plain-language benefit plus concrete action, not only labels.
- **Progressive disclosure**: reveal only what the user needs now; keep advanced detail, secondary setup, and expert shortcuts behind later steps or optional expansion.
- **Small steps**: each step should be narrow enough to understand and complete without cognitive overload.
- **Dependency order**: required prerequisites before advanced or fragile setup.
- **Required vs optional**: separate core value from enhancers and nice-to-have modules.
- **User control**: defer, skip, revisit, or disable optional setup without punishment.
- **Visual cues**: use quickly identifiable icons, colors, badges, and affordances for current, completed, skipped, blocked, and warning states.
- **Visible state**: current, completed, skipped, blocked, unsupported, revoked, and recoverable states when relevant.
- **Recovery**: refresh/recheck actions, settings deep links, resume paths, and clear next actions after leaving the app.
- **Progressive depth**: beginner path first; shortcuts or expert details only when useful.
- **Trust**: no permission coercion, dark patterns, fake urgency, or hidden data consequences.
- **Coherence**: docs, support copy, screenshots, public claims, changelog, and in-app states say the same thing.

## Onboarding Contract

For read-only or planning output, produce this compact structure:

```text
Onboarding Contract: [feature/flow]

Target user:
First success:
Entry trigger:
Step size / disclosure:
Required setup:
Optional enhancers:
Recommended sequence:
Visual cues:
States:
Recovery paths:
Why/how copy notes:
Docs/editorial impact:
Proof path:
Implementation route:
```

If implementation is needed, convert this into a spec-ready behavior contract instead of editing source files directly.

## Permission And Sensitive Setup Rules

For permissions, system settings, billing, integrations, API keys, auth, data sync, device access, or external accounts:

- explain the user value before the action
- state whether the feature works without it
- place fragile or unavailable setup after prerequisites
- offer a safe defer path
- provide recheck/recovery after settings changes
- do not imply the app can grant permission itself when the OS/provider owns it
- do not hide privacy, billing, quota, data, or security consequences
- use fresh official docs when current external behavior affects the guidance

## Proof Paths

Choose proof proportional to the surface:

- `scenario-first`: default for onboarding contracts and skill-level guidance.
- `test-first`: when onboarding state, ordering, or UI behavior can be covered by unit/widget tests.
- `evidence-first`: for docs, copy, visual walkthroughs, browser smoke, or hosted proof.
- `exception-with-proof`: only when the best proof is unavailable; name the alternate evidence.

For Flutter/mobile flows, prefer widget tests and Flutter Web smoke for shared UI before APK/device proof. Reserve device/manual proof for native permissions, IME, notifications, overlays, file pickers, camera/mic, OS settings, lifecycle, or provider-native behavior.

## Documentation And Editorial Gates

After onboarding work, produce both statuses:

- `Documentation Update Plan`: `complete` / `no impact` / `blocked`
- `Editorial Update Plan`: `complete` / `no editorial impact` / `blocked`

Check impact on:

- README, docs, setup guides, FAQ, support copy, screenshots, changelog, and public pages
- onboarding copy embedded in product UI
- pricing, claims, permissions, privacy, and support promises
- manual QA scripts or test checklists

## Stop Conditions

Stop and report `blocked` or route to the owner skill when:

- the target feature, user, or activation promise is too unclear for one targeted question
- the onboarding compresses too many decisions or setup actions into one step without progressive disclosure
- implementation would change source behavior without a ready spec
- the onboarding asks for misleading permission, billing, privacy, security, or data claims
- platform/provider behavior matters and fresh official docs are missing
- first-success cannot be observed or verified
- current, skipped, blocked, and completed states are visually ambiguous
- skipped, failed, revoked, or unsupported states are not recoverable
- documentation or public claims would become false
- unrelated dirty files would enter implementation or ship scope

## Validation

For skill-contract changes, validate with:

```bash
rg -n "name: sf-onboarding|Activation Principles|Onboarding Contract|First success|Proof Paths|Stop Conditions" skills/sf-onboarding/SKILL.md
python3 tools/skill_budget_audit.py --skills-root skills --format markdown
tools/shipflow_sync_skills.sh --check --skill sf-onboarding
```

For product onboarding implementations, use the project checks named by the ready spec and route visual/manual/provider proof to the proper owner skill.

## Final Report

User mode:

```text
## Onboarding: [feature/flow]

Result: [contract / audit / routed / blocked]
First success: [one line]
Route: [direct contract | sf-design | sf-build/spec | sf-test | sf-docs/content]
Proof path: [scenario-first/test-first/evidence-first/exception-with-proof]
Docs: Documentation Update Plan [status], Editorial Update Plan [status]

## Chantier

[spec path | non applicable: reason | non trace: reason]
Flux: sf-spec [marker] -> sf-ready [marker] -> sf-start [marker] -> sf-verify [marker] -> sf-end [marker] -> sf-ship [marker]
Reste a faire: [only if non-empty]
Prochaine etape: [only if non-empty]
```

Agent/handoff mode may include the full Onboarding Contract, owner-skill routing matrix, implementation files, validation commands, unresolved decisions, and proof gaps.

## Rules

- Do not treat onboarding as a tooltip-only task.
- Do not duplicate `sf-design`, `sf-content`, `sf-docs`, `sf-test`, `sf-browser`, `sf-auth-debug`, or `sf-build` internals.
- Keep internal contracts in English and user-facing output in the active user language.
- Ask only when the answer changes activation promise, setup order, permission/security posture, docs/public claims, proof, or implementation scope.
- Prefer a clear beginner path plus optional expert shortcuts over dense all-at-once instructions.
- Prefer simple, visually legible steps over exhaustive all-in-one setup screens.
