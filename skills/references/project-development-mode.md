---
artifact: technical_guidelines
metadata_schema_version: "1.0"
artifact_version: "1.0.0"
project: ShipFlow
created: "2026-05-01"
updated: "2026-05-01"
status: active
source_skill: manual-doctrine-update
scope: project-development-mode
owner: unknown
confidence: high
risk_level: medium
security_impact: none
docs_impact: yes
linked_systems:
  - skills/sf-init
  - skills/sf-start
  - skills/sf-fix
  - skills/sf-auth-debug
  - skills/sf-verify
  - skills/sf-end
  - skills/sf-check
  - skills/sf-ship
  - skills/sf-prod
  - skills/sf-test
  - skills/sf-help
depends_on: []
supersedes: []
evidence:
  - "Some projects validate changes locally while others require Vercel preview deployments before meaningful tests."
next_review: "2026-06-01"
next_step: "/sf-verify project development mode doctrine"
---

# Project Development Mode

Every project should document how ShipFlow agents are expected to validate changes. The project-local source of truth is the `## ShipFlow Development Mode` section in `CLAUDE.md`. If a project has no `CLAUDE.md`, use `SHIPFLOW.md` with the same section.

## Canonical Section

```markdown
## ShipFlow Development Mode

- development_mode: local | vercel-preview-push | hybrid
- validation_surface: local | vercel-preview | production | mixed
- ship_before_preview_test: yes | no | conditional
- post_ship_verification: sf-prod | other | none
- deployment_provider: vercel | netlify | cloudflare | other | none
- preview_source: Vercel MCP deployment target_url | static URL | not applicable
- production_url: [URL or unknown]
- notes: [short project-specific rule]
- last_reviewed: YYYY-MM-DD
```

## Modes

- `local`: run local dev servers, local browser checks, unit tests, and focused tooling before shipping. `sf-ship` is not required before manual QA unless the user explicitly wants remote validation.
- `vercel-preview-push`: local static checks are allowed, but browser, integration, auth, webhook, deployed-runtime, or manual user-flow tests are not authoritative until the change has been pushed and the matching Vercel deployment is ready. The required sequence is `sf-ship` -> `sf-prod` -> test the returned deployment URL.
- `hybrid`: use local validation for purely local UI, unit, and static checks. Use the `vercel-preview-push` sequence for anything that depends on hosted environment variables, OAuth/callback URLs, edge/serverless behavior, webhooks, production-like data, Vercel routing, or deployment configuration.

## Agent Rules

- `sf-start` and `sf-fix` must read the project development mode before deciding how to validate a code change.
- If the mode is `vercel-preview-push`, the agent may run quick local checks before shipping, but must not ask the user to manually test or claim browser/user-flow validation until `sf-ship` has pushed and `sf-prod` has confirmed the matching deployment.
- After a successful `sf-ship` in `vercel-preview-push` or preview-required `hybrid` mode, the immediate next action is `sf-prod`.
- `sf-prod` must wait for the matching deployment with Vercel MCP when Vercel is the provider. GitHub commit statuses are fallback evidence, not the primary source when MCP is available.
- `sf-test --preview` should use the deployment URL confirmed by `sf-prod`. If code changes are still dirty or unpushed, route to `sf-ship` first.
- If the development mode section is missing and Vercel signals exist (`.vercel/project.json`, `vercel.json`, Vercel dependencies, or Vercel remote status), classify the mode as `unknown-vercel`, report the gap, and ask or document the mode before running preview-dependent tests.
- If no hosting signals exist, default to `local` with `confidence: medium` and recommend adding the section during the next `sf-init` or project setup pass.

## Minimal Inference

Use this only when the project has no explicit section:

| Signal | Temporary mode | Required next step |
|--------|----------------|--------------------|
| `.vercel/project.json` or `vercel.json` | `unknown-vercel` | Ask whether validation is local, preview-push, or hybrid before manual/browser testing |
| User says "test on preview", "push to Vercel", or "Vercel preview is the dev env" | `vercel-preview-push` | Write or update the project section |
| No hosting provider and runnable local scripts | `local` | Recommend documenting the section |
| Auth/OAuth/webhook bug only appears on hosted URL | `hybrid` or `vercel-preview-push` | Use `sf-ship` -> `sf-prod` before retest |
