---
artifact: technical_guidelines
metadata_schema_version: "1.0"
artifact_version: "1.0.0"
project: ShipFlow
created: "2026-06-23"
updated: "2026-06-23"
status: draft
source_skill: 001-sf-build
scope: app-blueprints-index
---

# App Blueprints

Blueprints are global spec skeletons for recurring app archetypes. They let ShipFlow skills navigate from "crée une app X" to concrete stack, models, and architecture without starting from zero every time.

## Available Blueprints

| ID | Name | Source | Keywords |
|---|---|---|---|
| `flutter-crud-content` | Flutter CRUD Content App | contentglowz_app | content, crud, carnet, gestion, flutter |

## How Skills Use Blueprints

See `$SHIPFLOW_ROOT/skills/references/app-blueprints.md` for the full system contract:
- Format and matching rules
- Ingestion by `001-sf-build` (Blueprint Gate)
- Consumption by `100-sf-spec`, `306-sf-scaffold`, `204-sf-market-study`

## When to Add

See `app-blueprints.md` for creation criteria. In short: ship an app, extract its repeatable patterns, write a blueprint.
