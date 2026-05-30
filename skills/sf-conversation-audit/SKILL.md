---
name: sf-conversation-audit
description: "Audit stored ShipFlow conversations and produce durable, actionable improvement routes."
argument-hint: "[default|latest|path <file-or-dir>|export shipflow|report=agent]"
---

# sf-conversation-audit

## Canonical Paths

Before resolving any ShipFlow-owned file, load `$SHIPFLOW_ROOT/skills/references/canonical-paths.md` (`$SHIPFLOW_ROOT` defaults to `$HOME/shipflow`).

Canonical paths for this skill:

- Input transcripts: `shipflow_data/workflow/conversations/`
- Audit output: `shipflow_data/workflow/conversation-audits/`
- Optional fixtures: `shipflow_data/workflow/conversations/fixtures/`

## Chantier Tracking

Trace category: `conditionnel`.
Process role: `source-de-chantier`.

When attached to a unique chantier spec, append a `Chantier potentiel` block if non-trivial future work is found and no unique chantier owns it.

## Redaction and Safety Gate

- Never publish or ingest private transcripts by default.
- Keep default output under `shipflow_data/workflow/conversation-audits/` (private governance area).
- If a transcript contains likely secrets/private URLs/log paths/PII tokens, stop with a safety hold.
- Never include full secrets in the report; include only redacted excerpts.
- If safety holds, propose one of:
  - `sf-spec`: define a redaction-and-hygiene contract first
  - `sf-docs`: if source-surface rules changed
  - `sf-verify`: for evidence/process review

## Modes

- `default` (implicit): audit most recent file under `shipflow_data/workflow/conversations/` with fallback to `latest`.
- `latest`: audit the most recent transcript in the canonical conversation directory.
- `path <file-or-dir>`: audit a specific transcript file or all files in a directory.
- `export shipflow`: run `tmux-capture-conversation --preset shipflow` first, then audit the new transcript.
- `report=agent`: include detailed evidence and route rationale.

## Canonical Workflow

1. Resolve target transcript set:
   - explicit `path` argument,
   - `latest`,
   - or default latest-in-folder.
2. Validate redaction gate before reading raw transcript content.
3. Classify with deterministic categories (below).
4. Write report to `shipflow_data/workflow/conversation-audits/<slug>.md` using template `templates/artifacts/conversation_audit.md`.
5. Print top findings + evidence summary + routing recommendation.

## Stable Finding Categories

- `missed_action`
- `over_reporting`
- `wrong_owner_route`
- `literalism_over_intent`
- `proof_gap`
- `stale_skill_contract`
- `bad_question`
- `user_friction`
- `unsafe_ship_or_dirty_scope`
- `weak_follow_through`

### Evidence Heuristics

- Findings are evidence-first and deterministic.
- Frictions are valid only when mapped to text evidence, scope impact, and confidence.
- One line of evidence per finding in the report.

## Categories to Owners

- `missed_action` → `sf-build`
- `over_reporting` → `sf-build`
- `wrong_owner_route` → `sf-build`
- `literalism_over_intent` → `sf-build`
- `proof_gap` → `sf-verify`
- `stale_skill_contract` → `sf-spec`
- `bad_question` → `sf-build`
- `user_friction` → `sf-build`
- `unsafe_ship_or_dirty_scope` → `sf-spec`
- `weak_follow_through` → `sf-build`

## Owner Handoff

- Route high-confidence skill-contract changes to `sf-build` and `sf-spec`.
- Route recurring quality-control gaps to `sf-verify`.
- Escalate process-risked safety policy issues to `sf-spec`.

## Required References

Load:

- `skills/references/decision-quality-contract.md`
- `skills/references/reporting-contract.md`
- `skills/references/actionable-failure-contract.md`
- `skills/references/spec-driven-development-discipline.md`
- `templates/artifacts/conversation_audit.md`

## Report Modes

Default: `report=user`.
Use `report=agent` for evidence-heavy handoff.

## Stop Condition

Stop and report blocked if:

- no usable transcript is available,
- safety gate blocks raw-content output,
- owner route is ambiguous after a deterministic classification pass.
