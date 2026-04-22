---
name: sf-ship
description: Ship changes quickly by default (commit + push). Run full session-closing flow only when explicitly requested.
argument-hint: [optional: commit message | "end la tache" for full close | skip-check]
---

## Context

- Current directory: !`pwd`
- Current date: !`date '+%Y-%m-%d'`
- Git status: !`git status --short 2>/dev/null || echo "Not a git repo"`
- Git diff stat: !`git diff HEAD --stat 2>/dev/null || echo ""`
- Current branch: !`git branch --show-current 2>/dev/null || echo "unknown"`
- Recent commits (style reference): !`git log --oneline -5 2>/dev/null || echo "no commits"`
- Master TASKS.md: !`cat /home/claude/shipflow_data/TASKS.md 2>/dev/null || cat TASKS.md 2>/dev/null || echo "No TASKS.md"`
- Existing CHANGELOG: !`head -20 CHANGELOG.md 2>/dev/null || echo "no CHANGELOG.md"`

## Your task

`sf-ship` has two modes.

### Mode 1 — Quick ship (default)

Default behavior when `$ARGUMENTS` does NOT include end-of-task keywords:
- `end la tache`
- `end`
- `fin`
- `close task`

Quick mode is optimized for fast iteration:
1. Optional lightweight checks (skip if `skip-check` is present)
2. Stage
3. Commit
4. Push
5. One short report

Do NOT update TASKS.md or CHANGELOG.md in quick mode.

### Mode 2 — Full close + ship (explicit)

Only when `$ARGUMENTS` includes one of the end-of-task keywords above:
1. Summarize session
2. Update TASKS.md (master + local)
3. Update CHANGELOG.md
4. Save decisions to memory
5. Run checks (unless `skip-check`)
6. Stage, commit, push
7. One full closing report

Use this mode when the task is truly finished and should be formally closed.

---

## Step 1 — Workspace root detection

If the current directory has no `.git` directory BUT contains project subdirectories with changes, use **AskUserQuestion**:
- "Which project should I ship?"
- One option per project with uncommitted changes
- `multiSelect: false`

Then work inside that project for all remaining steps.

## Step 2 — Decide mode

Inspect `$ARGUMENTS`:
- if it contains `end la tache`, `end`, `fin`, or `close task` -> `full`
- otherwise -> `quick`

## Step 3 — Safety checks before staging

Check for secrets:
- if untracked `.env`, credential, or token files are not ignored, stop and warn

## Step 4 — Pre-checks

If mode is `quick`:
- run lightweight checks only when practical
- skip all checks when `$ARGUMENTS` includes `skip-check`

If mode is `full`:
- run normal checks (unless `skip-check`)

Checks policy:
- if `package.json` exists: run typecheck and lint scripts if present
- do NOT run full build here by default
- if `test_*.sh` exists and shell files changed: run `bash -n` on touched shell files

If a check fails:
- stop and report failure
- suggest rerun with `skip-check` if user wants to force ship

## Step 5 — Full-mode bookkeeping (only in full mode)

Only for mode `full`:
- update master TASKS.md and local TASKS.md when relevant
- update CHANGELOG.md with meaningful grouped entries
- save useful decisions to memory

Skip this step entirely in quick mode.

## Step 6 — Stage and commit

Stage and commit:
```bash
git add -A
git commit -m "[message from $ARGUMENTS or derived summary]
Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

Use a HEREDOC for commit message.

## Step 7 — Push

```bash
git push
# if no upstream: git push -u origin <branch>
```

## Step 8 — One report

Quick mode report:
```text
## Shipped (Quick) — [date]

[SHORT_SHA] — "[commit message]" -> [branch]
Checks: [passed / skipped / failed]
Mode: quick (commit + push only)
[✓ Pushed] or [push failure]
```

Full mode report:
```text
## Shipped (Full) — [date]

[SHORT_SHA] — "[commit message]" -> [branch]
Checks: [passed / skipped / failed]
Tasks/Changelog: updated
Session closed: [completed/in-progress summary]
[✓ Pushed] or [push failure]
```

## Rules

- Quick mode is the default
- Full close flow requires explicit end-of-task keyword
- Do NOT force push to main/master
- Do NOT commit secrets
- If nothing to commit, say so clearly
- Keep report concise
