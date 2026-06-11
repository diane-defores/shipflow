---
artifact: technical_module_context
metadata_schema_version: "1.0"
artifact_version: "1.0.0"
project: ShipFlow
created: "2026-06-11"
updated: "2026-06-11"
status: reviewed
source_skill: 300-sf-docs
scope: codex-plugin-packaging
owner: Diane
confidence: high
risk_level: high
security_impact: yes
docs_impact: yes
linked_systems:
  - /home/claude/plugins/shipflow/
  - /home/claude/plugins/shipflow/scripts/bootstrap_shipflow_repo.sh
  - /home/claude/plugins/shipflow/skills/shipflow/SKILL.md
  - /home/claude/plugins/shipflow/assets/docs-links.json
  - /home/claude/.agents/plugins/marketplace.json
  - shipflow_data/workflow/specs/shipflow-main-plugin-and-pack-portability.md
depends_on:
  - artifact: "shipflow_data/workflow/specs/shipflow-main-plugin-and-pack-portability.md"
    artifact_version: "1.0.0"
    required_status: ready
supersedes: []
evidence:
  - "2026-06-11 shipflow plugin installed as shipflow@personal."
  - "2026-06-11 sparse bootstrap script tested with /tmp/shipflow-sparse-bootstrap-test."
  - "2026-06-11 source/cache plugin validation and diff passed."
next_review: "2026-06-18"
next_step: "/300-sf-docs technical audit codex-plugin-packaging"
---

# Codex Plugin Packaging

## Purpose

`/home/claude/plugins/shipflow/` is the lightweight Codex plugin distribution nucleus for ShipFlow. It gives users one primary plugin entrypoint while keeping the complete ShipFlow skill and reference corpus in the GitHub repository instead of packaging the whole repository into the plugin.

The plugin must stay useful without a huge bundle. When a workflow needs the full local ShipFlow corpus, the plugin exposes an explicit sparse checkout route into `${SHIPFLOW_ROOT:-$HOME/.shipflow/source}`.

## Owned Files

- `/home/claude/plugins/shipflow/.codex-plugin/plugin.json` declares the plugin identity, public homepage, repository, and version.
- `/home/claude/plugins/shipflow/skills/shipflow/SKILL.md` routes public plugin workflows, optional packs, docs links, and bootstrap guidance.
- `/home/claude/plugins/shipflow/skills/shipflow/references/pack-catalog.md` describes planned packs and their current readiness.
- `/home/claude/plugins/shipflow/skills/shipflow/references/reference-strategy.md` defines local versus hosted reference rules.
- `/home/claude/plugins/shipflow/assets/docs-links.json` records the public docs base URL.
- `/home/claude/plugins/shipflow/scripts/bootstrap_shipflow_repo.sh` creates or updates the sparse ShipFlow source checkout.
- `/home/claude/plugins/shipflow/scripts/audit_shipflow_packaging.py` checks package readiness and hard reference issues.
- `/home/claude/.agents/plugins/marketplace.json` registers the personal plugin during local development.

## Entrypoints

- Codex loads the plugin through `shipflow@personal` or a future public plugin install.
- Users invoke the plugin through the contributed `shipflow` skill.
- The optional full-corpus path is `/home/claude/plugins/shipflow/scripts/bootstrap_shipflow_repo.sh`.
- Hosted docs are optional support material at `https://shipflowzsite.vercel.app/docs`.

## Control Flow

1. The plugin installs as a small local bundle with the `shipflow` routing skill.
2. The routing skill answers basic pack, docs, and readiness questions from bundled files.
3. If the user needs the complete skill/reference corpus, the routing skill points to the bootstrap script.
4. The bootstrap script clones or updates `https://github.com/dianedef/ShipFlow.git` with Git sparse checkout enabled.
5. The checkout target defaults to `${SHIPFLOW_ROOT:-$HOME/.shipflow/source}`.
6. The sparse checkout includes `skills/`, `templates/`, `tools/`, `shipflow_data/`, `docs/`, `local/`, and `bugs/`.
7. The sparse checkout excludes `site/`, `tui/`, `archive/`, `research/`, generated builds, and dependency directories.

## Invariants

- Public users must not need to install many separate plugins to begin using ShipFlow.
- The plugin must not assume `/home/claude/shipflow` exists.
- The plugin must not silently clone or update a repository. Network and filesystem changes require explicit user approval in Codex.
- Execution-critical contracts stay local to the plugin or the sparse checkout. Hosted docs are optional, not the runtime source of truth.
- The GitHub repository remains the source of truth for the full ShipFlow corpus.
- Public plugin packaging must not rely on symlinks into a developer checkout.
- Private transcripts, secrets, local caches, dependency directories, and generated builds must not be packaged.

## Failure Modes

- If `SHIPFLOW_ROOT` points to an existing non-Git directory, the bootstrap script must refuse to overwrite it.
- If the public repo is unavailable, plugin-local workflows must still explain available packs and next steps.
- If the sparse checkout is missing required paths, treat the plugin as not portable until the bootstrap script or pack contents are fixed.
- If hosted docs drift from local references, local plugin and repository references win for execution behavior.
- If a pack assumes local absolute paths, mark it as review-only until the path dependency is removed.

## Security Notes

The bootstrap script writes into a hidden user-scoped default path and uses Git network access. Codex should ask before running it because it changes local state and downloads source. Do not add commands that clone private repositories, read secrets, or package private project data into the plugin.

The plugin should link to public docs for onboarding and explanation, but should not scrape hosted pages as an authority for execution-critical behavior.

## Validation

Run these checks when plugin packaging, bootstrap behavior, docs links, or marketplace metadata changes:

```bash
bash -n /home/claude/plugins/shipflow/scripts/bootstrap_shipflow_repo.sh
/home/claude/plugins/shipflow/scripts/bootstrap_shipflow_repo.sh --help
python3 /home/claude/.codex/skills/.system/plugin-creator/scripts/validate_plugin.py /home/claude/plugins/shipflow
codex plugin list
```

For a real sparse checkout smoke test, use a temporary target and verify excluded directories stay absent:

```bash
SHIPFLOW_ROOT=/tmp/shipflow-sparse-bootstrap-test /home/claude/plugins/shipflow/scripts/bootstrap_shipflow_repo.sh
git -C /tmp/shipflow-sparse-bootstrap-test sparse-checkout list
```

Expected sparse paths are `skills`, `templates`, `tools`, `shipflow_data`, `docs`, `local`, and `bugs`. `site` and `tui` should not be present in the checkout root.

## Reader Checklist

- Did the change alter plugin install metadata, skill routing, docs links, pack catalog, reference strategy, or bootstrap behavior?
- Does the plugin still work without `/home/claude/shipflow`?
- Does the plugin still avoid packaging site assets, generated outputs, dependency folders, and private context?
- Are hosted docs still optional for execution?
- Does the bootstrap script still clone only the sparse source corpus needed by skills?

## Maintenance Rule

Update this doc whenever the `shipflow` plugin manifest, routing skill, reference strategy, docs URL, sparse bootstrap script, pack catalog, or personal marketplace install path changes. Keep implementation details here; keep public onboarding copy on the website.
