---
artifact: technical_guidelines
metadata_schema_version: "1.0"
artifact_version: "1.4.0"
project: ShipFlow
created: "2026-05-04"
updated: "2026-06-27"
status: active
source_skill: 009-sf-skill-build
scope: entrypoint-routing
owner: Diane
confidence: high
risk_level: high
security_impact: yes
docs_impact: yes
linked_systems:
  - skills/000-shipflow/SKILL.md
  - skills/001-sf-build/SKILL.md
  - skills/002-sf-maintain/SKILL.md
  - skills/003-sf-bug/SKILL.md
  - skills/004-sf-deploy/SKILL.md
  - skills/007-sf-content/SKILL.md
  - skills/006-sf-design/SKILL.md
  - skills/008-sf-onboarding/SKILL.md
  - skills/600-sf-local-cloud-sync/SKILL.md
  - skills/009-sf-skill-build/SKILL.md
  - skills/900-shipflow-core/SKILL.md
  - skills/400-sf-audit/SKILL.md
  - skills/references/master-delegation-semantics.md
  - skills/references/question-contract.md
  - docs/skill-launch-cheatsheet.md
  - README.md
  - shipflow-spec-driven-workflow.md
depends_on:
  - artifact: "skills/references/master-delegation-semantics.md"
    artifact_version: "1.2.0"
    required_status: active
  - artifact: "skills/references/question-contract.md"
    artifact_version: "1.0.0"
    required_status: active
  - artifact: "skills/references/master-workflow-lifecycle.md"
    artifact_version: "1.2.0"
    required_status: active
supersedes: []
evidence:
  - "User decision 2026-05-04: create `000-shipflow` as the primary non-technical router across the existing skill taxonomy."
  - "User decision 2026-05-04: `000-shipflow` should use direct main-thread handoff to selected master skills instead of nested master-skill subagents."
  - "User decision 2026-05-04: ambiguous routing questions should be numbered decision briefs with a responsible recommendation."
  - "User decision 2026-05-06: design-related requests should route to a master `006-sf-design` lifecycle entrypoint."
  - "2026-06-11 ShipFlow Core natural-language routing added for internal 900-shipflow-core."
next_review: "2026-06-04"
next_step: "/103-sf-verify specs/shipflow-primary-router-skill.md"
---

# Entrypoint Routing

## Purpose

This reference defines the shared routing rules for `000-shipflow`, the primary natural-language entrypoint for ShipFlow.

It does not replace lifecycle, bug, release, content, maintenance, audit, or skill-maintenance owner contracts. It decides which existing contract should own the request.

It defines only the routing-question rule. Load `skills/references/question-contract.md` for the shared question/default contract, then ask one concise numbered question when the route is materially ambiguous.

## Core Rule

Route to the smallest existing owner that can safely own the outcome.

Before natural-language routing, check whether the user included one or more focus tags defined in `skills/references/shipflow-terms.md` such as `#partner`, `#offer`, `#growth`, `#clarity`, `#canon`, `#quality`, `#shipflow`, or `#proof`. When present, load the referenced canonical documents first and treat them as routing priorities for the current turn.

Focus tags are not decorative reminders. They change execution posture, artifact preference, and route bias for the current turn. Do not merely acknowledge them; apply their routing implications below.

If the instruction is about modifying, improving, auditing, or hardening ShipFlow behavior, contracts, routing, or skills, treat ShipFlow itself as the target system by default. Do not infer the current project repository as the edit target unless the user explicitly names that project.

An invocation of `900-shipflow-core` or another ShipFlow-maintenance skill is itself sufficient evidence that the intended target is ShipFlow unless the user explicitly names a different repository.

That inference must hold even when the user's message omits the words "ShipFlow" or describes the desired change only by behavior, outcome, or contract language.

If the request needs more than one phase, route to the relevant master skill. If the request clearly names one specialist phase, route to that focused owner skill. If no file work or lifecycle action is needed, answer directly.

Before natural-language routing, resolve three-digit skill-code prefixes through `skills/references/skill-code-index.md`. Accepted forms include `001`, `001-sf-build`, `001sfbuild`, and `001 sf-build`. Codes point to runtime skill names such as `001-sf-build`.

## Focus Tag Execution Priorities

When focus tags are present, merge them into the narrowest coherent route instead of treating them as passive flavor.

### Business Tags

Tags such as `#partner`, `#growth`, `#offer`, `#roi`, `#funnel`, `#positioning`, `#distribution`, `#monetization`, `#retention`, `#decision-maker`, `#leverage`, `#founder-mode`, `#pitch`, and `#portfolio` imply:

- prefer routes that improve business leverage or end-user success over routes that only produce local technical cleanup
- when the task is ambiguous between generic implementation and public/business framing, inspect `shipflow_data/business/` before choosing
- if a stronger owner skill or ShipFlow route materially improves adoption or first success, surface it as the recommended path instead of stopping at neutral advice
- when several edits are possible, choose the smallest durable change that improves conversion, clarity, adoption, retention, or operator leverage
- when `#pitch` is present, reload `shipflow_data/business/portfolio-project-pitch-links.md` and prefer the active project's own pitch URL if the index points to one before answering or routing
- when `#portfolio` is present, reload `shipflow_data/business/portfolio-project-pitch-links.md` and scan the index for the most relevant cross-project opportunity before answering or routing

### Content Tags

Tags such as `#end-user`, `#cta`, `#clarity`, `#faq`, `#voice`, `#audience`, `#repurpose`, `#pillar`, and `#seo-intent` imply:

- bias toward `007-sf-content`, `008-sf-onboarding`, or declared public content surfaces when the problem is mainly message quality, activation clarity, discoverability, or objection handling
- prefer public copy, onboarding flow, FAQ, or semantic-architecture fixes over isolated code edits when the friction is mostly comprehension or activation
- treat readability, user usefulness, and discoverability as owner concerns, not as optional polish

### Governance Tags

Tags such as `#canon`, `#drift`, `#owner`, `#freshness`, `#traceability`, `#entrypoint`, `#contract`, `#public-docs`, `#internal-docs`, and `#single-source` imply:

- prefer the canonical owner artifact instead of editing duplicated surfaces first
- if code, docs, and public surfaces are potentially diverged, route to the owner path that can repair the source of truth and then propagate outward
- bias toward `002-sf-maintain`, `300-sf-docs`, `009-sf-skill-build`, or ShipFlow-internal docs work when the main issue is documentation truth, routing truth, or governance drift
- when `#public-docs` and `#internal-docs` conflict, ask one concise routing question only if the same edit cannot safely satisfy both

### Execution And System Tags

Tags such as `#quality`, `#scope`, `#ship`, `#routing`, `#proof`, `#no-drift`, `#shipflow`, `#shupflow`, and `#shipflow-core` imply:

- prefer the narrowest owner route that still preserves proof, verification, and closure
- when the operator says `#shipflow` or `#shupflow`, default the target to ShipFlow internal files and doctrine even if a project repo is open
- when `#shipflow-core` appears, treat ShipFlow behavior, fidelity, or doctrine hardening as the primary route unless the operator explicitly redirects to another repo
- when `#proof` or `#ship` appears, do not end at recommendation-only output if ShipFlow can execute a proof or ship path in the current run

## Focus Tag Question Rule

Do not ask the operator to restate what a focus tag already resolved.

Ask a routing question only when:

- two or more tags create a real owner conflict with materially different artifacts
- the same request cannot be satisfied safely at one owner layer
- the tags imply different destructive, production, payment, auth, or public-claim posture

When asking, name the tag tension explicitly and recommend the narrowest safe route.

## Execution Topology

Use direct main-thread handoff for selected skills.

Do not launch selected master skills inside subagents. The selected master skill owns any delegated sequential execution after handoff through `skills/references/master-delegation-semantics.md`.

A read-only routing scout is allowed only for cheap classification evidence and must not edit, stage, commit, push, deploy, mutate trackers, invoke a master skill, or launch further subagents.

## Routing Matrix

| Operator intent | Primary route |
| --- | --- |
| Pure question, explanation, model/help clarification, or advice with no files | Direct answer |
| Numeric skill code such as `001`, `001-sf-build`, or `001sfbuild` | Runtime skill from `skills/references/skill-code-index.md` |
| Build or change a user-facing feature and also think about onboarding, activation, beginner adoption, or first-success guidance | `001-sf-build` first; `001-sf-build` evaluates the post-implementation `008-sf-onboarding` gate |
| Feature, product change, code work, site work, docs work, workflow improvement, broad bug-like goal without durable bug state | `001-sf-build` |
| Recurring upkeep, dependency posture, docs drift, checks, audits, migrations, project hygiene, security maintenance | `002-sf-maintain` |
| Observed defect, `BUG-ID`, retest, bug closure, bug fix state, bug ship risk | `003-sf-bug` |
| Release confidence, preview/prod deployment, deployed truth, runtime logs, production health, post-deploy proof | `004-sf-deploy` |
| Content strategy, repurposing, drafting, enrichment, SEO/copy audit, editorial governance, content apply/publish | `007-sf-content` |
| Design request, UI/UX work, redesign, design tokens, design playground, accessibility design, component design, visual proof, or token migration | `006-sf-design` |
| User onboarding, feature activation, setup guidance, first-success path, permission/setup sequencing, or recoverable onboarding states | `008-sf-onboarding` |
| Local-first data promotion, cloud hydration, account sync, merge/conflict policy, reinstall recovery, or sync/save UX state | `600-sf-local-cloud-sync` |
| Product access, paid plans, premium gates, entitlement ledgers, provider events, activation codes, refunds/revokes, support access flows, or backend access gates | `601-sf-product-entitlements` |
| New skill, skill modification, skill runtime visibility, skill public page, skill docs/help coherence | `009-sf-skill-build` |
| ShipFlow Core, internal skill execution-fidelity audit, or public-plugin packaging readiness for ShipFlow itself | `900-shipflow-core` |
| One obvious audit domain only | relevant `400-sf-audit-*` or `400-sf-audit` |
| One obvious focused lane: checks, docs, browser proof, auth diagnosis, manual QA, dependency posture, migration, final ship | focused owner skill |
| Ambiguous material route | Ask one concise numbered routing question |

## Ambiguity Rules

Ask when the answer changes:

- owner skill
- durable work item type
- security, data, permission, or destructive posture
- public claim or content surface
- staging, deployment, closure, or ship semantics
- whether the run should mutate files or stay read-only

Do not ask when a best-practice route is clear, low-risk, reversible, already covered by an existing owner skill, compatible with current project context, and verifiable in the current run.

When a routing question is required, it follows `skills/references/question-contract.md`: numbered, concise, clear about why the route changes behavior or risk, and explicit about the recommended route when a responsible recommendation exists.

## Handoff Requirements

A direct handoff must preserve:

- the original user instruction
- selected skill argument
- report mode when explicit
- stop conditions and owner-skill gates
- active user language for user-facing questions and reports

The router may state the route briefly, then continue under the selected skill contract. It should not end with a manual command recommendation unless handoff is blocked or the user only asked which skill to use.

## Non-Goals

- Do not create a new master lifecycle.
- Do not duplicate specialist internals.
- Do not create specs, bug files, content, commits, deployments, or public claims directly.
- Do not treat direct handoff as parallelism.
- Do not use nested master-skill-in-subagent execution.
