# sf-end

> Close a work session cleanly: summarize what changed, update task tracking, and keep the changelog honest.

## What It Does

`sf-end` is the session wrap-up skill. It reviews what was actually done, updates `TASKS.md`, adds a user-facing changelog entry, and reports what is complete versus what is still uncertain.

This is useful because “work happened” and “the product is truly done” are not the same thing. A solo founder needs a clean record of progress without accidentally overstating validation or shipping confidence.

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

## Typical Examples

```bash
/sf-end
/sf-end fixed onboarding edge cases
```

## Limits

`sf-end` does not commit, push, or certify production readiness. It is a bookkeeping and closure tool, not a release sign-off.

## Related Skills

- `sf-ship` when you are ready to commit and push
- `sf-review` for broader session or period reviews
- `sf-verify` when closure is blocked by proof gaps
