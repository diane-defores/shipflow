---
artifact: documentation
metadata_schema_version: "1.0"
artifact_version: "0.5.0"
project: "shipflow"
created: "2026-04-25"
updated: "2026-05-11"
status: draft
source_skill: manual
scope: "agent-entrypoint"
owner: "unknown"
confidence: "high"
risk_level: "low"
security_impact: "none"
docs_impact: "yes"
linked_systems: ["CLAUDE.md", "shipflow_data/technical/context.md", "shipflow_data/technical/context-function-tree.md", "shipflow_data/editorial/content-map.md", "README.md", "shipflow_data/technical/", "shipflow_data/technical/code-docs-map.md", "shipflow_data/technical/blacksmith.md", "skills/references/canonical-paths.md", "shipflow_data/business/project-competitors-and-inspirations.md", "shipflow_data/business/affiliate-programs.md"]
depends_on: []
supersedes: []
evidence: ["Repository structure and active context docs", "shipflow_data/editorial/content-map.md added as the content routing artifact", "Canonical path resolution added for ShipFlow-owned tools and references", "Technical documentation layer added for code-proximate agent routing", "Blacksmith CI/SSH Access routing added for APK build and log debugging.", "Business registries added for project competitors/inspirations and affiliate programs."]
next_step: "/sf-docs update AGENT.md"
---

# AGENT

## Role

Ce fichier est le point d'entree rapide pour un agent qui arrive dans le repo. Il ne doit pas dupliquer toute la doc. Il doit diriger vers le bon contexte le plus vite possible.

## Read Order

1. Lire `CLAUDE.md` pour les contraintes du repo.
2. Lire `shipflow_data/technical/context.md` pour la carte operative du projet.
3. Lire `shipflow_data/technical/context-function-tree.md` si la tache touche les scripts Bash principaux ou `lib.sh`.
4. Lire `shipflow_data/technical/code-docs-map.md` si la tache touche du code, un outil, une skill, un template, le site public ou la documentation technique.
5. Lire `shipflow_data/editorial/content-map.md` si la tache touche contenu, repurposing, blog, docs publiques, landing pages, FAQ ou cocons semantiques.
6. Lire `README.md` pour la vue d'ensemble publique et les workflows officiels.

## Route By Task

- Pour tout fichier interne ShipFlow, resoudre depuis `${SHIPFLOW_ROOT:-$HOME/shipflow}`. Cela inclut `skills/`, `skills/references/`, `templates/`, `tools/`, `shipflow-spec-driven-workflow.md` et `shipflow-metadata-migration-guide.md`. Le repo courant ne sert de racine que pour les artefacts et le code du projet audite ou modifie.
- Si la tache touche le CLI principal, commencer par `shipflow.sh`, `lib.sh`, puis `shipflow_data/technical/context.md`.
- Si la tache touche le setup serveur ou Codex, lire `install.sh`, `config.sh`, puis `shipflow_data/technical/context.md`.
- Si la tache touche les tunnels SSH locaux, lire `local/local.sh`, `local/dev-tunnel.sh`, puis `shipflow_data/technical/context-function-tree.md`.
- Si la tache touche Blacksmith, runners CI, Testboxes, logs CI, APK/AAB Android, SSH Access runner ou debugging de build GitHub Actions, lire `shipflow_data/technical/blacksmith.md`; pour une verification deploy/logs, router via `skills/sf-prod/SKILL.md`, et pour une release complete via `skills/sf-deploy/SKILL.md`.
- Si la tache touche les skills, lire `README.md`, `shipflow-spec-driven-workflow.md`, puis les `skills/*/SKILL.md` concernes.
- Si la tache touche la metadata des docs, lire `$SHIPFLOW_ROOT/shipflow-metadata-migration-guide.md`, `$SHIPFLOW_ROOT/tools/shipflow_metadata_lint.py`, puis `$SHIPFLOW_ROOT/skills/sf-docs/SKILL.md`.
- Si la tache touche un code area mappe, lire `shipflow_data/technical/code-docs-map.md`, puis le doc primaire dans `shipflow_data/technical/`. `AGENT.md` reste canonique; `AGENTS.md` ne doit etre qu'un symlink de compatibilite vers `AGENT.md`.
- Si la tache touche contenu, repurposing, blog, docs publiques, landing pages ou cocons semantiques, lire `shipflow_data/editorial/content-map.md`, puis `skills/sf-repurpose/SKILL.md` si la demande transforme une source en contenu.
- Si la tache touche produit, audience, priorites ou scope, lire `shipflow_data/business/business.md`, `shipflow_data/business/product.md`, puis `shipflow_data/business/gtm.md` si la demande touche la promesse publique.
- Si la tache touche concurrents, alternatives, inspirations, references marche, differenciation ou anti-patterns par projet, lire `shipflow_data/business/project-competitors-and-inspirations.md`, puis `shipflow_data/business/gtm.md`.
- Si la tache touche affiliation, referral, sponsorship, partner programs, liens remuneres ou disclosure commerciale, lire `shipflow_data/business/affiliate-programs.md`, puis `shipflow_data/business/gtm.md`.
- Si la tache touche architecture ou conventions techniques, lire `shipflow_data/technical/architecture.md`, `shipflow_data/technical/guidelines.md`, puis `shipflow_data/technical/context.md`.

## Context Docs

- `CLAUDE.md`: contraintes techniques et patterns critiques.
- `shipflow_data/technical/context.md`: architecture, entry points, flux, hotspots, invariants, ou modifier quoi.
- `shipflow_data/technical/context-function-tree.md`: arbre de fonctions des scripts principaux.
- `shipflow_data/editorial/content-map.md`: surfaces de contenu, pages piliers, cocons semantiques, destinations de repurposing.
- `shipflow-spec-driven-workflow.md`: doctrine de travail spec-first et artefacts.
- `shipflow-metadata-migration-guide.md`: doctrine de migration frontmatter.
- `shipflow_data/technical/README.md`: index interne des docs techniques proches du code.
- `shipflow_data/technical/code-docs-map.md`: map code -> docs, validations et triggers de mise a jour.
- `shipflow_data/technical/blacksmith.md`: Blacksmith CI, APK builds, logs, Run History, Metrics, SSH Access, Testboxes.
- `shipflow_data/business/business.md`: contrat business.
- `shipflow_data/business/product.md`: contrat produit.
- `shipflow_data/business/branding.md`: contrat de marque.
- `shipflow_data/business/gtm.md`: contrat de promesse publique et de distribution.
- `shipflow_data/business/project-competitors-and-inspirations.md`: registre des concurrents, alternatives, inspirations et anti-patterns par projet.
- `shipflow_data/business/affiliate-programs.md`: registre des programmes d'affiliation, referral, partner et disclosure par projet.
- `shipflow_data/technical/architecture.md`: contrat de structure technique.
- `shipflow_data/technical/guidelines.md`: conventions techniques et de contribution.

## Rules

- Ne pas lire tout le repo avant d'identifier la zone utile.
- Sur hote Linux ARM64 (`aarch64`/`arm64`), ne pas lancer de build Android release local: pas de `flutter build apk --release`, `flutter build appbundle --release`, `./gradlew assembleRelease` ou `./gradlew bundleRelease`; router les APK/AAB vers Blacksmith ou une CI Linux x64. Localement, limiter Flutter a `flutter analyze`, `flutter test` et `flutter build web --release`.
- Utiliser `shipflow_data/technical/context.md` comme index, pas comme verite absolue.
- Si `shipflow_data/technical/context.md` et le code divergent, le code gagne et la doc doit etre corrigee.
- Pour une tache locale, lire seulement la doc specialisee necessaire.
- Pour une tache ambigue ou transverse, lire `shipflow_data/technical/context.md` avant de parcourir le code.
