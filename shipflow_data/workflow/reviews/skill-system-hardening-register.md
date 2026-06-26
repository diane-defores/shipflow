---
artifact: workflow_review
metadata_schema_version: "1.0"
artifact_version: "0.1.0"
project: ShipFlow
created: "2026-06-26"
updated: "2026-06-26"
status: draft
source_skill: 900-shipflow-core
scope: "skill-system-hardening-register"
owner: Diane
confidence: medium
risk_level: medium
security_impact: none
docs_impact: yes
linked_systems:
  - skills/
  - tools/audit_shipflow_skills.py
  - tools/skill_budget_audit.py
  - skills/references/canonical-paths.md
  - skills/references/skill-execution-fidelity.md
  - shipflow_data/workflow/TASKS.md
depends_on:
  - artifact: "skills/references/canonical-paths.md"
    artifact_version: "1.2.0"
    required_status: "active"
  - artifact: "skills/references/skill-execution-fidelity.md"
    artifact_version: "1.2.0"
    required_status: "active"
evidence:
  - "User decision 2026-06-26: generalize preflight and system-improvement hardening across ShipFlow skills instead of treating misses as isolated incidents."
  - "2026-06-26 audit_shipflow_skills.py result: 0 hard, 1 review, 0 style; only 101-sf-ready shows body-size risk."
  - "2026-06-26 skill_budget_audit.py result: 68 skills, 1 separate risk, absolute estimate 8461/8500."
supersedes: []
next_review: "2026-07-03"
next_step: "/009-sf-skill-build audit skill-system-hardening-register batch A"
---

# Skill System Hardening Register

## Purpose

This register tracks the cross-skill hardening sweep requested on 2026-06-26.
The goal is not broad rewrite churn. The goal is to review every ShipFlow skill
against the same execution-fidelity pressure points and only open edits where
the risk is concrete.

## Review Contract

Audit each skill against these five checks:

1. `preflight`: does the skill force a mechanical preflight before fragile
   validation or external tooling?
2. `canonical_paths`: does it resolve ShipFlow-owned tools and references from
   `${SHIPFLOW_ROOT:-$HOME/shipflow}` rather than the project cwd?
3. `system_loop`: does the skill help convert a miss into `problem -> cause ->
   prevention -> contract improvement`, instead of only reporting the symptom?
4. `operator_last_resort`: does the skill avoid pushing proof back to the
   operator when the agent can run it safely?
5. `body_size`: is the activation body compact enough that critical gates stay
   visible under pressure?

## Status Legend

- `todo`: not yet reviewed against this register
- `verify`: a likely good pattern exists and needs a focused mechanical check
- `priority`: known risk already observed or flagged by audit
- `done`: reviewed against this register and no immediate hardening needed

## Current Batch Priorities

| Skill | Why first |
| --- | --- |
| `101-sf-ready` | Only current audit risk: body-size pressure (`~5137` body tokens). |
| `900-shipflow-core` | Internal hardening skill; must set the standard for preflight and system-improvement loops. |
| `108-sf-browser` | Strong existing preflight precedent; useful reference pattern for other tool-using skills. |
| `103-sf-verify` | High leverage because it converts implementation claims into ship/no-ship truth. |
| `102-sf-start` | High leverage because it decides whether the agent proceeds or stops. |

## Batch A Review Snapshot

| Skill | Verdict | Notes |
| --- | --- | --- |
| `900-shipflow-core` | strong baseline | Explicit canonical preflight, explicit system-improvement loop, and explicit stop condition for running ShipFlow-owned audit steps too early. |
| `101-sf-ready` | priority risk remains | Readiness gate is rich but still too large; the body-size risk remains the clearest execution-fidelity pressure point in the current corpus. |
| `102-sf-start` | mostly strong | Strong operator-autonomy and proof-path doctrine, but ShipFlow-owned tool preflight is mostly delegated to references instead of surfaced as a compact local checklist. |
| `103-sf-verify` | mostly strong | Strong owner-routing and verification semantics, but like `102-sf-start`, some preflight behavior depends on references and detailed gate loading. |
| `108-sf-browser` | reference pattern | Best current example of explicit runtime preflight, safe stop behavior, and owner routing before browser proof. |

## Registry

### Routing And Master Skills

| Skill | Family | Status | Current signal | Next action |
| --- | --- | --- | --- | --- |
| `000-shipflow` | routing | todo | Entry router; broad blast radius if contracts drift. | audit |
| `001-sf-build` | master | todo | Master lifecycle orchestration. | audit |
| `002-sf-maintain` | master | todo | Master maintenance orchestration. | audit |
| `003-sf-bug` | master | todo | Bug lifecycle orchestration. | audit |
| `004-sf-deploy` | master | todo | Release/deploy orchestration. | audit |
| `005-sf-ship` | master | todo | Final ship gate and closure path. | audit |
| `006-sf-design` | master | todo | Design lifecycle orchestration. | audit |
| `007-sf-content` | master | todo | Content lifecycle orchestration. | audit |
| `008-sf-onboarding` | master | todo | Onboarding flow orchestration. | audit |
| `009-sf-skill-build` | master | todo | Skill-maintenance master path. | audit |

### Execution Skills

| Skill | Family | Status | Current signal | Next action |
| --- | --- | --- | --- | --- |
| `100-sf-spec` | execution | todo | Spec entrypoint; should stay compact and deterministic. | audit |
| `101-sf-ready` | execution | priority | Rich readiness gate, but still the only active body-size risk from the audit. | compact-or-prove |
| `102-sf-start` | execution | verify | Strong autonomy/proof contract; check whether owned-tool preflight should be surfaced more locally. | decide local preflight wording |
| `103-sf-verify` | execution | verify | Strong owner routing and partial semantics; check whether owned-tool preflight needs a more explicit local anchor. | decide local preflight wording |
| `104-sf-end` | execution | todo | Closure/bookkeeping; check unnecessary operator bounce. | audit |
| `105-sf-check` | execution | todo | Validation runner; likely preflight-sensitive. | audit |
| `106-sf-fix` | execution | todo | Fix path; verify miss-to-system loop expectations. | audit |
| `107-sf-test` | execution | todo | Manual QA routing; verify operator-last-resort discipline. | audit |
| `108-sf-browser` | execution | done | Strong explicit runtime preflight and owner-routing pattern; use as a reference skill for future hardening. | none |
| `109-sf-auth-debug` | execution | todo | Auth proof path; likely sensitive to preflight and operator-last-resort. | audit |

### Content And Research Skills

| Skill | Family | Status | Current signal | Next action |
| --- | --- | --- | --- | --- |
| `200-sf-redact` | content | todo | Content drafting helper. | audit |
| `201-sf-enrich` | content | todo | Content enrichment helper. | audit |
| `202-sf-repurpose` | content | todo | Content transform helper. | audit |
| `203-sf-research` | content | todo | Research workflow; verify source/tool preflights. | audit |
| `204-sf-market-study` | content | todo | Market-study workflow. | audit |
| `205-sf-veille` | content | todo | Veille intake; verify canonical-path and governance loops. | audit |
| `206-sf-audit-copy` | content | todo | Copy audit helper. | audit |
| `207-sf-audit-copywriting` | content | todo | Copywriting audit helper. | audit |

### Docs And Ops Skills

| Skill | Family | Status | Current signal | Next action |
| --- | --- | --- | --- | --- |
| `300-sf-docs` | docs-ops | todo | Doc governance owner; canonical-path discipline is critical. | audit |
| `301-sf-context` | docs-ops | todo | Context loader; check preflight assumptions. | audit |
| `302-sf-help` | docs-ops | todo | Help router; verify no unsupported public claims. | audit |
| `303-sf-resume` | docs-ops | todo | Resume helper; check operator-last-resort phrasing. | audit |
| `304-sf-changelog` | docs-ops | todo | Change summarizer. | audit |
| `305-sf-init` | docs-ops | todo | Bootstrap helper; preflight discipline is important. | audit |
| `306-sf-scaffold` | docs-ops | todo | Scaffold helper; verify deterministic setup and stop conditions. | audit |
| `307-sf-skills-refresh` | docs-ops | todo | Skill-refresh helper; likely central to future hardening batches. | audit |
| `308-sf-status` | docs-ops | todo | Status reporter; check system-improvement output quality. | audit |
| `309-sf-tasks` | docs-ops | todo | Task tracker updater. | audit |
| `310-sf-github-hygiene` | docs-ops | todo | GitHub hygiene workflow; verify proof routing and operator-last-resort. | audit |

### Audit Skills

| Skill | Family | Status | Current signal | Next action |
| --- | --- | --- | --- | --- |
| `400-sf-audit` | audit | todo | Master audit entrypoint. | audit |
| `401-sf-audit-code` | audit | todo | Code audit helper. | audit |
| `402-sf-deps` | audit | todo | Dependency audit helper. | audit |
| `403-sf-perf` | audit | todo | Performance audit helper. | audit |
| `404-sf-migrate` | audit | todo | Migration audit/planning helper. | audit |
| `405-sf-prod` | audit | todo | Production proof/discovery path; high operator-last-resort sensitivity. | audit |
| `406-sf-audit-seo` | audit | todo | SEO audit helper. | audit |
| `407-sf-audit-translate` | audit | todo | Translation audit helper. | audit |
| `408-sf-audit-gtm` | audit | todo | GTM audit helper. | audit |
| `409-sf-audit-a11y` | audit | todo | Accessibility audit helper. | audit |

### Design Skills

| Skill | Family | Status | Current signal | Next action |
| --- | --- | --- | --- | --- |
| `500-sf-design-from-scratch` | design | todo | Design-system creation path. | audit |
| `501-sf-design-playground` | design | todo | Design playground scaffold. | audit |
| `502-sf-audit-design` | design | todo | Design audit helper. | audit |
| `503-sf-audit-design-tokens` | design | todo | Token audit helper; likely good place for mechanical preflights. | audit |
| `504-sf-audit-components` | design | todo | Component audit helper. | audit |

### Platform Skills

| Skill | Family | Status | Current signal | Next action |
| --- | --- | --- | --- | --- |
| `600-sf-local-cloud-sync` | platform | todo | Local/cloud sync design path. | audit |
| `601-sf-product-entitlements` | platform | todo | Entitlements design path. | audit |
| `602-sf-platform-parity` | platform | todo | Cross-platform parity audit path. | audit |

### Meta Skills

| Skill | Family | Status | Current signal | Next action |
| --- | --- | --- | --- | --- |
| `700-sf-explore` | meta | todo | Exploration workflow; verify system-improvement output discipline. | audit |
| `701-sf-backlog` | meta | todo | Backlog triage helper. | audit |
| `702-sf-priorities` | meta | todo | Prioritization helper. | audit |
| `703-sf-review` | meta | todo | Review helper; findings-first contract matters. | audit |
| `704-sf-model` | meta | todo | Model-routing helper. | audit |
| `705-sf-conversation-audit` | meta | todo | Conversation audit helper; strong candidate for system-loop patterns. | audit |
| `706-continue` | meta | todo | Resume/continue helper. | audit |
| `707-name` | meta | todo | Minimal helper; low risk but still part of corpus. | audit |

### Transcript Skills

| Skill | Family | Status | Current signal | Next action |
| --- | --- | --- | --- | --- |
| `800-tmux-capture-conversation` | transcript | todo | Capture helper; verify canonical output paths. | audit |
| `801-clean-conversation-transcript` | transcript | todo | Cleanup helper; verify deterministic output and stop rules. | audit |

### Internal Operator Skill

| Skill | Family | Status | Current signal | Next action |
| --- | --- | --- | --- | --- |
| `900-shipflow-core` | internal | done | Explicit ShipFlow-owned tool preflight and reusable system-improvement output are now local and visible. | none |

## Batch Plan

| Batch | Scope | Target outcome |
| --- | --- | --- |
| A | `900`, `101`, `102`, `103`, `108` | Validate the baseline pattern and the known body-size risk. |
| B | `000`-`009`, `104`-`109` | Cover the highest-leverage routing, execution, and operator-proof skills. |
| C | `300`-`310`, `400`-`409` | Cover documentation, audits, production proof, and system reporting paths. |
| D | `200`-`207`, `500`-`707`, `800`-`801` | Finish helper, design, content, meta, and transcript surfaces. |

## Update Rule

When a skill is reviewed, update its row with:

- `status`
- one short `current signal`
- one concrete `next action` or `none`

Do not rewrite the register into essay form. Keep it as the operational sweep
tracker for this hardening campaign.
