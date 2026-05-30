---
artifact: technical_guidelines
metadata_schema_version: "1.0"
artifact_version: "1.0.0"
project: ShipFlow
created: "2026-05-30"
updated: "2026-05-30"
status: draft
source_skill: sf-build
scope: actionable_failure_contract
owner: Diane
confidence: high
risk_level: high
security_impact: yes
docs_impact: yes
linked_systems:
  - sf-build
  - sf-verify
depends_on: []
supersedes: []
evidence:
  - "Need for deterministic owner routing and evidence requirements in reusable audit or support workflows."
next_review: "2026-06-30"
next_step: "/sf-ready Actionable Failure Contract"
---

# Actionable Failure Contract

## Purpose

When a failure is detected, the response must separate:

- what is observed,
- what the evidence says,
- what is the proposed owner action.

The contract exists to avoid generic reports that cannot be converted into durable work.

## Core Rule

A failure is actionable when a clear, specific, low-friction owner route exists.

## Actionability Test

Use this checklist before producing a final failure report:

- Evidence is tied to a file, excerpt, or transcript area.
- Impact is explicit (`user`, `workflow`, `release`, `quality`, `security`).
- Recommended owner skill is in one of the canonical domain skills.
- The route is testable and does not require speculative broad edits.

## Valid Owner Routing

- `sf-skill-build`: contract or behavior definition updates.
- `sf-docs`: doc/contract correction when public behavior or workflow text is misaligned.
- `sf-verify`: missing evidence, proof gap, or incorrect assumptions.
- `sf-spec`: when implementation surface is non-trivial and requires a new durable spec.

## Non-Actionable Report Conditions

Mark a finding non-actionable when all are true:

- evidence is weak or absent,
- owner route is ambiguous,
- or impact is speculative user preference.

If non-actionable:

- report `already covered` if a stable contract already addresses it,
- record a confidence limit,
- avoid auto-routing to a chantier.
