---
artifact: technical_guidelines
metadata_schema_version: "1.0"
artifact_version: "1.0.0"
project: ShipFlow
created: "2026-06-26"
updated: "2026-06-26"
status: active
source_skill: 000-shipflow
scope: shared-terminology
owner: unknown
confidence: high
risk_level: low
security_impact: none
docs_impact: yes
linked_systems:
  - skills/000-shipflow/SKILL.md
  - skills/302-sf-help/SKILL.md
  - skills/102-sf-start/SKILL.md
  - shipflow.sh
  - lib.sh
  - config.sh
  - install.sh
  - local/
  - tui/
depends_on: []
supersedes: []
evidence:
  - "Shared terminology was needed so ShipFlow can be referenced from other projects without repeating the definition in each skill."
  - "The package includes both server-side CLI scripts and the terminal UI, so the terminology must bind both to the same product family."
next_step: "/103-sf-verify shared terminology routing"
---

# ShipFlow Terms

Use these names consistently when users talk to ShipFlow through skills or other agent entrypoints.

## Canonical Terms

- `ShipFlow` or `ShipFlow system`: the combined package of CLI scripts, skills, local tooling, and documentation.
- `ShipFlow Dev Server`: the server-side CLI layer that manages environments and runtime behavior. Unless the user says otherwise, this means:
  - `${SHIPFLOW_ROOT:-$HOME/shipflow}/shipflow.sh`
  - `${SHIPFLOW_ROOT:-$HOME/shipflow}/lib.sh`
  - `${SHIPFLOW_ROOT:-$HOME/shipflow}/config.sh`
  - `${SHIPFLOW_ROOT:-$HOME/shipflow}/install.sh`
- `ShipFlow TUI`: the terminal user interface under `${SHIPFLOW_ROOT:-$HOME/shipflow}/tui/`.
- `ShipFlow local tools`: the local connection and tunnel helpers under `${SHIPFLOW_ROOT:-$HOME/shipflow}/local/`.
- `ShipFlow skills`: the skill system under `${SHIPFLOW_ROOT:-$HOME/shipflow}/skills/`.

## Routing Rule

When a user says `Dev Server` while talking to ShipFlow, interpret it as `ShipFlow Dev Server` by default.

When a user mentions the terminal UI, interpret it as `ShipFlow TUI` by default.

If the user names another project explicitly, keep that project as the target and treat ShipFlow as the reference system only.
