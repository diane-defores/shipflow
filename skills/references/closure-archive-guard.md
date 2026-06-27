---
artifact: technical_guidelines
metadata_schema_version: "1.0"
artifact_version: "1.0.0"
project: "shipflow"
created: "2026-06-27"
updated: "2026-06-27"
status: active
source_skill: 104-sf-end
scope: closure-archive-guard
owner: "Diane"
confidence: high
risk_level: medium
security_impact: yes
docs_impact: yes
linked_systems:
  - "skills/104-sf-end/SKILL.md"
  - "skills/005-sf-ship/SKILL.md"
  - "skills/103-sf-verify/SKILL.md"
  - "shipflow_data/workflow/"
depends_on:
  - artifact: "skills/references/reporting-contract.md"
    artifact_version: "1.4.0"
    required_status: active
  - artifact: "skills/references/spec-driven-development-discipline.md"
    artifact_version: "1.5.0"
    required_status: active
supersedes: []
evidence:
  - "Extracted from auditing OpenSpec's archive-change skill as a reusable closure guard."
next_review: "2026-07-27"
next_step: "Use before closure, archive, changelog, tracker-done, or full-close ship claims."
---

# Closure Archive Guard

## Purpose

This reference defines the ShipFlow guard for closing, archiving, or marking work as done without overstating completion.

Use it before tracker closure, changelog framing, archive moves, full-close shipping, or any final report that could imply a work item is complete.

## Closure Preflight

Before closure or archive:

- identify the single work item, spec, bug, task, or session scope being closed
- inspect implementation state, verification state, documentation state, and remaining proof gaps
- check whether any source delta still needs to be synced into the durable source of truth
- check whether closing would hide incomplete tasks, unresolved warnings, stale docs, open bug state, or pending hosted/manual proof
- ask a targeted confirmation only when closure is still possible but would intentionally proceed with known incomplete artifacts or skipped sync

## Sync And Delta Rule

Before marking work complete, compare the changed artifact with the durable source of truth it should update.

Examples:

- spec delta -> canonical spec or current chantier spec
- bug fix state -> `bugs/BUG-ID.md` status and retest history
- task completion -> `shipflow_data/workflow/TASKS.md`
- public behavior change -> README, help, site content, docs, or support copy
- skill behavior change -> runtime skill links, help/discovery docs, and relevant shared references

If a delta exists, either sync it, route it to the owner skill, or report a named closure limit. Do not silently archive, mark done, or ship full-close while the durable source of truth is stale.

## Archive Safety

When moving or archiving a durable artifact:

- generate deterministic archive names when possible
- check the target path for collision immediately before moving
- stop rather than overwrite an existing archive target
- preserve metadata and sidecar files unless the work item explicitly says to split them
- keep migration evidence discoverable from the canonical governance path

## Status Semantics

- `closed`: implementation, required proof, source-of-truth sync, and closure bookkeeping are complete for the current scope
- `deferred`: closure is intentionally postponed because remaining work is known and routed
- `partial`: work advanced, but implementation or closure state is incomplete
- `blocked`: closure cannot proceed safely because required context, proof, sync, or ownership is missing
- `archived`: durable artifact was moved to an archive after collision and sync checks

Do not use `closed` or `archived` to hide incomplete tasks or missing proof. If closure proceeds with warnings by explicit operator choice, report the warnings and residual owner route.

## Verification Hooks

Verification should check:

- closure target was unique
- source-of-truth deltas were synced or explicitly routed
- tracker/changelog/docs wording does not claim stronger proof than exists
- archive target collision was checked when files were moved
- closure status and proof status are not conflated
