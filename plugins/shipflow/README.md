# ShipFlow Plugin

ShipFlow is the main local Codex plugin for packaging ShipFlow as a user-facing workflow layer.

This alpha intentionally ships a small nucleus:

- `skills/shipflow`: public entrypoint and pack router
- `skills/shipflow/references/public-help-catalog.md`: public help content used by the `shipflow` entrypoint
- `skills/shipflow/references/pack-catalog.md`: planned pack model
- `skills/shipflow/references/reference-strategy.md`: local-vs-hosted reference policy
- `skills/shipflow/references/shipflow-main-portability-matrix.md`: current `shipflow-main` bundle-readiness decision matrix
- `skills/shipflow/references/shipflow-main-intents.md`: public partial-mode intent contracts for `spec`, `ready`, `start`, `verify`, `check`, and `fix`
- `assets/docs-links.json`: optional hosted-docs link map
- `scripts/audit_shipflow_packaging.py`: local audit for deciding which private ShipFlow skills can be packaged next
- `scripts/bootstrap_shipflow_repo.sh`: optional clone/update helper for the full ShipFlow source tree
- `scripts/refresh_shipflow_pack.py`: one-command pack staging and validation helper

It does not copy the full ShipFlow skill tree into the plugin. Users who need the complete corpus can bootstrap the public repository locally instead of installing many plugin packs.

Execution-critical references stay local to the plugin. Hosted docs are optional support material for public explanation, tutorials, SEO, and paid-product upgrade paths.

## Local Development

Validate the plugin:

```bash
python3 ~/.codex/skills/.system/plugin-creator/scripts/validate_plugin.py ~/plugins/shipflow
```

Audit local ShipFlow packaging readiness:

```bash
python3 ~/plugins/shipflow/scripts/audit_shipflow_packaging.py
python3 ~/plugins/shipflow/scripts/audit_shipflow_packaging.py --pack shipflow-main --matrix
```

Stage one optional pack from the catalog:

```bash
python3 ~/plugins/shipflow/scripts/refresh_shipflow_pack.py shipflow-main
```

The staged pack is written to `~/.shipflow/staged-packs/<pack-id>/` by default and includes a `shipflow-pack-report.json` audit report. Shared references are copied outside `skills/` so the staged plugin remains structurally valid. Treat review findings as portability work before publishing.

Clone or update the sparse ShipFlow source tree:

```bash
~/plugins/shipflow/scripts/bootstrap_shipflow_repo.sh
```

The default target is `~/.shipflow/source`. The checkout includes the skill/runtime corpus and excludes the site, TUI app, archives, research folders, generated builds, and dependency directories.

Install from a repo-backed marketplace source:

```bash
codex plugin marketplace add dianedef/ShipFlow --ref main --sparse .agents/plugins --sparse plugins/shipflow
```

Then restart Codex, open the plugin directory, choose the `ShipFlow` marketplace, and install the `shipflow` plugin.

Start with:

```text
$shipflow help me choose the right workflow
```

For local development only, the personal marketplace path is still valid when the plugin lives outside the repo.
