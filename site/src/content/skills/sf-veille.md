---
title: "sf-veille"
slug: "sf-veille"
tagline: "Triage external links and incoming information before they dissolve into random browser tabs."
summary: "A governance-aware link-analysis skill for reviewing URLs or pasted content, summarizing relevance, and routing follow-up actions."
category: "Research & Grow"
audience:
  - "Founders collecting market, product, or technical signals from the web"
  - "Operators who need to turn reading into action"
problem: "Useful external information often gets consumed passively instead of being sorted into ignore, backlog, content, or deeper investigation."
outcome: "You get a more intentional triage layer between incoming information, project-local governance context, and actual product or content decisions."
founder_angle: "This skill matters when your research intake is bigger than your working memory. It converts reading into a clearer action surface."
when_to_use:
  - "When you have links or pasted content to review"
  - "When market or product signals need structured triage"
  - "When you want to turn reading into backlog or research actions"
what_you_give:
  - "One or more URLs or pasted source material"
  - "The current project or business context"
what_you_get:
  - "A relevance-oriented summary"
  - "Suggested next actions for each source"
  - "Project-local governance context checks before scoring"
  - "sf-content / sf-repurpose handoffs or surface-missing findings for public-content ideas"
  - "Less information sprawl in your workflow"
example_prompts:
  - "/sf-veille https://example.com/article"
  - "/sf-veille these five competitor pages"
  - "/sf-veille pasted notes from founder forum"
limits:
  - "It helps triage incoming information; it does not replace deeper market or product research"
  - "The quality of the outcome depends on the relevance of the inputs you feed it"
  - "It should not invent blog, newsletter, or social surfaces that are not declared in the project's content map"
related_skills:
  - "sf-content"
  - "sf-repurpose"
  - "sf-research"
  - "sf-market-study"
  - "sf-backlog"
featured: false
order: 450
---

## Governance Fit

`sf-veille` uses the cross-project registry to discover candidate projects, but it scores relevance from each project's local `shipflow_data/` contracts. Research output belongs under `shipflow_data/workflow/research/`, not an ad hoc research directory.

When a source suggests a blog, newsletter, social post, public docs update, or claim-sensitive content, `sf-veille` routes through `sf-content` / `sf-repurpose` and the editorial corpus. If no blog/article surface is declared, the correct finding is `surface missing: blog`.
