---
artifact: documentation
metadata_schema_version: "1.0"
artifact_version: "1.0.0"
project: ShipFlow
created: "2026-06-28"
updated: "2026-06-28"
status: reviewed
source_skill: 300-sf-docs
scope: kilocode-runtime-docs
owner: Diane
confidence: medium
risk_level: medium
security_impact: none
docs_impact: yes
linked_systems:
  - ".agents/skills/shipflow/SKILL.md"
  - "README.md"
  - "docs/skill-launch-cheatsheet.md"
depends_on:
  - artifact: ".agents/skills/shipflow/SKILL.md"
    artifact_version: "unknown"
    required_status: "unknown"
supersedes: []
evidence:
  - "Repository docs already state that KiloCode-style runtimes should use natural language or the runtime skill picker."
  - "The repository proves a generic OpenCode-compatible shim at `.agents/skills/shipflow/SKILL.md`, but no dedicated KiloCode shim path."
next_step: "/300-sf-docs audit docs/kilocode-shipflow.md"
---

# ShipFlow in KiloCode

This page explains the current repo-visible KiloCode guidance for ShipFlow without claiming a dedicated KiloCode packaging path that the repository does not prove.

## What You Type

In KiloCode, ask for the ShipFlow skill in natural language or use the runtime skill picker when the runtime exposes one.

Examples:

- `Use the ShipFlow skill to route this task`
- `ShipFlow: help`
- `ShipFlow: verify this docs change`

## What You Do Not Type

Do not type internal runtime calls such as `skill({ name: "shipflow" })`.

Those are runtime internals, not manual operator commands.

## What the Repository Proves

This repository does **not** currently ship a dedicated `KiloCode`-named shim folder.

What it does prove is:

- a generic OpenCode-compatible shim at `.agents/skills/shipflow/SKILL.md`
- repo-visible guidance that OpenCode or KiloCode-style runtimes should use natural language invocation or the runtime skill picker

## Configuration Boundary

If your KiloCode setup supports repository-local compatible skills, use the generic `.agents/skills/shipflow/` shim as the repo-visible compatibility surface.

If your KiloCode build uses a different import or registration path, follow KiloCode's own runtime configuration flow, then expose the visible `shipflow` entrypoint to the operator. This repository does not claim a stronger KiloCode-specific install contract than that.

## What ShipFlow Does After Discovery

Once KiloCode resolves ShipFlow:

- the `shipflow` entrypoint explains or routes
- the selected owner skill carries execution
- the runtime may perform internal skill calls after interpreting your request

The operator boundary stays the same: ask for ShipFlow, then let the owner skill take over after routing.

## Practical Rule

Use this order:

1. ask for ShipFlow in natural language or pick it in the runtime UI
2. if repository-local compatible-skill import is needed, use `.agents/skills/shipflow/`
3. treat internal runtime calls as implementation details only
4. do not assume a dedicated KiloCode repo shim unless the repo later adds one explicitly
