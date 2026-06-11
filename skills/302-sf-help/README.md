# 302-sf-help

> Show the ShipFlow operating model: which skill to use, when to use it, and how the workflows fit together.

## What It Does

`302-sf-help` is the entrypoint when you know you want ShipFlow, but not which skill should lead. It acts as a cheatsheet for the system: execution paths, audit modes, prompting behavior, tracking conventions, metadata rules, and common next-step chains.

It also explains the browser and bug-loop boundaries: `108-sf-browser` for non-auth page checks, `109-sf-auth-debug` for auth/session/protected flows, `405-sf-prod` for deployment/runtime truth, `107-sf-test` for durable manual QA logs, and `003-sf-bug` for BUG-ID lifecycle execution.

For solo founders, it shortens the learning curve. Instead of memorizing dozens of skills, you can quickly locate the one that matches your situation.

## Who It's For

- New ShipFlow users
- Solo founders standardizing how they work across projects
- Existing users who forgot the right workflow for a task

## When To Use It

- when you are unsure which skill should start the job
- when you want to understand the full ShipFlow workflow
- when you need a quick reminder of audit modes or prompt behavior
- when teaching someone else how the system is organized

## What You Give It

- nothing, for a general overview
- or a focus such as `tasks`, `audit`, `workflows`, or `prompts`

## What You Get Back

- a compact map of the skill system
- guidance on common sequences and branching decisions
- help choosing between `108-sf-browser`, `109-sf-auth-debug`, `405-sf-prod`, `107-sf-test`, and `003-sf-bug`
- reminders about tracking, docs, and security guardrails

## Typical Examples

```bash
/302-sf-help
/302-sf-help audit
/302-sf-help workflows
/302-sf-help prompts
```

## Limits

`302-sf-help` explains the system; it does not execute the work itself. If you already know the right skill, call it directly.

## Related Skills

- `106-sf-fix` for bug-first intake
- `003-sf-bug` for executing bug files through fix, retest, verify, and ship risk
- `108-sf-browser` for non-auth page, visual, console, screenshot, or network evidence
- `102-sf-start` for implementation
- `400-sf-audit` for broad project reviews
