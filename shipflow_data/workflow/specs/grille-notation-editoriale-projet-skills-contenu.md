---
artifact: spec
metadata_schema_version: "1.0"
artifact_version: "0.1.0"
project: "ShipFlow"
created: "2026-05-24"
created_at: "2026-05-24 22:15:52 UTC"
updated: "2026-05-25"
updated_at: "2026-05-25 09:30:10 UTC"
status: reviewed
source_skill: sf-spec
source_model: "unknown"
scope: "content-governance-feature"
owner: "Diane"
user_story: "En tant qu'utilisatrice ShipFlow qui produit, repurpose, audite ou vérifie des contenus pour plusieurs projets, je veux une grille de notation éditoriale partagée mais paramétrée par projet, afin que les skills contenu donnent un score et un feedback structuré cohérents sans créer une skill par projet."
confidence: "high"
risk_level: "medium"
security_impact: "yes"
docs_impact: "yes"
linked_systems:
  - "skills/sf-content/SKILL.md"
  - "skills/sf-repurpose/SKILL.md"
  - "skills/sf-redact/SKILL.md"
  - "skills/sf-enrich/SKILL.md"
  - "skills/sf-audit-copy/SKILL.md"
  - "skills/sf-audit-copywriting/SKILL.md"
  - "skills/sf-audit-seo/SKILL.md"
  - "skills/sf-verify/SKILL.md"
  - "skills/references/editorial-content-corpus.md"
  - "shipflow_data/editorial/content-map.md"
  - "shipflow_data/editorial/claim-register.md"
  - "shipflow_data/editorial/page-intent-map.md"
  - "shipflow_data/editorial/editorial-update-gate.md"
  - "shipflow_data/business/business.md"
  - "shipflow_data/business/product.md"
  - "shipflow_data/business/branding.md"
  - "shipflow_data/business/gtm.md"
depends_on:
  - artifact: "shipflow_data/editorial/content-map.md"
    artifact_version: "0.8.0"
    required_status: "draft"
  - artifact: "shipflow_data/editorial/claim-register.md"
    artifact_version: "1.1.0"
    required_status: "reviewed"
  - artifact: "skills/references/editorial-content-corpus.md"
    artifact_version: "1.4.0"
    required_status: "active"
  - artifact: "skills/references/decision-quality-contract.md"
    artifact_version: "1.0.0"
    required_status: "active"
  - artifact: "skills/sf-content/SKILL.md"
    artifact_version: "unknown"
    required_status: "unknown"
supersedes: []
evidence:
  - "Veille 2026-05-24: Essay Grader AI shows a useful rubric + score + structured feedback pattern."
  - "User decision 2026-05-24: integrate structured feedback and project-specific scoring rules inside content skills instead of creating one skill per project."
  - "shipflow_data/workflow/TASKS.md now tracks: cadrer une grille de notation éditoriale réutilisable par les skills contenu, avec critères communs et règles spécifiques par projet."
  - "shipflow_data/workflow/research/tools.md records Essay Grader AI as inspiration for editorial rubric scoring."
next_step: "/sf-spec grille notation editoriale projet skills contenu"
---

# Spec: Grille de notation éditoriale projet pour les skills contenu

## Title

Grille de notation éditoriale projet pour les skills contenu

## Status

Draft.

La direction produit est décidée : une brique commune de notation éditoriale doit être intégrée aux skills contenu, avec des règles spécifiques par projet chargées depuis le corpus de gouvernance. La spec doit encore passer `/sf-ready` avant implémentation pour confirmer les fichiers cibles et la profondeur d'intégration.

## User Story

En tant qu'utilisatrice ShipFlow qui produit, repurpose, audite ou vérifie des contenus pour plusieurs projets, je veux une grille de notation éditoriale partagée mais paramétrée par projet, afin que les skills contenu donnent un score et un feedback structuré cohérents sans créer une skill par projet.

## Minimal Behavior Contract

Quand un skill contenu doit évaluer, améliorer, valider ou préparer la publication d'un contenu, il charge une grille commune de critères éditoriaux, puis applique les pondérations et contraintes du projet cible depuis `shipflow_data/business/*` et `shipflow_data/editorial/*`; il produit un score lisible, des sous-scores par critère, des blocages éventuels, et un feedback actionnable relié aux règles projet. En cas de contexte projet insuffisant, de surface éditoriale absente, ou de claim sensible non prouvé, il doit dégrader la confiance, signaler le blocage et éviter toute validation faussement positive. L'edge case facile à rater est un score générique qui récompense un bon texte mais ignore que le projet exige une voix, une promesse, une prudence médicale, une fraîcheur locale, ou une preuve différente.

## Success Behavior

- Précondition : un contenu source, brouillon, page, article, doc ou sortie de repurposing existe, et le projet cible peut être résolu.
- Déclencheur : `sf-content`, `sf-repurpose`, `sf-redact`, `sf-enrich`, `sf-audit-copy`, `sf-audit-copywriting`, `sf-audit-seo` ou `sf-verify` demande une évaluation qualitative.
- Résultat opérateur : le rapport contient un score global, des scores par axe, les critères qui ont pesé le plus, les corrections prioritaires, et les preuves ou manques de preuve.
- Effet système attendu : aucun contenu n'est publié, ship, ou marqué prêt sans statut qualité explicite quand le workflow demande une validation éditoriale.
- Preuve de succès : les tests ou checks ciblés confirment que la grille commune existe, que les skills l'utilisent, et que les règles projet peuvent varier sans dupliquer une skill.
- Succès silencieux : interdit. La notation doit être observable dans le rapport ou dans une structure de sortie standard.

## Error Behavior

- Si le projet cible est ambigu, demander une décision ou marquer `project context unresolved`; ne pas appliquer une grille arbitraire.
- Si le projet n'a pas de corpus éditorial ou business exploitable, appliquer seulement les critères communs, réduire la confiance, et recommander `/sf-docs editorial` ou `/sf-init` selon le manque.
- Si une surface blog/article/newsletter/social demandée est absente, reporter `surface missing: <surface>` et ne pas créer de chemin.
- Si un claim sensible est détecté sans preuve suffisante, produire un `Claim Impact Plan` ou un blocage `needs proof` / `claim mismatch` / `blocked`.
- Si le contenu obtient un score global correct mais échoue sur un critère bloquant du projet, le statut final doit rester `blocked` ou `needs revision`.
- Si la grille ou les règles projet sont incohérentes, le skill doit expliquer la contradiction et éviter de valider le contenu.

## Problem

Les skills contenu ShipFlow peuvent déjà router, rédiger, repurpose, enrichir, auditer et vérifier des contenus. Il manque toutefois une façon commune de répondre à la question : "Est-ce que ce contenu est bon pour ce projet précis ?"

Sans brique partagée, chaque skill risque de noter selon ses propres critères, ou de produire des retours vagues. À l'inverse, créer une skill par projet créerait une explosion de maintenance et déplacerait la vérité projet hors du corpus de gouvernance.

## Solution

Ajouter une couche partagée de notation éditoriale qui sépare trois niveaux :

1. Critères communs ShipFlow : clarté, structure, actionnabilité, cohérence avec la source, preuves, CTA, lisibilité, SEO quand applicable, sécurité des claims.
2. Règles projet : audience, ton, promesse, non-objectifs, contraintes de marque, GTM, surfaces éditoriales, claim register et risques métier.
3. Sortie standard : score global, sous-scores, statut, feedback priorisé, corrections obligatoires, preuves manquantes, et prochaine route ShipFlow.

Cette couche doit être consommée par les skills contenu existants. Elle ne doit pas devenir une nouvelle skill autonome par projet.

## Scope In

- Créer une référence partagée décrivant la grille de notation éditoriale, son format de sortie et sa logique de pondération.
- Ajouter un contrat d'utilisation dans `sf-content` pour router les workflows contenu vers cette grille quand la qualité éditoriale doit être évaluée.
- Intégrer la grille dans les owner skills pertinents : `sf-repurpose`, `sf-redact`, `sf-enrich`, `sf-audit-copy`, `sf-audit-copywriting`, `sf-audit-seo`.
- Définir comment `sf-verify` peut consommer un score éditorial quand une spec ou un workflow l'exige.
- Définir les sources de règles projet sans créer de fichiers par projet obligatoires au départ.
- Documenter les stop conditions : contexte projet absent, surface manquante, claim sensible, score bloquant.
- Prévoir au moins deux exemples de profils de notation : un projet pédagogique/actionnable type GoCharbon, et un projet santé/addiction ou trust-sensitive type Quit Coke.

## Scope Out

- Créer une skill par projet.
- Créer un produit de scoring ContentGlowz complet ou une API backend.
- Modifier des contenus publics existants.
- Créer une interface dashboard, base de données, score persistant ou analytics.
- Créer une surface blog/article/newsletter/social manquante.
- Publier automatiquement des contenus selon le score.
- Ajouter des claims publics sur une qualité garantie des contenus.

## Constraints

- La vérité projet reste dans `shipflow_data/`, pas dans des prompts codés en dur.
- Les critères spécifiques doivent être déduits des contrats existants : `business`, `product`, `branding`, `gtm`, `content-map`, `claim-register`, `page-intent-map`, `public-surface-map`.
- La grille doit tolérer les projets sans gouvernance complète en dégradant la confiance plutôt qu'en inventant.
- Les scores ne remplacent pas le jugement éditorial ; ils orientent la révision et les gates.
- Les claims santé, addiction, finance, conformité, sécurité, privacy, IA fiable, pricing, savings et business outcomes doivent être traités comme critères bloquants ou à preuve.
- La sortie doit être lisible par un humain et réutilisable par un agent.
- Aucune dépendance externe n'est requise pour la première version.

## Dependencies

- `skills/references/editorial-content-corpus.md` pour le chargement des corpus éditoriaux.
- `shipflow_data/editorial/content-map.md` pour les surfaces.
- `shipflow_data/editorial/claim-register.md` pour les claims sensibles.
- `shipflow_data/business/business.md`, `product.md`, `branding.md`, `gtm.md` pour les règles projet.
- Skills owner : `sf-content`, `sf-repurpose`, `sf-redact`, `sf-enrich`, `sf-audit-copy`, `sf-audit-copywriting`, `sf-audit-seo`, `sf-verify`.
- Fresh external docs verdict : `fresh-docs not needed`, car le chantier porte sur des contrats locaux ShipFlow et n'introduit pas de SDK, API, framework ou fournisseur externe.

## Invariants

- Une seule architecture de notation pour tous les projets.
- Les règles projet sont des entrées de la grille, pas des forks de skill.
- Un score global ne peut pas masquer un critère bloquant.
- Le feedback doit être actionnable : chaque faiblesse majeure doit proposer une correction concrète ou une route ShipFlow.
- La grille doit distinguer `needs revision`, `blocked`, `publishable with caveats`, et `ready`.
- Les surfaces absentes restent absentes jusqu'à décision explicite.
- La sortie ne doit jamais inventer de preuve, de testimonial, de chiffre, de promesse médicale ou de garantie.

## Links & Consequences

- `sf-content` gagne un rôle plus clair de gate qualité en fin de lifecycle contenu.
- `sf-repurpose` peut vérifier que ses outputs restent source-faithful et adaptés au projet cible.
- `sf-redact` et `sf-enrich` peuvent demander une auto-évaluation structurée avant de proposer une version finale.
- `sf-audit-copy`, `sf-audit-copywriting` et `sf-audit-seo` peuvent converger vers un format de scoring comparable.
- `sf-verify` peut vérifier une condition de spec du type "score éditorial prêt et aucun critère bloquant".
- Les projets sensibles comme santé/addiction nécessitent des règles plus strictes sur preuves, ton, claims et sécurité utilisateur.
- Les projets locaux ou événementiels nécessitent des critères de fraîcheur, précision géographique et utilité pratique.

## Documentation Coherence

À mettre à jour pendant l'implémentation :

- Nouvelle référence partagée de grille éditoriale dans `skills/references/`.
- `skills/sf-content/SKILL.md` pour décrire quand la grille est invoquée.
- Skills owner listés dans le scope pour consommer ou produire la sortie standard.
- `shipflow_data/editorial/content-map.md` si la surface "content quality rubric" doit être déclarée comme règle éditoriale interne.
- `shipflow_data/technical/skill-runtime-and-lifecycle.md` si la nouvelle référence devient une brique de lifecycle officielle.
- Public docs ou pages skill seulement si la promesse utilisateur visible change.

Pas de changement nécessaire aux contenus des projets cibles dans cette spec.

## Edge Cases

- Un contenu est clair et bien écrit mais viole le ton de marque du projet.
- Un contenu score bien en SEO mais renforce un claim santé ou business non prouvé.
- Un projet n'a pas de `claim-register` ; la grille doit appliquer les familles sensibles globales et demander une gouvernance plus complète.
- Un projet a plusieurs surfaces possibles ; la grille doit noter contre la surface cible, pas contre le projet en général.
- Une sortie de `sf-repurpose` contient une idée séduisante mais non présente dans la source ; score source-faithfulness doit bloquer.
- Une page locale ou événementielle est bien structurée mais contient des informations périmées ; fraîcheur doit être un critère fort.
- Un contenu court comme une FAQ ne doit pas être pénalisé parce qu'il n'a pas la structure d'un article long.
- Un score numérique sans explication est insuffisant.

## Implementation Tasks

- [ ] Tâche 1 : Créer la référence partagée de notation éditoriale.
  - Fichier : `skills/references/content-quality-rubric.md`
  - Action : Définir les critères communs, les sources de règles projet, le format de sortie standard, les statuts possibles et les stop conditions.
  - User story link : Fournit une seule brique commune au lieu d'une skill par projet.
  - Depends on : None
  - Validate with : `rg -n "Content Quality Rubric|score|project rules|Claim Impact Plan|surface missing" skills/references/content-quality-rubric.md`
  - Notes : La référence doit rester indépendante d'un projet spécifique.

- [ ] Tâche 2 : Intégrer le gate dans `sf-content`.
  - Fichier : `skills/sf-content/SKILL.md`
  - Action : Ajouter le chargement de la référence quand le mode touche audit, draft final, repurpose final, enrichissement, validation ou ship content ; définir la route vers owner skills et `sf-verify`.
  - User story link : Rend la notation accessible depuis le lifecycle contenu principal.
  - Depends on : Tâche 1
  - Validate with : `rg -n "content-quality-rubric|quality score|rubric|needs revision|blocked" skills/sf-content/SKILL.md`
  - Notes : Ne pas faire de `sf-content` un rédacteur ou auditeur complet.

- [ ] Tâche 3 : Aligner les owner skills contenu sur la sortie standard.
  - Fichier : `skills/sf-repurpose/SKILL.md`, `skills/sf-redact/SKILL.md`, `skills/sf-enrich/SKILL.md`, `skills/sf-audit-copy/SKILL.md`, `skills/sf-audit-copywriting/SKILL.md`, `skills/sf-audit-seo/SKILL.md`
  - Action : Ajouter les gates précis pour charger ou produire la notation quand le mode concerne un contenu public, un brouillon final, une amélioration, un audit, ou un claim.
  - User story link : Garantit que les retours qualité sont cohérents entre skills.
  - Depends on : Tâche 1
  - Validate with : `rg -n "content-quality-rubric|rubric|score|feedback structuré|structured feedback" skills/sf-*.md`
  - Notes : Conserver les responsabilités de chaque skill.

- [ ] Tâche 4 : Ajouter la consommation côté vérification.
  - Fichier : `skills/sf-verify/SKILL.md`
  - Action : Décrire comment `sf-verify` vérifie un score éditorial quand une spec ou un workflow déclare ce gate, et comment il bloque sur critère bloquant.
  - User story link : Permet d'utiliser la grille comme preuve de qualité avant close/ship.
  - Depends on : Tâche 1
  - Validate with : `rg -n "content-quality-rubric|editorial score|content quality|blocking criterion" skills/sf-verify/SKILL.md`
  - Notes : Ne pas rendre le score obligatoire pour tous les ships.

- [ ] Tâche 5 : Documenter la brique dans les contrats techniques/editoriaux.
  - Fichier : `shipflow_data/editorial/content-map.md`, `shipflow_data/technical/skill-runtime-and-lifecycle.md`
  - Action : Ajouter la référence comme brique interne de gouvernance contenu, ses consommateurs et ses triggers.
  - User story link : Préserve la découvrabilité pour un agent frais.
  - Depends on : Tâches 1-4
  - Validate with : `python3 tools/shipflow_metadata_lint.py shipflow_data/editorial/content-map.md shipflow_data/technical/skill-runtime-and-lifecycle.md`
  - Notes : Public docs uniquement si les pages visibles changent.

- [ ] Tâche 6 : Valider l'ensemble et synchroniser les skills.
  - Fichier : `skills/`, `skills/references/`, `shipflow_data/`
  - Action : Exécuter les audits et checks ciblés, corriger les incohérences, puis préparer le handoff vers `/sf-verify`.
  - User story link : Prouve que la nouvelle brique est utilisable et cohérente.
  - Depends on : Tâches 1-5
  - Validate with : `python3 tools/skill_budget_audit.py --skills-root skills --format markdown`, `tools/shipflow_sync_skills.sh --check --all`, `python3 tools/shipflow_metadata_lint.py shipflow_data/workflow/specs/grille-notation-editoriale-projet-skills-contenu.md skills/references/content-quality-rubric.md shipflow_data/editorial/content-map.md shipflow_data/technical/skill-runtime-and-lifecycle.md`
  - Notes : Ajouter `npm --prefix site run build` seulement si les pages publiques ou runtime content changent.

## Acceptance Criteria

- [ ] CA 1 : Given un contenu final à valider pour un projet avec corpus complet, when un skill contenu invoque la grille, then le rapport contient un score global, des sous-scores, un statut, et un feedback priorisé relié aux règles du projet.
- [ ] CA 2 : Given deux projets avec marques et risques différents, when le même type de contenu est évalué, then les pondérations et blocages peuvent différer sans changer de skill.
- [ ] CA 3 : Given un contenu avec claim sensible non prouvé, when la grille l'évalue, then le statut est `blocked` ou `needs proof` même si les autres critères sont bons.
- [ ] CA 4 : Given un projet sans corpus éditorial complet, when la grille l'évalue, then la confiance est réduite et le rapport recommande le bootstrap documentaire approprié.
- [ ] CA 5 : Given une surface demandée absente, when un contenu est évalué pour cette surface, then le rapport signale `surface missing` et ne propose pas de publication.
- [ ] CA 6 : Given une sortie de repurposing qui invente un claim non présent dans la source, when elle est notée, then source-faithfulness bloque ou demande révision.
- [ ] CA 7 : Given une spec exige un gate de qualité éditoriale, when `sf-verify` vérifie le chantier, then il peut lire le statut de notation et bloquer sur critère bloquant.
- [ ] CA 8 : Given les skills sont synchronisés, when les validations ShipFlow sont lancées, then budget audit, runtime sync, metadata lint et checks ciblés passent ou rapportent un blocage précis.

## Test Strategy

- Unit : aucune unité runtime requise pour la première version, car le changement est contractuel et documentaire.
- Contract checks : `rg` ciblés sur la référence et les skills pour vérifier présence des gates, statuts et formats de sortie.
- Metadata : `python3 tools/shipflow_metadata_lint.py` sur la spec et les documents modifiés.
- Skill runtime : `python3 tools/skill_budget_audit.py --skills-root skills --format markdown` et `tools/shipflow_sync_skills.sh --check --all`.
- Manual review : relire deux exemples de notation dans la référence, dont un projet sensible et un projet contenu/SEO, pour vérifier qu'ils n'encouragent pas un score générique.
- Public build : `npm --prefix site run build` seulement si une page publique ou `site/src/content/**` est modifiée.

## Risks

- Risque de sur-scoring : un score numérique peut donner une fausse confiance. Mitigation : statut bloquant et explication obligatoire.
- Risque de duplication : chaque skill pourrait reformuler la grille. Mitigation : référence unique dans `skills/references/content-quality-rubric.md`.
- Risque de claims sensibles : un contenu peut être convaincant mais juridiquement ou médicalement dangereux. Mitigation : claim register et familles sensibles globales.
- Risque de complexité : trop de critères rendraient les rapports inutilisables. Mitigation : critères communs compacts + feedback priorisé.
- Risque de gouvernance absente : certains projets n'ont pas encore de corpus complet. Mitigation : confidence downgrade + route `/sf-docs editorial` ou `/sf-init`.

## Execution Notes

- Lire d'abord `skills/sf-content/SKILL.md`, `skills/references/editorial-content-corpus.md`, `shipflow_data/editorial/content-map.md`, `shipflow_data/editorial/claim-register.md`, puis les owner skills.
- Implémenter la référence commune avant de modifier les skills consommateurs.
- Garder les changements de skills courts : ils doivent charger/produire la grille, pas dupliquer toute la doctrine.
- Ne pas créer de fichier par projet. Les exemples peuvent montrer comment déduire des règles projet depuis le corpus.
- Stop condition : si l'implémentation révèle qu'un projet a besoin de nouvelles surfaces éditoriales, créer une spec dédiée plutôt que l'inclure ici.
- Stop condition : si une page publique est modifiée, appliquer l'Editorial Update Plan et le build Astro.
- Fresh external docs : `fresh-docs not needed`.

## Open Questions

None

## Skill Run History

| Date UTC | Skill | Model | Action | Result | Next step |
|----------|-------|-------|--------|--------|-----------|
| 2026-05-24 22:15:52 UTC | sf-spec | unknown | Created draft spec from sf-veille Essay Grader AI intake and operator decision to build one shared project-aware editorial scoring rubric for content skills. | draft saved | /sf-ready grille notation editoriale projet skills contenu |
| 2026-05-25 09:30:10 UTC | sf-ready | unknown | Reviewed draft against Definition of Ready criteria. | not ready | /sf-spec grille notation editoriale projet skills contenu |

## Current Chantier Flow

- `sf-spec`: done, draft spec created.
- `sf-ready`: launched, not ready.
- `sf-start`: not launched.
- `sf-verify`: not launched.
- `sf-end`: not launched.
- `sf-ship`: not launched.

Next step: `/sf-ready grille notation editoriale projet skills contenu`
