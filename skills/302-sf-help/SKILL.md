---
name: 302-sf-help
description: "Answer ShipFlow workflow, skill, mode, and prompt questions."
argument-hint: <help topic or route question>
---

## Canonical Paths

Before resolving any ShipFlow-owned file, load `$SHIPFLOW_ROOT/skills/references/canonical-paths.md` (`$SHIPFLOW_ROOT` defaults to `$HOME/shipflow`). ShipFlow tools, shared references, skill-local `references/*`, templates, workflow docs, and internal scripts must resolve from `$SHIPFLOW_ROOT`, not from the project repo where the skill is running. Project artifacts and source files still resolve from the current project root unless explicitly stated otherwise.

## Instruction Layering

This `SKILL.md` is the activation contract. Before editing or expanding this skill, load `$SHIPFLOW_ROOT/skills/references/skill-instruction-layering.md` and keep bulky workflow detail in skill-local references.

## Chantier Tracking

Trace category: `non-applicable`.
Process role: `helper`.

This skill does not write to chantier specs. If invoked inside a spec-first flow, do not modify `Skill Run History`; include `Chantier: non applicable` or `Chantier: non trace` only when useful.

## Report Modes

Before producing the final report, load `$SHIPFLOW_ROOT/skills/references/reporting-contract.md`.

Default to `report=user`: concise, outcome-first, and in the user's active language. Use `report=agent`, `handoff`, `verbose`, or `full-report` only when the user or next owner needs detailed evidence.

## Required References

Always load shared references only when their gate applies. Load skill-local references precisely by mode:

- `references/help-catalog.md`: Skill catalog, workflow cycles, prompts, scoring notes, file references, and quick answers.
- `skills/references/shipflow-terms.md`: canonical package terminology for `Dev Server`, `TUI`, `local tools`, and skill-scope references.

The canonical `Chantier Registry` doctrine lives in `$SHIPFLOW_ROOT/skills/references/chantier-tracking.md`; this skill only summarizes it for help output.

The canonical decision-quality doctrine lives in `$SHIPFLOW_ROOT/skills/references/decision-quality-contract.md`; this skill summarizes it when users ask about quality, minimal changes, shortcuts, model choice, best practices, security, performance, engineering standards, or the rule "does this replace part of the current structure with less friction, more speed, or less maintenance?"

The canonical numeric skill-code index lives in `$SHIPFLOW_ROOT/skills/references/skill-code-index.md`; load it when users ask about skill codes, numeric prefixes, shortcuts, faster skill lookup, or exact skill discovery.

When users ask about app creation, blueprints, "crée une app", "quoi de neuf", or how `001-sf-build` handles new app projects, load `$SHIPFLOW_ROOT/skills/references/app-blueprints.md` and `$SHIPFLOW_ROOT/skills/app-blueprints/README.md`. Blueprints are global spec skeletons that pre-fill architecture, stack, models, and routes for recurring app archetypes. `001-sf-build` loads them at the Blueprint Gate (after chantier check, before spec). If no blueprint matches, the normal spec-first workflow runs unchanged. Available blueprints are indexed in `$SHIPFLOW_ROOT/skills/app-blueprints/README.md`.

## Mode Detection

Parse `$ARGUMENTS` and choose the smallest safe mode as defined by `decision-quality-contract`: bounded and professional, never shortcut quality. When the question is about doctrine or tradeoffs, answer through the `Structure Replacement Doctrine` rather than treating novelty, tooling, or extra process as value by default.

- If the user asks a direct help question, answer concisely from the top-level route and `references/help-catalog.md` as needed.
- If the user asks for skill codes, numeric prefixes, or shortcut lookup, load `skill-code-index.md` and answer from the code table without renaming canonical skills.
- If the user needs full skill taxonomy, workflow cheat sheets, or quick answers, load `references/help-catalog.md`.
- Use `$SHIPFLOW_ROOT/skills/references/chantier-tracking.md` for canonical trace/process role doctrine instead of maintaining a duplicate role matrix here.
- For `Skills at a Glance`, `Quick Answers`, workflow cycles, audit scoring, and file-reference help, load `references/help-catalog.md`.

## Core Execution Rules

- Do not write chantier specs or trackers.
- Keep answers user-facing and in the active user language.
- Route to an owner skill when the user asks ShipFlow to do work rather than explain it.

## Stop Conditions

Stop and report blocked when:

- A required reference is missing or contradicts this activation contract.
- The requested work would change behavior outside this skill's scope.
- A safety, security, documentation, source-faithfulness, or chantier guardrail would need to be weakened.
- The action would edit unrelated dirty files or mutate durable state without an owner-skill contract.

## Validation

Validate this skill after edits with:

- `rg -n "Trace category|Process role|Chantier Registry|Skills at a Glance|Quick Answers|references/" skills/302-sf-help/SKILL.md`
- `python3 tools/skill_budget_audit.py --skills-root skills --format markdown`
- `tools/shipflow_sync_skills.sh --check --all`
