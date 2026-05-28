# shipflow_data

Repository of ShipFlow’s cross-project operating context and tracking artifacts.

## What this directory contains
- `TASKS.md`: master execution tracker.
- `PROJECTS.md`: project registry and domain applicability matrix.
- `AUDIT_LOG.md`: global audit history and scores.
- `CLAUDE.md`: agent operating guide for this workspace.
- `BUSINESS.md`: mission, value, and operating model for the workspace layer.
- `BRANDING.md`: tone and style conventions for workspace documentation.
- `GUIDELINES.md`: documentation, environment, and workflow rules.
- `README.md`: this onboarding file.
- `projects/*/TASKS.md`: project local backlogs and audits.
- `autre/*`: working references and research notes.

## How to use this workspace
1. Start from `CLAUDE.md` for current agent conventions.
2. Check `PROJECTS.md` to confirm scope and stack details.
3. Use `TASKS.md` for immediate execution priorities.
4. Use `AUDIT_LOG.md` for historical issues and trend review.

## Environment setup
Copy `/.env.example` to `.env` and fill only required values.

- Required core runtime keys are listed in `GUIDELINES.md` and `CLAUDE.md`.
- Optional project keys are included in `.env.example` as separate templates per stack/project.

## Maintenance convention
- Update `README.md`, `GUIDELINES.md`, and `CLAUDE.md` whenever file ownership or process changes.
- Keep secrets out of tracked markdown.
