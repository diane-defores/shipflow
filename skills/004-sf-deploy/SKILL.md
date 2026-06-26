---
name: 004-sf-deploy
description: "Orchestrate release checks, ship, deploy, proof, and verify."
argument-hint: [optional: project, URL, --preview, --prod, skip-check, no-changelog]
---

Primary artifact type: `master-workflow`.

## Canonical Paths

Before resolving any ShipFlow-owned file, load `$SHIPFLOW_ROOT/skills/references/canonical-paths.md` (`$SHIPFLOW_ROOT` defaults to `$HOME/shipflow`). ShipFlow tools, shared references, skill-local `references/*`, templates, workflow docs, and internal scripts must resolve from `$SHIPFLOW_ROOT`, not from the project repo where the skill is running. Project artifacts and source files still resolve from the current project root unless explicitly stated otherwise.

## Chantier Tracking

Trace category: `obligatoire`.
Process role: `lifecycle`.

Before deploying a spec-first chantier, load `$SHIPFLOW_ROOT/skills/references/chantier-tracking.md`, then read the spec's `Skill Run History` and `Current Chantier Flow` when a unique spec exists. Append a current `004-sf-deploy` row with result `deployed`, `partial`, `blocked`, or `rerouted`, update `Current Chantier Flow`, and end the report with the compact `Chantier` block from `$SHIPFLOW_ROOT/skills/references/reporting-contract.md`.

If no unique chantier spec is identified, do not write to a spec; report `Chantier: non applicable` or `Chantier: non trace` with the reason.

## Report Modes

Before producing the final report, load `$SHIPFLOW_ROOT/skills/references/reporting-contract.md`.

Default to `report=user`: concise, evidence-first, and using the compact chantier block. The detailed report template below is for `report=agent`, blocked runs, or explicit handoff.

## Master Delegation

Before choosing execution topology, load `$SHIPFLOW_ROOT/skills/references/master-delegation-semantics.md`.

When reporting any failure state, load `$SHIPFLOW_ROOT/skills/references/actionable-failure-contract.md` and keep owner routing explicit.

This skill follows that reference; local nuances below only narrow or route it. Release scope review, checks, ship routing, deployment truth, proof routing, verification, and changelog routing default to delegated sequential when subagents are available. Parallel release work remains blocked unless a ready spec defines safe `Execution Batches`.

## Master Workflow Lifecycle

Before resolving release phases, load `$SHIPFLOW_ROOT/skills/references/master-workflow-lifecycle.md`.

Use the shared skeleton for intake, release-scope work item resolution, readiness, model/topology routing, owner-skill execution, validation/evidence routing, verification, and post-verify changelog routing. Local sections below define release confidence gates only.

## Context

- Current directory: !`pwd`
- Current date: !`date '+%Y-%m-%d'`
- Project name: !`basename $(pwd)`
- Git branch: !`git branch --show-current 2>/dev/null || echo "unknown"`
- Git status: !`git status --short 2>/dev/null || echo "Not a git repo"`
- Git diff stat: !`git diff HEAD --stat 2>/dev/null || echo ""`
- Latest commit: !`git log --oneline -1 2>/dev/null || echo "no commits"`
- ShipFlow development mode: !`rg -n "ShipFlow Development Mode|development_mode|validation_surface|ship_before_preview_test|post_ship_verification|deployment_provider" CLAUDE.md SHIPFLOW.md 2>/dev/null || echo "No project development mode documented"`
- Bug files: !`find bugs -maxdepth 1 -type f -name "BUG-*.md" 2>/dev/null | sort | tail -40 || echo "No bugs directory"`
- Optional bug triage view: !`tail -80 BUGS.md 2>/dev/null || echo "No BUGS.md"`
- Available specs: !`find specs docs -maxdepth 2 -type f -name "*.md" 2>/dev/null | sort | head -80`

## Mission

`004-sf-deploy` is the release confidence orchestrator.

It runs the release path:

```text
scope -> 105-sf-check -> 005-sf-ship -> 405-sf-prod -> 108-sf-browser/109-sf-auth-debug/107-sf-test -> 103-sf-verify -> 304-sf-changelog
```

The goal is fewer manual commands, not fewer gates. `004-sf-deploy` must not treat a passing check, pushed commit, deployment status, or `200 OK` as proof that the release works.

Temporary build outputs, caches, and preview leftovers used for local release proof are disposable unless the task explicitly requires a durable project artifact. Delete them after the proof they supported is complete.

Its dominant job is release-confidence orchestration for one bounded release scope. Keep the boundary explicit: `004-sf-deploy` treats checks, ship, and deployment truth as gates toward proof, not as substitutes for post-deploy evidence or final verification.

## Ownership Boundaries

Orchestrate existing skills; do not duplicate their internals.

- `105-sf-check` owns typecheck, lint, build, tests, and optional repair.
- `005-sf-ship` owns staging, commit, push, and pre-ship bug risk.
- `405-sf-prod` owns deployment discovery, provider state, build logs, runtime logs, and live health.
- `405-sf-prod` owns Sentry runtime correlation for deploy/release health when Sentry is configured.
- `405-sf-prod` owns Blacksmith Run History, Logs, Metrics, and SSH Access escalation when the release uses GitHub Actions on Blacksmith runners.
- `108-sf-browser` owns non-auth page-level browser proof after the deployment URL is known.
- `109-sf-auth-debug` owns login, OAuth, cookies, sessions, callbacks, tenants, and protected-route proof.
- `107-sf-test` owns guided manual QA, durable `TEST_LOG.md`, bug files under `bugs/*.md`, and optional `BUGS.md` triage updates.
- `103-sf-verify` owns final user-story and coherence verification.
- `304-sf-changelog` owns release-note generation.

Route to a narrower skill instead of continuing when the user clearly asks for only that phase.

## Mode Detection

Parse `$ARGUMENTS`:

- empty -> deploy the current project and current bounded release scope.
- `skip-check` -> skip `105-sf-check` only; keep ship, prod, proof, and verify gates explicit.
- `no-changelog` -> skip the optional changelog route.
- `--preview` -> prefer preview/staging deploy proof.
- `--prod` -> prefer production deploy proof and keep destructive/manual test steps read-only unless approved.
- URL -> use it as the deploy or browser-proof target after checking whether `405-sf-prod` still needs to confirm deployment truth.
- project name -> pass it to `405-sf-prod` and any downstream proof skill.

If the user only wants:

- a commit/push -> route to `/005-sf-ship`.
- deployed state/logs -> route to `/405-sf-prod`.
- one page assertion -> route to `/108-sf-browser`.
- auth flow diagnosis -> route to `/109-sf-auth-debug`.
- a durable manual QA campaign -> route to `/107-sf-test`.

## Phase 1 — Scope And Risk Gate

Identify:

- release scope and changed files
- target environment: `local`, `preview`, `production`, or `unknown`
- project development mode from `$SHIPFLOW_ROOT/skills/references/project-development-mode.md` plus `CLAUDE.md` or `SHIPFLOW.md`
- whether the release touches auth, data, permissions, payments, webhooks, background jobs, migrations, public pages, docs, or external side effects
- linked open high or critical bugs from `bugs/*.md`, using optional `BUGS.md` only as triage context when present

Ask one targeted question only when the answer changes staging scope, target environment, skip-check risk, destructive side effects, or release framing.

Stop before shipping when:

- dirty files are unrelated or ambiguous
- high or critical linked bugs are still open and not explicitly accepted as release risk
- the project mode requires hosted validation but the deployment target is unknown
- the requested action would mutate production data without explicit approval

## Phase 2 — Pre-Ship Checks

Unless `skip-check` is present, run or route through:

```text
/105-sf-check nofix
```

Use `nofix` by default because deploy orchestration should not silently widen into an implementation pass. If checks fail, stop and report the failed command plus the repair route:

```text
/105-sf-check fix
```

If `skip-check` is present, continue only with a visible risk note. Skipping checks never means the release is safe.

## Phase 3 — Ship

Run or route through:

```text
/005-sf-ship [bounded release scope]
```

Do not stage or commit files directly inside `004-sf-deploy`. If `005-sf-ship` blocks on checks, secrets, bug risk, unrelated dirty files, or push failure, stop at that gate.

After a successful push, record:

- commit SHA
- branch
- ship mode
- whether hosted validation is required by project development mode
- whether Sentry release/environment correlation is expected for post-deploy runtime proof

## Phase 4 — Deployment Truth

Run or route through:

```text
/405-sf-prod [project or URL]
```

For Vercel projects, `405-sf-prod` should use Vercel MCP as the primary deployment truth source when available. Do not continue to browser or manual proof until the matching deployment URL is known and ready, unless the report explicitly marks deployment proof as partial.

When Sentry is configured, deployment truth should include only Sentry evidence that `405-sf-prod` can see from a supplied/visible issue or event pointer, plus PM2/Doppler fallback evidence when no pointer exists. Skills must not assume direct Sentry dashboard access. Do not treat missing Sentry evidence as full product proof.

For projects whose deploy, APK, or release artifact is built through GitHub Actions on Blacksmith runners, `004-sf-deploy` must route Blacksmith log and SSH debugging to `405-sf-prod`; it should not duplicate Blacksmith internals. If `405-sf-prod` reports that Blacksmith SSH inspection is required but unavailable because the job already ended, keep the release verdict partial or blocked and recommend a failure-only keepalive step or Blacksmith Monitor VM retention.

If `405-sf-prod` finds a failed build, runtime error, pending deployment timeout, missing URL, or logs that require repair, stop and route to the appropriate repair path:

- `/105-sf-check fix` for local build/check failures
- `/106-sf-fix [deploy/runtime issue]` for narrow defects
- `/100-sf-spec [release incident]` for risky or cross-system incidents

## Phase 5 — Post-Deploy Evidence Routing

Choose proof based on the release scope:

- Auth, OAuth, cookies, sessions, callbacks, tenants, protected routes -> `/109-sf-auth-debug [target]`
- Non-auth route, visual state, screenshot, console, network, or page assertion -> `/108-sf-browser [URL] [objective]`
- Full user flow, human confirmation, retest, or durable QA record -> `/107-sf-test --preview|--prod [scope]`
- No browser/manual proof needed -> state why and continue to `103-sf-verify`

Do not invent proof. If the evidence is not collected, report it as missing and keep the release verdict partial or blocked.

## Phase 6 — Verify

Run or route through:

```text
/103-sf-verify [spec or release scope]
```

`103-sf-verify` must check the user story, success and error behavior, bug gate, documentation coherence, and project development mode implications. If verification fails, stop and return the corrective next step.

## Phase 7 — Changelog Route

If the release is verified and `no-changelog` is absent, route to:

```text
/304-sf-changelog
```

Skip changelog only when:

- the change is internal or no meaningful user-facing release note exists
- the user passed `no-changelog`
- the release remains partial or blocked

Do not treat changelog generation as proof of release health.

## Stop Conditions

Stop and report `blocked` when:

- release scope is ambiguous
- checks fail and the user did not request a force-through path
- `005-sf-ship` blocks or push fails
- deployment state cannot be matched to the shipped commit/branch
- `405-sf-prod` reports failed, pending-timeout, or partial deployment truth
- required browser/auth/manual proof is missing
- `103-sf-verify` fails
- public docs or support copy are known stale for the changed behavior
- the release would include unrelated dirty files without explicit approval
- logs or screenshots would expose secrets or private data

## Final Report

```text
## Deploy: [project or scope]

Result: [deployed / partial / blocked / rerouted]
Environment: [local / preview / production / unknown]
Development mode: [local / vercel-preview-push / hybrid / unknown]

Phases:
- Scope and risk gate -> [status]
- 105-sf-check -> [pass/fail/skipped/not needed]
- 005-sf-ship -> [shipped/blocked/not run]
- 405-sf-prod -> [ready/failed/pending/partial/not run]
- Evidence routing -> [108-sf-browser/109-sf-auth-debug/107-sf-test/not needed/missing]
- 103-sf-verify -> [verified/partial/failed/not run]
- 304-sf-changelog -> [updated/skipped/not run]

Evidence:
- Commit: [sha or none]
- Deployment URL: [url or none]
- Browser/manual proof: [summary or missing]
- Logs: [summary or not collected]
- Sentry: [issue/event summary | no direct dashboard access; PM2/Doppler checked | no pointer supplied | not applicable]

Risks or gaps:
- [item or none]

Next step:
- [command or none]

## Chantier

Skill courante: 004-sf-deploy
Chantier: [spec path | non applicable | non trace]
Trace spec: [ecrite | non ecrite | non applicable]
Flux:
- 100-sf-spec: [status]
- 101-sf-ready: [status]
- 102-sf-start: [status]
- 103-sf-verify: [status]
- 104-sf-end: [status]
- 005-sf-ship: [status]

Reste a faire:
- [item or None]

Prochaine etape:
- [command or none]

Verdict 004-sf-deploy:
- [deployed | partial | blocked | rerouted]
```

## Rules

- Keep release truth evidence-based.
- Prefer blocking over overstating readiness.
- Follow the shared master delegation reference for delegated sequential defaults and spec/batch-gated parallelism.
- Use existing skills for implementation, ship, deploy, and proof internals.
- Never print secrets, cookies, tokens, private headers, or raw sensitive logs.
- Never print raw Sentry payloads, breadcrumbs, replay contents, headers, cookies, tokens, private URLs, or PII; report redacted issue/event pointers only.
- Never mutate production data, send emails, publish content, charge money, or delete records during deploy proof without explicit approval.
