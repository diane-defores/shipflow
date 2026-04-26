# sf-skills-refresh

> Update one or more ShipFlow skills with current best practices without rewriting their core structure.

## What It Does

`sf-skills-refresh` refreshes existing `SKILL.md` files against recent state of the art. It runs parallel research, identifies what is genuinely new, then applies targeted additive edits such as new checks, updated thresholds, or missing phases.

This keeps skills current in areas that drift quickly, like SEO, accessibility, performance, AI-era content quality, or security practices, while preserving the author’s original voice and structure.

## Who It's For

- Maintainers of a public or shared skill library
- Solo founders who rely on skills as reusable operating procedures
- Teams that want monthly refreshes instead of silent guidance drift

## When To Use It

- when a skill may be 6+ months behind current practice
- when web standards, tooling, or platform behavior changed
- when you want to refresh several domain skills in parallel

## What You Give It

- one skill name, or a selected batch of skills
- the existing `SKILL.md` files as the source to preserve

## What You Get Back

- targeted edits to the selected `SKILL.md` files
- a refresh log entry in `skills/REFRESH_LOG.md`
- a summary of checks added, checks updated, and any new phases introduced
- explicit “needs decision” notes when research findings are ambiguous

## Typical Examples

```bash
/sf-skills-refresh
/sf-skills-refresh sf-audit-seo
/sf-skills-refresh sf-verify
```

## Limits

This skill is intentionally additive. It should not rewrite a skill from scratch, rename invocation keys, or make stylistic churn. It works best for practice drift, not for redesigning a skill’s whole purpose or architecture.

## Related Skills

- `sf-review` to assess whether updated skills changed team practice
- `sf-verify` when refreshed checks should be applied to real work
- `sf-docs` if the public documentation around a skill also needs updating
