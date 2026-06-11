---
artifact: spec
metadata_schema_version: "1.0"
artifact_version: "1.0.0"
project: ShipFlow
created: "2026-06-10"
created_at: "2026-06-10 22:45:44 UTC"
updated: "2026-06-10"
updated_at: "2026-06-11 01:17:44 UTC"
status: reviewed
source_skill: sf-spec
source_model: "GPT-5 Codex"
scope: skill-runtime-migration
owner: Diane
user_story: "En tant qu'operatrice ShipFlow qui cherche souvent une skill precise dans Codex ou Claude Code, je veux que chaque skill ShipFlow ait un nom runtime commencant par un code a trois chiffres juste avant son nom existant, afin de filtrer, memoriser et lancer rapidement la bonne skill sans parcourir une longue liste de noms en sf-*."
confidence: high
risk_level: high
security_impact: yes
docs_impact: yes
linked_systems:
  - skills/
  - skills/*/SKILL.md
  - skills/*/agents/openai.yaml
  - skills/references/skill-code-index.md
  - skills/references/entrypoint-routing.md
  - skills/000-shipflow/SKILL.md
  - skills/302-sf-help/SKILL.md
  - skills/302-sf-help/references/help-catalog.md
  - docs/skill-launch-cheatsheet.md
  - tools/shipflow_sync_skills.sh
  - tools/skill_budget_audit.py
  - tools/skill_code_index_lint.py
  - shipflow_data/technical/skill-runtime-and-lifecycle.md
  - shipflow_data/technical/code-docs-map.md
  - README.md
depends_on:
  - artifact: "shipflow_data/workflow/specs/numeric-skill-code-index.md"
    artifact_version: "1.0.0"
    required_status: reviewed
  - artifact: "shipflow_data/technical/skill-runtime-and-lifecycle.md"
    artifact_version: "1.18.0"
    required_status: reviewed
  - artifact: "skills/references/entrypoint-routing.md"
    artifact_version: "1.2.0"
    required_status: active
  - artifact: "skills/references/decision-quality-contract.md"
    artifact_version: "1.1.0"
    required_status: active
supersedes: []
evidence:
  - "User decision 2026-06-10: use three digits directly before the skill name for the real runtime-visible skill identity."
  - "User decision 2026-06-10: the earlier two-digit discovery-only index is not enough because Codex/Claude shortcuts should expose the prefixed skill names directly."
  - "Local inspection 2026-06-10: tools/shipflow_sync_skills.sh publishes runtime skills by directory name and rejects names outside lowercase letters, numbers, and hyphens."
  - "Local inspection 2026-06-10: tools/skill_budget_audit.py requires frontmatter name to match the skill directory and already accepts digits and hyphens."
next_step: "/005-sf-ship Three Digit Runtime Skill Names"
---

# Spec: Three Digit Runtime Skill Names

## Title

Three Digit Runtime Skill Names

## Status

ready

## User Story

En tant qu'operatrice ShipFlow qui cherche souvent une skill precise dans Codex ou Claude Code, je veux que chaque skill ShipFlow ait un nom runtime commencant par un code a trois chiffres juste avant son nom existant, afin de filtrer, memoriser et lancer rapidement la bonne skill sans parcourir une longue liste de noms en sf-*.

## Minimal Behavior Contract

ShipFlow doit migrer les skills locales de noms runtime non prefixes vers des noms `NNN-<ancien-nom>` ou `NNN` est un code a trois chiffres stable, memorisable et organise par familles. Apres migration et rechargement de Codex/Claude, l'operatrice doit voir et pouvoir invoquer des skills comme `000-shipflow`, `001-sf-build`, `100-sf-spec` et `401-sf-audit-code`; les dossiers `skills/<name>`, les champs `name:` et les liens runtime doivent etre coherents avec ces noms. En cas d'echec ou d'incoherence, les validateurs doivent bloquer la migration avant publication runtime ou signaler les liens obsoletes. Le cas facile a rater est de laisser des references internes, des symlinks Codex/Claude, des `agents/openai.yaml`, ou un index numerique qui continuent de pointer vers les anciens noms.

## Success Behavior

- Preconditions: le repo ShipFlow est propre, les skills existent sous `skills/<old-name>/SKILL.md`, et les liens runtime actuels sont des symlinks vers ces dossiers.
- Trigger: l'implementateur lance la migration depuis une spec ready.
- User/operator result: dans une nouvelle session Codex/Claude, taper le prefixe de skill affiche d'abord les noms chiffres comme `001-sf-build`, `300-sf-docs` ou `400-sf-audit`.
- System effect: chaque dossier source, champ frontmatter `name:`, `agents/openai.yaml` concerne, index, routeur, aide, docs et symlink runtime utilisent le nouveau nom `NNN-<old-name>`.
- Success proof: les validateurs passent, `tools/shipflow_sync_skills.sh --check --all` confirme les liens Claude/Codex, et aucun ancien dossier `skills/sf-*` ou `skills/shipflow` ne reste actif comme skill source sauf exception explicitement documentee.
- Silent success: not allowed; la migration doit produire une preuve commandee et une note utilisateur indiquant qu'une nouvelle session Codex/Claude peut etre necessaire.

## Error Behavior

- Invalid mapping: duplicate code, missing skill, bad display label, name over 64 chars, or mismatch between folder and `name:` must fail validation.
- Runtime sync failure: a stale or non-symlink target under `~/.codex/skills` or `~/.claude/skills` must block or require backup according to `tools/shipflow_sync_skills.sh`; no overwrite silencieux is allowed.
- Reference drift: stale references to old direct invocation names must be either updated to the new runtime name or intentionally documented as legacy/operator-language compatibility.
- Compatibility failure: old direct invocations such as `$sf-build` are allowed to stop being the primary runtime entrypoint after the migration, but the user-facing docs must state the new form and the router/help must preserve enough wording to recognize old names in natural language.
- Must never happen: duplicate visible wrapper skills for every old name by default, because that would pollute the picker and defeat the filtering goal.

## Problem

The current two-digit index is only a discovery and routing layer. It documents labels such as `01-sf-build`, but the actual runtime skills still appear as `sf-build`, `shipflow`, `sf-audit-code`, and other names that cluster under the same `s` prefix. This does not solve the picker/filtering problem inside Codex or Claude Code. The user now wants the code to be part of the real skill name.

## Solution

Perform a controlled runtime identity migration from unprefixed names to three-digit prefixed names. The migration should use a canonical mapping table, update each source skill directory and frontmatter `name:`, refresh OpenAI interface display names where present, update all ShipFlow docs/routing/help references, adjust validation helpers for three-digit runtime identities, repair current-user Claude/Codex symlinks, and remove old runtime links when they are safe symlinks to the old ShipFlow source directories.

## Scope In

- Adopt three digits as the canonical runtime name prefix.
- Rename all first-party ShipFlow repo skills from `<old-name>` to `NNN-<old-name>`.
- Preserve the descriptive suffix exactly after the numeric prefix; for example `sf-build` becomes `001-sf-build`.
- Update `name:` in every touched `SKILL.md` to match its new directory.
- Update `agents/openai.yaml` `interface.display_name` when present to match the exact new invocation key.
- Update numeric index semantics from discovery-only two-digit labels to runtime identity three-digit names.
- Update route/help/docs/contracts that currently say numeric codes are not runtime names.
- Update or replace validation scripts so the migration can be checked mechanically.
- Sync current-user Claude/Codex runtime skill links and remove stale old-name symlinks when they point to renamed ShipFlow source directories.
- Document the operator-facing migration note: new sessions may be required before the picker refreshes.

## Scope Out

- Do not introduce `$` or other symbols into skill names.
- Do not create duplicate wrapper skills for all old names by default.
- Do not change the behavioral contract of individual skills beyond their invocation identity and references.
- Do not migrate third-party skills outside `/home/claude/shipflow/skills`.
- Do not change Codex or Claude runtime internals beyond filesystem skill links.
- Do not commit, push, or ship until `sf-verify`, `sf-end`, and `sf-ship` run later.

## Constraints

- Runtime names must remain valid under the known local policy: lowercase letters, numbers, and hyphens only; no leading/trailing hyphen; no `--`; max 64 characters.
- `name:` must match the directory basename for every skill.
- The prefixed name format is exactly `NNN-<old-name>`.
- Codes are stable identifiers once shipped; future changes require a migration note.
- `000-099` is reserved for master and highest-frequency entrypoints.
- `100-199` lifecycle/proof, `200-299` content/research/copy, `300-399` docs/context/support, `400-499` audit/quality/ops, `500-599` design/components, `600-699` data/activation, `700-799` pilotage/session, `800-899` conversation/transcript, `900-999` rare/experimental/migration.
- Frequency may override family for master entrypoints; for example `007-sf-content` remains in the master band.
- Fresh external docs: not needed; this is local filesystem/runtime skill metadata behavior governed by the repo tools and observed local Codex/Claude skill folders.

## Test Contract

### Surface

- Stack/surface: local skills, Markdown/YAML frontmatter, Bash sync helper, Python validators, runtime symlinks.
- Proof profile: contract plus linter plus filesystem sync plus manual runtime confirmation when available.
- Proof order: mapping validation -> metadata/name validation -> stale reference scan -> runtime sync repair/check -> full skill budget audit -> final git diff review -> manual runtime confirmation.

### Manual checklist

- Needed: yes
- Checklist path: `shipflow_data/workflow/test-checklists/three-digit-runtime-skill-names.md`
- Required scenario IDs: `RTN-001 codex-prefixed-picker`, `RTN-002 claude-prefixed-picker`, `RTN-003 old-name-duplicate-cleanup`.
- Required results: after sync and reload, `001-sf-build` and `000-shipflow` are visible or invocable; old unprefixed ShipFlow symlink entries are absent unless runtime cache is explicitly documented.
- Exception with proof: if runtime UI cannot be inspected in the current environment, report filesystem proof, mark manual runtime confirmation pending, and require that confirmation before `sf-ship`.
- Exception without proof: not allowed for symlink cleanup or metadata/name consistency.

### Required evidence stack

- Automated / unit / integration checks: `python3 tools/skill_code_index_lint.py`; `python3 tools/skill_budget_audit.py --skills-root skills --format markdown`; `python3 tools/shipflow_metadata_lint.py <changed docs/specs>`; `tools/shipflow_sync_skills.sh --check --all`.
- Contract/reference proof: focused `rg` scans for stale old-name routing claims, discovery-only claims, and old two-digit examples.
- Runtime proof: current-user symlink check for both Claude and Codex.
- Manual proof: picker/invocation check in a fresh or reloaded Codex/Claude session when available.

## Dependencies

- `tools/shipflow_sync_skills.sh`: owns runtime symlink publication and currently accepts numeric-hyphen names.
- `tools/skill_budget_audit.py`: requires `name:` to match directory and validates allowed characters.
- `tools/skill_code_index_lint.py`: currently validates two-digit discovery labels and must be updated for three-digit runtime identity coverage.
- `skills/references/skill-code-index.md`: source of mapping and family semantics.
- `shipflow_data/technical/skill-runtime-and-lifecycle.md` and `skills/references/entrypoint-routing.md`: currently describe numeric codes as discovery-only and must be changed.
- `skills/000-shipflow/SKILL.md`, `skills/302-sf-help/SKILL.md`, `skills/302-sf-help/references/help-catalog.md`, and `docs/skill-launch-cheatsheet.md`: user-facing help surfaces for invocation.
- `agents/openai.yaml` files present under `shipflow`, `sf-bug`, `sf-deploy`, `sf-maintain`, `sf-platform-parity`, `tmux-capture-conversation`, and `clean-conversation-transcript`.

## Invariants

- The suffix after `NNN-` must preserve the old name exactly.
- Every first-party skill has exactly one active runtime source directory.
- Old names may appear in docs only as legacy names or natural-language aliases, not as current direct runtime invocation keys.
- The runtime skill picker should not contain both old and new ShipFlow names after cleanup.
- Current-user runtime links must resolve inside `$SHIPFLOW_ROOT/skills`.
- Non-symlink runtime targets must not be removed automatically.
- Behavioral skill descriptions and workflow bodies remain semantically unchanged except where invocation names or routing references must change.

## Links & Consequences

- Upstream: future skill creation must allocate a three-digit code before creating the directory and `name:`.
- Downstream: all master routing examples, help catalog entries, public cheatsheets, and skill-maintenance docs must show the prefixed names.
- Installer/sync: runtime publication must work with prefixed names and clean old safe symlinks.
- Existing conversations: an already-running Codex/Claude session may continue to know old names until restarted; docs must say so.
- Public/support impact: support instructions and examples must stop teaching `$sf-build` as the primary direct invocation once migration ships.
- Security/ops impact: symlink cleanup must be path-safe and must not delete user-created non-symlink skill directories.

## Documentation Coherence

- Update `skills/references/skill-code-index.md` from two-digit discovery labels to three-digit runtime identities.
- Update `skills/000-shipflow/SKILL.md` and `skills/references/entrypoint-routing.md` so numeric names are first-class runtime skill names.
- Update `skills/302-sf-help/SKILL.md` and `skills/302-sf-help/references/help-catalog.md` so help queries return the new examples.
- Update `docs/skill-launch-cheatsheet.md` and `README.md` if they list direct skill invocation examples.
- Update `shipflow_data/technical/skill-runtime-and-lifecycle.md` and `shipflow_data/technical/code-docs-map.md` for the new runtime identity policy and validation commands.
- Update `CHANGELOG.md` during closure, not during spec creation.
- Consider public site skill pages only if the site currently exposes skill slugs or invocation keys for these skills.

## Edge Cases

- `shipflow` becomes `000-shipflow`, so docs that tell operators to start with `$shipflow` need an explicit new equivalent.
- Skills without `sf-` prefixes, such as `continue`, `name`, `tmux-capture-conversation`, and `clean-conversation-transcript`, still receive three-digit prefixes.
- Existing `agents/openai.yaml` display names can drift from frontmatter unless updated.
- `tools/shipflow_sync_skills.sh --all` skips invalid old source names only after rename; stale old runtime symlinks may still exist and must be cleaned safely.
- Shell commands that include prefixed names are safe because digits and hyphens do not require quoting.
- Skill names must remain under 64 characters after adding `NNN-`; current longest names remain within the limit, but validation must prove it.
- Some references may intentionally mention old names in historical spec evidence; those should not be bulk-edited unless they are current instructions.

## Implementation Tasks

- [x] Task 1: Freeze the three-digit mapping table
  - File: `skills/references/skill-code-index.md`
  - Action: Convert the active table to three-digit codes and mark each listed skill as the future runtime identity `NNN-<old-name>`.
  - User story link: Provides the memorable family map before any rename happens.
  - Depends on: None
  - Validate with: review of all 66 current skill suffixes against the mapping below.
  - Notes: Use the Proposed Code Map in this spec unless `sf-ready` finds a blocker.

- [x] Task 2: Update validators for three-digit runtime identities
  - File: `tools/skill_code_index_lint.py`, `tools/skill_budget_audit.py`
  - Action: Make the index linter validate `NNN-<suffix>` runtime names and ensure budget audit still accepts numeric-prefixed names.
  - User story link: Prevents mismatched names from reaching Codex/Claude.
  - Depends on: Task 1
  - Validate with: `python3 tools/skill_code_index_lint.py`; `python3 tools/skill_budget_audit.py --skills-root skills --format markdown`
  - Notes: `skill_budget_audit.py` may need no regex change, but its output should prove all new names pass.

- [x] Task 3: Rename source skill directories and frontmatter
  - File: `skills/*/SKILL.md`
  - Action: Rename every first-party skill directory to `NNN-<old-name>` and update each frontmatter `name:` to the new directory basename.
  - User story link: Makes the code part of the actual visible runtime skill name.
  - Depends on: Tasks 1-2
  - Validate with: `python3 tools/skill_budget_audit.py --skills-root skills --format markdown`
  - Notes: Use a deterministic script or controlled batch process; do not rewrite bodies unrelated to invocation references.

- [x] Task 4: Update OpenAI interface metadata
  - File: `skills/*/agents/openai.yaml`
  - Action: Set `interface.display_name` to the exact new invocation key for every existing OpenAI metadata file.
  - User story link: Keeps Codex chips/picker labels aligned with the name the operator types.
  - Depends on: Task 3
  - Validate with: focused YAML/frontmatter scan that display names equal parent directory names when present.
  - Notes: Known files exist under seven current skills.

- [x] Task 5: Update routing, help, docs, and lifecycle contracts
  - File: `skills/000-shipflow/SKILL.md`, `skills/references/entrypoint-routing.md`, `skills/302-sf-help/SKILL.md`, `skills/302-sf-help/references/help-catalog.md`, `docs/skill-launch-cheatsheet.md`, `README.md`, `shipflow_data/technical/skill-runtime-and-lifecycle.md`, `shipflow_data/technical/code-docs-map.md`
  - Action: Replace discovery-only two-digit language with three-digit runtime identity language and update examples.
  - User story link: Operators and future agents learn the new direct names instead of stale `$sf-*` examples.
  - Depends on: Tasks 1-4
  - Validate with: `rg -n "discovery layer|not skill identities|00-shipflow|01-sf-build|\\$sf-|sf-build" <changed docs>` and manually classify allowed legacy mentions.
  - Notes: Do not erase historical evidence in old specs.

- [x] Task 6: Update runtime sync helper for migration cleanup
  - File: `tools/shipflow_sync_skills.sh`
  - Action: Ensure `--repair --all` creates new prefixed symlinks and provide or document a safe cleanup path for old symlinks that resolve to missing or renamed ShipFlow source directories.
  - User story link: Makes the new names appear in Codex/Claude without duplicate old entries.
  - Depends on: Task 3
  - Validate with: `tools/shipflow_sync_skills.sh --repair --all`; `tools/shipflow_sync_skills.sh --check --all`
  - Notes: Non-symlink existing targets must remain blocked and user-owned.

- [x] Task 7: Add migration proof checklist
  - File: `shipflow_data/workflow/test-checklists/three-digit-runtime-skill-names.md`
  - Action: Create a short manual checklist for Codex/Claude reload, picker search, direct invocation sample, and duplicate old-name inspection.
  - User story link: Verifies the outcome in the actual operator workflow, not only on disk.
  - Depends on: Tasks 3-6
  - Validate with: metadata lint for the checklist if it uses ShipFlow artifact frontmatter, otherwise path existence and checklist review.
  - Notes: Manual proof can be deferred but must be named before ship.

- [x] Task 8: Run final validation and prepare closure
  - File: changed files from Tasks 1-7 plus `CHANGELOG.md`
  - Action: Run all required checks, update changelog, and record documentation/editorial impact for `sf-end`.
  - User story link: Ensures the migration can be trusted before shipping.
  - Depends on: Tasks 1-7
  - Validate with: full commands in Test Strategy and a clean `git status --short` after planned changes are committed later by `sf-ship`.
  - Notes: Do not claim runtime UI success unless manually checked or explicitly marked as pending.

## Acceptance Criteria

- [x] AC 1: Given the migrated repo, when listing `skills/*/SKILL.md`, then every first-party skill directory starts with exactly three digits and a hyphen.
- [x] AC 2: Given any migrated skill, when reading its frontmatter, then `name:` equals the parent directory basename.
- [x] AC 3: Given `001-sf-build`, `000-shipflow`, `100-sf-spec`, and `401-sf-audit-code`, when runtime sync runs, then Claude and Codex target links resolve to the matching prefixed source directories.
- [x] AC 4: Given the current-user runtime skill folders after cleanup, when inspecting safe ShipFlow symlinks, then old unprefixed ShipFlow entries no longer remain as active duplicate symlinks.
- [x] AC 5: Given `skills/references/skill-code-index.md`, when `python3 tools/skill_code_index_lint.py` runs, then all current skill runtime names are covered exactly once and all codes are three digits.
- [x] AC 6: Given help and cheatsheet docs, when the operator looks for skill examples, then examples use `000-shipflow`, `001-sf-build`, and family bands like `100-199` instead of `00-shipflow` or `$sf-build` as primary direct invocation.
- [x] AC 7: Given a stale old-name reference scan, when matches remain, then each remaining match is either historical evidence, legacy alias explanation, or a blocker to fix before `sf-verify`.
- [x] AC 8: Given the migration is complete, when a new Codex/Claude session loads skills, then the visible ShipFlow skills can be filtered by their numeric prefixes and at least `000-shipflow` and `001-sf-build` are manually confirmed or explicitly listed as pending manual proof.

## Test Strategy

- Mapping validation: `python3 tools/skill_code_index_lint.py`.
- Skill metadata validation: `python3 tools/skill_budget_audit.py --skills-root skills --format markdown`.
- Runtime link validation: `tools/shipflow_sync_skills.sh --repair --all` followed by `tools/shipflow_sync_skills.sh --check --all`.
- Metadata/document validation: `python3 tools/shipflow_metadata_lint.py shipflow_data/workflow/specs/three-digit-runtime-skill-names.md skills/references/skill-code-index.md shipflow_data/technical/skill-runtime-and-lifecycle.md shipflow_data/technical/code-docs-map.md`.
- Reference drift scans: focused `rg` checks for `00-shipflow`, `01-sf-build`, `discovery layer`, `not skill identities`, `\\$sf-`, and unprefixed active invocation examples in changed docs and current skill bodies.
- Manual runtime proof: reload Codex/Claude, search for `001`, launch or inspect `001-sf-build`, search old `sf-build` and confirm no duplicate active ShipFlow skill remains unless the runtime caches old sessions.

## Risks

- Runtime cache risk: already-running Codex/Claude sessions may continue exposing old names until restart. Mitigation: document reload/new-session requirement.
- Discoverability risk: users who remember `$sf-build` may be surprised. Mitigation: help/router docs can recognize old names in natural language and point to `001-sf-build`.
- Duplicate picker risk: keeping wrapper aliases would show both old and new names. Mitigation: no bulk wrappers by default; cleanup safe symlinks.
- Migration breadth risk: many docs and skill bodies may reference old names. Mitigation: use targeted scans and classify historical references separately from current instructions.
- Filesystem safety risk: deleting or replacing runtime entries could affect user-owned skills. Mitigation: remove only symlinks that resolve to ShipFlow old source paths or missing renamed ShipFlow paths; block non-symlinks.
- Validation drift risk: validators may still encode two-digit or old-name assumptions. Mitigation: update linter contracts before or with the rename, then run them after.

## Execution Notes

- Read first during implementation: this spec, `skills/references/skill-code-index.md`, `tools/shipflow_sync_skills.sh`, `tools/skill_budget_audit.py`, `tools/skill_code_index_lint.py`, `shipflow_data/technical/skill-runtime-and-lifecycle.md`.
- Implement in batches: mapping/validators first, then mechanical rename, then routing/docs, then runtime sync cleanup.
- Prefer a deterministic migration script for the mechanical rename and frontmatter updates, with reviewable output and no unrelated body rewrites.
- Use `apply_patch` for intentional manual edits; generated mechanical rename may use filesystem commands once the mapping is frozen.
- Stop if any target name exceeds 64 characters, any duplicate target appears, any non-symlink runtime target conflicts, or Codex/Claude rejects a numeric-prefixed skill name during proof.
- Fresh external docs: not needed because the behavior is local repo/runtime filesystem metadata, not a third-party API or SDK contract.

## Proposed Code Map

| Code | Old name | New runtime name | Family |
| --- | --- | --- | --- |
| `000` | `shipflow` | `000-shipflow` | Master |
| `001` | `sf-build` | `001-sf-build` | Master |
| `002` | `sf-maintain` | `002-sf-maintain` | Master |
| `003` | `sf-bug` | `003-sf-bug` | Master |
| `004` | `sf-deploy` | `004-sf-deploy` | Master |
| `005` | `sf-ship` | `005-sf-ship` | Master |
| `006` | `sf-design` | `006-sf-design` | Master |
| `007` | `sf-content` | `007-sf-content` | Master |
| `008` | `sf-onboarding` | `008-sf-onboarding` | Master |
| `009` | `sf-skill-build` | `009-sf-skill-build` | Master |
| `100` | `sf-spec` | `100-sf-spec` | Lifecycle/proof |
| `101` | `sf-ready` | `101-sf-ready` | Lifecycle/proof |
| `102` | `sf-start` | `102-sf-start` | Lifecycle/proof |
| `103` | `sf-verify` | `103-sf-verify` | Lifecycle/proof |
| `104` | `sf-end` | `104-sf-end` | Lifecycle/proof |
| `105` | `sf-check` | `105-sf-check` | Lifecycle/proof |
| `106` | `sf-fix` | `106-sf-fix` | Lifecycle/proof |
| `107` | `sf-test` | `107-sf-test` | Lifecycle/proof |
| `108` | `sf-browser` | `108-sf-browser` | Lifecycle/proof |
| `109` | `sf-auth-debug` | `109-sf-auth-debug` | Lifecycle/proof |
| `200` | `sf-redact` | `200-sf-redact` | Content/research/copy |
| `201` | `sf-enrich` | `201-sf-enrich` | Content/research/copy |
| `202` | `sf-repurpose` | `202-sf-repurpose` | Content/research/copy |
| `203` | `sf-research` | `203-sf-research` | Content/research/copy |
| `204` | `sf-market-study` | `204-sf-market-study` | Content/research/copy |
| `205` | `sf-veille` | `205-sf-veille` | Content/research/copy |
| `206` | `sf-audit-copy` | `206-sf-audit-copy` | Content/research/copy |
| `207` | `sf-audit-copywriting` | `207-sf-audit-copywriting` | Content/research/copy |
| `300` | `sf-docs` | `300-sf-docs` | Docs/context/support |
| `301` | `sf-context` | `301-sf-context` | Docs/context/support |
| `302` | `sf-help` | `302-sf-help` | Docs/context/support |
| `303` | `sf-resume` | `303-sf-resume` | Docs/context/support |
| `304` | `sf-changelog` | `304-sf-changelog` | Docs/context/support |
| `305` | `sf-init` | `305-sf-init` | Docs/context/support |
| `306` | `sf-scaffold` | `306-sf-scaffold` | Docs/context/support |
| `307` | `sf-skills-refresh` | `307-sf-skills-refresh` | Docs/context/support |
| `308` | `sf-status` | `308-sf-status` | Docs/context/support |
| `309` | `sf-tasks` | `309-sf-tasks` | Docs/context/support |
| `400` | `sf-audit` | `400-sf-audit` | Audit/quality/ops |
| `401` | `sf-audit-code` | `401-sf-audit-code` | Audit/quality/ops |
| `402` | `sf-deps` | `402-sf-deps` | Audit/quality/ops |
| `403` | `sf-perf` | `403-sf-perf` | Audit/quality/ops |
| `404` | `sf-migrate` | `404-sf-migrate` | Audit/quality/ops |
| `405` | `sf-prod` | `405-sf-prod` | Audit/quality/ops |
| `406` | `sf-audit-seo` | `406-sf-audit-seo` | Audit/quality/ops |
| `407` | `sf-audit-translate` | `407-sf-audit-translate` | Audit/quality/ops |
| `408` | `sf-audit-gtm` | `408-sf-audit-gtm` | Audit/quality/ops |
| `409` | `sf-audit-a11y` | `409-sf-audit-a11y` | Audit/quality/ops |
| `500` | `sf-design-from-scratch` | `500-sf-design-from-scratch` | Design/components |
| `501` | `sf-design-playground` | `501-sf-design-playground` | Design/components |
| `502` | `sf-audit-design` | `502-sf-audit-design` | Design/components |
| `503` | `sf-audit-design-tokens` | `503-sf-audit-design-tokens` | Design/components |
| `504` | `sf-audit-components` | `504-sf-audit-components` | Design/components |
| `600` | `sf-local-cloud-sync` | `600-sf-local-cloud-sync` | Data/activation |
| `601` | `sf-product-entitlements` | `601-sf-product-entitlements` | Data/activation |
| `602` | `sf-platform-parity` | `602-sf-platform-parity` | Data/activation |
| `700` | `sf-explore` | `700-sf-explore` | Pilotage/session |
| `701` | `sf-backlog` | `701-sf-backlog` | Pilotage/session |
| `702` | `sf-priorities` | `702-sf-priorities` | Pilotage/session |
| `703` | `sf-review` | `703-sf-review` | Pilotage/session |
| `704` | `sf-model` | `704-sf-model` | Pilotage/session |
| `705` | `sf-conversation-audit` | `705-sf-conversation-audit` | Pilotage/session |
| `706` | `continue` | `706-continue` | Pilotage/session |
| `707` | `name` | `707-name` | Pilotage/session |
| `800` | `tmux-capture-conversation` | `800-tmux-capture-conversation` | Conversation/transcript |
| `801` | `clean-conversation-transcript` | `801-clean-conversation-transcript` | Conversation/transcript |

## Open Questions

None. The operator decision is three digits directly before the existing skill name, with no `$` symbol and no default duplicate wrappers.

## Skill Run History

| Date UTC | Skill | Model | Action | Result | Next step |
|----------|-------|-------|--------|--------|-----------|
| 2026-06-10 22:45:44 UTC | sf-spec | GPT-5 Codex | Created draft spec for three-digit runtime skill-name migration | drafted | /sf-ready Three Digit Runtime Skill Names |
| 2026-06-10 22:58:20 UTC | sf-ready | GPT-5 Codex | Reviewed structure, user-story alignment, security, documentation, and proof contract | ready | /sf-start Three Digit Runtime Skill Names |
| 2026-06-11 00:10:43 UTC | sf-start | GPT-5 Codex | Renamed first-party skill runtime directories/frontmatter to three-digit names, updated index/help/runtime docs, repaired Claude/Codex symlinks, and ran local validation | implemented; manual picker proof pending before ship | /sf-verify Three Digit Runtime Skill Names |
| 2026-06-11 00:46:44 UTC | 103-sf-verify | GPT-5 Codex | Verified mapping, metadata, runtime symlinks, stale-path scans, sync helper tests, and checklist gate | partial; local proof passed, live Codex/Claude picker proof still NOT_RUN | /107-sf-test Three Digit Runtime Skill Names manual picker proof |
| 2026-06-11 01:01:54 UTC | 107-sf-test | GPT-5 Codex | Ran checklist-first manual picker proof and logged user result | pass; user reported all picker scenarios pass | /103-sf-verify Three Digit Runtime Skill Names |
| 2026-06-11 01:07:02 UTC | 103-sf-verify | GPT-5 Codex | Re-verified after manual picker proof; mapping, metadata, runtime links, checklist, and docs gates pass | verified | /104-sf-end Three Digit Runtime Skill Names |
| 2026-06-11 01:17:44 UTC | 104-sf-end | GPT-5 Codex | Closed the verified runtime skill-name migration, updated task/changelog records, and prepared ship handoff | closed | /005-sf-ship Three Digit Runtime Skill Names |

## Current Chantier Flow

- `sf-spec`: done, draft spec created from explicit operator decision.
- `sf-ready`: ready, readiness gate passed after proof-contract consolidation.
- `sf-start`: implemented, filesystem/runtime symlink proof complete.
- `sf-verify`: verified, local/filesystem proof and manual picker proof complete.
- `sf-end`: closed, task/changelog bookkeeping prepared.
- `sf-ship`: next.

Next step: `/005-sf-ship Three Digit Runtime Skill Names`
