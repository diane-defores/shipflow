# 104-sf-end

> Close a work session cleanly: summarize what changed, update task tracking, and keep the changelog honest.

## What It Does

`104-sf-end` is the session wrap-up skill. It reviews what was actually done, updates `TASKS.md`, adds a user-facing changelog entry, and reports what is complete versus what is still uncertain.

This is useful because “work happened” and “the product is truly done” are not the same thing. A solo founder needs a clean record of progress without accidentally overstating validation or shipping confidence.

On projects that use Vercel preview-push validation, `104-sf-end` keeps closure partial when the required `005-sf-ship` -> `405-sf-prod` preview evidence is still missing.

## Who It's For

- Solo founders working across many small sessions
- Developers who want clean task tracking without committing yet
- Teams that need better closure discipline before shipping

## When To Use It

- when a task is finished or partially finished
- when you want to update tracking before switching context
- when you need a concise session summary for later
- when you are not ready to commit or push yet

## What You Give It

- the current project directory
- optionally a short summary or note about the session

## What You Get Back

- a concise work summary
- updated task tracking with done or in-progress status
- a changelog entry focused on real user-facing change
- explicit remaining risks or validation gaps
- partial closure when preview deployment validation is still pending

## Typical Examples

```bash
/104-sf-end
/104-sf-end fixed onboarding edge cases
```

## Limits

`104-sf-end` does not commit, push, or certify production readiness. It is a bookkeeping and closure tool, not a release sign-off.

## Related Skills

- `005-sf-ship` when you are ready to commit and push
- `405-sf-prod` immediately after `005-sf-ship` when preview deployment is the validation surface
- `703-sf-review` for broader session or period reviews
- `103-sf-verify` when closure is blocked by proof gaps
