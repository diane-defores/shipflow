# sf-check

> Run the checks your project already exposes, fix straightforward failures, and leave you with a clear confidence report.

## What It Does

`sf-check` is the practical “is this still healthy?” pass for a project. It detects the available guardrails in the current repo, runs them in a sensible order, and can fix clear issues when the failure is local and well understood.

For a solo founder, this is the fastest way to catch broken builds, type errors, lint regressions, missing tests, or dependency red flags before you ship more work on top of them.

## Who It's For

- Solo founders maintaining one or more codebases
- Operators who want a repeatable confidence pass before deploys
- Developers inheriting a repo with unknown discipline around checks

## When To Use It

- when you want a pre-ship or pre-commit quality pass
- when a branch feels “probably fine” but you need evidence
- when a change touched multiple files and you want quick validation
- when you need a quick dependency health snapshot before a deeper audit

## What You Give It

- the current project directory
- optionally `fix` to auto-fix straightforward issues
- optionally `nofix` to report only

## What You Get Back

- a summary of which checks were available and run
- fixes for local, obvious failures when safe to apply
- a short gap analysis when important checks are missing
- explicit warning when “green” does not prove runtime behavior

## Typical Examples

```bash
/sf-check
/sf-check fix
/sf-check nofix
```

## Limits

`sf-check` does not prove the product actually works end to end. It only validates the checks it can run from the repo. It also does not install missing dependencies, invent missing test coverage, or weaken guardrails just to get a green result.

## Related Skills

- `sf-deps` for a full dependency audit
- `sf-verify` when the change is high-stakes
- `sf-prod` after deployment
