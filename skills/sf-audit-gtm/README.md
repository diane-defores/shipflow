# sf-audit-gtm

> Review whether a product is actually ready to win users, convert them, and support the promise it makes.

## What It Does

`sf-audit-gtm` inspects a page or full project through a go-to-market lens. It checks positioning, conversion architecture, trust, objection handling, pricing transparency, analytics, and launch readiness.

It is useful when the product may be technically fine but commercially weak, confusing, or inconsistent.

## Who It's For

- Solo founders preparing to launch or relaunch
- SaaS builders tuning funnel performance and credibility
- Teams that want one GTM review spanning pages, onboarding, and measurement

## When To Use It

- when you want a launch-readiness review before spending time or money on traffic
- when the funnel feels leaky and you need a structured diagnosis
- when pricing, onboarding, support, and public claims may be out of sync

## What You Give It

- a project root, a specific page, or `global`
- any business context already present in the repo
- optional notes about target audience, pricing, or acquisition channel

## What You Get Back

- a GTM report with category scores and prioritized weaknesses
- visibility into trust gaps, friction points, and measurement blind spots
- concrete next steps for positioning, funnel, and launch hygiene

## Typical Examples

```bash
/sf-audit-gtm
/sf-audit-gtm src/pages/pricing.astro
/sf-audit-gtm global
```

## Limits

This skill reviews what is visible in the product, docs, and repo context. It does not replace customer interviews, analytics analysis, or a real demand test.

## Related Skills

- `sf-audit-copywriting` for persuasion strategy
- `sf-audit-seo` for acquisition-side visibility
- `sf-prod` after shipping changes that affect the live funnel
