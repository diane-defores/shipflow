---
artifact: documentation
metadata_schema_version: "1.0"
artifact_version: "1.0.0"
project: ShipFlow
created: "2026-06-28"
updated: "2026-06-28"
status: reviewed
source_skill: 300-sf-docs
scope: opencode-runtime-docs
owner: Diane
confidence: high
risk_level: medium
security_impact: none
docs_impact: yes
linked_systems:
  - ".opencode/skills/shipflow/SKILL.md"
  - ".agents/skills/shipflow/SKILL.md"
  - "README.md"
  - "docs/skill-launch-cheatsheet.md"
depends_on:
  - artifact: ".opencode/skills/shipflow/SKILL.md"
    artifact_version: "unknown"
    required_status: "unknown"
  - artifact: ".agents/skills/shipflow/SKILL.md"
    artifact_version: "unknown"
    required_status: "unknown"
supersedes: []
evidence:
  - "Repository-local OpenCode shim exists at `.opencode/skills/shipflow/SKILL.md`."
  - "Repository-local generic OpenCode-compatible shim exists at `.agents/skills/shipflow/SKILL.md`."
  - "README and runtime docs already distinguish manual user input from internal runtime calls."
next_step: "/300-sf-docs audit docs/opencode-shipflow.md"
---

# ShipFlow in OpenCode

This page explains the repo-proven OpenCode path for using ShipFlow.

## What You Type

In OpenCode, ask for the ShipFlow skill in natural language or select it through the runtime skill picker when the UI exposes one.

Examples:

- `Use the ShipFlow skill to route this task`
- `ShipFlow: help me choose the right workflow`
- `ShipFlow: audit local packaging`

## What You Do Not Type

Do not type internal runtime calls such as `skill({ name: "shipflow" })`.

Those calls may appear in runtime implementations or logs, but they are runtime internals, not operator commands.

## How This Repository Exposes ShipFlow to OpenCode

The repository currently proves two relevant runtime surfaces:

- `.opencode/skills/shipflow/SKILL.md` is the explicit OpenCode repository shim.
- `.agents/skills/shipflow/SKILL.md` is the generic OpenCode-compatible fallback shim.

If your OpenCode setup supports repo-local skill import or repository skill discovery, point it at the explicit `.opencode/skills/shipflow/` surface first. Use `.agents/skills/shipflow/` only when your setup expects the generic compatible path.

## What ShipFlow Does After Discovery

Once OpenCode resolves ShipFlow:

- the `shipflow` entrypoint explains or routes
- the selected owner skill carries execution
- runtime internals may invoke local skill calls after interpreting your request

This means the repo-level `shipflow` entrypoint is for choosing the right workflow, not for pretending that a helper page executes the whole task itself.

## Configuration Notes

This repository proves the skill shims above. It does not claim every OpenCode installation uses the same import UI or configuration screen.

Use this repo contract:

1. keep the repository checkout visible to OpenCode
2. prefer `.opencode/skills/shipflow/`
3. fall back to `.agents/skills/shipflow/` only when your runtime expects the generic compatible path
4. launch the visible `shipflow` skill or ask for it in natural language

## When You Need the Full ShipFlow Corpus

The OpenCode shim is a lightweight repository entrypoint. For full local source-tree packaging or development audits, follow the bootstrap route documented by the shim itself:

```bash
scripts/bootstrap_shipflow_repo.sh
```

Use that route only when the lightweight surface is not enough.
