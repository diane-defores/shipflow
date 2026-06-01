---
artifact: documentation
metadata_schema_version: "1.0"
artifact_version: "1.4.1"
project: ShipFlow
created: "2026-05-04"
updated: "2026-05-29"
status: reviewed
source_skill: sf-docs
scope: skill-launch-cheatsheet
owner: unknown
confidence: high
risk_level: low
security_impact: none
docs_impact: yes
linked_systems:
  - skills/
  - site/src/pages/skill-modes.astro
  - site/src/content/skills/
  - README.md
  - shipflow-spec-driven-workflow.md
  - shipflow_data/editorial/content-map.md
depends_on:
  - artifact: "shipflow-spec-driven-workflow.md"
    artifact_version: "0.17.0"
    required_status: draft
supersedes: []
evidence:
  - "Master skill contracts and public skill pages."
  - "Public launch cheatsheet in site/src/pages/skill-modes.astro."
  - "sf-skill-build routes fuzzy skill ideas through sf-explore before sf-spec."
  - "sf-content added as the master content lifecycle entrypoint."
  - "shipflow <instruction> documented as the primary non-technical router with direct handoff to selected skills."
  - "Shared question/default contract added for numbered decisions and context-safe defaults."
  - "sf-design added as the master design lifecycle entrypoint for UI/UX, tokens, playgrounds, implementation, proof, and ship routing."
  - "sf-onboarding added as the user activation lifecycle for first-success paths, setup guidance, recoverable states, and proof routing."
  - "sf-local-cloud-sync added as the local-to-cloud data promotion, merge, sync UX, and security contract entrypoint."
  - "sf-bug clarified as a lifecycle executor that continues through owner skills and bounded subagents when safe."
  - "Skill taxonomy description audit clarified runtime families while keeping public skill names and invocation paths stable."
next_step: "/sf-docs audit docs/skill-launch-cheatsheet.md"
---

# Skill Launch Cheatsheet

Use this page when you need to choose which ShipFlow skill to launch and which mode argument changes the workflow.

## Default Rule

Start with `shipflow <instruction>` when you want a non-technical first command. It answers pure conversational requests directly and routes real work to the right master or specialist skill. It uses a default only when the route is clear, low-risk, context-compatible, and verifiable.

Start with `sf-build` directly when you already know the request is a feature, code, site, or docs workstream that needs the build lifecycle.

Use a focused skill directly when you intentionally want one owner lane: checks, docs, browser proof, auth diagnosis, manual QA, production truth, audit, dependency posture, migration, or final ship.

## Current Runtime Families

Public categories make the catalog easier to browse. Runtime families explain how ShipFlow routes work internally.

| Family | Role | Examples |
| --- | --- | --- |
| Lifecycle/master | Carry work across several gates. | `shipflow`, `sf-build`, `sf-maintain`, `sf-deploy`, `sf-design`, `sf-content`, `sf-onboarding`, `sf-skill-build`, plus `sf-spec -> sf-ready -> sf-start -> sf-verify -> sf-end -> sf-ship` |
| Data trust/source | Frame local-first data becoming account-backed cloud data. | `sf-local-cloud-sync` |
| Audit/source | Expose quality, security, performance, SEO, copy, design, dependency, or GTM risk that may deserve a chantier. | `sf-audit*`, `sf-deps`, `sf-perf` |
| Bug/proof | Diagnose failures, validate behavior, or confirm deployment truth. | `sf-bug`, `sf-fix`, `sf-test`, `sf-browser`, `sf-auth-debug`, `sf-prod`, `sf-check`, `sf-migrate` |
| Content/docs/support | Keep public content, documentation, scaffolding, changelogs, skill contracts, and governance surfaces coherent with shipped behavior. | `sf-docs`, `sf-redact`, `sf-enrich`, `sf-repurpose`, `sf-changelog`, `sf-scaffold`, `sf-skills-refresh`, `sf-init` |
| Research/pilotage/helper | Clarify information, prioritize, summarize, route, or preserve context without owning full lifecycle closure. | `sf-research`, `sf-market-study`, `sf-veille`, `sf-backlog`, `sf-priorities`, `sf-review`, `sf-tasks`, `sf-context`, `sf-model`, `sf-help`, `sf-status`, `sf-resume`, `sf-explore`, `name` |

## Master Skills

| Need | Launch | Useful modes |
| --- | --- | --- |
| Non-technical first command | `shipflow <instruction>` | Routes pure conversation directly; routes feature/code/docs to `sf-build`, maintenance to `sf-maintain`, bugs to `sf-bug`, release/deploy/prod proof to `sf-deploy`, content to `sf-content`, design to `sf-design`, onboarding to `sf-onboarding`, local-to-cloud sync to `sf-local-cloud-sync`, skill maintenance to `sf-skill-build`, and obvious specialist audits to `sf-audit-*`. Uses context-safe defaults and asks one numbered question when ambiguity changes route, risk, scope, or proof. |
| Non-trivial product, code, site, or docs work | `sf-build [agents|no-agents] <story, bug, or goal>` | Plain task text is the story. Use `agents` to make delegated sequential execution a validation gate. For user-facing features, `sf-build` evaluates whether to suggest or route `/sf-onboarding` after implementation. Use detailed report modes only for handoff evidence. |
| Recurring project upkeep | `sf-maintain [mode]` | `full`/no argument, `quick`, `security`, `deps`, `docs`, `audits`, `no-ship`, `global`. |
| Release confidence after implementation | `sf-deploy [target or mode]` | no argument, `skip-check`, `--preview`, `--prod`, `no-changelog`. |
| Bug-loop lifecycle | `sf-bug [BUG-ID, summary, or mode]` | no argument, `BUG-ID`, `--fix`, `--retest`, `--verify`, `--ship`, `--close`. |
| Content management | `sf-content [goal, source, file, or mode]` | `plan`, `repurpose`, `draft`, `enrich`, `audit`, `seo`, `editorial`, `apply`, `ship`. |
| Conversation quality audit | `sf-conversation-audit [latest|path <file-or-dir>|export shipflow|report=agent]` | Audit recurring operator-facing defects in conversation transcripts and route durable owner actions. |
| Design lifecycle | `sf-design <design question or goal>` | `tokens`, `audit`, `playground`, page/route targets, redesign goals, token migration, visual proof, or natural-language design requests. |
| User onboarding and activation | `sf-onboarding <feature, flow, or audit target>` | First-success paths, setup order, why/how guidance, recoverable states, docs impact, and proof routing. |
| Local-to-cloud data sync | `sf-local-cloud-sync <project, feature, or data domains>` | Local data promotion, cloud hydration, merge/conflict policy, sync/save UX states, sensitive-data exclusions, and proof routing. |
| Skill creation or maintenance | `sf-skill-build <idea or path>` | new skill idea, existing skill path, optional `sf-explore` for fuzzy placement, public page/docs/runtime validation gates. |

## Supporting Skills

| Need | Launch | Useful modes |
| --- | --- | --- |
| Manual expert lifecycle | `sf-spec -> sf-ready -> sf-start -> sf-verify -> sf-end` | Use when you intentionally want to drive each gate instead of using `sf-build`. |
| Commit and push ready work | `sf-ship [mode]` | no special argument, `skip-check`, `end la tache`/`end`/`fin`/`close task`, `all-dirty`/`ship-all`/`tout-dirty`. |
| Browser proof | `sf-browser` | Target a non-auth URL, route, preview, or production page. |
| Auth or session diagnosis | `sf-auth-debug` | Target login, OAuth, cookies, callbacks, tenants, providers, sessions, or protected routes. |
| Manual QA or retest evidence | `sf-test` | Target a guided scenario, checklist-first manual proof, test log, retest, or bug file update. |
| Deployment truth | `sf-prod` | Target deployment URL, build logs, runtime logs, preview/prod health, or live readiness. |
| Technical checks | `sf-check` | Target typecheck, lint, build, tests, dependency checks, or shell validation. |
| Documentation work | `sf-docs [mode or target]` | `readme`, `api`, `components`, `audit`, `update`, `metadata`, `technical`, `editorial`, or a file path. |
| Audit lane | `sf-audit*` | Choose the audit owner: code, design, copy, SEO, GTM, deps, perf, a11y, translation, components, or design tokens. |
| Conversation quality lane | `sf-conversation-audit` | Classify recurring conversation execution defects and route concrete owner follow-up paths. |
| Design system creation | `sf-design-from-scratch [target or mode]` | Use when no coherent professional token system exists; modes include `tokens-only` and `with-playground`. |
| Dependency posture | `sf-deps` | Target dependency drift, vulnerabilities, licenses, or config. |
| Framework migration | `sf-migrate [package[@version]]` | Use a structured package target such as `astro@5`, a package name, or no argument for discovery. |
| Orientation and routing | `sf-status`, `sf-help`, `sf-model`, `sf-resume` | Use for git dashboard, workflow help, model choice, or concise context transfer. |

Model routing note: `sf-model` recommends the right model for the current scope. In Codex/OpenAI, default small bounded subagents to `gpt-5.4-mini`, micro-code or targeted UI/local edits to `gpt-5.3-codex-spark`, long implementation to `gpt-5.3-codex`, and high-risk transverse reasoning to `gpt-5.5`. The main thread may only recommend a model switch unless the runtime supports applying the override; subagent missions should name the selected model when overrides are available.

## Explicit Mode Switches

| Skill | Explicit modes currently documented |
| --- | --- |
| `shipflow` | `<instruction>`; pure conversation direct answer; direct main-thread handoff to selected `sf-*` skill; one numbered clarification question when ambiguous |
| `sf-build` | `<story, bug, or goal>`; `agents`; `no-agents`; `report=agent`; `handoff`; `verbose`; `full-report` |
| `sf-maintain` | no argument/`full`; `quick`; `security`; `deps`; `docs`; `audits`; `no-ship`; `global`; detailed report modes |
| `sf-deploy` | no argument; `skip-check`; `--preview`; `--prod`; `no-changelog` |
| `sf-bug` | no argument; `BUG-ID`; free-text summary; `--fix`; `--retest`; `--verify`; `--ship`; `--close` |
| `sf-content` | no argument or content goal; `plan`; `repurpose`; `draft`; `article`; `blog`; `guide`; `enrich`; `audit`; `copy`; `copywriting`; `seo`; `editorial`; `apply`; `publish`; `ship` |
| `sf-design` | design question; page/route; `tokens`; `audit`; `playground`; redesign goal; token migration; visual proof; detailed report modes |
| `sf-onboarding` | feature, flow, shipped change, onboarding audit target; permission/setup focus; detailed report modes |
| `sf-local-cloud-sync` | project, feature, data domains, sync question; audit; Flutter focus; secrets/sensitive-data focus; detailed report modes |
| `sf-skill-build` | new skill idea; existing skill path; `sf-explore` reroute when placement or public promise is too fuzzy |
| `sf-conversation-audit` | `latest`; `path <file-or-dir>`; `export shipflow`; `report=agent` |
| `sf-design-from-scratch` | no argument; target page/path; `tokens-only`; `with-playground`; detailed report modes |
| `sf-ship` | no special argument; `skip-check`; `end la tache`; `end`; `fin`; `close task`; `all-dirty`; `ship-all`; `tout-dirty` |
| `sf-audit-translate` | no special argument; file path or scope; `global`; `sync`; `apply`; `sync [path]`; `apply [path]` |

## How To Read Arguments

An argument can be one of three things:

| Argument type | Meaning | Example |
| --- | --- | --- |
| Mode keyword | A word or flag switches the workflow. | `sf-maintain quick`, `sf-deploy skip-check`, `sf-ship all-dirty` |
| Structured input | The shape of the argument selects a target. | `sf-migrate astro@5`, `sf-bug BUG-2026-05-03-001` |
| Free-form task | The argument is the actual work description. | `sf-build add a markdown skill cheatsheet` |

When in doubt, read the skill's `argument-hint` and mode-detection section. If no mode rule matches, treat the argument as a task or target description.

## Shell Shortcuts

| Shortcut | Expands to | Use |
| --- | --- | --- |
| `ch` | `clear; tmux clear-history` | Clear the current shell screen and the current tmux pane scrollback. |
