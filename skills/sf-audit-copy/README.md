# sf-audit-copy

> Improve the words users read so the product is clearer, sharper, and more trustworthy.

## What It Does

`sf-audit-copy` reviews user-facing copy on a page or across a project. It looks at clarity, tone, grammar, CTA quality, microcopy, trust signals, and whether the language matches what the product really does.

This is a writing-quality audit. It treats copy as part of the product experience, not as decoration.

## Who It's For

- Solo founders rewriting landing pages, pricing pages, and onboarding flows
- Product builders who want sharper UX copy and fewer vague claims
- Teams that need copy aligned with the real product and docs

## When To Use It

- when a page reads weakly, vaguely, or generically
- when you want to tighten CTAs, forms, empty states, or error messages
- when product changes may have made public copy inaccurate

## What You Give It

- a page file, a project directory, or `global`
- optional brand and business context if available in the repo

## What You Get Back

- a scored copy review with concrete weaknesses called out
- rewrite directions for problematic sections
- visibility into promise drift, weak microcopy, and trust gaps

## Typical Examples

```bash
/sf-audit-copy
/sf-audit-copy src/pages/index.astro
/sf-audit-copy global
```

## Limits

This skill focuses on the quality of the writing itself. It is not the right tool for deeper funnel strategy, persona mapping, or persuasion architecture across the customer journey.

## Related Skills

- `sf-audit-copywriting` for conversion strategy and persuasion
- `sf-audit-gtm` for broader market and funnel readiness
- `sf-docs` when product changes require documentation updates
