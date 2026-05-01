---
artifact: spec
metadata_schema_version: "1.0"
artifact_version: "0.1.0"
project: "ShipFlow"
created: "2026-05-01"
created_at: "2026-05-01 09:32:35 UTC"
updated: "2026-05-01"
updated_at: "2026-05-01 09:52:55 UTC"
status: draft
source_skill: sf-spec
source_model: "GPT-5 Codex"
scope: feature
owner: Diane
confidence: high
user_story: "En tant qu'utilisatrice ShipFlow qui délègue l'exécution à des agents, je veux que ShipFlow génère et maintienne une documentation technique proche du code, afin que les agents sachent rapidement quoi lire, quoi modifier, quoi valider et quelles docs mettre à jour sans redécouvrir le repo à chaque chantier."
risk_level: high
security_impact: yes
docs_impact: yes
linked_systems:
  - AGENT.md
  - CLAUDE.md
  - CONTEXT.md
  - CONTEXT-FUNCTION-TREE.md
  - ARCHITECTURE.md
  - GUIDELINES.md
  - README.md
  - shipflow-spec-driven-workflow.md
  - shipflow-metadata-migration-guide.md
  - docs/technical/
  - skills/sf-docs/SKILL.md
  - skills/references/
  - templates/artifacts/
  - tools/shipflow_metadata_lint.py
  - tools/codebase-mcp/
  - local/
depends_on:
  - artifact: "AGENT.md"
    artifact_version: "0.3.0"
    required_status: draft
  - artifact: "ARCHITECTURE.md"
    artifact_version: "1.0.0"
    required_status: reviewed
  - artifact: "CONTEXT.md"
    artifact_version: "0.2.0"
    required_status: draft
  - artifact: "CONTEXT-FUNCTION-TREE.md"
    artifact_version: "0.1.0"
    required_status: draft
  - artifact: "GUIDELINES.md"
    artifact_version: "1.2.0"
    required_status: reviewed
  - artifact: "README.md"
    artifact_version: "0.1.0"
    required_status: draft
  - artifact: "shipflow-spec-driven-workflow.md"
    artifact_version: "0.4.0"
    required_status: draft
  - artifact: "shipflow-metadata-migration-guide.md"
    artifact_version: "0.2.0"
    required_status: draft
  - artifact: "skills/references/canonical-paths.md"
    artifact_version: "1.0.0"
    required_status: active
  - artifact: "skills/references/chantier-tracking.md"
    artifact_version: "0.1.0"
    required_status: draft
supersedes: []
evidence:
  - "Exploration subagent Euclid, 2026-05-01: ShipFlow has strong agent/workflow documentation but lacks a canonical docs/technical layer and code-docs map."
  - "Spec drafting subagent Ohm, 2026-05-01: proposed a full implementation plan with sequential foundations, disjoint technical-doc waves, and final sequential integration."
  - "Local inventory: AGENT.md, CLAUDE.md, CONTEXT.md, CONTEXT-FUNCTION-TREE.md, ARCHITECTURE.md, GUIDELINES.md, README.md, shipflow-spec-driven-workflow.md, shipflow-metadata-migration-guide.md, skills/references, templates/artifacts, tools/codebase-mcp, and local/README.md."
  - "Fresh-docs checked: OpenAI Codex AGENTS.md guide, Anthropic Claude Code memory and best practices, GitHub Copilot custom instructions, agents.md, llms.txt, and ADR references."
next_step: "/sf-spec ShipFlow Technical Documentation Layer for AI Agents"
---

## Title

ShipFlow Technical Documentation Layer for AI Agents

## Status

Draft.

This is a new chantier, distinct from `specs/sf-build-autonomous-master-skill.md`, but compatible with it. The chantier creates the durable technical documentation layer that Readers, Executors, Integrators, and ShipFlow skills use when code changes.

## User Story

En tant qu'utilisatrice ShipFlow qui délègue l'exécution à des agents, je veux que ShipFlow génère et maintienne une documentation technique proche du code, afin que les agents sachent rapidement quoi lire, quoi modifier, quoi valider et quelles docs mettre à jour sans redécouvrir le repo à chaque chantier.

The expected value is lower context pollution in the main conversation, less repo rediscovery for fresh agents, fewer code/documentation drift risks, and fewer edit-conflict risks when multiple agents participate in a chantier.

## Minimal Behavior Contract

ShipFlow must provide a code-proximate technical documentation layer: `docs/technical/` contains an agent-readable index, `docs/technical/code-docs-map.md` maps code areas to their technical docs and maintenance triggers, each major subsystem has either a dedicated technical doc or an explicit non-coverage reason, and `sf-docs` can generate or audit the layer. When code changes, the Reader produces a `Documentation Update Plan` from the map, but the Reader does not become the primary docs executor; an executor or integrator applies updates sequentially by default, with parallel work allowed only when a spec defines disjoint file ownership. The easy-to-miss edge case is shared documentation such as `code-docs-map.md`: even if subsystem docs can be parallelized, shared maps and final integration must stay sequential.

## Success Behavior

- Given a fresh agent receives a task touching `lib.sh`, `local/`, `skills/`, `templates/`, `tools/`, or `site/`, when it opens `docs/technical/code-docs-map.md`, then it can identify the primary technical doc, related docs, validation checks, and documentation update trigger for that code area.
- Given a wave or cycle ends, when the Reader reviews changed paths, then it produces a `Documentation Update Plan` that lists impacted docs, reason, priority, required action, owner role, and whether the action is parallel-safe.
- Given `sf-docs` runs in technical-docs mode, when it scans the repo, then it can scaffold missing technical docs or audit existing docs for stale file references, missing validations, missing maintenance rules, and uncovered major subsystems.
- Given an agent opens `AGENT.md`, `CLAUDE.md`, or a future `AGENTS.md`, then it finds a short pointer to the technical layer rather than a large copied technical guide.

## Error Behavior

- If a code change touches a mapped code area and no impacted doc appears in the `Documentation Update Plan`, the gate reports a docs-planning failure.
- If a technical doc references a missing file, missing command, or stale invariant, `sf-docs audit` or the implementation review reports it as stale.
- If an agent attempts parallel edits on shared files such as `docs/technical/code-docs-map.md`, `AGENT.md`, `CONTEXT.md`, `GUIDELINES.md`, or `shipflow-spec-driven-workflow.md`, the work is blocked or rerouted to sequential integration.
- If the Reader edits docs directly outside an explicit assignment, the workflow treats that as role misuse.
- If a technical doc includes secrets, tokens, private credentials, sensitive logs, or contradictory agent instructions, verification fails and the content must be removed.
- If a new technical artifact type is introduced without metadata-linter compatibility or an explicit non-linted decision, the implementation remains incomplete.

## Problem

ShipFlow already has strong orientation and workflow documentation:

- `AGENT.md` points agents toward the right documents.
- `CLAUDE.md` gives compact working rules and commands.
- `CONTEXT.md` maps the repo, entrypoints, and hotspots.
- `CONTEXT-FUNCTION-TREE.md` helps navigate major shell functions.
- `ARCHITECTURE.md` describes system structure, boundaries, and invariants.
- `GUIDELINES.md` describes technical patterns and anti-patterns.
- `shipflow-spec-driven-workflow.md` describes the spec-first doctrine.
- `shipflow-metadata-migration-guide.md` documents artifact metadata and frontmatter.
- `skills/references/*.md` contains specialized operational references.
- `templates/artifacts/*.md` contains artifact templates.
- `tools/codebase-mcp/README.md`, `tools/codebase-mcp/TIPS.md`, and `local/README.md` document specific subsystems.

The gap is that this documentation is fragmented and mostly macro-level. It orients agents, but it does not systematically answer: which technical doc follows which code area, which invariants belong to a subsystem, which validations are required, which docs must be checked after a code change, and which docs are shared enough to forbid parallel edits.

## Solution

Create a canonical technical documentation layer:

```text
docs/technical/
  README.md
  code-docs-map.md
  runtime-cli.md
  local-tunnels-and-mcp-login.md
  skill-runtime-and-lifecycle.md
  artifact-metadata-and-linter.md
  codebase-mcp.md
  public-site-and-content-runtime.md
  installer-and-user-scope.md
  decisions.md
```

Add two supporting artifacts:

```text
templates/artifacts/technical_module_context.md
skills/references/technical-docs-corpus.md
```

Then connect the layer to the existing workflow by updating `skills/sf-docs/SKILL.md`, `AGENT.md`, `CONTEXT.md`, `README.md`, `shipflow-spec-driven-workflow.md`, `GUIDELINES.md`, and `tools/shipflow_metadata_lint.py` only if the new artifact type needs linter support.

The external research supports this direction:

- OpenAI Codex documents `AGENTS.md` as repo-level instructions for agents, including navigation, conventions, commands, and checks.
- Anthropic Claude Code recommends concise, specific memory files, with large or specialized details moved into scoped files, and recommends subagents for investigation to keep main context clean.
- GitHub Copilot documents repository-wide, path-specific, and agent instruction files, and recommends project structure, conventions, tool versions, and build/test details.
- `agents.md` encourages root and nested `AGENTS.md` files for large repos.
- `llms.txt` proposes a concise Markdown index of LLM-useful resources, most relevant for public web docs.
- ADR references support keeping decision rationale separate from operational technical docs.

## Scope In

- Create the official taxonomy for ShipFlow code-proximate technical docs.
- Create `docs/technical/README.md`.
- Create `docs/technical/code-docs-map.md`.
- Create initial subsystem docs for runtime CLI, local tunnels and MCP login, skill runtime and lifecycle, artifact metadata and linter, codebase MCP, public site and content runtime, installer and user scope, and decisions.
- Create `templates/artifacts/technical_module_context.md`.
- Create `skills/references/technical-docs-corpus.md`.
- Add a technical-docs generation/audit contract to `skills/sf-docs/SKILL.md`.
- Connect the technical layer to the Reader and the `Documentation Update Gate`.
- Define the standard `Documentation Update Plan` output.
- Define safe execution waves and explicit no-overlap rules for any parallel work.
- Decide whether `AGENTS.md` should be created in this chantier, generated from `AGENT.md`, or deferred.

## Scope Out

- Rewriting all product, business, GTM, FAQ, or content documentation.
- Migrating all of `archive/` or `research/`.
- Creating one technical doc per file across the whole repo.
- Turning `CLAUDE.md`, `AGENT.md`, or a future `AGENTS.md` into a mega-doc.
- Making the Reader the primary executor for documentation edits.
- Allowing parallel edits without spec-defined disjoint ownership.
- Publishing internal technical details to the public site without an explicit review.
- Replacing chantier specs or ADRs with technical docs.

## Constraints

- Sequential by default for shared files and final integration.
- Parallelism only when a spec defines disjoint file ownership and no shared outputs.
- The Reader diagnoses documentation impact; an executor or integrator applies updates.
- Technical docs must stay close to code but must not paste large code blocks.
- Technical docs must be more durable than chantier specs.
- Agent entry files must stay short.
- Code remains the final source of truth for behavior.
- Docs must contain no secrets and no private credentials.
- Docs must not introduce instructions that conflict with system, developer, skill, or active spec instructions.
- ShipFlow-owned paths must follow `skills/references/canonical-paths.md`.
- New artifact types must be linter-compatible or explicitly documented as non-linted.
- The implementation must preserve unrelated dirty worktree changes.

## Dependencies

Local docs to inspect before implementation:

- `AGENT.md`
- `CLAUDE.md`
- `CONTEXT.md`
- `CONTEXT-FUNCTION-TREE.md`
- `ARCHITECTURE.md`
- `GUIDELINES.md`
- `README.md`
- `shipflow-spec-driven-workflow.md`
- `shipflow-metadata-migration-guide.md`
- `skills/references/canonical-paths.md`
- `skills/references/chantier-tracking.md`
- `skills/references/docs-freshness.md`
- `templates/artifacts/*.md`
- `tools/codebase-mcp/README.md`
- `tools/codebase-mcp/TIPS.md`
- `local/README.md`

Code to inspect before writing subsystem docs:

- `shipflow.sh`
- `lib.sh`
- `config.sh`
- `install.sh`
- `local/`
- `skills/*/SKILL.md`
- `skills/references/`
- `templates/artifacts/`
- `tools/shipflow_metadata_lint.py`
- `tools/codebase-mcp/`
- `site/`

Fresh external docs checked:

- OpenAI Codex AGENTS.md guide: `https://developers.openai.com/codex/guides/agents-md`
- Anthropic Claude Code memory: `https://code.claude.com/docs/en/memory`
- Anthropic Claude Code best practices: `https://code.claude.com/docs/en/best-practices`
- GitHub Copilot custom instructions: `https://docs.github.com/en/copilot/concepts/prompting/response-customization`
- agents.md: `https://agents.md/`
- llms.txt: `https://llmstxt.org/`
- ADR: `https://adr.github.io/`

Verdict: fresh-docs checked.

## Invariants

- Specs document chantiers; technical docs document durable subsystems.
- `ARCHITECTURE.md` remains the global system view.
- `CONTEXT.md` remains the operational map.
- `GUIDELINES.md` remains the general technical doctrine.
- `docs/technical/` becomes the code-proximate documentation layer.
- `docs/technical/code-docs-map.md` becomes the canonical code-to-docs index.
- The Reader produces diagnostics, not the main documentation edits.
- Shared files are edited sequentially.
- Any parallel doc work touches only exclusive files and is authorized by a spec.
- Every technical doc includes a maintenance rule and validation strategy.
- Public docs do not expose sensitive internal details.

## Links & Consequences

Positive consequences:

- Fresh agents can understand a code area with less context.
- Subagents can be used more often while keeping the main conversation clean.
- Readers can produce precise documentation update plans.
- Executors receive clearer validation expectations.
- Specs can focus on chantier decisions rather than repeatedly rediscovering the repo.

Costs and side effects:

- A new documentation layer must be maintained.
- `docs/technical/` could duplicate `ARCHITECTURE.md`, `CONTEXT.md`, or `GUIDELINES.md` if boundaries are not enforced.
- `code-docs-map.md` becomes a shared high-conflict file and must be protected by sequential integration.
- `sf-docs` gains additional responsibility and must stay simple enough to be reliable.
- Internal technical docs may need a public/private boundary if reused by the site.

## Documentation Coherence

Use this durable split:

- `README.md`: user/project overview.
- `AGENT.md` or `AGENTS.md`: short agent entrypoint.
- `CLAUDE.md`: compact Claude/Codex operating rules.
- `ARCHITECTURE.md`: global architecture and system boundaries.
- `CONTEXT.md`: operational navigation map.
- `CONTEXT-FUNCTION-TREE.md`: function map for large scripts.
- `GUIDELINES.md`: general technical doctrine.
- `shipflow-spec-driven-workflow.md`: spec-first workflow.
- `specs/*.md`: chantier specs.
- `docs/technical/*.md`: durable subsystem docs.
- `docs/technical/code-docs-map.md`: code paths to docs, validations, and triggers.
- `templates/artifacts/technical_module_context.md`: template for new subsystem docs.
- `skills/references/technical-docs-corpus.md`: skill-facing reference for loading the technical layer.

Anti-duplication rules:

- A technical doc may link to `ARCHITECTURE.md`, but must not copy the whole architecture.
- A technical doc may link to a spec, but must not preserve chantier history.
- An agent entry file may link to a technical doc, but must not reproduce detailed subsystem content.
- `code-docs-map.md` points to docs; it does not contain all technical substance.

Freshness rules:

- Every technical doc has a `Maintenance Rule`.
- Every `code-docs-map.md` entry has a docs update trigger.
- Any mapped code change requires either a documentation update or a written no-impact justification.

## Edge Cases

- A change touches multiple subsystems: the Reader emits multiple `Documentation Update Plan` entries.
- A change touches an uncovered area: the Reader flags a `code-docs-map.md` gap.
- A technical doc exists but its owned file was renamed: `sf-docs audit` reports stale ownership.
- An executor changes code and its matching technical doc in the same sequential task: allowed when scoped and validated.
- Multiple subsystem docs are created in parallel: allowed only after foundation files exist and only with one exclusive doc file per executor.
- Two agents need to edit `code-docs-map.md`: sequential integration only.
- `AGENT.md` and `AGENTS.md` diverge: the implementation must define a source-of-truth or sync rule before completion.
- `CLAUDE.md` grows too large: details move to `docs/technical/` or `skills/references/`.
- A technical doc contains public-site-sensitive internals: create a filtered public version or keep it internal.
- An urgent code change lands while docs are stale: the gate records the stale doc and requires explicit follow-up ownership.

## Implementation Tasks

- [ ] Task 1: Create the technical documentation index.
  - Fichier : `docs/technical/README.md`
  - Action : Create the index of code-proximate technical docs and describe when agents should open each doc.
  - User story link : Helps a fresh agent find the correct subsystem docs quickly.
  - Depends on : Read `AGENT.md`, `CONTEXT.md`, `ARCHITECTURE.md`, and `GUIDELINES.md`.
  - Validate with : `rg -n "code-docs-map|runtime-cli|skill-runtime|artifact-metadata|installer" docs/technical/README.md`
  - Notes : Keep this as an index, not a mega-doc.

- [ ] Task 2: Create the canonical code-to-docs map.
  - Fichier : `docs/technical/code-docs-map.md`
  - Action : Map code path patterns to subsystem, primary technical doc, secondary docs, required validation, and docs update trigger.
  - User story link : Enables the Reader to produce a precise `Documentation Update Plan`.
  - Depends on : Task 1.
  - Validate with : `rg -n "Path pattern|Primary technical doc|Docs update trigger|lib.sh|skills/|templates/|tools/" docs/technical/code-docs-map.md`
  - Notes : Shared critical file; sequential edits only.

- [ ] Task 3: Create the technical module template.
  - Fichier : `templates/artifacts/technical_module_context.md`
  - Action : Add the standard template for subsystem technical docs.
  - User story link : Standardizes code-proximate docs for reliable agent consumption.
  - Depends on : Task 1 plus review of `templates/artifacts/*.md` and `shipflow-metadata-migration-guide.md`.
  - Validate with : `rg -n "Purpose|Owned files|Entrypoints|Invariants|Validation|Maintenance Rule|Reader checklist" templates/artifacts/technical_module_context.md`
  - Notes : Decide whether this template needs metadata-linter support.

- [ ] Task 4: Create the skill-facing technical docs corpus reference.
  - Fichier : `skills/references/technical-docs-corpus.md`
  - Action : Explain how skills should load and use `docs/technical/`, `code-docs-map.md`, and the template.
  - User story link : Lets ShipFlow skills use technical docs without polluting context.
  - Depends on : Tasks 1, 2, and 3.
  - Validate with : `rg -n "sf-docs|Reader|Documentation Update Plan|code-docs-map|technical_module_context" skills/references/technical-docs-corpus.md`
  - Notes : Keep it operational and concise.

- [ ] Task 5: Document runtime CLI.
  - Fichier : `docs/technical/runtime-cli.md`
  - Action : Document `shipflow.sh`, `lib.sh`, `config.sh`, entrypoints, flows, invariants, side effects, and validations.
  - User story link : Allows executors to modify the CLI runtime without rediscovering core shell behavior.
  - Depends on : Task 3 and reading `CONTEXT-FUNCTION-TREE.md`.
  - Validate with : `rg -n "shipflow.sh|lib.sh|config.sh|Entrypoints|Invariants|Validation|Maintenance Rule" docs/technical/runtime-cli.md`
  - Notes : Link to `CONTEXT-FUNCTION-TREE.md`; do not copy the full function tree.

- [ ] Task 6: Document local tunnels and MCP login.
  - Fichier : `docs/technical/local-tunnels-and-mcp-login.md`
  - Action : Document `local/`, tunnels, remote helpers, and MCP login flows.
  - User story link : Reduces risk when editing local tunnel and OAuth/MCP flows.
  - Depends on : Task 3 and reading `local/README.md` plus `local/`.
  - Validate with : `rg -n "local/|MCP|OAuth|tunnel|remote|Validation|Maintenance Rule" docs/technical/local-tunnels-and-mcp-login.md`
  - Notes : Do not include secrets or private URLs.

- [ ] Task 7: Document skill runtime and lifecycle.
  - Fichier : `docs/technical/skill-runtime-and-lifecycle.md`
  - Action : Document `SKILL.md` files, references, templates, lifecycle skills, role boundaries, and documentation gates.
  - User story link : Allows agents to modify skills without breaking ShipFlow doctrine.
  - Depends on : Tasks 3 and 4 plus reading `skills/*/SKILL.md`, `skills/references/`, and `shipflow-spec-driven-workflow.md`.
  - Validate with : `rg -n "SKILL.md|sf-spec|sf-start|sf-ready|sf-verify|references|lifecycle|Maintenance Rule" docs/technical/skill-runtime-and-lifecycle.md`
  - Notes : Must include Reader diagnoses, executor/integrator applies.

- [ ] Task 8: Document artifact metadata and linter.
  - Fichier : `docs/technical/artifact-metadata-and-linter.md`
  - Action : Document artifact frontmatter, templates, metadata schema, and `tools/shipflow_metadata_lint.py`.
  - User story link : Lets agents create or modify artifacts without breaking metadata validation.
  - Depends on : Task 3 and reading `shipflow-metadata-migration-guide.md`, `templates/artifacts/`, and `tools/shipflow_metadata_lint.py`.
  - Validate with : `rg -n "metadata|frontmatter|artifact|template|shipflow_metadata_lint|Validation|Maintenance Rule" docs/technical/artifact-metadata-and-linter.md`
  - Notes : Decide whether `technical_module_context` becomes a linted artifact type.

- [ ] Task 9: Document codebase MCP.
  - Fichier : `docs/technical/codebase-mcp.md`
  - Action : Document the codebase MCP server, file ownership, runtime role, validations, and limits.
  - User story link : Lets agents modify or use the MCP server with less rediscovery.
  - Depends on : Task 3 and reading `tools/codebase-mcp/README.md`, `tools/codebase-mcp/TIPS.md`, and `tools/codebase-mcp/`.
  - Validate with : `rg -n "codebase-mcp|MCP|README|TIPS|Validation|Maintenance Rule" docs/technical/codebase-mcp.md`
  - Notes : Summarize and link; do not duplicate the whole README.

- [ ] Task 10: Document public site and content runtime.
  - Fichier : `docs/technical/public-site-and-content-runtime.md`
  - Action : Document `site/`, public content, published skills, and public/private documentation boundaries.
  - User story link : Prevents agents from confusing internal technical docs and public content.
  - Depends on : Task 3 plus reading `site/`, `CONTENT_MAP.md`, and `README.md`.
  - Validate with : `rg -n "site/|content|public|skills|Validation|Maintenance Rule|internal" docs/technical/public-site-and-content-runtime.md`
  - Notes : Include an explicit internal-information leak guard.

- [ ] Task 11: Document installer and user scope.
  - Fichier : `docs/technical/installer-and-user-scope.md`
  - Action : Document `install.sh`, user/root scope, symlinks, installed paths, and non-destructive validation.
  - User story link : Reduces risk when changing install behavior.
  - Depends on : Task 3 plus reading `install.sh`, `README.md`, and `GUIDELINES.md`.
  - Validate with : `rg -n "install.sh|user|root|symlink|scope|Validation|Maintenance Rule" docs/technical/installer-and-user-scope.md`
  - Notes : Include command safety expectations.

- [ ] Task 12: Document decisions bridge.
  - Fichier : `docs/technical/decisions.md`
  - Action : Create an index/bridge for ADRs and durable architectural decisions.
  - User story link : Helps agents distinguish durable decisions, conventions, and chantier-specific choices.
  - Depends on : Task 3 plus reading `templates/artifacts/decision_record.md`, `ARCHITECTURE.md`, and relevant specs.
  - Validate with : `rg -n "ADR|decision|context|consequences|templates/artifacts/decision_record.md" docs/technical/decisions.md`
  - Notes : Index decisions; do not replace ADRs.

- [ ] Task 13: Add technical-docs contract to `sf-docs`.
  - Fichier : `skills/sf-docs/SKILL.md`
  - Action : Add a mode or explicit contract for generating and auditing `docs/technical/`.
  - User story link : Gives ShipFlow an explicit capability for code-proximate documentation maintenance.
  - Depends on : Tasks 1 through 12.
  - Validate with : `rg -n "technical docs|docs/technical|code-docs-map|Documentation Update Plan|technical_module_context" skills/sf-docs/SKILL.md`
  - Notes : Sequential edit; preserve existing skill style.

- [ ] Task 14: Add the short agent entrypoint reference.
  - Fichier : `AGENT.md`
  - Action : Add a concise pointer to `docs/technical/` and `code-docs-map.md`.
  - User story link : Lets agents find the technical layer from the entrypoint.
  - Depends on : Tasks 1 and 2.
  - Validate with : `rg -n "docs/technical|code-docs-map" AGENT.md`
  - Notes : Keep it short.

- [ ] Task 15: Update operational context.
  - Fichier : `CONTEXT.md`
  - Action : Add the new technical-docs layer to the repo navigation model.
  - User story link : Clarifies where to look by task type.
  - Depends on : Tasks 1, 2, and 4.
  - Validate with : `rg -n "docs/technical|code-docs-map|technical docs" CONTEXT.md`
  - Notes : Avoid duplicating `docs/technical/README.md`.

- [ ] Task 16: Add a short README mention.
  - Fichier : `README.md`
  - Action : Briefly mention the technical documentation layer and its role.
  - User story link : Makes the layer discoverable without overloading the main README.
  - Depends on : Task 1.
  - Validate with : `rg -n "technical documentation|docs/technical|documentation technique" README.md`
  - Notes : Keep the section short.

- [ ] Task 17: Update the spec-driven workflow.
  - Fichier : `shipflow-spec-driven-workflow.md`
  - Action : Add the role of technical docs in the spec-first cycle, Reader handoff, executor/integrator updates, and gates.
  - User story link : Formalizes when and how code-proximate docs are updated.
  - Depends on : Tasks 4 and 13.
  - Validate with : `rg -n "Documentation Update Gate|Documentation Update Plan|docs/technical|Reader|executor|integrator" shipflow-spec-driven-workflow.md`
  - Notes : Preserve the user decision that Reader diagnoses and executor/integrator applies.

- [ ] Task 18: Add maintenance rules to guidelines.
  - Fichier : `GUIDELINES.md`
  - Action : Add technical-docs maintenance, anti-duplication, freshness, and no-overlap rules.
  - User story link : Prevents stale docs, mega-docs, and edit conflicts.
  - Depends on : Tasks 1 through 4.
  - Validate with : `rg -n "technical docs|docs/technical|code-docs-map|stale|duplication|sequential" GUIDELINES.md`
  - Notes : Keep the normative tone of the file.

- [ ] Task 19: Review metadata linter compatibility.
  - Fichier : `tools/shipflow_metadata_lint.py`
  - Action : Modify only if needed to recognize the new template or artifact type.
  - User story link : Keeps new artifacts compatible with ShipFlow checks.
  - Depends on : Tasks 3 and 8.
  - Validate with : Existing metadata-lint command if documented; otherwise `python tools/shipflow_metadata_lint.py --help` and the adapted command.
  - Notes : If no code change is needed, document the decision in `docs/technical/artifact-metadata-and-linter.md`.

- [ ] Task 20: Finalize cross-links and integration.
  - Fichier : `docs/technical/code-docs-map.md`, `AGENT.md`, `CONTEXT.md`, `README.md`, `shipflow-spec-driven-workflow.md`, `GUIDELINES.md`
  - Action : Resolve duplicate content, link gaps, stale references, and shared-map accuracy.
  - User story link : Ensures a fresh agent can navigate the full layer without broken links or contradictions.
  - Depends on : All previous tasks.
  - Validate with : `rg -n "TODO|TBD|PLACEHOLDER" docs/technical templates/artifacts skills/references AGENT.md CONTEXT.md README.md shipflow-spec-driven-workflow.md GUIDELINES.md`
  - Notes : Final sequential integration only.

## Acceptance Criteria

- `docs/technical/README.md` exists and lists subsystem technical docs.
- `docs/technical/code-docs-map.md` exists and maps code paths to subsystem docs, validations, and update triggers.
- `templates/artifacts/technical_module_context.md` exists and standardizes technical docs.
- `skills/references/technical-docs-corpus.md` exists and explains how skills should use the layer.
- Each major subsystem has a technical doc or an explicit non-coverage reason.
- Each technical doc includes scope, owned files, entrypoints, invariants, validations, failure modes, security notes, and maintenance rule.
- `sf-docs` can generate or audit technical docs.
- The Reader can produce a `Documentation Update Plan` from `code-docs-map.md`.
- The workflow says explicitly that the Reader diagnoses and an executor/integrator applies updates.
- Shared files are sequential by default.
- Parallel work is limited to spec-defined disjoint files.
- `AGENT.md`, `CONTEXT.md`, `README.md`, `shipflow-spec-driven-workflow.md`, and `GUIDELINES.md` point to the layer without becoming mega-docs.
- No secrets or sensitive internal details are added to docs.
- External sources are summarized and linked without long copied passages.
- The chantier passes `/sf-ready` before implementation.

## Test Strategy

Structural checks:

- `test -f docs/technical/README.md`
- `test -f docs/technical/code-docs-map.md`
- `test -f templates/artifacts/technical_module_context.md`
- `test -f skills/references/technical-docs-corpus.md`
- `rg -n "Maintenance Rule|Validation|Owned files|Entrypoints" docs/technical templates/artifacts/technical_module_context.md`

Coherence checks:

- `rg -n "TODO|TBD|PLACEHOLDER" docs/technical templates/artifacts skills/references`
- Compare `docs/technical/code-docs-map.md` against real repo top-level areas.
- Check that every major area has a primary doc or a reason for non-coverage.
- Check that entrypoint docs link to `docs/technical/` without duplicating it.

Skill/workflow checks:

- `rg -n "technical docs|docs/technical|code-docs-map|Documentation Update Plan" skills/sf-docs/SKILL.md shipflow-spec-driven-workflow.md`
- Confirm the Reader role is diagnostic and not the main docs executor.
- Confirm the spec-gated parallelism rule is present.

Security checks:

- `rg -n "token|secret|password|api[_-]?key|credential" docs/technical`
- Manually review any matches to ensure they are generic warnings, not real secrets.
- Verify public-site docs do not expose internal-only technical detail.

Reader simulation:

- Given a fictive diff on `lib.sh`, the Reader should identify `docs/technical/runtime-cli.md` and `docs/technical/code-docs-map.md`.
- Given a fictive diff on `skills/sf-docs/SKILL.md`, the Reader should identify `docs/technical/skill-runtime-and-lifecycle.md`, `skills/references/technical-docs-corpus.md`, and possibly `shipflow-spec-driven-workflow.md`.
- Given a fictive diff on `local/`, the Reader should identify `docs/technical/local-tunnels-and-mcp-login.md`.
- Given a fictive diff on `tools/shipflow_metadata_lint.py`, the Reader should identify `docs/technical/artifact-metadata-and-linter.md`.

## Risks

- Documentation drift if the gate is not enforced.
- Context bloat if docs become too long or too numerous.
- Duplication with `ARCHITECTURE.md`, `CONTEXT.md`, or `GUIDELINES.md`.
- False confidence if a doc is readable but wrong.
- Edit conflicts on shared docs, especially `code-docs-map.md`.
- Sensitive internal details leaking into public docs.
- Contradictory agent instructions inside technical docs.
- Parallelism abuse when subsystem docs look disjoint but final links and maps are shared.
- Metadata-linter incompatibility if a new artifact type is introduced casually.
- `AGENT.md` / `AGENTS.md` divergence without a source-of-truth decision.

## Execution Notes

Dependency graph:

```text
Foundation sequential:
  Task 1 -> Task 2 -> Task 3 -> Task 4

Subsystem docs:
  Task 5
  Task 6
  Task 7
  Task 8
  Task 9
  Task 10
  Task 11
  Task 12

Skill/workflow integration:
  Task 13 -> Task 17
  Task 14 -> Task 15 -> Task 16
  Task 18
  Task 19

Final integration:
  Task 20
```

Safe waves, only after `/sf-ready`:

- Wave 0, sequential foundation: `docs/technical/README.md`, `docs/technical/code-docs-map.md`, `templates/artifacts/technical_module_context.md`, `skills/references/technical-docs-corpus.md`.
- Wave 1, parallel only if each executor owns one file: `docs/technical/runtime-cli.md`, `docs/technical/local-tunnels-and-mcp-login.md`, `docs/technical/installer-and-user-scope.md`.
- Wave 2, parallel only if each executor owns one file: `docs/technical/skill-runtime-and-lifecycle.md`, `docs/technical/artifact-metadata-and-linter.md`, `docs/technical/codebase-mcp.md`, `docs/technical/public-site-and-content-runtime.md`, `docs/technical/decisions.md`.
- Wave 3, sequential integration: `skills/sf-docs/SKILL.md`, `AGENT.md`, `CONTEXT.md`, `README.md`, `shipflow-spec-driven-workflow.md`, `GUIDELINES.md`, and `tools/shipflow_metadata_lint.py` if needed.
- Wave 4, sequential final gate: cross-links, final `code-docs-map.md`, metadata lint, docs audit, and lifecycle verification.

`Documentation Update Plan` format:

```markdown
## Documentation Update Plan

- Code changed: `path/or/pattern`
- Subsystem: `name`
- Primary technical doc: `docs/technical/example.md`
- Secondary docs: `...`
- Required action: `none | review | update | create`
- Priority: `low | medium | high`
- Reason: `why this doc is impacted`
- Owner role: `executor | integrator`
- Parallel-safe: `yes | no`
- Notes: `constraints or blockers`
```

## Open Questions

- Should this chantier create `AGENTS.md`, only document the decision, or defer it to a separate spec?
- If `AGENTS.md` is created, should it be source of truth, generated from `AGENT.md`, or maintained as a short compatibility file?
- Should `technical_module_context` become a linted artifact type in the first implementation?
- Should `docs/technical/decisions.md` only index ADRs, or also define a future ADR naming convention?
- Should any technical docs be published in filtered form, or should `docs/technical/` remain internal?
- Should the Reader produce a `Documentation Update Plan` at every wave, at every cycle, or only before final verification?
- What is the explicit policy when a technical doc is stale but an urgent code change must ship?
- Should technical docs include `last_verified_against`, or would that create too much metadata maintenance?

## Skill Run History

| Date UTC | Skill | Model | Action | Result | Next step |
|----------|-------|-------|--------|--------|-----------|
| 2026-05-01 09:32:35 UTC | sf-spec | GPT-5 Codex | Created a new chantier spec from user request, delegated exploration, delegated spec drafting, and normalized the final spec. | Draft spec created at `specs/shipflow-technical-documentation-layer-for-ai-agents.md`. | `/sf-ready ShipFlow Technical Documentation Layer for AI Agents` |
| 2026-05-01 09:52:55 UTC | sf-ready | GPT-5 Codex | Evaluated the readiness gate for structure, metadata, user-story alignment, freshness, adversarial gaps, security, execution notes, and open questions. | Not ready: open questions still change scope, workflow, and security decisions; `skills/references/docs-freshness.md` is a missing dependency reference. | `/sf-spec ShipFlow Technical Documentation Layer for AI Agents` |

## Current Chantier Flow

```text
sf-spec: done, draft spec created
sf-ready: not ready, blocking questions returned
sf-start: blocked
sf-verify: pending
sf-end: pending
sf-ship: pending
```

Current state:

- Chantier identified: yes.
- Implementation started: no.
- Spec path: `specs/shipflow-technical-documentation-layer-for-ai-agents.md`.
- Required next step: `/sf-spec ShipFlow Technical Documentation Layer for AI Agents`.
- Execution rule: sequential by default; parallel only for spec-defined disjoint files after foundation.
