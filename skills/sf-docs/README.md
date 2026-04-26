# sf-docs

> Generate, audit, and align project documentation so the docs keep up with the product instead of drifting behind it.

## What It Does

`sf-docs` handles documentation as an active product surface. It can generate a project README, document APIs or components, add inline code documentation, audit existing docs for drift, and update ShipFlow decision artifacts with the right metadata.

For solo founders, this matters because stale docs cost time twice: once when you forget how the system works, and again when users, teammates, or future-you follow instructions that are no longer true.

## Who It's For

- Solo founders maintaining product and technical docs alone
- Developers onboarding themselves back into an older project
- Teams that need docs to stay aligned with behavior, setup, and architecture

## When To Use It

- when a README no longer reflects the actual project
- when APIs or components need human-readable documentation
- when internal docs feel fragmented or inconsistent
- when ShipFlow artifacts need metadata migration or cleanup

## What You Give It

- the current project directory
- a mode such as `readme`, `api`, `components`, `audit`, or `update`
- optionally a specific file path

## What You Get Back

- generated or updated documentation
- a documentation audit with concrete drift risks
- metadata-aligned ShipFlow artifacts where relevant
- clearer next steps when docs are too incomplete to trust

## Typical Examples

```bash
/sf-docs readme
/sf-docs api
/sf-docs components
/sf-docs audit
/sf-docs src/lib/pricing.ts
```

## Limits

`sf-docs` documents what the code and proven context support. It should not invent features, guarantees, or business claims that are not backed by the repo or explicit context.

## Related Skills

- `sf-init` to create the first project context docs
- `sf-enrich` for public-facing content improvements
- `sf-end` when implementation changed user-facing behavior and docs were updated
