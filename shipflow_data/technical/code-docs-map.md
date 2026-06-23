---
artifact: technical_module_context
metadata_schema_version: "1.0"
artifact_version: "1.5.0"
project: ShipFlow
created: "2026-05-01"
updated: "2026-06-11"
status: reviewed
source_skill: 102-sf-start
scope: code-docs-map
owner: Diane
confidence: high
risk_level: high
security_impact: yes
docs_impact: yes
linked_systems:
  - shipflow_data/technical/
  - skills/references/technical-docs-corpus.md
  - shipflow-spec-driven-workflow.md
depends_on:
  - artifact: "shipflow_data/technical/README.md"
    artifact_version: "1.0.0"
    required_status: reviewed
supersedes: []
evidence:
  - "Repository inventory and ready spec task map."
  - "Menu frontend variants mapped to runtime CLI docs after grouped root menu change."
  - "Project governance layout decision moved root governance docs to canonical shipflow_data/ paths."
  - "ShipFlow remote bootstrap script added to installer mapping."
  - "External platform corpus and project platform usage template added for Freshness Gate source retention."
  - "GitHub Actions workflow files mapped to CI cost, cache, monorepo trigger, deploy, and artifact guardrails."
  - "Codex plugin packaging and sparse source bootstrap mapped to technical docs."
  - "900-shipflow-core internal skill and tools/audit_shipflow_skills.py mapped to skill runtime docs."
  - "Design-system authority artifact and drift checker mapped for UI token/theme governance."
next_review: "2026-06-18"
next_step: "/300-sf-docs technical audit"
---

# Code Docs Map

## Purpose

This is the canonical map from ShipFlow code paths to technical docs, validation checks, and documentation update triggers. The Reader uses it to produce a `Documentation Update Plan`; executors and integrators apply the resulting documentation updates.

Shared files in this map are sequential integration files. Do not assign concurrent edits to `code-docs-map.md`, `AGENT.md`, `shipflow_data/technical/context.md`, `shipflow_data/technical/guidelines.md`, `shipflow-spec-driven-workflow.md`, or `tools/shipflow_metadata_lint.py` unless a ready spec defines a non-overlapping strategy.

## Map

| Path pattern | Subsystem | Primary technical doc | Secondary docs | Required validation | Docs update trigger |
| --- | --- | --- | --- | --- | --- |
| `shipflow.sh` | Runtime CLI | `shipflow_data/technical/runtime-cli.md` | `shipflow_data/technical/context-function-tree.md`, `shipflow_data/technical/architecture.md` | `bash -n shipflow.sh`; focused CLI smoke when behavior changes | Entrypoint, sourcing, menu dispatch, startup, or visible CLI behavior changes |
| `shipflow_devserver_gum.sh`, `shipflow_devserver_bash.sh` | Runtime CLI | `shipflow_data/technical/runtime-cli.md` | `shipflow_data/technical/context-function-tree.md` | `bash -n shipflow_devserver_gum.sh shipflow_devserver_bash.sh`; focused CLI smoke when behavior changes | Root menu layout, grouped submenu behavior, key handling, or visible CLI behavior changes |
| `lib.sh` | Runtime CLI | `shipflow_data/technical/runtime-cli.md` | `shipflow_data/technical/context-function-tree.md`, `shipflow_data/technical/guidelines.md` | `bash -n lib.sh`; relevant function smoke or grep proof | PM2/Flox/Caddy/DuckDNS behavior, validation, dashboard, health, publish, or environment lifecycle changes |
| `config.sh` | Runtime CLI | `shipflow_data/technical/runtime-cli.md` | `README.md` | `bash -n config.sh`; config validation smoke when changed | Config variable, default, or validation contract changes |
| `local/**` | Local tunnels and MCP login | `shipflow_data/technical/local-tunnels-and-mcp-login.md` | `local/README.md`, `README.md` | `bash -n local/*.sh`; PowerShell syntax review when `.ps1` changes | SSH target, identity path, tunnel lifecycle, MCP OAuth, or local UX changes |
| `install.sh`, `install-shipflow.sh` | Installer and user scope | `shipflow_data/technical/installer-and-user-scope.md` | `README.md`, `shipflow_data/technical/guidelines.md` | `bash -n install.sh install-shipflow.sh`; dry-run/review of touched installer branch | Root/user split, remote bootstrap, symlink, alias, MCP config, package install, or destructive behavior changes |
| `/home/claude/plugins/shipflow/**`, `/home/claude/.agents/plugins/marketplace.json` | Codex plugin packaging | `shipflow_data/technical/codex-plugin-packaging.md` | `shipflow_data/workflow/specs/shipflow-main-plugin-and-pack-portability.md`, `shipflow_data/technical/public-site-and-content-runtime.md` | `python3 /home/claude/.codex/skills/.system/plugin-creator/scripts/validate_plugin.py /home/claude/plugins/shipflow`; `bash -n /home/claude/plugins/shipflow/scripts/bootstrap_shipflow_repo.sh` | Plugin manifest, plugin routing skill, docs links, marketplace entry, sparse checkout, pack catalog, reference strategy, or public plugin packaging behavior changes |
| `tools/shipflow_sync_skills.sh`, `test_skill_runtime_sync.sh` | Skill runtime and installer user scope | `shipflow_data/technical/skill-runtime-and-lifecycle.md`, `shipflow_data/technical/installer-and-user-scope.md` | `README.md` | `bash -n tools/shipflow_sync_skills.sh test_skill_runtime_sync.sh`; `bash test_skill_runtime_sync.sh`; `tools/shipflow_sync_skills.sh --check --all` | Runtime skill visibility, Claude/Codex symlink behavior, install-time selected-user skill linking, collision handling |
| `skills/**/SKILL.md` | Skill runtime and lifecycle | `shipflow_data/technical/skill-runtime-and-lifecycle.md` | `shipflow-spec-driven-workflow.md`, `skills/references/technical-docs-corpus.md` | `python3 tools/skill_budget_audit.py --skills-root skills --format markdown` when skill surfaces change | Skill routing, lifecycle, validation, documentation gate, or model/topology behavior changes |
| `skills/900-shipflow-core/**`, `tools/audit_shipflow_skills.py` | Internal ShipFlow Core audit | `shipflow_data/technical/skill-runtime-and-lifecycle.md` | `skills/references/skill-execution-fidelity.md`, `shipflow_data/technical/codex-plugin-packaging.md` | `python3 tools/audit_shipflow_skills.py`; `tools/shipflow_sync_skills.sh --check --skill 900-shipflow-core`; `python3 tools/skill_code_index_lint.py` | Internal skill execution-fidelity audit behavior, public-plugin separation, packaging readiness checks, or runtime discoverability changes |
| `skills/references/skill-code-index.md`, `tools/skill_code_index_lint.py` | Skill runtime and lifecycle | `shipflow_data/technical/skill-runtime-and-lifecycle.md` | `docs/skill-launch-cheatsheet.md`, `skills/302-sf-help/references/help-catalog.md` | `python3 tools/skill_code_index_lint.py`; metadata lint for the index and affected docs | Numeric skill-code family, code assignment, lookup semantics, or skill coverage changes |
| `skills/600-sf-local-cloud-sync/**` | Local-to-cloud sync skill | `shipflow_data/technical/skill-runtime-and-lifecycle.md` | `skills/600-sf-local-cloud-sync/references/local-cloud-sync-doctrine.md`, `skills/600-sf-local-cloud-sync/references/ux-security-checklist.md`, `skills/600-sf-local-cloud-sync/references/flutter-implementation-checklist.md`, `shipflow-spec-driven-workflow.md` | `rg -n "Sync Contract|Core Doctrine|Security And Privacy Rules|Proof Paths" skills/600-sf-local-cloud-sync`; `python3 tools/skill_budget_audit.py --skills-root skills --format markdown`; `tools/shipflow_sync_skills.sh --check --skill 600-sf-local-cloud-sync` | Local/cloud data promotion doctrine, account association, merge/conflict policy, sync UX, sensitive-data policy, or Flutter sync proof guidance changes |
| `skills/601-sf-product-entitlements/**` | Product entitlements skill | `shipflow_data/technical/skill-runtime-and-lifecycle.md` | `skills/references/product-entitlements-playbook.md`, `skills/600-sf-local-cloud-sync/SKILL.md`, `skills/109-sf-auth-debug/SKILL.md`, `shipflow-spec-driven-workflow.md` | `rg -n "product-entitlements|suite ledger|provider event|activation code|snapshot|mirror|backend authorization|600-sf-local-cloud-sync|109-sf-auth-debug" skills/601-sf-product-entitlements/SKILL.md`; `python3 tools/skill_budget_audit.py --skills-root skills --format markdown`; `tools/shipflow_sync_skills.sh --check --skill 601-sf-product-entitlements` | Product access ownership, provider/manual grant handling, activation codes, premium gates, support access flows, product-local mirrors, backend authorization, or entitlement-gated sync handoff changes |
| `skills/references/**` | Skill references | `shipflow_data/technical/skill-runtime-and-lifecycle.md` | `skills/references/technical-docs-corpus.md` | Metadata lint for references with frontmatter; targeted rg checks | Reference doctrine or path-resolution behavior changes |
| `tools/design_system_drift_check.py`, UI source paths such as `site/src/styles/**`, `site/src/components/**`, app `src/**`, `app/**`, `pages/**`, `components/**`, `lib/**` | Design-system authority | `shipflow_data/technical/design-system-authority.md` | `shipflow_data/business/branding.md`, `shipflow_data/technical/guidelines.md`, `skills/references/design-system-token-contract.md` | `python3 tools/design_system_drift_check.py --changed --format markdown`; project build/lint; browser or device proof when visual behavior changes | Token/theme source, component bridge, layout/motion authority, visual constants, mobile safe-area/IME behavior, or design-system drift rules change |
| `templates/artifacts/**` | Artifact metadata and linter | `shipflow_data/technical/artifact-metadata-and-linter.md` | `shipflow-metadata-migration-guide.md` | `python3 tools/shipflow_metadata_lint.py templates/artifacts` | Template field, artifact type, or required metadata changes |
| `tools/shipflow_metadata_lint.py` | Artifact metadata and linter | `shipflow_data/technical/artifact-metadata-and-linter.md` | `shipflow-metadata-migration-guide.md` | `python3 tools/shipflow_metadata_lint.py --help`; targeted lint command | Required fields, statuses, artifact types, default targets, or parse behavior changes |
| `tools/codebase-mcp/**` | Codebase MCP | `shipflow_data/technical/codebase-mcp.md` | `tools/codebase-mcp/README.md`, `tools/codebase-mcp/TIPS.md` | Python syntax check and focused MCP tool behavior review | Context budget, tool names, file indexing, memory, or setup behavior changes |
| `site/**` | Public site and content runtime | `shipflow_data/technical/public-site-and-content-runtime.md` | `shipflow_data/editorial/content-map.md`, `site/README.md` | `npm --prefix site run build` when practical | Public route, public docs, skill page, content boundary, or publishing behavior changes |
| `shipflow_data/editorial/content-map.md` | Public content routing | `shipflow_data/technical/public-site-and-content-runtime.md` | `README.md`, `shipflow-spec-driven-workflow.md` | Metadata lint; link/path review | Public surface role, content destination, or cross-surface update rule changes |
| `AGENT.md`, `AGENTS.md` | Agent entrypoint | `shipflow_data/technical/skill-runtime-and-lifecycle.md` | `shipflow_data/technical/README.md` | `test ! -e AGENTS.md || { test -L AGENTS.md && test "$(readlink AGENTS.md)" = "AGENT.md"; }` | Agent routing, technical docs pointer, or compatibility alias changes |
| `shipflow_data/technical/context.md`, `shipflow_data/technical/context-function-tree.md` | Context layer | `shipflow_data/technical/runtime-cli.md` | `shipflow_data/technical/README.md` | Metadata lint; path existence review | Entrypoint, hotspot, file role, or code navigation changes |
| `shipflow_data/technical/architecture.md`, `shipflow_data/technical/guidelines.md`, `shipflow_data/technical/decisions/**` | Global technical contracts | `shipflow_data/technical/decisions.md` | `shipflow_data/technical/README.md` | Metadata lint; dependency version review | Invariant, architecture, technical doctrine, decision, or doc-maintenance rule changes |
| `.github/workflows/**` | CI and deploy workflows | `shipflow_data/technical/github-actions.md` | `shipflow_data/technical/blacksmith.md`, provider-specific deployment docs such as `shipflow_data/technical/firebase-firestore-oidc-ci-playbook.md` | Workflow YAML parse when practical; `git diff --check`; local checks allowed by repository guardrails | Workflow trigger, job topology, cache, runner, artifact, secret, OIDC, deploy, or monorepo path behavior changes |
| `shipflow_data/technical/external-platforms/**` | External platform source corpus | `shipflow_data/technical/external-platforms/README.md` | `skills/references/documentation-freshness-gate.md`, provider-specific project usage docs | Metadata lint; provider source link review | Global provider source, Freshness Gate rule, provider risk, validation route, or project-local usage template changes |
| `templates/artifacts/project_platform_usage.md` | Project platform usage template | `shipflow_data/technical/external-platforms/README.md` | `skills/references/technical-docs-corpus.md`, `shipflow_data/technical/README.md` | Metadata lint for template and generated usage docs | Project-local provider usage structure, security fields, validation fields, or Freshness Gate handoff changes |
| `shipflow_data/workflow/specs/**` | Chantiers | `shipflow_data/technical/skill-runtime-and-lifecycle.md` | `shipflow_data/technical/decisions.md` | Metadata lint for changed spec; chantier flow review | Workflow, linked system, validation, or docs impact requirements change |

## Documentation Update Plan Format

```markdown
## Documentation Update Plan

- Code changed: `path/or/pattern`
- Subsystem: `707-name`
- Primary technical doc: `shipflow_data/technical/example.md`
- Secondary docs: `...`
- Required action: `none | review | update | create`
- Priority: `low | medium | high`
- Reason: `why this doc is impacted`
- Owner role: `executor | integrator`
- Parallel-safe: `yes | no`
- Notes: `constraints or blockers`
```

## Reader Rules

- The Reader diagnoses documentation impact; it does not become the default docs executor.
- A mapped code change requires a docs update or a written no-impact justification.
- Missing map coverage is a docs-planning failure and must be reported.
- Shared map and entrypoint docs are not parallel-safe.
- `shipflow_data/technical/` is internal-only in v1 and must not be published as site content.

## Maintenance Rule

Update this map whenever a code area, technical doc, validation command, or docs update trigger changes. This file is shared infrastructure; edit it sequentially during final integration.
