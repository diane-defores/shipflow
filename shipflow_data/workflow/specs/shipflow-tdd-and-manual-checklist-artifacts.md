---
artifact: spec
metadata_schema_version: "1.0"
artifact_version: "0.1.0"
project: "ShipFlow"
created: "2026-05-24"
created_at: "2026-05-24 17:23:00 UTC"
updated: "2026-05-24"
updated_at: "2026-05-24 17:23:00 UTC"
status: draft
source_skill: sf-spec
source_model: "GPT-5.5 Codex"
scope: workflow
owner: Diane
user_story: "En tant qu'operatrice ShipFlow, je veux que les specs et le TDD generent des checklists de test durables que je peux remplir en PASS/FAIL/BLOCKED dans un fichier, afin d'eviter les copier-coller de chat et de donner aux agents une vraie source de suivi."
confidence: high
risk_level: high
security_impact: yes
docs_impact: yes
linked_systems:
  - skills/sf-spec/SKILL.md
  - skills/sf-spec/references/spec-creation-workflow.md
  - skills/sf-ready/SKILL.md
  - skills/sf-start/SKILL.md
  - skills/sf-start/references/execution-workflow.md
  - skills/sf-test/SKILL.md
  - skills/sf-verify/SKILL.md
  - skills/sf-verify/references/verification-gates.md
  - skills/references/spec-driven-development-discipline.md
  - templates/artifacts/
  - tools/shipflow_metadata_lint.py
depends_on:
  - artifact: "skills/references/spec-driven-development-discipline.md"
    artifact_version: "1.2.0"
    required_status: active
  - artifact: "skills/references/decision-quality-contract.md"
    artifact_version: "1.0.0"
    required_status: active
  - artifact: "templates/artifacts/spec.md"
    artifact_version: "0.1.0"
    required_status: draft
supersedes: []
evidence:
  - "User decision 2026-05-24: TDD should be integrated into ShipFlow skills, not handled as ad hoc chat instructions."
  - "User decision 2026-05-24: manual checklists should be generated during spec or TDD as files that the operator can fill with PASS/FAIL/BLOCKED."
  - "User decision 2026-05-24: agents should use widget tests and agent-run Flutter Web smoke via sf-browser/sf-auth-debug before asking for APK/device testing."
next_step: "/sf-ready ShipFlow TDD and Manual Checklist Artifacts"
---

# Spec: ShipFlow TDD And Manual Checklist Artifacts

## Title

ShipFlow TDD And Manual Checklist Artifacts

## Status

draft

## User Story

En tant qu'operatrice ShipFlow, je veux que les specs et le TDD generent des checklists de test durables que je peux remplir en PASS/FAIL/BLOCKED dans un fichier, afin d'eviter les copier-coller de chat et de donner aux agents une vraie source de suivi.

## Minimal Behavior Contract

ShipFlow must extend its spec-driven lifecycle with a test-driven contract layer: specs and execution skills define automated proof first, then generate a durable manual checklist file only for proof that remains human/device-only. The operator can edit that file directly by marking scenarios `PASS`, `FAIL`, `BLOCKED`, `N/A`, or leaving `NOT_RUN`, with optional observed notes and evidence pointers. `sf-test` must consume that file as source of truth, write compact `TEST_LOG.md` entries, and create or update `bugs/BUG-ID.md` for failing scenarios. The easy edge case is generating a large checklist that becomes another dead document; required scenarios must be scoped, statused, and consumed mechanically by the skills.

## Success Behavior

- Preconditions: A spec, bug, or implementation scope has at least one behavior that cannot be fully proven by automated tests, `sf-browser`, or `sf-auth-debug`.
- Trigger: `sf-spec`, `sf-start`, or `sf-test` determines that manual/operator confirmation is still necessary.
- User/operator result: A Markdown checklist file is created or updated at a predictable project path, and the operator can fill status cells directly without copying results into chat.
- System effect: `sf-test` reads the checklist, records compact test history, opens or updates bug files for failures, and leaves unresolved scenarios visible for `sf-verify`.
- Success proof: Metadata lint for the checklist template, skill `rg` checks proving references are wired, and a dry-run fixture or sample checklist showing `PASS`, `FAIL`, `BLOCKED`, and `NOT_RUN` interpretation.
- Silent success: Not allowed. Checklist creation, consumed statuses, generated bug IDs, and remaining gaps must be reported.

## Error Behavior

- Expected failures: checklist missing, malformed status, duplicate scenario IDs, missing expected result, failing scenario without observed behavior, evidence path escaping repo root, or manual checklist not linked from the spec.
- User/operator response: The responsible skill reports the exact checklist issue and asks for only the missing field or routes to regenerate the checklist.
- System effect: Do not mark tests passed, do not close bugs, and do not claim verification while required checklist scenarios are `FAIL`, `BLOCKED`, or `NOT_RUN`.
- Must never happen: invented PASS results, overwritten operator notes, raw secrets in observed/evidence fields, full logs pasted into checklist tables, or APK/device testing requested before cheaper proofs are attempted.
- Silent failure: Not allowed. Invalid or incomplete checklists must produce an explicit `partial`, `blocked`, or `not verified` verdict.

## Problem

ShipFlow currently handles manual proof mostly through chat prompts and compact `TEST_LOG.md` entries. That creates friction for the operator, encourages copy-paste, and gives agents weak durable state. It also makes TDD feel separate from spec-driven development, even though manual proof should be part of the same test contract.

## Solution

Introduce a durable `manual_test_checklist` artifact and teach `sf-spec`, `sf-start`, `sf-test`, and `sf-verify` to generate, consume, and verify it. The spec remains the source of behavior; the checklist becomes the operator-editable execution surface for manual scenarios.

## Scope In

- Add `templates/artifacts/manual_test_checklist.md`.
- Define a canonical project path for generated checklists: `shipflow_data/workflow/test-checklists/<scope>.md`.
- Update spec creation rules so non-trivial specs include a `Test Contract` and link to a checklist when manual proof is expected.
- Update `sf-start` execution rules so TDD/test-first work creates or updates checklist artifacts when human/device-only proof remains.
- Update `sf-test` to read checklist files, normalize statuses, write compact `TEST_LOG.md`, and create/update bug records for failed rows.
- Update `sf-verify` to treat required checklist scenarios as verification evidence and block/partial when required rows are unresolved.
- Preserve Flutter mobile proof ladder: widget tests, agent-run Flutter Web smoke via `sf-browser`/`sf-auth-debug`, then APK/device-only checklist rows.

## Scope Out

- No full test runner implementation for Flutter, Patrol, Maestro, Firebase Test Lab, or Playwright in this spec.
- No migration of historical `TEST_LOG.md` entries.
- No replacement of `bugs/BUG-ID.md`; checklists point to bug files, they do not become bug dossiers.
- No automatic mutation of production data during checklist execution.

## Constraints

- The checklist must be easy for the operator to edit by hand.
- The checklist must be machine-readable enough for agents to parse with simple Markdown/table logic.
- Agents must preserve operator-entered notes and statuses.
- `TEST_LOG.md` remains compact; full failed context belongs in `bugs/BUG-ID.md`.
- Sensitive evidence must be redacted and stored by pointer, not pasted raw.
- Existing dirty worktree changes must not be reverted or overwritten during implementation.

## Dependencies

- Runtime: Markdown parsing only; no new runtime dependency required unless implementation proves it necessary.
- Document contracts: `spec-driven-development-discipline.md`, `decision-quality-contract.md`, existing spec template, bug record template, and `sf-test` bug lifecycle.
- Metadata gaps: `manual_test_checklist` is a new artifact type and may require `tools/shipflow_metadata_lint.py` support.

## Invariants

- Specs define expected behavior; checklists only execute or record proof.
- A checklist row cannot be considered passing unless an operator or agent observed the result.
- Failed checklist rows must link to a bug file or a concrete next action.
- Required checklist rows with `FAIL`, `BLOCKED`, or `NOT_RUN` prevent a clean `sf-verify` verdict.
- APK/device manual rows are only required after cheaper proof surfaces are attempted or ruled out.

## Links & Consequences

- Upstream systems: `sf-spec`, `sf-ready`, `sf-start`, `sf-test`, `sf-verify`, bug lifecycle, spec-driven development discipline.
- Downstream systems: `TEST_LOG.md`, `bugs/BUG-ID.md`, `test-evidence/BUG-ID/`, final ship readiness, operator workflow.
- Cross-cutting checks: redaction, path safety, metadata lint, skill runtime sync, public skill docs if behavior promises change.

## Documentation Coherence

- Update `sf-test` README and public skill page if they describe manual QA prompts but not checklist files.
- Update `sf-help` catalog if it describes `sf-test` as chat-only guided manual QA.
- Update `spec-driven-development-discipline.md` to include checklist artifacts as part of proof-first/TDD.
- Update `templates/artifacts/spec.md` or `sf-spec` workflow so future specs know where `Test Contract` and checklist links belong.

## Edge Cases

- Operator marks `FAIL` but leaves observed behavior blank.
- Operator writes lowercase `pass` or French `réussi`; parser should normalize only documented aliases or ask for clarification.
- Multiple rows fail the same underlying bug; `sf-test` should avoid duplicate bug files when reproduction and observed behavior clearly match.
- Checklist contains optional exploratory rows; unresolved optional rows should not block verification.
- Checklist references an evidence path outside the repo; `sf-test` must reject or ask for a safe pointer.
- Auth flow row belongs to `sf-auth-debug`, not generic `sf-browser`.
- Flutter UI row is Web-testable but checklist jumps straight to APK; verification must flag the proof order gap.

## Implementation Tasks

- [ ] Task 1: Add manual checklist artifact template
  - File: `templates/artifacts/manual_test_checklist.md`
  - Action: Define frontmatter, status vocabulary, scenario table, operator-fill rules, redaction rules, evidence pointer rules, and maintenance rule.
  - User story link: Gives the operator a file to fill instead of replying in chat.
  - Depends on: None
  - Validate with: `python3 tools/shipflow_metadata_lint.py templates/artifacts/manual_test_checklist.md`
  - Notes: Use statuses `NOT_RUN`, `PASS`, `FAIL`, `BLOCKED`, `N/A`.

- [ ] Task 2: Teach metadata lint the new artifact type if needed
  - File: `tools/shipflow_metadata_lint.py`
  - Action: Accept `artifact: manual_test_checklist` with required metadata fields, or document why the existing technical artifact schema is reused.
  - User story link: Keeps generated checklists durable and auditable.
  - Depends on: Task 1
  - Validate with: `python3 tools/shipflow_metadata_lint.py templates/artifacts/manual_test_checklist.md`
  - Notes: Do not lint `TEST_LOG.md`.

- [ ] Task 3: Add Test Contract and checklist generation rules to spec creation
  - File: `skills/sf-spec/references/spec-creation-workflow.md`
  - Action: Require a `Test Contract` section for non-trivial specs: automated tests, agent-run browser/auth proof, manual checklist path, device-only proof, and explicit exceptions.
  - User story link: Makes TDD part of the spec, not an afterthought.
  - Depends on: Task 1
  - Validate with: `rg -n "Test Contract|manual_test_checklist|test-checklists|PASS|FAIL|BLOCKED" skills/sf-spec/references/spec-creation-workflow.md`
  - Notes: Specs should link the checklist path when one is generated.

- [ ] Task 4: Update spec template with Test Contract placeholder
  - File: `templates/artifacts/spec.md`
  - Action: Add `Test Contract` after `Acceptance Criteria` or before `Test Strategy`, with manual checklist link and proof ladder fields.
  - User story link: Makes future specs mechanically consistent.
  - Depends on: Task 3
  - Validate with: `rg -n "Test Contract|Manual checklist|Proof ladder" templates/artifacts/spec.md`
  - Notes: Keep the template concise.

- [ ] Task 5: Update TDD/proof discipline reference
  - File: `skills/references/spec-driven-development-discipline.md`
  - Action: Define checklist artifacts as part of proof-first TDD when manual proof remains after automated/browser/auth evidence.
  - User story link: Aligns checklist files with the core lifecycle doctrine.
  - Depends on: Task 1
  - Validate with: `rg -n "manual checklist|test-checklists|manual_test_checklist|proof-first" skills/references/spec-driven-development-discipline.md`
  - Notes: Preserve the Flutter mobile proof ladder.

- [ ] Task 6: Update execution workflow
  - File: `skills/sf-start/references/execution-workflow.md`
  - Action: When implementation leaves manual/device-only proof, generate or update the linked checklist before reporting completion.
  - User story link: Ensures the checklist exists during TDD/development, not only after verification fails.
  - Depends on: Tasks 3 and 5
  - Validate with: `rg -n "manual checklist|test-checklists|sf-test|Flutter Web smoke|APK" skills/sf-start/references/execution-workflow.md`
  - Notes: Do not create filler checklists for fully automated scopes.

- [ ] Task 7: Update sf-test checklist consumption
  - File: `skills/sf-test/SKILL.md`
  - Action: Add checklist mode: read a checklist file, normalize statuses, ask only for missing actionable details, append compact `TEST_LOG.md`, and create/update bug files for failed required rows.
  - User story link: Lets the operator fill the file and lets agents continue from it.
  - Depends on: Task 1
  - Validate with: `rg -n "manual_test_checklist|test-checklists|PASS|FAIL|BLOCKED|NOT_RUN|checklist mode" skills/sf-test/SKILL.md`
  - Notes: Preserve compact bug model and redaction rules.

- [ ] Task 8: Update verification gates
  - File: `skills/sf-verify/SKILL.md`, `skills/sf-verify/references/verification-gates.md`
  - Action: Add a manual checklist gate: required rows must be passed, linked to accepted bug follow-up, or explicitly waived with reason before clean verification.
  - User story link: Gives agents a real durable source for manual proof status.
  - Depends on: Task 7
  - Validate with: `rg -n "Manual Checklist|manual_test_checklist|test-checklists|PASS|FAIL|BLOCKED|NOT_RUN" skills/sf-verify/SKILL.md skills/sf-verify/references/verification-gates.md`
  - Notes: `FAIL` should normally block or route to bug work.

- [ ] Task 9: Update readiness gate
  - File: `skills/sf-ready/SKILL.md`
  - Action: Ensure ready specs with required manual proof either include a checklist path or explicitly state why no manual checklist is needed.
  - User story link: Prevents specs from becoming ready without a proof plan.
  - Depends on: Task 3
  - Validate with: `rg -n "Test Contract|manual checklist|test-checklists|ready" skills/sf-ready/SKILL.md`
  - Notes: Keep small/local specs lightweight.

- [ ] Task 10: Update docs/help/public pages if public promise changes
  - File: `skills/sf-test/README.md`, `skills/sf-help/references/help-catalog.md`, `site/src/content/skills/sf-test.md` if present
  - Action: Explain checklist files, operator-fill workflow, bug routing, and relation to `TEST_LOG.md`.
  - User story link: Makes the workflow discoverable.
  - Depends on: Tasks 7 and 8
  - Validate with: `rg -n "checklist|test-checklists|PASS|FAIL|BLOCKED|TEST_LOG" skills/sf-test/README.md skills/sf-help/references/help-catalog.md site/src/content/skills/sf-test.md`
  - Notes: Build site only if public content changes.

## Acceptance Criteria

- [ ] AC 1: Given a non-trivial spec has manual/device-only proof, when `sf-spec` completes, then the spec contains a `Test Contract` with automated proof, agent-run browser/auth proof, manual checklist path, and unresolved proof gaps.
- [ ] AC 2: Given a checklist file is generated, when metadata lint runs, then the checklist template and any generated sample pass lint or have a documented tracker exception.
- [ ] AC 3: Given the operator fills a required row as `PASS`, when `sf-test` consumes the checklist, then it records a compact `TEST_LOG.md` pass pointer without asking for duplicate chat input.
- [ ] AC 4: Given the operator fills a required row as `FAIL`, when `sf-test` consumes the checklist, then it creates or updates `bugs/BUG-ID.md`, writes a compact `TEST_LOG.md` pointer, and links the bug ID in the checklist or report.
- [ ] AC 5: Given a required row is `BLOCKED` or `NOT_RUN`, when `sf-verify` runs, then verification is `partial`, `not verified`, or `blocked` with a concrete next action.
- [ ] AC 6: Given a Flutter UI checklist includes APK rows but no widget/Web proof row or exception, when `sf-verify` runs, then it flags the proof ladder gap.
- [ ] AC 7: Given all required checklist rows are `PASS` and automated/browser proof passed, when `sf-verify` runs, then manual proof does not require chat copy-paste and can be cited from the checklist.
- [ ] AC 8: Given a checklist row includes raw secrets or an unsafe evidence path, when `sf-test` reads it, then it refuses to persist unsafe evidence and asks for a redacted pointer.
- [ ] AC 9: Given public `sf-test` docs are changed, when `npm --prefix site run build` runs, then the site build passes.
- [ ] AC 10: Given skills are changed, when skill checks run, then `skill_budget_audit` and `shipflow_sync_skills.sh --check --all` pass or report only accepted non-blocking risks.

## Test Contract

- Automated tests first: implementation should include focused tests for any parser/normalizer introduced for checklist statuses and evidence paths.
- Agent-run proof: use `rg`, metadata lint, skill budget audit, and runtime sync checks for skill/template changes.
- Manual checklist artifact: this spec should produce no operator checklist yet; it defines the system for future generated checklists.
- Flutter proof ladder: preserve the existing rule that widget tests and agent-run Flutter Web smoke come before APK/device testing.
- Exception policy: if checklist parsing is intentionally kept manual in v1, document why and keep `sf-test` consumption rules unambiguous.

## Test Strategy

- Unit: checklist status normalization, required/optional row interpretation, evidence path safety, duplicate scenario IDs if implemented as script/helper.
- Integration: dry-run fixture or sample project where `sf-test` consumes a checklist with `PASS`, `FAIL`, `BLOCKED`, and `NOT_RUN`.
- Manual: operator edits one checklist row directly and reruns `sf-test` to confirm no chat copy-paste is needed.

## Risks

- Security impact: yes, because checklists may contain observed behavior and evidence pointers. Mitigation: redaction rules, repo-root path safety, no raw secrets, no raw logs.
- Product/data/performance risk: medium. Poorly scoped checklists can slow delivery; mitigation is required/optional row semantics and small scenario sets.
- Workflow risk: high. This touches core lifecycle skills; implementation must be spec-first and verified with skill sync checks.

## Execution Notes

- Read first: `skills/sf-test/SKILL.md`, `skills/sf-spec/references/spec-creation-workflow.md`, `skills/sf-start/references/execution-workflow.md`, `skills/sf-verify/SKILL.md`, `skills/sf-verify/references/verification-gates.md`, `templates/artifacts/spec.md`, `templates/artifacts/bug_record.md`, `tools/shipflow_metadata_lint.py`.
- Validate with: metadata lint for changed artifacts, `rg` checks in tasks, `python3 tools/skill_budget_audit.py --skills-root skills --format markdown`, `tools/shipflow_sync_skills.sh --check --all`, and site build if public content changes.
- Stop conditions: unclear checklist path, inability to preserve operator edits, unsafe evidence handling, manual checklist replacing automated tests, or Flutter/APK proof ladder weakened.

## Open Questions

- Should generated checklists live under `shipflow_data/workflow/test-checklists/` for every project, or should projects be allowed to override the folder in `CLAUDE.md`?
- Should v1 include a parser/helper script, or should `sf-test` parse Markdown tables directly from instructions only?

## Skill Run History

| Date UTC | Skill | Model | Action | Result | Next step |
|----------|-------|-------|--------|--------|-----------|
| 2026-05-24 17:23:00 UTC | sf-spec | GPT-5.5 Codex | Created spec for ShipFlow TDD and manual checklist artifacts | draft | /sf-ready ShipFlow TDD and Manual Checklist Artifacts |

## Current Chantier Flow

- `sf-spec`: done, draft spec created.
- `sf-ready`: not launched.
- `sf-start`: not launched.
- `sf-verify`: not launched.
- `sf-end`: not launched.
- `sf-ship`: not launched.

Next step: `/sf-ready ShipFlow TDD and Manual Checklist Artifacts`
