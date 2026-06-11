---
artifact: technical_guidelines
metadata_schema_version: "1.0"
artifact_version: "0.5.0"
project: ShipFlow
created: "2026-04-27"
updated: "2026-05-11"
status: draft
source_skill: 102-sf-start
scope: chantier-tracking
owner: Diane
confidence: high
risk_level: medium
security_impact: none
docs_impact: yes
linked_systems:
  - shipflow_data/workflow/specs/
  - skills/*/SKILL.md
  - skills/000-shipflow/SKILL.md
  - skills/004-sf-deploy/SKILL.md
  - skills/002-sf-maintain/SKILL.md
  - skills/006-sf-design/SKILL.md
  - skills/references/reporting-contract.md
  - skills/references/final-report-timestamp.md
  - skills/references/master-workflow-lifecycle.md
depends_on:
  - artifact: "shipflow_data/workflow/specs/specs-as-chantier-registry.md"
    artifact_version: "1.0.0"
    required_status: "ready"
supersedes: []
evidence:
  - "Spec specs-as-chantier-registry.md defines shipflow_data/workflow/specs/ as the global chantier registry."
  - "shipflow added as the primary helper router; selected owner skills own durable state and chantier tracing."
  - "004-sf-deploy added as a lifecycle release orchestrator."
  - "002-sf-maintain promoted from recurring maintenance source-de-chantier to lifecycle master skill."
  - "Compact user-facing reporting contract added with explicit agent handoff mode."
  - "Master workflow lifecycle reference added: bug work items use bugs/*.md as source of truth; BUGS.md is optional/generated/triage view."
  - "Final report timestamp moved into a shared reporting brick loaded through reporting-contract.md."
  - "006-sf-design added as an obligatoire lifecycle master skill."
  - "003-sf-bug clarified as bug lifecycle execution through owner skills and bounded subagents."
next_review: "2026-05-27"
next_step: "/103-sf-verify Specs as chantier registry"
---

# Chantier Tracking Doctrine

`shipflow_data/workflow/specs/` is the global registry for spec-first chantiers. Do not create a separate registry in `TASKS.md`, `AUDIT_LOG.md`, `PROJECTS.md` (legacy/compat only), or root `specs/`.

## Two-Axis Classification

Chantier tracking has two separate axes. Do not collapse them into one label.

Trace category answers: may this skill write a run trace into an existing chantier spec?

- `obligatoire`: lifecycle spec-first skills. When a unique chantier spec is identified, read the spec, append or update `Skill Run History`, update `Current Chantier Flow`, and end the user report with the compact `Chantier` block from `skills/references/reporting-contract.md`.
- `conditionnel`: cross-cutting skills. Trace only when the run is attached to one unique chantier spec. If no unique spec is available, do not write to any spec and report `Chantier: non applicable` or `Chantier: non trace` with the reason. Final output still follows `skills/references/reporting-contract.md`.
- `non-applicable`: helper/session/discovery skills. Do not write to specs. If invoked inside a chantier flow, mention that chantier tracking is non-applicable or not traced and point to the lifecycle next step when useful. Non-applicable for spec trace does not forbid non-spec durable artifacts when a skill contract allows them (for example `700-sf-explore` and `exploration_report`).

Process role answers: can this skill originate, support, steer, or merely inspect a chantier?

- `lifecycle`: creates, readies, executes, verifies, closes, or ships a unique chantier.
- `source-de-chantier`: may reveal work that deserves a new spec when no unique chantier exists.
- `support-de-chantier`: helps execute or document a chantier but should not normally originate one.
- `pilotage`: manages priorities, backlog, tasks, review, or continuation; can route to `100-sf-spec` on explicit user intent, but does not turn every planning note into a chantier.
- `helper`: read-only or session helper; does not propose a chantier unless the user explicitly asks to formalize one.

`source-de-chantier` is not a trace category. A skill can be `conditionnel` for spec writes and `source-de-chantier` for intake.

## Chantier Potential Threshold

A source skill must evaluate the standard `seuil` for chantier potential before its final report when it finds future work outside a single direct fix.

Use `Chantier potentiel: oui` when at least one of these is true:

- P0/P1 severity, production incident, security/data risk, auth/session breakage, deployment breakage, or critical dependency exposure.
- Multiple files (`plusieurs fichiers`), projects, domains, teams, or workflow phases are affected.
- A product, technical, architecture, migration, pricing, permission, data-retention, or tenant-boundary decision is required.
- The work needs staged execution, rollback/retry planning, validation by another skill, or user/operator confirmation.
- The finding cannot be completed safely as an immediate local fix in the current run.

Use `Chantier potentiel: non` when the finding is a narrow local fix, the current chantier already owns the work, the report is informational only, or the evidence is too weak for a spec. Still name the reason.

Use `Chantier potentiel: incertain` when the evidence is incomplete or the severity/scope is unclear. Name the missing proof and route to exploration, retest, or explicit user selection.

Never open a chantier for every micro-finding, never attach to an ambiguous spec, and never create a new spec directly from a source skill. The next durable step is `/100-sf-spec ...`.

## Chantier Potentiel Block

Source skills should add this block after their findings and before or near the regular `Chantier` block:

```text
## Chantier potentiel

Chantier potentiel: oui | non | incertain
Titre propose: <short chantier title or None>
Raison: <why this does or does not cross the threshold>
Severite: P0 | P1 | P2 | P3 | unknown
Scope: <files/projects/domains/workflows affected>
Evidence:
- <finding, command, file, URL, or observed behavior>
Spec recommandee: /100-sf-spec <title and compact context>
Prochaine etape: <next ShipFlow command or explicit none>
```

This block coexists with the compact `Chantier` block. If the source skill is already attached to one unique chantier and the findings remain inside that chantier, use `Chantier potentiel: non` and point back to the current lifecycle next step.

## Role Matrix

| Skill group | Trace category | Process role | Source threshold |
|-------------|----------------|--------------|------------------|
| `100-sf-spec`, `101-sf-ready`, `001-sf-build`, `002-sf-maintain`, `006-sf-design`, `004-sf-deploy`, `102-sf-start`, `103-sf-verify`, `104-sf-end`, `005-sf-ship` | `obligatoire` | `lifecycle` | Not a source; continue or create the owned chantier through the lifecycle gates. |
| `400-sf-audit*`, `402-sf-deps`, `403-sf-perf` | `conditionnel` | `source-de-chantier` | Major audit findings, P0/P1, cross-domain P2 clusters, or fixes needing a spec. |
| `109-sf-auth-debug`, `405-sf-prod`, `105-sf-check`, `107-sf-test`, `404-sf-migrate`, `106-sf-fix`, `003-sf-bug` | `conditionnel` | `source-de-chantier` | Incidents, failing flows, migration risk, bug files, bug lifecycle execution, or validation failures beyond a direct fix. |
| `204-sf-market-study`, `205-sf-veille`, `203-sf-research` | `conditionnel` | `source-de-chantier` | Strategic or research output that requires a product, content, architecture, or implementation decision. |
| `300-sf-docs`, `201-sf-enrich`, `200-sf-redact`, `202-sf-repurpose`, `306-sf-scaffold`, `304-sf-changelog`, `501-sf-design-playground`, `307-sf-skills-refresh`, `305-sf-init` | `conditionnel` | `support-de-chantier` | Route to a source or `/100-sf-spec` only when the user explicitly asks to formalize follow-up work. |
| `309-sf-tasks`, `701-sf-backlog`, `702-sf-priorities`, `703-sf-review`, `706-continue` | `conditionnel` | `pilotage` | Do not create a chantier from every note; route only when the user or evidence requires a durable spec. |
| `000-shipflow`, `301-sf-context`, `704-sf-model`, `302-sf-help`, `308-sf-status`, `303-sf-resume`, `700-sf-explore`, `707-name` | `non-applicable` | `helper` | Not a source; can recommend or directly hand off to the lifecycle next step when useful. `000-shipflow` routes only; selected owner skills own durable state and chantier tracing. `700-sf-explore` may write `exploration_report` artifacts but still must not write chantier spec history. |

## Spec Write Rules

- Before writing, identify exactly one `shipflow_data/workflow/specs/*.md` file with ShipFlow frontmatter. Root `specs/*.md` files are migration sources only and should be routed through `/300-sf-docs migrate-layout`.
- If matching is ambiguous, stop and ask for an explicit spec instead of guessing.
- Preserve all existing metadata and contract sections.
- Add `Skill Run History` if it is missing, using this table:

```markdown
## Skill Run History

| Date UTC | Skill | Model | Action | Result | Next step |
|----------|-------|-------|--------|--------|-----------|
```

- Use the best available model label. If the runtime does not expose it, use `unknown` or the operator-provided name.
- Never invent past runs. Only record the current run or facts already present in the spec/report.

## Final Report Block

Load `$SHIPFLOW_ROOT/skills/references/reporting-contract.md` before producing final output. That contract also loads the shared final-report timestamp brick. Use the compact block in `report=user` and the fuller metadata block only in `report=agent`, blocked runs, or handoffs that need trace state.

Compact user-mode block:

```text
## Chantier

<spec path | non applicable: reason | non trace: reason>

Flux: 100-sf-spec <marker> -> 101-sf-ready <marker> -> 102-sf-start <marker> -> 103-sf-verify <marker> -> 104-sf-end <marker> -> 005-sf-ship <marker>
Reste a faire: <only if non-empty>
Prochaine etape: <only if non-empty>
```

Detailed agent-mode block:

```text
## Chantier

Skill courante: <skill>
Chantier: <spec path | non applicable | non trace>
Trace spec: ecrite | non ecrite | non applicable
Flux:
- 100-sf-spec: <status>
- 101-sf-ready: <status>
- 102-sf-start: <status>
- 103-sf-verify: <status>
- 104-sf-end: <status>
- 005-sf-ship: <status>

Reste a faire:
- <item or None>

Prochaine etape:
- <command or explicit none>

Verdict <skill>:
- <verdict>
Horodatage du verdict: YYYY-MM-DD HH:mm Paris time
```
