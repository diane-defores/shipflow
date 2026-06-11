---
artifact: technical_guidelines
metadata_schema_version: "1.0"
artifact_version: "1.0.0"
project: ShipFlow
created: "2026-06-11"
updated: "2026-06-11"
status: active
source_skill: 300-sf-docs
scope: design-system-authority
owner: Diane
confidence: high
risk_level: high
security_impact: none
docs_impact: yes
linked_systems:
  - shipflow_data/business/branding.md
  - shipflow_data/technical/guidelines.md
  - shipflow_data/technical/code-docs-map.md
  - skills/references/design-system-token-contract.md
depends_on:
  - artifact: shipflow_data/business/branding.md
    artifact_version: "1.1.0"
    required_status: reviewed
  - artifact: skills/references/design-system-token-contract.md
    artifact_version: "1.0.0"
    required_status: active
supersedes: []
evidence:
  - "User decision 2026-06-11: every managed application must declare the canonical design-system source instead of letting agents infer or customize design per screen."
next_review: "2026-06-25"
next_step: "/103-sf-verify design-system-authority"
---

# Design-System Authority

## Purpose

This file defines where a ShipFlow-managed project declares the source of truth for design tokens and visual implementation.

`branding.md` owns brand direction. This technical artifact owns the code-level authority: which files, theme APIs, component variants, and validation checks agents must use before changing application UI.

## Required Project Declaration

Every project with a UI must declare a `Design-System Authority` section in the nearest governance-root technical docs:

- default location: `shipflow_data/technical/design-system-authority.md`
- monorepo-wide shared UI: monorepo-root `shipflow_data/technical/design-system-authority.md`
- app-specific exception: a scoped technical doc such as `shipflow_data/technical/apps/<app>.md`, referenced from the root design-system authority and `code-docs-map.md`

Do not create `shipflow_data/` inside each app/package just to declare design authority. Use the monorepo root governance corpus and scoped entries.

## Declaration Schema

Use this compact schema in the project artifact:

```yaml
design_system_authority:
  status: declared | missing | split-brain | not-applicable
  brand_contract: shipflow_data/business/branding.md
  canonical_source: "path/to/tokens-or-theme"
  technology_carrier: css-custom-properties | tailwind-theme | flutter-theme | react-native-theme | native-platform-theme | dtcg-json | other
  component_bridge: "path/to/component primitives or variant system"
  layout_authority: "path/to/layout scale, breakpoints, density, safe-area, or platform measurement policy"
  motion_authority: "path/to/motion tokens or platform motion policy"
  forbidden_bypass:
    - inline visual literals outside canonical source
    - arbitrary Tailwind values outside token migration
    - screen-local colors, spacing, typography, shadows, motion, safe-area, keyboard, or overlay constants
  validation:
    - python3 "${SHIPFLOW_ROOT:-$HOME/shipflow}/tools/design_system_drift_check.py" --changed --format markdown
    - project build/lint command
    - browser/simulator/device proof route when visual behavior changes
```

If a project has multiple frontends, list one entry per app/surface and identify the shared source when it exists.

## Technology Defaults

The declaration is project-owned, but the carrier must follow the stack:

- CSS/web default: CSS custom properties in a central token/theme/global style file.
- Tailwind v4: `@theme` variables and CSS custom properties as the runtime token layer.
- Tailwind v3: `tailwind.config.*` plus CSS variables when runtime theming is needed.
- Flutter: `ThemeData`, `ColorScheme`, `TextTheme`, `ThemeExtension`, shared `EdgeInsets`/radius/duration/curve constants, and component themes.
- React Native/Expo: typed shared theme/tokens object plus component variants.
- Native mobile: platform theme resources/tokens and adaptive layout APIs.
- DTCG token pipeline: `tokens.json` or equivalent only when the project actually has a token build pipeline.

The agent must not choose the easiest carrier. It must use the declared carrier or route a design-system unification task before editing UI.

## Missing Or Split-Brain Authority

If no declaration exists:

1. inspect existing brand docs, global styles, theme files, component primitives, and framework config
2. propose the declaration in this artifact or the scoped app doc
3. route to `500-sf-design-from-scratch` when no coherent token layer exists
4. route to `006-sf-design` or spec-first when multiple sources compete

If components consume one theme source while pages or utilities use another, report `split-brain`. Do not make visual changes until the authority is unified or the exception is explicitly documented.

## Stop Conditions

Stop or report `partial` when:

- UI work starts and no design-system authority can be identified
- an agent wants to add visual literals outside the declared authority
- a project has competing token/theme sources without an explicit resolution
- token files are edited but component/page consumption and visual proof are not addressed
- mobile safe-area, keyboard/IME, density, touch target, or adaptive layout constants are handled screen by screen

## Maintenance Rule

Update this artifact whenever the project adds a frontend, changes styling technology, introduces a token pipeline, changes component primitives, changes theme mode behavior, or accepts a documented platform-bound exception.
