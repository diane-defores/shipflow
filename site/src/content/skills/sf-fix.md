---
title: "sf-fix"
slug: "sf-fix"
tagline: "Triage a bug fast, decide whether it is safe to patch now, and route it correctly."
summary: "The bug-first entrypoint for ShipFlow when the work starts from broken behavior instead of a new feature request."
category: "Core Workflow"
audience:
  - "Solo founders facing product or QA bugs"
  - "Operators who want a safer fork between hotfixes and deeper spec work"
problem: "Bug work often oscillates between overreacting with a rushed patch and overcomplicating a local issue that could have been fixed directly."
outcome: "You get a clearer decision about whether the issue should be fixed now, investigated further, or routed into a stronger contract path."
founder_angle: "This skill helps you move quickly without pretending every bug is trivial. It keeps speed and judgment in the same loop."
when_to_use:
  - "When the starting point is a concrete bug report or failing behavior"
  - "When it is unclear whether the issue is truly local"
  - "When a bug may hide a deeper product or permission problem"
what_you_give:
  - "The observed bug, error, or failing flow"
  - "Any relevant expected behavior if known"
what_you_get:
  - "A triage decision and rationale"
  - "Either a direct-fix path or a spec-first reroute"
  - "A sharper understanding of the real bug boundary"
example_prompts:
  - "/sf-fix users can still access archived projects"
  - "/sf-fix dashboard crashes on first login"
  - "/sf-fix checkout spinner never resolves"
limits:
  - "It is for bounded bug work, not broad redesign"
  - "Some bug reports still need deeper clarification before safe implementation"
related_skills:
  - "sf-spec"
  - "sf-start"
  - "sf-verify"
featured: true
order: 20
---
