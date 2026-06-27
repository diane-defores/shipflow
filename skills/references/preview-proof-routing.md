---
artifact: technical_guidelines
metadata_schema_version: "1.0"
artifact_version: "1.0.0"
project: ShipFlow
created: "2026-06-27"
updated: "2026-06-27"
status: active
source_skill: 900-shipflow-core
scope: preview-proof-routing
owner: Diane
confidence: high
risk_level: medium
security_impact: yes
docs_impact: yes
linked_systems:
  - skills/references/project-development-mode.md
  - skills/003-sf-bug/SKILL.md
  - skills/004-sf-deploy/SKILL.md
  - skills/005-sf-ship/SKILL.md
  - skills/102-sf-start/SKILL.md
  - skills/103-sf-verify/SKILL.md
  - skills/104-sf-end/SKILL.md
  - skills/105-sf-check/SKILL.md
  - skills/107-sf-test/SKILL.md
depends_on:
  - artifact: "skills/references/project-development-mode.md"
    artifact_version: "1.1.0"
    required_status: "active"
supersedes: []
evidence:
  - "2026-06-27 transverse hardening audit: the same preview-proof route was repeated across execution, verification, test, closure, and ship skills."
  - "Operator decision 2026-06-27: repeated doctrines must move to shared references instead of being recopied into every skill."
next_review: "2026-07-04"
next_step: "/103-sf-verify preview-proof-routing adoption"
---

# Preview Proof Routing

Apply this doctrine when project development mode is `vercel-preview-push` or when a `hybrid` project needs hosted proof.

## Route

When the changed behavior needs preview, browser, auth, webhook, deployed-runtime, or manual user-flow evidence, the required route is:

`005-sf-ship` -> `405-sf-prod` -> downstream proof owner

Downstream proof owner examples:

- `108-sf-browser` for non-auth browser-visible proof
- `109-sf-auth-debug` for auth/session/callback/protected-route proof
- `107-sf-test --preview` for manual or multi-step preview QA

## Rules

- Do not claim browser, preview, auth, integration, or manual user-flow validation from local evidence alone when project mode requires deployed proof.
- Do not ask the operator to run preview/manual/browser proof before `005-sf-ship` has pushed and `405-sf-prod` has confirmed the matching deployment target.
- After successful ship in preview-required mode, `405-sf-prod` is the immediate next step.
- If preview validation is still missing, keep closure, verification, and changelog framing below `done`/`verified`/`released` strength as the local skill contract requires.

## Local Anchor Rule

Keep a compact local anchor in skills where preview-proof routing is a first-screen execution risk, but keep the detailed doctrine here rather than repeating the route text verbatim across skills.
