---
artifact: spec
metadata_schema_version: "1.0"
artifact_version: "1.0.0"
project: ShipFlow
created: "2026-05-06"
updated: "2026-05-06"
status: ready
source_skill: sf-spec
scope: skill
owner: unknown
confidence: high
risk_level: medium
security_impact: none
docs_impact: yes
user_story: "As a ShipFlow operator, I want one master design entrypoint that can understand any design-related request and route it through the right design, audit, browser, spec, implementation, verification, and ship skills without making me memorize the design skill taxonomy."
linked_systems:
  - skills/sf-design/SKILL.md
  - skills/sf-design-from-scratch/SKILL.md
  - skills/sf-design-playground/SKILL.md
  - skills/sf-audit-design/SKILL.md
  - skills/sf-audit-design-tokens/SKILL.md
  - skills/sf-audit-components/SKILL.md
  - skills/sf-audit-a11y/SKILL.md
  - skills/sf-build/SKILL.md
  - skills/sf-browser/SKILL.md
  - skills/sf-check/SKILL.md
  - skills/sf-verify/SKILL.md
  - skills/shipflow/SKILL.md
  - skills/references/entrypoint-routing.md
  - site/src/content/skills/sf-design.md
  - docs/skill-launch-cheatsheet.md
  - docs/technical/skill-runtime-and-lifecycle.md
  - README.md
  - shipflow-spec-driven-workflow.md
depends_on:
  - artifact: "skills/references/master-workflow-lifecycle.md"
    artifact_version: "1.2.0"
    required_status: active
  - artifact: "skills/references/master-delegation-semantics.md"
    artifact_version: "1.2.0"
    required_status: active
  - artifact: "skills/references/question-contract.md"
    artifact_version: "1.0.0"
    required_status: active
supersedes: []
evidence:
  - "The existing `sf-design-from-scratch` spec explicitly states that a future `sf-design` master skill may route to it, while keeping design-system creation focused."
  - "Current design responsibilities are split across `sf-audit-design`, `sf-audit-design-tokens`, `sf-audit-components`, `sf-audit-a11y`, `sf-design-from-scratch`, and `sf-design-playground`."
  - "User reported that the previous work on the master design skill was likely lost after a VM crash and requested recreating it as an orchestrator for design-related questions."
  - "User clarified that playground/token centralization reports should also explain the follow-up migration needed to make the whole site consume the centralized values."
next_step: "/sf-ship \"Add sf-design master design skill\""
---

# Spec: sf-design Master Design Lifecycle Skill

## Title

sf-design Master Design Lifecycle Skill

## Status

Ready.

Create a new master skill named `sf-design`. It owns the user-facing design entrypoint for ShipFlow. The operator should be able to ask a design-related question without choosing between token creation, playground scaffolding, design audit, component audit, accessibility audit, browser proof, implementation, verification, or ship routing.

## User Story

As a ShipFlow operator, I want one design master skill that can understand my design intent, choose the right specialist skill or lifecycle path, and keep the work moving through proof and verification, so I do not need to memorize the design skill taxonomy or know when token centralization still needs a site-wide implementation pass.

## Behavior Contract

`sf-design` is a master/orchestrator skill. It routes and sequences design work; it does not duplicate specialist internals.

It must classify design intent into the smallest safe owner route:

- design-system foundation from scattered values -> `sf-design-from-scratch`
- live token preview/editing -> `sf-design-playground`
- token coherence, hardcoded design values, token migration coverage -> `sf-audit-design-tokens`
- general UI/UX quality, hierarchy, layout, responsive behavior -> `sf-audit-design`
- component architecture, variants, duplication, API hygiene -> `sf-audit-components`
- accessibility, keyboard, focus, contrast, WCAG evidence -> `sf-audit-a11y`
- visible page proof or non-regression screenshots -> `sf-browser`
- broad implementation or multi-page migration -> `sf-build` / `sf-spec -> sf-ready -> sf-start`
- checks and verification -> `sf-check`, `sf-verify`, then closure and ship routing

For broad design work, `sf-design` follows the shared master lifecycle:

```text
intake
  -> design work item resolution
  -> audit/discovery when needed
  -> sf-spec/sf-ready for non-trivial changes
  -> owner-skill execution
  -> checks and browser/design proof
  -> sf-verify
  -> sf-end/sf-ship or sf-deploy when appropriate
```

For token centralization and playground outcomes, `sf-design` must explicitly distinguish between:

- creating or editing the central token source
- migrating pages/components/layouts to consume that source
- verifying there was no unintended visual regression

If a run creates or scaffolds tokens but the site is not yet migrated to consume them, the final report must name the follow-up path:

```text
sf-audit-design-tokens
-> sf-build "Migrer le site pour consommer les tokens design centralises sans changement visuel volontaire"
-> sf-check
-> sf-browser
-> sf-verify
-> sf-ship
```

## Success Behavior

- Given an operator asks a design-related question, when the route is clear, then `sf-design` directly hands off to the focused owner skill or lifecycle without asking the operator to choose the taxonomy.
- Given the request spans multiple pages, components, public surfaces, design-system migration, accessibility fixes, or visible UI changes, then `sf-design` creates or continues a spec-first chantier before implementation.
- Given a playground or token source has been created, when migration coverage remains incomplete, then `sf-design` names the site-wide implementation path instead of treating centralization as finished.
- Given a visual change is implemented, when proof is required, then `sf-design` routes to `sf-browser` for non-auth visual evidence and `sf-audit-a11y` or `sf-audit-design-tokens` for specialist evidence as needed.
- Given verification passes, then `sf-design` routes through closure and bounded ship/deploy semantics rather than leaving manual `/sf-end` or `/sf-ship` as boilerplate.

## Error Behavior

- If the design intent is too fuzzy for one targeted routing question, route to `sf-explore` before creating a spec or editing files.
- If a request would invent a new brand identity, visual direction, color palette, typography, or product promise without enough project evidence, ask a targeted business/design question.
- If broad visual implementation lacks a ready spec, block before file edits and route to `sf-spec`.
- If visual proof is missing for a non-regression claim, block closure or ship until `sf-browser` or equivalent evidence exists.
- If accessibility, contrast, focus, or reduced-motion safety would be weakened by token or visual changes, block and route to the appropriate specialist.
- If unrelated dirty files would enter closure or ship scope, stop before ship routing.

## Scope In

- Create `skills/sf-design/SKILL.md`.
- Add public skill page `site/src/content/skills/sf-design.md`.
- Update `shipflow` and shared routing references so design-related operator requests route to `sf-design`.
- Update help, README, workflow, launch cheatsheet, and technical docs for discoverability.
- Update design playground/from-scratch handoff language so token centralization points to migration and non-regression proof when needed.
- Sync current-user Claude/Codex runtime links.

## Scope Out

- Rewriting existing design specialist skills from scratch.
- Duplicating `sf-audit-design`, `sf-audit-design-tokens`, `sf-audit-components`, `sf-audit-a11y`, `sf-design-from-scratch`, or `sf-design-playground` internals inside `sf-design`.
- Creating an unrelated brand identity or component library.
- Shipping unrelated dirty work.

## Constraints

- Internal skill contracts use English.
- User-facing reports and questions use the user's active language.
- `sf-design` is a master lifecycle skill and must load the shared master lifecycle, delegation, question, chantier, and reporting references.
- Use direct main-thread handoff from `shipflow`; do not run master skills inside nested subagents from the router.
- Use delegated sequential execution for file work when available; parallelism requires ready non-overlapping `Execution Batches`.
- Ask only targeted questions when the answer changes route, scope, brand direction, proof, security, public claim, closure, or ship posture.

## Dependencies

- Existing design owner skills listed in `linked_systems`.
- Shared master lifecycle references.
- Public site skill content schema.
- Runtime skill sync helper.

Fresh external docs verdict: `fresh-docs not needed` for creating this local skill contract. Future executions of `sf-design` should run the documentation freshness gate only when framework/runtime behavior, accessibility standards, browser evidence policy, or provider-specific current docs affect the design work.

## Invariants

- `sf-design` is the recommended design entrypoint; specialist skills remain available for expert direct use.
- A token source is not complete design implementation unless the product surfaces consume it.
- Design verification needs visible proof when visual non-regression or UI quality is claimed.
- Accessibility and reduced-motion safety outrank token discipline.
- Master skill orchestration routes through owners and does not duplicate specialist internals.

## Links & Consequences

Upstream:
- `shipflow` natural-language router and user design requests.

Downstream:
- Operators can ask `sf-design <question>` for design work.
- `shipflow <design request>` can hand off to `sf-design`.
- Future design-system work has a standard path from token/playground creation to site-wide migration and browser proof.

## Open Questions

None. The user explicitly requested recreating the master design skill and confirmed the intended scope: design-related questions should be handled through a design orchestrator that finds the right method.

## Implementation Tasks

- [x] Task 1: Create this ready spec.
  - File: `specs/sf-design-master-design-lifecycle-skill.md`
  - Action: Capture master-design routing, lifecycle, token migration follow-up, docs impact, validation, and runtime visibility.
  - Validate with: `python3 tools/shipflow_metadata_lint.py specs/sf-design-master-design-lifecycle-skill.md`

- [x] Task 2: Create the skill contract.
  - File: `skills/sf-design/SKILL.md`
  - Action: Encode master lifecycle, routing matrix, token/playground follow-up, proof gates, stop conditions, and final report.
  - Validate with: `rg -n "name: sf-design|Design Intent Routing|Token Implementation Handoff|sf-audit-design-tokens|sf-design-from-scratch|sf-browser" skills/sf-design/SKILL.md`

- [x] Task 3: Add runtime discoverability and public content.
  - Files: `site/src/content/skills/sf-design.md`, current-user Claude/Codex skill links.
  - Action: Create public skill page and sync runtime links.
  - Validate with: `test -f site/src/content/skills/sf-design.md` and `tools/shipflow_sync_skills.sh --check --skill sf-design`

- [x] Task 4: Update routing and help surfaces.
  - Files: `skills/shipflow/SKILL.md`, `skills/references/entrypoint-routing.md`, `skills/sf-help/SKILL.md`, `README.md`, `docs/skill-launch-cheatsheet.md`, `shipflow-spec-driven-workflow.md`, `docs/technical/skill-runtime-and-lifecycle.md`
  - Action: Make `sf-design` the recommended master entrypoint for design-related operator requests.
  - Validate with: `rg -n "sf-design" <changed files>`

- [x] Task 5: Update specialist design handoffs.
  - Files: `skills/sf-design-playground/SKILL.md`, `skills/sf-design-from-scratch/SKILL.md`, relevant public skill pages.
  - Action: Explain that token/playground centralization may require site-wide migration and visual non-regression proof through `sf-design` or `sf-build`.
  - Validate with: `rg -n "Token Implementation Handoff|consume|centralized|sf-design" skills/sf-design-playground/SKILL.md skills/sf-design-from-scratch/SKILL.md site/src/content/skills/sf-design-playground.md site/src/content/skills/sf-design-from-scratch.md`

- [x] Task 6: Validate and update docs.
  - Action: Run skill budget audit, metadata lint, public site build, runtime sync check, focused route checks, and leak scan.
  - Validate with commands in Test Strategy.

## Acceptance Criteria

- [x] AC 1: Given an operator runs `/sf-design <design request>`, the skill classifies the design intent and routes to the correct owner skill or lifecycle gate.
- [x] AC 2: Given a request is about creating or centralizing design tokens, the skill can route to `sf-design-from-scratch`, `sf-design-playground`, or `sf-audit-design-tokens` as appropriate.
- [x] AC 3: Given token centralization has happened but pages are not fully migrated, the skill names the implementation path and visual non-regression proof path.
- [x] AC 4: Given a broad design change spans multiple pages/components or product-critical surfaces, the skill requires a ready spec before implementation.
- [x] AC 5: Given `shipflow` receives a design-related request, routing docs point to `sf-design`.
- [x] AC 6: Given the skill is created, current-user Claude and Codex runtime links expose `sf-design`.
- [x] AC 7: Given public skill pages build, `/skills/sf-design` is generated and related design skills link to it.
- [x] AC 8: Given docs/help are searched, `sf-design` is discoverable as the master design entrypoint.

## Test Strategy

- `test -f skills/sf-design/SKILL.md`
- `test -f site/src/content/skills/sf-design.md`
- `rg -n "name: sf-design|Design Intent Routing|Token Implementation Handoff|sf-audit-design-tokens|sf-design-from-scratch|sf-browser" skills/sf-design/SKILL.md`
- `rg -n "sf-design" skills/shipflow/SKILL.md skills/references/entrypoint-routing.md skills/sf-help/SKILL.md README.md docs/skill-launch-cheatsheet.md shipflow-spec-driven-workflow.md docs/technical/skill-runtime-and-lifecycle.md site/src/content/skills`
- `"${SHIPFLOW_ROOT:-$HOME/shipflow}/tools/shipflow_sync_skills.sh" --check --skill sf-design`
- `python3 tools/skill_budget_audit.py --skills-root skills --format markdown`
- `python3 tools/shipflow_metadata_lint.py specs/sf-design-master-design-lifecycle-skill.md docs/skill-launch-cheatsheet.md shipflow-spec-driven-workflow.md docs/technical/skill-runtime-and-lifecycle.md`
- `npm --prefix site run build`
- `rg -n "BEGIN .*KEY|PRIVATE KEY|PASSWORD=|SECRET=|TOKEN=|CREDENTIAL=" skills/sf-design/SKILL.md site/src/content/skills/sf-design.md`

## Risks

- Duplicate responsibility risk: mitigated by making `sf-design` a router/orchestrator and keeping specialist skill internals with existing owners.
- False completion risk after token centralization: mitigated by explicit token implementation handoff and browser non-regression proof.
- Scope creep risk: mitigated by spec-first for broad visual changes and by routing narrow requests to focused owner skills.
- Accessibility regression risk: mitigated by routing contrast, focus, keyboard, and reduced-motion concerns to `sf-audit-a11y`.
- Public claim risk: low; this is a skill routing contract and public skill page, not a product promise beyond workflow behavior.

## Skill Run History

| Date UTC | Skill | Model | Action | Result | Next step |
|----------|-------|-------|--------|--------|-----------|
| 2026-05-06 12:18:18 UTC | sf-spec | GPT-5 Codex | Created the `sf-design` master design lifecycle skill spec from the user's request and existing design skill taxonomy. | ready spec created | `/sf-ready sf-design Master Design Lifecycle Skill` |
| 2026-05-06 12:18:18 UTC | sf-ready | GPT-5 Codex | Evaluated naming, placement as a master skill, overlap with existing design specialists, docs/public impact, token implementation handoff, and validation. | ready | `/sf-start sf-design Master Design Lifecycle Skill` |
| 2026-05-06 12:28:28 UTC | sf-skill-build | GPT-5 Codex | Created `sf-design`, public skill page, routing/docs/help updates, specialist handoff updates, runtime links, and validation evidence. | implemented; not shipped | `/sf-ship "Add sf-design master design skill"` |
| 2026-05-06 12:44:39 UTC | sf-ship | GPT-5 Codex | Prepared full close and bounded ship for the `sf-design` master design lifecycle skill scope, excluding unrelated dirty bug/runtime CLI work. | shipped | none |

## Current Chantier Flow

```text
sf-spec: done (ready)
sf-ready: done (ready)
sf-start: done (implemented)
sf-verify: done (local validation passed)
sf-end: done (full close prepared)
sf-ship: done (bounded ship)
```

Next step:
- none
