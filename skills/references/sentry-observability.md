---
artifact: technical_guidelines
metadata_schema_version: "1.0"
artifact_version: "1.0.2"
project: ShipFlow
created: "2026-05-11"
updated: "2026-05-11"
status: active
source_skill: sf-skills-refresh
scope: sentry-observability
owner: unknown
confidence: high
risk_level: medium
security_impact: yes
docs_impact: yes
linked_systems:
  - skills/sf-prod/SKILL.md
  - skills/sf-deploy/SKILL.md
  - skills/sf-auth-debug/SKILL.md
  - skills/sf-browser/SKILL.md
  - skills/sf-test/SKILL.md
  - skills/sf-bug/SKILL.md
  - skills/sf-fix/SKILL.md
  - skills/sf-start/SKILL.md
  - skills/sf-verify/SKILL.md
  - skills/sf-audit-code/SKILL.md
  - skills/sf-perf/SKILL.md
depends_on: []
supersedes: []
evidence:
  - "User doctrine update 2026-05-11: ShipFlow projects now use Sentry everywhere."
  - "User operational note 2026-05-11: skills never see Sentry dashboard directly; local PM2 logs and Doppler env presence are available evidence sources."
  - "User clarification 2026-05-11: skills will never have direct Sentry dashboard access."
next_review: "2026-06-11"
next_step: "/sf-verify Sentry observability doctrine"
---

# Sentry Observability

Use this reference when a project bug, deploy, manual test, browser check, auth diagnosis, verification, audit, or performance review depends on runtime behavior.

## Default Assumption

ShipFlow projects are expected to have Sentry instrumentation unless the project explicitly documents an exception.

Skills never have direct Sentry dashboard access. Do not attempt to open or query the dashboard as part of the skill contract.

Use Sentry only through evidence that is visible in the app, logs, error boundaries, support screens, pasted by the operator, or otherwise already present in the working context. If no Sentry issue/event pointer is available, use local PM2 logs and redacted Doppler environment checks as supporting runtime evidence instead of pretending Sentry was checked.

## When To Load This

- The app throws, crashes, renders an error boundary, or returns a 5xx.
- A browser console or network check shows an unhandled exception.
- A deploy is green but runtime health, auth, protected flows, jobs, webhooks, or user actions fail.
- A manual test fails and the user sees a Sentry event ID, support ID, error boundary, or crash report.
- A bug file, fix attempt, release check, or verification needs runtime evidence.
- An audit reviews error handling, reliability, telemetry, or performance overhead.

## Evidence To Prefer

- Sentry issue URL or issue ID when supplied by the operator or visible in app/log output.
- Event ID shown by the app, copied from an error boundary, support screen, or logs.
- Release, commit SHA, environment, transaction, trace, replay, or suspect commit when available.
- First seen / last seen timestamps and affected users count when relevant and safe.
- Stack frame file/function/module after redacting private data.
- A concise event summary, not a raw payload dump.
- Local PM2 process/log evidence because direct Sentry dashboard access is not available to skills.
- Doppler secret presence/config status when environment variables may explain the failure, without printing secret values.

## Local PM2 And Doppler Fallback

Use this when Sentry is expected but no Sentry issue/event pointer is available, or when the runtime is a ShipFlow/PM2-managed server app.

Safe PM2 commands:

```bash
pm2 list
pm2 logs contentflow_lab --lines 80 --nostream
tail -f ~/.pm2/logs/contentflow-lab-out.log
tail -f ~/.pm2/logs/contentflow-lab-error.log
```

Adapt the PM2 app name and log file names to the project when they differ. Prefer bounded, non-streaming logs for reports; use `tail -f` only for active live diagnosis, then summarize the relevant lines.

Doppler rules:

- Check that required env keys are present, scoped to the expected project/config/environment, and loaded by the running process.
- Report key names, config scope, and presence/absence only.
- Never print Doppler secret values, raw `doppler secrets`, raw `env`, or command output that includes secret values.
- If a value shape matters, report a redacted shape such as `present`, `missing`, `empty`, `looks like URL`, or `wrong environment`, not the value.

## Correlation Rules

- When a Sentry pointer is supplied or visible, match it to the same environment being tested: `local`, `preview`, `production`, or project-specific equivalent.
- When a Sentry pointer is supplied or visible, match it to the deployed release or commit SHA when `sf-prod`, `sf-deploy`, `sf-ship`, or `sf-verify` depends on hosted evidence.
- Match PM2 logs and Doppler config to the same app name, cwd, branch, environment, and deployment surface being diagnosed.
- For preview-push projects, do not use old production issues as proof about the current preview unless the release/environment link is explicit.
- For auth, payment, data, webhook, job, or tenant failures, prefer server-side Sentry events over browser-only symptoms when both exist.
- Do not report "no matching Sentry event" unless an operator-provided or visible Sentry pointer/window was actually checked from available context. Otherwise report `Sentry: no direct dashboard access; PM2/Doppler checked`.

## Privacy And Redaction

- Never paste raw Sentry event payloads, breadcrumbs, request bodies, headers, cookies, tokens, auth codes, session data, private emails, PII, or private URLs into reports or bug files.
- Summarize sensitive fields and use placeholders such as `[REDACTED_TOKEN]`, `[REDACTED_EMAIL]`, or `[REDACTED_PRIVATE_URL]`.
- Do not expose full user lists, IP addresses, or session replay content in user reports. Use counts or redacted summaries.
- If a screenshot, replay, or breadcrumb contains sensitive data, reference it by Sentry issue/event ID only and state that redaction was applied.

## Skill Reporting Rules

- Include Sentry evidence under `Evidence`, `Logs`, `Observability`, or `Limits` depending on the skill report shape.
- If Sentry was expected but no issue/event pointer was available, say `Sentry: no direct dashboard access; no event pointer supplied`.
- If a supplied/visible pointer was checked and no match was possible, say `Sentry: pointer not correlated to [environment/release/window]`.
- If a supplied/visible pointer is relevant, say `Sentry: [issue/event id]`, environment, release/commit if known, and one-line impact.
- If PM2/Doppler evidence was used instead, say `Sentry: no direct dashboard access; PM2/Doppler checked` and name the bounded evidence.
- Do not let Sentry replace the owner skill proof: browser evidence still belongs to `sf-browser` / `sf-auth-debug`, deploy truth to `sf-prod`, manual QA to `sf-test`, and closure to `sf-verify`.

## Performance Notes

- Sentry browser tracing, profiling, session replay, source maps, and breadcrumbs can affect bundle size, network usage, privacy posture, and INP/LCP if configured carelessly.
- Audit sampling rates, replay masks, source map upload exposure, and disabled debug logging when performance or privacy is in scope.
- Sentry instrumentation should preserve user/operator visibility of failures; do not swallow exceptions only to report them.
