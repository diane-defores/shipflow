# sf-status

> Show a fast cross-project git dashboard so you can see what needs attention across your portfolio.

## What It Does

`sf-status` reads the ShipFlow project registry and inspects each repo in read-only mode. It reports branch names, local uncommitted changes, ahead/behind status, recent commit activity, and stash presence, then filters the view to the repos that matter right now.

For a solo founder juggling multiple products, this replaces hopping repo by repo just to answer “what is dirty, behind, or waiting to be pushed?”

## Who It's For

- Solo founders running several repos at once
- Operators who want a quick daily git health check
- Anyone using ShipFlow as a workspace-level portfolio dashboard

## When To Use It

- when you want to know which projects need attention
- when you suspect local changes are scattered across repos
- when you want a fast “issues only”, “dirty only”, or “all projects” view

## What You Give It

- the ShipFlow workspace with `PROJECTS.md`
- optionally a mode: `issues`, `dirty`, or `all`

## What You Get Back

- a compact dashboard of repo status across projects
- a “needs attention” section for uncommitted work, sync drift, detached heads, missing remotes, or stashes
- quick action suggestions for obvious next steps

## Typical Examples

```bash
/sf-status
/sf-status issues
/sf-status dirty
```

## Limits

`sf-status` is intentionally read-only. It does not fix repo state, pull, push, or edit trackers. It also depends on the project registry being accurate and only reports what git exposes, not whether the code itself is good.

## Related Skills

- `sf-ship` to commit and push a dirty repo
- `sf-review` to review what changed in an active project
- `sf-tasks` when repo activity should update project tracking
