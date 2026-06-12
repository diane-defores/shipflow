---
artifact: spec
metadata_schema_version: "1.0"
artifact_version: "1.0.0"
project: "shipflow"
created: "2026-06-12"
created_at: "2026-06-12 23:10:00 UTC"
updated: "2026-06-12"
updated_at: "2026-06-12 23:18:00 UTC"
status: ready
source_skill: 100-sf-spec
source_model: "GPT-5 Codex"
scope: "design-content-skill-build-master-semantic-compaction"
owner: "unknown"
user_story: "As the ShipFlow operator, I want the design, content, and skill-maintenance master skills semantically compacted through the canonical artifact taxonomy, so agents stop confusing design lifecycle orchestration, content lifecycle orchestration, and skill-maintenance lifecycle orchestration."
confidence: "high"
risk_level: "high"
security_impact: "yes"
docs_impact: "yes"
linked_systems:
  - "skills/006-sf-design/SKILL.md"
  - "skills/007-sf-content/SKILL.md"
  - "skills/009-sf-skill-build/SKILL.md"
  - "skills/references/master-delegation-semantics.md"
  - "skills/references/master-workflow-lifecycle.md"
  - "skills/references/chantier-tracking.md"
  - "skills/references/reporting-contract.md"
  - "skills/references/decision-quality-contract.md"
  - "skills/references/design-system-token-contract.md"
  - "skills/references/editorial-content-corpus.md"
  - "shipflow_data/technical/skill-runtime-and-lifecycle.md"
  - "shipflow_data/workflow/specs/shipflow-artifact-taxonomy-for-skills-and-references.md"
  - "shipflow_data/workflow/specs/semantic-compaction-of-core-shipflow-skills.md"
  - "shipflow_data/workflow/specs/semantic-compaction-of-source-specialist-skills.md"
  - "shipflow_data/workflow/specs/semantic-compaction-of-maintenance-and-release-master-skills.md"
depends_on:
  - artifact: "shipflow_data/workflow/specs/shipflow-artifact-taxonomy-for-skills-and-references.md"
    artifact_version: "1.0.0"
    required_status: "ready"
  - artifact: "shipflow_data/workflow/specs/semantic-compaction-of-core-shipflow-skills.md"
    artifact_version: "1.0.0"
    required_status: "ready"
  - artifact: "shipflow_data/workflow/specs/semantic-compaction-of-source-specialist-skills.md"
    artifact_version: "1.0.0"
    required_status: "ready"
  - artifact: "shipflow_data/workflow/specs/semantic-compaction-of-maintenance-and-release-master-skills.md"
    artifact_version: "1.0.0"
    required_status: "ready"
  - artifact: "skills/references/master-delegation-semantics.md"
    artifact_version: "1.4.0"
    required_status: "active"
  - artifact: "skills/references/master-workflow-lifecycle.md"
    artifact_version: "1.4.1"
    required_status: "active"
  - artifact: "skills/references/chantier-tracking.md"
    artifact_version: "0.5.0"
    required_status: "draft"
  - artifact: "skills/references/reporting-contract.md"
    artifact_version: "1.4.0"
    required_status: "active"
  - artifact: "skills/references/decision-quality-contract.md"
    artifact_version: "1.2.0"
    required_status: "active"
supersedes: []
evidence:
  - "Batch A clarified the lifecycle spine, Batch C clarified the source specialists, and Batch D1 clarified maintenance/release masters; the next remaining confusion cluster is the master family around design, content, and skill maintenance."
  - "The artifact taxonomy requires each touched skill to keep one primary artifact type, one dominant question, and one owner boundary."
  - "Current `006-sf-design`, `007-sf-content`, and `009-sf-skill-build` are strong but still semantically dense because they orchestrate broad families of downstream owners."
  - "The user explicitly requested the next batch after D1."
next_step: "/102-sf-start shipflow_data/workflow/specs/semantic-compaction-of-design-content-and-skill-build-master-skills.md"
---

# Title

Semantic Compaction Of Design Content And Skill-Build Master Skills

# Status

ready

# User Story

As the ShipFlow operator, I want the design, content, and skill-maintenance master skills semantically compacted through the canonical artifact taxonomy, so agents stop confusing design lifecycle orchestration, content lifecycle orchestration, and skill-maintenance lifecycle orchestration.

# Minimal Behavior Contract

When this chantier runs, ShipFlow must keep `006-sf-design`, `007-sf-content`, and `009-sf-skill-build` explicitly classifiable as `master-workflow` skills with distinct dominant questions, owned lifecycle spans, and owner-routing boundaries. The compacted result must make it obvious that design decides how UI/design-system work moves through audits, spec-first implementation, proof, and ship; content decides how public/internal content work moves through sources, surfaces, claim gates, quality checks, and ship; and skill-build decides how ShipFlow skill maintenance moves from placement/spec to runtime visibility, docs coherence, verification, and ship. If any compacted skill starts sounding like a generic orchestrator for the others, verification must fail.

# Success Behavior

- Preconditions: the taxonomy spec, Batch A lifecycle compaction, Batch C specialist compaction, and Batch D1 master-family compaction are already shipped.
- Trigger: the operator launches `/101-sf-ready` and then `/102-sf-start` on this spec.
- User/operator result: an agent can quickly distinguish design lifecycle work, content lifecycle work, and ShipFlow skill-maintenance lifecycle work without rereading long surrounding doctrine.
- System effect: the touched activation contracts state crisp `master-workflow` boundaries while preserving chantier tracing, delegated sequential semantics, proof-owner routing, and public-surface/doc gates.
- Proof of success: metadata lint, skill budget audit, runtime skill sync, targeted `rg` checks, and a manual family-boundary review all pass on the touched master family.

# Error Behavior

- If any touched skill needs a shared contract rewrite in `skills/references/*`, stop the skill-local batch and record a separate sequential integration follow-up instead of widening scope.
- If compacting `006-sf-design` weakens the distinction between design lifecycle orchestration and generic implementation or browser-proof execution, verification must fail.
- If compacting `007-sf-content` weakens the distinction between content lifecycle orchestration and generic docs/writing execution, verification must fail.
- If compacting `009-sf-skill-build` weakens the distinction between ShipFlow skill maintenance and generic product build/content/design orchestration, verification must fail.
- Must never happen: deleting master delegation loaders, lifecycle routing boundaries, claim/public-surface gates, runtime visibility checks, or required proof-owner handoffs in order to shorten text.

# Problem

The remaining semantic confusion cluster sits in the master family that wraps design, content, and skill maintenance. These skills each orchestrate several downstream owners, keep strong governance gates, and are broad enough that agents can blur them into "the generic orchestrator for structured work" even though their contracts differ materially.

The risk is not only length. It is role collapse. `006-sf-design` can start sounding like a generic frontend build wrapper. `007-sf-content` can start sounding like a generic writing/docs router. `009-sf-skill-build` can start sounding like a generic ShipFlow governance maintainer instead of the skill-maintenance lifecycle master. This batch should compact semantics while preserving the boundaries that protect correct routing, public-claim safety, runtime visibility, and proof quality.

# Solution

Run one bounded master-family batch on `006-sf-design`, `007-sf-content`, and `009-sf-skill-build`.

The batch should:

1. Normalize activation shape where useful: primary artifact type, mission, and compact dominant-question language.
2. Preserve the `master-workflow` posture and delegated sequential lifecycle semantics.
3. Make the dominant question of each master explicit so the family stops overlapping semantically.
4. Keep reusable doctrine in shared references unless the activation contract truly needs it to route safely.

## Ideal Master Matrix

| Skill | Primary artifact type | Dominant question | Dominant responsibility | Forbidden drift | Must-preserve sentence |
| --- | --- | --- | --- | --- | --- |
| `skills/006-sf-design/SKILL.md` | `master-workflow` | `Quel travail de design faut-il cadrer et jusqu'ou doit-on le porter entre systeme visuel, implementation, preuve et ship ?` | Orchestrate design lifecycle across audits, tokens, spec-first UI work, proof, verification, and ship | Becoming a generic build wrapper, browser-proof owner, or one-off visual patch skill | `006-sf-design` owns design lifecycle routing and proof posture, not generic implementation or standalone browser verification. |
| `skills/007-sf-content/SKILL.md` | `master-workflow` | `Quel travail de contenu faut-il produire ou corriger, sur quelle surface, a partir de quelle source et avec quelles contraintes de claim ?` | Orchestrate content lifecycle across sources, surfaces, specialist writing/audit owners, governance gates, verification, and ship | Becoming generic docs writing, generic README editing, or a content-free router with no public-claim boundary | `007-sf-content` owns content lifecycle coherence across source, surface, claims, quality, and ship, not generic writing detached from governance. |
| `skills/009-sf-skill-build/SKILL.md` | `master-workflow` | `Quel changement de skill ShipFlow faut-il cadrer, implementer, verifier, rendre visible et aligner sur les surfaces docs/runtime ?` | Orchestrate ShipFlow skill maintenance across placement, spec, refresh, runtime sync, verification, docs/help/public skill coherence, and ship | Becoming generic repo governance maintenance, generic docs maintainer, or another product/build master | `009-sf-skill-build` owns the lifecycle of ShipFlow skill maintenance, not generic product work or broad repository upkeep. |

# Scope In

- Semantically compact the activation contracts of `006-sf-design`, `007-sf-content`, and `009-sf-skill-build`.
- Align this family with the artifact taxonomy and the compaction style already applied to lifecycle, specialist, and maintenance/release batches.
- Add or tighten primary artifact labels, mission sections, and compact owner-boundary wording where useful.
- Clarify design, content, and skill-maintenance boundaries without changing runtime invocation or core behavior.
- Record any newly discovered shared-doctrine drift rather than broadening the batch silently.

# Scope Out

- Changing public command names, skill numbers, or runtime invocation forms.
- Rewriting shared reference bodies unless a separate follow-up explicitly owns them.
- Editing lifecycle or specialist skills already covered by previous batches.
- Creating or changing public site skill pages, README promises, or technical docs unless a touched documented boundary becomes materially stale.
- Changing design-token doctrine, editorial doctrine, or runtime sync mechanics themselves.

# Constraints

- This batch stays sequential by default.
- Skill-local edits are allowed in one bounded execution wave; shared-reference edits require a separate sequential follow-up.
- Each touched skill must remain classifiable as one `master-workflow`.
- Delegated sequential semantics, proof-owner routing, and stop conditions cannot be weakened for brevity.
- The batch must preserve the distinction between design lifecycle work, content lifecycle work, and ShipFlow skill-maintenance work.
- Runtime/observability exception: this chantier changes activation-contract text only, so no Sentry, diagnostics, or build-header mutation is expected; verification relies on metadata lint, skill sync, targeted grep, and manual semantic review instead of runtime telemetry.
- Language doctrine: internal contract labels, section names, and machine anchors stay in English; operator-facing explanatory prose may stay French, and any visible French text added during implementation must remain natural and accented.
- Existing unrelated dirty files must remain out of ship scope.

# Test Contract

- Surface: ShipFlow governance, master activation contracts, and lifecycle routing semantics.
- proof_profile: mixed
- proof_order:
  1. approve the batch contract
  2. apply skill-local edits
  3. run validations
  4. review master-family boundaries for overlap or missing doctrine
  5. decide whether any shared-contract or doc follow-up is needed
- checklist_path: `shipflow_data/workflow/test-checklists/semantic-compaction-of-design-content-and-skill-build-master-skills.md` if implementation requires more than straightforward skill-local edits; otherwise `not required`
- required_scenario_ids:
  - `MC-006-design-not-generic-build`
  - `MC-007-content-not-generic-writing`
  - `MC-009-skill-build-not-generic-governance`
- required_results:
  - Every touched skill declares one explicit `master-workflow` role and one dominant boundary.
  - `006-sf-design` keeps design lifecycle and proof posture explicit and does not collapse into generic build or proof ownership.
  - `007-sf-content` keeps source/surface/claim governance explicit and does not collapse into generic writing or docs routing.
  - `009-sf-skill-build` keeps ShipFlow skill-maintenance lifecycle explicit and does not absorb generic repo maintenance or product build semantics.
  - Metadata lint, skill budget audit, runtime skill sync, and targeted `rg` checks pass after implementation.
- exception_with_proof: if a shared-reference drift is discovered, stop this batch, capture the evidence in verification/reporting, and route to a follow-up spec instead of mutating shared references here.
- exception_without_proof: none; no success, safety, or boundary claim may be accepted without command output or manual evidence.
- Automated proof available:
  - `python3 tools/shipflow_metadata_lint.py shipflow_data/workflow/specs/semantic-compaction-of-design-content-and-skill-build-master-skills.md`
  - `python3 tools/skill_budget_audit.py --skills-root skills --format markdown`
  - `tools/shipflow_sync_skills.sh --check --all`
  - targeted `rg` checks for primary artifact labels, trace/process metadata, mission sections, and family-specific must-preserve rules
- Non-automated proof required:
  - manual role-boundary review across `006/007/009`
- Fresh external docs verdict: `fresh-docs not needed`, because this chantier changes local ShipFlow skill semantics rather than provider/framework behavior.

# Dependencies

- `shipflow_data/workflow/specs/shipflow-artifact-taxonomy-for-skills-and-references.md`: canonical artifact taxonomy and boundary matrix.
- `shipflow_data/workflow/specs/semantic-compaction-of-core-shipflow-skills.md`: prior lifecycle-family compaction style.
- `shipflow_data/workflow/specs/semantic-compaction-of-source-specialist-skills.md`: specialist-family precedent for post-spine batches.
- `shipflow_data/workflow/specs/semantic-compaction-of-maintenance-and-release-master-skills.md`: prior master-family precedent.
- `skills/references/master-delegation-semantics.md`: master delegation doctrine.
- `skills/references/master-workflow-lifecycle.md`: shared lifecycle skeleton and work item model.
- `skills/references/chantier-tracking.md`: chantier tracing and source threshold rules.
- `skills/references/reporting-contract.md`: compact user-facing reporting rules.
- `skills/references/decision-quality-contract.md`: quality bar and shortcut ban.

# Invariants

- `006-sf-design` remains the design lifecycle master, not a direct replacement for `001-sf-build`, `108-sf-browser`, or atomic design audits.
- `007-sf-content` remains the content lifecycle master and must keep source/surface/claim governance explicit.
- `009-sf-skill-build` remains the ShipFlow skill-maintenance lifecycle master and must keep placement, runtime visibility, and docs/help/public-surface alignment explicit.
- Shared mandatory rules stay in references; activation contracts stay focused on routing, boundaries, and local non-negotiables.
- The work improves semantic clarity before reducing line count.

# Links & Consequences

- These three masters sit above multiple specialist owners; wording drift can change routing across design, content, skill maintenance, public claims, and runtime visibility.
- Any touched shared reference would affect more than this family and must be treated as a contract change, not a wording-only edit.
- Runtime skill sync must pass after any skill-body edit.
- Documentation updates are only needed if the documented family boundaries or runtime taxonomy materially change.

# Documentation Coherence

- Update `shipflow_data/technical/skill-runtime-and-lifecycle.md` only if this batch changes the documented distinction between design, content, and skill-maintenance masters.
- Keep `README.md` and `AGENT.md` unchanged unless a user-facing route promise becomes stale.
- Tracker and changelog updates belong to `104-sf-end` and `005-sf-ship`, not this spec.
- No public docs change is expected from this batch because it only compacts internal ShipFlow master activation contracts.

# Edge Cases

- `006-sf-design` starts sounding like the default wrapper for any frontend implementation request.
- `007-sf-content` starts sounding like a generic writing/docs lane detached from source truth and claim governance.
- `009-sf-skill-build` starts sounding like a generic ShipFlow docs/governance maintainer rather than a skill lifecycle master.
- The three masters keep their downstream lists but lose the sentence that distinguishes why each list exists.
- A shorter activation contract pushes too much family-specific boundary logic into implicit conversation memory.

# Implementation Tasks

- [x] Task 1: Establish the family matrix in the spec.
  - File: `shipflow_data/workflow/specs/semantic-compaction-of-design-content-and-skill-build-master-skills.md`
  - Action: Freeze the dominant question, forbidden drift, and must-preserve sentence for `006/007/009`.
  - User story link: Creates a durable semantic contract before edits.
  - Depends on: None.
  - Validate with: `rg -n "Ideal Master Matrix|006-sf-design|007-sf-content|009-sf-skill-build" shipflow_data/workflow/specs/semantic-compaction-of-design-content-and-skill-build-master-skills.md`
  - Notes: This task completes with the spec itself.

- [ ] Task 2: Compact the master activation contracts.
  - Files: `skills/006-sf-design/SKILL.md`, `skills/007-sf-content/SKILL.md`, `skills/009-sf-skill-build/SKILL.md`
  - Action: Add or align primary artifact type, mission emphasis, and compact owner-boundary wording while preserving behavior.
  - User story link: Reduces confusion between design, content, and skill-maintenance orchestration.
  - Depends on: Task 1.
  - Validate with: `rg -n "Primary artifact type|Mission|Trace category|Process role|Master Delegation|Master Workflow Lifecycle" skills/006-sf-design/SKILL.md skills/007-sf-content/SKILL.md skills/009-sf-skill-build/SKILL.md`
  - Notes: Keep the write set skill-local unless readiness explicitly expands scope.

- [ ] Task 3: Verify family boundaries and proof rules.
  - Files: touched skill files and any touched docs if needed.
  - Action: Run lint/audit/sync checks and a manual overlap review focused on design-vs-content-vs-skill-maintenance boundaries.
  - User story link: Prevents semantic compaction from collapsing adjacent master lanes.
  - Depends on: Task 2.
  - Validate with: `python3 tools/skill_budget_audit.py --skills-root skills --format markdown` and `tools/shipflow_sync_skills.sh --check --all`
  - Notes: Verification must explicitly check that design, content, and skill-build still own distinct lifecycle semantics.

- [ ] Task 4: Decide whether shared-contract or doc follow-up is needed.
  - File: `shipflow_data/workflow/specs/semantic-compaction-of-design-content-and-skill-build-master-skills.md`
  - Action: Record whether a later shared-reference/doc integration batch is unnecessary or required.
  - User story link: Keeps this batch bounded and prevents hidden scope growth.
  - Depends on: Task 3.
  - Validate with: `rg -n "shared-contract follow-up|no shared-reference drift|documentation follow-up" shipflow_data/workflow/specs/semantic-compaction-of-design-content-and-skill-build-master-skills.md`
  - Notes: If no drift appears, this task closes with a no-follow-up decision.

# Acceptance Criteria

- [ ] AC 1: Given the touched family, when an agent reads each activation contract, then one primary `master-workflow` role is explicit in every touched skill.
- [ ] AC 2: Given `006-sf-design`, when an agent scans the mission and boundary language, then it is clear this skill owns design lifecycle routing and not generic implementation or standalone browser proof.
- [ ] AC 3: Given `007-sf-content`, when an agent scans the mission and boundary language, then it is clear this skill owns content lifecycle coherence across source, surface, claims, quality, and ship rather than generic writing.
- [ ] AC 4: Given `009-sf-skill-build`, when an agent scans the mission and boundary language, then it is clear this skill owns ShipFlow skill-maintenance lifecycle work and not broad repository or product execution.
- [ ] AC 5: Given the final diff, when validations run, then metadata lint, skill budget audit, runtime skill sync, and targeted family-boundary grep checks all pass.

## Skill Run History

| Date UTC | Skill | Model | Action | Result | Next step |
|----------|-------|-------|--------|--------|-----------|
| 2026-06-12 23:10:00 UTC | 100-sf-spec | GPT-5 Codex | Created the Batch D2 semantic-compaction spec for `006/007/009` and froze the family matrix, scope, proof contract, and guardrails. | implemented | /101-sf-ready shipflow_data/workflow/specs/semantic-compaction-of-design-content-and-skill-build-master-skills.md |
| 2026-06-12 23:18:00 UTC | 101-sf-ready | GPT-5 Codex | Validated the Batch D2 contract as ready: scope is bounded to `006/007/009`, proof is defined, and no shared-reference rewrite is required. | ready | /102-sf-start shipflow_data/workflow/specs/semantic-compaction-of-design-content-and-skill-build-master-skills.md |

## Current Chantier Flow

- 100-sf-spec: implemented
- 101-sf-ready: ready
- 102-sf-start: pending
- 103-sf-verify: pending
- 104-sf-end: pending
- 005-sf-ship: pending
- Next step: `/102-sf-start shipflow_data/workflow/specs/semantic-compaction-of-design-content-and-skill-build-master-skills.md`
