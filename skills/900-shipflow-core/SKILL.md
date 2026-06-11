---
name: 900-shipflow-core
description: "Internal operator skill for auditing ShipFlow skill execution fidelity and plugin-packaging readiness."
argument-hint: "[audit|packaging|help] <instruction>"
---

# ShipFlow Core

## Canonical Paths

Before resolving any ShipFlow-owned file, load `$SHIPFLOW_ROOT/skills/references/canonical-paths.md` (`$SHIPFLOW_ROOT` defaults to `$HOME/shipflow`). ShipFlow-owned tools, shared references, skill-local references, templates, workflow docs, and internal scripts resolve from `$SHIPFLOW_ROOT`.

## Chantier Tracking

Trace category: `conditionnel`.
Process role: `support-de-chantier`.

When attached to a unique chantier spec, append a current `900-shipflow-core` row only if this run materially supports that chantier. If no unique spec is in scope, do not write to a spec and report `Chantier: non trace` with the reason.

## Report Modes

Before producing the final report, load `$SHIPFLOW_ROOT/skills/references/reporting-contract.md`.

Default to `report=user`: concise, outcome-first, and in the operator's active language. Use `report=agent` only for detailed handoffs, blocked runs, or explicit verbose requests.

## Mission

`900-shipflow-core` is an internal ShipFlow operator tool. It audits local ShipFlow skills, checks execution-fidelity risks, and helps prepare plugin packaging decisions without acting as a public user-facing plugin.

Use it when Diane or a ShipFlow maintainer wants to:

- audit whether local skills expose mission, scope, stop, validation, reference, and report signals clearly;
- investigate whether Codex is likely to miss a skill gate or ask the operator to do proof it could run itself;
- inspect portability risks before moving ShipFlow skills into the public `shipflow` plugin;
- keep the old `shipflow-core` plugin pilot out of the public marketplace path.

## Scope Gate

Default to read-only analysis. Do not edit skills, docs, plugins, marketplace files, runtime config, or project code unless the operator explicitly asks for an edit pass or a lifecycle skill has already provided a ready spec.

This skill is internal-only:

- do not add it to the public `shipflow` plugin bundle;
- do not create a public site skill page for it unless the operator explicitly reverses that policy;
- do not treat the deprecated local plugin source at `$HOME/plugins/shipflow-core` as canonical.

## Required References

Load only what the current request needs:

- `$SHIPFLOW_ROOT/skills/references/skill-execution-fidelity.md` for skill-obedience, audit classification, and operator-last-resort rules.
- `$SHIPFLOW_ROOT/shipflow_data/technical/codex-plugin-packaging.md` for public plugin packaging and sparse bootstrap constraints.
- `$SHIPFLOW_ROOT/skills/references/spec-driven-development-discipline.md` before recommending or making skill-contract edits.
- `$SHIPFLOW_ROOT/skills/references/reporting-contract.md` before final reporting.

## Audit Workflow

For local skill-quality audits:

1. Resolve `$SHIPFLOW_ROOT` and confirm `$SHIPFLOW_ROOT/skills` exists.
2. Run the versioned audit helper when local tooling is available:

```bash
python3 "${SHIPFLOW_ROOT:-$HOME/shipflow}/tools/audit_shipflow_skills.py"
```

3. Treat `hard` findings as completion blockers until fixed or disproven.
4. Treat `review` findings as scenario-first triage items, not automatic rewrite permission.
5. Treat `style` findings as optional consistency improvements unless a pressure scenario shows Codex is likely to miss the gate.
6. Do not rewrite skills from audit output unless a ready spec or explicit operator instruction authorizes an edit pass.

## Packaging Workflow

For plugin packaging work:

1. Keep `shipflow` as the public user-facing plugin.
2. Keep `shipflow-core` internal and repo-synced for operators.
3. Check that public plugin flows do not require `$HOME/shipflow` or `$HOME/plugins/shipflow-core`.
4. Use sparse bootstrap only after explicit approval because it changes local state and downloads source.
5. Never package secrets, private transcripts, customer context, dependency directories, local caches, or machine-specific paths.

## Stop Conditions

Stop and report `blocked` when:

- `$SHIPFLOW_ROOT/skills` does not exist;
- `$SHIPFLOW_ROOT/tools/audit_shipflow_skills.py` is missing when an audit was requested;
- the request would publish, bundle, or market `shipflow-core` as a public user plugin without explicit operator reversal;
- the request would edit broad skill contracts without a ready spec or explicit edit-pass instruction;
- the next proof step would require secrets, private account access, destructive actions, or user-only device access.

## Validation

Validate this skill after edits with:

```bash
rg -n "Mission|Scope Gate|Required References|Stop Conditions|Validation|Report Modes|audit_shipflow_skills" skills/900-shipflow-core/SKILL.md
python3 tools/audit_shipflow_skills.py
python3 tools/skill_budget_audit.py --skills-root skills --format markdown
tools/shipflow_sync_skills.sh --check --skill 900-shipflow-core
```
