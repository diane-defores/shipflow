---
artifact: spec
metadata_schema_version: "1.0"
artifact_version: "0.1.0"
project: "ShipFlow"
created: "2026-05-01"
created_at: "2026-05-01 10:05:10 UTC"
updated: "2026-05-01"
updated_at: "2026-05-01 10:05:10 UTC"
status: draft
source_skill: sf-spec
source_model: "GPT-5 Codex"
scope: feature
owner: Diane
user_story: "En tant qu'utilisatrice ShipFlow qui fait coder des sites et applications avec des agents, je veux un Reader editorial read-only et une couche de gouvernance editoriale relies au code, afin que les contenus publics, claims, pages Astro, FAQ, docs publiques et supports restent coherents avec ce que les agents construisent reellement."
confidence: high
risk_level: high
security_impact: yes
docs_impact: yes
linked_systems:
  - CONTENT_MAP.md
  - BUSINESS.md
  - PRODUCT.md
  - BRANDING.md
  - GTM.md
  - README.md
  - shipflow-spec-driven-workflow.md
  - skills/sf-build/SKILL.md
  - skills/sf-docs/SKILL.md
  - skills/sf-repurpose/SKILL.md
  - skills/sf-audit-copy/SKILL.md
  - skills/sf-redact/SKILL.md
  - skills/sf-enrich/SKILL.md
  - skills/references/subagent-roles/reader.md
  - skills/references/subagent-roles/editorial-reader.md
  - skills/references/subagent-roles/sequential-executor.md
  - skills/references/subagent-roles/integrator.md
  - docs/editorial/
  - templates/artifacts/content_map.md
  - templates/artifacts/editorial_content_context.md
  - site/src/pages/
  - site/src/content/skills/
depends_on:
  - artifact: "CONTENT_MAP.md"
    artifact_version: "0.2.0"
    required_status: draft
  - artifact: "BUSINESS.md"
    artifact_version: "1.1.0"
    required_status: reviewed
  - artifact: "PRODUCT.md"
    artifact_version: "1.1.0"
    required_status: reviewed
  - artifact: "BRANDING.md"
    artifact_version: "1.0.0"
    required_status: reviewed
  - artifact: "GTM.md"
    artifact_version: "1.1.0"
    required_status: reviewed
  - artifact: "specs/sf-build-autonomous-master-skill.md"
    artifact_version: "0.10.0"
    required_status: draft
  - artifact: "specs/shipflow-technical-documentation-layer-for-ai-agents.md"
    artifact_version: "0.1.0"
    required_status: draft
supersedes: []
evidence:
  - "User decision 2026-05-01: ShipFlow should have a second read-only Reader specialized in editorial/content impact, not a second leader."
  - "User decision 2026-05-01: the master remains sf-build; readers diagnose and executors/integrators apply changes."
  - "CONTENT_MAP.md already maps public docs, public skill pages, landing page, repo docs, workflow doctrine, product/GTM/brand contracts, semantic clusters, and cross-surface update rules."
  - "skills/sf-audit-copy/SKILL.md already treats copy as product interface and flags proof gaps, docs mismatch, risky claims, and public promise drift."
  - "skills/sf-repurpose/SKILL.md already requires source-faithful repurposing, surface selection from CONTENT_MAP.md, and evidence-led marketing claims."
  - "site/src/pages/ and site/src/content/skills/ contain the public Astro pages and skill content affected by editorial governance."
next_step: "/sf-ready ShipFlow Editorial Content Governance Layer for AI Agents"
---

# Spec: ShipFlow Editorial Content Governance Layer for AI Agents

## Title

ShipFlow Editorial Content Governance Layer for AI Agents

## Status

draft

## User Story

En tant qu'utilisatrice ShipFlow qui fait coder des sites et applications avec des agents, je veux un Reader editorial read-only et une couche de gouvernance editoriale relies au code, afin que les contenus publics, claims, pages Astro, FAQ, docs publiques et supports restent coherents avec ce que les agents construisent reellement.

## Minimal Behavior Contract

Quand un chantier ShipFlow prevoit ou produit un changement de code, de workflow, de produit, de documentation ou de comportement public, `sf-build` doit pouvoir lancer deux readers read-only distincts: un Technical Reader pour les impacts code/docs techniques et un Editorial Reader pour les impacts contenus publics. L'Editorial Reader lit `CONTENT_MAP.md`, les contrats business/produit/marque/GTM, les pages Astro, les collections de contenu et les skills de contenu, puis produit un `Editorial Update Plan` et un `Claim Impact Plan` sans jamais modifier de fichier. Les updates editoriales sont appliquees ensuite par un executor write-capable ou un integrator, en sequentiel par defaut; le parallelisme editorial n'est permis que si une spec ready donne des fichiers exclusifs par agent et aucun fichier partage. En cas de doute sur une promesse publique, un claim sensible, une surface manquante ou un contenu devenu faux, le chantier bloque la cloture ou marque l'item `pending final copy` avec une raison testable. L'edge case facile a rater est de faire passer les tests code mais de laisser le site, la FAQ, les docs publiques ou les pages de vente promettre autre chose que le produit livre.

## Success Behavior

- Preconditions: un chantier ShipFlow touche une feature, un bug, une skill, une page publique, un workflow, une doc utilisateur, ou une promesse produit; `CONTENT_MAP.md` et les contrats `BUSINESS.md`, `PRODUCT.md`, `BRANDING.md`, `GTM.md` existent ou leurs absences sont detectees.
- Trigger: `sf-build`, `sf-start`, `sf-docs`, `sf-repurpose`, `sf-audit-copy`, `sf-redact`, `sf-enrich`, ou une spec active signale un changement susceptible d'affecter du contenu public ou editorial.
- User/operator result: la conversation master reste lisible; le master affiche seulement les decisions utiles et un statut court, tandis que l'Editorial Reader produit un diagnostic read-only exploitable par les executors.
- System effect: un role file `skills/references/subagent-roles/editorial-reader.md` existe; `sf-build` sait lancer le Technical Reader et l'Editorial Reader comme deux readers read-only; `docs/editorial/` documente les surfaces, claims, page intents, gates et formats de plans; les skills de contenu savent lire cette couche.
- Success proof: un agent frais peut ouvrir le role file Editorial Reader, `CONTENT_MAP.md`, et `docs/editorial/` pour savoir quelles pages et claims verifier apres un changement; une spec ready peut nommer les surfaces editoriales impactees, les fichiers partagees, les write sets exclusifs, et les gates de validation.
- Silent success: not allowed; si un changement utilisateur-visible n'a aucun impact editorial, l'Editorial Reader ou l'integrator doit le dire avec une justification courte.

## Error Behavior

- Expected failures: `CONTENT_MAP.md` absent ou stale, contrats business/brand/GTM absents ou low-confidence, page publique non cartographiee, claim sensible sans preuve, conflit entre code livre et copy publique, surface editorialement partagee assignee a plusieurs executors, schema Astro content incompatible avec les champs ShipFlow, ou demande de parallelisme sans ownership exclusif.
- User/operator response: si la decision change le positionnement, la promesse publique, le pricing, la preuve, la FAQ, ou le droit de modifier une page existante, `sf-build` pose une question concise avant l'edit; sinon il route vers executor/integrator avec un plan borne.
- System effect: aucun Reader n'ecrit; aucune update editoriale partagee ne tourne en parallele; aucun contenu applicatif `src/content/**` ne recoit de frontmatter ShipFlow incompatible avec son schema; aucune cloture complete ne passe si une promesse publique connue reste fausse sans `pending final copy` explicite.
- Must never happen: laisser un Editorial Reader modifier des fichiers, laisser un Code Executor inventer des claims marketing, publier une promesse non prouvee, modifier `CONTENT_MAP.md` en parallele avec une page publique qui depend de lui, appliquer un schema ShipFlow dans une collection Astro qui ne l'accepte pas, ou shipper une feature dont les pages publiques decrivent l'ancien comportement.
- Silent failure: not allowed; chaque gap editorial doit etre visible comme `no impact`, `update required`, `pending final copy`, `claim mismatch`, `surface missing`, ou `blocked`.

## Problem

ShipFlow possede deja une couche de contenu utile: `CONTENT_MAP.md` cartographie les surfaces editoriales, `sf-repurpose` transforme les conversations en contenus source-faithful, `sf-audit-copy` verifie les promesses publiques, et `sf-docs` signale la coherence documentaire. Mais ces pieces restent dispersees.

Le nouveau modele `sf-build` introduit des readers et executors specialises. Sans role editorial distinct, le Reader technique risque de devenir trop large: il devrait comprendre en meme temps le code, la documentation technique, la marque, le SEO, les claims, les pages Astro, la FAQ, le pricing et les contenus de support. Cela augmente le risque de contexte confus et de promesses publiques obsoletes.

Le risque produit est important: un agent peut livrer un changement code valide mais laisser la landing page, la FAQ, les docs publiques, le changelog ou les pages skills raconter une version fausse, trop forte, ou non prouvee du produit.

## Solution

Ajouter une couche de gouvernance editoriale pour agents: un role `editorial-reader.md`, un dossier `docs/editorial/`, un registre de claims, une carte d'intention des pages, une gate d'update editoriale, un template d'artefact editorial, et les raccords necessaires dans `sf-build`, `sf-docs`, `sf-repurpose`, `sf-audit-copy`, `sf-redact` et `sf-enrich`.

Le master reste `sf-build`. Les deux readers sont read-only et peuvent travailler en parallele quand le runtime le permet, car ils ne modifient aucun fichier. Les executors et integrators restent responsables des edits, en sequentiel par defaut, avec parallelisme seulement si la spec ready prouve des write sets editoriaux exclusifs.

## Scope In

- Creer `skills/references/subagent-roles/editorial-reader.md`.
- Clarifier que `skills/references/subagent-roles/reader.md` reste le Technical Reader tant que la compatibilite avec la spec `sf-build` exige ce nom.
- Ajouter a `sf-build` l'orchestration de deux readers read-only: Technical Reader et Editorial Reader.
- Creer `docs/editorial/README.md` comme index de la couche editoriale.
- Creer `docs/editorial/page-intent-map.md` pour relier pages publiques, audiences, jobs, CTA, sources de verite et triggers de mise a jour.
- Creer `docs/editorial/claim-register.md` pour lister les claims publics sensibles, leur preuve, leur statut, leurs surfaces et leurs stop conditions.
- Creer `docs/editorial/editorial-update-gate.md` pour definir quand un changement code/produit/docs impose une mise a jour editoriale.
- Creer `templates/artifacts/editorial_content_context.md` pour standardiser les artefacts editoriaux hors runtime.
- Ajouter une reference partagee `skills/references/editorial-content-corpus.md` qui liste les documents a charger par l'Editorial Reader et les skills de contenu.
- Mettre a jour `CONTENT_MAP.md` et `templates/artifacts/content_map.md` pour mentionner `docs/editorial/`, le claim register, les page intents et les update gates.
- Mettre a jour `skills/sf-docs/SKILL.md` pour auditer et maintenir la couche editoriale.
- Mettre a jour `skills/sf-repurpose/SKILL.md` pour produire ou consommer un `Editorial Update Plan` quand le workstream a un impact public.
- Mettre a jour `skills/sf-audit-copy/SKILL.md` pour utiliser le claim register et la page intent map dans les proof gaps.
- Mettre a jour `skills/sf-redact/SKILL.md` et `skills/sf-enrich/SKILL.md` pour respecter la couche editoriale avant de creer ou enrichir du contenu public.
- Mettre a jour `shipflow-spec-driven-workflow.md`, `README.md` et les docs publiques pertinentes pour expliquer que les contenus publics font partie du gate de coherence quand le comportement utilisateur change.
- Definir un format standard `Editorial Update Plan`.
- Definir un format standard `Claim Impact Plan`.
- Definir les regles de parallelisme editorial safe.

## Scope Out

- Reecrire toutes les pages marketing de ShipFlow.
- Creer un blog, une newsletter, un calendrier editorial ou une strategie SEO complete.
- Remplacer `CONTENT_MAP.md`.
- Transformer l'Editorial Reader en executor, leader ou owner autonome du scope produit.
- Autoriser des edits paralleles sur `CONTENT_MAP.md`, `docs/editorial/claim-register.md`, `site/src/pages/index.astro`, nav/footer, pricing, FAQ, ou toute surface partagee sans assignation explicite.
- Ajouter du frontmatter ShipFlow aux contenus applicatifs Astro si le schema `site/src/content.config.ts` ne l'accepte pas.
- Publier des claims de securite, conformite, performance, economie, disponibilite, automatisation ou qualite IA sans preuve directe.
- Faire de `sf-redact` ou `sf-enrich` une source de verite produit; ils doivent rester bornes par les contrats et le registre de claims.

## Constraints

- Le master reste `sf-build`; l'Editorial Reader n'est pas un deuxieme leader.
- Tous les readers sont read-only: aucun edit, staging, formatage, generation de fichier, ou validation destructive.
- Les readers peuvent travailler en parallele uniquement parce qu'ils sont read-only; les edits restent sequentiels par defaut.
- Les fichiers editoriaux partages sont traites comme shared surfaces et doivent etre integres sequentiellement.
- Le code livre et les specs restent sources de verite pour le comportement; les pages publiques ne doivent pas inventer.
- `BUSINESS.md`, `PRODUCT.md`, `BRANDING.md`, `GTM.md`, `CONTENT_MAP.md` et `docs/editorial/` sont des decision/context contracts pour les claims publics.
- Les schemas runtime, notamment Astro content collections, priment sur le schema ShipFlow pour les fichiers rendus par l'application.
- Une page publique peut rester non mise a jour seulement si son item est marque `pending final copy`, avec raison, owner, condition de resolution, et blocage avant ship si la promesse devient fausse.
- Une update editoriale ne doit pas masquer une incertitude produit; elle doit poser une question ou marquer le claim comme non publie/non prouve.
- Toute nouvelle surface editoriale doit etre ajoutee a `CONTENT_MAP.md` ou explicitement documentee comme non cartographiee.

## Dependencies

- Local project docs: `CONTENT_MAP.md`, `BUSINESS.md`, `PRODUCT.md`, `BRANDING.md`, `GTM.md`, `README.md`, `shipflow-spec-driven-workflow.md`.
- Current public site: `site/src/pages/*.astro`, `site/src/content/skills/*.md`, `site/src/content.config.ts`, `site/src/components/NavBar.astro`, `site/src/components/Footer.astro`, `site/src/components/FaqSection.astro`, `site/src/components/PricingHypothesis.astro`.
- Workflow specs: `specs/sf-build-autonomous-master-skill.md`, `specs/shipflow-technical-documentation-layer-for-ai-agents.md`.
- Skills to update: `sf-build`, `sf-docs`, `sf-repurpose`, `sf-audit-copy`, `sf-redact`, `sf-enrich`.
- Fresh external docs: fresh-docs not needed. This spec changes local ShipFlow markdown instructions, editorial governance artifacts, and Astro content mapping rules already visible in the repo; it does not depend on a new external framework, SDK, service, API, auth flow, build integration, or current pricing/legal rule.
- Metadata gaps: `CONTENT_MAP.md` is draft and `specs/sf-build-autonomous-master-skill.md` is draft; `/sf-ready` must explicitly accept these dependencies or request a doc review first.

## Invariants

- Technical Reader diagnoses code and technical documentation impact.
- Editorial Reader diagnoses public content, claims, page intent, CTA, FAQ, support, and public documentation impact.
- Readers diagnose; executors and integrators apply.
- `CONTENT_MAP.md` remains the canonical content surface map.
- `docs/editorial/` becomes the code-adjacent editorial governance layer, not a content calendar.
- `claim-register.md` governs sensitive public claims; it does not prove claims by itself.
- `page-intent-map.md` maps page purpose and update triggers; it does not replace page content.
- Public copy must stay inside the bounds of product behavior, specs, business contracts, brand contracts, and evidence.
- Shared editorial surfaces are sequential integration surfaces.
- The final chantier cannot be considered cleanly closed if public content known to be impacted remains stale without a tracked exception.

## Links & Consequences

- Upstream systems: specs, build conversations, code diffs, technical reader reports, business/product/brand/GTM contracts, `CONTENT_MAP.md`, and site source files.
- Downstream systems: `sf-build` orchestration, `sf-docs update/audit`, `sf-repurpose`, `sf-audit-copy`, `sf-redact`, `sf-enrich`, public Astro pages, public skill pages, README, workflow docs, FAQ, pricing, support copy and changelog.
- Technical documentation layer: the Editorial Reader complements the Technical Reader; it does not replace `docs/technical/` or the `Documentation Update Plan`.
- Content governance layer: every user-visible behavior change should produce one of three outcomes: no editorial impact with reason, editorial update applied, or `pending final copy` with reason and resolution condition.
- Public claims: risky claims about security, privacy, compliance, AI reliability, automation quality, speed, cost savings, business outcomes, availability, or pricing need explicit proof or must be downgraded/removed.
- Execution safety: two readers can run concurrently because they are read-only; write-capable editorial executors cannot run concurrently unless a ready spec assigns exclusive target files.
- Site impact: `site/src/pages/index.astro`, `site/src/pages/docs.astro`, `site/src/pages/faq.astro`, `site/src/pages/pricing.astro`, `site/src/pages/skills/*.astro`, and `site/src/content/skills/*.md` become first-class editorial impact surfaces.

## Documentation Coherence

- `skills/references/subagent-roles/editorial-reader.md` must define an `Editorial Reader Agent Contract`: read-only strict, corpus to load, expected outputs, stop conditions, no edits, no staging, no public claim invention.
- `skills/references/subagent-roles/reader.md` should be clarified as Technical Reader or referenced as the existing Technical Reader role for compatibility.
- `skills/sf-build/SKILL.md` must load both reader contracts when editorial impact is possible and must merge `Documentation Update Plan` plus `Editorial Update Plan` before write execution.
- `docs/editorial/README.md` must explain purpose, surfaces, relation to `CONTENT_MAP.md`, relation to `docs/technical/`, and who edits what.
- `docs/editorial/page-intent-map.md` must list current public surfaces, canonical paths, page job, audience, CTA, source of truth, update triggers and shared-file risk.
- `docs/editorial/claim-register.md` must list sensitive claims, evidence, status, surfaces, owner, last review, next review and stop condition.
- `docs/editorial/editorial-update-gate.md` must define triggers, required checks, plan fields, pending final copy rules, and parallelism rules.
- `templates/artifacts/editorial_content_context.md` must provide metadata-bearing structure for editorial governance artifacts outside runtime content.
- `skills/references/editorial-content-corpus.md` must describe what the Editorial Reader and content skills should read first.
- `CONTENT_MAP.md` and `templates/artifacts/content_map.md` must mention the editorial governance layer and cross-surface update relationship.
- `skills/sf-docs/SKILL.md` must include an editorial-governance audit/update mode or subsection.
- `skills/sf-repurpose/SKILL.md` must route content packs through the claim register and page intent map when the output touches public surfaces.
- `skills/sf-audit-copy/SKILL.md` must use `claim-register.md` and `page-intent-map.md` as proof and mismatch references.
- `skills/sf-redact/SKILL.md` and `skills/sf-enrich/SKILL.md` must treat the editorial governance layer as a source of claim boundaries.
- `README.md`, `shipflow-spec-driven-workflow.md`, and public docs pages should mention editorial coherence only at a high level; they must not expose long internal role contracts as user-facing product copy.
- `CHANGELOG.md` is not part of this spec phase and should be updated later by `sf-end` after implementation and verification.

## Edge Cases

- A code change is purely internal: the Editorial Reader returns `no editorial impact` with a reason and no executor is launched for content.
- A bug fix changes visible behavior: the Editorial Reader checks FAQ, support copy, docs public pages, changelog candidates and any page that described the old behavior.
- A feature adds a capability but evidence is partial: the claim register may record it as `implemented` or `needs verification`, but public copy cannot present it as proven until verification passes.
- A page is not in `CONTENT_MAP.md`: the Editorial Reader reports `surface missing`; an executor updates `CONTENT_MAP.md` sequentially before dependent content changes are considered complete.
- `CONTENT_MAP.md` and `claim-register.md` both need updates: they are shared files and must be edited sequentially by one assigned executor or integrator.
- Two public skill pages can be updated in parallel only if a ready spec assigns one exclusive file per executor and no shared index/navigation/schema file is touched in the same wave.
- A collection schema rejects extra metadata: preserve the runtime schema and report ShipFlow context versions in the final report instead of forcing fields.
- A content executor wants to improve positioning beyond the spec: stop and ask, because positioning changes belong to business/GTM/brand contracts.
- The Technical Reader and Editorial Reader disagree about impact: the master or integrator reconciles before any write task.
- A claim is true in code but risky in marketing language: the claim register marks proof and allowed wording boundary; public copy uses the constrained wording.
- The user wants speed on a large content update: parallelism is allowed only for exclusive page files after shared maps/registers are stable.
- The public site has no blog/newsletter surface: the Editorial Reader reports the missing surface and does not invent paths.

## Implementation Tasks

- [ ] Task 1: Create the Editorial Reader role contract.
  - File: `skills/references/subagent-roles/editorial-reader.md`
  - Action: Add a read-only contract covering corpus to load, `Editorial Update Plan`, `Claim Impact Plan`, no-edit rules, public claim boundaries, parallel-read permission, and report format.
  - User story link: Gives ShipFlow a fresh-context role dedicated to public content impact without making it a second leader.
  - Depends on: None
  - Validate with: `test -f skills/references/subagent-roles/editorial-reader.md && rg -n "Editorial Reader Agent Contract|read-only|CONTENT_MAP|Editorial Update Plan|Claim Impact Plan|claim|page intent|no edits|no staging" skills/references/subagent-roles/editorial-reader.md`
  - Notes: The role must explicitly say that it diagnoses and never edits.

- [ ] Task 2: Clarify the existing Reader as the technical reader.
  - File: `skills/references/subagent-roles/reader.md`
  - Action: Clarify that the existing Reader focuses on technical/code-docs impact and remains compatible with existing `sf-build` references; mention that editorial impact belongs to `editorial-reader.md`.
  - User story link: Prevents one reader from accumulating both technical and editorial responsibilities.
  - Depends on: Task 1
  - Validate with: `rg -n "Technical Reader|code-docs|Documentation Update Plan|editorial-reader|Editorial Reader" skills/references/subagent-roles/reader.md`
  - Notes: Do not rename the file in this task unless `/sf-ready` explicitly approves the broader migration.

- [ ] Task 3: Add editorial reader orchestration to sf-build.
  - File: `skills/sf-build/SKILL.md`
  - Action: Add logic for launching Technical Reader and Editorial Reader as read-only roles, merging their plans, and blocking writes until conflicts or public claim risks are resolved.
  - User story link: Makes the master workflow aware of both code/docs and public content impact.
  - Depends on: Task 2
  - Validate with: `rg -n "Editorial Reader|Technical Reader|Editorial Update Plan|Claim Impact Plan|Documentation Update Plan|read-only readers|pending final copy" skills/sf-build/SKILL.md`
  - Notes: Readers may run in parallel because they are read-only; write-capable agents remain sequential by default.

- [ ] Task 4: Create the editorial governance index.
  - File: `docs/editorial/README.md`
  - Action: Explain purpose, relationship to `CONTENT_MAP.md`, relationship to `docs/technical/`, role boundaries, shared surfaces, and update workflow.
  - User story link: Gives fresh agents a stable entrypoint for editorial governance.
  - Depends on: Task 1
  - Validate with: `test -f docs/editorial/README.md && rg -n "CONTENT_MAP|docs/technical|Editorial Reader|claim|page intent|update gate|read-only|executor|integrator" docs/editorial/README.md`
  - Notes: Keep it short enough to be useful as first-read context.

- [ ] Task 5: Create the page intent map.
  - File: `docs/editorial/page-intent-map.md`
  - Action: Map current public pages and content collections to page job, audience, CTA, source of truth, update triggers, shared-file risk, and related surfaces.
  - User story link: Helps the Editorial Reader know which content surface is affected by a code or product change.
  - Depends on: Task 4
  - Validate with: `test -f docs/editorial/page-intent-map.md && rg -n "site/src/pages/index.astro|site/src/pages/docs.astro|site/src/pages/faq.astro|site/src/content/skills|audience|CTA|source of truth|update trigger" docs/editorial/page-intent-map.md`
  - Notes: Start with current ShipFlow pages; do not invent blog/newsletter paths.

- [ ] Task 6: Create the claim register.
  - File: `docs/editorial/claim-register.md`
  - Action: Add a register for sensitive public claims with claim text or claim family, allowed wording boundary, evidence, status, surfaces, owner, review date, and stop condition.
  - User story link: Prevents public copy from promising more than the code/specs/contracts support.
  - Depends on: Task 4
  - Validate with: `test -f docs/editorial/claim-register.md && rg -n "security|privacy|compliance|AI|automation|speed|cost|availability|evidence|allowed wording|stop condition|claim mismatch" docs/editorial/claim-register.md`
  - Notes: Initial entries may be claim families rather than every sentence on the site.

- [ ] Task 7: Create the editorial update gate.
  - File: `docs/editorial/editorial-update-gate.md`
  - Action: Define triggers, plan fields, statuses, pending final copy rules, parallelism safety, shared surfaces, and closure/ship stop conditions.
  - User story link: Makes editorial coherence a repeatable lifecycle gate, not an ad hoc memory.
  - Depends on: Tasks 5 and 6
  - Validate with: `test -f docs/editorial/editorial-update-gate.md && rg -n "Editorial Update Plan|Claim Impact Plan|pending final copy|shared surface|parallel|sequential|ship|closure|no editorial impact" docs/editorial/editorial-update-gate.md`
  - Notes: Align wording with `Documentation Update Gate` in the sf-build and technical-docs specs.

- [ ] Task 8: Add an editorial artifact template.
  - File: `templates/artifacts/editorial_content_context.md`
  - Action: Create a metadata-bearing template for editorial governance artifacts outside runtime content, including dependencies on business, product, brand, GTM, content map and claim register.
  - User story link: Standardizes durable editorial docs without breaking Astro runtime content schemas.
  - Depends on: Task 7
  - Validate with: `test -f templates/artifacts/editorial_content_context.md && rg -n "artifact: editorial_content_context|metadata_schema_version|artifact_version|depends_on|claim_register|page_intent|content_surfaces" templates/artifacts/editorial_content_context.md`
  - Notes: Do not require this template inside `site/src/content/**`.

- [ ] Task 9: Add the editorial content corpus reference.
  - File: `skills/references/editorial-content-corpus.md`
  - Action: List the documents, pages, content collections, skills and contracts that Editorial Reader and content skills must inspect first.
  - User story link: Gives content agents a compact, reusable loading list.
  - Depends on: Task 8
  - Validate with: `test -f skills/references/editorial-content-corpus.md && rg -n "CONTENT_MAP|BUSINESS|PRODUCT|BRANDING|GTM|docs/editorial|site/src/pages|site/src/content|sf-repurpose|sf-audit-copy" skills/references/editorial-content-corpus.md`
  - Notes: Keep it as a routing reference, not a duplicate of every doc.

- [ ] Task 10: Update CONTENT_MAP and its template.
  - File: `CONTENT_MAP.md`, `templates/artifacts/content_map.md`
  - Action: Add `docs/editorial/`, claim register, page intent map, and editorial update gate to content surfaces and cross-surface update rules.
  - User story link: Connects the new governance layer to the existing canonical content map.
  - Depends on: Tasks 4-7
  - Validate with: `rg -n "docs/editorial|claim-register|page-intent|editorial update|Editorial Reader|pending final copy" CONTENT_MAP.md templates/artifacts/content_map.md`
  - Notes: This task edits shared files and must be sequential.

- [ ] Task 11: Update sf-docs for editorial governance.
  - File: `skills/sf-docs/SKILL.md`
  - Action: Add audit/update instructions for `docs/editorial/`, page intent map, claim register, editorial update gate, and public content drift.
  - User story link: Lets documentation maintenance keep editorial governance current.
  - Depends on: Task 10
  - Validate with: `rg -n "editorial governance|docs/editorial|claim register|page intent|Editorial Update Plan|pending final copy|public content drift" skills/sf-docs/SKILL.md`
  - Notes: Do not weaken existing metadata/runtime content schema distinction.

- [ ] Task 12: Update sf-repurpose for editorial plans.
  - File: `skills/sf-repurpose/SKILL.md`
  - Action: Require `CONTENT_MAP.md`, page intent map and claim register checks when creating docs/marketing/site outputs from a workstream; emit editorial plan items when content should change.
  - User story link: Makes content repurposing faithful to product truth and claim boundaries.
  - Depends on: Task 11
  - Validate with: `rg -n "Editorial Update Plan|Claim Impact Plan|claim register|page intent|docs/editorial|pending final copy" skills/sf-repurpose/SKILL.md`
  - Notes: Preserve the existing source-faithful doctrine.

- [ ] Task 13: Update copy and content generation skills.
  - File: `skills/sf-audit-copy/SKILL.md`, `skills/sf-redact/SKILL.md`, `skills/sf-enrich/SKILL.md`
  - Action: Add instructions to read the editorial corpus, use claim register/page intent map for proof gaps, and avoid unsupported public claims.
  - User story link: Keeps generated and enriched copy aligned with code, specs and business contracts.
  - Depends on: Task 12
  - Validate with: `rg -n "claim register|page intent|docs/editorial|Editorial Reader|unsupported public claims|proof gap|claim mismatch" skills/sf-audit-copy/SKILL.md skills/sf-redact/SKILL.md skills/sf-enrich/SKILL.md`
  - Notes: Keep `sf-redact` and `sf-enrich` capable of writing runtime content while respecting project schemas.

- [ ] Task 14: Update workflow and public documentation.
  - File: `shipflow-spec-driven-workflow.md`, `README.md`, `site/src/pages/docs.astro`
  - Action: Explain editorial coherence at a high level: public content is checked when behavior changes, while internal role files remain implementation details.
  - User story link: Helps users understand why content updates are part of reliable agent-assisted delivery.
  - Depends on: Task 13
  - Validate with: `rg -n "editorial coherence|Editorial Reader|public content|claims|CONTENT_MAP|docs/editorial|pending final copy" shipflow-spec-driven-workflow.md README.md site/src/pages/docs.astro`
  - Notes: Keep public language concise; do not expose all internal role machinery.

- [ ] Task 15: Validate metadata, schemas and readiness.
  - File: `specs/shipflow-editorial-content-governance-layer-for-ai-agents.md`, `docs/editorial/`, `templates/artifacts/editorial_content_context.md`, modified skills/docs
  - Action: Run metadata lint, check Astro content schema has not been violated, run rg validations, and rerun `/sf-ready`.
  - User story link: Proves the spec can be implemented without breaking docs or runtime content.
  - Depends on: Tasks 1-14
  - Validate with: `"$SHIPFLOW_ROOT/tools/shipflow_metadata_lint.py" specs/shipflow-editorial-content-governance-layer-for-ai-agents.md docs/editorial templates/artifacts/editorial_content_context.md && cd site && npm run build`
  - Notes: If `site` build is too slow or dependencies are unavailable, report the exact blocker and run static schema checks instead.

## Acceptance Criteria

- [ ] AC 1: Given `sf-build` handles a chantier with possible public content impact, when it starts diagnostic work, then it can launch a Technical Reader and an Editorial Reader as separate read-only roles.
- [ ] AC 2: Given both readers run, when they complete, then the master has both a `Documentation Update Plan` and an `Editorial Update Plan` or explicit no-impact justifications.
- [ ] AC 3: Given the Editorial Reader finds a sensitive public claim affected by code or product behavior, when the claim lacks proof, then the plan marks `claim mismatch` or `needs proof` and no content executor publishes the stronger claim.
- [ ] AC 4: Given a user-visible behavior changes, when `sf-build` prepares closure, then impacted public docs, FAQ, landing, pricing, support, changelog candidates or skill pages are updated, marked no-impact with reason, or marked `pending final copy` with a resolution condition.
- [ ] AC 5: Given a public page is not listed in `CONTENT_MAP.md` or `page-intent-map.md`, when it is affected, then the Editorial Reader reports `surface missing` and shared map updates are handled sequentially.
- [ ] AC 6: Given an Editorial Reader is active, when it identifies files to change, then it does not edit, stage, format or validate destructively; it only reports paths, reasons, risks and plan items.
- [ ] AC 7: Given two readers are active in parallel, when neither writes files, then the workflow allows parallel read diagnostics; any write-capable follow-up remains sequential unless a ready spec defines exclusive write sets.
- [ ] AC 8: Given a ready spec defines editorial `Execution Batches` with one exclusive page file per executor and no shared file, when `sf-build` reaches that batch, then it may parallelize those edits and must integrate before the next batch.
- [ ] AC 9: Given a runtime content schema does not allow ShipFlow fields, when content files are edited, then no incompatible frontmatter is added and context versions are reported outside the runtime file.
- [ ] AC 10: Given `sf-redact` or `sf-enrich` generates public content, when a claim touches security, compliance, privacy, AI reliability, automation, speed, savings, availability, pricing or business outcomes, then it checks the claim register or downgrades the claim.
- [ ] AC 11: Given `sf-docs audit` runs after implementation, when editorial governance files exist, then it can flag stale page intents, stale claim evidence, missing surfaces and stale public content.
- [ ] AC 12: Given an agent fresh to the repo reads `docs/editorial/README.md`, when it needs to understand editorial governance, then it can find `CONTENT_MAP.md`, page intent map, claim register, update gate, and role boundaries without reading this conversation.
- [ ] AC 13: Given the implementation finishes, when validation runs, then metadata lint passes for ShipFlow artifacts and the Astro site build or static schema check confirms runtime content schemas were not broken.

## Test Strategy

- Unit: None, because this change is primarily markdown instructions, docs and workflow contracts.
- Static checks: run the `rg` validations listed in each implementation task.
- Metadata: run `$SHIPFLOW_ROOT/tools/shipflow_metadata_lint.py` on the new spec, `docs/editorial/`, and the new template.
- Runtime content safety: inspect `site/src/content.config.ts` and run `cd site && npm run build` after implementation to catch incompatible content frontmatter or broken page imports.
- Manual scenario 1: simulate a code-only refactor and verify Editorial Reader returns `no editorial impact` with reason.
- Manual scenario 2: simulate a user-visible feature change and verify Editorial Reader identifies landing/docs/FAQ/skill-page impacts or justifies no impact.
- Manual scenario 3: simulate a risky claim such as automation quality or speed improvement and verify the claim register blocks unsupported wording.
- Manual scenario 4: simulate two readers in parallel and verify no edits happen until the master merges plans.
- Manual scenario 5: simulate two editorial page updates in a ready batch and verify shared files remain sequential.
- Regression: verify `sf-build`, `sf-docs`, `sf-repurpose`, `sf-audit-copy`, `sf-redact`, and `sf-enrich` keep their existing purpose and do not become duplicate content registries.

## Risks

- Security impact: yes, because public claims can misrepresent security, privacy, compliance, permissions, data handling, or AI behavior; mitigated by claim register, proof states, and stop conditions.
- Product risk: high if public content promises more than the code/spec supports; mitigated by Editorial Reader, claim impact checks, and closure gates.
- Edit conflict risk: medium-high if multiple agents edit shared editorial maps or site-wide pages; mitigated by read-only readers, sequential shared-file edits, and spec-gated parallelism only for exclusive page files.
- Schema risk: medium if ShipFlow metadata is added to runtime content; mitigated by preserving Astro content schemas and putting ShipFlow metadata in governance artifacts instead.
- Documentation risk: medium if `docs/editorial/` becomes a content calendar or duplicate marketing strategy; mitigated by scope boundaries and `CONTENT_MAP.md` as canonical surface map.
- Workflow complexity risk: medium if two readers create too much process for small changes; mitigated by allowing `no editorial impact` with short justification for internal-only changes.
- Stale-contract risk: medium because `CONTENT_MAP.md` and `sf-build` specs are draft; mitigated by `/sf-ready` review and explicit dependency status.

## Execution Notes

- Read first: `CONTENT_MAP.md`, `BUSINESS.md`, `PRODUCT.md`, `BRANDING.md`, `GTM.md`, `skills/sf-repurpose/SKILL.md`, `skills/sf-audit-copy/SKILL.md`, `skills/sf-docs/SKILL.md`, `specs/sf-build-autonomous-master-skill.md`, `specs/shipflow-technical-documentation-layer-for-ai-agents.md`, `site/src/content.config.ts`.
- Implement in order: role contract, reader clarification, sf-build orchestration, docs/editorial foundation, maps/register/gate, template/reference, content map updates, skill integrations, workflow/public docs, validation.
- Safe parallel waves after foundation and readiness only: create `docs/editorial/page-intent-map.md` and `docs/editorial/claim-register.md` in parallel if each executor owns exactly one file; update shared files such as `CONTENT_MAP.md`, `sf-build`, `sf-docs`, `README.md`, and `shipflow-spec-driven-workflow.md` sequentially.
- Packages to avoid: no new package required.
- Abstractions to avoid: no second master/leader, no separate content registry outside the repo, no automatic claim publishing, no content calendar in this chantier.
- Commands to validate: task-level `rg` checks, metadata lint, `cd site && npm run build` if dependencies are available, then `/sf-ready ShipFlow Editorial Content Governance Layer for AI Agents`.
- Stop conditions: no clear boundary between Technical Reader and Editorial Reader, no acceptable shared-file sequencing, stale or contradictory business/brand/GTM contracts, incompatible Astro content schema, unsupported sensitive claims, or failure to preserve user changes in the dirty worktree.

## Open Questions

None.

The current vision is sufficient for a draft spec: add a second read-only Editorial Reader, keep `sf-build` as master, keep write execution sequential by default, and add spec-gated parallelism only for exclusive editorial files.

## Skill Run History

| Date UTC | Skill | Model | Action | Result | Next step |
|----------|-------|-------|--------|--------|-----------|
| 2026-05-01 10:05:10 UTC | sf-spec | GPT-5 Codex | Created spec for ShipFlow editorial content governance layer with dedicated Editorial Reader, editorial docs, claim register, page intent map, and update gate. | draft saved | /sf-ready ShipFlow Editorial Content Governance Layer for AI Agents |

## Current Chantier Flow

- `sf-spec`: done, draft spec created.
- `sf-ready`: not launched.
- `sf-start`: not launched.
- `sf-verify`: not launched.
- `sf-end`: not launched.
- `sf-ship`: not launched.

Next step: `/sf-ready ShipFlow Editorial Content Governance Layer for AI Agents`
