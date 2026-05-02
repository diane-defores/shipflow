---
artifact: technical_guidelines
metadata_schema_version: "1.0"
artifact_version: "1.0.0"
project: ShipFlow
created: "2026-05-02"
updated: "2026-05-02"
status: active
source_skill: sf-start
scope: browser-evidence
owner: Diane
confidence: high
risk_level: high
security_impact: yes
docs_impact: yes
linked_systems:
  - skills/sf-browser/SKILL.md
  - skills/references/playwright-mcp-runtime.md
  - skills/sf-auth-debug/SKILL.md
  - skills/sf-test/SKILL.md
  - skills/sf-prod/SKILL.md
depends_on:
  - artifact: "skills/references/playwright-mcp-runtime.md"
    artifact_version: "1.1.0"
    required_status: active
  - artifact: "GUIDELINES.md"
    artifact_version: "1.3.0"
    required_status: reviewed
supersedes: []
evidence:
  - "Spec specs/sf-browser-general-browser-verification-skill.md requires a compact evidence reference for sf-browser."
next_review: "2026-06-02"
next_step: "/sf-verify sf-browser General Browser Verification Skill"
---

# Browser Evidence

## Purpose

This reference keeps `sf-browser` concise while defining how browser evidence should be collected, summarized, redacted, and reported.

## Evidence Families

| Evidence | Use when | Report as |
| --- | --- | --- |
| Accessibility snapshot | The question is visible text, structure, controls, nav, forms, headings, or state | Short visible-state summary and key labels |
| Screenshot | Layout, visual state, blank page, overlap, modal, canvas, or image rendering matters | Screenshot path or brief visual summary |
| Console messages | The visible state passes but runtime errors may explain risk | Count plus targeted severe errors only |
| Network requests | A route, asset, API call, status code, redirect, or blocked request matters | Sanitized method/path/status summary |
| URL and redirect chain | The objective depends on navigation, final route, or environment | Start URL, final URL, notable redirect |
| Timing/blocker | Page load, timeout, spinner, interstitial, cookie banner, or provider page blocks proof | Blocker and missing proof |

Prefer the least sensitive evidence that proves the objective.

## Verdict Labels

- `pass`: requested objective was observed and no material blocker was found.
- `fail`: requested objective was not observed and the browser evidence points to application behavior.
- `partial`: visible objective passed but console, network, environment, or evidence mismatch creates material risk.
- `blocked`: browser evidence is invalid or incomplete because of runtime, target, timeout, environment, or tooling.
- `needs-auth`: the page or objective requires auth-specific diagnosis.
- `needs-deploy`: deployment or preview readiness must be confirmed first.
- `needs-manual-test`: the request is a full user-flow or requires human confirmation.
- `unsafe-action`: the requested interaction could mutate data or trigger external side effects without explicit approval.

Do not use `pass` for a whole feature unless the objective itself was that narrow.

## Redaction Rules

Never report or store:
- cookies
- tokens
- credentials
- localStorage or sessionStorage contents
- complete request or response headers
- raw HAR data
- private payloads
- full account identifiers
- private emails
- production PII
- screenshots exposing sensitive data unless the user explicitly requested and approved that evidence

Allowed summaries:
- sanitized endpoint path without query secrets
- status code
- high-level error label
- visible text that is not private
- count of console errors
- short non-secret error message

If in doubt, say the evidence was redacted and report only the non-sensitive fact needed for the verdict.

## Console And Network Limits

Console summaries should include:
- number of severe errors
- the first relevant error family
- source file only when it is not sensitive and helps route the fix

Network summaries should include:
- method
- sanitized path or host
- status code
- blocked, failed, timeout, or redirect state

Do not paste full payloads, auth headers, cookies, request bodies, or response bodies.

## Screenshot And Snapshot Rules

Use accessibility snapshots first when they prove the assertion. They are easier to inspect and easier to redact.

Use screenshots when:
- visual layout is the objective
- snapshot and screenshot disagree
- the page is blank, clipped, hidden behind a modal, or visually broken
- the user explicitly requests visual proof

If snapshot is empty but screenshot shows content, or screenshot is blank but snapshot has DOM, report `partial` or `blocked` and name the evidence mismatch.

## Production Interaction Safety

Production browser work is read-only by default.

Reversible interactions are acceptable:
- open menu
- switch tab
- expand accordion
- dismiss local-only overlay when safe
- navigate to a public link

Explicit approval is required before:
- submitting forms
- creating or editing records
- deleting
- publishing
- purchasing
- sending email
- inviting users
- changing account or billing state
- triggering webhooks or external integrations

If approval is missing, use `unsafe-action` and route to a safe environment, manual test, or explicit approval prompt.

## Localized Reports

The final report uses the user's active language. Stable labels, commands, and verdict labels stay English.

Good localized behavior:
- keep `Target`, `Environment`, `Verdict`, and ShipFlow command names stable
- write observations, limits, and next-step explanations in the user's active language
- use natural French with accents when the active language is French

Do not translate command names, stable anchors, file paths, or verdict labels.

## Handoff Interpretation

Route by blocker:

| Blocker or finding | Next step |
| --- | --- |
| Auth wall or auth objective | `/sf-auth-debug [target or bug]` |
| Missing preview or deploy status | `/sf-prod [project or URL]` |
| Preview-push project with unshipped changes | `/sf-ship [scope]`, then `/sf-prod [project or URL]` |
| Full manual user flow | `/sf-test [scope]` |
| Narrow actionable bug | `/sf-fix [summary]` |
| Non-trivial cross-system follow-up | `/sf-spec [title and compact context]` |
| Verification evidence gap | `/sf-verify [scope]` |
