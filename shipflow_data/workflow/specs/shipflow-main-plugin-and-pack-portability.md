---
artifact: spec
metadata_schema_version: "1.0"
artifact_version: "1.0.0"
project: "shipflow"
created: "2026-06-11"
created_at: "2026-06-11 00:00:00 UTC"
updated: "2026-06-11"
updated_at: "2026-06-11 00:00:00 UTC"
status: ready
source_skill: plugin-creator
source_model: "GPT-5 Codex"
scope: "plugin-packaging"
owner: "Diane"
user_story: "As a ShipFlow operator preparing public distribution, I want one main ShipFlow Codex plugin that can route to bundled or optional packs, so users get a simple install path without manually choosing many plugins."
confidence: medium
risk_level: high
security_impact: yes
docs_impact: yes
linked_systems:
  - "/home/claude/plugins/shipflow/"
  - "/home/claude/plugins/shipflow-core/"
  - "/home/claude/.agents/plugins/marketplace.json"
  - "/home/claude/plugins/shipflow/assets/docs-links.json"
  - "/home/claude/plugins/shipflow/skills/shipflow/references/reference-strategy.md"
  - "/home/claude/plugins/shipflow/scripts/bootstrap_shipflow_repo.sh"
  - "shipflow_data/technical/codex-plugin-packaging.md"
  - "skills/*/SKILL.md"
  - "skills/*/references/*.md"
  - "skills/references/*.md"
  - "templates/artifacts/*.md"
depends_on:
  - artifact: "shipflow_data/workflow/specs/shipflow-skill-execution-fidelity-plugin-pilot.md"
    artifact_version: "1.0.0"
    required_status: "ready"
supersedes: []
evidence:
  - "2026-06-11 local plugin /home/claude/plugins/shipflow was scaffolded and installed as shipflow@personal."
  - "2026-06-11 plugin validation passed for source and installed cache."
  - "2026-06-11 packaging audit reports 0 hard findings and 67 review findings across planned packs."
  - "2026-06-11 source skill 405-sf-prod was corrected to reference the shared actionable-failure contract canonically."
  - "2026-06-11 operator approved a hybrid local-reference plus hosted-docs model for public packaging."
  - "2026-06-11 operator preferred a simpler lightweight-plugin plus GitHub repo bootstrap model over broad reference export pipelines."
  - "2026-06-11 300-sf-docs added technical docs coverage for plugin packaging and sparse bootstrap."
  - "2026-06-11 300-sf-docs updated README surfaces for public site, plugin alpha, sparse bootstrap, and shipflow_data canonical layout."
next_step: "/009-sf-skill-build shipflow-main plugin pack portability"
---

# Spec: ShipFlow Main Plugin and Pack Portability

## Status

ready

## User Story

As a ShipFlow operator preparing public distribution, I want one main ShipFlow Codex plugin that can route to bundled or optional packs, so users get a simple install path without manually choosing many plugins.

## Minimal Behavior Contract

ShipFlow must expose one primary user-facing plugin named `shipflow`. The plugin may internally route to packs, but the default user path must stay `Install ShipFlow` then `$shipflow <instruction>`. Optional packs must not become a manual list of many installs. Any generated pack must be validated for missing references and source-tree assumptions before it is treated as public-ready.

The plugin should remain small. When a user needs the complete ShipFlow skill and reference corpus, ShipFlow should offer an explicit repo bootstrap flow that creates or updates a sparse public GitHub checkout into `${SHIPFLOW_ROOT:-$HOME/.shipflow/source}`.

## Scope In

- Keep `/home/claude/plugins/shipflow/` as the main public-plugin alpha.
- Keep `/home/claude/plugins/shipflow-core/` as the internal audit and quality pilot.
- Use `shipflow` as the public entrypoint and pack router.
- Maintain a pack catalog that groups current numbered skills into coherent modules.
- Maintain a reference strategy that keeps critical execution references local and hosted docs optional.
- Provide an optional bootstrap helper for cloning/updating the full public ShipFlow repo.
- Audit pack portability before copying broad private skills into a public plugin.
- Generate or port `shipflow-main` first, because it is the smallest useful public route.
- Preserve the operator-last-resort rule: if ShipFlow can safely inspect, validate, or test, it should do so before asking the operator.

## Scope Out

- Publishing to OpenAI curated marketplace.
- Asking users to install many technical plugins manually.
- Copying the full private skill tree into the public plugin before portability issues are resolved.
- Shipping private transcripts, customer context, secrets, local caches, or machine-specific paths.
- Treating `$HOME/shipflow` as available for public plugin users.
- Requiring hosted docs or network access to execute core ShipFlow workflows.
- Silently cloning or updating the full repo without explicit user approval.

## Pack Strategy

- `shipflow`: one public plugin and user-facing entrypoint.
- `shipflow-main`: first useful public pack, targeted next.
- `shipflow-proof`: deploy, browser, auth, prod, and QA proof pack.
- `shipflow-build`: implementation lifecycle pack.
- `shipflow-content`, `shipflow-design`, `shipflow-quality`, `shipflow-product`: later domain packs.
- `shipflow-governance`: internal-first pack; public surface requires separate review.

## Bootstrap Strategy

- The plugin stays small and installable.
- The website explains and markets ShipFlow.
- A sparse GitHub checkout is the optional complete local skill/runtime corpus.
- The bootstrap script may clone/update the repo only after explicit operator approval.
- The default target is `${SHIPFLOW_ROOT:-$HOME/.shipflow/source}`.
- The checkout includes `skills/`, `templates/`, `tools/`, `shipflow_data/`, `docs/`, `local/`, and `bugs/`.
- The checkout excludes `site/`, `tui/`, `archive/`, `research/`, generated builds, and dependency directories.

## Reference Strategy

- Execution-critical contracts stay in the plugin: stop conditions, validation, proof obligations, reporting, routing, and operator-last-resort rules.
- Hosted docs carry long examples, tutorials, public explanations, changelogs, screenshots, pack docs, and paid-product upgrade paths.
- Hosted docs must be versioned and optional by default.
- A public pack is not portable until it works without `$SHIPFLOW_ROOT` and without network access.

## Current Implementation State

- [x] Main plugin scaffolded at `/home/claude/plugins/shipflow/`.
- [x] Personal marketplace entry added in `/home/claude/.agents/plugins/marketplace.json`.
- [x] Entry skill `shipflow` added to the plugin.
- [x] Pack catalog added in Markdown and JSON.
- [x] Hybrid local-reference plus hosted-docs strategy added to the plugin.
- [x] Optional full-repo bootstrap script added to the plugin.
- [x] Packaging audit script added.
- [x] Plugin installed locally as `shipflow@personal`.
- [x] Source and installed-cache plugin validation passed.
- [x] Packaging audit hard findings reduced to 0.
- [x] Technical docs coverage added for plugin packaging and sparse bootstrap.
- [x] README surfaces updated for public site, plugin alpha, sparse bootstrap, and canonical `shipflow_data/` layout.

## Remaining Work

- [ ] Add a pack generation script that can stage one pack from the catalog.
- [ ] Decide whether `shipflow-main` should be bundled or delegated to the bootstrapped repo.
- [ ] Test sparse bootstrap from a machine/path without an existing ShipFlow checkout.
- [ ] If a bundled `shipflow-main` remains useful, port only its smallest critical references.
- [ ] Replace placeholder docs base URL with the real public ShipFlow docs domain when available.
- [ ] Publish optional hosted docs for public explanations after the local pack works offline.
- [ ] Validate generated plugin cache after adding `shipflow-main`.
- [ ] Open a new Codex thread and test `$shipflow show available ShipFlow packs`.
- [ ] Decide whether optional packs are separate installable plugins or lazy-bundled modules inside one `shipflow` plugin.

## Acceptance Criteria

- [x] `shipflow@personal` installs and appears enabled in `codex plugin list`.
- [x] Source plugin validation passes.
- [x] Installed cache plugin validation passes.
- [x] Source/cache diff is clean after install.
- [x] Packaging audit has 0 hard findings.
- [x] Plugin records that hosted docs are optional and execution-critical references remain local.
- [x] Plugin provides an explicit full-repo bootstrap route instead of requiring a huge plugin.
- [x] Sparse bootstrap behavior is documented in technical docs.
- [ ] `shipflow-main` can be used in a new Codex thread without relying on `/home/claude/shipflow`.
- [ ] Public user journey remains one primary install.

## Validation Commands

```bash
python3 /home/claude/.codex/skills/.system/plugin-creator/scripts/validate_plugin.py /home/claude/plugins/shipflow
python3 /home/claude/.codex/skills/.system/plugin-creator/scripts/validate_plugin.py /home/claude/.codex/plugins/cache/personal/shipflow/0.1.0
python3 /home/claude/plugins/shipflow/scripts/audit_shipflow_packaging.py
codex plugin list
```

## Skill Run History

| Date UTC | Skill | Model | Action | Result | Next step |
|----------|-------|-------|--------|--------|-----------|
| 2026-06-11 09:29:34 UTC | 300-sf-docs | GPT-5 Codex | Updated README and docs surfaces for plugin packaging, public site, sparse bootstrap, and canonical governance layout. | Passed metadata lint and docs coherence checks. | /009-sf-skill-build shipflow-main plugin pack portability |

## Current Chantier Flow

100-sf-spec ✅ -> 101-sf-ready ✅ -> 300-sf-docs ✅ -> 009-sf-skill-build next
