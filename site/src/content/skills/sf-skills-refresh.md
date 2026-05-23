---
title: "sf-skills-refresh"
slug: "sf-skills-refresh"
tagline: "Refresh the skill library itself so the framework stays aligned with newer practice."
summary: "A maintenance skill for updating ShipFlow skills with more current standards, patterns, and references."
category: "Meta & Setup"
audience:
  - "Maintainers of the ShipFlow skill system"
  - "Founders treating the framework itself as a living product"
problem: "Skills decay when the world changes but the workflow instructions stay frozen in older assumptions."
outcome: "You get a more up-to-date skill library that reflects current standards, ShipFlow governance gates, and public documentation truth."
founder_angle: "This skill matters when ShipFlow itself is part of the product surface. The framework cannot stay trustworthy if its own playbooks go stale."
when_to_use:
  - "When the skill library needs a standards refresh"
  - "When major changes in tooling, UX, SEO, or AI practice should be reflected in the skills"
  - "When ShipFlow maintenance becomes part of the active roadmap"
what_you_give:
  - "A skill or set of skills to refresh"
  - "The current ShipFlow repository context"
what_you_get:
  - "An updated skill doctrine"
  - "Better alignment with current practice"
  - "A stronger maintenance loop for the framework itself"
  - "Checks for reporting, question, delegation, budget, docs, and public skill-page coherence when those surfaces are affected"
example_prompts:
  - "/sf-skills-refresh"
  - "/sf-skills-refresh audit skills"
  - "/sf-skills-refresh public site related skills"
limits:
  - "It updates the framework layer, not end-user product behavior directly"
  - "Refreshing doctrine still needs maintainers to judge what is truly worth adopting"
  - "Skill maintenance also has to respect Codex and Claude Code discovery budgets, not just improve the body text"
  - "Self-refresh of sf-skills-refresh itself should go through sf-skill-build with scenario-first proof"
related_skills:
  - "sf-docs"
  - "sf-review"
  - "sf-help"
featured: false
order: 640
---

## Governance Alignment

`sf-skills-refresh` now checks local ShipFlow governance before adding external best-practice updates. That includes report modes, user-question rules, delegation semantics, skill budget limits, runtime skill visibility, and public skill-page coherence.

When a refresh changes a skill promise or route, the docs/help/public surfaces need an explicit update plan or a clear no-impact verdict.
