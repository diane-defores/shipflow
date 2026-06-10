---
artifact: spec
metadata_schema_version: "1.0"
artifact_version: "1.0.0"
project: "ShipFlow"
created: "2026-06-10"
created_at: "2026-06-10 08:50:17 UTC"
updated: "2026-06-10"
updated_at: "2026-06-10 09:06:27 UTC"
status: ready
source_skill: sf-spec
source_model: "GPT-5 Codex"
scope: "conversation-audit-canonical-storage"
owner: "Diane"
user_story: "En tant qu'operatrice ShipFlow, je veux que les exports et audits de conversation ShipFlow soient forces dans le repo ShipFlow meme quand l'agent travaille depuis un projet audite, afin d'eviter de polluer les projets et de garder les preuves privees dans la gouvernance ShipFlow."
confidence: high
risk_level: medium
security_impact: "yes"
docs_impact: "yes"
linked_systems:
  - "skills/sf-conversation-audit/SKILL.md"
  - "skills/tmux-capture-conversation/SKILL.md"
  - "skills/tmux-capture-conversation/scripts/capture_tmux_conversation.sh"
  - "tools/shipflow_conversation_audit.py"
  - "skills/references/canonical-paths.md"
  - "shipflow_data/workflow/conversations/"
  - "shipflow_data/workflow/conversation-audits/"
depends_on:
  - artifact: "skills/references/canonical-paths.md"
    artifact_version: "1.2.0"
    required_status: active
  - artifact: "skills/references/spec-driven-development-discipline.md"
    artifact_version: "1.3.0"
    required_status: active
supersedes: []
evidence:
  - "User observation 2026-06-10: conversation audits can appear in audited project folders even though they are used to improve ShipFlow."
  - "Existing sf-conversation-audit contract says default output belongs under shipflow_data/workflow/conversation-audits/, but the mechanical path guard is not explicit enough when launched from a project cwd."
  - "tmux-capture-conversation supports --preset shipflow, but explicit --destination can still route ShipFlow conversation storage to a project-local shipflow_data path."
next_step: "none"
---

# Conversation Audit Canonical Storage Hardening

## Title

Conversation Audit Canonical Storage Hardening

## Status

ready; implemented and shipping in this run

## User Story

En tant qu'operatrice ShipFlow, je veux que les exports et audits de conversation ShipFlow soient forces dans le repo ShipFlow meme quand l'agent travaille depuis un projet audite, afin d'eviter de polluer les projets et de garder les preuves privees dans la gouvernance ShipFlow.

## Minimal Behavior Contract

Quand une capture ou un audit de conversation utilise le mode ShipFlow, le systeme resout les transcriptions et rapports depuis `${SHIPFLOW_ROOT:-$HOME/shipflow}` et ecrit uniquement dans `$SHIPFLOW_ROOT/shipflow_data/workflow/conversations/` ou `$SHIPFLOW_ROOT/shipflow_data/workflow/conversation-audits/`. Si un utilisateur ou un agent tente de fournir une destination ShipFlow relative ou project-local pour ces dossiers depuis un autre repo, la commande doit refuser ou corriger vers la racine ShipFlow avec un message observable; l'edge case facile a rater est `--destination shipflow_data/workflow/conversations/...` lance depuis ReplayGlowz.

## Success Behavior

- Given `tmux-capture-conversation --preset shipflow` runs from any cwd, when no destination is supplied, then the planned output is under `$SHIPFLOW_ROOT/shipflow_data/workflow/conversations/`.
- Given `tmux-capture-conversation --preset shipflow --destination shipflow_data/workflow/conversations/foo.md` runs from a project cwd outside ShipFlow, when the command resolves the output, then it fails before writing and says ShipFlow preset output must stay under `$SHIPFLOW_ROOT`.
- Given `sf-conversation-audit latest` or default mode is used, when it resolves transcripts and audit output, then the skill contract tells agents to use `$SHIPFLOW_ROOT/shipflow_data/workflow/...`, not the current project repo.
- Given an explicit `path <file>` points to a transcript outside ShipFlow, when the audit report is written, then only the input may be external; the output remains under `$SHIPFLOW_ROOT/shipflow_data/workflow/conversation-audits/`.

## Error Behavior

- If `$SHIPFLOW_ROOT` cannot be resolved to a directory with ShipFlow-owned files, the command blocks with a clear installation/root error instead of writing into the current project.
- If `--destination` tries to place ShipFlow preset output outside `$SHIPFLOW_ROOT/shipflow_data/workflow/conversations/`, the command fails before creating directories or files.
- If a non-ShipFlow `docs` capture intentionally writes to a project docs folder, that behavior remains unchanged.
- The system must never silently create project-local `shipflow_data/workflow/conversations/` or `shipflow_data/workflow/conversation-audits/` for ShipFlow conversation audits.

## Problem

The existing doctrine says conversation audit outputs are private ShipFlow governance artifacts, but the mechanics are not strict enough. Agents often run from product repositories while auditing conversations about those products. A relative `shipflow_data/workflow/...` destination can therefore create artifacts in the audited project, even though the purpose is improving ShipFlow behavior.

## Solution

Harden the capture and audit contracts around `$SHIPFLOW_ROOT`. The capture script should enforce a canonical root for the `shipflow` preset and reject outside destinations. The audit skill should state the same rule explicitly for all modes, including external input paths. Focused dry-run tests should prove the path cannot drift when the cwd is a separate project.

## Scope In

- Update `skills/tmux-capture-conversation/scripts/capture_tmux_conversation.sh` with a canonical `shipflow` preset guard.
- Update `skills/tmux-capture-conversation/SKILL.md` with the explicit destination refusal rule.
- Update `skills/sf-conversation-audit/SKILL.md` so canonical input/output paths include `$SHIPFLOW_ROOT` and external `path` inputs cannot move audit output.
- Add a focused shell validation script if needed to prove path behavior without a live tmux dependency.
- Run metadata/static checks for changed artifacts.

## Scope Out

- No migration of existing misplaced project artifacts in this pass.
- No public publication or ingestion of private raw transcripts.
- No redesign of the conversation classifier categories.
- No change to `docs` preset behavior for ordinary project documentation captures.
- No broad rewrite of ShipFlow path policy beyond the conversation audit surfaces.

## Constraints

- Preserve the existing `docs` preset and explicit non-ShipFlow destination behavior.
- The `shipflow` preset is special: it protects private governance evidence and must not be project-local.
- Keep failures observable and non-destructive.
- Do not touch unrelated dirty files from the numeric skill-code-index chantier.

## Test Contract

- `surface`: Bash capture script, skill contracts, optional focused shell test.
- `proof_profile`: scenario-first with mechanical dry-run checks.
- `proof_order`:
  1. Define path drift pressure scenarios.
  2. Add script guard for ShipFlow preset destinations.
  3. Update skill contracts.
  4. Run shell tests from a fake project cwd.
  5. Run syntax and metadata checks.
- `required_scenario_ids`:
  - `SHIPFLOW-PRESET-FROM-PROJECT-CWD`: no destination writes under `$SHIPFLOW_ROOT`.
  - `SHIPFLOW-PRESET-RELATIVE-DEST-BLOCKED`: relative `shipflow_data/workflow/conversations/*.md` from project cwd fails.
  - `SHIPFLOW-PRESET-ABSOLUTE-PROJECT-DEST-BLOCKED`: absolute project-local conversation path fails.
  - `DOCS-PRESET-UNCHANGED`: docs capture routing remains project-local.
  - `EXTERNAL-INPUT-CANONICAL-OUTPUT`: `sf-conversation-audit path <external>` keeps output under `$SHIPFLOW_ROOT`.

## Dependencies

- `skills/references/canonical-paths.md@1.2.0`: root resolution and ownership semantics.
- `skills/references/spec-driven-development-discipline.md@1.3.0`: scenario-first proof requirement for skill/governance changes.
- Local shell tooling: `bash`, `realpath`, `sed`, `awk`.
- Fresh external docs: not needed; this is local ShipFlow workflow behavior.

## Invariants

- ShipFlow-owned private conversation governance stays in `$SHIPFLOW_ROOT/shipflow_data/workflow/`.
- Project-local `shipflow_data/` remains for project-owned governance, not ShipFlow self-improvement audits.
- External transcript input is allowed only as input evidence; report output remains ShipFlow-owned.
- Existing dirty worktree changes remain untouched unless they are in this scope.

## Links & Consequences

- Reduces project repo pollution from conversation audits.
- Preserves private transcript/audit evidence in a single governance corpus.
- Makes `sf-conversation-audit export shipflow` safer when run from any audited project.
- May need later cleanup guidance for already misplaced artifacts.

## Documentation Coherence

- Update skill contracts in `skills/sf-conversation-audit/SKILL.md` and `skills/tmux-capture-conversation/SKILL.md`.
- Public docs are optional unless invocation behavior is user-visible enough to require a note.
- Changelog can be updated during close/ship if this scope is shipped.

## Edge Cases

- User supplies an absolute destination already inside `$SHIPFLOW_ROOT/shipflow_data/workflow/conversations/`: allowed.
- User supplies `$SHIPFLOW_ROOT` unset from a non-ShipFlow cwd: default to `$HOME/shipflow` only if it exists and contains ShipFlow files.
- User runs `docs` preset from a product repo: unchanged.
- User audits an external transcript path: input can be external, output cannot.
- User intentionally wants to archive a product conversation in product docs: use `docs` preset, not `shipflow`.

## Implementation Tasks

- [x] Task 1: Add ShipFlow preset destination guard
  - File: `skills/tmux-capture-conversation/scripts/capture_tmux_conversation.sh`
  - Action: Resolve `$SHIPFLOW_ROOT`, define the allowed conversation directory, and reject any `shipflow` preset output outside it after destination resolution and confirmation changes.
  - User story link: Prevents project-local ShipFlow conversation transcript writes.
  - Depends on: none.
  - Validate with: shell test or dry-run from fake project cwd.

- [x] Task 2: Update capture skill contract
  - File: `skills/tmux-capture-conversation/SKILL.md`
  - Action: State that the `shipflow` preset ignores project governance roots and requires `$SHIPFLOW_ROOT/shipflow_data/workflow/conversations/`; explicit destinations outside that directory are blocked.
  - User story link: Prevents agents from choosing project-local destinations.
  - Depends on: Task 1.
  - Validate with: focused `rg`.

- [x] Task 3: Update conversation audit skill contract
  - File: `skills/sf-conversation-audit/SKILL.md`
  - Action: State absolute canonical input/output roots under `$SHIPFLOW_ROOT`, and clarify that external `path` inputs do not change output root.
  - User story link: Keeps audit reports in ShipFlow even when input came from a project repo.
  - Depends on: none.
  - Validate with: focused `rg`.

- [x] Task 4: Add focused path guard tests
  - File: `test_conversation_audit_storage.sh`
  - Action: Add shell tests that exercise the path guard without requiring a live tmux write; use `--dry-run` where possible and expected-failure checks for invalid destinations.
  - User story link: Proves the prevention behavior from a fake project cwd.
  - Depends on: Task 1.
  - Validate with: `./test_conversation_audit_storage.sh`.

## Acceptance Criteria

- [x] AC 1: Given `--preset shipflow` and no destination from a non-ShipFlow cwd, when the capture plan is produced, then the destination starts with `$SHIPFLOW_ROOT/shipflow_data/workflow/conversations/`.
- [x] AC 2: Given `--preset shipflow --destination shipflow_data/workflow/conversations/foo.md` from a non-ShipFlow cwd, when the command resolves output, then it fails before writing outside `$SHIPFLOW_ROOT`.
- [x] AC 3: Given an absolute project-local destination under `shipflow_data/workflow/conversations/`, when `--preset shipflow` is used, then it fails before writing.
- [x] AC 4: Given the `docs` preset, when a project-local docs destination is inferred, then that behavior remains allowed.
- [x] AC 5: Given `sf-conversation-audit path <external transcript>`, when agents follow the contract, then audit output remains under `$SHIPFLOW_ROOT/shipflow_data/workflow/conversation-audits/`.

## Test Strategy

- `bash -n skills/tmux-capture-conversation/scripts/capture_tmux_conversation.sh`
- `./test_conversation_audit_storage.sh`
- `rg -n "SHIPFLOW_ROOT/shipflow_data/workflow/conversations|outside|conversation-audits|external" skills/tmux-capture-conversation/SKILL.md skills/sf-conversation-audit/SKILL.md`
- `python3 tools/shipflow_metadata_lint.py shipflow_data/workflow/specs/conversation-audit-canonical-storage-hardening.md`

## Risks

- Medium security/privacy risk if left unresolved because private conversation evidence can drift into product repos.
- Low compatibility risk if the `docs` preset stays untouched.
- Medium workflow risk if the guard is too strict and blocks valid absolute destinations inside `$SHIPFLOW_ROOT`; tests must cover the allowed case.

## Execution Notes

- Proof path: `scenario-first`.
- First files to inspect: `skills/tmux-capture-conversation/scripts/capture_tmux_conversation.sh`, `skills/tmux-capture-conversation/SKILL.md`, `skills/sf-conversation-audit/SKILL.md`.
- Implementation should guard after final destination resolution, including interactive destination replacement.
- No fresh external docs needed.
- Preserve unrelated dirty files.

## Open Questions

None. The user explicitly approved autonomous hardening.

## Skill Run History

| Date UTC | Skill | Model | Action | Result | Next step |
|----------|-------|-------|--------|--------|-----------|
| 2026-06-10 08:50:17 UTC | sf-spec | GPT-5 Codex | Created ready spec for hardening canonical ShipFlow conversation audit storage after user approved autonomous follow-through. | ready | /sf-start conversation-audit-canonical-storage-hardening |
| 2026-06-10 08:54:47 UTC | sf-start | GPT-5 Codex | Implemented ShipFlow preset output guard, updated capture/audit contracts, added focused path guard tests, and validated syntax, path behavior, metadata, skill budget, and runtime sync. | implemented | /sf-end conversation-audit-canonical-storage-hardening |
| 2026-06-10 09:06:27 UTC | sf-end | GPT-5 Codex | Closed bookkeeping with TASKS and CHANGELOG updates for canonical conversation audit storage hardening. | closed | /sf-ship conversation-audit-canonical-storage-hardening |
| 2026-06-10 09:06:27 UTC | sf-ship | GPT-5 Codex | Prepared targeted ship scope for canonical storage guard, excluding unrelated numeric skill-code-index changes. | shipped | none |

## Current Chantier Flow

| Step | Status | Evidence | Next |
|------|--------|----------|------|
| sf-spec | complete | Ready spec created from user-approved storage hardening requirement. | Run `/sf-start conversation-audit-canonical-storage-hardening`. |
| sf-ready | skipped | User requested autonomous continuation and scope is bounded by existing contracts. | Run implementation. |
| sf-start | complete | Implemented guard, contracts, and focused tests. | Close chantier bookkeeping. |
| sf-verify | complete | `./test_conversation_audit_storage.sh`, `bash -n`, metadata lint, skill budget audit, and runtime skill sync all passed. | Close chantier bookkeeping. |
| sf-end | complete | TASKS and CHANGELOG updated for this chantier. | Ship targeted scope. |
| sf-ship | complete | Targeted ship scope prepared; unrelated numeric skill-code-index changes excluded. | None. |
