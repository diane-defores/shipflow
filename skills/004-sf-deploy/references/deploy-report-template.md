---
artifact: technical_guidelines
metadata_schema_version: "1.0"
artifact_version: "1.0.0"
project: ShipFlow
created: "2026-06-29"
updated: "2026-06-29"
status: draft
source_skill: 004-sf-deploy
scope: 004-sf-deploy-report-template
owner: unknown
confidence: high
risk_level: medium
security_impact: yes
docs_impact: yes
linked_systems:
  - skills/004-sf-deploy/SKILL.md
  - skills/references/reporting-contract.md
  - skills/references/chantier-tracking.md
depends_on:
  - artifact: "skills/references/reporting-contract.md"
    artifact_version: "1.4.0"
    required_status: active
  - artifact: "skills/references/chantier-tracking.md"
    artifact_version: "0.5.0"
    required_status: draft
supersedes: []
evidence:
  - "Extracted from skills/004-sf-deploy/SKILL.md to keep long report templates outside the activation body."
next_review: "2026-07-13"
next_step: "/103-sf-verify 004-sf-deploy report template"
---

# Deploy Report Template

## Purpose

Provide the detailed `004-sf-deploy` report shape for `report=agent`, blocked runs, or explicit handoff. Default user reports should stay concise and follow `$SHIPFLOW_ROOT/skills/references/reporting-contract.md`.

## Template

```text
## Deploy: [project or scope]

Result: [deployed / partial / blocked / rerouted]
Environment: [local / preview / production / unknown]
Development mode: [local / vercel-preview-push / hybrid / unknown]

Phases:
- Scope and risk gate -> [status]
- 105-sf-check -> [pass/fail/skipped/not needed]
- 005-sf-ship -> [shipped/blocked/not run]
- 405-sf-prod -> [ready/failed/pending/partial/not run]
- Evidence routing -> [108-sf-browser/109-sf-auth-debug/107-sf-test/not needed/missing]
- 103-sf-verify -> [verified/partial/failed/not run]
- 304-sf-changelog -> [updated/skipped/not run]

Evidence:
- Commit: [sha or none]
- Deployment URL: [url or none]
- Browser/manual proof: [summary or missing]
- Logs: [summary or not collected]
- Sentry: [issue/event summary | no direct dashboard access; PM2/Doppler checked | no pointer supplied | not applicable]

Risks or gaps:
- [item or none]

Next step:
- [command or none]

## Chantier

Skill courante: 004-sf-deploy
Chantier: [spec path | non applicable | non trace]
Trace spec: [ecrite | non ecrite | non applicable]
Flux:
- 100-sf-spec: [status]
- 101-sf-ready: [status]
- 102-sf-start: [status]
- 103-sf-verify: [status]
- 104-sf-end: [status]
- 005-sf-ship: [status]

Reste a faire:
- [item or None]

Prochaine etape:
- [command or none]

Verdict 004-sf-deploy:
- [deployed | partial | blocked | rerouted]
```

## User Report Compression

For `report=user`, compress the same content to:

- outcome
- environment and URL
- evidence collected
- gaps or risks
- next step
- compact chantier block

Do not include the full phase matrix unless the run is blocked, partial, or the user asks for handoff detail.
