---
artifact: skill_reference
metadata_schema_version: "1.0"
artifact_version: "1.0.1"
project: "shipflow"
created: "2026-06-10"
updated: "2026-06-10"
status: active
source_skill: sf-build
scope: "build-lifecycle-workflow"
owner: "Diane"
confidence: high
risk_level: high
security_impact: yes
docs_impact: yes
linked_systems:
  - "skills/sf-build/SKILL.md"
  - "skills/references/master-workflow-lifecycle.md"
  - "skills/references/master-delegation-semantics.md"
depends_on:
  - artifact: "skills/references/skill-instruction-layering.md"
    artifact_version: "1.0.0"
    required_status: active
supersedes: []
evidence:
  - "Extracted from sf-build/SKILL.md during residual body-risk cleanup."
  - "Clarified that sf-start local auto-verify is not full sf-build lifecycle orchestration."
next_step: "none"
---

# Build Lifecycle Workflow

Use this reference after the top-level `sf-build` activation contract has loaded the shared lifecycle, delegation, reporting, and decision-quality references.

## Context Probes

Gather current directory, date, project name, git branch, git status, project-local `shipflow_data/workflow/TASKS.md` or fallback `TASKS.md`, local `TASKS.md` when present, and available specs under canonical project spec locations.

## Execution Mode Detail

### Argument Flags

- `spark`, `codex`, `mini`, `agents`, `subagent`, or `sous-agent`: force delegated sequential model-topology.
- `no-agents` or `main-only`: force main-thread execution when the user intentionally accepts less isolation.
- `report=agent`, `handoff`, `verbose`, and `full-report`: affect report detail only, not execution agents.

### Delegated Sequential

`/sf-build <story>` or `$sf-build <story>` is explicit bounded delegation consent for the current chantier. Use shared master delegation semantics for subagent defaults, short approvals, mini-contracts, degradation, and reporting.

Any subagent argument is stricter than default consent: file-changing or validation-bearing paths must launch one bounded subagent at a time or stop/report degraded execution.

### Spec-Gated Parallel

Parallel execution is allowed only when a ready spec defines safe `Execution Batches`. Do not add an argument-level parallel mode. Parallel execution is a property of the ready spec.

## Question Gate

Ask only when the answer changes behavior, security, data, permissions, money movement, destructive side effects, staging scope, public claims, validation proof, closure, or ship risk.

When a material question is needed, frame it for a business decision maker:

- problem root
- business stakes
- 2-3 practical options with consequences
- best-practice recommendation
- one precise decision request

If the best-practice answer is clear, low-risk, reversible, inside contract, compatible with context, and verifiable in the current run, choose it and continue.

## Spec And Readiness Loop Detail

For non-trivial work:

1. Run or route to `sf-spec`.
2. Run `sf-ready`.
3. If not ready, apply one correction pass and rerun readiness.
4. Stop after a bounded loop, default max 3 readiness iterations, with `blocked` or a user decision.
5. Do not run `sf-start` until the spec is ready.

For trivial local work, a direct mini-contract may replace a full spec only when decision quality is satisfied.

## Fresh Context Handling

For spec-first execution, prefer a fresh execution context for delegated implementation if the runtime allows it. If a fresh context cannot be created and scope risk is material, ask the user to open a new thread before continuing.

## Governance Corpus Gate

Before `sf-start`, check:

- `shipflow_data/technical/` with legacy fallback `docs/technical/`
- `shipflow_data/technical/code-docs-map.md` with legacy fallback
- `shipflow_data/editorial/content-map.md` with legacy fallback
- applicable editorial files
- `$SHIPFLOW_ROOT/skills/references/technical-docs-corpus.md`
- `$SHIPFLOW_ROOT/skills/references/editorial-content-corpus.md`

Classify each as `already existed`, `created`, `needs audit`, `skipped`, or `blocked`. If missing or stale, route to `sf-docs` bootstrap/audit or block.

## Documentation And Editorial Gates

After each large sequential block or parallel wave, run a technical reader pass against the docs map, produce or refresh a documentation update plan, apply impacted technical docs, and block the next wave unless docs are complete, no impact, or pending final integration with a reason.

When visible behavior, public docs, README promises, FAQ, pricing, support copy, skill pages, content surfaces, or claims are affected, run an editorial reader pass and apply updates or explicitly record no editorial impact.

## Model Routing Gate

Before `sf-start`, load model routing and choose the profile based on complexity, ambiguity, failure cost, expected duration, and topology. Keep one fast model for simple/local work; use the shared guidance for non-trivial/risky work.

## Browser Evidence Routing

Use:

- `sf-browser` for non-auth browser assertions, visual state, console/network, screenshots, and interactions
- `sf-auth-debug` for auth/session/callback/cookie/provider/tenant/protected-route issues
- `sf-prod` for hosted deployment/runtime truth, logs, serverless/edge behavior, and deployment health
- `sf-test` for durable manual QA scripts, retests, and structured test logs

For local-complete implementation with hosted/prod/provider proof pending, route immediately to the concrete owner with scenario and target/environment.

## Implementation And Verification Orchestration

When the contract is ready:

1. Run `sf-start`.
2. Validate local implementation outcomes and any `sf-start` local follow-through result.
3. If `sf-start` reported `auto-verify: run` for local-only, non-destructive checks, treat those checks as complete for local proof and continue to the remaining lifecycle evidence decisions; do not treat that as full lifecycle completion.
4. Run `sf-verify` for remaining user-facing proof obligations not already completed locally.
5. If hosted/deployed/provider proof is missing, route to owner proof skills with scenario and target/environment.
6. If verification fails, reroute to correction before closure.

`sf-build` remains the sole owner of orchestration through `sf-verify -> sf-end -> sf-ship`, even when local `sf-start` auto-verify ran.

Do not close or ship half-coded outcomes.

## Post-Implementation Onboarding Gate

Evaluate `sf-onboarding` when work adds or changes a user-facing feature, setup flow, first-run state, empty state, permission, integration, settings path, multi-step workflow, public promise, docs/support expectation, or behavior a beginner might not discover.

Route before closure when activation/onboarding is part of the spec or acceptance criteria. Otherwise, suggest onboarding only when it materially improves adoption.

## End And Ship Orchestration

After verification passes:

1. Run `sf-end`.
2. Run `sf-ship` with bounded staging scope for the current chantier.
3. Never use `all-dirty` or `ship-all` without explicit user request.
4. If proof remains partial, ask explicit risk acceptance before shipping.

Do not end with `/sf-end` or `/sf-ship` as a manual next step after successful verification unless a named stop condition blocks orchestration.

## Internal Role References

When delegating, load role contracts from `$SHIPFLOW_ROOT/skills/references/subagent-roles/` as needed: technical reader, editorial reader, sequential executor, wave executor, and integrator. Do not expose these role files as user-facing commands.

## Report Templates

User mode:

```text
## Built: [task]

Result: [implemented / partial / blocked]
[Agents: used / not needed / degraded: reason]
[All checks passed ✅ | Checks failed: ... | Checks skipped: ...]
Evidence: [browser/prod/manual route or not needed]
[Onboarding suggestion: /sf-onboarding <feature or flow>]
Risk: [only if non-empty]
Next step: [only if real]

## Chantier

[spec path | non applicable: reason | non trace: reason]

Flux: sf-spec [marker] -> sf-ready [marker] -> sf-start [marker] -> sf-verify [marker] -> sf-end [marker] -> sf-ship [marker]
```

Agent mode may include mode, execution mode, agents, contract, phases, evidence routing, validation, risks, next step, and full chantier metadata.
