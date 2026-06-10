---
artifact: technical_guidelines
metadata_schema_version: "1.0"
artifact_version: "1.2.0"
project: ShipFlow
created: "2026-05-05"
updated: "2026-06-09"
status: active
source_skill: sf-skill-build
scope: skill-question-contract
owner: Diane
confidence: high
risk_level: medium
security_impact: none
docs_impact: yes
linked_systems:
  - skills/*/SKILL.md
  - skills/references/master-workflow-lifecycle.md
  - skills/references/decision-quality-contract.md
  - skills/references/entrypoint-routing.md
  - skills/references/reporting-contract.md
  - docs/technical/skill-runtime-and-lifecycle.md
  - shipflow-spec-driven-workflow.md
depends_on:
  - artifact: "skills/references/decision-quality-contract.md"
    artifact_version: "1.0.0"
    required_status: active
supersedes: []
evidence:
  - "User request 2026-05-04: skill questions should be numbered, explain why, include helpful icons, and identify the recommended answer."
  - "User clarification 2026-05-04: a default is acceptable only when it is compatible with the current technical/product/editorial context and current best practices."
  - "User decision 2026-05-24: recommended defaults must optimize for performance, security, excellence, durability, and high-quality code before speed or convenience."
  - "User decision 2026-06-09: skills should be almost fully autonomous and professionally effective, asking fewer questions and only in plain decision language when the operator truly owns the decision."
next_review: "2026-06-05"
next_step: "/sf-verify shipflow-skill-reporting-and-proof-hardening"
---

# Question Contract

## Purpose

This reference defines how ShipFlow skills ask user-facing questions.

The goal is to keep questions rare, useful, and easy to answer by number. A question is a decision brief: it tells the operator why the decision matters, which answer ShipFlow recommends by default when a responsible default exists, and why that recommendation fits the current context.

Load `skills/references/decision-quality-contract.md` before recommending a default. The recommended answer must preserve ShipFlow's quality and excellence bar; do not recommend the fastest, cheapest, or easiest route unless it is also quality-equivalent, excellence-equivalent, and professionally correct.

## Applies To

Load this contract before any user-facing:

- routing question
- clarification question
- product, persona, scope, or content-surface question
- security, data, permission, destructive, staging, closure, or ship-risk question
- blocked-state recovery question
- selection question for project, file, URL, domain, check set, package, market, or content source

Do not use it for internal analysis, progress updates, final reports, or subagent instructions where the subagent is forbidden to ask the user.

## Ask Threshold

Ask only when the answer changes at least one material outcome:

- owner skill, lifecycle path, or durable work item type
- user-visible behavior, product scope, audience, persona, or content surface
- security, privacy, data retention, permissions, auth, tenant boundary, money movement, or destructive behavior
- public claim, SEO target, brand promise, legal/compliance posture, or cost
- architecture, framework, dependency, provider, runtime behavior, or deployment mode
- staging, deployment, release, closure, ship scope, or bug risk
- validation strategy when the wrong proof would create false confidence

Proceed without asking only when the default answer is all of these:

- clear from the request and known project context
- low-risk and reversible
- inside the existing contract, spec, or accepted scope
- compatible with the current technical, product, and editorial context
- aligned with current best practices for the affected stack, provider, security posture, and user workflow
- verifiable with the evidence available in the current run

If the obvious or requested option conflicts with project context, public/editorial claims, architecture, security posture, or current best practices, do not silently choose it. Either choose the safe compatible alternative when it is obvious and inside scope, or ask a numbered decision question that explains the conflict.

Never ask broad "anything else?" questions.

Autonomy is the default. A skill must not ask the operator to choose between internal workflow mechanics, file-level implementation details, checklist preferences, or obvious reversible defaults when the skill can choose a professional path itself. State the chosen assumption briefly in the final report only if it affects trust or future review.

Ask at most one user-facing decision question at a time unless several decisions are inseparable. If multiple low-level gaps exist, collapse them into the smallest operator-owned decision or choose safe defaults and continue.

Do not ask with internal jargon such as "gate", "lifecycle", "trace category", "fresh context", "metadata transition", or model names unless that literal term is the user's decision. Translate the consequence into plain operator language first.

## Required Shape

Every user-facing question must be answerable by number. Start each question with a numeric marker:

```text
1. [icon] [decision title]
```

Use the user's active language for labels and explanation. Stable commands, paths, IDs, and status values may stay literal.

Each question must include:

- decision title: the decision in plain language
- why: why the skill needs the answer now
- recommendation: the best default answer and why it is recommended, when a responsible default exists
- options: 2-3 practical choices when useful, with number-prefixed labels
- answer instruction: tell the user they can answer with the number or name another route

Use small icons only as scanning aids. Icons never replace the text label and are optional when the runtime or context favors plain ASCII.

Questions should be rare enough that answering them feels like steering the product or risk posture, not supervising the skill. If a question would only make the operator approve routine professional execution, do not ask it.

## Plain-Text Format

```text
1. [icon] [Titre de decision]
Pourquoi: [ce qui est bloque, contradictoire ou risque]
Recommande: [option] - [pourquoi c'est le meilleur defaut dans ce contexte]

Options:
1. [Option recommandee] - [consequence]
2. [Alternative] - [consequence]

Reponds avec le numero, ou precise une autre option.
```

For English users, use `Why`, `Recommended`, `Options`, and `Reply with the number`.

## Recommendation Rules

The recommended answer must be the most responsible default, not the easiest path for the agent.

Prefer recommendations that:

- preserve user trust, data safety, and reversibility
- match the current spec, product contract, and repo conventions
- respect technical docs, `docs/technical/code-docs-map.md`, `CONTENT_MAP.md`, editorial governance, and public claim boundaries when applicable
- follow current best practices for the stack, provider, security model, and deployment mode
- minimize cost or public exposure only after correctness, security, performance, maintainability, durability, and excellence are satisfied
- keep implementation scope bounded enough to verify without lowering solution quality
- avoid premature shipping when proof is missing

Name the condition that would make another option better when that matters.

## Pressure Scenarios

- `SSRP-005 safe default`: when the safe professional default is clear, reversible, in scope, and verifiable, the skill proceeds and reports the assumption only if useful.
- `SSRP-006 required decision`: when the answer changes security, data, product behavior, validation confidence, closure, or ship risk, the skill asks one numbered plain-language question with a recommended option.
