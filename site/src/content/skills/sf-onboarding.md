---
title: "sf-onboarding"
slug: "sf-onboarding"
tagline: "Turn shipped features into guided user activation flows."
summary: "A user-onboarding skill for first-success paths, progressive disclosure, setup sequencing, visual state cues, recoverable states, docs coherence, and proof routing."
category: "Build & Fix"
audience:
  - "Founders who want users to understand new features without extra explanation"
  - "Builders adding setup, permissions, integrations, or multi-step product flows"
  - "Teams that need onboarding, docs, support copy, and product state to stay coherent"
problem: "Features can work technically while users still miss the value, grant permissions in the wrong order, skip setup without recovery, or never reach the first meaningful success moment."
outcome: "You get an onboarding contract that explains the target user, first-success path, small-step sequence, progressive disclosure, setup order, required and optional steps, visual state cues, recovery paths, proof route, and docs/editorial impact."
founder_angle: "Good onboarding is product leverage. It helps every user, technical or not, understand what to do next and why the product was built for them."
when_to_use:
  - "After shipping a feature that users need to discover, configure, or understand"
  - "Before implementing a setup flow, checklist, permissions guide, empty state, or recovery path"
  - "When onboarding copy, docs, support text, and in-app states need to match"
what_you_give:
  - "A feature, flow, shipped change, or existing onboarding surface"
  - "Any known user segment, setup requirement, permission, integration, or value moment"
  - "Whether you want planning, audit, implementation routing, or proof guidance"
what_you_get:
  - "A first-success path and activation strategy"
  - "A small-step progression with progressive disclosure"
  - "Required versus optional setup sequencing"
  - "Why/how guidance, visual cues, state semantics, recovery paths, and proof obligations"
  - "Routes to design, build, docs, content, browser, or manual QA owner skills when needed"
example_prompts:
  - "/sf-onboarding onboard users after the new keyboard permissions flow"
  - "/sf-onboarding audit the setup checklist before we ship"
  - "/sf-onboarding create the activation plan for the new cloud sync feature"
argument_modes:
  - argument: "feature or flow"
    effect: "Creates an onboarding contract around the user journey and first-success path."
    consequence: "Useful before implementing or after shipping a feature."
  - argument: "audit"
    effect: "Reviews an existing onboarding surface against activation principles."
    consequence: "Useful when setup, explanations, or recovery feel confusing."
  - argument: "permissions / setup"
    effect: "Focuses on dependency order, value explanation, optionality, settings recovery, and recheck behavior."
    consequence: "Useful for OS settings, integrations, auth, API keys, billing, or device access."
  - argument: "visual states / progressive disclosure"
    effect: "Focuses on small steps, current-step emphasis, icons, colors, badges, and visible completed/skipped/blocked states."
    consequence: "Useful when users may be overwhelmed or when status differences need to be obvious at a glance."
limits:
  - "It does not replace sf-design for visual polish, layout, token systems, or component architecture"
  - "It does not implement broad onboarding UI without a ready spec and build lifecycle"
  - "It blocks misleading permission, privacy, billing, or capability claims"
related_skills:
  - "sf-design"
  - "sf-build"
  - "sf-test"
  - "sf-docs"
  - "sf-content"
  - "sf-browser"
featured: true
order: 515
---

## The Activation Layer

Use `sf-onboarding` when the question is not just "does the feature exist?"
but "will users understand it, configure it in the right order, recover from
skips or blocked states, and reach value quickly?"

It is especially useful for flows with permissions, integrations, optional
modules, empty states, or setup steps that need clear why/how guidance.
