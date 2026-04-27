---
artifact: spec
metadata_schema_version: "1.0"
artifact_version: "0.1.0"
project: ShipFlow
created: "2026-04-27"
created_at: "2026-04-27 09:23:02 UTC"
updated: "2026-04-27"
updated_at: "2026-04-27 09:23:02 UTC"
status: draft
source_skill: sf-spec
source_model: "GPT-5 Codex"
scope: feature
owner: Diane
user_story: "En tant qu'utilisatrice ShipFlow qui lance plusieurs skills sur plusieurs chantiers, je veux que chaque spec se documente elle-meme avec les skills lancees, leur statut, leur modele et la prochaine etape, afin de savoir rapidement ou en est un chantier sans relire l'historique de conversation."
confidence: high
risk_level: medium
security_impact: none
docs_impact: yes
linked_systems:
  - specs/
  - templates/artifacts/spec.md
  - skills/sf-spec/SKILL.md
  - skills/sf-ready/SKILL.md
  - skills/sf-start/SKILL.md
  - skills/sf-verify/SKILL.md
  - skills/sf-end/SKILL.md
  - skills/sf-ship/SKILL.md
  - skills/sf-help/SKILL.md
depends_on:
  - artifact: "shipflow-spec-driven-workflow.md"
    artifact_version: "unknown"
    required_status: "active"
  - artifact: "shipflow-metadata-migration-guide.md"
    artifact_version: "unknown"
    required_status: "active"
  - artifact: "README.md"
    artifact_version: "unknown"
    required_status: "active"
supersedes: []
evidence:
  - "User decision 2026-04-27: the global registry should be the specs folder, not a separate tracker."
  - "User decision 2026-04-27: add the GPT model used to launch/create the spec in metadata."
  - "Repo investigation: TASKS.md, AUDIT_LOG.md, and PROJECTS.md are operational trackers; specs are durable ShipFlow artifacts."
next_step: "/sf-ready Specs as chantier registry"
---

# Spec: Specs as Chantier Registry

## Title

Specs as Chantier Registry

## Status

draft

## User Story

En tant qu'utilisatrice ShipFlow qui lance plusieurs skills sur plusieurs chantiers, je veux que chaque spec se documente elle-meme avec les skills lancees, leur statut, leur modele et la prochaine etape, afin de savoir rapidement ou en est un chantier sans relire l'historique de conversation.

## Minimal Behavior Contract

Quand une skill travaille sur un chantier spec-first, elle doit lire la spec du chantier, ajouter ou mettre a jour une trace concise de son passage dans cette spec, puis terminer son report avec un bloc standard qui indique la skill courante, le flux du chantier, ce qui reste a faire, la prochaine etape et un verdict nommant explicitement la skill. Si aucune spec ne correspond au chantier, la skill doit dire qu'elle ne peut pas tracer le flux spec-first et orienter vers `sf-spec` au lieu d'inventer un registre parallele. Le cas facile a rater est celui d'une skill d'audit ou de check appelee hors chantier: elle ne doit pas polluer une spec sans lien clair, mais son report doit quand meme dire que le tracking de chantier n'est pas applicable.

## Success Behavior

- Preconditions: un chantier spec-first possede un fichier dans `specs/` ou `docs/`, avec frontmatter ShipFlow.
- Trigger: une skill de cadrage, readiness, execution, verification ou cloture est lancee sur ce chantier.
- User/operator result: le report final indique clairement si `sf-spec`, `sf-ready`, `sf-start`, `sf-verify`, `sf-end` ou `sf-ship` ont deja ete lances pour le chantier, avec la prochaine commande utile.
- System effect: la spec du chantier contient une section persistante `Skill Run History` et un resume courant de flux.
- Success proof: ouvrir la spec suffit pour voir les skills lancees, l'heure UTC, le modele, le resultat et la prochaine etape.
- Silent success: not allowed; chaque passage de skill sur un chantier spec-first doit etre visible dans la spec ou explicitement signale comme non trace.

## Error Behavior

- Expected failures: spec introuvable, plusieurs specs candidates, skill hors chantier, fichier de spec non modifiable, metadata manquante pendant migration, conflit entre statut courant et action demandee.
- User/operator response: le report doit nommer le probleme, dire si la trace a ete ecrite ou non, et donner la prochaine action concrete.
- System effect: aucune creation de registre global separe; aucune modification de `TASKS.md`, `AUDIT_LOG.md` ou `PROJECTS.md` pour ce suivi de flux.
- Must never happen: historique de skill invente, trace ecrite dans la mauvaise spec, statut `ready` ou `done` annonce sans preuve, perte de metadata existante, duplication incontrôlee de sections.
- Silent failure: not allowed; si la trace n'a pas pu etre ecrite, le report final doit le dire.

## Problem

ShipFlow contient deja beaucoup de skills et plusieurs trackers operationnels. Quand l'utilisatrice lance `sf-spec`, `sf-ready`, `sf-start`, `sf-verify` et d'autres skills dans plusieurs conversations, elle perd vite la vue du flux: quelle skill a deja tourne, dans quel modele, a quelle heure, avec quel resultat, et quelle est la suite.

Un registre global dedie resoudrait une partie du probleme, mais il ajouterait une source de verite supplementaire a maintenir. La decision produit est donc de faire du dossier `specs/` le registre global des chantiers, et de rendre chaque spec auto-tracable.

## Solution

Ajouter au schema de spec ShipFlow des metadata de modele (`source_model`, puis `run_model` dans l'historique) et une section persistante `Skill Run History`. Adapter les skills concernees pour qu'elles tracent leur passage dans la spec quand elles interviennent sur un chantier spec-first, puis terminent leur report avec un bloc standard `Chantier` et un verdict qui repete le nom de la skill active.

## Scope In

- Definir `specs/` comme registre global des chantiers spec-first.
- Ajouter les champs metadata de modele aux specs creees par `sf-spec`.
- Ajouter une section standard `Skill Run History` dans chaque spec de chantier.
- Ajouter un bloc final standard `Chantier` dans les reports de skills.
- Definir quelles skills doivent tracer obligatoirement, conditionnellement ou jamais dans une spec.
- Mettre a jour les templates et instructions des skills spec-driven principales.
- Documenter la doctrine dans l'aide et la doc workflow.

## Scope Out

- Creer un nouveau fichier registre global distinct de `specs/`.
- Imposer ce tracking aux audits hors chantier quand aucune spec ne porte le changement.
- Convertir `TASKS.md`, `AUDIT_LOG.md` ou `PROJECTS.md` en artefacts metadata.
- Reprendre retroactivement tout l'historique des anciennes conversations.
- Changer le systeme d'installation ou de decouverte des skills.

## Constraints

- `TASKS.md`, `AUDIT_LOG.md` et `PROJECTS.md` restent des trackers operationnels sans frontmatter obligatoire.
- La spec reste la source de verite du chantier uniquement pour les travaux spec-first.
- Le tracking doit etre lisible en markdown sans outil dedie.
- Les skills ne doivent pas inventer des etapes passees non prouvees par la spec, le report courant ou des fichiers existants.
- Les edits de spec doivent etre append-only ou ciblés pour eviter d'effacer le contrat du chantier.
- Le modele doit etre trace avec la meilleure information disponible; si le runtime ne fournit pas l'identifiant exact, utiliser une valeur explicite comme `unknown` ou `GPT-5 Codex`.

## Dependencies

- Runtime: markdown, YAML frontmatter, skills ShipFlow existantes.
- Document contracts: `shipflow-spec-driven-workflow.md`, `shipflow-metadata-migration-guide.md`, `README.md`.
- Metadata gaps: les trois documents de dependance n'exposent pas encore tous une version d'artefact; garder `artifact_version: "unknown"` jusqu'a migration.
- Fresh external docs: fresh-docs not needed, because the change is local to ShipFlow markdown conventions and skill instructions.

## Invariants

- Une spec doit rester implementable par un agent frais sans relire l'historique de conversation.
- Le tracking de skill ne remplace pas les sections contractuelles: user story, behavior contract, tasks, acceptance criteria et risks restent obligatoires.
- Une skill hors chantier ne doit pas creer de fausse continuite spec-first.
- Le verdict final d'une skill doit nommer la skill courante, par exemple `Verdict sf-ready: ready`.
- La prochaine etape doit etre une commande ShipFlow executable ou une phrase explicite disant qu'aucune action n'est requise.

## Links & Consequences

- Upstream systems: `sf-spec` cree les specs et doit initialiser les metadata et l'historique; `sf-ready` doit lire cet historique avant de statuer.
- Downstream systems: `sf-start`, `sf-verify`, `sf-end` et `sf-ship` doivent pouvoir afficher le flux du chantier depuis la spec.
- Cross-cutting checks: docs et aide doivent expliquer que `specs/` est le registre de chantier; audits gardent `AUDIT_LOG.md` pour les scores et ne tracent dans une spec que lorsqu'ils sont rattaches a un chantier.
- Compatibility: les specs existantes sans `Skill Run History` doivent rester valides pendant migration, mais les nouvelles specs doivent l'avoir.

## Documentation Coherence

- `templates/artifacts/spec.md` doit montrer les nouveaux champs `created_at`, `updated_at`, `source_model` et la section `Skill Run History`.
- `skills/sf-spec/SKILL.md` doit creer ces champs et cette section.
- `skills/sf-ready/SKILL.md`, `skills/sf-start/SKILL.md`, `skills/sf-verify/SKILL.md`, `skills/sf-end/SKILL.md` et `skills/sf-ship/SKILL.md` doivent decrire leur mise a jour de l'historique quand une spec est presente.
- `skills/sf-help/SKILL.md` doit expliquer la doctrine: `specs/` est le registre global des chantiers spec-first.
- `README.md` ou `shipflow-spec-driven-workflow.md` doit documenter la lecture du flux depuis une spec.
- `CHANGELOG.md` doit mentionner la nouvelle traçabilite des chantiers.

## Edge Cases

- Une skill est lancee avec un titre qui matche plusieurs specs: elle doit demander ou choisir explicitement la spec la plus pertinente avec justification.
- Une skill est lancee hors spec-first: elle affiche `Chantier: non applicable` et ne modifie aucune spec.
- Une ancienne spec n'a pas `Skill Run History`: la premiere skill spec-driven ajoute la section sans modifier les anciennes decisions.
- Le modele exact n'est pas visible: la trace utilise `unknown` ou le nom runtime disponible, sans bloquer le chantier.
- `sf-ready` est lance deux fois: l'historique garde deux lignes avec heures et resultats distincts.
- `sf-start` implemente partiellement: la ligne d'historique doit dire `partial`, pas `done`.
- Une spec est en `ready` mais une execution revele un gap: `sf-start` ou `sf-verify` trace le gap et renvoie vers `sf-spec` ou `sf-ready`.

## Implementation Tasks

- [ ] Task 1: Mettre a jour le template de spec
  - File: `templates/artifacts/spec.md`
  - Action: Ajouter `created_at`, `updated_at`, `source_model`, puis une section `Skill Run History` avec colonnes Date UTC, Skill, Model, Action, Result, Next step.
  - User story link: Permet aux nouvelles specs de s'auto-documenter des leur creation.
  - Depends on: None
  - Validate with: `sed -n '1,220p' templates/artifacts/spec.md`
  - Notes: Garder un template lisible et compatible avec les specs existantes.

- [ ] Task 2: Adapter `sf-spec` pour initialiser la trace de chantier
  - File: `skills/sf-spec/SKILL.md`
  - Action: Exiger les metadata de modele dans le frontmatter et ajouter une premiere ligne `sf-spec` dans `Skill Run History` lors de l'enregistrement.
  - User story link: L'utilisatrice sait quand la spec a ete creee et avec quel modele.
  - Depends on: Task 1
  - Validate with: `rg -n "source_model|Skill Run History|created_at|updated_at" skills/sf-spec/SKILL.md`
  - Notes: Ne pas demander un modele exact si l'environnement ne l'expose pas; imposer une valeur explicite.

- [ ] Task 3: Adapter `sf-ready` pour lire et mettre a jour le flux
  - File: `skills/sf-ready/SKILL.md`
  - Action: Lire `Skill Run History`, ajouter une ligne `sf-ready`, et terminer le report par le bloc `Chantier` avec `Verdict sf-ready: ...`.
  - User story link: L'utilisatrice voit si la readiness gate a deja ete lancee et avec quel resultat.
  - Depends on: Task 1
  - Validate with: `rg -n "Skill Run History|Verdict sf-ready|Chantier" skills/sf-ready/SKILL.md`
  - Notes: Si la spec est not ready, `Next step` doit renvoyer vers `sf-spec` ou une correction precise.

- [ ] Task 4: Adapter `sf-start` pour tracer execution et statut partiel
  - File: `skills/sf-start/SKILL.md`
  - Action: Quand une spec est utilisee, ajouter une ligne `sf-start` avec result `implemented`, `partial`, `blocked` ou `rerouted`, puis inclure `Verdict sf-start: ...`.
  - User story link: L'utilisatrice sait si l'implementation a commence ou reste a faire.
  - Depends on: Task 3
  - Validate with: `rg -n "Skill Run History|Verdict sf-start|partial|blocked" skills/sf-start/SKILL.md`
  - Notes: Ne pas tracer dans une spec si l'execution directe n'est pas rattachee a un chantier.

- [ ] Task 5: Adapter `sf-verify`, `sf-end` et `sf-ship`
  - File: `skills/sf-verify/SKILL.md`
  - Action: Tracer verification, cloture et shipping quand une spec de chantier est identifiee, avec verdicts nommes.
  - User story link: Le flux complet de chantier devient visible jusqu'a verification et livraison.
  - Depends on: Task 4
  - Validate with: `rg -n "Verdict sf-verify|Skill Run History|Chantier" skills/sf-verify/SKILL.md`
  - Notes: La task peut etre splittee pendant implementation pour modifier `sf-end` et `sf-ship` separement si necessaire.

- [ ] Task 6: Definir la doctrine pour les skills conditionnelles
  - File: `skills/sf-help/SKILL.md`
  - Action: Ajouter une matrice simple: obligatoire pour spec-driven, conditionnel pour audits/fix/docs/content, non applicable pour status/help/check hors chantier.
  - User story link: Evite de polluer les specs tout en gardant une regle claire.
  - Depends on: Task 1
  - Validate with: `rg -n "registre global|specs/|conditionnel|Skill Run History" skills/sf-help/SKILL.md`
  - Notes: La matrice doit rester courte et operationnelle.

- [ ] Task 7: Documenter la doctrine dans le workflow public interne
  - File: `shipflow-spec-driven-workflow.md`
  - Action: Expliquer que `specs/` est le registre global des chantiers et que chaque spec garde son historique de skill runs.
  - User story link: Permet de retrouver la regle sans ouvrir les skills.
  - Depends on: Task 6
  - Validate with: `rg -n "Skill Run History|registre global des chantiers|specs/" shipflow-spec-driven-workflow.md`
  - Notes: Ne pas transformer la doc en manuel exhaustif.

- [ ] Task 8: Ajouter une entree changelog
  - File: `CHANGELOG.md`
  - Action: Ajouter une entree concise sur l'auto-tracabilite des specs et le modele source.
  - User story link: Trace le changement de doctrine ShipFlow.
  - Depends on: Tasks 1-7
  - Validate with: `head -80 CHANGELOG.md`
  - Notes: Ne pas revendiquer l'implementation complete avant validation.

## Acceptance Criteria

- [ ] AC 1: Given une nouvelle spec creee par `sf-spec`, when elle est enregistree, then son frontmatter contient `source_model`, `created_at` et `updated_at`.
- [ ] AC 2: Given une nouvelle spec creee par `sf-spec`, when elle est ouverte, then elle contient une section `Skill Run History` avec une ligne initiale pour `sf-spec`.
- [ ] AC 3: Given une spec existante sans historique, when `sf-ready` est lance dessus, then la skill ajoute ou demande l'ajout de `Skill Run History` sans effacer les sections contractuelles.
- [ ] AC 4: Given `sf-ready` a statue sur une spec, when le report final est lu, then il contient `Verdict sf-ready: ...` et un bloc `Chantier` avec la prochaine etape.
- [ ] AC 5: Given `sf-start` implemente seulement une partie du chantier, when il trace son passage, then le resultat est `partial` ou equivalent et la prochaine etape reste explicite.
- [ ] AC 6: Given une skill d'audit lancee hors chantier, when elle produit son report, then elle ne modifie aucune spec et indique que le tracking de chantier est non applicable.
- [ ] AC 7: Given l'utilisatrice veut savoir si `sf-ready` ou `sf-start` a deja ete lance, when elle ouvre la spec du chantier, then l'information est visible sans relire la conversation.

## Test Strategy

- Unit: verifier par `rg` que les nouvelles instructions existent dans les skills et templates modifies.
- Integration: creer une spec de test, simuler les passages `sf-spec` puis `sf-ready`, et verifier que l'historique reste append-only et lisible.
- Manual: ouvrir une spec reelle et confirmer que le bloc final de report indique la skill courante, le flux, les choses restantes et la prochaine etape.
- Regression: verifier que `TASKS.md`, `AUDIT_LOG.md` et `PROJECTS.md` ne recoivent pas de frontmatter ou de suivi de skill runs.

## Risks

- Security impact: none, because the change concerns local markdown metadata and skill reporting only.
- Product risk: trop de skills pourraient ecrire dans les specs et les rendre bruyantes; mitigation par matrice obligatoire/conditionnel/non applicable.
- Data risk: une skill pourrait tracer dans la mauvaise spec si le matching est ambigu; mitigation par selection explicite ou stop condition.
- Maintenance risk: mettre a jour toutes les skills d'un coup peut creer des formulations incoherentes; mitigation par template de bloc final commun.

## Execution Notes

- Read first: `templates/artifacts/spec.md`, `skills/sf-spec/SKILL.md`, `skills/sf-ready/SKILL.md`, `skills/sf-start/SKILL.md`, `skills/sf-verify/SKILL.md`.
- Then read: `skills/sf-help/SKILL.md`, `shipflow-spec-driven-workflow.md`, `shipflow-metadata-migration-guide.md`.
- Implementation approach: start with the template and `sf-spec`, then update the spec-driven lifecycle skills, then document the conditional matrix.
- Suggested final report block:

```text
## Chantier

Skill courante: sf-ready
Chantier: specs/[slug].md
Flux:
- sf-spec: done
- sf-ready: ready
- sf-start: not launched
- sf-verify: not launched

Prochaine etape:
- /sf-start [title]

Verdict sf-ready:
- ready
```

- Validate with: `rg -n "Skill Run History|source_model|Verdict sf-" templates/artifacts/spec.md skills/sf-spec/SKILL.md skills/sf-ready/SKILL.md skills/sf-start/SKILL.md skills/sf-verify/SKILL.md`.
- Stop conditions: if matching the correct spec is ambiguous, ask the user instead of writing a trace; if a skill is unrelated to a chantier, report non-applicable instead of creating a trace.

## Open Questions

None

## Skill Run History

| Date UTC | Skill | Model | Action | Result | Next step |
|----------|-------|-------|--------|--------|-----------|
| 2026-04-27 09:23:02 UTC | sf-spec | GPT-5 Codex | Created spec for specs-as-chantier-registry | draft | /sf-ready Specs as chantier registry |

## Current Chantier Flow

- `sf-spec`: done, draft spec created.
- `sf-ready`: not launched.
- `sf-start`: not launched.
- `sf-verify`: not launched.
- `sf-end`: not launched.
- `sf-ship`: not launched.

Next step: `/sf-ready Specs as chantier registry`
