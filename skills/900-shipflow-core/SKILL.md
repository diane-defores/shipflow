---
name: 900-shipflow-core
description: "Internal operator skill for auditing ShipFlow skill execution fidelity and plugin-packaging readiness."
argument-hint: "[audit|packaging|help] <instruction>"
---

# ShipFlow Core

## Canonical Paths

Before resolving any ShipFlow-owned file, load `$SHIPFLOW_ROOT/skills/references/canonical-paths.md` (`$SHIPFLOW_ROOT` defaults to `$HOME/shipflow`). ShipFlow-owned tools, shared references, skill-local references, templates, workflow docs, and internal scripts resolve from `$SHIPFLOW_ROOT`.
Follow the shared `ShipFlow-Owned Tool Preflight` doctrine from `$SHIPFLOW_ROOT/skills/references/canonical-paths.md`. Do not infer ShipFlow-owned tool paths from the current working directory or ask the operator to run the tool while this preflight is still agent-runnable.

## Chantier Tracking

Trace category: `conditionnel`.
Process role: `support-de-chantier`.

When attached to a unique chantier spec, append a current `900-shipflow-core` row only if this run materially supports that chantier. If no unique spec is in scope, do not write to a spec and report `Chantier: non trace` with the reason.

## Report Modes

Before producing the final report, load `$SHIPFLOW_ROOT/skills/references/reporting-contract.md`.

Default to `report=user`: concise, outcome-first, and in the operator's active language. Use `report=agent` only for detailed handoffs, blocked runs, or explicit verbose requests.
When issues are found, `report=user` may keep the output compact, but it must still include `Observed problem`, `System cause`, `Prevention rule`, and `Contract/tooling improvement proposal`. Do not collapse a confirmed issue into a bare finding list without the system-improvement output.

## Mission

`900-shipflow-core` is an internal ShipFlow operator tool. It audits local ShipFlow skills, checks execution-fidelity risks, and helps prepare plugin packaging decisions without acting as a public user-facing plugin.

Because this skill is itself ShipFlow infrastructure, invoking `900-shipflow-core` is an implicit instruction to improve ShipFlow even if the operator does not say "ShipFlow" out loud. The default target is the ShipFlow system under `$SHIPFLOW_ROOT`: shared references, skill contracts, and governance rules. Do not assume the current project repository is the intended edit target unless explicitly named.

When the operator asks to modify the ShipFlow CLI or TUI from another conversation, treat the default edit targets as:

- `${SHIPFLOW_ROOT:-$HOME/shipflow}/shipflow.sh`
- `${SHIPFLOW_ROOT:-$HOME/shipflow}/lib.sh`
- `${SHIPFLOW_ROOT:-$HOME/shipflow}/config.sh`
- `${SHIPFLOW_ROOT:-$HOME/shipflow}/install.sh`
- `${SHIPFLOW_ROOT:-$HOME/shipflow}/tui/`

It also protects cross-skill invariants such as product governance: declared products should not rely on ad hoc URL discovery, improvised delivery framing, or unsupported public claims when the project corpus is supposed to hold that truth.

When an execution-fidelity issue is confirmed, completion is not just the local observation. The skill must also produce the reusable system-improvement output: `Observed problem`, `System cause`, `Prevention rule`, and the narrowest justified `Contract/tooling improvement proposal`.

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

1. Resolve `$SHIPFLOW_ROOT`.
2. Confirm the owned path `$SHIPFLOW_ROOT/skills` exists.
3. Confirm the target tool `$SHIPFLOW_ROOT/tools/audit_shipflow_skills.py` exists.
4. Run the versioned audit helper:

```bash
python3 "${SHIPFLOW_ROOT:-$HOME/shipflow}/tools/audit_shipflow_skills.py"
```

5. Treat `hard` findings as completion blockers until fixed or disproven.
6. Treat `review` findings as scenario-first triage items, not automatic rewrite permission.
7. Treat `style` findings as optional consistency improvements unless a pressure scenario shows Codex is likely to miss the gate.
8. For each confirmed `hard` or `review` finding, convert the finding into system-improvement output before claiming completion:
   - `Observed problem`: the concrete failure or risky behavior that was actually seen
   - `System cause`: the violated invariant, missing contract, hidden gate, or tooling gap that made the issue possible
   - `Prevention rule`: the durable rule that should stop the same class of failure from recurring
   - `Contract/tooling improvement proposal`: the narrowest justified improvement locus, such as a local skill section, a shared reference, or the audit tool
9. Do not rewrite skills from audit output unless a ready spec or explicit operator instruction authorizes an edit pass.

## System-Improvement Output

When `900-shipflow-core` confirms a non-style issue, the run is not complete until it has translated the finding into a reusable system-improvement output.

Required fields:

- `Observed problem`
- `System cause`
- `Prevention rule`
- `Contract/tooling improvement proposal`

System-improvement output must be scenario-first. Do not stop at wording criticism, generic "be more careful" advice, or a broad rewrite suggestion without naming the pressure scenario and the narrowest improvement locus that would prevent recurrence.

Prefer the smallest justified target:

- local skill contract when the issue is owned by one skill
- shared reference when multiple skills depend on the same doctrine
- audit/tooling improvement when the failure should be caught mechanically

Style-only findings do not require full system-improvement output unless a pressure scenario shows that the style gap is likely to cause a real execution failure.

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
- a ShipFlow-owned audit step would run before resolving `$SHIPFLOW_ROOT`, confirming the owned path, and confirming the target tool file;
- the request would publish, bundle, or market `shipflow-core` as a public user plugin without explicit operator reversal;
- the request would edit broad skill contracts without a ready spec or explicit edit-pass instruction;
- the next proof step would require secrets, private account access, destructive actions, or user-only device access.

## Validation

Validate this skill after edits with:

```bash
rg -n "Mission|Scope Gate|Required References|Stop Conditions|Validation|Report Modes|ShipFlow-Owned Tool Preflight|audit_shipflow_skills" skills/900-shipflow-core/SKILL.md skills/references/canonical-paths.md
python3 tools/audit_shipflow_skills.py
python3 tools/skill_budget_audit.py --skills-root skills --format markdown
tools/shipflow_sync_skills.sh --check --skill 900-shipflow-core
```
