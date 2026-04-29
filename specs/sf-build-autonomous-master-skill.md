---
artifact: spec
metadata_schema_version: "1.0"
artifact_version: "0.2.0"
project: ShipFlow
created: "2026-04-29"
created_at: "2026-04-29 09:02:11 UTC"
updated: "2026-04-29"
updated_at: "2026-04-29 16:19:01 UTC"
status: ready
source_skill: sf-spec
source_model: "GPT-5 Codex"
scope: feature
owner: Diane
user_story: "En tant qu'utilisatrice finale ShipFlow non-developpeuse, je veux lancer une seule commande sf-build avec ma story et etre guidee par des questions utiles pendant qu'un workflow multi-agent autorise orchestre la spec, l'implementation, la verification, la cloture et le ship, afin d'obtenir un resultat implemente, verifie, clos et pousse sans piloter manuellement chaque skill."
confidence: high
risk_level: high
security_impact: yes
docs_impact: yes
linked_systems:
  - skills/sf-build/SKILL.md
  - skills/sf-spec/SKILL.md
  - skills/sf-ready/SKILL.md
  - skills/sf-start/SKILL.md
  - skills/sf-verify/SKILL.md
  - skills/sf-test/SKILL.md
  - skills/sf-end/SKILL.md
  - skills/sf-ship/SKILL.md
  - skills/sf-help/SKILL.md
  - skills/references/chantier-tracking.md
  - shipflow-spec-driven-workflow.md
  - README.md
  - TASKS.md
depends_on:
  - artifact: "BUSINESS.md"
    artifact_version: "1.1.0"
    required_status: "reviewed"
  - artifact: "PRODUCT.md"
    artifact_version: "1.1.0"
    required_status: "reviewed"
  - artifact: "GUIDELINES.md"
    artifact_version: "1.0.0"
    required_status: "reviewed"
  - artifact: "BRANDING.md"
    artifact_version: "1.0.0"
    required_status: "reviewed"
  - artifact: "README.md"
    artifact_version: "0.1.0"
    required_status: "draft"
  - artifact: "shipflow-spec-driven-workflow.md"
    artifact_version: "0.3.0"
    required_status: "draft"
  - artifact: "skills/references/chantier-tracking.md"
    artifact_version: "0.1.0"
    required_status: "draft"
supersedes: []
evidence:
  - "User decision 2026-04-29: create a user-facing master skill named sf-build."
  - "User decision 2026-04-29: sf-build must run the full flow through sf-end and sf-ship, not stop after implementation."
  - "User decision 2026-04-29: the user may be prompted multiple times, preferably via integrated prompts with prepared answers, to avoid regressions."
  - "User decision 2026-04-29: subagents are the intended default operating model so the master conversation stays high-level."
  - "Runtime and official docs constraint 2026-04-29: Codex subagents require explicit user request before spawning."
  - "User concern 2026-04-29: sf-build must not produce half-coded features or code/design regressions; it needs explicit guardrails around touching existing behavior."
  - "Repo investigation 2026-04-29: existing lifecycle skills already cover sf-spec, sf-ready, sf-start, sf-verify, sf-end, and sf-ship with chantier tracing."
  - "Repo investigation 2026-04-29: PRODUCT.md defines the user problem as lost context, weak handoffs, silent ambiguity, and incomplete verification."
  - "sf-ready 2026-04-29: previous draft was not ready because default subagents, integrated question fallback, freshness evidence, and changelog timing were underspecified."
next_step: "/sf-start sf-build Autonomous Master Skill"
---

# Spec: sf-build Autonomous Master Skill

## Title

sf-build Autonomous Master Skill

## Status

ready

## User Story

En tant qu'utilisatrice finale ShipFlow non-developpeuse, je veux lancer une seule commande `sf-build` avec ma story et etre guidee par des questions utiles pendant qu'un workflow multi-agent autorise orchestre la spec, l'implementation, la verification, la cloture et le ship, afin d'obtenir un resultat implemente, verifie, clos et pousse sans piloter manuellement chaque skill.

## Minimal Behavior Contract

Quand l'utilisatrice lance `sf-build` avec une intention, la skill devient le pilote unique du chantier: elle clarifie le besoin, obtient l'autorisation explicite requise avant tout lancement de sous-agent, cree ou rattache une spec, boucle readiness et correction jusqu'a un contrat executable, execute l'implementation, verifie, teste quand c'est pertinent, ferme avec `sf-end`, puis pousse avec `sf-ship` seulement si les gates passent. Si une decision de vision, scope, modification de l'existant, securite, donnees, validation, cloture, staging ou ship reste incertaine, `sf-build` pose une question concise avec options preparees et accepte une reponse libre; si l'outil de question integree n'est pas disponible, elle pose la meme question en texte simple et attend la reponse avant l'action dangereuse. L'edge case facile a rater est de confondre "multi-agent par defaut" avec "droit de spawn automatique": le modele recommande est multi-agent, mais aucun sous-agent ne peut etre lance sans demande ou accord explicite de l'utilisatrice dans le chantier courant.

## Success Behavior

- Preconditions: l'utilisatrice fournit une story, une tache, un bug, ou un objectif initial; le repo courant est identifiable; les lifecycle skills existantes restent disponibles; l'utilisatrice peut repondre aux questions de decision.
- Trigger: l'utilisatrice lance `/sf-build <story>` ou `$sf-build <story>`.
- User/operator result: la conversation master reste lisible et pilote seulement les decisions; elle demande explicitement l'autorisation multi-agent si l'invocation ne l'a pas deja fournie; elle pose des questions integrees ou plain-text quand une reponse change le scope, la vision produit, le droit de modifier l'existant, la securite, le design, les donnees, la validation, la cloture, le staging ou le ship.
- System effect: `sf-build` cree ou rattache une spec, trace son run quand une spec unique existe, boucle `sf-spec` et `sf-ready` jusqu'a readiness ou blocage, execute avec sous-agents seulement apres autorisation explicite et ownership non chevauchant, degrade en single-agent seulement apres accord, verifie, teste si pertinent, lance `sf-end`, puis lance `sf-ship` uniquement quand les gates de verification, cloture, bug risk, secret check et staging passent.
- Success proof: une spec de chantier existe avec `Skill Run History` et `Current Chantier Flow`; le rapport final mentionne le resultat, les validations passees, le mode d'execution utilise, le commit/push si `sf-ship` a reussi, les fichiers exclus du ship s'il y en a, et les limites de preuve restantes si elles existent.
- Silent success: not allowed; l'utilisatrice doit voir les decisions demandees, le statut haut niveau des phases, le mode multi-agent ou single-agent retenu, et le verdict final.

## Error Behavior

- Expected failures: story trop vague, plusieurs specs candidates, absence d'autorisation explicite pour sous-agents, outil de question integree indisponible, refus de degradation single-agent, scope en conflit avec l'existant, permission de toucher au design/code incertaine, readiness impossible, sous-agent bloque, sous-agents incompatibles, tests ou verification en echec, changements partiels, secrets ou fichiers non lies dans le dirty state, bug gate bloquante, push impossible.
- User/operator response: si une reponse utilisateur peut debloquer le chantier, `sf-build` pose une question concise avec 2 ou 3 options preparees plus une voie libre; sinon elle donne un blocage court avec la prochaine action et ne pretend jamais que le travail est livre.
- System effect: aucun sous-agent n'est lance sans autorisation explicite; pas de `sf-start` tant que la spec n'est pas ready; pas de `sf-end` complet tant que la user story n'est pas suffisamment verifiee; pas de `sf-ship` si les checks, la bug gate, le secret check, le scope de staging, ou la validation centrale echouent sans approbation explicite de l'utilisatrice.
- Must never happen: coder dans un scope non valide, modifier une surface existante sensible sans decision, utiliser le mode multi-agent sans demande ou accord explicite, ignorer un refus de readiness, shipper une feature a moitie codee, masquer une regression de design ou de comportement, committer des fichiers hors scope, utiliser `all-dirty` sans demande explicite, ecraser des changements utilisateur, ou presenter un rapport final technique long a une utilisatrice finale.
- Silent failure: not allowed; chaque etape bloquee doit etre resumee en termes de decision utilisateur, preuve manquante, validation ratee, ou contrainte runtime.

## Problem

Le workflow ShipFlow actuel est solide mais trop manuel pour le public cible. L'utilisatrice doit enchainer elle-meme `sf-spec`, `sf-ready`, parfois une nouvelle passe de `sf-spec`, puis `sf-start`, `sf-verify`, `sf-test`, `sf-end` et `sf-ship`. Cette mecanique expose trop de details et oblige l'utilisatrice a piloter un systeme que l'agent devrait orchestrer.

Le risque inverse est aussi important: si on cache tout a l'utilisateur, l'agent peut coder trop vite, toucher l'existant sans accord, rater la vision produit, lancer des sous-agents sans consentement explicite, ou shipper une regression. La bonne interface n'est donc pas "moins de questions"; c'est "moins de rapports techniques, plus de questions utiles et structurees avant les decisions dangereuses".

Le precedent passage `sf-ready` a montre que la spec devait distinguer trois choses: le modele produit souhaite, la politique runtime de sous-agents, et le fallback quand les prompts structures ne sont pas disponibles.

## Solution

Creer une nouvelle skill lifecycle `sf-build` qui sert d'orchestrateur user-facing. Elle conserve la conversation master comme cockpit haut niveau, recommande le multi-agent par defaut mais obtient l'autorisation explicite requise avant tout spawn, lance des sous-agents bornes quand le runtime et l'utilisateur l'autorisent, boucle spec/readiness jusqu'a contrat executable, pose des questions integrees ou plain-text quand la vision ou le risque l'exige, puis enchaine implementation, verification, test, `sf-end` et `sf-ship` seulement si les gates passent.

## Scope In

- Creer `skills/sf-build/SKILL.md` comme skill user-facing et lifecycle.
- Definir `sf-build` comme orchestrateur de bout en bout: intake, autorisation runtime, questions, spec, ready, start, verify, test, end, ship.
- Faire du multi-agent le modele recommande par defaut, tout en exigeant une demande ou un accord explicite avant tout sous-agent.
- Definir la degradation single-agent quand les sous-agents sont indisponibles ou non autorises, avec accord utilisateur obligatoire si le scope est non trivial.
- Garder la conversation master au niveau produit, decisions, statut court, et rapport final.
- Integrer une boucle `sf-spec` / `sf-ready` jusqu'a readiness, correction de spec, question utilisateur, ou blocage.
- Ajouter un protocole de questions avec options preparees pour vision, scope, modification de l'existant, design, donnees, securite, validation, fermeture, staging et ship.
- Definir le fallback plain-text quand l'outil de question integree ou `AskUserQuestion` n'est pas disponible.
- Definir les gates qui interdisent `sf-start`, `sf-end`, ou `sf-ship` quand le contrat ou les preuves sont insuffisants.
- Documenter comment `sf-build` interagit avec `sf-end` et `sf-ship`.
- Mettre a jour `sf-help`, `shipflow-spec-driven-workflow.md`, et les docs utilisateur pertinentes.
- Ajouter ou mettre a jour une entree `TASKS.md` pendant l'implementation si elle n'existe pas encore.

## Scope Out

- Supprimer ou remplacer les skills atomiques existantes.
- Rendre impossible l'usage manuel de `sf-spec`, `sf-ready`, `sf-start`, `sf-verify`, `sf-end`, ou `sf-ship`.
- Implementer une interface graphique.
- Garantir qu'aucune question ne sera jamais posee; au contraire, les questions sont un garde-fou central.
- Lancer automatiquement des sous-agents si la demande ou l'accord explicite manque.
- Lancer `sf-ship` sans controles ou sans decision explicite quand le ship est risque.
- Utiliser `all-dirty`, `ship-all`, ou equivalent sans demande explicite.
- Reverter automatiquement des changements utilisateur ou des fichiers hors scope.
- Modifier le comportement interne des lifecycle skills existantes sauf pour discoverability, matrice chantier, ou compatibilite documentaire explicitement listee.
- Transformer ShipFlow en systeme autonome sans responsabilite produit de l'utilisatrice.

## Constraints

- `sf-build` doit reduire le bruit technique dans la conversation, pas reduire la rigueur.
- Le multi-agent est le mode recommande, mais chaque sous-agent exige une autorisation explicite dans le chantier courant si l'invocation ne le demandait pas clairement.
- Une invocation claire comme `/sf-build --multi-agent <story>`, `/sf-build avec sous-agents <story>`, ou une reponse oui a la question de delegation suffit pour autoriser les sous-agents du chantier courant; une invocation simple `/sf-build <story>` ne suffit pas a elle seule.
- Chaque sous-agent doit avoir une mission bornee, un ownership de fichiers, une sortie synthetique, et aucune ecriture chevauchante avec un autre sous-agent.
- Le master agent reste responsable de l'integration, des decisions utilisateur, de la preservation des changements existants, et du verdict final.
- Les questions doivent etre posees avant l'action dangereuse, pas apres la regression.
- Les options preparees doivent toujours laisser une voie de reponse libre quand aucune option ne convient.
- Si `AskUserQuestion` ou un outil de prompt integre est indisponible, la skill pose une question plain-text courte et s'arrete jusqu'a reponse quand la decision change scope, securite, donnees, validation, cloture, staging ou ship.
- Les modifications de comportement existant, design system, permissions, donnees, API, contenu public, billing, secrets, migrations, ou actions destructives exigent une decision explicite si la spec ne les borne pas deja.
- Les rapports internes longs doivent rester dans la spec, les traces de chantier, ou les sorties de sous-agents; le rapport utilisateur final reste court.
- La skill doit respecter les regles existantes: ne pas ecraser les changements utilisateur, ne pas inventer de preuves, ne pas shipper si les checks bloquent.

## Dependencies

- Runtime local: systeme de skills ShipFlow, markdown specs, git, checks projet, et mecanismes existants `sf-end` / `sf-ship`.
- Runtime Codex: sous-agents disponibles dans Codex CLI/app, sous-agents lances uniquement sur demande ou accord explicite, heritent de la sandbox et des controles d'approbation du parent, et peuvent echouer si une approbation fraiche ne peut pas etre surfacee en mode non interactif.
- Prompt runtime: `AskUserQuestion` ou equivalent peut etre indisponible selon le mode; `sf-build` doit specifier un fallback plain-text.
- Document contracts: `BUSINESS.md` 1.1.0 reviewed, `PRODUCT.md` 1.1.0 reviewed, `GUIDELINES.md` 1.0.0 reviewed, `BRANDING.md` 1.0.0 reviewed, `README.md` 0.1.0 draft, `shipflow-spec-driven-workflow.md` 0.3.0 draft, `skills/references/chantier-tracking.md` 0.1.0 draft.
- Metadata gaps: `README.md`, `shipflow-spec-driven-workflow.md`, et `skills/references/chantier-tracking.md` sont encore en draft; `sf-ready` devra accepter explicitement cette dependance ou demander une revue documentaire prealable.
- Fresh external docs: fresh-docs checked. Sources consultees le 2026-04-29: OpenAI Codex CLI docs (`https://developers.openai.com/codex/cli`), OpenAI Codex Subagents docs (`https://developers.openai.com/codex/subagents`), OpenAI Codex Agent Internet Access docs (`https://developers.openai.com/codex/cloud/internet-access`), OpenAI Docs MCP docs (`https://developers.openai.com/learn/docs-mcp`). Decision: la spec peut s'appuyer sur les sous-agents Codex, mais doit exiger une demande ou autorisation explicite, limiter le fan-out, conserver les approvals/sandbox du parent, et ne pas donner d'acces internet ou externe non borne sans gate separee.

## Invariants

- Les skills atomiques restent les sources de verite de leur discipline; `sf-build` orchestre, il ne duplique pas tous leurs controles.
- Le flux spec-first reste durable dans `specs/`.
- La conversation master reste comprehensible pour une utilisatrice non-developpeuse.
- Les sous-agents ne peuvent pas etre lances sans demande ou accord explicite et ne peuvent pas ecrire sur les memes fichiers sans coordination explicite.
- Toute modification de l'existant doit etre bornee par la spec ou approuvee par l'utilisatrice.
- Une feature partiellement implementee ne peut pas etre cloturee comme livree.
- Un ship ne vaut pas verification produit; `sf-build` doit distinguer "pousse" de "prouve".
- `sf-build` doit preferer poser trop de questions produit utiles que trop peu quand une reponse evite une regression.
- `sf-build` ne doit jamais transformer une limite runtime en contournement silencieux; elle doit soit demander, soit degrader avec accord, soit bloquer.

## Links & Consequences

- Upstream systems: `sf-explore` peut rester une entree de reflexion, mais `sf-build` doit pouvoir absorber une story directement et declencher lui-meme une exploration courte si necessaire.
- Core lifecycle: `sf-spec`, `sf-ready`, `sf-start`, `sf-verify`, `sf-test`, `sf-end`, et `sf-ship` deviennent des etapes internes orchestrables.
- Runtime orchestration: `sf-build` doit expliciter quand il delegue, a quels sous-agents, avec quel ownership, et comment il integre les resultats.
- Chantier tracking: `sf-build` doit tracer son propre run dans la spec quand une spec unique existe et doit conserver les traces des sous-etapes.
- Task tracking: `sf-end` reste responsable des updates de cloture `TASKS.md` / `CHANGELOG.md`; `sf-build` ne doit pas reimplementer cette logique mais doit l'appeler au bon moment.
- Shipping: `sf-ship` reste responsable du commit/push; `sf-build` doit lui transmettre un scope clair et ne pas utiliser `all-dirty` sauf demande explicite.
- Help/docs: `sf-help` et `shipflow-spec-driven-workflow.md` doivent presenter `sf-build` comme entree recommandee pour utilisateur final, tout en gardant les skills atomiques pour usage expert.
- README/docs publiques: le public doit comprendre que `sf-build` pose les questions utiles, orchestre les gates, et n'est pas une promesse d'autonomie sans controle.
- Regression surface: design, code existant, docs publiques, tests, bugs, securite, approvals runtime et dirty git state deviennent des gates explicites avant fermeture ou ship.

## Documentation Coherence

- `skills/sf-build/SKILL.md` doit etre cree avec description, argument hint, canonical paths, chantier tracking, role lifecycle, workflow complet, question fallback et authorization gate pour sous-agents.
- `skills/references/chantier-tracking.md` doit ajouter `sf-build` comme skill lifecycle obligatoire.
- `skills/sf-help/SKILL.md` doit ajouter `sf-build` comme entree user-facing principale et expliquer quand utiliser les skills atomiques.
- `shipflow-spec-driven-workflow.md` doit ajouter le flux recommande: `sf-build` pour les utilisateurs finaux, skills atomiques pour controle expert ou reprise manuelle.
- `README.md` ou les docs publiques doivent mentionner que `sf-build` pose des questions utiles, demande l'autorisation multi-agent quand necessaire, et orchestre sans noyer l'utilisateur en details techniques.
- `TASKS.md` doit inclure le chantier d'implementation si l'equipe veut suivre le travail hors spec.
- `CHANGELOG.md` ne doit pas etre modifie pendant la phase spec ni comme prerequis de `sf-start`; il sera aligne par `sf-end` seulement apres implementation/verifications.
- Aucun guide, FAQ, onboarding, pricing ou screenshot connu hors `README.md`, `sf-help`, et `shipflow-spec-driven-workflow.md` n'est requis pour ce chantier.

## Edge Cases

- L'utilisatrice donne une story tres vague: `sf-build` commence par des questions guidees et ne cree pas de spec finale tant que l'acteur, le resultat, le scope et les exclusions ne sont pas stables.
- L'invocation ne demande pas explicitement des sous-agents: `sf-build` demande une autorisation multi-agent avant tout spawn, avec options "Autoriser multi-agent", "Rester single-agent", et "Arreter pour clarifier".
- L'utilisatrice refuse les sous-agents mais le scope est trop large: `sf-build` explique la degradation, demande si elle accepte le risque/latence single-agent, ou recommande de decouper le chantier.
- L'outil de question integree est indisponible: `sf-build` pose une question plain-text courte avec options numerotees et attend la reponse avant action dangereuse.
- L'utilisatrice demande un changement qui peut toucher l'existant: `sf-build` demande si l'on modifie l'existant, si l'on ajoute un comportement parallele, ou si l'on s'arrete pour spec plus stricte.
- Une readiness review echoue: `sf-build` lance une passe de correction de spec, puis une nouvelle readiness review, dans une limite explicite.
- La boucle spec/ready echoue plusieurs fois: `sf-build` s'arrete avec un blocage court et une question ou une recommandation, plutot que coder quand meme.
- Deux sous-agents proposent des changements incompatibles: le master agent integre ou relance une decision; il ne shippe pas un merge incoherent.
- Un sous-agent demande une approbation qui ne peut pas etre surfacee: `sf-build` traite l'etape comme bloquee, ferme ou stoppe le sous-agent, puis rapporte la decision manquante.
- Les tests passent mais `sf-verify` dit que la user story n'est pas tenue: pas de `sf-end` ni `sf-ship`; relance correction ou question utilisateur.
- `sf-end` veut marquer done mais la preuve est partielle: `sf-build` choisit cloture partielle ou demande confirmation explicite.
- `sf-ship` detecte des fichiers sales hors scope: `sf-build` demande le scope de staging ou stoppe; il ne shippe pas tout par defaut.
- L'utilisateur veut un ship malgre validation incomplete: `sf-build` demande confirmation explicite et le rapport dit que le ship est a risque.
- Des docs externes ou web non fiables sont consultees par un sous-agent: `sf-build` exige source officielle ou Context7/Docs MCP et garde l'internet non borne hors scope sauf decision separee.

## Implementation Tasks

- [ ] Task 1: Creer la skill `sf-build`
  - File: `skills/sf-build/SKILL.md`
  - Action: Ajouter une nouvelle skill lifecycle avec description, argument-hint, canonical paths, chantier tracking obligatoire, posture user-facing, et contrat d'orchestration de bout en bout.
  - User story link: Donne a l'utilisatrice une commande unique pour lancer un chantier complet.
  - Depends on: None
  - Validate with: `test -f skills/sf-build/SKILL.md && rg -n "sf-build|Trace category|Process role|sf-end|sf-ship|question|autorisation|subagent|sous-agent" skills/sf-build/SKILL.md`
  - Notes: Garder `sf-build` comme orchestrateur; ne pas copier toute la logique interne de chaque skill atomique.

- [ ] Task 2: Definir le protocole de questions et le fallback
  - File: `skills/sf-build/SKILL.md`
  - Action: Ajouter une section `Question Gate` qui prefere `AskUserQuestion` ou l'outil integre disponible, puis degrade en question plain-text avec options preparees et reponse libre quand l'outil est indisponible.
  - User story link: Remplace les rapports techniques par des decisions utilisateur utiles sans bloquer sur une UI de prompt absente.
  - Depends on: Task 1
  - Validate with: `rg -n "Question Gate|AskUserQuestion|plain-text|fallback|options|reponse libre|scope|existant|design|securite|ship" skills/sf-build/SKILL.md`
  - Notes: Les questions doivent etre nombreuses quand elles reduisent le risque; ne pas poser de questions purement techniques que l'agent peut resoudre seul.

- [ ] Task 3: Definir l'autorisation multi-agent et le modele de sous-agents
  - File: `skills/sf-build/SKILL.md`
  - Action: Exiger une demande ou autorisation explicite avant tout sous-agent, puis definir les sous-agents recommandes pour spec repair, readiness adverse, implementation, verification, test, end/ship preparation quand le runtime le permet.
  - User story link: Garde la conversation master au niveau cockpit tout en respectant la politique runtime Codex.
  - Depends on: Task 2
  - Validate with: `rg -n "autorisation explicite|explicit|spawn|sous-agent|subagent|default|ownership|master|max_threads|degradation single-agent" skills/sf-build/SKILL.md`
  - Notes: Si le runtime ne permet pas les sous-agents ou si l'utilisateur refuse, la skill doit demander confirmation avant degradation single-agent pour un chantier non trivial.

- [ ] Task 4: Implementer la boucle spec/readiness
  - File: `skills/sf-build/SKILL.md`
  - Action: Decrire la boucle `sf-spec` -> `sf-ready` -> correction spec -> nouvelle readiness, avec limite d'iterations, conditions de question utilisateur, conditions de blocage, et preservation de `Skill Run History`.
  - User story link: Supprime l'enchainement manuel que l'utilisatrice fait aujourd'hui.
  - Depends on: Task 3
  - Validate with: `rg -n "sf-spec|sf-ready|iteration|not ready|blocked|Skill Run History|Current Chantier Flow" skills/sf-build/SKILL.md`
  - Notes: Recommander 3 iterations par defaut avant blocage ou decision utilisateur.

- [ ] Task 5: Ajouter les gates anti-regression avant implementation
  - File: `skills/sf-build/SKILL.md`
  - Action: Definir les controles avant `sf-start`: dirty state baseline, fichiers/surfaces autorises, permission de toucher l'existant, design/docs impact, security/data impact, docs freshness, et stop conditions.
  - User story link: Evite qu'une demande simple devienne une regression code ou design.
  - Depends on: Task 4
  - Validate with: `rg -n "dirty|regression|existing|existant|design|security|securite|fresh-docs|stop" skills/sf-build/SKILL.md`
  - Notes: `sf-build` doit travailler avec les changements utilisateur existants, pas les reverter.

- [ ] Task 6: Integrer `sf-start`, `sf-verify`, et `sf-test`
  - File: `skills/sf-build/SKILL.md`
  - Action: Decrire comment l'implementation est lancee depuis une spec ready, comment la verification juge la user story, quand `sf-test` est requis, et comment les echecs retournent vers correction ou question.
  - User story link: Garantit que le resultat est verifie au-dela du simple code ecrit.
  - Depends on: Task 5
  - Validate with: `rg -n "sf-start|sf-verify|sf-test|user story|verification|manual|bug" skills/sf-build/SKILL.md`
  - Notes: `sf-test` doit etre requis pour flows manuels, UI, auth, prod, ou comportements que les tests automatises ne prouvent pas.

- [ ] Task 7: Integrer `sf-end` et `sf-ship`
  - File: `skills/sf-build/SKILL.md`
  - Action: Ajouter la cloture par `sf-end`, puis le ship par `sf-ship`, avec gates de validation, bug gate, secret check, scope de staging, choix quick/full, et confirmation explicite si risque restant.
  - User story link: Livre le parcours complet jusqu'a la cloture et au push sans commande manuelle supplementaire.
  - Depends on: Task 6
  - Validate with: `rg -n "sf-end|sf-ship|staging|commit|push|bug gate|secret|full|all-dirty" skills/sf-build/SKILL.md`
  - Notes: `sf-build` ne doit pas utiliser `all-dirty`, `ship-all`, ou equivalent sans demande explicite.

- [ ] Task 8: Mettre a jour la doctrine chantier pour `sf-build`
  - File: `skills/references/chantier-tracking.md`
  - Action: Ajouter `sf-build` dans la matrice comme `Trace category: obligatoire` et `Process role: lifecycle`, avec son role d'orchestrateur user-facing.
  - User story link: Le nouveau flux reste visible dans le registre de chantier.
  - Depends on: Task 1
  - Validate with: `rg -n "sf-build.*obligatoire|sf-build.*lifecycle|orchestrateur" skills/references/chantier-tracking.md`
  - Notes: Ne pas casser les classifications existantes.

- [ ] Task 9: Mettre a jour l'aide et la doc workflow
  - File: `skills/sf-help/SKILL.md`, `shipflow-spec-driven-workflow.md`, `README.md`
  - Action: Documenter `sf-build` comme entree recommandee pour utilisateur final, expliquer l'autorisation multi-agent, et conserver les skills atomiques comme mode expert ou reprise manuelle.
  - User story link: Rend le nouveau modele decouvrable sans expliquer toute la plomberie.
  - Depends on: Tasks 1-8
  - Validate with: `rg -n "sf-build|utilisateur final|user-facing|multi-agent|sous-agent|sf-spec -> sf-ready|sf-end|sf-ship" skills/sf-help/SKILL.md shipflow-spec-driven-workflow.md README.md`
  - Notes: Le texte public doit dire que `sf-build` pose des questions utiles, pas qu'il agit sans controle.

- [ ] Task 10: Ajouter la tache locale de suivi sans changelog premature
  - File: `TASKS.md`
  - Action: Ajouter ou mettre a jour le suivi de travail dans `TASKS.md` pendant `sf-start` si le chantier n'y est pas deja visible; ne pas modifier `CHANGELOG.md` dans cette tache.
  - User story link: Garde le chantier visible sans sur-vendre un travail non encore livre.
  - Depends on: Tasks 1-9
  - Validate with: `rg -n "sf-build|Autonomous Master Skill" TASKS.md`
  - Notes: `CHANGELOG.md` sera mis a jour uniquement par `sf-end` apres implementation et verification.

- [ ] Task 11: Valider la coherence finale de la spec et des docs modifiees
  - File: `specs/sf-build-autonomous-master-skill.md`, `skills/sf-build/SKILL.md`, `skills/sf-help/SKILL.md`, `skills/references/chantier-tracking.md`, `shipflow-spec-driven-workflow.md`, `README.md`
  - Action: Relire les instructions comme un agent frais, verifier que les gates subagents/questions/end/ship sont testables, puis relancer `/sf-ready sf-build Autonomous Master Skill`.
  - User story link: Donne une preuve que le nouveau workflow est executable sans relire cette conversation.
  - Depends on: Tasks 1-10
  - Validate with: `rg -n "autorisation explicite|Question Gate|plain-text|sf-end|sf-ship|all-dirty|fresh-docs" skills/sf-build/SKILL.md specs/sf-build-autonomous-master-skill.md`
  - Notes: Puis lancer `/sf-ready sf-build Autonomous Master Skill`. Si `sf-ready` echoue encore sur un point de contrat, ne pas implementer par-dessus; corriger la spec.

## Acceptance Criteria

- [ ] AC 1: Given une utilisatrice lance `/sf-build "je veux X"`, when la demande est non triviale, then `sf-build` cree ou rattache une spec, boucle readiness, puis ne lance l'implementation que quand la spec est ready.
- [ ] AC 2: Given l'invocation ne demande pas clairement des sous-agents, when `sf-build` veut utiliser le modele multi-agent, then il demande une autorisation explicite avant tout spawn.
- [ ] AC 3: Given l'utilisatrice autorise le multi-agent et le runtime le permet, when `sf-build` orchestre un chantier non trivial, then il lance des sous-agents bornes avec ownership clair et garde l'integration dans la conversation master.
- [ ] AC 4: Given le runtime ne permet pas les sous-agents ou l'utilisatrice les refuse, when `sf-build` detecte la limitation, then il demande si l'utilisatrice accepte une degradation single-agent, veut decouper le chantier, ou prefere arreter.
- [ ] AC 5: Given une decision produit, design, scope, donnees, securite, modification de l'existant, staging ou ship reste ambigue, when `sf-build` atteint cette decision, then il pose une question avec options preparees au lieu d'inventer.
- [ ] AC 6: Given l'outil de question integree est indisponible, when une decision materielle est requise, then `sf-build` pose une question plain-text courte avec options et attend la reponse avant de continuer.
- [ ] AC 7: Given `sf-ready` retourne `not ready`, when les gaps sont reparables sans decision utilisateur, then `sf-build` relance une passe de correction spec et une nouvelle readiness review dans la limite d'iterations.
- [ ] AC 8: Given `sf-verify` ou `sf-test` echoue sur la user story, when `sf-build` considere la cloture, then il interdit `sf-end` complet et `sf-ship` sauf decision explicite de ship a risque.
- [ ] AC 9: Given des fichiers sales hors scope existent, when `sf-build` arrive au ship, then il demande ou borne explicitement le staging et ne shippe pas tout par defaut.
- [ ] AC 10: Given l'utilisateur n'a pas explicitement demande `all-dirty` ou equivalent, when `sf-build` appelle `sf-ship`, then il transmet un scope de staging limite au chantier courant.
- [ ] AC 11: Given le travail est implemente et verifie, when `sf-build` termine, then il lance `sf-end`, puis `sf-ship`, et le rapport final reste court avec resultat, validations, mode d'execution, commit/push, fichiers exclus, et limites de preuve.
- [ ] AC 12: Given une utilisatrice relit la spec du chantier, when elle consulte `Skill Run History` et `Current Chantier Flow`, then elle voit le passage de `sf-build` et les etapes internes principales.
- [ ] AC 13: Given un agent frais lit `skills/sf-build/SKILL.md`, when il execute la skill, then il comprend les gates, les questions, les sous-agents, les stop conditions, les limites de scope et les docs a revalider sans relire cette conversation.

## Test Strategy

- Unit: None, because ShipFlow skills are markdown instruction artifacts without executable unit harness today.
- Static checks: run `rg` validations for `sf-build`, `Trace category`, `Process role`, `Question Gate`, `autorisation explicite`, `plain-text`, `sf-end`, `sf-ship`, `all-dirty`, `fresh-docs`, and `Current Chantier Flow` across the modified skill/docs.
- Integration: run metadata/readiness checks on the new skill and docs with `rg` validations, then run `/sf-ready sf-build Autonomous Master Skill`.
- Manual scenario 1: simulate vague story requiring questions; verify no final spec/implementation starts before actor, result, scope and exclusions are stable.
- Manual scenario 2: simulate plain `/sf-build "build X"` with no explicit subagent request; verify the first multi-agent spawn is blocked until authorization.
- Manual scenario 3: simulate `AskUserQuestion` unavailable; verify the plain-text fallback question is used and the action pauses.
- Manual scenario 4: simulate ready spec leading to implementation; verify subagents have disjoint ownership and master integrates.
- Manual scenario 5: simulate failed verification; verify no full `sf-end` or `sf-ship` happens without explicit risk acceptance.
- Regression: inspect `skills/sf-spec/SKILL.md`, `skills/sf-ready/SKILL.md`, `skills/sf-start/SKILL.md`, `skills/sf-verify/SKILL.md`, `skills/sf-test/SKILL.md`, `skills/sf-end/SKILL.md`, and `skills/sf-ship/SKILL.md` to ensure `sf-build` orchestrates rather than contradicts them.

## Risks

- Security impact: yes, mitigated by explicit gates for subagent authorization, permissions, data exposure, secrets, destructive actions, dirty state, verification, bug risk, staging and ship confirmation.
- Runtime authorization risk: high if "default subagents" is implemented as automatic spawn; mitigated by requiring explicit request or approval before any sub-agent.
- Product risk: high if `sf-build` hides too much; mitigated by asking more product questions while hiding only internal technical detail.
- Regression risk: high because a master skill can overstep; mitigated by scoped file ownership, readiness gates, verification gates, and no `all-dirty` ship by default.
- Operational risk: medium if the runtime cannot spawn subagents or surface approvals; mitigated by explicit degradation prompt, single-agent fallback only with consent, or clean stop.
- Prompt/tooling risk: medium if `AskUserQuestion` is unavailable; mitigated by plain-text fallback and stop-before-dangerous-action rule.
- Documentation risk: medium if docs keep advertising only the atomic flow or overpromise autonomy; mitigated by updating help, workflow docs, and README with the authorization and question model.
- Fresh docs risk: low after official Codex docs check, but `sf-start` must re-run freshness if it uses a concrete new Codex API, config file, plugin schema, or MCP integration beyond markdown instructions.

## Execution Notes

- Read first: `skills/sf-spec/SKILL.md`, `skills/sf-ready/SKILL.md`, `skills/sf-start/SKILL.md`, `skills/sf-verify/SKILL.md`, `skills/sf-test/SKILL.md`, `skills/sf-end/SKILL.md`, `skills/sf-ship/SKILL.md`, `skills/references/chantier-tracking.md`, `shipflow-spec-driven-workflow.md`.
- External docs already checked for this spec: `https://developers.openai.com/codex/subagents`, `https://developers.openai.com/codex/cli`, `https://developers.openai.com/codex/cloud/internet-access`, `https://developers.openai.com/learn/docs-mcp`.
- Implement in this order: create `sf-build`; add question gate and fallback; add explicit subagent authorization and topology; add spec/readiness loop; add anti-regression gates; add implementation/verify/test orchestration; add end/ship integration; update chantier doctrine; update help/workflow/README; update `TASKS.md`; run readiness.
- Packages to avoid: no new runtime package or SDK unless `sf-start` proves it is necessary and applies fresh-docs again.
- Patterns to follow: existing skill frontmatter, canonical paths section, chantier tracking block, exact `Trace category` / `Process role` wording, standard `Chantier` final block, and concise user-facing reports.
- Abstractions to avoid: do not build a second task registry, do not duplicate all checks from lifecycle skills, do not create a hidden state machine outside the markdown skill instructions.
- Commands to validate: `rg -n "sf-build" skills/sf-build/SKILL.md skills/sf-help/SKILL.md skills/references/chantier-tracking.md shipflow-spec-driven-workflow.md README.md`; `rg -n "autorisation explicite|Question Gate|plain-text|sf-end|sf-ship|all-dirty|fresh-docs" skills/sf-build/SKILL.md`; `/sf-ready sf-build Autonomous Master Skill`.
- Stop conditions: no unique interpretation of ship behavior, unresolved subagent consent semantics, disagreement with existing lifecycle skill contracts, missing decision about touching existing behavior, inability to preserve user changes in dirty worktree, failed verification gate, docs contract contradiction, or public docs that imply autonomy without user decision gates.
- Implementation boundary: do not alter the behavior of existing lifecycle skills unless needed for discoverability or matrix registration; `sf-build` should compose them first.

## Open Questions

None

Readiness note: the previous open questions are resolved by this spec. `sf-build` uses multi-agent as the recommended model, but must obtain explicit user request or approval before spawning subagents; if the prompt tool is unavailable, it uses plain-text questions; `CHANGELOG.md` is reserved for `sf-end`, not `sf-start`.

## Skill Run History

| Date UTC | Skill | Model | Action | Result | Next step |
|----------|-------|-------|--------|--------|-----------|
| 2026-04-29 09:02:11 UTC | sf-spec | GPT-5 Codex | Created spec for sf-build autonomous master skill | draft | /sf-ready sf-build autonomous master skill |
| 2026-04-29 10:16:26 UTC | sf-ready | GPT-5 Codex | Reviewed readiness; blocked on runtime authorization semantics for default subagents, integrated question fallback, and freshness evidence | not ready | /sf-spec sf-build Autonomous Master Skill |
| 2026-04-29 16:12:58 UTC | sf-spec | GPT-5 Codex | Revised spec to resolve readiness gaps around subagent consent, prompt fallback, fresh Codex docs, ship staging, and changelog timing | draft | /sf-ready sf-build Autonomous Master Skill |
| 2026-04-29 16:19:01 UTC | sf-ready | GPT-5 Codex | Validated revised spec structure, user story alignment, runtime consent semantics, security gates, fresh Codex docs, task ordering, and acceptance criteria | ready | /sf-start sf-build Autonomous Master Skill |

## Current Chantier Flow

- `sf-spec`: done, draft spec revised after readiness feedback.
- `sf-ready`: ready.
- `sf-start`: not launched.
- `sf-verify`: not launched.
- `sf-end`: not launched.
- `sf-ship`: not launched.

Next step: `/sf-start sf-build Autonomous Master Skill`
