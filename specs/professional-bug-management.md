---
artifact: spec
metadata_schema_version: "1.0"
artifact_version: "0.1.0"
project: ShipFlow
created: "2026-04-27"
updated: "2026-04-27"
status: draft
source_skill: sf-spec
scope: feature
owner: Diane
user_story: "En tant qu'utilisatrice ShipFlow qui corrige des bugs avec des agents sur plusieurs sessions, je veux une gestion professionnelle des bugs avec index compact, dossier detaille par bug et preuves separees, afin de conserver une vraie tracabilite sans transformer TEST_LOG.md ou BUGS.md en fichiers ingerables."
confidence: high
risk_level: medium
security_impact: yes
docs_impact: yes
linked_systems:
  - skills/sf-test/SKILL.md
  - skills/sf-fix/SKILL.md
  - skills/sf-verify/SKILL.md
  - skills/sf-help/SKILL.md
  - skills/sf-docs/SKILL.md
  - templates/artifacts/
  - tools/shipflow_metadata_lint.py
  - README.md
  - shipflow-spec-driven-workflow.md
  - CHANGELOG.md
depends_on:
  - artifact: "BUSINESS.md"
    artifact_version: "1.1.0"
    required_status: "reviewed"
  - artifact: "PRODUCT.md"
    artifact_version: "1.1.0"
    required_status: "reviewed"
  - artifact: "BRANDING.md"
    artifact_version: "1.0.0"
    required_status: "reviewed"
  - artifact: "GUIDELINES.md"
    artifact_version: "1.0.0"
    required_status: "reviewed"
  - artifact: "shipflow-spec-driven-workflow.md"
    artifact_version: "0.3.0"
    required_status: "draft"
supersedes: []
evidence:
  - "User feedback 2026-04-27: TEST_LOG.md alone will grow without bound if it stores full bug investigation detail."
  - "User feedback 2026-04-27: bug traceability must include how the bug happens and what was attempted to fix it."
  - "Repo investigation: sf-test currently writes TEST_LOG.md and BUGS.md, but has no per-bug dossier or evidence directory."
  - "Repo doctrine: trackers stay lightweight; durable decisions and evidence belong in dedicated artifacts."
next_step: "/sf-ready Professional Bug Management"
---

# Spec: Professional Bug Management

## Title

Professional Bug Management

## Status

draft

## User Story

En tant qu'utilisatrice ShipFlow qui corrige des bugs avec des agents sur plusieurs sessions, je veux une gestion professionnelle des bugs avec index compact, dossier detaille par bug et preuves separees, afin de conserver une vraie tracabilite sans transformer `TEST_LOG.md` ou `BUGS.md` en fichiers ingerables.

## Minimal Behavior Contract

Quand un test manuel, une verification, un diagnostic navigateur ou une correction revele un bug, ShipFlow doit creer ou mettre a jour une trace courte dans les index du projet, puis conserver le detail complet dans un dossier dedie au bug. Les index doivent permettre de voir rapidement quoi est ouvert, ferme, bloque ou a retester; le dossier du bug doit expliquer comment reproduire le probleme, ce qui etait attendu, ce qui a ete observe, quelles hypotheses ont ete testees, quelles corrections ont ete tentees, quels fichiers ou commits sont lies, et quel est le resultat des retests. En cas d'information incomplete, le bug reste actionable avec une confiance explicite ou un statut `needs-info`, sans inventer les preuves manquantes. L'edge case facile a rater est le gros log ou screenshot: il doit etre reference comme fichier de preuve, pas colle dans un markdown central.

## Success Behavior

- Preconditions: un projet utilise ShipFlow et peut contenir `TEST_LOG.md`, `BUGS.md`, `bugs/`, et `test-evidence/`.
- Trigger: `sf-test` constate un echec, `sf-fix` capture ou corrige un bug, `sf-auth-debug` produit une preuve de bug, ou `sf-verify` detecte une regression actionable.
- User/operator result: l'utilisatrice voit un identifiant stable `BUG-YYYY-MM-DD-001`, un index compact des bugs, un dossier detaille par bug, et la prochaine commande claire.
- System effect: ShipFlow append ou met a jour les fichiers concernes sans supprimer l'historique existant; les preuves volumineuses sont referencees par chemin.
- Success proof: ouvrir `BUGS.md` donne l'etat global en moins d'une minute; ouvrir `bugs/BUG-ID.md` donne assez de contexte pour qu'un agent frais reproduise, corrige ou reteste le bug.
- Silent success: not allowed; toute creation, mise a jour, retest ou fermeture de bug doit etre visible dans le dossier du bug ou explicitement signalee comme non tracee.

## Error Behavior

- Expected failures: bug deja existant, reproduction incomplete, preuve trop volumineuse, bug non reproductible, plusieurs bugs similaires, fichier non modifiable, evidence fournie sans chemin, ou correction tentee sans retest.
- User/operator response: le rapport doit dire ce qui a ete trace, ce qui manque, le statut du bug, et la prochaine action concrete.
- System effect: aucune duplication non controlee dans `TEST_LOG.md`; aucun gros log inline; aucun bug marque `fixed` sans retest; aucun ancien contexte supprime.
- Must never happen: ecraser l'historique d'un bug, fermer un bug sur simple hypothese, logguer des secrets ou donnees sensibles, coller un HAR/stacktrace massif dans `TEST_LOG.md`, ou creer deux bugs identiques sans lien.
- Silent failure: not allowed; si un dossier bug ou une preuve ne peut pas etre ecrit, le rapport final doit le dire.

## Problem

`sf-test` a deja la bonne intention: transformer un resultat de test en memoire projet durable. Mais le modele actuel melange trop de responsabilites. `TEST_LOG.md` risque de devenir un journal gigantesque si chaque echec contient reproduction, captures, logs, hypotheses, tentatives de fix et retests. `BUGS.md` risque aussi de devenir illisible si chaque bug y accumule tout son historique.

Le besoin reel est une gestion de bug professionnelle: index court pour piloter, dossier complet pour enqueter, preuves separees pour ne pas exploser la taille des fichiers markdown, et cycle de vie explicite entre detection, triage, correction, retest et cloture.

## Solution

Introduire une architecture de bug tracking ShipFlow en trois couches: `TEST_LOG.md` reste un journal compact des scenarios testes, `BUGS.md` devient un index compact des bugs, et `bugs/BUG-ID.md` devient le dossier complet du bug. Les preuves volumineuses vivent dans `test-evidence/BUG-ID/` et sont referencees depuis le dossier bug. Les skills `sf-test`, `sf-fix`, `sf-verify` et les docs doivent appliquer cette separation de responsabilites.

## Scope In

- Definir la structure projet standard pour bugs: `BUGS.md`, `bugs/`, `test-evidence/`.
- Transformer `BUGS.md` en index compact plutot qu'en dossier complet.
- Creer un format de dossier bug individuel `bugs/BUG-ID.md`.
- Ajouter un format d'historique de correction et de retest dans chaque dossier bug.
- Mettre a jour `sf-test` pour ouvrir ou mettre a jour un dossier bug detaille quand un test echoue.
- Mettre a jour `sf-fix` pour lire le dossier bug, append les tentatives de correction, et exiger un retest avant fermeture.
- Mettre a jour `sf-verify` pour detecter les bugs ouverts lies au scope et refuser une cloture optimiste.
- Documenter les limites de taille et la politique de preuves.
- Ajouter les templates necessaires dans `templates/artifacts/`.

## Scope Out

- Construire une interface web de bug tracker.
- Synchroniser avec GitHub Issues, Linear, Jira ou un outil externe.
- Migrer automatiquement tous les anciens bugs de tous les projets.
- Stocker des captures binaires dans git sans decision explicite du projet.
- Remplacer les tests automatises par les dossiers bug.
- Transformer `TASKS.md`, `AUDIT_LOG.md` ou `PROJECTS.md` en bug tracker.

## Constraints

- `TEST_LOG.md` et `BUGS.md` restent des trackers operationnels courts, sans frontmatter obligatoire.
- `bugs/BUG-ID.md` est un artefact durable ShipFlow et doit utiliser le frontmatter standard avec `artifact: bug_record`.
- Les preuves volumineuses ne doivent jamais etre collees inline dans les index.
- Les chemins de preuve doivent etre relatifs au projet quand possible.
- Les logs contenant secrets, tokens, cookies, emails prives, donnees personnelles ou payloads sensibles doivent etre rediges avant d'etre references.
- Les skills ne doivent pas inventer reproduction, evidence, commit, tentative de correction ou resultat de retest.
- La fermeture d'un bug exige un retest ou une justification explicite `closed-without-retest` qui reste visible comme risque.

## Dependencies

- Runtime: markdown, YAML frontmatter pour `bugs/*.md`, conventions de nommage `BUG-YYYY-MM-DD-NNN`.
- Document contracts: `PRODUCT.md` 1.1.0, `BUSINESS.md` 1.1.0, `BRANDING.md` 1.0.0, `GUIDELINES.md` 1.0.0, `shipflow-spec-driven-workflow.md` 0.3.0.
- Skill dependencies: `sf-test`, `sf-fix`, `sf-verify`, `sf-help`, `sf-docs`, and optionally `sf-auth-debug` when browser auth evidence is involved.
- Metadata gaps: `BUGS.md` and `TEST_LOG.md` intentionally remain tracker files and should not be migrated to artifact frontmatter.
- Fresh external docs: fresh-docs not needed, because the change is local to ShipFlow markdown conventions and skill instructions.

## Invariants

- `TEST_LOG.md` answers: what was tested, when, with what result, and which bug or next step followed.
- `BUGS.md` answers: what bugs are open or recently closed, severity, owner/status if known, last tested date, and link to the detailed dossier.
- `bugs/BUG-ID.md` answers: how the bug reproduces, what evidence exists, what was tried, what changed, and how retests behaved.
- `test-evidence/BUG-ID/` stores only external evidence files or redacted text dumps too large for the dossier.
- A bug can move to `fixed-pending-verify` only after a fix attempt exists; it can move to `closed` only after retest evidence or an explicit accepted exception.
- Every bug dossier must be usable by a fresh agent without reading the chat history.

## Links & Consequences

- Upstream systems: `sf-test` creates bug records from failed manual tests; `sf-auth-debug` can attach browser-level evidence; `sf-verify` can surface regressions or open-bug blockers.
- Downstream systems: `sf-fix` consumes bug dossiers; `sf-test --retest BUG-ID` appends retest history; `sf-ship` should warn when linked high/critical bugs remain open.
- Cross-cutting checks: security for evidence redaction, documentation coherence for workflow docs, metadata linting for bug dossier frontmatter, and operational sanity for file growth.
- Regression impact: existing projects with simple `BUGS.md` should continue working; the new structure is additive and applies when new bugs are opened or retested.

## Documentation Coherence

- `skills/sf-test/SKILL.md` must explain the compact log plus detailed bug dossier model.
- `skills/sf-fix/SKILL.md` must treat bug dossiers as the primary input when a bug ID is provided.
- `skills/sf-verify/SKILL.md` must define how open bugs affect closure and verification.
- `skills/sf-help/SKILL.md` must expose the bug workflow and file roles.
- `templates/artifacts/bug_record.md` must define the per-bug dossier format.
- `README.md` and `shipflow-spec-driven-workflow.md` must mention the professional bug loop.
- `CHANGELOG.md` must record the new bug-management doctrine.
- Public skill pages under `site/src/content/skills/` should be updated later if they expose `sf-test` or `sf-fix` behavior.

## Edge Cases

- Same failure reported twice: update the existing open bug if reproduction and observed behavior clearly match; otherwise create a new bug and cross-link as related.
- Failed retest after a claimed fix: keep status `open` or move back from `fixed-pending-verify`, append retest result, and preserve the failed fix attempt.
- Partial fix: record `partial` in the fix attempt and retest history; do not close.
- Non-reproducible bug: keep `needs-repro` or `needs-info`, with exact missing evidence.
- Sensitive logs: create a redacted evidence file and note what was redacted; never preserve raw secrets.
- Massive evidence: store as separate file path or external reference, not inline.
- Production bug with destructive reproduction: record safe reproduction steps and require explicit approval for destructive retests.
- Bug caused by stale expected behavior: route to `sf-spec` or docs update instead of forcing a code fix.
- Multiple projects: bug artifacts belong to the project repo where the behavior exists, not global `shipflow_data`.

## Implementation Tasks

- [ ] Task 1: Add a bug dossier template
  - File: `templates/artifacts/bug_record.md`
  - Action: Create a ShipFlow artifact template for `bugs/BUG-ID.md` with frontmatter, reproduction, expected, observed, evidence, diagnosis notes, fix attempts, retest history, related artifacts, and closure criteria.
  - User story link: Gives every bug a durable detailed home without bloating the indexes.
  - Depends on: None
  - Validate with: `sed -n '1,260p' templates/artifacts/bug_record.md`
  - Notes: Include explicit redaction and large-evidence guidance.

- [ ] Task 2: Define compact index formats
  - File: `skills/sf-test/SKILL.md`
  - Action: Replace the current full `BUGS.md` append format with a compact index row or compact section that links to `bugs/BUG-ID.md`; keep `TEST_LOG.md` scenario entries short.
  - User story link: Prevents `TEST_LOG.md` and `BUGS.md` from becoming unbounded investigation dumps.
  - Depends on: Task 1
  - Validate with: `rg -n "compact|bugs/BUG|test-evidence|BUGS.md|TEST_LOG.md" skills/sf-test/SKILL.md`
  - Notes: Preserve existing rule that results cannot be invented.

- [ ] Task 3: Update `sf-test` failure handling
  - File: `skills/sf-test/SKILL.md`
  - Action: On failure, create or update `bugs/BUG-ID.md`, create `test-evidence/BUG-ID/` when evidence paths are supplied or generated, and write only a short pointer in `TEST_LOG.md`.
  - User story link: Converts failed manual tests into actionable bug dossiers.
  - Depends on: Task 2
  - Validate with: `rg -n "bug dossier|test-evidence|Retest History|Fix Attempts|needs-info" skills/sf-test/SKILL.md`
  - Notes: For `--retest BUG-ID`, append to the bug dossier retest history rather than duplicating full context in `TEST_LOG.md`.

- [ ] Task 4: Update `sf-fix` to consume and write bug dossiers
  - File: `skills/sf-fix/SKILL.md`
  - Action: When invoked with a bug ID or matching bug title, read `BUGS.md` and `bugs/BUG-ID.md`; append diagnosis notes and fix attempts; set status to `fixed-pending-verify` only after a concrete fix attempt.
  - User story link: Captures what was tried to correct the bug, including failed or partial attempts.
  - Depends on: Task 1
  - Validate with: `rg -n "bug dossier|Fix Attempts|fixed-pending-verify|closed-without-retest|BUG-ID" skills/sf-fix/SKILL.md`
  - Notes: If the bug has no reproduction, route to diagnostic or `sf-test` instead of guessing.

- [ ] Task 5: Update verification and shipping gates
  - File: `skills/sf-verify/SKILL.md`
  - Action: Require `sf-verify` to check for linked open high/critical bug records when verifying a scope; verification reports must state whether bug state blocks closure.
  - User story link: Prevents shipping while known core bugs remain unresolved.
  - Depends on: Task 4
  - Validate with: `rg -n "BUGS.md|bugs/|open bug|fixed-pending-verify|high|critical" skills/sf-verify/SKILL.md`
  - Notes: `sf-ship` can be updated in the same implementation pass if verification delegates shipping readiness.

- [ ] Task 6: Add bug artifact metadata lint support
  - File: `tools/shipflow_metadata_lint.py`
  - Action: Include `bugs/*.md` as optional/default ShipFlow artifacts when present and accept `artifact: bug_record`.
  - User story link: Keeps detailed bug dossiers structured and reviewable.
  - Depends on: Task 1
  - Validate with: `SHIPFLOW_ROOT="${SHIPFLOW_ROOT:-/home/claude/shipflow}" "$SHIPFLOW_ROOT/tools/shipflow_metadata_lint.py" templates/artifacts/bug_record.md`
  - Notes: Do not lint `BUGS.md` or `TEST_LOG.md` as artifacts.

- [ ] Task 7: Document the professional bug loop
  - File: `shipflow-spec-driven-workflow.md`
  - Action: Add a concise section explaining `sf-test -> bug dossier -> sf-fix -> sf-test --retest -> sf-verify`, with file roles and size rules.
  - User story link: Makes the doctrine visible outside individual skills.
  - Depends on: Tasks 2-5
  - Validate with: `rg -n "Professional Bug|bug dossier|test-evidence|sf-test --retest" shipflow-spec-driven-workflow.md`
  - Notes: Keep this as workflow doctrine, not an exhaustive bug-tracker manual.

- [ ] Task 8: Update README and skill help
  - File: `README.md`
  - Action: Mention professional bug management in structured AI workflows and define the three file roles at a high level.
  - User story link: A fresh user understands that ShipFlow now preserves bug traceability.
  - Depends on: Task 7
  - Validate with: `rg -n "bug|BUGS.md|TEST_LOG.md|test-evidence" README.md skills/sf-help/SKILL.md`
  - Notes: Also update `skills/sf-help/SKILL.md` in this task or split if implementation gets large.

- [ ] Task 9: Update changelog
  - File: `CHANGELOG.md`
  - Action: Add an Unreleased entry for professional bug management, per-bug dossiers, compact indexes, and evidence directories.
  - User story link: Makes the workflow change discoverable in release history.
  - Depends on: Tasks 1-8
  - Validate with: `sed -n '1,60p' CHANGELOG.md`
  - Notes: Keep the changelog entry concise.

## Acceptance Criteria

- [ ] CA 1: Given a failed `sf-test` scenario, when the result is logged, then `TEST_LOG.md` contains a short scenario entry with a pointer to `BUG-ID` and `bugs/BUG-ID.md` contains the detailed reproduction, expected behavior, observed behavior, evidence, and next step.
- [ ] CA 2: Given a bug with large console/network logs, when evidence is recorded, then the markdown references a file under `test-evidence/BUG-ID/` or an external path instead of embedding the full log inline.
- [ ] CA 3: Given `sf-fix BUG-ID`, when a fix is attempted, then `sf-fix` reads the bug dossier and appends a fix attempt with changed files, hypothesis, validation command, outcome, and next retest command.
- [ ] CA 4: Given a bug fix has not been retested, when closure is reported, then the status is not `closed`; it is `fixed-pending-verify` or explicitly marked with a visible exception.
- [ ] CA 5: Given a retest still fails, when `sf-test --retest BUG-ID` records the result, then the bug remains open and the failed retest is appended without deleting prior fix attempts.
- [ ] CA 6: Given an existing `BUGS.md`, when a new bug is created, then the index stays compact and links to the bug dossier rather than duplicating all details.
- [ ] CA 7: Given sensitive evidence is supplied, when it is attached, then the recorded artifact says whether redaction was applied and must not include secrets, cookies, tokens, or private payloads.
- [ ] CA 8: Given a fresh agent opens only `BUGS.md` and `bugs/BUG-ID.md`, when asked to continue work, then it can identify current status, reproduction, attempted fixes, evidence, and next step without reading chat history.

## Test Strategy

- Unit: None required initially, because this is markdown skill behavior, but add targeted metadata-linter coverage if `tools/shipflow_metadata_lint.py` gains `bug_record` validation logic.
- Integration: Run metadata lint against `templates/artifacts/bug_record.md` and, if sample fixtures are added, against a sample `bugs/BUG-ID.md`.
- Manual: Simulate a failed `sf-test` in a disposable project or fixture, verify the resulting expected file structure, then simulate `sf-fix BUG-ID` and `sf-test --retest BUG-ID`.
- Regression: Verify existing `sf-test` pass/blocked/not-run paths still keep `TEST_LOG.md` compact and do not create bug dossiers unnecessarily.

## Risks

- Security impact: yes, because bug evidence may include secrets, cookies, tokens, emails, screenshots, request payloads, or production data. Mitigation: require redaction guidance, avoid inline large logs, and make evidence status explicit.
- Product/data/performance risk: medium, because unmanaged evidence directories can grow. Mitigation: store only paths or redacted minimal evidence by default, avoid binary capture unless explicit, and keep indexes compact.
- Workflow risk: medium, because adding too many files can feel bureaucratic. Mitigation: create detailed bug dossiers only for failed or actionable bugs, not for every passing test.
- Migration risk: low to medium, because legacy `BUGS.md` files may already contain details. Mitigation: leave old content valid and apply the new structure only to new or retested bugs unless a project explicitly requests migration.

## Execution Notes

- Read first: `skills/sf-test/SKILL.md`, `skills/sf-fix/SKILL.md`, `skills/sf-verify/SKILL.md`, `templates/artifacts/spec.md`, `tools/shipflow_metadata_lint.py`.
- Implement in order: template first, then `sf-test`, then `sf-fix`, then verification/docs/linter.
- Use additive edits and preserve existing history in any existing `TEST_LOG.md` or `BUGS.md`.
- Do not create a global bug registry in `/home/claude/shipflow_data`; bug records belong to the project where the bug exists.
- Do not introduce an external issue tracker integration in this pass.
- Validate with: metadata lint for the new template, `rg` checks for skill instruction coverage, and a manual dry-run against a fixture or temporary project.
- Stop conditions: unclear status lifecycle, uncertainty about storing sensitive evidence, or conflict with an existing project-specific bug tracker.

## Open Questions

None for the first implementation pass. The chosen default is: compact project indexes plus per-bug dossiers plus separate evidence directories. External issue tracker sync, UI, and historical migration stay out of scope.
