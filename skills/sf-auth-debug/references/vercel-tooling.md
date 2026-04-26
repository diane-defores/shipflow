# Vercel Tooling Reference

Use this reference when the bug touches hosting, deploy state, runtime logs, preview behavior, or project-level Vercel wiring.

Sources checked:
- https://vercel.com/docs/agent-resources/vercel-mcp
- https://vercel.com/docs/cli
- https://vercel.com/docs/projects/deploy-from-cli

Last reviewed: 2026-04-26

## Standard ShipFlow Setup

- Vercel MCP endpoint: `https://mcp.vercel.com`
- Vercel CLI install: `npm install -g vercel`

## Use Vercel MCP When

- The agent needs deployment status, build logs, runtime logs, toolbar threads, or project metadata.
- The issue may depend on preview vs production state.
- You want agent-native access to Vercel resources without reimplementing dashboard steps.

Typical MCP use cases:

- inspect deployments
- inspect build failures
- inspect runtime logs
- read toolbar feedback threads
- inspect linked project metadata

## Use Vercel CLI When

- You are operating from a local checkout and need to link, deploy, inspect, or test manually.
- You need commands that are naturally terminal-driven.

Primary commands:

- `vercel login`
- `vercel link`
- `vercel list`
- `vercel logs`
- `vercel env`
- `vercel mcp`

## Do Not Use Vercel MCP For

- Replacing browser evidence when the bug is purely client-side auth UI behavior.
- Guessing app-level auth logic that actually lives in Clerk, middleware, or app code.

## Default Debug Policy

1. Use Vercel MCP when the problem may be in platform state, logs, previews, or deployments.
2. Use Vercel CLI when the operator needs to link, deploy, or inspect locally.
3. Fall back to Playwright/browser evidence when the failure is visible in the app UI rather than in the Vercel platform.
