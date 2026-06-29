# ShipFlow Pack Catalog

This catalog keeps the public experience simple: install one `shipflow` plugin, then let ShipFlow route to bundled or optional capabilities.

## Current Alpha

Bundled now:

- `shipflow`: public entrypoint, help, pack catalog, and packaging audit route
- `audit_shipflow_packaging.py`: local development audit for deciding which private skills are ready to package
- `reference-strategy.md`: local-vs-hosted documentation policy
- `docs-links.json`: optional hosted-docs link map for public documentation

Not bundled yet:

- the full private ShipFlow skill tree
- optional pack plugins
- hosted public documentation pages

Bundled staging helper:

- `scripts/stage_shipflow_pack.py`: stages one catalog pack into a local plugin candidate and writes a packaging report
- `scripts/refresh_shipflow_pack.py`: refreshes one staged pack and validates the generated plugin candidate

## Pack Model

### `shipflow-main`

Purpose: first useful public experience.

Portability decision: not public-bundlable yet. See `references/shipflow-main-portability-matrix.md`.

Candidate skills:

- `000-shipflow`
- `302-sf-help`
- `100-sf-spec`
- `101-sf-ready`
- `102-sf-start`
- `103-sf-verify`
- `105-sf-check`
- `106-sf-fix`

Packaging status: partial. Public help and intent routing are bundled through `shipflow`; full execution parity still needs source-root dependency removal or complete-corpus setup.

### `shipflow-build`

Purpose: implementation lifecycle from request to shippable change.

Candidate skills:

- `001-sf-build`
- `002-sf-maintain`
- `003-sf-bug`
- `005-sf-ship`
- `104-sf-end`
- `309-sf-tasks`
- `304-sf-changelog`

Packaging status: planned. High value, but likely needs reference-path cleanup.

### `shipflow-proof`

Purpose: browser, production, deploy, auth, and manual QA proof.

Candidate skills:

- `004-sf-deploy`
- `107-sf-test`
- `108-sf-browser`
- `109-sf-auth-debug`
- `405-sf-prod`

Packaging status: planned. Must be strict about operator-last-resort proof behavior.

### `shipflow-content`

Purpose: content, research, SEO, copy, GTM, and editorial workflows.

Candidate skills:

- `007-sf-content`
- `200-sf-redact`
- `201-sf-enrich`
- `202-sf-repurpose`
- `203-sf-research`
- `204-sf-market-study`
- `205-sf-veille`
- `206-sf-audit-copy`
- `207-sf-audit-copywriting`
- `406-sf-seo`
- `408-sf-audit-gtm`

Packaging status: planned. Needs public/private data boundary review.

### `shipflow-design`

Purpose: UI, UX, design systems, tokens, accessibility, and component audits.

Candidate skills:

- `006-sf-design`
- `409-sf-audit-a11y`
- `500-sf-design-from-scratch`
- `501-sf-design-playground`
- `502-sf-audit-design`
- `503-sf-audit-design-tokens`
- `504-sf-audit-components`

Packaging status: planned. Good public candidate after trimming long component detail.

### `shipflow-quality`

Purpose: audits, dependencies, performance, migrations, translation, and technical posture.

Candidate skills:

- `400-sf-audit`
- `401-sf-audit-code`
- `402-sf-deps`
- `403-sf-perf`
- `404-sf-migrate`
- `407-sf-audit-translate`

Packaging status: planned. Needs careful command and network permission wording.

### `shipflow-governance`

Purpose: ShipFlow's own docs, skills, conversations, transcripts, status, and model routing.

Candidate skills:

- `009-sf-skill-build`
- `300-sf-docs`
- `301-sf-context`
- `303-sf-resume`
- `305-sf-init`
- `306-sf-scaffold`
- `307-sf-skills-refresh`
- `308-sf-status`
- `704-sf-model`
- `705-sf-conversation-audit`
- `706-continue`
- `707-name`
- `800-tmux-capture-conversation`
- `801-clean-conversation-transcript`

Packaging status: internal-first. Some parts may stay private because they govern ShipFlow itself.

### `shipflow-product`

Purpose: onboarding, sync, entitlements, platform parity, exploration, backlog, priorities, and review.

Candidate skills:

- `008-sf-onboarding`
- `600-sf-local-cloud-sync`
- `601-sf-product-entitlements`
- `602-sf-platform-parity`
- `700-sf-explore`
- `701-sf-backlog`
- `702-sf-priorities`
- `703-sf-review`

Packaging status: planned. Needs strong product-safety and paid-access boundary review.

## Installation Principle

The default user path is one install:

```text
Install ShipFlow
```

ShipFlow may later install or activate optional packs, but only after it can say exactly:

- why the pack is needed
- what will be installed
- whether a new Codex session is required
- what remains unavailable

Do not make the user choose among many technical plugins before they get value.

## Pack Generation

Stage one optional pack from the catalog:

```bash
python3 ~/plugins/shipflow/scripts/refresh_shipflow_pack.py shipflow-main
```

Default output:

```text
~/.shipflow/staged-packs/<pack-id>/
```

The generated directory is a local plugin candidate, not a public-ready promise. Review `shipflow-pack-report.json` before installing, sharing, or publishing it.
