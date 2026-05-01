---
artifact: spec
metadata_schema_version: "1.0"
artifact_version: "1.0.0"
project: ShipFlow
created: "2026-04-29"
created_at: "2026-04-29 11:03:18 UTC"
updated: "2026-04-30"
updated_at: "2026-04-30 22:30:51 UTC"
status: ready
source_skill: sf-spec
source_model: "GPT-5 Codex"
scope: feature
owner: "Diane"
user_story: "En tant que decideuse ou mainteneuse ShipFlow, je veux que sf-explore puisse produire un rapport d'exploration durable, afin que les options, recherches, raisonnements et incertitudes qui precedent une decision ne restent pas uniquement dans l'historique de conversation."
confidence: high
risk_level: medium
security_impact: yes
docs_impact: yes
linked_systems:
  - "skills/sf-explore/SKILL.md"
  - "templates/artifacts/exploration_report.md"
  - "skills/references/chantier-tracking.md"
  - "shipflow-spec-driven-workflow.md"
  - "skills/sf-help/SKILL.md"
  - "site/src/content/skills/sf-explore.md"
depends_on:
  - artifact: "skills/sf-explore/SKILL.md"
    artifact_version: "unknown"
    required_status: "active"
  - artifact: "templates/artifacts/research_report.md"
    artifact_version: "0.1.0"
    required_status: "active"
  - artifact: "templates/artifacts/decision_record.md"
    artifact_version: "0.1.0"
    required_status: "active"
  - artifact: "skills/references/chantier-tracking.md"
    artifact_version: "0.1.0"
    required_status: "draft"
  - artifact: "shipflow-spec-driven-workflow.md"
    artifact_version: "unknown"
    required_status: "active"
supersedes: []
evidence:
  - "User request on 2026-04-29: sf-explore should not leave substantial research and brainstorming only in conversation history."
  - "skills/sf-explore/SKILL.md currently says exploration may create reflection documents if asked, but has no default durable artifact or template."
  - "shipflow-spec-driven-workflow.md says reusable ShipFlow artifacts should be traceable through metadata, evidence, status, risk, and next step."
  - "templates/artifacts/research_report.md exists for source-backed research, but the requested artifact is a pre-decision exploration report, not a general research report."
  - "sf-ready on 2026-04-29 blocked the draft because the substantial-exploration threshold was undefined and redaction/security requirements were not task-level or acceptance-testable."
next_step: "None"
---

# Spec: Durable Exploration Reports for sf-explore

## Title

Durable Exploration Reports for sf-explore

## Status

ready

## User Story

En tant que decideuse ou mainteneuse ShipFlow, je veux que `sf-explore` puisse produire un rapport d'exploration durable, afin que les options, recherches, raisonnements et incertitudes qui precedent une decision ne restent pas uniquement dans l'historique de conversation.

## Minimal Behavior Contract

Quand `sf-explore` traite une exploration substantielle ou quand l'utilisateur demande explicitement une trace, la skill doit creer ou mettre a jour un rapport `exploration_report` dans le repo gouverne par l'exploration; une exploration est substantielle si elle remplit au moins deux des criteres suivants: elle lit au moins trois fichiers ou documents projet, compare au moins deux options, utilise une recherche internet, identifie des risques ou inconnues qui changent la decision, ou recommande un handoff vers `/sf-spec`. Le rapport capture la question initiale, le contexte lu, les recherches web eventuelles, les options, comparaisons, hypotheses, chemins rejetes, risques, inconnues et le handoff, mais il doit rediger ou masquer les secrets, tokens, cookies, cles privees, donnees client et extraits de logs sensibles au lieu de les persister tels quels. Si le rapport ne peut pas etre ecrit ou ne peut pas etre redige sans exposer une donnee sensible, la skill doit le dire explicitement et fournir un resume recuperable redige dans sa reponse finale au lieu de laisser un echec silencieux. L'edge case le plus facile a rater est la reprise d'une exploration existante: la skill doit proposer ou utiliser le rapport existant au lieu de creer une serie de fichiers concurrents sur le meme sujet.

## Success Behavior

- Preconditions: `sf-explore` est lancee dans un projet avec un sujet, une question ou une decision ouverte; le projet est accessible en lecture et, si une trace durable est requise, en ecriture.
- Trigger: l'utilisateur demande explicitement une trace, ou l'exploration atteint le seuil substantiel de deux criteres parmi: lecture d'au moins trois fichiers/documents, comparaison d'au moins deux options, recherche internet, risque/inconnue decisionnelle explicite, ou recommandation de handoff vers `/sf-spec`.
- User/operator result: l'utilisateur recoit un chemin de fichier clair vers le rapport cree ou mis a jour, plus un resume des conclusions et de la prochaine commande utile.
- System effect: un fichier Markdown `exploration_report` est cree ou mis a jour dans le repo projet, avec frontmatter ShipFlow, evidence, risk, status, next step, sections de raisonnement et regles de redaction appliquees aux donnees sensibles.
- Success proof: `test -f <rapport>` confirme l'existence du rapport, `rg -n "artifact: exploration_report|Option Space|Handoff|Redaction" <rapport>` confirme la structure minimale, le rapport contient les sources web consultees quand il y en a, et aucun secret connu du scenario de test n'apparait en clair.
- Silent success: not allowed; la skill doit toujours annoncer le chemin du rapport ou dire qu'aucun rapport n'a ete ecrit.

## Error Behavior

- Expected failures: projet en lecture seule, dossier cible absent et impossible a creer, sujet trop vague pour un slug stable, plusieurs rapports existants plausibles, conflit entre une exploration ouverte et une spec deja creee, sources web consultees sans URL fiable a citer, ou contenu source qui ne peut pas etre resume sans exposer un secret ou une donnee personnelle.
- User/operator response: expliquer la raison, ne pas pretendre qu'une trace durable existe, et fournir soit le contenu du rapport a enregistrer plus tard, soit une question ciblee pour choisir le rapport a mettre a jour.
- System effect: aucune modification partielle incoherente; si l'ecriture echoue apres generation du contenu, la reponse finale doit inclure le contenu recuperable ou un chemin temporaire explicite si un fichier partiel existe.
- Must never happen: ecrire dans `Skill Run History` d'une spec depuis `sf-explore`, creer un chantier spec au lieu de recommander `/sf-spec`, melanger un `research_report` source-backed avec un `exploration_report` pre-decision, perdre les URLs de recherches internet consultees, persister en clair un secret/token/cookie/cle privee/donnee client/log sensible, ou masquer que le rapport n'a pas ete cree.
- Silent failure: not allowed; toute absence de rapport doit etre visible dans le bloc final de la skill.

## Problem

`sf-explore` sert a clarifier des idees, comparer des options, investiguer le codebase et faire emerger des decisions avant la spec. Cette phase peut contenir une grande partie du travail intellectuel: recherches internet, hypotheses, options abandonnees, risques, contraintes et raisonnement. Aujourd'hui, sauf demande explicite et ad hoc, ce travail reste principalement dans la conversation. La spec qui suit formalise le choix retenu, mais elle ne conserve pas toujours la carte des options ni le raisonnement qui a mene au choix.

## Solution

Ajouter a ShipFlow un artifact `exploration_report` et faire evoluer `sf-explore` pour produire ou mettre a jour ce rapport lorsqu'une exploration atteint le seuil substantiel defini dans cette spec ou quand l'utilisateur demande une trace. Le rapport reste distinct de `research_report`: il documente un espace de decision pre-spec, peut inclure des recherches web comme evidence, puis prepare un handoff propre vers `/sf-spec`, avec une politique de redaction explicite pour ne pas transformer la memoire durable en fuite de secrets.

## Scope In

- Creer `templates/artifacts/exploration_report.md` avec frontmatter ShipFlow, sections de contexte, options, recherches web, non-decisions, risques, inconnues, redaction et handoff.
- Modifier `skills/sf-explore/SKILL.md` pour expliquer quand creer, mettre a jour ou ne pas creer un rapport selon le seuil explicite de deux criteres substantiels.
- Garder `Trace category: non-applicable` pour l'ecriture dans les specs, car `sf-explore` ne doit pas modifier `Skill Run History`.
- Reclasser ou affiner le role process de `sf-explore` dans la doctrine pour representer son role pre-decision sans lui donner le droit de creer une spec.
- Ajouter une regle de chemin pour les rapports: preferer `docs/explorations/YYYY-MM-DD-slug.md` si `docs/` existe, sinon `explorations/YYYY-MM-DD-slug.md`; pour le repo ShipFlow lui-meme, autoriser `research/` seulement comme legacy et preferer la nouvelle convention pour les nouveaux rapports.
- Capturer les recherches internet effectuees pendant l'exploration dans une section dediee du rapport, avec URL, titre, date de consultation et role de la source dans le raisonnement.
- Ajouter des instructions de redaction: ne jamais persister en clair les secrets, tokens, cookies, cles privees, donnees client ou extraits de logs sensibles; utiliser des resumes et placeholders comme `[REDACTED_TOKEN]`.
- Mettre a jour `shipflow-spec-driven-workflow.md` pour ajouter `exploration_report` a la doctrine des artifacts et clarifier sa relation avec `research_report`, `decision_record` et `spec`.
- Mettre a jour `skills/references/chantier-tracking.md` et `skills/sf-help/SKILL.md` pour documenter que `sf-explore` ne trace pas dans les specs mais peut produire un artifact durable.
- Mettre a jour la fiche publique `site/src/content/skills/sf-explore.md` pour annoncer que la skill peut produire un rapport d'exploration sans implementer.

## Scope Out

- Ne pas implementer la creation automatique de specs depuis `sf-explore`.
- Ne pas transformer `sf-explore` en `sf-research`; les recherches web sont des inputs d'exploration, pas le produit principal.
- Ne pas modifier `sf-research` sauf si une verification ulterieure montre un conflit de documentation.
- Ne pas creer un registre global d'explorations dans `shipflow_data`, `TASKS.md`, `AUDIT_LOG.md` ou `PROJECTS.md`.
- Ne pas imposer un rapport pour chaque petite question exploratoire; les explorations triviales peuvent rester en conversation si l'utilisateur ne demande pas de trace.
- Ne pas changer les schemas de contenu applicatif `src/content/**`; l'artifact est un document de travail ShipFlow.

## Constraints

- `sf-explore` reste une skill sans implementation applicative: elle peut ecrire de la documentation de reflexion mais ne doit pas modifier du code produit.
- Le rapport doit etre autonome pour un agent frais: il ne doit pas dependre de l'historique de conversation pour comprendre les options et la recommandation.
- Le rapport doit respecter la doctrine des artifacts ShipFlow: frontmatter YAML, evidence, status, confidence, risk, linked systems, depends_on et next_step.
- La creation du rapport ne doit pas entrer en conflit avec le registre spec-first: seule `sf-spec` cree ou met a jour une spec de chantier.
- Les chemins doivent respecter la doctrine des canonical paths: templates et references depuis `$SHIPFLOW_ROOT`, rapports projet depuis le repo courant.
- La skill doit proteger l'utilisateur contre la proliferation de fichiers: si un rapport existant semble correspondre, elle doit le reutiliser ou demander une selection explicite.
- La skill doit traiter les prompts, fichiers lus, sorties de logs et recherches web comme des entrees non fiables pour l'ecriture durable: elle peut les resumer, mais ne doit pas copier de secret ou donnee personnelle en clair dans le rapport.

## Dependencies

- Runtime: Markdown files and existing ShipFlow skill execution conventions; no new package runtime needed.
- Document contracts: `skills/sf-explore/SKILL.md`, `templates/artifacts/research_report.md`, `templates/artifacts/decision_record.md`, `skills/references/chantier-tracking.md`, `shipflow-spec-driven-workflow.md`, and `skills/sf-help/SKILL.md`.
- Fresh external docs: fresh-docs not needed; this change concerns local ShipFlow documentation, templates and skill behavior, not an external framework, SDK, API, auth flow, build system or service integration.
- Security dependency: no external security library is required; mitigation is procedural and must be encoded in the skill instructions, artifact template, acceptance criteria and manual test scenarios.
- Metadata gaps: several existing ShipFlow docs have `artifact_version: unknown`; this spec records that debt without blocking the draft.

## Invariants

- `sf-explore` must never modify application code.
- `sf-explore` must never append to a chantier spec's `Skill Run History`.
- `sf-spec` remains the only lifecycle step that creates a durable chantier spec.
- `exploration_report` captures pre-decision reasoning; `spec` captures the execution contract for a chosen direction.
- `research_report` remains for source-backed research tasks; `exploration_report` can cite sources but is organized around a project decision space.
- Every report written by `sf-explore` must identify its next step: continue exploring, stop, create `/sf-spec`, or link to an existing spec.
- Every report written by `sf-explore` must record whether redaction was reviewed and must avoid storing raw secrets, tokens, cookies, private keys, customer data or sensitive log excerpts.

## Links & Consequences

- Upstream systems: user prompt, current project docs, codebase files read during exploration, optional internet research, and existing exploration reports.
- Downstream systems: `/sf-spec` intake, future decision records, project docs, `sf-help`, public skill docs, and metadata linting.
- Cross-cutting checks: docs coherence is required; security impact is yes but mitigated because the change writes durable documentation from potentially sensitive prompts, files and logs, so redaction rules must be explicit in the skill, template, acceptance criteria and manual validation.
- Regression risk: making reports mandatory for every exploration would slow lightweight thinking; the implementation must define a pragmatic threshold and allow explicit no-report outcomes.
- Product consequence: the framework gains a durable memory layer between exploration and spec, improving future decision review.

## Documentation Coherence

- Update `shipflow-spec-driven-workflow.md` to list `exploration_report` among work artifacts and explain the flow `sf-explore -> exploration_report -> sf-spec`.
- Update `skills/sf-help/SKILL.md` role matrix and help text so users understand that `sf-explore` can write exploration reports without writing chantier spec history.
- Update `skills/references/chantier-tracking.md` to clarify that `non-applicable` means non-applicable for spec trace, not necessarily unable to write a non-spec artifact.
- Update `site/src/content/skills/sf-explore.md` so public docs mention durable exploration reports.
- Add `templates/artifacts/exploration_report.md` and reference it from the workflow artifact template list.
- Changelog update is likely needed when the implementation is completed, but this spec does not edit `CHANGELOG.md`.

## Edge Cases

- Exploration has only one short answer: no report is required unless the user asks for one.
- User explicitly asks for a report before any conclusion emerges: create a draft report with `status: draft`, `confidence: low`, and `recommended_next_step: continue exploring`.
- Internet research is performed but sources conflict: capture the conflict under source limits or risks instead of flattening it into a recommendation.
- Multiple previous exploration reports match the topic: stop and ask the user which report to update, or create a new report only when the scope is materially different.
- A spec already exists for the same work: update or reference the exploration report only if the user is reopening the decision space; otherwise route to `/sf-ready`, `/sf-start`, or `/sf-verify`.
- Exploration touches sensitive logs, auth, secrets or customer data: summarize safely, replace sensitive values with explicit placeholders such as `[REDACTED_SECRET]`, and record that redaction was applied; if safe summarization is not possible, skip file writing and provide a sanitized recovery summary in the final response.
- The project has no `docs/` directory: create `explorations/` at repo root rather than placing project work artifacts under `$SHIPFLOW_ROOT`.

## Implementation Tasks

- [ ] Task 1: Add the exploration report artifact template.
  - File: `templates/artifacts/exploration_report.md`
  - Action: Create a ShipFlow frontmatter template with sections for starting question, context read, internet research, problem framing, option space, comparison, emerging recommendation, non-decisions, rejected paths, risks, redaction review, decision inputs for spec, handoff and exploration run history.
  - User story link: Gives durable structure to exploration work before decisions are formalized.
  - Depends on: None
  - Validate with: `test -f templates/artifacts/exploration_report.md && rg -n "artifact: exploration_report|Internet Research|Option Space|Decision Inputs For Spec|Handoff|Redaction" templates/artifacts/exploration_report.md`
  - Notes: The template should resemble ShipFlow artifact metadata, not application content schemas.

- [ ] Task 2: Update `sf-explore` behavior and thresholds.
  - File: `skills/sf-explore/SKILL.md`
  - Action: Add instructions for when to create a report, when to update an existing report, when to skip report creation, how to select the output path, how to include web research evidence, and how to apply the substantial threshold: explicit trace request always writes if possible; otherwise write when at least two criteria are true among three files/docs read, two options compared, internet research used, decision-changing risk/unknown identified, or `/sf-spec` handoff recommended.
  - User story link: Makes exploration durable without making every lightweight exchange heavyweight.
  - Depends on: Task 1
  - Validate with: `rg -n "exploration_report|docs/explorations|Internet Research|rapport existant|sf-spec|trois fichiers|deux options|seuil" skills/sf-explore/SKILL.md`
  - Notes: Preserve the core posture: reflection first, no application code implementation.

- [ ] Task 3: Add redaction and sensitive-input safeguards.
  - File: `skills/sf-explore/SKILL.md`
  - Action: Add a durable-report safety rule that treats prompts, files read, logs and copied external content as untrusted for persistence; require redaction or summarization of secrets, tokens, cookies, private keys, customer data and sensitive logs before writing an `exploration_report`.
  - User story link: Preserves durable exploration memory without turning the report into a sensitive-data leak.
  - Depends on: Task 2
  - Validate with: `rg -n "redaction|REDACTED|secret|token|cookie|customer data|logs" skills/sf-explore/SKILL.md templates/artifacts/exploration_report.md`
  - Notes: This is the security gate that makes `security_impact: yes` mitigated; do not rely on the UI or final prose alone.

- [ ] Task 4: Clarify chantier tracking doctrine for exploration artifacts.
  - File: `skills/references/chantier-tracking.md`
  - Action: Explain that `sf-explore` remains non-applicable for spec trace but may write `exploration_report` artifacts; update the role matrix or add a note so non-applicable is not misread as "no durable output ever".
  - User story link: Prevents confusion between spec history and exploration documentation.
  - Depends on: Task 2
  - Validate with: `rg -n "sf-explore|exploration_report|non-applicable.*spec|durable" skills/references/chantier-tracking.md`
  - Notes: Do not grant `sf-explore` permission to append to `Skill Run History`.

- [ ] Task 5: Update the main workflow doctrine.
  - File: `shipflow-spec-driven-workflow.md`
  - Action: Add `exploration_report` to the work artifact list and template list, then document the relationship `sf-explore -> exploration_report -> sf-spec` and the distinction from `research_report` and `decision_record`.
  - User story link: Makes the new artifact part of the official ShipFlow framework.
  - Depends on: Task 1
  - Validate with: `rg -n "exploration_report|Exploration Report|sf-explore -> exploration_report -> sf-spec|research_report" shipflow-spec-driven-workflow.md`
  - Notes: Keep `specs/` as the chantier registry; do not create a parallel registry.

- [ ] Task 6: Update user-facing help.
  - File: `skills/sf-help/SKILL.md`
  - Action: Update the role matrix and help text to say `sf-explore` can produce an exploration report but does not write chantier history.
  - User story link: Makes the behavior discoverable to users.
  - Depends on: Task 4
  - Validate with: `rg -n "sf-explore|exploration report|exploration_report|Chantier Registry" skills/sf-help/SKILL.md`
  - Notes: Keep the distinction short and operational.

- [ ] Task 7: Update public skill docs.
  - File: `site/src/content/skills/sf-explore.md`
  - Action: Update outcome, what_you_get, and limits to mention durable exploration reports for substantial explorations or explicit trace requests.
  - User story link: Aligns public docs with the actual skill behavior.
  - Depends on: Task 2
  - Validate with: `rg -n "exploration report|durable|trace|sf-spec" site/src/content/skills/sf-explore.md`
  - Notes: Avoid implying that `sf-explore` implements changes.

- [ ] Task 8: Validate metadata and search coverage.
  - File: `tools/shipflow_metadata_lint.py`
  - Action: Run the metadata linter against the new template and affected docs; inspect whether the linter already accepts `artifact: exploration_report` or whether no code change is required.
  - User story link: Ensures the new artifact follows the framework's metadata contract.
  - Depends on: Tasks 1-7
  - Validate with: `SHIPFLOW_ROOT="${SHIPFLOW_ROOT:-$HOME/shipflow}" "$SHIPFLOW_ROOT/tools/shipflow_metadata_lint.py" templates/artifacts/exploration_report.md shipflow-spec-driven-workflow.md`
  - Notes: Only modify the linter if validation proves it rejects the new artifact type.

## Acceptance Criteria

- [ ] AC 1: Given a `/sf-explore` run where the user explicitly asks for a trace, when the report can be written safely, then `sf-explore` creates or updates an `exploration_report` file and reports its path.
- [ ] AC 2: Given a `/sf-explore` run with no explicit trace request, when at least two substantial criteria are true among three files/docs read, two options compared, internet research used, decision-changing risk/unknown identified, or `/sf-spec` handoff recommended, then `sf-explore` creates or updates an `exploration_report` file and reports its path.
- [ ] AC 3: Given an exploration includes internet research, when the report is written, then the report includes a section listing each relevant source URL, title or description, access date, and how it influenced the reasoning.
- [ ] AC 4: Given a trivial `/sf-explore` exchange with no explicit trace request and fewer than two substantial criteria, when the skill finishes, then it may skip file creation but must state that no durable report was written when useful.
- [ ] AC 5: Given an existing report appears to match the current topic, when `sf-explore` is asked to continue the same exploration, then it updates or asks to select the existing report instead of silently creating a duplicate.
- [ ] AC 6: Given an exploration crystallizes into executable work, when the final report is produced, then it includes a recommended `/sf-spec ...` handoff with enough seed context for a spec.
- [ ] AC 7: Given `sf-explore` writes an exploration report, when chantier tracking is inspected, then no chantier spec `Skill Run History` is modified by `sf-explore`.
- [ ] AC 8: Given a future spec is created from an exploration, when the spec is drafted, then it can reference the exploration report in `depends_on` or `evidence`.
- [ ] AC 9: Given the new template is inspected, when a fresh agent opens it, then it can distinguish `exploration_report` from `research_report`, `decision_record` and `spec`.
- [ ] AC 10: Given the output path is selected, when the project has `docs/`, then the report path is under `docs/explorations/`; otherwise it is under `explorations/`.
- [ ] AC 11: Given report writing fails, when `sf-explore` ends, then the user sees a non-silent failure with recovery content or a concrete next step.
- [ ] AC 12: Given the exploration input contains a fake token, cookie, private key marker, customer email or sensitive log excerpt, when the report is written, then the report contains a redacted placeholder or summary and does not contain the raw sensitive value.

## Test Strategy

- Unit: None, because this is primarily skill/documentation behavior unless implementation discovers a parser or linter branch that must be changed.
- Integration: Run metadata lint on `templates/artifacts/exploration_report.md` and relevant workflow docs after implementation.
- Manual: Simulate four `/sf-explore` outputs: trivial no-report, substantial report creation from two threshold criteria, continuation of an existing report, and sensitive-input redaction with fake secrets/logs.
- Regression: Search for `sf-explore` doctrine mentions to ensure the new artifact is consistently documented and still cannot write spec history.

## Risks

- Security impact: yes, mitigated by explicit redaction rules for secrets, cookies, tokens, private keys, customer data and private logs in the skill instructions, report template, acceptance criteria and manual validation. This change does not add auth, permissions, network calls or code execution, but it does persist derived content to project files.
- Product/data/performance risk: medium process risk if reporting becomes mandatory and slows lightweight exploration; mitigate with a threshold and explicit no-report path.
- Documentation risk: medium because the change touches multiple doctrine surfaces; mitigate by updating help, workflow docs, template list and public skill docs together.
- Governance risk: medium if `exploration_report` is confused with `spec`; mitigate by saying specs formalize choices and exploration reports preserve pre-choice reasoning.

## Execution Notes

- Read first: `skills/sf-explore/SKILL.md`, `templates/artifacts/research_report.md`, `templates/artifacts/decision_record.md`, `skills/references/chantier-tracking.md`, and `shipflow-spec-driven-workflow.md`.
- Validate with: `rg -n "exploration_report|docs/explorations|sf-explore -> exploration_report -> sf-spec|Redaction|REDACTED|secret|token|trois fichiers|deux options" templates/artifacts skills/sf-explore/SKILL.md skills/references/chantier-tracking.md shipflow-spec-driven-workflow.md skills/sf-help/SKILL.md site/src/content/skills/sf-explore.md`
- Validate metadata with: `SHIPFLOW_ROOT="${SHIPFLOW_ROOT:-$HOME/shipflow}" "$SHIPFLOW_ROOT/tools/shipflow_metadata_lint.py" templates/artifacts/exploration_report.md shipflow-spec-driven-workflow.md`
- Implementation order: template first, `sf-explore` threshold behavior second, redaction safeguards third, doctrine/help/public docs fourth, validation last.
- Stop conditions: if existing uncommitted edits in any target file conflict with this spec's expected edits, inspect and preserve them instead of overwriting; if linter rejects unknown artifact types, decide whether to update the linter or constrain the artifact name before proceeding.

## Open Questions

None

## Skill Run History

| Date UTC | Skill | Model | Action | Result | Next step |
|----------|-------|-------|--------|--------|-----------|
| 2026-04-29 11:03:18 UTC | sf-spec | GPT-5 Codex | Created spec for durable `sf-explore` exploration reports | draft | /sf-ready Durable Exploration Reports for sf-explore |
| 2026-04-29 11:54:09 UTC | sf-ready | GPT-5 Codex | Evaluated readiness for durable `sf-explore` exploration reports | not ready | /sf-spec Durable Exploration Reports for sf-explore |
| 2026-04-29 12:00:44 UTC | sf-ready | GPT-5 Codex | Re-ran readiness on unchanged spec after user request | not ready | /sf-spec Durable Exploration Reports for sf-explore |
| 2026-04-29 16:09:30 UTC | sf-spec | GPT-5 Codex | Updated spec to define substantial-exploration threshold and make redaction/security acceptance-testable | draft | /sf-ready Durable Exploration Reports for sf-explore |
| 2026-04-29 16:11:40 UTC | sf-ready | GPT-5 Codex | Evaluated updated spec against readiness gate | ready | /sf-start Durable Exploration Reports for sf-explore |
| 2026-04-29 17:12:28 UTC | sf-start | GPT-5 Codex | Implemented durable exploration report template, sf-explore threshold/redaction behavior, and doctrine/help/public docs alignment | implemented | /sf-verify Durable Exploration Reports for sf-explore |
| 2026-04-30 21:12:59 UTC | sf-verify | GPT-5 Codex | Verified durable exploration reports, fixed metadata/template enforcement and docs coherence gaps | partial | Resolve unrelated dirty-worktree and optional site-check gaps, then /sf-end Durable Exploration Reports for sf-explore |
| 2026-04-30 22:26:02 UTC | sf-ship | GPT-5 Codex | Full close and ship for durable `sf-explore` exploration reports | shipped | None |
| 2026-04-30 22:30:51 UTC | sf-verify | GPT-5 Codex | Post-ship verification of commit `fd4510f` against durable exploration report contract | verified | None |

## Current Chantier Flow

- `sf-spec`: done, draft spec updated after readiness findings.
- `sf-ready`: ready.
- `sf-start`: implemented.
- `sf-verify`: verified post-ship against commit `fd4510f`.
- `sf-end`: closed by `sf-ship end` full close.
- `sf-ship`: shipped.

Next step: None
