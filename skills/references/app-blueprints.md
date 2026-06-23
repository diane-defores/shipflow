---
artifact: technical_guidelines
metadata_schema_version: "1.0"
artifact_version: "1.0.0"
project: ShipFlow
created: "2026-06-23"
updated: "2026-06-23"
status: draft
source_skill: 001-sf-build
scope: app-blueprints
owner: Diane
confidence: high
risk_level: medium
security_impact: no
docs_impact: yes
linked_systems:
  - skills/001-sf-build/SKILL.md
  - skills/001-sf-build/references/build-lifecycle-workflow.md
  - skills/100-sf-spec/SKILL.md
  - skills/306-sf-scaffold/SKILL.md
  - skills/204-sf-market-study/SKILL.md
  - skills/references/master-workflow-lifecycle.md
  - skills/app-blueprints/
depends_on: []
supersedes: []
evidence:
  - "User decision 2026-06-23: blueprints serve as global spec skeletons for app archetypes."
  - "User decision 2026-06-23: the process/contract for blueprint ingestion matters more than the blueprint content itself."
  - "Extracted from contentglowz_app as first concrete Flutter blueprint."
next_step: "Add more blueprints as apps are shipped"
---

# App Blueprints

## Purpose

Blueprints are **global spec skeletons** for recurring app archetypes. They pre-fill stack decisions, data models, route structure, folder conventions, and architectural patterns so that `001-sf-build` does not navigate blindly when asked to create a new application.

A blueprint is not a full spec — it is an **app anatomy reference** that:
- Tells `001-sf-build` what kind of app this is and what patterns it follows
- Feeds `100-sf-spec` with a pre-filled architecture section
- Guides `306-sf-scaffold` with folder structure, naming conventions, and file patterns
- Gives `204-sf-market-study` a target archetype for research scoping

## Location

Blueprints live in `$SHIPFLOW_ROOT/skills/app-blueprints/` (ShipFlow root, shared across projects).

Each blueprint is a directory with a `blueprint.md` file and optional supplementary files:

```
$SHIPFLOW_ROOT/skills/app-blueprints/
  README.md                           # Index of available blueprints
  flutter-crud-content/
    blueprint.md                      # The blueprint (primary file)
    references/                       # Optional: patterns, examples, templates
```

## Format

Every blueprint MUST have YAML frontmatter for machine parsing plus a Markdown body for human reading.

### Frontmatter

```yaml
---
id: flutter-crud-content
name: Flutter CRUD Content App
version: 1.0.0
app_type: flutter-mobile-web

# Keywords for fuzzy matching against user requests
match_keywords:
  - content
  - crud
  - carnet
  - health
  - gestion
  - flutter

# Stack decisions
stack:
  framework: flutter
  sdk: ">=3.11.0"
  state_management: riverpod
  routing: go_router
  http: dio
  auth: clerk
  storage: shared_preferences
  architecture: layer-first
  codegen: false

# Source projects that were used to validate this blueprint
sources:
  - contentglowz_app
---
```

### Body sections

The body is structured Markdown. Every blueprint MUST include these sections:

1. **App Anatomy** — what this archetype does, who it serves, typical screens
2. **Stack** — framework, state, routing, HTTP, auth, storage, architecture style
3. **Models** — domain entities with fields, types, required/optional
4. **Routes** — route patterns, shell vs standalone, auth guard logic
5. **Conventions** — folder structure, naming, file patterns, code patterns
6. **Theme** — theming approach, responsive breakpoints
7. **States** — standard state handling (loading, empty, error, offline)

## Matching

When `001-sf-build` receives a request like "crée une app de carnet de santé pour voiture":

1. Normalize the request to keywords: `[carnet, santé, voiture, health, log, vehicle]`
2. Scan `$SHIPFLOW_ROOT/skills/app-blueprints/*/blueprint.md`
3. Match against `match_keywords`, `name`, and `description` (fuzzy, case-insensitive)
4. Return the best match or a shortlist; if no match, proceed without blueprint
5. If multiple blueprints could match, ask the user to choose

The matching logic is a simple keyword overlap score — not AI-dependent, reproducible from shell tools if needed.

## How Skills Consume Blueprints

### 001-sf-build

The Blueprint Gate fires after `existing chantier check` and before `spec/readiness loop`:

```
intake -> chantier check -> BLUEPRINT GATE -> spec/readiness -> governance -> model routing -> start -> verify -> end -> ship
```

At the Blueprint Gate:
1. Try to match the intake against available blueprints.
2. If matched, load the blueprint into the active context.
3. Add a `Blueprint` line to the final report when used.
4. Pass the blueprint path to downstream skills via handoff context.

### 100-sf-spec

When a blueprint is loaded:
- Pre-fill the `Architecture`, `Stack`, and `Data Model` sections of the spec.
- Use the blueprint's model list as the starting point for domain entities.
- Use the blueprint's route structure as the navigation skeleton.
- The author still owns refinement and project-specific decisions.

### 306-sf-scaffold

When a blueprint is loaded:
- Use `conventions.folder_structure` and `conventions.naming` to decide where and how to place files.
- Use the model list to scaffold data classes and services.
- Use the route list to scaffold screens and their shell/guard wrappers.
- Do not invent patterns not present in the blueprint or the project.

### 204-sf-market-study

When a blueprint is loaded:
- Use `app_type` to scope research to the relevant platform.
- Use `stack` to identify ecosystem competitors.
- Use the blueprint description as the "product category" for demand/keyword research.

## When to Create a Blueprint

Create a new blueprint when:
- We have shipped at least one app of a given archetype successfully.
- The archetype is reusable (not one-off).
- The patterns are stable enough to codify.

Update a blueprint when:
- A new shipped app reveals patterns the blueprint missed.
- A framework or dependency version changes meaningfully.
- The architectural conventions in ShipFlow evolve.

## Directory Index

To discover available blueprints without scanning every file, `$SHIPFLOW_ROOT/skills/app-blueprints/README.md` contains:

```yaml
available_blueprints:
  flutter-crud-content:
    name: Flutter CRUD Content App
    description: For apps with auth, entity list/detail/edit, offline queue
    source: contentglowz_app
    keywords: [content, crud, flutter, mobile]
```
