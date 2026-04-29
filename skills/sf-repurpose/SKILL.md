---
name: sf-repurpose
description: "Args: optional focus or target surface. Repurpose either the current work conversation or user-supplied source content into faithful documentation, marketing content, release notes, FAQs, articles, page updates, or content angles. Use when a paragraph, article, feature discussion, or source text should be transformed into reusable content without inventing beyond the source. If the user asks to apply, create, update, fill the site, or do the recommended content, this skill must write the justified target surfaces instead of only describing them."
argument-hint: [optional focus such as "doc", "marketing", "full", "release notes", "faq", "newsletter", "article", "site", "apply", or a target surface]
---

## Canonical Paths

Before resolving any ShipFlow-owned file, load `$SHIPFLOW_ROOT/skills/references/canonical-paths.md` (`$SHIPFLOW_ROOT` defaults to `$HOME/shipflow`). ShipFlow tools, shared references, skill-local `references/*`, templates, workflow docs, and internal scripts must resolve from `$SHIPFLOW_ROOT`, not from the project repo where the skill is running. Project artifacts and source files still resolve from the current project root unless explicitly stated otherwise.

## Chantier Tracking

Trace category: `conditionnel`.
Process role: `support-de-chantier`.

Before producing the final report, load `$SHIPFLOW_ROOT/skills/references/chantier-tracking.md` when this run is attached to a spec-first chantier. If exactly one active `specs/*.md` chantier is identified, append the current run to `Skill Run History`, update `Current Chantier Flow` when the run changes the chantier state, and include a final `Chantier` block. If no unique chantier is identified, do not write to any spec; report `Chantier: non applicable` or `Chantier: non trace` with the reason.


## Context

- Current directory: !`pwd`
- Current date: !`date '+%Y-%m-%d'`
- Project name: !`basename $(pwd)`
- Git branch: !`git branch --show-current 2>/dev/null || echo "unknown"`
- Git status: !`git status --short 2>/dev/null || echo "Not a git repo"`
- Git diff stat: !`git diff --stat 2>/dev/null || echo "no diff"`
- Recent commits: !`git log --oneline -8 2>/dev/null || echo "no commits"`
- Changed files: !`git diff --name-only HEAD 2>/dev/null | head -40 || echo "no changed files"`
- CLAUDE.md: !`head -60 CLAUDE.md 2>/dev/null || echo "no CLAUDE.md"`
- BUSINESS.md: !`head -60 BUSINESS.md 2>/dev/null || echo "no BUSINESS.md"`
- BRANDING.md: !`head -60 BRANDING.md 2>/dev/null || echo "no BRANDING.md"`
- PRODUCT.md: !`head -60 PRODUCT.md 2>/dev/null || echo "no PRODUCT.md"`
- GTM.md: !`head -60 GTM.md 2>/dev/null || echo "no GTM.md"`
- GUIDELINES.md: !`head -60 GUIDELINES.md 2>/dev/null || echo "no GUIDELINES.md"`
- CONTENT_MAP.md: !`head -120 CONTENT_MAP.md 2>/dev/null || echo "no CONTENT_MAP.md"`
- Existing docs/pages: !`find docs src content app -maxdepth 2 -type f \( -name "*.md" -o -name "*.mdx" -o -name "*.tsx" -o -name "*.astro" \) 2>/dev/null | head -40 || echo "no docs/pages found"`

## Your task

Turn either:
- the current workstream
- or user-supplied source content such as a pasted paragraph, excerpt, note, or article

into a reusable content pack anchored in the source material.

This skill is for repurposing, not inventing. Start from the source the user supplied in the current turn. If no source text was supplied, fall back to the current conversation. Use code, diffs, touched files, and project docs only when the source is a build conversation and only to confirm or sharpen what the conversation already established.

If `CONTENT_MAP.md` exists, use it before recommending target surfaces. Treat it as the project's canonical map for blog paths, docs paths, landing pages, semantic clusters, pillar pages, FAQ/support surfaces, newsletters, and other content destinations. If it is missing, infer surfaces from the repo for this run and recommend creating it from `templates/artifacts/content_map.md`.

Primary outcome:
- extract the real product/technical signal from the work in progress
- separate documentation output from marketing output
- keep every public claim inside the bounds of what the work actually supports
- convert justified recommendations into actual repository edits when the user asks to apply them
- distribute important product concepts across multiple relevant site surfaces instead of assuming one page will be read

Use this skill when:
- a feature or fix was just designed or implemented
- the team wants docs and marketing to stay faithful to the product reality
- you found a strong paragraph, article excerpt, or source note and want to transform it into new content directions
- you want release-note, FAQ, positioning, or educational angles directly from the source work

Do not use this skill when:
- the goal is net-new copywriting from scratch with heavy web research
- the goal is a full doc audit
- the workstream has too little signal and would force invention
- the user wants code generation, implementation ideas, or architectural design from the source text

If the user clearly wants long-form content or external research, hand off to `sf-redact` or `sf-enrich` after producing the factual source pack.

## Execution contract

This skill has two modes:

- `pack mode`: produce a reusable content pack only.
- `apply mode`: create or update the target files.

Default to `apply mode` when the user says or clearly implies:

- "fais tout ça", "apply", "update the site", "create the article", "write it", "fill the site", "mets-le partout", "add this to docs", "ship the content"
- a target surface is named as an action, such as `article`, `FAQ`, `landing`, `docs`, `README`, or a file path

In `apply mode`, do not stop at a recommendation list. The final answer must identify the files changed and the validations run.

In `pack mode`, keep generated prose concise. Do not draft full articles, full landing sections, or long FAQ answers in chat unless the user asked for a draft-only response. If a target file exists and the user wants action, write the content into the file instead.

If the skill recommends a dedicated article, it must also decide one of:

- create the article/page now because the user asked to apply the recommendations
- defer it explicitly because the repo has no declared surface or the user asked for strategy only
- ask one concise question if creating the surface would require a risky product/SEO decision that cannot be inferred

## Conversation reuse doctrine

Some of the best content is created while explaining the work to the user. Do not discard clear conversational explanations just because they appeared in chat first.

When the conversation contains a sentence, analogy, diagram, list, or troubleshooting explanation that is clearer than a fresh rewrite:

- reuse it verbatim or near-verbatim in the target content when it is accurate and brand-safe
- preserve simple diagrams when they make the workflow easier to understand, but adapt them to the target surface
- turn concise conversational lists into documentation checklists, FAQ answers, or article sections
- keep the same language if the target surface uses that language; otherwise translate the idea, not the awkward phrasing
- avoid copying exploratory or speculative phrasing that was useful in discussion but not safe as product truth

Prefer the clearest wording over novelty. The goal is reusable product clarity, not proving that the same idea can be rewritten again.

For external documentation and marketing pages, avoid terminal blocks, fenced code blocks, or code-looking diagrams unless the content is truly a command/reference page and the code is necessary for the user to act. Prefer editorial layouts: cards, numbered steps, short callouts, prose diagrams, tables, or purpose-built visual components. A diagram that was useful in chat can be reused as structure without being rendered as a terminal.

## Site repetition doctrine

When a source idea is strategically important and public-facing, one page is not enough. Users do not read the whole site in order.

Use repetition deliberately:

- one canonical page or article owns the deep explanation
- the docs overview links to the canonical page
- the FAQ answers the recurring objection or confusion
- the landing page may mention the concept if it supports the public promise
- skill pages or tutorials mention it only when it changes how the workflow should be understood
- README/local docs preserve operational truth for contributors and operators
- `CONTENT_MAP.md` records the cluster and cross-surface update rule

Repeat the same concept with different jobs per surface. Do not duplicate the same paragraph everywhere.

## Core doctrine

Treat the source material as evidence.

Never present:
- roadmap ideas as shipped capabilities
- internal implementation details as user benefits unless the benefit is explicit
- inferred performance/security/compliance claims as confirmed facts
- speculative positioning as product truth
- a third-party author's exact framing as if it were original project language without adaptation

Every important statement must be tagged mentally as one of:
- `confirmed by conversation`
- `confirmed by code`
- `inferred`
- `not safe to publish`

Use `not safe to publish` for any claim about:
- security, privacy, compliance, reliability, AI behavior, automation quality, savings, speed, scale, or business outcomes
- unless the conversation or code gives direct proof

## Source modes

Pick the source in this order:
- `supplied source mode` when the user pasted or quoted text in the request
- `supplied article mode` when the user summarized an article or shared a substantial excerpt
- `workstream mode` when no external source text is provided and the current conversation is the source

If the user provides only a URL and not the content itself:
- fetch it only if the user explicitly wants that
- then treat the fetched page as external source material, not as product truth

## Surface selection

Before choosing output forms, check `CONTENT_MAP.md` when present:
- prefer mapped surfaces over guessed paths
- use declared pillar pages and semantic clusters to place blog/article/FAQ ideas
- use declared cross-surface update rules to identify related docs, landing pages, or support content
- if the map says a surface is missing, report that gap instead of inventing a path
- if the map appears stale or contradicts the repo, mark the target as `needs verification`

## Mode detection

Parse `$ARGUMENTS` as an optional focus override:
- `doc` → prioritize documentation outputs
- `marketing` → prioritize marketing outputs
- `full` or empty → produce both when justified
- `apply`, `site`, `full-site`, `tout`, `tout ça` → apply justified content updates across relevant mapped surfaces
- `release notes`, `faq`, `landing`, `readme`, `changelog` → shape the pack toward that surface
- `newsletter`, `thread`, `post`, `article`, `outline` → shape the pack toward those content forms
- any file/path/page name → bias recommendations toward that target surface

If no usable source can be inferred from the request or conversation, ask one concise question to recover the source material before continuing.

## Workflow

### Phase 1 — Reconstruct the source truth

When the source is a build conversation, extract:
- the problem being solved
- the user or operator pain point
- the chosen approach
- the alternatives or tradeoffs discussed
- the observable outcome
- any limits, caveats, or follow-up work

When the source is supplied text, extract:
- the core idea
- the central claim or thesis
- the audience implied by the text
- the useful framing, analogy, or insight
- the parts worth keeping, reframing, or discarding
- any statements that are too generic, derivative, risky, or ungrounded

Then:
- for build-conversation sources, inspect the most relevant changed files or mentioned files only as needed to validate behavior and claims
- for supplied-text sources, stay anchored to the text itself unless the user explicitly asks for outside validation

### Phase 2 — Decide which outputs are justified

Choose outputs based on signal strength, not habit.

Produce documentation output when the workstream contains:
- behavior changes
- setup, workflow, API, or UX changes
- constraints, edge cases, or operational guidance
- internal knowledge worth preserving

Produce documentation-style content from supplied text when the source contains:
- a reusable explanation
- a framework, method, or concept worth teaching
- material that can become FAQ, guide notes, or educational structure

Produce marketing output when the workstream contains:
- a clear user benefit
- a friction removed
- a meaningful simplification
- a differentiating design or workflow choice
- a strong build story worth sharing

Produce marketing output from supplied text when the source contains:
- a strong hook
- a contrarian or memorable angle
- a useful belief shift
- a message that can be adapted into brand-safe positioning

Produce both when both are well-supported.

If one side is weak:
- reduce it sharply
- or omit it entirely
- do not pad the output with generic filler

For site-facing content, classify each justified output as:

- `must write`: required to make the site/docs coherent after this work
- `should write`: strong SEO, onboarding, FAQ, or conversion surface
- `optional`: useful angle but not necessary now
- `do not write`: too speculative, duplicate, or unsupported

In `apply mode`, write every `must write` item and every `should write` item unless the surface is missing or unsafe. Optional items can be reported as follow-up.

### Phase 2.5 — Plan the diffusion map

Before writing, produce a compact internal diffusion map:

- canonical surface: the one page/article that owns the full explanation
- supporting surfaces: docs, FAQ, README, local docs, landing, skill page, or changelog
- repeated concept: the short message that should recur
- per-surface job: why each surface needs a different version
- surfaces intentionally skipped: with reason

If `CONTENT_MAP.md` exists, update it when a new recurring topic, article, pillar page, or cross-surface rule is created.

### Phase 3 — Build the structured pack

Use the standard pack from [references/output-pack.md](references/output-pack.md).

Default sections:
- `Build Summary`
- `Source Analysis`
- `Product Documentation Notes`
- `Internal Change Narrative`
- `Marketing Claims`
- `Content Angles`
- `Evidence Ledger`

Adapt the pack to the request:
- for `doc`, expand doc notes and compress marketing
- for `marketing`, expand claims and angles but keep the evidence ledger strict
- for `release notes` or `changelog`, emphasize externally understandable change narrative
- for `faq` or `landing`, convert proven facts into reusable answer blocks or copy hooks
- for supplied text, replace build-specific sections with source-specific reframing where needed

In `apply mode`, the pack is an intermediate planning artifact, not the final deliverable. Use it to guide edits, then write the content into the repository. The final response should summarize the applied pack; it should not include a long unused content plan.

### Phase 4 — Safety pass

Before finalizing:
- remove claims that depend on unstated assumptions
- downgrade any unproven statement from fact to hypothesis
- separate internal implementation detail from user-facing value
- note docs or copy surfaces that should be updated, but are not yet updated
- avoid reproducing the source too closely; transform it into fresh structure, angles, and wording

In `apply mode`, also verify that every recommended `must write` and `should write` surface is either:

- updated
- explicitly deferred with a concrete reason
- blocked by a missing or ambiguous content surface

## Output rules

The output must be directly reusable. Prefer short blocks over essay-style prose.

Required behavior:
- clearly separate documentation material from marketing material
- make uncertainty explicit
- keep language specific and concrete
- preserve the project's actual terminology from docs/code when known
- avoid hype words unless already grounded in the project's brand voice
- for third-party source text, identify what is reusable as an idea versus what should not be echoed directly
- when in `apply mode`, avoid verbose "content ideas" in the final answer; report the files changed, the concept placement, validation, and any deferred surfaces

If the work is mostly internal:
- emphasize internal docs, release notes, support notes, and changelog material
- keep public-facing claims minimal

If the work is strongly user-facing:
- provide both a factual doc block and a careful marketing block

If the source is external content:
- analyze the source before proposing repurposing paths
- identify the most relevant target outputs instead of forcing the full pack
- prefer reframing, angle extraction, summaries, outlines, FAQ ideas, and content hooks over near-paraphrase

## Recommended transformations

Translate implementation work into higher-level assets carefully:

- bug fix → support note, release note, FAQ entry, "what changed" snippet
- feature addition → user-facing doc note, changelog entry, value proposition bullets, launch angles
- refactor → internal architecture note, maintainability rationale, limited external copy only if user benefit is explicit
- workflow improvement → onboarding update, operator note, productivity claim only if justified

Translate supplied source content into higher-level assets carefully:

- paragraph or insight → hooks, headline variants, post angles, FAQ prompts, section outlines
- article excerpt → summary, thesis extraction, counter-angle, newsletter note, educational reframing
- concept note → glossary entry, explainer structure, landing-page supporting argument, nurture content angle

## Good output characteristics

Strong output from this skill:
- sounds like it comes from the product truth, not from generic marketing instinct
- or, for supplied text, sounds like an intelligent transformation of the source rather than a rewrite clone
- helps a human immediately update docs, release notes, landing copy, or support material
- is safe to publish because evidence and uncertainty are visible
- in `apply mode`, leaves the repo more complete than the chat transcript: the article/page exists, internal links exist, and the content map knows about the topic

Weak output from this skill:
- repeats generic benefits like "faster", "more robust", "streamlined"
- over-explains internal code without translating it into user impact
- invents positioning that the workstream did not support
- recommends several content assets but creates none after the user asked to apply them
- writes one isolated page while leaving obvious site entry points, FAQ links, or content map updates untouched
- paraphrases a source article too closely without adding framing or adaptation value

## Handoff rules

When this skill finishes:
- if the user wants polished docs, route the best doc sections into `sf-docs`
- if the user wants public copy or long-form content, route the proven marketing sections into `sf-redact`
- if the user wants current stats, market context, or external validation, route into `sf-enrich`

The key output of this skill is the source pack those downstream tasks can trust.
