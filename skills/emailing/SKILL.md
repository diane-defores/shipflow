---
name: emailing
description: "Plan, draft, route, and audit audience email sequences."
argument-hint: [sequence brief | audience brief | draft | audit]
---

Primary artifact type: `master-workflow`.

## Canonical Paths

Before resolving any ShipFlow-owned file, load `$SHIPFLOW_ROOT/skills/references/canonical-paths.md` (`$SHIPFLOW_ROOT` defaults to `$HOME/shipflow`). ShipFlow-owned tools, shared references, skill-local references, templates, workflow docs, and internal scripts must resolve from `$SHIPFLOW_ROOT`.

## Report Modes

Before producing the final report, load `$SHIPFLOW_ROOT/skills/references/reporting-contract.md`.

Default to `report=user`: concise, sequence-first, and in the user's active language. Use `report=agent` only when the user explicitly asks for a detailed handoff, routing evidence, or a fuller audit matrix.

## Mission

`emailing` owns audience email sequences: planning, drafting, reviewing, and routing sequence work with clear audience, cadence, CTA, and claim consequences.

## Contract References

- `shipflow_data/business/business.md`
- `shipflow_data/business/product.md`
- `shipflow_data/business/branding.md`
- `shipflow_data/business/gtm.md`
- `shipflow_data/editorial/content-map.md`

## Scope

- In: multi-step email sequences, nurture tracks, launches, follow-ups, subject lines, preview text, CTA mapping, segment-aware messaging, and sequence audits.
- Out: one-to-one personal mail by default, inbox support replies, spam/evading tactics, sending infrastructure, and unsupported claims.

## Routing

- Use `700-sf-explore` when the audience, goal, or sequence angle is still fuzzy.
- Use `100-sf-spec` when sequence work needs a durable contract before implementation.
- Route upstream content/source work to `007-sf-content`, `200-sf-redact`, or `202-sf-repurpose` when the brief is not yet sequence-ready.
- Route tone, clarity, conversion, and persuasion checks to `206-sf-audit-copy` or `207-sf-audit-copywriting` when review is the main ask.

## Core Rules

- Default to audience-sequence framing, not one-to-one correspondence.
- Ask for audience, goal, and desired action when they are missing.
- Keep the sequence structure visible: trigger, audience, objective, cadence, CTA, stop rule.
- Preserve governed business, product, brand, and GTM claims; do not invent proof, urgency, or conversion data.
- Use the editorial content map when a sequence is actually a public content, landing-page, FAQ, or repurposing request.
- Surface opt-out, consent, and compliance consequences when relevant.

## Stop Conditions

- The request is actually personal mail unless the user asks to adapt it into a sequence.
- The audience or objective is too vague to draft without guessing.
- The sequence would rely on unsupported product or performance claims.
- The request would change public positioning, brand voice, or content surface without first respecting the governed business, branding, GTM, and editorial contracts.

## Validation

Validate this skill after edits with:

```bash
rg -n "emailing|one-to-one|sequence|audience|cadence|CTA|opt-out|claim" skills/emailing/SKILL.md
python3 tools/skill_budget_audit.py --skills-root skills --format markdown
tools/shipflow_sync_skills.sh --check --skill emailing
```
