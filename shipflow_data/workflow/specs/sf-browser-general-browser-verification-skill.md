---
artifact: spec
metadata_schema_version: "1.0"
artifact_version: "1.0.0"
project: ShipFlow
created: "2026-05-02"
created_at: "2026-05-02 05:53:05 UTC"
updated: "2026-05-02"
updated_at: "2026-05-02 11:36:16 UTC"
status: ready
source_skill: sf-spec
source_model: "GPT-5 Codex"
scope: feature
owner: Diane
user_story: "As a ShipFlow user working with agents on local sites, previews, and production deployments, I want a general browser verification skill that opens a URL and checks an observable objective, so I can get reliable browser evidence without misusing sf-auth-debug outside its auth-specialized role."
confidence: high
risk_level: medium
security_impact: yes
docs_impact: yes
linked_systems:
  - skills/sf-browser/SKILL.md
  - skills/sf-browser/references/browser-evidence.md
  - skills/references/playwright-mcp-runtime.md
  - skills/sf-auth-debug/SKILL.md
  - skills/sf-test/SKILL.md
  - skills/sf-prod/SKILL.md
  - skills/sf-verify/SKILL.md
  - skills/sf-start/SKILL.md
  - skills/sf-fix/SKILL.md
  - skills/sf-help/SKILL.md
  - README.md
  - site/src/content/skills/sf-browser.md
  - GUIDELINES.md
  - shipflow-spec-driven-workflow.md
  - docs/technical/skill-runtime-and-lifecycle.md
depends_on:
  - artifact: "GUIDELINES.md"
    artifact_version: "1.3.0"
    required_status: "reviewed"
  - artifact: "docs/technical/skill-runtime-and-lifecycle.md"
    artifact_version: "1.3.0"
    required_status: "reviewed"
  - artifact: "skills/references/playwright-mcp-runtime.md"
    artifact_version: "1.1.0"
    required_status: "active"
  - artifact: "shipflow-spec-driven-workflow.md"
    artifact_version: "0.8.0"
    required_status: "draft"
  - artifact: "docs/technical/code-docs-map.md"
    artifact_version: "1.0.0"
    required_status: "reviewed"
supersedes: []
evidence:
  - "User request 2026-05-02: create future skill sf-browser after Playwright MCP Linux ARM64 Chrome-stable config issue."
  - "User decision context 2026-05-02: sf-auth-debug should stay auth-specialized; a general browsing skill should cover non-auth browser checks."
  - "User decision 2026-05-02: the full spec contract, including the User Story, must be in English and must follow the strict ShipFlow language doctrine."
  - "skills/sf-auth-debug/SKILL.md owns Clerk, Supabase Auth, OAuth, callbacks, sessions, protected routes, and browser auth flows."
  - "skills/sf-test/SKILL.md owns guided manual QA, test logs, bug dossiers, and human flow confirmation."
  - "skills/sf-prod/SKILL.md owns deployment status, Vercel/runtime logs, and live deployment health checks."
  - "docs/technical/skill-runtime-and-lifecycle.md requires Playwright MCP runtime preflight before browser evidence."
  - "skills/references/playwright-mcp-runtime.md forbids Linux ARM64 fallback to Google Chrome stable and points stale MCP config to BUG-2026-05-02-001."
  - "Context7 /microsoft/playwright-mcp checked 2026-05-02: Playwright MCP exposes browser navigation, snapshots, screenshots, console messages, network requests, headless/browser/executable configuration, and isolated/user-data-dir controls."
next_step: "None"
---

# Spec: sf-browser General Browser Verification Skill

## Title

sf-browser General Browser Verification Skill

## Status

ready

## User Story

As a ShipFlow user working with agents on local sites, previews, and production deployments, I want a general browser verification skill that opens a URL and checks an observable objective, so I can get reliable browser evidence without misusing `sf-auth-debug` outside its auth-specialized role.

## Minimal Behavior Contract

When the user invokes `sf-browser` with a URL, route, environment, or visible objective, the skill must verify the requested surface in a real browser or explain why it cannot. It produces a concise report containing the target URL, browser runtime, observed state, requested assertion, relevant console/network evidence, screenshot or snapshot evidence when useful, limits, and next action. On failure, it distinguishes runtime failure, deployment failure, application failure, auth requirement, manual-test requirement, and unsafe action. The easy-to-miss edge case is a false diagnosis: a Playwright MCP failure caused by the wrong ARM64 Chrome fallback, an undeployed preview, or an auth flow must be routed before the skill concludes that the app is broken.

## Success Behavior

- Preconditions: an explicit or derivable URL exists, the validation surface is clear, and the Playwright MCP runtime passes `skills/references/playwright-mcp-runtime.md` preflight.
- Trigger: the user runs `/sf-browser <URL or scope> <objective>`, or another skill routes to `sf-browser` for non-auth browser evidence.
- User/operator result: the report states what was opened, what was expected, what was observed, whether the objective passed or failed, which evidence was collected, which limits apply, and which ShipFlow command should follow.
- System effect: no project file is modified by default, and no tracker is written unless a downstream skill such as `sf-test` or `sf-fix` takes over.
- Success proof: a visible assertion, accessibility snapshot, screenshot, targeted console/network summary, or observable HTTP status confirms the requested objective.
- Silent success: not allowed; every browser verification must produce a short report with runtime, target, verdict, evidence, and limits.

## Error Behavior

- Expected failures: missing URL, unreachable URL, local server not running, unconfirmed Vercel preview, stale or misconfigured Playwright MCP, timeout, route 404/500, console error, network failure, auth wall, OAuth/provider block, consent/cookie modal, destructive action, visible secret, or sensitive data in logs.
- User/operator response: the report must name the blocker, state whether browser evidence is invalid or partial, and route to `/sf-fix`, `/sf-auth-debug`, `/sf-prod`, `/sf-test`, `/sf-ship`, or `/sf-spec` as appropriate.
- System effect: no destructive action, no sensitive form submission, and no persistence or reporting of secrets, cookies, tokens, complete headers, raw HAR data, localStorage, sessionStorage, or PII.
- Must never happen: launch Playwright MCP without runtime preflight when browser proof is required, use `npx playwright install chrome` as the Linux ARM64 fix, click an irreversible action without explicit approval, treat an auth wall as proof of an app bug, or paste secrets into a report.
- Silent failure: not allowed; if navigation, snapshot, screenshot, console, or network evidence cannot be read, the report must say which proof is missing and why.

## Problem

ShipFlow has several skills that touch browser evidence, but none is the correct general entrypoint for "open this site and verify this observable thing."

`sf-auth-debug` is intentionally specialized for Clerk, Supabase Auth, OAuth, cookies, callbacks, sessions, tenants, protected routes, and auth propagation. Using it for a landing page, layout, public route, console error, or non-auth preview dilutes its contract.

`sf-test` owns guided manual QA and durable test logging, often with human confirmation. `sf-prod` owns deployment status, logs, and production state. `sf-verify` judges readiness against a scope. ShipFlow needs a short, robust skill that collects one-off browser proof without assuming auth, without writing bug dossiers by default, and without forgetting the Playwright MCP Linux ARM64 runtime fix.

## Solution

Create `sf-browser` as the generic ShipFlow skill for browser navigation, quick visual inspection, console/network review, accessibility snapshots, screenshots, and visible assertions on local, preview, or production surfaces. Keep `sf-auth-debug` as the auth specialist and define explicit handoffs to `sf-auth-debug`, `sf-test`, `sf-prod`, `sf-fix`, `sf-ship`, and `sf-verify`.

## Scope In

- Create `skills/sf-browser/SKILL.md` with a compact general browser verification contract.
- Classify `sf-browser` as `conditionnel` for chantier tracing and `source-de-chantier` for incidents or regressions it detects.
- Load `skills/references/playwright-mcp-runtime.md` before any Playwright MCP call.
- Define accepted inputs: URL, route, local project, preview/production URL, visible assertion, console/network objective, viewport, optional screenshot, or request such as "verify that X appears."
- Define the standard report: target, environment, runtime, objective, observations, verdict, evidence collected, limits, and next action.
- Define a read-only default policy: navigation, snapshot, screenshot, console, and network review are allowed; clicks and form fills are limited to reversible actions or explicitly approved actions.
- Define handoffs: auth to `sf-auth-debug`, deployment URL/log uncertainty to `sf-prod`, durable QA to `sf-test`, actionable bug to `sf-fix`, preview-push validation to `sf-ship` then `sf-prod`, and non-trivial chantier follow-up to `sf-spec`.
- Add `skills/sf-browser/references/browser-evidence.md` for evidence families, redaction, wording, limits, and verdict labels.
- Update skills that mention browser evidence so they route to `sf-browser` when the issue is not auth.
- Update technical docs, README guidance, and help/catalog surfaces that list skills or browser/auth paths.
- Enforce the ShipFlow language doctrine: internal contracts in English, user-facing interaction in the user's active language, natural accented French when the active language is French, and stable machine anchors in English.

## Scope Out

- Replace `sf-auth-debug` for Clerk, Supabase Auth, OAuth, callback, cookie, session, tenant, or protected-route debugging.
- Replace `sf-test` for manual QA scenarios, `TEST_LOG.md`, `BUGS.md`, `bugs/`, durable retests, or user-flow test records.
- Replace `sf-prod` for discovering a deployment URL, waiting for Vercel, reading runtime logs, or diagnosing a production outage.
- Fix application code directly; `sf-browser` detects and routes to `sf-fix` or `sf-start`.
- Automate real Google/SSO/MFA login or bypass provider protection.
- Store raw HAR files, sensitive screenshots, cookies, localStorage, sessionStorage, tokens, complete headers, or private payloads.
- Install Chrome stable or repair the Playwright environment; that path remains `sf-fix BUG-2026-05-02-001` or installer/runtime work.

## Constraints

- `sf-browser` must stay short; repeatable evidence detail belongs in `skills/sf-browser/references/browser-evidence.md`.
- All internal `SKILL.md` instructions, workflow rules, stop conditions, acceptance criteria, validation notes, and technical documentation created or edited for this chantier must be in English.
- User-facing report text produced by `sf-browser` must use the user's active language or the project's active language; French user-facing output must be natural and accented.
- Stable machine-readable anchors remain English even when a report is localized, including `Status`, `Scope In`, `Acceptance Criteria`, `Skill Run History`, and command names.
- Browser evidence is invalid if Playwright MCP runtime preflight has not passed.
- On Linux ARM64, never run or recommend `npx playwright install chrome`; use Playwright Chromium, Chromium Headless Shell, or the `--browser chromium` fallback.
- If MCP still reports `/opt/google/chrome/chrome` after the config is correct, classify the current MCP process as stale, stop browser proof, and request reload.
- Respect project development mode: in `vercel-preview-push`, local browser evidence cannot validate deployed preview behavior.
- Production actions are read-only by default; any interaction that can mutate data, buy, delete, publish, send email, or change an account requires explicit approval.
- Reports must redact secrets, cookies, tokens, PII, sensitive headers, and private payloads.
- A loaded page is not enough proof for auth, permissions, billing, data isolation, webhooks, or multi-step flows.

## Dependencies

- Runtime: Playwright MCP through the current Codex/Claude MCP config, configured with an existing Chromium executable or explicit Chromium fallback.
- Runtime tools: `mcp__playwright__browser_navigate`, `browser_snapshot`, `browser_take_screenshot`, `browser_console_messages`, `browser_network_requests`, `browser_resize`, `browser_click`, `browser_fill_form`, and related Playwright MCP tools when available.
- Document contracts: `GUIDELINES.md` 1.3.0, `docs/technical/skill-runtime-and-lifecycle.md` 1.3.0, `skills/references/playwright-mcp-runtime.md` 1.1.0, `shipflow-spec-driven-workflow.md` 0.8.0, `docs/technical/code-docs-map.md` 1.0.0.
- Skill dependencies: `sf-auth-debug`, `sf-test`, `sf-prod`, `sf-verify`, `sf-start`, `sf-fix`, `sf-help`.
- Fresh external docs: checked 2026-05-02 through Context7 `/microsoft/playwright-mcp`. Current docs support navigation, snapshots, screenshots, console/network tools, click/fill interactions, headless/browser options, executable-path style launch configuration, isolated mode, and user-data-dir controls.
- Metadata gaps: none blocking for this spec. `shipflow-spec-driven-workflow.md` is draft, so implementation must update or explicitly no-impact the workflow doc according to the docs map.

## Invariants

- `sf-browser` answers: what did the browser actually see on this URL for this objective?
- `sf-auth-debug` answers: where does the auth/session/provider/callback/protected flow break?
- `sf-test` answers: what real user scenario was tested, by whom or by what evidence, and how should it be logged?
- `sf-prod` answers: which deployment is live or preview-ready, and what do deployment/runtime logs say?
- `sf-browser` may collect proof, but it must not claim readiness for a whole feature unless the requested objective is that narrow.
- `sf-browser` must never diagnose app behavior from a stale or misconfigured browser runtime.
- `sf-browser` must keep evidence minimal, redacted, and relevant to the stated objective.
- `sf-browser` must prefer accessibility snapshots, visible DOM, and targeted console/network summaries over raw dumps.
- `sf-browser` must preserve ShipFlow language doctrine across skill instructions, reference docs, user-facing reports, and examples.
- If a finding crosses the chantier threshold, `sf-browser` reports `Chantier potentiel` and routes to `/sf-spec` rather than creating a spec itself.

## Links & Consequences

- Upstream systems: user requests, `sf-start` validation routing, `sf-verify` evidence needs, `sf-test` preflight evidence, `sf-prod` live URL confirmation, `sf-fix` reproduction requests.
- Downstream systems: `sf-auth-debug` for auth, `sf-test` for durable manual QA and bug logging, `sf-fix` for direct bugs, `sf-prod` for deployment/log uncertainty, `sf-ship` for preview-push validation, `sf-spec` for non-trivial follow-up.
- Cross-cutting checks: security redaction, production mutation safety, development-mode correctness, browser runtime correctness, language doctrine, docs coherence, and skill budget.
- Regression impact: existing `sf-auth-debug` routes remain valid; only non-auth browser checks move to `sf-browser`.
- Operational consequence: skills that currently say "use Playwright" must say whether they mean generic `sf-browser` or auth-specific `sf-auth-debug`.

## Documentation Coherence

- `skills/sf-help/SKILL.md` must list `/sf-browser` with concise usage and distinguish it from `/sf-auth-debug`, `/sf-test`, and `/sf-prod`.
- `README.md` should add a generic browser verification path near the existing auth/browser diagnostic path.
- `shipflow-spec-driven-workflow.md` should mention `sf-browser` only where support/source skills or validation evidence paths are listed.
- `docs/technical/skill-runtime-and-lifecycle.md` should mention `sf-browser` as the generic Playwright MCP consumer and preserve the shared runtime preflight invariant.
- `skills/sf-auth-debug/SKILL.md` should point non-auth browser checks to `sf-browser`, while retaining auth ownership.
- `skills/sf-test/SKILL.md` should route direct tool-collected browser evidence to `sf-browser` when no durable manual test log is needed.
- `skills/sf-prod/SKILL.md` should route post-deploy page checks to `sf-browser` after the deployment URL is confirmed.
- `skills/sf-verify/SKILL.md` and `skills/sf-start/SKILL.md` should mention `sf-browser` for non-auth browser proof.
- Public site skill pages may need update if they expose the skill catalog; confirm via `docs/technical/code-docs-map.md` during implementation.
- Documentation and skill-contract edits must follow `GUIDELINES.md` language doctrine: internal contracts in English, localized user-facing interaction where relevant.

## Edge Cases

- The URL is local but no dev server is running: report blocked and suggest the project-specific start path, not a browser bug.
- The project is `vercel-preview-push`: route to `/sf-ship` then `/sf-prod` before treating preview browser evidence as authoritative.
- The requested page requires login: route to `sf-auth-debug` if the objective is auth/session behavior; otherwise report auth wall as a precondition.
- The visible page is correct but console has severe errors: report partial pass with console risk, not clean pass.
- The network request fails with 401/403/500: include sanitized endpoint/status and route by likely owner.
- A cookie banner, interstitial, or provider page blocks the requested assertion: report the blocker and avoid unsafe bypass.
- The requested action would mutate production data: ask for explicit approval or route to a safe test environment.
- MCP runtime path is correct in config but the tool still tries `/opt/google/chrome/chrome`: classify stale MCP process and do not diagnose the app.
- Snapshot is empty but screenshot shows content, or screenshot is blank but snapshot has DOM: report evidence mismatch and avoid overclaiming.
- The user asks for "check everything": narrow to a short explicit objective or route to `sf-test` for scenario planning.
- The user invokes the skill in French: the user-facing report is in natural accented French, while internal headings, commands, and stable anchors stay English.

## Implementation Tasks

- [x] Task 1: Create the generic browser skill contract
  - File: `skills/sf-browser/SKILL.md`
  - Action: Add a new English-language skill with frontmatter, canonical path loading, chantier classification `conditionnel/source-de-chantier`, Playwright MCP runtime preflight, input triage, read-only defaults, report format, handoff rules, language-doctrine rules, and security redaction constraints.
  - User story link: Provides the general `/sf-browser` entrypoint for browser evidence.
  - Depends on: None
  - Validate with: `rg -n "name: sf-browser|playwright-mcp-runtime|Chantier Tracking|sf-auth-debug|sf-test|sf-prod|read-only|Language Doctrine" skills/sf-browser/SKILL.md`
  - Notes: Keep the SKILL body concise; move detailed evidence policy to Task 2 if it grows.

- [x] Task 2: Add the browser evidence reference
  - File: `skills/sf-browser/references/browser-evidence.md`
  - Action: Document evidence types, redaction rules, console/network summary limits, screenshot/snapshot use, production interaction safety, localized report wording, and standard verdict labels.
  - User story link: Makes browser proof reliable and safe without bloating the skill body.
  - Depends on: Task 1
  - Validate with: `python3 tools/shipflow_metadata_lint.py skills/sf-browser/references/browser-evidence.md`
  - Notes: Reference should include frontmatter because it is a durable ShipFlow technical guideline.

- [x] Task 3: Route non-auth browser work away from sf-auth-debug
  - File: `skills/sf-auth-debug/SKILL.md`
  - Action: Add a short boundary rule: use `sf-browser` for public UI, visual, console, network, and non-auth navigation checks; keep `sf-auth-debug` for auth/session/provider/callback/protected flows.
  - User story link: Preserves `sf-auth-debug` as a specialist.
  - Depends on: Task 1
  - Validate with: `rg -n "sf-browser|non-auth|Clerk|OAuth|session|protected" skills/sf-auth-debug/SKILL.md`
  - Notes: Do not remove existing Playwright auth reference or provider references.

- [x] Task 4: Update testing and production routing
  - File: `skills/sf-test/SKILL.md`
  - Action: Route one-off browser proof to `sf-browser` when no guided manual QA log or bug dossier is needed; keep `sf-test` ownership over scenario planning, test logs, retests, and bug records.
  - User story link: Prevents `sf-test` from being used as a lightweight browser checker.
  - Depends on: Task 1
  - Validate with: `rg -n "sf-browser|browser evidence|TEST_LOG.md|BUGS.md|sf-auth-debug" skills/sf-test/SKILL.md`
  - Notes: Keep the existing rule that results are not logged before evidence exists.

- [x] Task 5: Update production and verification handoffs
  - File: `skills/sf-prod/SKILL.md`
  - Action: After `sf-prod` confirms a deployment URL, route page-level browser assertions to `sf-browser`; keep deploy status, Vercel logs, and runtime logs in `sf-prod`.
  - User story link: Separates live URL discovery from browser observation.
  - Depends on: Task 1
  - Validate with: `rg -n "sf-browser|deployment URL|browser|runtime logs|Vercel" skills/sf-prod/SKILL.md`
  - Notes: This is a routing addition only.

- [x] Task 6: Update lifecycle skill references
  - File: `skills/sf-verify/SKILL.md`
  - Action: Mention `sf-browser` as the support skill for non-auth browser evidence during verification, with `sf-auth-debug` reserved for auth/session/protected flow risk.
  - User story link: Lets verification request the right browser proof.
  - Depends on: Task 1
  - Validate with: `rg -n "sf-browser|sf-auth-debug|browser evidence|protected|session" skills/sf-verify/SKILL.md`
  - Notes: Do not make `sf-verify` delegate automatically if the current environment forbids it.

- [x] Task 7: Update implementation routing for browser-dependent tasks
  - File: `skills/sf-start/SKILL.md`
  - Action: Add `sf-browser` to validation routing for non-auth browser flows and preserve preview-push rules before browser/manual proof.
  - User story link: Ensures implementation work asks for the right browser proof at the right time.
  - Depends on: Task 1
  - Validate with: `rg -n "sf-browser|preview-push|sf-auth-debug|browser/manual" skills/sf-start/SKILL.md`
  - Notes: Keep `sf-start` from treating local browser checks as preview proof.

- [x] Task 8: Update bug-first routing
  - File: `skills/sf-fix/SKILL.md`
  - Action: Route browser reproduction that is not auth-specific through `sf-browser`; keep auth/browser-session bugs routed to `sf-auth-debug`.
  - User story link: Makes bug reproduction use the right diagnostic skill.
  - Depends on: Task 1
  - Validate with: `rg -n "sf-browser|sf-auth-debug|browser|auth|reproduce" skills/sf-fix/SKILL.md`
  - Notes: If `sf-fix` finds a direct bug while using browser evidence, it still owns the fix attempt.

- [x] Task 9: Update help and workflow docs
  - File: `skills/sf-help/SKILL.md`
  - Action: Add `/sf-browser` to the skill catalog, examples, and mode notes; distinguish it from `/sf-auth-debug`, `/sf-test`, and `/sf-prod`.
  - User story link: Makes the new skill discoverable.
  - Depends on: Tasks 1-8
  - Validate with: `rg -n "/sf-browser|sf-auth-debug|sf-test|sf-prod" skills/sf-help/SKILL.md`
  - Notes: Keep examples short.

- [x] Task 10: Update README browser workflow
  - File: `README.md`
  - Action: Add a concise generic browser verification path and keep the existing auth/browser diagnostic path for `sf-auth-debug`.
  - User story link: Documents when to use the new skill.
  - Depends on: Tasks 1-9
  - Validate with: `rg -n "sf-browser|Auth/browser diagnostic|browser verification" README.md`
  - Notes: Avoid overexplaining implementation details in public-facing README prose.

- [x] Task 11: Update technical lifecycle docs
  - File: `docs/technical/skill-runtime-and-lifecycle.md`
  - Action: Record `sf-browser` as the generic Playwright MCP browser evidence skill and preserve the mandatory `playwright-mcp-runtime.md` preflight.
  - User story link: Keeps code-proximate docs aligned with skill runtime behavior.
  - Depends on: Tasks 1-10
  - Validate with: `python3 tools/shipflow_metadata_lint.py docs/technical/skill-runtime-and-lifecycle.md`
  - Notes: Update `updated` and evidence metadata if implementation changes the doc.

- [x] Task 12: Update workflow doctrine if the skill catalog is described there
  - File: `shipflow-spec-driven-workflow.md`
  - Action: Add `sf-browser` only where support/source skills or validation evidence paths are listed.
  - User story link: Keeps lifecycle routing coherent for future agents.
  - Depends on: Tasks 1-11
  - Validate with: `python3 tools/shipflow_metadata_lint.py shipflow-spec-driven-workflow.md`
  - Notes: If the file does not mention comparable skill routing, record a no-impact justification instead of forcing a broad rewrite.

- [x] Task 13: Run skill validation and routing checks
  - File: `skills/`
  - Action: Run skill budget audit, metadata lint for new reference/docs/spec, and targeted `rg` checks proving the new routing exists.
  - User story link: Proves the new skill is discoverable and not over budget.
  - Depends on: Tasks 1-12
  - Validate with: `python3 tools/skill_budget_audit.py --skills-root skills --format markdown`
  - Notes: Also run `python3 tools/shipflow_metadata_lint.py specs/sf-browser-general-browser-verification-skill.md skills/sf-browser/references/browser-evidence.md docs/technical/skill-runtime-and-lifecycle.md shipflow-spec-driven-workflow.md` after relevant files exist.

## Acceptance Criteria

- [ ] AC 1: Given `/sf-browser https://example.com "verify Example Domain is visible"`, when runtime preflight passes, then the report includes the target URL, runtime status, observed text/snapshot evidence, verdict, and limits.
- [ ] AC 2: Given Playwright MCP config still falls back to `/opt/google/chrome/chrome` on Linux ARM64, when `sf-browser` starts, then it refuses browser evidence and routes to `/sf-fix BUG-2026-05-02-001`.
- [ ] AC 3: Given config is good but MCP still errors with `/opt/google/chrome/chrome`, when `sf-browser` runs, then it reports stale MCP process and asks for Codex/MCP reload before diagnosing the app.
- [ ] AC 4: Given the objective mentions Clerk, Supabase Auth, OAuth, callback, session, cookie, tenant, or protected route behavior, when `sf-browser` triages the request, then it routes to `/sf-auth-debug` instead of continuing as generic browser verification.
- [ ] AC 5: Given the target is a Vercel preview-push project without a confirmed deployment URL, when the user asks for browser validation, then `sf-browser` routes to `/sf-ship` then `/sf-prod` before treating preview evidence as authoritative.
- [ ] AC 6: Given a production URL and an objective that only requires reading page state, when `sf-browser` runs, then it avoids mutating actions and reports only redacted relevant evidence.
- [ ] AC 7: Given the requested check requires submitting a form, deleting, buying, publishing, sending an email, or changing account data, when no explicit approval exists, then `sf-browser` refuses or asks for approval and does not click through.
- [ ] AC 8: Given a visible pass but severe console or network failures, when `sf-browser` reports, then the verdict is partial or risky rather than clean pass.
- [ ] AC 9: Given a browser finding is actionable but narrow, when `sf-browser` finishes, then it routes to `/sf-fix <summary>` without writing `BUGS.md` or `bugs/` itself.
- [ ] AC 10: Given the user asks for a full manual user-flow QA log, when `sf-browser` triages, then it routes to `/sf-test` because durable test logging is out of scope.
- [ ] AC 11: Given a page-level browser check after `sf-prod` confirms a deployment URL, when `sf-browser` runs, then `sf-prod` remains the source of deployment truth and `sf-browser` remains the source of page observation.
- [ ] AC 12: Given a future agent opens `sf-help`, when it searches for browser verification, then `/sf-browser` is listed and its boundary with `/sf-auth-debug`, `/sf-test`, and `/sf-prod` is clear.
- [ ] AC 13: Given a future agent opens `skills/sf-browser/SKILL.md`, `skills/sf-browser/references/browser-evidence.md`, or touched technical docs, then the internal contract text is English and stable anchors remain English.
- [ ] AC 14: Given the active user/project language is French, when `sf-browser` produces a user-facing report, then the report is natural accented French while commands, anchors, and stable labels remain English.

## Test Strategy

- Unit: None, because this is a skill/doc workflow change without executable production code.
- Integration: Run `python3 tools/skill_budget_audit.py --skills-root skills --format markdown` after adding the skill.
- Integration: Run metadata lint for this spec, the new reference, and touched technical docs.
- Integration: Run targeted `rg` commands from the implementation tasks to prove routing language exists.
- Integration: Run `rg -n "[àâäçéèêëîïôöùûüÿÀÂÄÇÉÈÊËÎÏÔÖÙÛÜŸ]" skills/sf-browser/SKILL.md skills/sf-browser/references/browser-evidence.md docs/technical/skill-runtime-and-lifecycle.md shipflow-spec-driven-workflow.md` after implementation; any match in internal contract prose must be justified as quoted user-facing text or localized example.
- Manual: After MCP reload if needed, invoke a safe browser check against `https://example.com` or a local disposable page and verify the report includes runtime, target, evidence, verdict, and limits.
- Manual: Simulate triage prompts for auth, preview-push, production mutation, stale MCP runtime, and French user-facing output without clicking unsafe actions.

## Risks

- Security impact: yes, because browser evidence can expose cookies, tokens, PII, private payloads, production data, or destructive actions. Mitigation: read-only defaults, redaction rules, no raw HAR/cookie/header dumps, no storage dumps, and explicit approval for mutations.
- Product/data risk: medium, because a general browser skill can overclaim readiness. Mitigation: narrow objective-based verdicts and handoff to `sf-test`, `sf-verify`, `sf-prod`, or `sf-auth-debug`.
- Runtime risk: medium, because stale Playwright MCP config can produce misleading failures. Mitigation: mandatory `playwright-mcp-runtime.md` preflight and explicit stale-process handling.
- Documentation risk: medium, because multiple skills already mention browser evidence. Mitigation: update routing docs and skill catalog together.
- Language-doctrine risk: medium, because the skill touches internal contracts and user-facing report text. Mitigation: internal contract prose in English, localized user-facing interaction, natural accented French when French is active, and explicit acceptance criteria.
- Scope creep risk: medium, because `sf-browser` could become a full QA framework. Mitigation: keep it one-off, read-only, evidence-focused, and route durable QA to `sf-test`.

## Execution Notes

- Read first: `GUIDELINES.md`, `shipflow-spec-driven-workflow.md`, `docs/technical/code-docs-map.md`, `docs/technical/skill-runtime-and-lifecycle.md`, `skills/references/playwright-mcp-runtime.md`, `skills/sf-auth-debug/SKILL.md`, `skills/sf-test/SKILL.md`, `skills/sf-prod/SKILL.md`, `skills/sf-verify/SKILL.md`, `skills/sf-start/SKILL.md`, `skills/sf-fix/SKILL.md`, `skills/sf-help/SKILL.md`.
- Use `skill-creator` guidance for concise skill design and progressive disclosure through references.
- Implementation order: create the new skill and reference first, then update routing in existing skills, then update README/workflow/technical docs, then run validation.
- Use existing ShipFlow skill patterns: frontmatter, canonical path loading, chantier classification, compact skill bodies, references for repeated detail, and explicit final `Chantier` blocks when tracing applies.
- Avoid new packages; this is a Markdown skill and documentation change built around existing MCP tools and ShipFlow references.
- Avoid broad rewrites to shared docs. Add narrow routing and documentation coherence changes only where the spec lists them.
- Preserve existing user edits and unrelated dirty worktree changes.
- Do not edit `TASKS.md`, `AUDIT_LOG.md`, or `PROJECTS.md` for this spec.
- Validate with: `python3 tools/shipflow_metadata_lint.py specs/sf-browser-general-browser-verification-skill.md`
- Validate after implementation with: `python3 tools/skill_budget_audit.py --skills-root skills --format markdown`
- Fresh external docs: Context7 `/microsoft/playwright-mcp` checked on 2026-05-02; use official Playwright MCP docs if behavior changes before implementation.
- Stop conditions: Playwright MCP current docs contradict the assumed tool surface, the Linux ARM64 runtime fix is not accepted as canonical, the user decides to merge `sf-browser` back into `sf-auth-debug`, or the implementation cannot satisfy ShipFlow language doctrine without changing the requested public/user-facing behavior.

## Open Questions

None.

## Skill Run History

| Date UTC | Skill | Model | Action | Result | Next step |
|----------|-------|-------|--------|--------|-----------|
| 2026-05-02 05:53:05 UTC | sf-spec | GPT-5 Codex | Created draft spec for `sf-browser` general browser verification skill after context research across browser/auth/test/prod skills and Playwright MCP runtime docs | draft | /sf-ready sf-browser general browser verification skill |
| 2026-05-02 09:39:56 UTC | sf-ready | GPT-5 Codex | Reviewed readiness for the `sf-browser` general browser verification skill | not ready | /sf-spec sf-browser General Browser Verification Skill |
| 2026-05-02 09:46:41 UTC | sf-spec | GPT-5 Codex | Updated the spec to make the whole implementation contract English, add explicit ShipFlow language-doctrine requirements, and add language acceptance criteria | reviewed | /sf-ready sf-browser General Browser Verification Skill |
| 2026-05-02 09:46:41 UTC | sf-ready | GPT-5 Codex | Re-reviewed readiness after the language-doctrine correction and full English contract update | ready | /sf-start sf-browser General Browser Verification Skill |
| 2026-05-02 10:19:41 UTC | sf-start | GPT-5 Codex | Implemented the `sf-browser` skill, evidence reference, routing handoffs, public skill content, and focused validation checks | implemented | /sf-verify sf-browser General Browser Verification Skill |
| 2026-05-02 10:30:46 UTC | sf-verify | GPT-5 Codex | Verified the `sf-browser` skill contract, routing handoffs, metadata, docs coherence, Playwright MCP freshness, runtime preflight, and safe example browser evidence | verified | /sf-end sf-browser General Browser Verification Skill |
| 2026-05-02 11:36:16 UTC | sf-ship | GPT-5 Codex | Closed and shipped the `sf-browser` skill, Playwright MCP runtime guardrails, routing handoffs, public skill content, skills hub browser-evidence guide, and FAQ discoverability updates | shipped | None |

## Current Chantier Flow

- `sf-spec`: done, spec updated to an English internal contract with explicit language-doctrine requirements.
- `sf-ready`: ready.
- `sf-start`: implemented.
- `sf-verify`: verified.
- `sf-end`: not launched; full closeout handled by this `sf-ship end` run.
- `sf-ship`: shipped.

Next step: `None`
