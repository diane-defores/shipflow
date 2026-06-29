---
artifact: technical_guidelines
metadata_schema_version: "1.0"
artifact_version: "1.0.0"
project: ShipFlow
created: "2026-06-29"
updated: "2026-06-29"
status: draft
source_skill: 004-sf-deploy
scope: 004-sf-deploy-release-proof-routing
owner: unknown
confidence: high
risk_level: high
security_impact: yes
docs_impact: yes
linked_systems:
  - skills/004-sf-deploy/SKILL.md
  - skills/108-sf-browser/SKILL.md
  - skills/109-sf-auth-debug/SKILL.md
  - skills/107-sf-test/SKILL.md
  - skills/405-sf-prod/SKILL.md
  - skills/references/preview-proof-routing.md
depends_on:
  - artifact: "skills/references/preview-proof-routing.md"
    artifact_version: "1.0.0"
    required_status: active
  - artifact: "skills/references/spec-driven-development-discipline.md"
    artifact_version: "1.5.0"
    required_status: active
supersedes: []
evidence:
  - "Extracted from skills/004-sf-deploy/SKILL.md to separate proof routing doctrine from activation."
next_review: "2026-07-13"
next_step: "/103-sf-verify 004-sf-deploy release proof routing"
---

# Release Proof Routing

## Purpose

Define how `004-sf-deploy` chooses post-deploy proof owners after deployment truth is known.

## Routing Rule

Choose proof based on release scope:

- Auth, OAuth, cookies, sessions, callbacks, tenants, protected routes -> `/109-sf-auth-debug [target]`
- Non-auth route, visual state, screenshot, console, network, or page assertion -> `/108-sf-browser [URL] [objective]`
- Full user flow, human confirmation, retest, or durable QA record -> `/107-sf-test --preview|--prod [scope]`
- No browser/manual proof needed -> state why and continue to `103-sf-verify`

Do not invent proof. If the evidence is not collected, report it as missing and keep the release verdict partial or blocked.

## Preview And Hosted Proof

When project development mode is `vercel-preview-push` or when a `hybrid` project needs hosted proof, apply `$SHIPFLOW_ROOT/skills/references/preview-proof-routing.md`.

Required route:

```text
005-sf-ship -> 405-sf-prod -> downstream proof owner
```

Do not ask the operator to run preview/manual/browser proof before `005-sf-ship` has pushed and `405-sf-prod` has confirmed the matching deployment target.

## Production Safety

Production proof is read-only by default.

Explicit approval is required before:

- submitting forms that create or change records
- deleting records
- publishing content
- sending emails or invites
- charging money or changing billing state
- triggering webhooks or external integrations
- mutating production data

If approval is missing, route to a safe environment, manual test, or explicit approval prompt instead of running the unsafe action.

## Evidence Requirements

Each proof route must return or report:

- target URL or environment
- objective or scenario
- verdict
- evidence summary
- redaction note when sensitive logs, screenshots, requests, or runtime data were omitted
- remaining proof gap, if any

If proof is missing, include:

- `proof_type`
- `owner_skill`
- `scenario`
- `target_or_environment`

Use `405-sf-prod` for target discovery when `target_or_environment` is unknown.

## Redaction

Never print secrets, cookies, tokens, credentials, private headers, private payloads, raw HAR data, raw Sentry payloads, screenshots with sensitive user data, private URLs, production PII, or complete runtime logs.

Allowed summaries:

- status code
- sanitized endpoint path
- high-level error label
- visible non-private text
- count of console or runtime errors
- redacted issue/event pointer
- screenshot path only when the image is safe to store/report
