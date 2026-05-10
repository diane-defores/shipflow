---
artifact: documentation
metadata_schema_version: "1.0"
artifact_version: "0.3.0"
project: "shipflow"
created: "2026-04-25"
updated: "2026-05-08"
status: draft
source_skill: manual
scope: "context"
owner: "unknown"
confidence: "high"
risk_level: "medium"
security_impact: "none"
docs_impact: "yes"
linked_systems: ["shipflow.sh", "lib.sh", "config.sh", "install.sh", "local/local.sh", "skills/", "shipflow-spec-driven-workflow.md", "shipflow_data/technical/context-function-tree.md", "shipflow_data/editorial/content-map.md", "shipflow_data/technical/"]
depends_on: []
supersedes: []
evidence: ["README.md", "CLAUDE.md", "shipflow_data/editorial/content-map.md", function extraction from core shell scripts, "shipflow_data/technical/* as code-proximate subsystem documentation"]
next_step: "/sf-docs update shipflow_data/technical/context.md"
---

# CONTEXT

## Purpose

Ce fichier donne la carte operative minimale de ShipFlow. Il sert a gagner du temps au debut d'un nouveau thread et a orienter vers le bon sous-contexte.

## What ShipFlow Is

ShipFlow combine deux couches :

- un gestionnaire d'environnements de dev cote serveur base sur Flox, PM2, Caddy et DuckDNS
- un systeme de skills pour travail spec-first, verification, audit, documentation et shipping

## Entry Points

- `shipflow.sh`: point d'entree du CLI.
- `sf codex` / `sf co`: raccourci de lancement Codex qui court-circuite le
  cleanup des environnements et ouvre une session avec MCP choisis pour ce run.
- `lib.sh`: coeur des actions, validations, integrations systeme et menus.
- `config.sh`: configuration centralisee et validation.
- `install.sh`: bootstrap serveur et configuration de l'environnement utilisateur.
- `local/local.sh`: UX locale des tunnels SSH.
- `skills/`: workflows AI orientes taches.

## Repo Map

- `shipflow.sh`, `lib.sh`, `config.sh`, `install.sh`: couche serveur/CLI.
- `local/`: outils locaux d'acces a un serveur ShipFlow.
- `skills/`: skills ShipFlow pour exploration, spec, execution, verif, docs, audits.
- `templates/artifacts/`: templates d'artefacts versionnes.
- `tools/shipflow_metadata_lint.py`: linter des frontmatters ShipFlow.
- `shipflow-spec-driven-workflow.md`: doctrine de workflow.
- `shipflow-metadata-migration-guide.md`: doctrine de migration metadata.
- `shipflow_data/editorial/content-map.md`: carte des surfaces de contenu, pages piliers, cocons semantiques et destinations de repurposing.
- `shipflow_data/technical/`: couche interne de documentation technique proche du code.
- `shipflow_data/business/business.md`, `shipflow_data/business/product.md`, `shipflow_data/business/branding.md`, `shipflow_data/business/gtm.md`: contrats business, produit et promesse publique.
- `shipflow_data/technical/architecture.md`, `shipflow_data/technical/guidelines.md`: contrats structurels et techniques.

## Core Flows

### 1. Server CLI Flow

```text
shipflow.sh
  -> source lib.sh
  -> select menu frontend
  -> main()
  -> check_prerequisites()
  -> cleanup_orphan_projects()
  -> run_menu()
  -> action_* handlers
  -> env_start / env_stop / env_restart / env_remove / publish / dashboard
```

### 2. Environment Lifecycle

```text
project path
  -> validate_project_path
  -> detect_project_type
  -> init_flox_env
  -> detect_dev_command
  -> find_available_port
  -> PM2 start/update
  -> invalidate_pm2_cache
  -> refresh user-mode Caddy routes from online PM2 apps
  -> dashboard / health / publish
```

### 3. Local Tunnel Flow

```text
local/local.sh
  -> select connection
  -> fetch remote session identity
  -> inspect active remote ports (PM2 + Flutter Web tmux registry)
  -> start_tunnels / stop_tunnels / show_status
```

### 4. Flutter Web Interactive Flow

```text
lib.sh::action_flutter_web
  -> select Flutter project
  -> ensure project Flox runtime
  -> start flutter run -d web-server inside tmux
  -> record port in SHIPFLOW_FLUTTER_WEB_SESSIONS_FILE
  -> send r/R to tmux for hot reload / hot restart
```

### 5. Skill Workflow

```text
sf-explore -> exploration_report -> sf-spec -> sf-ready -> sf-start -> sf-verify -> sf-end
```

Fast paths existent aussi :

- `sf-fix` pour bug-first
- `sf-start` pour tache petite et claire
- `sf-docs metadata` pour migration frontmatter

### 6. Codex MCP Launcher Flow

```text
sf codex OR menu MCP / Codex launcher
  -> choose workspace
  -> choose MCP preset or custom MCPs
  -> exec codex -C <workspace> -c mcp_servers.<name>.enabled=true
```

Les MCP Codex restent desactives par defaut dans `~/.codex/config.toml`; le
launcher active uniquement les MCP demandes pour la nouvelle session.

## Technical Decisions

- PM2 est la source d'etat d'execution. Le cache PM2 doit etre invalide apres mutation.
- Caddy local est gere par ShipFlow en mode utilisateur et suit l'etat PM2:
  start rafraichit les routes, stop/stop-all l'arrete quand aucune app PM2
  n'est online. Le service systeme Caddy est legacy/public et ne doit pas rester
  actif sans app PM2.
- L'allocation de port doit eviter collisions runtime et collisions PM2 cachees.
- Les operations destructives doivent rester idempotentes.
- Les paths projet doivent etre absolus et valides.
- Les docs ShipFlow actives doivent avoir un frontmatter versionne.
- Les changements de code mappes par `shipflow_data/technical/code-docs-map.md` doivent produire un `Documentation Update Plan` ou une justification no-impact.
- `shipflow_data/editorial/content-map.md` doit rester structurel : surfaces, roles, clusters et regles de mise a jour, pas backlog editorial.
- Les trackers operationnels (`TASKS.md`, `AUDIT_LOG.md`, `PROJECTS.md`) ne recoivent pas de frontmatter.
- Les contenus runtime applicatifs gardent leur propre schema de frontmatter.

## Invariants

- Appeler `invalidate_pm2_cache` apres `start`, `stop`, `delete`, `restart` ou tout changement PM2.
- Ne pas parser la structure JS/JSON a coups de grep si une voie fiable existe deja.
- Ne pas editer manuellement des fichiers regeneres comme les configs d'ecosystem runtime.
- Ne pas transformer une passe metadata en rewrite complet de documentation.
- Un succes utilisateur doit etre observable ; un echec doit etre observable ou recuperable, sauf justification explicite.

## Hotspots

- `lib.sh::env_start`: plus gros noeud fonctionnel.
- `lib.sh::show_dashboard`: aggregation d'etat.
- `lib.sh::deploy_github_project`: deploy depuis GitHub.
- `lib.sh::action_publish`: integration Caddy + DuckDNS.
- `local/local.sh::main`: UX locale complete pour tunnels.
- `lib.sh::action_flutter_web`: session Flutter Web interactive en tmux et hot reload.
- `skills/sf-docs/SKILL.md`: logique de migration metadata et audit documentaire.
- `shipflow_data/technical/code-docs-map.md`: fichier partage qui mappe code, docs primaires, validations et triggers de mise a jour.

## Where To Edit What

- Changer le comportement de lancement d'app : `lib.sh` autour de `env_start`, `detect_project_type`, `detect_dev_command`, `fix_port_config`.
- Changer le dashboard ou la sante : `lib.sh` autour de `show_dashboard`, `health_check_all`, `diagnose_app_errors`.
- Changer le launcher Codex ou les presets MCP : `lib.sh` autour de `action_codex_launcher`, puis `install.sh` si les defaults Codex changent.
- Changer la publication web : `lib.sh` autour de `action_publish`.
- Changer les tunnels locaux : `local/local.sh` et `local/dev-tunnel.sh`.
- Changer le mode Flutter Web interactif : `lib.sh` autour de `action_flutter_web`, puis `local/remote-helpers.sh` si le tunnel doit découvrir de nouveaux ports.
- Changer le workflow d'agent : `skills/` + `shipflow-spec-driven-workflow.md`.
- Changer les regles metadata : `skills/sf-docs/SKILL.md`, `tools/shipflow_metadata_lint.py`, `shipflow-metadata-migration-guide.md`, `templates/artifacts/`.
- Changer la documentation technique proche du code : `shipflow_data/technical/code-docs-map.md` puis le doc primaire dans `shipflow_data/technical/`.
- Changer la cartographie editoriale, les destinations de contenu ou les cocons semantiques : `shipflow_data/editorial/content-map.md`, puis `site/src/pages/docs.astro` ou les surfaces concernees.
- Changer le positionnement, l'audience ou le scope produit : `shipflow_data/business/business.md`, `shipflow_data/business/product.md`, `shipflow_data/business/gtm.md`, `shipflow_data/business/branding.md`.
- Changer la structure technique globale : `shipflow_data/technical/architecture.md`, `shipflow_data/technical/guidelines.md`, puis `lib.sh` ou les scripts concernes.

## Read First By Task

- CLI principal : `CLAUDE.md`, `shipflow_data/technical/context-function-tree.md`, `shipflow.sh`, `lib.sh`.
- Install / bootstrap : `install.sh`, `config.sh`, `README.md`.
- Skill / workflow : `README.md`, `shipflow-spec-driven-workflow.md`, puis la skill cible.
- Metadata docs : `shipflow-metadata-migration-guide.md`, `skills/sf-docs/SKILL.md`, `tools/shipflow_metadata_lint.py`.
- Docs techniques / code change : `shipflow_data/technical/code-docs-map.md`, puis le doc primaire mappe.
- Tunnels / acces local : `local/README.md`, `local/local.sh`, `local/dev-tunnel.sh`.
- Produit / business / site : `shipflow_data/business/business.md`, `shipflow_data/business/product.md`, `shipflow_data/business/branding.md`, `shipflow_data/business/gtm.md`.
- Contenu / repurposing : `shipflow_data/editorial/content-map.md`, `skills/sf-repurpose/SKILL.md`, puis la surface cible.
- Architecture / conventions : `shipflow_data/technical/architecture.md`, `shipflow_data/technical/guidelines.md`, `CLAUDE.md`.

## Linked Docs

- [AGENT.md](${SHIPFLOW_ROOT:-$HOME/shipflow}/AGENT.md)
- [CLAUDE.md](${SHIPFLOW_ROOT:-$HOME/shipflow}/CLAUDE.md)
- [README.md](${SHIPFLOW_ROOT:-$HOME/shipflow}/README.md)
- [context-function-tree.md](${SHIPFLOW_ROOT:-$HOME/shipflow}/shipflow_data/technical/context-function-tree.md)
- [content-map.md](${SHIPFLOW_ROOT:-$HOME/shipflow}/shipflow_data/editorial/content-map.md)
- [technical/README.md](${SHIPFLOW_ROOT:-$HOME/shipflow}/shipflow_data/technical/README.md)
- [technical/code-docs-map.md](${SHIPFLOW_ROOT:-$HOME/shipflow}/shipflow_data/technical/code-docs-map.md)
- [shipflow-spec-driven-workflow.md](${SHIPFLOW_ROOT:-$HOME/shipflow}/shipflow-spec-driven-workflow.md)
- [shipflow-metadata-migration-guide.md](${SHIPFLOW_ROOT:-$HOME/shipflow}/shipflow-metadata-migration-guide.md)
- [business/business.md](${SHIPFLOW_ROOT:-$HOME/shipflow}/shipflow_data/business/business.md)
- [business/product.md](${SHIPFLOW_ROOT:-$HOME/shipflow}/shipflow_data/business/product.md)
- [business/branding.md](${SHIPFLOW_ROOT:-$HOME/shipflow}/shipflow_data/business/branding.md)
- [business/gtm.md](${SHIPFLOW_ROOT:-$HOME/shipflow}/shipflow_data/business/gtm.md)
- [technical/architecture.md](${SHIPFLOW_ROOT:-$HOME/shipflow}/shipflow_data/technical/architecture.md)
- [technical/guidelines.md](${SHIPFLOW_ROOT:-$HOME/shipflow}/shipflow_data/technical/guidelines.md)

## Maintenance Rule

Mettre a jour `shipflow_data/technical/context.md` quand un changement modifie :

- les entry points reels
- un flux technique majeur
- les hotspots
- un invariant critique
- la destination officielle des docs de contexte
- la carte `shipflow_data/technical/code-docs-map.md` ou les docs techniques primaires
- les surfaces de contenu ou regles de repurposing officielles
