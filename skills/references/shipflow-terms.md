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
  - cli/shipflow.sh
  - cli/lib.sh
  - cli/config.sh
  - cli/install.sh
  - local/
  - tui/
depends_on: []
supersedes: []
evidence:
  - "Shared terminology was needed so ShipFlow can be referenced from other projects without repeating the definition in each skill."
  - "The package includes both server-side CLI scripts and the terminal UI, so the terminology must bind both to the same product family."
  - "Operator idea 2026-06-27: lightweight glossary tags should recenter the agent faster than invoking a full skill when the conversation drifts."
next_review: "2026-07-11"
next_step: "/103-sf-verify shared terminology routing"
---

# ShipFlow Terms

Use these names consistently when users talk to ShipFlow through skills or other agent entrypoints.

## Canonical Terms

- `ShipFlow` or `ShipFlow system`: the combined package of CLI scripts, skills, local tooling, and documentation.
- `ShipFlow Dev Server`: the server-side CLI layer that manages environments and runtime behavior. Unless the user says otherwise, this means:
  - `${SHIPFLOW_ROOT:-$HOME/shipflow}/cli/shipflow.sh`
  - `${SHIPFLOW_ROOT:-$HOME/shipflow}/cli/lib.sh`
  - `${SHIPFLOW_ROOT:-$HOME/shipflow}/cli/config.sh`
  - `${SHIPFLOW_ROOT:-$HOME/shipflow}/cli/install.sh`
- `ShipFlow TUI`: the terminal user interface under `${SHIPFLOW_ROOT:-$HOME/shipflow}/tui/`.
- `ShipFlow local tools`: the local connection and tunnel helpers under `${SHIPFLOW_ROOT:-$HOME/shipflow}/local/`.
- `ShipFlow skills`: the skill system under `${SHIPFLOW_ROOT:-$HOME/shipflow}/skills/`.

## Routing Rule

When a user says `Dev Server` while talking to ShipFlow, interpret it as `ShipFlow Dev Server` by default.

When a user mentions the terminal UI, interpret it as `ShipFlow TUI` by default.

If the user names another project explicitly, keep that project as the target and treat ShipFlow as the reference system only.

## Focus Tags

ShipFlow also accepts lightweight conversation recentering tags. These tags do not replace owner-skill routing. They tell the agent which canonical contract to reload before answering, routing, or editing.

If a tag is present, treat it as a high-priority context cue even when the rest of the prompt is short or fuzzy.

| Tag | Meaning | Canonical document |
| --- | --- | --- |
| `#partner` | Recenter on the agent as business partner, advisor, and growth-aligned associate | `$SHIPFLOW_ROOT/skills/references/operator-partnership-contract.md` |
| `#quality` | Recenter on quality bar, autonomy, bounded excellence, and anti-shortcut rules | `$SHIPFLOW_ROOT/skills/references/decision-quality-contract.md` |
| `#growth` | Recenter on business growth, distribution, conversion, and leverage | `$SHIPFLOW_ROOT/shipflow_data/business/gtm.md` |
| `#end-user` | Recenter on first success, user usefulness, clarity, and beginner adoption | `$SHIPFLOW_ROOT/skills/008-sf-onboarding/SKILL.md` |
| `#shipflow` | Recenter on the internal ShipFlow system rather than the current project repo | `$SHIPFLOW_ROOT/skills/references/entrypoint-routing.md` |
| `#shupflow` | Alias for `#shipflow` when used as a fast recentering tag in conversation | `$SHIPFLOW_ROOT/skills/references/entrypoint-routing.md` |
| `#onboarding` | Recenter on first success, setup order, recoverable states, and adoption guidance | `$SHIPFLOW_ROOT/skills/008-sf-onboarding/SKILL.md` |
| `#routing` | Recenter on owner-skill selection and direct handoff rules | `$SHIPFLOW_ROOT/skills/references/entrypoint-routing.md` |
| `#proof` | Recenter on proof paths, validation proportion, and evidence claims | `$SHIPFLOW_ROOT/skills/references/spec-driven-development-discipline.md` |
| `#shipflow-core` | Recenter on ShipFlow system hardening, skill fidelity, and internal doctrine | `$SHIPFLOW_ROOT/skills/900-shipflow-core/SKILL.md` |

## Tag Rule

When one or more focus tags appear:

- load the referenced canonical document before choosing the next action
- keep the tag meaning active as a conversation-level priority for the current turn
- do not ask the operator to restate the same doctrine in natural language when the tag already resolves it

If several tags appear, combine them in the narrowest coherent way rather than treating them as conflicting by default.
