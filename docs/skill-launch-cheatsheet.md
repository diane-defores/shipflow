---
artifact: documentation
metadata_schema_version: "1.0"
artifact_version: "1.4.2"
project: ShipFlow
created: "2026-05-04"
updated: "2026-06-10"
status: reviewed
source_skill: 300-sf-docs
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
  - "009-sf-skill-build routes fuzzy skill ideas through 700-sf-explore before 100-sf-spec."
  - "007-sf-content added as the master content lifecycle entrypoint."
  - "000-shipflow <instruction> documented as the primary non-technical router with direct handoff to selected skills."
  - "Shared question/default contract added for numbered decisions and context-safe defaults."
  - "006-sf-design added as the master design lifecycle entrypoint for UI/UX, tokens, playgrounds, implementation, proof, and ship routing."
  - "008-sf-onboarding added as the user activation lifecycle for first-success paths, setup guidance, recoverable states, and proof routing."
  - "600-sf-local-cloud-sync added as the local-to-cloud data promotion, merge, sync UX, and security contract entrypoint."
  - "003-sf-bug clarified as a lifecycle executor that continues through owner skills and bounded subagents when safe."
  - "Skill taxonomy description audit clarified runtime families while keeping public skill names and invocation paths stable."
  - "602-sf-platform-parity added as the platform parity/concordance audit and routing skill."
next_step: "/300-sf-docs audit docs/skill-launch-cheatsheet.md"
---

# Skill Launch Cheatsheet

Use this page when you need to choose which ShipFlow skill to launch and which mode argument changes the workflow.

## Default Rule

Start with `000-shipflow <instruction>` when you want a non-technical first command. It answers pure conversational requests directly and routes real work to the right master or specialist skill. It uses a default only when the route is clear, low-risk, context-compatible, and verifiable.

Start with `001-sf-build` directly when you already know the request is a feature, code, site, or docs workstream that needs the build lifecycle.

Use a focused skill directly when you intentionally want one owner lane: checks, docs, browser proof, auth diagnosis, manual QA, production truth, audit, dependency posture, migration, or final ship.

## Numeric Skill Codes

ShipFlow also maintains a numeric lookup for faster skill discovery without renaming skills. The canonical index is `skills/references/skill-code-index.md`.

Accepted lookup forms include `01`, `01-001-sf-build`, `01sfbuild`, and `01 001-sf-build`; all resolve through `000-shipflow` to the canonical skill name. The display label is only an index label, not a new runtime skill name.

Core codes:

| Code | Skill |
| --- | --- |
| `00` | `000-shipflow` |
| `01` | `001-sf-build` |
| `02` | `002-sf-maintain` |
| `03` | `003-sf-bug` |
| `04` | `004-sf-deploy` |
| `05` | `005-sf-ship` |
| `06` | `006-sf-design` |
| `07` | `007-sf-content` |
| `08` | `008-sf-onboarding` |
| `09` | `009-sf-skill-build` |

Family bands: `10` lifecycle/proof, `20` content/research/copy, `30` docs/context/support, `40` audit/quality/ops, `50` design/components, `60` data/activation, `70` pilotage/session, `80` conversation/transcript.

## Current Runtime Families

Public categories make the catalog easier to browse. Runtime families explain how ShipFlow routes work internally.

| Family | Role | Examples |
| --- | --- | --- |
| Lifecycle/master | Carry work across several gates. | `000-shipflow`, `001-sf-build`, `002-sf-maintain`, `004-sf-deploy`, `006-sf-design`, `007-sf-content`, `008-sf-onboarding`, `009-sf-skill-build`, plus `100-sf-spec -> 101-sf-ready -> 102-sf-start -> 103-sf-verify -> 104-sf-end -> 005-sf-ship` |
| Data trust/source | Frame local-first data becoming account-backed cloud data and product access becoming entitlement-backed. | `600-sf-local-cloud-sync`, `601-sf-product-entitlements` |
| Audit/source | Expose quality, security, performance, SEO, copy, design, dependency, parity, or GTM risk that may deserve a chantier. | `400-sf-audit*`, `402-sf-deps`, `403-sf-perf`, `602-sf-platform-parity` |
| Bug/proof | Diagnose failures, validate behavior, or confirm deployment truth. | `003-sf-bug`, `106-sf-fix`, `107-sf-test`, `108-sf-browser`, `109-sf-auth-debug`, `405-sf-prod`, `105-sf-check`, `404-sf-migrate` |
| Content/docs/support | Keep public content, documentation, scaffolding, changelogs, skill contracts, and governance surfaces coherent with shipped behavior. | `300-sf-docs`, `200-sf-redact`, `201-sf-enrich`, `202-sf-repurpose`, `304-sf-changelog`, `306-sf-scaffold`, `307-sf-skills-refresh`, `305-sf-init` |
| Research/pilotage/helper | Clarify information, prioritize, summarize, route, or preserve context without owning full lifecycle closure. | `203-sf-research`, `204-sf-market-study`, `205-sf-veille`, `701-sf-backlog`, `702-sf-priorities`, `703-sf-review`, `309-sf-tasks`, `301-sf-context`, `704-sf-model`, `302-sf-help`, `308-sf-status`, `303-sf-resume`, `700-sf-explore`, `707-name` |

## Master Skills

| Need | Launch | Useful modes |
| --- | --- | --- |
| Non-technical first command | `000-shipflow <instruction>` | Routes pure conversation directly; routes feature/code/docs to `001-sf-build`, maintenance to `002-sf-maintain`, bugs to `003-sf-bug`, release/deploy/prod proof to `004-sf-deploy`, content to `007-sf-content`, design to `006-sf-design`, onboarding to `008-sf-onboarding`, local-to-cloud sync to `600-sf-local-cloud-sync`, skill maintenance to `009-sf-skill-build`, and obvious specialist audits to `400-sf-audit-*`. Uses context-safe defaults and asks one numbered question when ambiguity changes route, risk, scope, or proof. |
| Non-trivial product, code, site, or docs work | `001-sf-build [spark|codex|mini|agents|sous-agent|no-agents] <story, bug, or goal>` | Plain task text is the story. Use `spark`, `codex`, `mini`, `agents`, or `sous-agent` to make model-specific delegated sequential execution a validation gate. For user-facing features, `001-sf-build` evaluates whether to suggest or route `/008-sf-onboarding` after implementation. Use detailed report modes only for handoff evidence. |
| Recurring project upkeep | `002-sf-maintain [mode]` | `full`/no argument, `quick`, `security`, `deps`, `docs`, `audits`, `no-ship`, `global`. |
| Release confidence after implementation | `004-sf-deploy [target or mode]` | no argument, `skip-check`, `--preview`, `--prod`, `no-changelog`. |
| Bug-loop lifecycle | `003-sf-bug [BUG-ID, summary, or mode]` | no argument, `BUG-ID`, `--fix`, `--retest`, `--verify`, `--ship`, `--close`. |
| Content management | `007-sf-content [goal, source, file, or mode]` | `plan`, `repurpose`, `draft`, `enrich`, `audit`, `seo`, `editorial`, `apply`, `ship`; add `score`, `quality gate`, or `grille projet` when you want project-aware scoring through the shared rubric. |
| Conversation quality audit | `705-sf-conversation-audit [latest|path <file-or-dir>|export shipflow|report=agent]` | Audit recurring operator-facing defects in conversation transcripts and route durable owner actions. |
| Design lifecycle | `006-sf-design <design question or goal>` | `tokens`, `audit`, `playground`, page/route targets, redesign goals, token migration, visual proof, or natural-language design requests. |
| User onboarding and activation | `008-sf-onboarding <feature, flow, or audit target>` | First-success paths, setup order, why/how guidance, recoverable states, docs impact, and proof routing. |
| Local-to-cloud data sync | `600-sf-local-cloud-sync <project, feature, or data domains>` | Local data promotion, cloud hydration, merge/conflict policy, sync/save UX states, sensitive-data exclusions, and proof routing. |
| Product entitlements and access gates | `601-sf-product-entitlements <project or feature>` | Entitlement ownership, provider events, activation codes, product-local mirrors, backend authorization gates, support flows, and sync handoffs. |
| Skill creation or maintenance | `009-sf-skill-build <idea or path>` | new skill idea, existing skill path, optional `700-sf-explore` for fuzzy placement, public page/docs/runtime validation gates. |

Content scoring examples:

```text
/007-sf-content audit article avec grille projet
/200-sf-redact finalise puis note ce brouillon
/202-sf-repurpose transforme cette source en article et applique la grille qualite
/103-sf-verify verifier le gate de score editorial
```

## Supporting Skills

| Need | Launch | Useful modes |
| --- | --- | --- |
| Manual expert lifecycle | `100-sf-spec -> 101-sf-ready -> 102-sf-start -> 103-sf-verify -> 104-sf-end` | Use when you intentionally want to drive each gate instead of using `001-sf-build`. |
| Commit and push ready work | `005-sf-ship [mode]` | no special argument, `skip-check`, `end la tache`/`end`/`fin`/`close task`, `all-dirty`/`ship-all`/`tout-dirty`. |
| Browser proof | `108-sf-browser` | Target a non-auth URL, route, preview, or production page. |
| Auth or session diagnosis | `109-sf-auth-debug` | Target login, OAuth, cookies, callbacks, tenants, providers, sessions, or protected routes. |
| Manual QA or retest evidence | `107-sf-test` | Target a guided scenario, checklist-first manual proof, test log, retest, or bug file update. |
| Deployment truth | `405-sf-prod` | Target deployment URL, build logs, runtime logs, preview/prod health, or live readiness. |
| Technical checks | `105-sf-check` | Target typecheck, lint, build, tests, dependency checks, or shell validation. |
| Documentation work | `300-sf-docs [mode or target]` | `readme`, `api`, `components`, `audit`, `update`, `metadata`, `technical`, `editorial`, or a file path. |
| Audit lane | `400-sf-audit*` | Choose the audit owner: code, design, copy, SEO, GTM, deps, perf, a11y, translation, components, or design tokens. |
| Platform parity/concordance | `602-sf-platform-parity <project, feature, or spec path>` | Check product and technical parity across web, Android, iOS, Windows, macOS, and Linux; route gaps to `100-sf-spec`, `001-sf-build`, `107-sf-test`, `103-sf-verify`, `300-sf-docs`, or `005-sf-ship`. |
| Conversation quality lane | `705-sf-conversation-audit` | Classify recurring conversation execution defects and route concrete owner follow-up paths. |
| Design system creation | `500-sf-design-from-scratch [target or mode]` | Use when no coherent professional token system exists; modes include `tokens-only` and `with-playground`. |
| Dependency posture | `402-sf-deps` | Target dependency drift, vulnerabilities, licenses, or config. |
| Framework migration | `404-sf-migrate [package[@version]]` | Use a structured package target such as `astro@5`, a package name, or no argument for discovery. |
| Orientation and routing | `308-sf-status`, `302-sf-help`, `704-sf-model`, `303-sf-resume` | Use for git dashboard, workflow help, model choice, or concise context transfer. |

Model routing note: `704-sf-model` recommends the right model for the current scope. In Codex/OpenAI, default small bounded subagents to `gpt-5.4-mini`, use `gpt-5.3-codex-spark` for Spark-eligible summaries, text-only handoffs, micro-code, or targeted UI/local edits when credits/availability permit, route long implementation through the `codex` implementation profile, and use `gpt-5.5` with calibrated `low`/`medium`/`high`/`xhigh` reasoning for high-risk transverse reasoning. The main thread may only recommend a model switch unless the runtime supports applying the override; `spark`, `codex`, `sous-agent`/`subagent`/`agents`, and `mini` arguments request model-specific subagent delegation.

## Explicit Mode Switches

| Skill | Explicit modes currently documented |
| --- | --- |
| `000-shipflow` | `<instruction>`; pure conversation direct answer; direct main-thread handoff to selected `sf-*` skill; one numbered clarification question when ambiguous |
| `001-sf-build` | `<story, bug, or goal>`; `spark`; `codex`; `mini`; `agents`; `sous-agent`; `no-agents`; `report=agent`; `handoff`; `verbose`; `full-report` |
| `002-sf-maintain` | no argument/`full`; `quick`; `security`; `deps`; `docs`; `audits`; `no-ship`; `global`; detailed report modes |
| `004-sf-deploy` | no argument; `skip-check`; `--preview`; `--prod`; `no-changelog` |
| `003-sf-bug` | no argument; `BUG-ID`; free-text summary; `--fix`; `--retest`; `--verify`; `--ship`; `--close` |
| `007-sf-content` | no argument or content goal; `plan`; `repurpose`; `draft`; `article`; `blog`; `guide`; `enrich`; `audit`; `copy`; `copywriting`; `seo`; `editorial`; `apply`; `publish`; `ship`; `score`; `quality gate`; `grille projet` |
| `006-sf-design` | design question; page/route; `tokens`; `audit`; `playground`; redesign goal; token migration; visual proof; detailed report modes |
| `008-sf-onboarding` | feature, flow, shipped change, onboarding audit target; permission/setup focus; detailed report modes |
| `600-sf-local-cloud-sync` | project, feature, data domains, sync question; audit; Flutter focus; secrets/sensitive-data focus; detailed report modes |
| `009-sf-skill-build` | new skill idea; existing skill path; `700-sf-explore` reroute when placement or public promise is too fuzzy |
| `705-sf-conversation-audit` | `latest`; `path <file-or-dir>`; `export shipflow`; `report=agent` |
| `602-sf-platform-parity` | project, feature, or spec path; `platforms=web,android,ios,windows,macos,linux`; `report=agent` |
| `500-sf-design-from-scratch` | no argument; target page/path; `tokens-only`; `with-playground`; detailed report modes |
| `005-sf-ship` | no special argument; `skip-check`; `end la tache`; `end`; `fin`; `close task`; `all-dirty`; `ship-all`; `tout-dirty` |
| `407-sf-audit-translate` | no special argument; file path or scope; `global`; `sync`; `apply`; `sync [path]`; `apply [path]` |

## How To Read Arguments

An argument can be one of three things:

| Argument type | Meaning | Example |
| --- | --- | --- |
| Mode keyword | A word or flag switches the workflow. | `002-sf-maintain quick`, `004-sf-deploy skip-check`, `005-sf-ship all-dirty` |
| Structured input | The shape of the argument selects a target. | `404-sf-migrate astro@5`, `003-sf-bug BUG-2026-05-03-001` |
| Free-form task | The argument is the actual work description. | `001-sf-build add a markdown skill cheatsheet` |

When in doubt, read the skill's `argument-hint` and mode-detection section. If no mode rule matches, treat the argument as a task or target description.

## Shell Shortcuts

| Shortcut | Expands to | Use |
| --- | --- | --- |
| `ch` | `clear; tmux clear-history` | Clear the current shell screen and the current tmux pane scrollback. |
