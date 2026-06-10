---
artifact: spec
metadata_schema_version: "1.0"
artifact_version: "1.0.0"
project: ShipFlow
created: "2026-06-10"
created_at: "2026-06-10 11:15:00 UTC"
updated: "2026-06-10"
updated_at: "2026-06-10 11:15:00 UTC"
status: ready
source_skill: sf-skill-build
source_model: "GPT-5 Codex"
scope: workflow
owner: Diane
user_story: "As a ShipFlow operator building Flutter and multi-platform products, I want a dedicated parity skill that keeps product concepts, implementation evidence, QA proof, and public platform claims aligned across OS targets, so users receive excellent and predictable experiences."
confidence: high
risk_level: medium
security_impact: none
docs_impact: yes
linked_systems:
  - skills/sf-platform-parity/SKILL.md
  - skills/sf-platform-parity/references/platform-parity-matrix.md
  - skills/sf-platform-parity/agents/openai.yaml
  - site/src/content/skills/sf-platform-parity.md
depends_on:
  - artifact: "skills/sf-skill-build/SKILL.md"
    artifact_version: "current"
    required_status: active
supersedes: []
evidence:
  - "User request 2026-06-10: create sf-platform-parity in ShipFlow."
  - "User decision 2026-06-10: parity should be quasi-complete across platforms, with adapted experiences accepted only when the result is better or required."
next_step: "/sf-verify shipflow_data/workflow/specs/sf-platform-parity-skill.md"
---

# Spec: sf-platform-parity Skill

## Status

ready

## User Story

As a ShipFlow operator building Flutter and multi-platform products, I want a dedicated parity skill that keeps product concepts, implementation evidence, QA proof, and public platform claims aligned across OS targets, so users receive excellent and predictable experiences.

## Minimal Behavior Contract

Create `sf-platform-parity` as a ShipFlow skill. It audits and steers platform parity across web, Android, iOS, Windows, macOS, Linux, and any project-declared platform. It must distinguish same behavior, better/native adaptations, required platform adaptations, accepted degradations, unsupported capabilities, and unknown/proof gaps. It must route implementation, QA, verification, documentation, and ship follow-up to owner skills instead of duplicating their internals.

## Success Behavior

- The skill has a distinct trigger and does not duplicate `sf-build`, `sf-verify`, or `sf-audit`.
- The skill exposes a compact activation contract with canonical paths, chantier tracking, report modes, stop conditions, and validation.
- The skill includes a matrix reference for capability/platform/evidence/gap/route tracking.
- The runtime skill metadata uses `sf-platform-parity` as the exact display name.
- A public skill page explains when to use it and what output to expect.
- Runtime sync makes the skill available to current Claude/Codex skill directories.

## Error Behavior

- If platform evidence is missing, the skill reports `unknown` or `proof-gap` instead of claiming support.
- If adaptation is not better, required, or explicitly accepted as degraded, the skill routes follow-up instead of blessing divergence.
- If dirty unrelated files would be overwritten, the skill stops or limits edits to new owned files.

## Scope In

- `skills/sf-platform-parity/SKILL.md`
- `skills/sf-platform-parity/references/platform-parity-matrix.md`
- `skills/sf-platform-parity/agents/openai.yaml`
- `site/src/content/skills/sf-platform-parity.md`
- Runtime skill sync for current-user Claude/Codex links.

## Scope Out

- Implementing WinFlowz platform ports.
- Rewriting `sf-build`, `sf-verify`, or `sf-audit`.
- Editing unrelated dirty ShipFlow files.
- Shipping or committing without an explicit ship instruction.

## Placement Decision

Create a new domain skill. The behavior has a distinct trigger and durable artifact: a platform parity matrix with capability-level verdicts and platform QA routing. It overlaps audit and verification, but neither `sf-audit` nor `sf-verify` owns the product decision model for cross-platform sameness versus better/required adaptation.

## Proof Path

`scenario-first`: use the WinFlowz desktop/iOS parity pressure scenario. The old workflow made it easy to ask `sf-build` for each platform, but did not maintain a single concordance surface across product promise, implementation, QA, and docs. The new skill is valid if it can route that scenario without claiming implementation support from scaffolds or permission strings alone.

## Current Chantier Flow

| Skill | Status |
|-------|--------|
| sf-spec | ready |
| sf-ready | ready |
| sf-skill-build | implemented |
| sf-verify | pending |
| sf-ship | pending |

## Skill Run History

| Date UTC | Skill | Model | Action | Result | Next step |
|----------|-------|-------|--------|--------|-----------|
| 2026-06-10 11:15:00 UTC | sf-skill-build | GPT-5 Codex | Created the sf-platform-parity skill contract, matrix reference, runtime metadata, public skill page, and spec. | implemented | /sf-verify shipflow_data/workflow/specs/sf-platform-parity-skill.md |
