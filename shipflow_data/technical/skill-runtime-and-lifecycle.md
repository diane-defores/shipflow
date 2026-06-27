---
artifact: technical_module_context
metadata_schema_version: "1.0"
artifact_version: "1.20.0"
project: ShipFlow
created: "2026-05-01"
updated: "2026-06-12"
status: reviewed
source_skill: 102-sf-start
scope: skill-runtime-and-lifecycle
owner: Diane
confidence: high
risk_level: high
security_impact: yes
docs_impact: yes
linked_systems:
  - skills/
  - skills/references/
  - skills/references/skill-instruction-layering.md
  - skills/references/skill-context-budget.md
  - skills/000-shipflow/SKILL.md
  - skills/references/entrypoint-routing.md
  - skills/001-sf-build/SKILL.md
  - skills/004-sf-deploy/SKILL.md
  - skills/002-sf-maintain/SKILL.md
  - skills/007-sf-content/SKILL.md
  - skills/006-sf-design/SKILL.md
  - skills/008-sf-onboarding/SKILL.md
  - skills/600-sf-local-cloud-sync/SKILL.md
  - skills/009-sf-skill-build/SKILL.md
  - skills/900-shipflow-core/SKILL.md
  - skills/108-sf-browser/SKILL.md
  - skills/003-sf-bug/SKILL.md
  - skills/305-sf-init/SKILL.md
  - skills/300-sf-docs/SKILL.md
  - skills/references/reporting-contract.md
  - skills/references/master-workflow-lifecycle.md
  - skills/references/decision-quality-contract.md
  - skills/references/spec-driven-development-discipline.md
  - skills/references/content-quality-rubric.md
  - skills/references/question-contract.md
  - skills/references/sentry-observability.md
  - tools/audit_shipflow_skills.py
  - specs/001-sf-build-autonomous-master-skill.md
  - specs/skill-reporting-modes-and-compact-reports.md
  - shipflow-spec-driven-workflow.md
  - templates/artifacts/
  - docs/technical/
  - docs/editorial/
depends_on:
  - artifact: "shipflow-spec-driven-workflow.md"
    artifact_version: "0.18.0"
    required_status: draft
  - artifact: "skills/references/technical-docs-corpus.md"
    artifact_version: "1.3.0"
    required_status: active
  - artifact: "skills/references/editorial-content-corpus.md"
    artifact_version: "1.3.0"
    required_status: active
supersedes: []
evidence:
  - "Skill inventory and workflow doctrine."
  - "Editorial content corpus and Editorial Reader role added for public-content impact analysis."
  - "Governance corpus lifecycle added: 305-sf-init bootstraps, 300-sf-docs maintains, 001-sf-build consumes."
  - "108-sf-browser added as the generic non-auth Playwright MCP browser evidence skill."
  - "009-sf-skill-build added as the dedicated master lifecycle for ShipFlow skill maintenance."
  - "004-sf-deploy added as the dedicated release confidence orchestrator."
  - "006-sf-design added as the master design lifecycle orchestrator for UI/UX, tokens, playgrounds, visual proof, verification, and ship routing."
  - "002-sf-maintain promoted to a master maintenance lifecycle from triage through delegated execution, verification, and ship/deploy routing."
  - "Shared reporting contract added: concise user reports by default, explicit agent handoff reports when requested."
  - "Reporting contract clarified: user-mode ship reports should match the user's active language, use outcome/evidence/limits ordering, and allow a few sober status emojis."
  - "Skill launch cheatsheet added for master and supporting modes."
  - "009-sf-skill-build exploration gate added before 100-sf-spec for fuzzy skill ideas or placement decisions."
  - "007-sf-content added as the master content lifecycle for strategy, repurposing, drafting, enrichment, audits, docs, validation, and ship routing."
  - "008-sf-onboarding added as the user activation lifecycle for first-success paths, setup guidance, recoverable states, docs impact, and proof routing."
  - "600-sf-local-cloud-sync added as the local-to-cloud data promotion, merge, sync UX, and security contract skill."
  - "001-sf-build delegated sequential subagent consent clarified; subagents and parallelism are distinct runtime concepts."
  - "Master delegation semantics extracted to skills/references/master-delegation-semantics.md and cited by master/orchestrator skills."
  - "Master workflow lifecycle extracted to skills/references/master-workflow-lifecycle.md; bug work items now use bugs/*.md as source of truth and BUGS.md as optional/generated triage."
  - "000-shipflow <instruction> documented as the primary non-technical router with direct main-thread handoff to selected skills."
  - "Shared question/default contract added for numbered user-facing decisions and context-safe defaults."
  - "003-sf-bug clarified as a bug lifecycle executor through owner skills and bounded subagents, not a simple next-command router."
  - "Shared Sentry observability reference added for runtime evidence, release/environment correlation, redaction, and performance overhead checks."
  - "Sentry reference clarified: skills never have direct Sentry dashboard access; bounded local PM2 logs and redacted Doppler presence/scope checks are acceptable supporting evidence when no Sentry pointer is supplied or visible."
  - "Model routing clarified: GPT-5.5 fits ambiguous, cross-project, governance-heavy, transverse audit, prioritization, prompt/docs migration, and business-risk synthesis work; the `codex` implementation profile fits long implementation, multi-file coding, refactors, hard debugging, and terminal-heavy agentic execution; main-thread model changes are recommendations unless the runtime actually applies an override."
  - "Subagent model defaults clarified: GPT-5.4-mini is the default for small bounded Codex/OpenAI subagent missions, GPT-5.3-Codex-Spark for Spark-eligible low-risk work, the `codex` implementation profile for long implementation, and GPT-5.5 for high-risk transverse reasoning."
  - "`001-sf-build agents` clarified as a strict delegated sequential validation gate; parallel agents remain controlled only by ready spec `Execution Batches`."
  - "Layered skill-instruction contract added for progressive SKILL.md compaction with pilot extraction to skill-local references."
  - "Spec-driven development discipline added: spec-first remains the outer lifecycle contract, while execution skills choose proof paths such as test-first, regression-first, scenario-first, evidence-first, or exception-with-proof."
  - "Pilot compaction applied to 300-sf-docs, 502-sf-audit-design, and 103-sf-verify while preserving chantier/reporting/security/doc-update gates."
  - "Skill taxonomy description audit applied compact routing descriptions across 61 skills while preserving names, trace categories, process roles, and runtime visibility."
  - "103-sf-verify aligned stale dependency metadata during the skill taxonomy description verification."
- "Decision quality contract added: ShipFlow optimizes for correctness, security, performance, maintainability, durability, professional best practices, and proof quality before speed, cost, or convenience."
- "Skill instruction layering refreshed: SKILL.md is the activation contract; detailed playbooks, examples, matrices, and edge cases belong in references."
- "Codex model wording refreshed to use the current `codex` implementation profile instead of pinning long implementations to a deprecated slug."
  - "102-sf-start local auto-verify contract added: eligible local, tool-backed, non-destructive verification can run inside 102-sf-start, while hosted/browser/manual/production/ship proof stays with owner skills and 001-sf-build remains full lifecycle orchestrator."
  - "900-shipflow-core added as an internal operator skill for skill execution-fidelity audits and plugin-packaging readiness, backed by tools/audit_shipflow_skills.py."
  - "310-sf-github-hygiene added as the git/GitHub sync, stale branch, PR drift, and Dependabot hygiene skill."
next_review: "2026-06-01"
next_step: "/300-sf-docs technical audit skills"
---

# Skill Runtime And Lifecycle

## Purpose

This doc covers ShipFlow skills, lifecycle flow, references, templates, model/topology decisions, and documentation gates. Read it before changing `skills/*/SKILL.md`, shared skill references, or `shipflow-spec-driven-workflow.md`.

## Instruction Layering Policy

ShipFlow skill instructions follow layered progressive disclosure:

- compact activation logic in `skills/*/SKILL.md`
- shared doctrine in `skills/references/*.md`
- heavy skill-specific checklists/playbooks in `skills/<skill>/references/*.md`

Use `skills/references/skill-instruction-layering.md` as the canonical placement contract. `SKILL.md` is the activation contract: keep trigger, mission, scope, required loaders, stop conditions, validation commands, report mode, and local non-negotiables there; move detailed playbooks, examples, matrices, troubleshooting branches, and edge cases to references. Use `skills/references/skill-context-budget.md` for body-size and discovery-budget thresholds.

Compaction must preserve operational guardrails: canonical path resolution, chantier trace semantics, reporting contract loading, security/redaction rules, and documentation-update gates.

Future compaction should split large workflow references by mode when useful, but the top-level `SKILL.md` must remain the activation contract and name the exact references to load.

## Skill Discovery Taxonomy

Discovery descriptions are routing triggers, not workflow summaries. Keep them short, one-sentence, and front-loaded with the work type or domain.

Three-digit skill codes are part of the runtime-visible skill identity. The canonical lookup lives in `skills/references/skill-code-index.md`; it maps old names such as `sf-build` to runtime names such as `001-sf-build`. `000-shipflow` may resolve `NNN`, `NNN-skill`, `NNNskill`, or `NNN skill` through that index before normal natural-language routing.

Current family boundaries:

- Lifecycle/master: `100-sf-spec`, `101-sf-ready`, `102-sf-start`, `103-sf-verify`, `104-sf-end`, `005-sf-ship`, `001-sf-build`, `004-sf-deploy`, `002-sf-maintain`, `006-sf-design`, `007-sf-content`, `008-sf-onboarding`, `009-sf-skill-build`.
- Data trust/source: `600-sf-local-cloud-sync`, `601-sf-product-entitlements`.
- Audit/source: `400-sf-audit*`, `402-sf-deps`, `403-sf-perf`.
- Bug/proof/source: `003-sf-bug`, `106-sf-fix`, `107-sf-test`, `108-sf-browser`, `109-sf-auth-debug`, `405-sf-prod`, `105-sf-check`, `404-sf-migrate`.
- Content/docs/support: `300-sf-docs`, `200-sf-redact`, `201-sf-enrich`, `202-sf-repurpose`, `304-sf-changelog`, `306-sf-scaffold`, `307-sf-skills-refresh`, `305-sf-init`, `310-sf-github-hygiene`.
- Research/strategy/source: `203-sf-research`, `204-sf-market-study`, `205-sf-veille`.
- Pilotage: `701-sf-backlog`, `702-sf-priorities`, `703-sf-review`, `309-sf-tasks`, `706-continue`.
- Helper/session/router: `000-shipflow`, `301-sf-context`, `704-sf-model`, `302-sf-help`, `308-sf-status`, `303-sf-resume`, `700-sf-explore`, `707-name`, `800-tmux-capture-conversation`, `801-clean-conversation-transcript`.
- Internal/meta: `900-shipflow-core` for operator-only ShipFlow skill execution-fidelity and plugin-packaging audits.

Keep overlap intentional and explicit: master skills orchestrate, specialists prove or repair, support skills document or scaffold, and helper skills route or summarize without owning lifecycle state.

Within helper/pilotage surfaces, keep the first-screen distinction explicit:

- `302-sf-help` explains workflow, doctrine, skill choice, or route questions.
- `303-sf-resume` summarizes the visible conversation only.
- `706-continue` advances the currently resolved work item from durable local evidence.
- `000-shipflow` routes or answers directly at the main entrypoint.
- `301-sf-context` primes minimal focused context before known work.
- `308-sf-status` reports cross-project git and sync state.
- `700-sf-explore` frames the problem or option space before commitment.
- `701-sf-backlog` captures, defers, cleans, or promotes future work.
- `702-sf-priorities` ranks active work for immediate execution order.
- `703-sf-review` reconstructs what happened, what is proven, and what should happen next.
- `309-sf-tasks` maintains the durable task tracker so project state is recorded correctly.
- `706-continue` advances the currently resolved work item from durable local evidence.

Do not blur these roles. Help is not continuation, resume is not repo truth, continue is not a passive summary, route is not context priming, context priming is not execution, and status reporting is not maintenance ownership.

Keep the pilotage boundary explicit as well: exploration is not backlog grooming, backlog grooming is not current prioritization, prioritization is not retrospective review, and review is not open-ended ideation.

Keep the execution-pilotage boundary explicit too: task-tracker maintenance is not continuation of the active work item, and continuation is not a generic request to rewrite tracker state.

## Owned Files

| Path | Role | Edit notes |
| --- | --- | --- |
| `skills/*/SKILL.md` | Executable skill contracts | Keep descriptions compact; route heavy detail to references |
| `skills/references/*.md` | Shared doctrine and provider-specific references | Resolve from `${SHIPFLOW_ROOT:-$HOME/shipflow}` |
| `skills/references/skill-instruction-layering.md` | Canonical layering contract for `SKILL.md` activation rules vs shared or skill-local references | Load before editing or compacting skills |
| `skills/<skill>/references/*.md` | Skill-local heavy checklists, mode playbooks, and report matrices | Keep top-level SKILL focused on activation and gates |
| `skills/references/master-delegation-semantics.md` | Shared master/orchestrator delegation, subagent, short-approval, and parallelism doctrine | Load before master skills choose execution topology |
| `skills/references/master-workflow-lifecycle.md` | Shared master/orchestrator lifecycle skeleton and work item model | Load before master skills resolve intake, readiness, model/topology, validation, verification, closure, or ship/deploy routes |
| `skills/references/decision-quality-contract.md` | Shared high-quality decision doctrine: correctness, security, performance, maintainability, durability, best practices, and proof before speed/cost/convenience | Load before routing, model/fallback selection, implementation, fixes, skill-contract changes, verification, or recommended defaults |
| `skills/references/skill-code-index.md` | Canonical numeric lookup from memorable codes to unchanged skill names | Update whenever a skill is added, removed, or renamed; validate with `python3 tools/skill_code_index_lint.py` |
| `skills/900-shipflow-core/SKILL.md` | Internal operator skill for ShipFlow execution-fidelity audits and plugin-packaging readiness | Keep out of public plugin packaging and public skill pages unless the operator explicitly changes the policy |
| `skills/references/spec-driven-development-discipline.md` | Shared spec-first/proof-first discipline | Load before execution or verification when behavior, bug, skill contract, UI/docs/auth/deploy, operational, or integration work needs a proof path |
| `skills/references/content-quality-rubric.md` | Shared project-aware content quality scoring schema and blocked-code contract | Load when content owner skills or `103-sf-verify` produce/consume editorial quality gates |
| `skills/references/reporting-contract.md` | Shared final-report mode contract | Default user reports are concise; detailed reports require explicit handoff mode |
| `skills/references/sentry-observability.md` | Shared Sentry runtime evidence, PM2/Doppler fallback evidence, release/environment correlation, redaction, and performance-overhead doctrine | Load when runtime behavior, crashes, 5xx, event IDs, deploy confidence, auth/payment/data failures, jobs, webhooks, verification, audits, or perf checks depend on observability |
| `skills/references/product-entitlements-playbook.md` | Shared product-access doctrine for identity vs entitlement separation, Lifetime Deal/direct/partner code redemption, provider events, revokes/refunds, support runbooks, and smoke proof | Load when projects touch product access, billing providers, activation codes, paid plans, premium gates, quotas, refunds, revocations, or entitlement-backed data access |
| `skills/601-sf-product-entitlements/SKILL.md` | Product entitlement skill for access ownership, provider-event handling, backend authorization gates, support flow framing, product-local mirrors, and sync/auth handoffs | Load when projects need an entitlement contract, duplicate-ledger review, product-access guard design, provider/manual grant routing, or entitlement-gated sync preconditions |
| `skills/600-sf-local-cloud-sync/references/*.md` | Local-to-cloud sync doctrine, UX/security checklist, and Flutter implementation checklist | Load when projects touch local data promotion, cloud hydration, merge/conflict policy, sync state UX, sensitive-data exclusions, or reinstall recovery |
| `skills/references/subagent-roles/*.md` | Internal role contracts such as Technical Reader and Editorial Reader | Role files are read by orchestration skills; keep read-only roles explicit |
| `tools/shipflow_sync_skills.sh` | Shared current-user Claude/Codex skill runtime sync helper | Use for check/repair instead of inline symlink snippets |
| `tools/audit_shipflow_skills.py` | Versioned ShipFlow skill execution-fidelity audit helper used by `900-shipflow-core` and conversation follow-through gates | Keep read-only by default; audit findings classify risk but do not authorize broad edits without scenario-first triage |
| `tools/skill_code_index_lint.py` | Numeric skill-code index validator | Run after changing `skills/references/skill-code-index.md` or the skill set |
| `shipflow-spec-driven-workflow.md` | Global workflow doctrine | Sequential shared file |
| `templates/artifacts/*.md` | Durable artifact templates | Keep linter-compatible |
| `AGENT.md`, `AGENTS.md` | Agent entrypoint and compatibility alias | `AGENT.md` canonical; `AGENTS.md` symlink only |

## Canonical Artifact Taxonomy

ShipFlow-owned artifacts are classified into seven primary types:

- `entrypoint-router`: request intake and safe routing, including `000-shipflow` and similar router surfaces.
- `master-workflow`: lifecycle orchestration and delegation for chantiers.
- `specialist-workflow`: domain execution under a selected master workflow.
- `contract`: authoritative governance or behavioral doctrine that must be consistently reusable.
- `reference`: support documentation, indexes, checklists, or maps that help apply contracts.
- `template`: schema-rich documents used to create durable artifacts with predictable shape.
- `record`: one durable case entry for a specific operation, scope, or decision trace.

### Type-by-Type Boundaries

- `entrypoint-router` resolves user intent and delegates once; it should not own lifecycle proof logic or durable domain policy.
- `master-workflow` owns `100-sf-spec` -> `101-sf-ready` -> `102-sf-start` -> `103-sf-verify` orchestration and must hand execution to specialists rather than execute policy-specific fixes directly.
- `specialist-workflow` executes a bounded set of domain tasks and hands back outcomes; it should not redefine router or master-level ownership.
- `contract` defines what must be true across contexts and is the anchor for reusable standards.
- `reference` supports application of contracts and should avoid introducing new mandatory policy that does not already exist in a contract.
- `template` defines structure and required fields; behavior and policy stay in contracts or SKILL-specific instructions.
- `record` captures facts of one case; method and doctrine must come from contract/reference siblings.

When a file materially performs two serious primary jobs, split or extract before adding further content.

## Entrypoints

- `000-shipflow <instruction>`: recommended non-technical first command; answers pure conversation directly or hands the main thread to the selected `sf-*` master/specialist skill.
- Numeric skill codes: `shipflow 01`, `shipflow 01-001-sf-build`, or equivalent code-first requests resolve through `skills/references/skill-code-index.md` to canonical skill names without renaming runtime skills.
- `700-sf-explore -> 100-sf-spec -> 101-sf-ready -> 102-sf-start -> 103-sf-verify -> 104-sf-end`: normal non-trivial flow.
- `106-sf-fix`: bug-first entrypoint that may route direct or spec-first.
- `305-sf-init`: project bootstrap that reports or creates baseline technical and editorial governance corpus state.
- `300-sf-docs`: documentation generation, audit, metadata, and technical-docs mode.
- `300-sf-docs technical`: technical governance bootstrap, code-docs map creation, and audit.
- `300-sf-docs editorial`: editorial governance scaffolding and audit for public-content drift, claim register, page intent, and runtime content schema preservation.
- `310-sf-github-hygiene`: git/GitHub hygiene lane for sync drift, stale branches, PR drift, and Dependabot backlog triage with bounded safe fixes.
- `003-sf-bug`: professional bug loop lifecycle executor (`107-sf-test -> bug file -> 106-sf-fix -> 107-sf-test --retest -> 103-sf-verify -> 005-sf-ship`).
- `002-sf-maintain`: master project maintenance lifecycle for bugs, dependencies, docs, checks, audits, migrations, tasks, security posture, delegated remediation, verification, and ship/deploy routing.
- `108-sf-browser`: generic non-auth browser verification through Playwright MCP for URLs, page-level assertions, screenshots, console summaries, and network summaries.
- `001-sf-build`: user-facing orchestrator that consumes the governance corpus gate before implementation, closure, and ship.
- `004-sf-deploy`: release confidence orchestrator (`105-sf-check -> 005-sf-ship -> 405-sf-prod -> 108-sf-browser/109-sf-auth-debug/107-sf-test -> 103-sf-verify -> 304-sf-changelog`).
- `007-sf-content`: master content lifecycle (`CONTENT_MAP + editorial corpus -> owner content skills -> audits/docs -> validation -> 103-sf-verify -> 005-sf-ship`).
- `skills/references/content-quality-rubric.md`: shared editorial scoring contract used by content owner skills and verification gates.
- `006-sf-design`: master design lifecycle (`design intent -> specialist audit/token/playground route -> spec-first implementation when needed -> checks/browser proof -> 103-sf-verify -> 005-sf-ship`).
- `008-sf-onboarding`: user activation lifecycle (`first-success path -> setup order -> states/recovery -> docs impact -> proof or 001-sf-build`).
- `600-sf-local-cloud-sync`: local-to-cloud data sync contract (`data inventory -> account association -> promotion/hydration -> merge/conflict/tombstones -> sync UX/security -> proof or 001-sf-build`).
- `601-sf-product-entitlements`: product access lifecycle contract (`identity/provider/access separation -> ledger ownership -> backend gates/support -> sync/auth handoff or 001-sf-build`).
- `500-sf-design-from-scratch`: design-system creation skill for extracting an existing UI into a complete professional token system before playground or token audit work.
- `009-sf-skill-build`: dedicated orchestrator for ShipFlow skill maintenance (`700-sf-explore when needed -> 100-sf-spec -> SKILL.md -> runtime skill links -> 307-sf-skills-refresh -> budget audit -> 103-sf-verify -> 300-sf-docs/help -> 005-sf-ship`).
- `900-shipflow-core`: internal operator skill for local ShipFlow skill execution-fidelity audits and public-plugin packaging readiness checks. It is repo-synced, not a public user plugin surface.
- `tools/shipflow_sync_skills.sh --check|--repair`: reusable local helper for current-user Claude/Codex skill visibility and install-time selected-user linking.
- `005-sf-ship` and `405-sf-prod`: shipping and deployed verification.
- `skills/references/master-delegation-semantics.md`: shared execution-topology doctrine for master/orchestrator skills.
- `skills/references/master-workflow-lifecycle.md`: shared lifecycle and work item doctrine for master/orchestrator skills.
- `skills/references/reporting-contract.md`: shared final-report modes for concise user reports and explicit detailed agent handoffs.

## Control Flow

Primary router flow:

```text
000-shipflow <instruction>
  -> direct conversational answer
  -> or direct main-thread handoff to 001-sf-build / 002-sf-maintain / 003-sf-bug / 004-sf-deploy / 007-sf-content / 006-sf-design / 008-sf-onboarding / 600-sf-local-cloud-sync / 009-sf-skill-build / 400-sf-audit-*
  -> one numbered question when the route is ambiguous
```

The selected master then owns its own delegated sequential execution. The router must not run a master skill inside a subagent or reimplement the selected skill's lifecycle gates.

```text
source skill
  -> possible chantier
  -> 100-sf-spec
  -> 101-sf-ready
  -> Governance Corpus Gate
  -> 102-sf-start
  -> optional 102-sf-start local auto-verify when proof is local, tool-backed, non-destructive, and has no external side effect
  -> Documentation Update Plan after code-changing wave
  -> Editorial Update Plan after public-content or claim-impacting wave
  -> 103-sf-verify
  -> Documentation Update Plan during end verification
  -> Editorial Update Plan during end verification when public content is impacted
  -> 104-sf-end / 005-sf-ship
```

Shared master lifecycle:

```text
intake
  -> work item resolution
  -> readiness gate
  -> model/topology routing
  -> delegated or owner-skill execution
  -> targeted validation and evidence routing
  -> verification
  -> post-verify closure
  -> bounded ship/deploy/release routing
```

`102-sf-start` may record `auto-verify: run` for eligible local proof only. It must record `auto-verify: skipped` and route to the proof owner when verification needs preview, production, auth/browser, Sentry, device, manual QA, secret access, commit, push, ship, or any external side effect. This does not replace `001-sf-build` as the full lifecycle owner through `103-sf-verify`, `104-sf-end`, and `005-sf-ship`.

Model routing is a lifecycle gate, not a promise that the active conversation can switch its own runtime model. Master skills use `skills/704-sf-model/references/model-routing.md` for the policy and `skills/references/decision-quality-contract.md` for the quality boundary. In Codex/OpenAI, `gpt-5.4-mini` fits small bounded low-risk missions; `gpt-5.3-codex-spark` fits Spark-eligible summaries, text-only handoffs, micro-code, targeted UI/local edits, or other low-risk bounded work when it does not replace needed reasoning; the `codex` implementation profile fits long implementation, multi-file coding, refactors, hard debugging, and terminal-heavy agentic execution; `gpt-5.5` fits ambiguous, cross-project, governance-heavy, transverse audit, task-prioritization, prompt/docs migration, and business-risk synthesis work with calibrated reasoning effort. Delegated subagent missions should include model, reasoning or alias behavior, quality-equivalent fallback, and model application status when the runtime supports or rejects overrides.

Release confidence flow:

```text
004-sf-deploy
  -> scope and risk gate
  -> 105-sf-check
  -> 005-sf-ship
  -> 405-sf-prod
  -> 108-sf-browser / 109-sf-auth-debug / 107-sf-test
  -> 103-sf-verify
  -> 304-sf-changelog when useful
```

Professional bug flow:

```text
003-sf-bug
  -> 107-sf-test for capture or retest
  -> 106-sf-fix for diagnosis and fix attempts
  -> 109-sf-auth-debug / 108-sf-browser when evidence is missing
  -> 103-sf-verify for closure
  -> 005-sf-ship for final bug-risk-aware shipping
```

Project maintenance flow:

```text
002-sf-maintain
  -> maintenance intake and triage
  -> existing chantier/spec gate
  -> 100-sf-spec + 101-sf-ready when non-trivial
  -> delegated sequential maintenance lanes
  -> 003-sf-bug / 402-sf-deps / 300-sf-docs / 105-sf-check / 401-sf-audit-code / 400-sf-audit / 404-sf-migrate / 106-sf-fix / 001-sf-build
  -> Documentation Update Plan and Editorial Update Plan when impacted
  -> 103-sf-verify
  -> 004-sf-deploy or 005-sf-ship
```

Content lifecycle flow:

```text
007-sf-content
  -> CONTENT_MAP and editorial corpus
  -> surface, source, claim, and schema gates
  -> 205-sf-veille / 203-sf-research / 204-sf-market-study when source or market evidence is missing
  -> 202-sf-repurpose / 200-sf-redact / 201-sf-enrich
  -> 206-sf-audit-copy / 207-sf-audit-copywriting / 406-sf-audit-seo
  -> 300-sf-docs for docs or editorial governance updates
  -> npm --prefix site run build and 108-sf-browser when public site proof is needed
  -> 103-sf-verify
  -> 005-sf-ship only when dirty scope is bounded
```

## Invariants

- Lifecycle skills trace into exactly one chantier spec when one is identified.
- `000-shipflow <instruction>` is a router, not a hidden master runner: it answers pure conversation directly, asks one numbered question when ambiguous, and otherwise hands the main thread to the selected skill.
- `102-sf-start` implements from the ready contract; it should not rediscover product intent while coding.
- Spec-first is the outer lifecycle contract; proof-first is the implementation discipline. Execution and verification skills choose a proof path (`test-first`, `regression-first`, `scenario-first`, `evidence-first`, or `exception-with-proof`) before claiming completion.
- The Reader diagnoses docs impact; the executor or integrator applies docs updates.
- The Technical Reader diagnoses code-docs impact; the Editorial Reader diagnoses public-content and claim impact.
- Shared files are sequential by default.
- Master/orchestrator skills load `skills/references/master-delegation-semantics.md` before choosing execution topology. Favor subagents by default to keep the main conversation clean; use sequential subagents normally, and use parallel subagents only for read-only fan-out or ready `Execution Batches`.
- Master/orchestrator skills load `skills/references/master-workflow-lifecycle.md` before resolving lifecycle flow. The shared skeleton is intake, work item resolution, readiness, model/topology routing, owner-skill execution, validation/evidence, verification, post-verify closure, and bounded ship/deploy/release routing.
- Skills load `skills/references/decision-quality-contract.md` before quality-sensitive routing, model/fallback choice, implementation, fix, verification, or recommendations. The shortest path is acceptable only when it is also the complete professional path for the risk.
- Skills should load `skills/references/question-contract.md` before user-facing questions. They ask only when the answer changes route, scope, risk, validation, closure, ship posture, public claims, or technical/product/editorial direction; otherwise they proceed by the best-practice default only when it is clear, low-risk, reversible, context-compatible, and verifiable.
- When skill bodies are edited or compacted, treat top-level `SKILL.md` as the activation contract. Keep required section labels (`Canonical Paths`, `Trace category`, `Process role`, `Report Modes`) and local non-negotiables there; move only supporting detail to references.
- Bug work uses one Markdown bug file under `bugs/*.md` as the durable source of truth. `BUGS.md`, when present, is an optional compact/generated/triage view and must not override the bug file.
- Short natural-language confirmations after diagnosis or proposal continue the current chantier in delegated sequential mode by intent rather than exact keyword, not parallel fan-out.
- Fresh context is preferred for non-trivial spec-first execution when available.
- ShipFlow-owned references resolve from `$SHIPFLOW_ROOT`, not the project repo.
- A newly created or renamed ShipFlow skill is not runtime-visible until current-user `~/.claude/skills/<name>` and `~/.codex/skills/<name>` symlink to `$SHIPFLOW_ROOT/skills/<name>` and expose `SKILL.md`.
- `tools/shipflow_sync_skills.sh --check` is read-only and reports missing, stale, broken, and non-symlink runtime entries.
- `tools/shipflow_sync_skills.sh --repair` creates missing links and replaces stale symlinks; it must not overwrite non-symlink entries unless an install-time caller explicitly passes `--backup-existing`.
- `305-sf-init` bootstraps minimal governance corpus state; `300-sf-docs` owns corpus creation, update, and audit; `001-sf-build` consumes the corpus through gates.
- Technical governance applies to code projects by default. Editorial governance applies when public pages, README promises, docs, FAQ, pricing, support copy, public skill pages, blog/article intent, claims, or runtime content surfaces exist.
- Skills that use Playwright MCP for browser evidence must load
  `skills/references/playwright-mcp-runtime.md` first and refuse stale Linux
  ARM64 Chrome-stable fallback evidence.
- Skills that use runtime failure evidence, deploy confidence, bug evidence, auth/payment/data failure diagnosis, jobs, webhooks, verification, or performance telemetry must load `skills/references/sentry-observability.md` when Sentry is configured, visible, or materially relevant. Skills never have direct Sentry dashboard access; Sentry evidence means a redacted issue/event pointer supplied by the operator, visible in the app, visible in logs, or already present in context. When no Sentry pointer is available, bounded PM2 logs and Doppler key presence/scope checks may be used as supporting evidence without printing secrets.
- `108-sf-browser` owns generic non-auth browser proof. `109-sf-auth-debug` owns auth, session, callback, provider, tenant, and protected-route browser proof.
- `004-sf-deploy` owns release orchestration only; `005-sf-ship` owns commit/push, `405-sf-prod` owns deployed truth, and proof skills own observed behavior.
- `003-sf-bug` owns bug lifecycle execution through owner skills and bounded subagents; phase skills still own bug record mutation, diagnosis, retest evidence, verification, and shipping internals.
- `002-sf-maintain` owns the maintenance lifecycle; bugs, dependencies, docs, checks, audits, migrations, tasks, security review, repair, verification, and ship still run through their specialist owner skills and gates.
- `310-sf-github-hygiene` owns focused git/GitHub hygiene; commit/push stays with `005-sf-ship`, dependency risk stays with `402-sf-deps`, major upgrade lanes stay with `404-sf-migrate`, and CI diagnosis stays with `github:gh-fix-ci`.
- `007-sf-content` owns content-management orchestration; repurposing, drafting, enrichment, copy audit, copywriting audit, SEO audit, docs, veille, market study, browser proof, verification, and ship still run through their specialist owner skills and gates.
- Content owner skills (`007-sf-content`, `202-sf-repurpose`, `200-sf-redact`, `201-sf-enrich`, `206-sf-audit-copy`, `207-sf-audit-copywriting`, `406-sf-audit-seo`) and `103-sf-verify` must use one shared rubric contract from `skills/references/content-quality-rubric.md`; recoverable score states (`needs retry`, `duplicate_in_progress`, `conflicting_score_state`, `stale_or_mismatched_score`) are never valid verification proof.
- `006-sf-design` owns design lifecycle orchestration; UI/UX audits, token audits, component audits, accessibility audits, playground tooling, design-system creation, browser proof, implementation, verification, and ship still run through their specialist owner skills and gates.
- `008-sf-onboarding` owns user activation contracts; implementation, visual design, docs/content, browser proof, and manual QA still run through `001-sf-build`, `006-sf-design`, `300-sf-docs`/`007-sf-content`, `108-sf-browser`, and `107-sf-test` when needed.
- `500-sf-design-from-scratch` owns design-system creation from existing UI values; playground tooling, token audits, component audits, accessibility audits, and general design routing stay with their specialist or master skills.
- `009-sf-skill-build` owns skill-maintenance orchestration and must route to `700-sf-explore` before `100-sf-spec` when skill intent, placement, public promise, or governance policy is too fuzzy for one targeted question to settle.
- A release is not considered verified from push success, provider success, or a bare `200 OK` alone.
- User-facing final reports default to `report=user`: concise, outcome-first, matched to the user's active language, compact chantier block, and no empty `Reste a faire` / `Prochaine etape` boilerplate. Ship reports should read as outcome, evidence, then limits, with a few sober status emojis allowed for scanning. Detailed `report=agent` handoff must be explicit; skills do not infer caller identity.
- `001-sf-build` planning questions are business decision briefs, not bare technical prompts: they name the problem root, business stakes, practical options, and recommended best-practice answer before asking for a decision.
- Audit skills still report findings first, but default user reports should summarize top findings, proof gaps, chantier potential, and next action; full matrices and domain checklists belong in `report=agent`.

## Failure Modes

- A weak spec that lacks success/error behavior or explicit constraints must route back to readiness instead of being silently repaired during coding.
- If mapped docs are missing from a `Documentation Update Plan`, the docs gate fails.
- If public content, README, FAQ, pricing, public docs, skill pages, or claims are affected but missing from an `Editorial Update Plan`, the editorial gate fails.
- If `001-sf-build` prepares implementation with missing or stale `docs/technical/code-docs-map.md`, applicable `docs/editorial/`, or `CONTENT_MAP.md`, it must route to `300-sf-docs` or record explicit no-impact/no-surface status before proceeding.
- If a master skill patches in the master conversation merely because a file change is small while subagents are available, treat that as workflow drift. Small scope may use a mini-contract, but the execution mode remains delegated sequential for file work.
- If `001-sf-build agents` touches files, runs validation, prepares closure, or prepares ship without launching a bounded subagent and without explicitly reporting degraded execution, treat that as workflow drift.
- If the `000-shipflow <instruction>` router nests `001-sf-build`, `002-sf-maintain`, `003-sf-bug`, `004-sf-deploy`, `007-sf-content`, or `009-sf-skill-build` inside a subagent instead of handing off the main thread, treat that as workflow drift.
- If a short natural-language confirmation is treated as consent for parallel subagents without ready `Execution Batches`, treat that as workflow drift.
- If future projects are told to rerun ShipFlow's shipped governance specs instead of using `305-sf-init` and `300-sf-docs`, treat that as workflow drift.
- If a new skill exists under `skills/<name>/SKILL.md` but is missing from current-user Claude or Codex skill directories, treat the skill lifecycle as incomplete until the runtime symlinks are repaired.
- If filesystem runtime links are correct but the current agent still does not list a skill, treat it as a process reload/session-cache issue before changing source contracts.
- If the Reader edits docs directly outside assignment, treat it as role misuse.
- If `AGENTS.md` diverges from `AGENT.md`, verification fails.
- If Playwright MCP reports `/opt/google/chrome/chrome` on Linux ARM64 after
  BUG-2026-05-02-001, treat the current MCP process as stale or misconfigured;
  do not diagnose the app until the runtime preflight passes.

## Security Notes

- Skill instructions must not contradict higher-priority system, developer, or active spec instructions.
- Do not expose secrets, private logs, or credentials in generated reports.
- Any task that affects auth, permissions, tenant boundaries, destructive behavior, or external side effects must use spec-first when ambiguity remains.

## Validation

```bash
python3 tools/skill_budget_audit.py --skills-root skills --format markdown
bash -n tools/shipflow_sync_skills.sh test_skill_runtime_sync.sh
bash test_skill_runtime_sync.sh
tools/shipflow_sync_skills.sh --check --all
python3 tools/shipflow_metadata_lint.py skills/references/master-delegation-semantics.md skills/references/master-workflow-lifecycle.md skills/references/spec-driven-development-discipline.md skills/references/technical-docs-corpus.md skills/references/editorial-content-corpus.md skills/references/subagent-roles/editorial-reader.md skills/references/skill-instruction-layering.md skills/references/skill-context-budget.md shipflow-spec-driven-workflow.md AGENT.md
rg -n "Governance Corpus Gate|305-sf-init.*bootstrap|300-sf-docs.*maintain|001-sf-build.*consume|004-sf-deploy|002-sf-maintain|007-sf-content|master-delegation-semantics|master-workflow-lifecycle|bug file|delegated sequential|subagent|parallelism|short natural-language|Execution Batches|reporting-contract|report=user|docs/technical|docs/editorial" skills/305-sf-init/SKILL.md skills/300-sf-docs/SKILL.md skills/004-sf-deploy/SKILL.md skills/002-sf-maintain/SKILL.md skills/007-sf-content/SKILL.md specs/001-sf-build-autonomous-master-skill.md shipflow-spec-driven-workflow.md README.md skills/references/reporting-contract.md skills/references/master-delegation-semantics.md skills/references/master-workflow-lifecycle.md
```

Run focused `rg` checks for the affected skill contract and linked references.

## Reader Checklist

- `skills/*/SKILL.md` changed -> check this doc, `technical-docs-corpus.md`, and workflow docs.
- New/renamed skill or visibility drift -> run `tools/shipflow_sync_skills.sh --check --skill <name>` or `--check --all`.
- Playwright MCP usage changed -> check `skills/references/playwright-mcp-runtime.md`
  and `skills/109-sf-auth-debug/references/playwright-auth.md`.
- Public-content skill changed -> check `editorial-content-corpus.md`, `docs/editorial/`, and workflow docs.
- Governance corpus bootstrap or adoption changed -> check `skills/305-sf-init/SKILL.md`, `skills/300-sf-docs/SKILL.md`, `technical-docs-corpus.md`, `editorial-content-corpus.md`, `README.md`, and workflow docs.
- Content lifecycle changed -> check `CONTENT_MAP.md`, `docs/editorial/`, public skill content, `README.md`, `docs/skill-launch-cheatsheet.md`, and workflow docs.
- A lifecycle rule changed -> update `shipflow-spec-driven-workflow.md`.
- Report mode or final-report doctrine changed -> update `skills/references/reporting-contract.md`, `skills/references/chantier-tracking.md`, and affected master/audit skills.
- A docs gate changed -> update `skills/300-sf-docs/SKILL.md`, `technical-docs-corpus.md`, and `code-docs-map.md`.
- An editorial gate changed -> update `skills/300-sf-docs/SKILL.md`, `editorial-content-corpus.md`, `docs/editorial/`, and workflow docs.

## Maintenance Rule

Update this doc when skill roles, lifecycle flow, chantier tracing, technical-docs gates, editorial gates, model/topology rules, or shared reference resolution changes.
