---
name: 705-sf-conversation-audit
description: "Audit stored ShipFlow conversations into actionable improvement routes."
argument-hint: "[default|latest|path <file-or-dir>|export shipflow|report=agent]"
---

# 705-sf-conversation-audit

## Canonical Paths

Before resolving any ShipFlow-owned file, load `$SHIPFLOW_ROOT/skills/references/canonical-paths.md` (`$SHIPFLOW_ROOT` defaults to `$HOME/shipflow`).

Canonical paths for this skill:

- Input transcripts: `$SHIPFLOW_ROOT/shipflow_data/workflow/conversations/`
- Audit output: `$SHIPFLOW_ROOT/shipflow_data/workflow/conversation-audits/`
- Optional fixtures: `$SHIPFLOW_ROOT/shipflow_data/workflow/conversations/fixtures/`

Conversation audits are ShipFlow-owned governance artifacts even when the audited conversation concerns another project. Do not create project-local `shipflow_data/workflow/conversations/` or `shipflow_data/workflow/conversation-audits/` directories for this skill. An explicit `path <file-or-dir>` may read an external transcript as input evidence, but the generated audit report still belongs under `$SHIPFLOW_ROOT/shipflow_data/workflow/conversation-audits/`.

## Chantier Tracking

Trace category: `conditionnel`.
Process role: `source-de-chantier`.

When attached to a unique chantier spec, append a `Chantier potentiel` block if non-trivial future work is found and no unique chantier owns it.

## Redaction and Safety Gate

- Never publish or ingest private transcripts by default.
- Keep default output under `$SHIPFLOW_ROOT/shipflow_data/workflow/conversation-audits/` (private governance area).
- Preserve the raw transcript as private evidence, but classify a cleaned conversation view by default.
- If a transcript contains likely secrets/private URLs/log paths/PII tokens, stop with a safety hold.
- Never include full secrets in the report; include only redacted excerpts.
- If safety holds, propose one of:
  - `100-sf-spec`: define a redaction-and-hygiene contract first
  - `300-sf-docs`: if source-surface rules changed
  - `103-sf-verify`: for evidence/process review

## Mission

Audit stored ShipFlow conversation transcripts into private governance reports with evidence-backed findings, safety holds, and owner routes for improvement work.

## Modes

- `default` (implicit): audit most recent file under `$SHIPFLOW_ROOT/shipflow_data/workflow/conversations/` with fallback to `latest`.
- `latest`: audit the most recent transcript in the canonical conversation directory.
- `path <file-or-dir>`: audit a specific transcript file or all files in a directory; this can read external input but must not move the audit output out of `$SHIPFLOW_ROOT`.
- `export shipflow`: run `800-tmux-capture-conversation --preset shipflow` first, then audit the new transcript from `$SHIPFLOW_ROOT/shipflow_data/workflow/conversations/`.
- `report=agent`: include detailed evidence and route rationale.

## Canonical Workflow

1. Resolve target transcript set:
   - explicit `path` argument,
   - `latest`,
   - or default latest-in-folder.
2. Validate redaction gate before reading raw transcript content.
3. Derive a cleaned classifier input that removes obvious terminal chrome, command output, diffs, JSON payloads, and long log/search noise while preserving user/agent turns.
4. Classify the cleaned view with deterministic categories (below), while keeping raw unsafe detection tied to the original transcript.
5. Write report to `$SHIPFLOW_ROOT/shipflow_data/workflow/conversation-audits/<slug>.md` using template `templates/artifacts/conversation_audit.md`.
6. Run the ShipFlow Core follow-through gate below before final reporting.
7. Print top findings + evidence summary + routing recommendation + any automatic skill-contract audit result.

## ShipFlow Core Follow-Through Gate

Do not leave skill-contract follow-up as a manual operator action when the local tools are available.

After classifying a conversation, automatically run a ShipFlow skill-contract audit when one or more findings indicate that skills may be unclear, stale, or insufficiently enforceable:

- `missed_action`
- `proof_gap`
- `stale_skill_contract`
- `user_friction`
- `weak_follow_through`

Preferred route:

```text
$900-shipflow-core audit local ShipFlow skills for the skill-contract gap found in this conversation
```

If the skill is not available in the current session but the local ShipFlow source exists, run the versioned audit tool directly:

```bash
python3 "${SHIPFLOW_ROOT:-$HOME/shipflow}/tools/audit_shipflow_skills.py"
```

Scope the follow-through to read-only analysis. Do not rewrite ShipFlow skills from this skill unless the operator explicitly asks for an edit pass.

The final report must include one of:

- `shipflow_core_followup: run` with the top audit result or relevant targeted finding,
- `shipflow_core_followup: unavailable` with the missing path or missing skill/tool capability,
- `shipflow_core_followup: skipped` only when no finding category above was present.

When a conversation finding names specific owner skills, map the ShipFlow Core follow-up to those files first, then broaden to all local skills only if the owner skill is ambiguous.

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
- Terminal/diff/search-command matches are classifier noise unless a human review ties them to an actual user or agent turn.
- Reports should mention `cleaned_input_used` or equivalent when the helper script provides it.

## Categories to Owners

- `missed_action` → `001-sf-build`
- `over_reporting` → `001-sf-build`
- `wrong_owner_route` → `001-sf-build`
- `literalism_over_intent` → `001-sf-build`
- `proof_gap` → `103-sf-verify`
- `stale_skill_contract` → `100-sf-spec`
- `bad_question` → `001-sf-build`
- `user_friction` → `001-sf-build`
- `unsafe_ship_or_dirty_scope` → `100-sf-spec`
- `weak_follow_through` → `001-sf-build`

## Owner Handoff

- Route high-confidence skill-contract changes to `001-sf-build` and `100-sf-spec`.
- Route recurring quality-control gaps to `103-sf-verify`.
- Escalate process-risked safety policy issues to `100-sf-spec`.

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
