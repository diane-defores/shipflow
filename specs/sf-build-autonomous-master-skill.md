---
artifact: spec
metadata_schema_version: "1.0"
artifact_version: "0.10.0"
project: ShipFlow
created: "2026-04-29"
created_at: "2026-04-29 09:02:11 UTC"
updated: "2026-05-01"
updated_at: "2026-05-01 08:54:18 UTC"
status: draft
source_skill: sf-spec
source_model: "GPT-5 Codex"
scope: feature
owner: Diane
user_story: "En tant qu'utilisatrice finale ShipFlow non-developpeuse, je veux lancer une seule commande sf-build avec ma story et etre guidee par des questions utiles pendant qu'un workflow delegue par defaut orchestre la spec, l'implementation, la verification, la cloture et le ship, afin d'obtenir un resultat implemente, verifie, clos et pousse sans piloter manuellement chaque skill."
confidence: high
risk_level: high
security_impact: yes
docs_impact: yes
linked_systems:
  - skills/sf-build/SKILL.md
  - skills/sf-spec/SKILL.md
  - skills/sf-ready/SKILL.md
  - skills/sf-model/SKILL.md
  - skills/sf-start/SKILL.md
  - skills/sf-verify/SKILL.md
  - skills/sf-test/SKILL.md
  - skills/sf-end/SKILL.md
  - skills/sf-ship/SKILL.md
  - skills/sf-help/SKILL.md
  - skills/references/chantier-tracking.md
  - skills/references/subagent-roles/reader.md
  - skills/references/subagent-roles/sequential-executor.md
  - skills/references/subagent-roles/wave-executor.md
  - skills/references/subagent-roles/integrator.md
  - GUIDELINES.md
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
    artifact_version: "1.2.0"
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
  - "User decision 2026-04-29: ShipFlow should standardize language by layer: English internal contracts, user-facing interaction in the user's active language, with proper French accents for French."
  - "User decision 2026-04-30: invoking sf-build itself means the user authorizes and expects subagents for the current chantier; sf-build should not ask repeatedly before launching bounded subagents."
  - "User decision 2026-04-30: before sf-start, sf-build should decide whether to run sf-model so large chantiers use the right model balance for efficiency, reliability, and token cost."
  - "User decision 2026-04-30: sf-build must continue a matching existing chantier by default and create a new spec only when the user story or outcome is genuinely new."
  - "User decision 2026-04-30: sf-build should delegate file-reading, editing, and validation to one bounded subagent at a time by default; parallel subagents are allowed only when a ready spec defines non-overlapping execution batches."
  - "User decision 2026-05-01: internal subagent roles should be documented as one reference file per role, not collapsed into one shared role file."
  - "User decision 2026-05-01: the Reader should use the project documentation corpus as context and should identify where technical documentation must be updated when code changes happen in separate execution workspaces."
  - "User decision 2026-05-01: technical documentation updates should happen at the end of each execution cycle or wave, before the next wave, unless explicitly marked pending final integration with a reason."
next_step: "/sf-ready sf-build Autonomous Master Skill"
---

# Spec: sf-build Autonomous Master Skill

## Title

sf-build Autonomous Master Skill

## Status

draft

## User Story

En tant qu'utilisatrice finale ShipFlow non-developpeuse, je veux lancer une seule commande `sf-build` avec ma story et etre guidee par des questions utiles pendant qu'un workflow delegue par defaut orchestre la spec, l'implementation, la verification, la cloture et le ship, afin d'obtenir un resultat implemente, verifie, clos et pousse sans piloter manuellement chaque skill.

## Minimal Behavior Contract

Quand l'utilisatrice lance `sf-build` avec une intention, cette invocation constitue une demande explicite de workflow delegue pour le chantier courant: la skill devient le pilote unique, garde la conversation master comme cockpit de decisions, cherche d'abord si une spec active couvre deja la meme promesse, cree ou rattache une spec, boucle readiness et correction jusqu'a un contrat executable, choisit ou confirme le bon routage modele avant `sf-start` quand le chantier est long, cher, ambigu ou a fort cout d'erreur, puis execute par delegation sequentielle par defaut: un sous-agent borne a la fois pour lire, modifier ou verifier des fichiers. Les roles internes sont documentes dans un fichier de reference par role (`reader`, `sequential-executor`, `wave-executor`, `integrator`) afin que chaque agent frais recoive un contrat court, auditable et non ambigu. Le Reader charge le corpus documentaire du projet, maintient une carte code-docs du chantier, et indique ou la documentation technique doit etre mise a jour quand les executors modifient le code dans des workspaces/zspaces separes; il produit un `Documentation Update Plan` mais reste read-only. Les mises a jour de documentation technique sont appliquees par le Sequential Executor ou l'Integrator a la fin de chaque gros bloc sequentiel ou wave parallele, puis relues par le Reader avant de lancer la wave suivante; une doc peut rester `pending final integration` uniquement si le comportement n'est pas encore stable et si la raison est tracee. Le parallelisme n'est autorise que si une spec ready contient des `Execution Batches` explicites, ordonnes par dependance, avec ownership de fichiers non chevauchant et preuve que les lots peuvent tourner sans conflit; si ces lots n'existent pas, `sf-build` route vers spec/readiness au lieu de paralleliser opportunistement. Si une decision de vision, scope, chantier existant vs nouveau chantier, modification de l'existant, parallelisme, securite, donnees, validation, cloture, staging ou ship reste incertaine, `sf-build` pose une question concise avec options preparees et accepte une reponse libre; si l'outil de question integree n'est pas disponible, elle pose la meme question en texte simple et attend la reponse avant l'action dangereuse. L'edge case facile a rater est de faire le travail fichier dans le master par confort, de lancer plusieurs sous-agents simultanement parce que ce serait plus rapide, de modifier le code sans aligner la doc technique entre deux waves, ou de creer une nouvelle spec alors qu'on continue le meme chantier: `sf-build` doit deleguer sequentiellement par defaut, n'utiliser le parallelisme que quand la spec le prouve safe, utiliser le Reader pour localiser les docs techniques impactees, appliquer ou tracer les updates docs avant la wave suivante, continuer par defaut une spec existante qui couvre la meme promesse, evaluer le routage modele avant l'implementation, et bloquer les sorties de scope, actions destructives, staging ambigu, `all-dirty`, ou ship risque.

## Success Behavior

- Preconditions: l'utilisatrice fournit une story, une tache, un bug, ou un objectif initial; le repo courant est identifiable; les lifecycle skills existantes restent disponibles; l'utilisatrice peut repondre aux questions de decision.
- Trigger: l'utilisatrice lance `/sf-build <story>` ou `$sf-build <story>`.
- User/operator result: la conversation master reste lisible et pilote seulement les decisions; les lectures de fichiers, edits, validations et rapports techniques restent dans des sous-agents sequentiels bornes par defaut; elle ne redemande pas l'autorisation de delegation pour chaque sous-agent du chantier courant; elle pose des questions integrees ou plain-text quand une reponse change le scope, la vision produit, le droit de modifier l'existant, le parallelisme, la securite, le design, les donnees, la validation, la cloture, le staging ou le ship.
- System effect: `sf-build` effectue un `Existing Chantier Check`, rattache ou met a jour une spec active quand elle couvre deja le besoin, cree une nouvelle spec seulement si la promesse ou le resultat attendu est nouveau, trace son run quand une spec unique existe, boucle `sf-spec` et `sf-ready` jusqu'a readiness ou blocage, applique une gate `sf-model` avant `sf-start` pour les chantiers high-risk, longs, multi-domaines, paralleles, ou couteux, execute par un sous-agent borne a la fois dans le scope courant, demande au Reader de maintenir la carte corpus-docs-code et le `Documentation Update Plan`, applique les updates docs techniques en fin de cycle par executor write-capable puis demande relecture Reader, autorise une vague parallele uniquement si la spec ready fournit des `Execution Batches` sans chevauchement d'ecriture, degrade en mode master/single-agent seulement apres accord si les sous-agents sont indisponibles, verifie, teste si pertinent, lance `sf-end`, puis lance `sf-ship` uniquement quand les gates de verification, cloture, bug risk, secret check et staging passent.
- Success proof: une spec de chantier existe avec `Skill Run History` et `Current Chantier Flow`; le rapport final mentionne le resultat, les validations passees, le mode d'execution utilise (`main-only`, `delegated sequential`, ou `spec-gated parallel`), le commit/push si `sf-ship` a reussi, les fichiers exclus du ship s'il y en a, et les limites de preuve restantes si elles existent.
- Silent success: not allowed; l'utilisatrice doit voir les decisions demandees, le statut haut niveau des phases, le mode d'execution retenu, les lots paralleles seulement s'ils existent, et le verdict final.

## Error Behavior

- Expected failures: story trop vague, plusieurs specs candidates, sous-agents indisponibles dans le runtime, outil de question integree indisponible, refus de degradation single-agent, demande de parallelisme sans `Execution Batches`, ownership de fichiers chevauchant, dependances entre lots mal ordonnees, scope en conflit avec l'existant, permission de toucher au design/code incertaine, readiness impossible, sous-agent bloque, sous-agents incompatibles, tests ou verification en echec, changements partiels, secrets ou fichiers non lies dans le dirty state, bug gate bloquante, push impossible.
- User/operator response: si une reponse utilisateur peut debloquer le chantier, `sf-build` pose une question concise avec 2 ou 3 options preparees plus une voie libre; sinon elle donne un blocage court avec la prochaine action et ne pretend jamais que le travail est livre.
- System effect: aucun sous-agent n'est lance hors du scope courant autorise par `sf-build`; aucun sous-agent write-capable ne tourne en parallele sans spec ready qui definit des `Execution Batches`; aucune wave suivante n'est lancee tant que les docs techniques impactees par la wave courante ne sont pas mises a jour ou marquees `pending final integration` avec raison; pas de `sf-start` tant que la spec n'est pas ready; pas de `sf-end` complet tant que la user story n'est pas suffisamment verifiee; pas de `sf-ship` si les checks, la bug gate, le secret check, le scope de staging, ou la validation centrale echouent sans approbation explicite de l'utilisatrice.
- Must never happen: coder dans un scope non valide, creer une nouvelle spec alors qu'une spec active couvre deja la meme promesse, modifier une surface existante sensible sans decision, utiliser le master pour des edits fichier de routine quand la delegation sequentielle est disponible, laisser les executors modifier du code sans evaluation du Reader sur les docs techniques impactees, lancer plusieurs sous-agents simultanement sans `Execution Batches` ready et ownership non chevauchant, redemander l'autorisation de delegation pour chaque sous-agent borne du chantier courant, ignorer un refus de readiness, shipper une feature a moitie codee, masquer une regression de design ou de comportement, committer des fichiers hors scope, utiliser `all-dirty` sans demande explicite, ecraser des changements utilisateur, ou presenter un rapport final technique long a une utilisatrice finale.
- Silent failure: not allowed; chaque etape bloquee doit etre resumee en termes de decision utilisateur, preuve manquante, validation ratee, ou contrainte runtime.

## Problem

Le workflow ShipFlow actuel est solide mais trop manuel pour le public cible. L'utilisatrice doit enchainer elle-meme `sf-spec`, `sf-ready`, parfois une nouvelle passe de `sf-spec`, puis `sf-start`, `sf-verify`, `sf-test`, `sf-end` et `sf-ship`. Cette mecanique expose trop de details et oblige l'utilisatrice a piloter un systeme que l'agent devrait orchestrer.

Le risque inverse est aussi important: si on cache tout a l'utilisateur, l'agent peut coder trop vite, toucher l'existant sans accord, rater la vision produit, sortir du scope autorise par la commande `sf-build`, ou shipper une regression. La bonne interface n'est donc pas "moins de questions"; c'est "moins de rapports techniques, plus de questions utiles et structurees avant les decisions dangereuses".

Le precedent passage `sf-ready` a montre que la spec devait distinguer trois choses: le modele produit souhaite, le consentement implicite fourni par la commande `sf-build`, et le fallback quand les prompts structures ne sont pas disponibles.

## Solution

Creer une nouvelle skill lifecycle `sf-build` qui sert d'orchestrateur user-facing. Elle conserve la conversation master comme cockpit haut niveau, considere l'invocation `sf-build` comme demande explicite de delegation pour le chantier courant, lance par defaut un sous-agent borne a la fois pour les travaux de lecture, edition et validation, autorise le parallelisme uniquement depuis des `Execution Batches` presents dans une spec ready, boucle spec/readiness jusqu'a contrat executable, pose des questions integrees ou plain-text quand la vision ou le risque l'exige, puis enchaine implementation, verification, test, `sf-end` et `sf-ship` seulement si les gates passent.

## Scope In

- Creer `skills/sf-build/SKILL.md` comme skill user-facing et lifecycle.
- Definir `sf-build` comme orchestrateur de bout en bout: intake, autorisation runtime, questions, spec, ready, model routing, start, verify, test, end, ship.
- Definir les trois modes d'execution: `main-only` pour reponse purement conversationnelle sans lecture/edition fichier, `delegated sequential` par defaut pour lecture/edition/validation, et `spec-gated parallel` uniquement quand une spec ready definit des lots paralleles sans chevauchement.
- Faire de la delegation sequentielle le mode normal de `sf-build`; l'invocation de `sf-build` vaut demande explicite de sous-agents bornes pour le chantier courant, executes un par un par defaut.
- Creer un fichier de reference par role interne sous `skills/references/subagent-roles/`: `reader.md`, `sequential-executor.md`, `wave-executor.md`, et `integrator.md`.
- Definir le Reader comme gardien read-only du corpus documentaire: il lit les specs, docs projet, README, guides techniques, workflow docs et contrats pertinents, puis produit une carte code-docs et un `Documentation Update Plan` pour savoir quelles docs techniques aligner apres les changements de code.
- Definir la `Documentation Update Gate`: apres chaque wave parallele ou gros bloc sequentiel, le Reader met a jour le `Documentation Update Plan`, un executor write-capable applique les docs techniques concernees, puis le Reader relit avant la wave suivante; exception seulement si l'item est marque `pending final integration` avec raison.
- Definir la degradation master/single-agent quand les sous-agents sont indisponibles, avec accord utilisateur obligatoire si le scope implique lecture, edition, verification, ship, ou travail non trivial.
- Garder la conversation master au niveau produit, decisions, statut court, et rapport final.
- Ajouter un `Existing Chantier Check` avant toute creation de spec: chercher les specs actives proches, continuer la spec existante si la meme user story/resultat/surface est deja couverte, demander si plusieurs candidates restent plausibles, et creer seulement si le chantier est nouveau.
- Ajouter une gate `Spec-Gated Parallelism`: si le chantier gagnerait a lancer plusieurs agents en meme temps, `sf-build` ne parallelise que si la spec ready contient des `Execution Batches` avec fichiers/surfaces exclusifs, dependances explicites, validations par lot et ordre d'integration; sinon il route vers `sf-spec`/`sf-ready`.
- Integrer une boucle `sf-spec` / `sf-ready` jusqu'a readiness, correction de spec, question utilisateur, ou blocage.
- Ajouter un protocole de questions avec options preparees pour vision, scope, modification de l'existant, design, donnees, securite, validation, fermeture, staging et ship.
- Appliquer la doctrine de langue ShipFlow: instructions internes de `sf-build` en anglais, questions et rapports utilisateur dans la langue active de l'utilisatrice.
- Ajouter une gate `sf-model` avant `sf-start`: obligatoire pour chantier high-risk, long, multi-domaines, parallele, ambigu, couteux en tokens, ou a fort cout d'erreur; optionnelle et ignorable pour petits deltas clairs.
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
- Lancer des sous-agents hors du scope courant autorise par la commande `sf-build`.
- Lancer plusieurs sous-agents en parallele hors `Execution Batches` explicites dans une spec ready.
- Collapser tous les contrats de roles internes dans un seul fichier ambigu ou les exposer comme skills user-facing separees.
- Faire des edits fichier dans le master par defaut quand la delegation sequentielle est disponible.
- Degrader en master/single-agent sans accord explicite quand la delegation est indisponible et que le chantier touche des fichiers ou une validation.
- Lancer `sf-ship` sans controles ou sans decision explicite quand le ship est risque.
- Utiliser `all-dirty`, `ship-all`, ou equivalent sans demande explicite.
- Reverter automatiquement des changements utilisateur ou des fichiers hors scope.
- Modifier le comportement interne des lifecycle skills existantes sauf pour discoverability, matrice chantier, ou compatibilite documentaire explicitement listee.
- Transformer ShipFlow en systeme autonome sans responsabilite produit de l'utilisatrice.

## Constraints

- `sf-build` doit reduire le bruit technique dans la conversation, pas reduire la rigueur.
- `sf-build` doit respecter la doctrine de langue: contrat interne en anglais, interaction utilisateur dans la langue active, et français accentué quand l'utilisatrice parle français.
- La delegation sequentielle est le mode normal de `sf-build`: une invocation simple `/sf-build <story>` ou `$sf-build <story>` vaut autorisation explicite de lancer des sous-agents bornes pour les travaux du chantier courant, un par un par defaut.
- Le master `sf-build` decide lui-meme quel sous-agent lancer ensuite et quelle mission lui donner; il ne redemande pas l'accord pour chaque sous-agent tant que l'action reste dans le scope courant, non destructive, et couverte par les gates de la spec.
- Le parallelisme est interdit par defaut: `sf-build` ne peut lancer plusieurs sous-agents simultanement que si une spec ready contient des `Execution Batches` avec ownership de fichiers/surfaces non chevauchant, dependances explicites, validations par lot, et ordre d'integration.
- Si `sf-build` envisage du parallelisme mais que la spec ne contient pas de lots d'execution safe, la prochaine action est une mise a jour de spec ou une readiness rerun, pas un lancement ad hoc.
- Avant de creer une spec, `sf-build` doit preferer continuer une spec existante qui partage la meme user story, le meme resultat attendu, les memes linked systems, ou le meme `Current Chantier Flow`; si plusieurs specs plausibles existent, il demande explicitement au lieu de deviner.
- Chaque sous-agent doit avoir une mission bornee, un ownership de fichiers, une sortie synthetique, et aucune ecriture chevauchante avec un autre sous-agent; en mode sequentiel, le master integre ou valide le resultat avant de lancer le sous-agent suivant.
- Chaque role interne doit avoir son propre fichier de reference court, stable et chargeable independamment; `sf-build` assemble ces contrats selon le mode d'execution au lieu de les enfouir dans un seul bloc.
- Le Reader doit etre le role qui relie corpus documentaire et code: quand les executors travaillent dans des workspaces/zspaces separes, il conserve la meilleure vue transversale des docs techniques a mettre a jour.
- Le Reader ne doit jamais editer la documentation lui-meme; il produit les chemins cibles, raisons, priorite et dependances documentaires pour que l'executor sequentiel ou l'integrator applique les updates.
- Une wave ou un cycle d'execution n'est pas considere termine tant que ses docs techniques impactees ne sont pas appliquees et relues, ou explicitement marquees `pending final integration` avec une raison testable.
- Le master agent reste responsable de l'integration, des decisions utilisateur, de la preservation des changements existants, et du verdict final.
- Les questions doivent etre posees avant l'action dangereuse, pas apres la regression.
- Les options preparees doivent toujours laisser une voie de reponse libre quand aucune option ne convient.
- Si `AskUserQuestion` ou un outil de prompt integre est indisponible, la skill pose une question plain-text courte et s'arrete jusqu'a reponse quand la decision change scope, securite, donnees, validation, cloture, staging ou ship.
- Les modifications de comportement existant, design system, permissions, donnees, API, contenu public, billing, secrets, migrations, ou actions destructives exigent une decision explicite si la spec ne les borne pas deja.
- Les rapports internes longs doivent rester dans la spec, les traces de chantier, ou les sorties de sous-agents; le rapport utilisateur final reste court.
- La skill doit respecter les regles existantes: ne pas ecraser les changements utilisateur, ne pas inventer de preuves, ne pas shipper si les checks bloquent.

## Dependencies

- Runtime local: systeme de skills ShipFlow, markdown specs, git, checks projet, et mecanismes existants `sf-end` / `sf-ship`.
- Runtime Codex: sous-agents disponibles dans Codex CLI/app, sous-agents lances uniquement sur demande ou accord explicite; pour `sf-build`, l'invocation de la commande est cette demande explicite de delegation pour le chantier courant. Les sous-agents heritent de la sandbox et des controles d'approbation du parent, et peuvent echouer si une approbation fraiche ne peut pas etre surfacee en mode non interactif. Le parallelisme reste une capacite optionnelle et spec-gated, pas une consequence automatique de cette autorisation.
- Prompt runtime: `AskUserQuestion` ou equivalent peut etre indisponible selon le mode; `sf-build` doit specifier un fallback plain-text.
- Document contracts: `BUSINESS.md` 1.1.0 reviewed, `PRODUCT.md` 1.1.0 reviewed, `GUIDELINES.md` 1.2.0 reviewed, `BRANDING.md` 1.0.0 reviewed, `README.md` 0.1.0 draft, `shipflow-spec-driven-workflow.md` 0.4.0 draft, `skills/references/chantier-tracking.md` 0.1.0 draft.
- Metadata gaps: `README.md`, `shipflow-spec-driven-workflow.md`, et `skills/references/chantier-tracking.md` sont encore en draft; `sf-ready` devra accepter explicitement cette dependance ou demander une revue documentaire prealable.
- Fresh external docs: fresh-docs checked. Sources consultees le 2026-04-29: OpenAI Codex CLI docs (`https://developers.openai.com/codex/cli`), OpenAI Codex Subagents docs (`https://developers.openai.com/codex/subagents`), OpenAI Codex Agent Internet Access docs (`https://developers.openai.com/codex/cloud/internet-access`), OpenAI Docs MCP docs (`https://developers.openai.com/learn/docs-mcp`). Decision: la spec peut s'appuyer sur les sous-agents Codex parce que l'invocation `sf-build` est une demande explicite de delegation; elle doit limiter le fan-out a un sous-agent write-capable a la fois sauf `Execution Batches` ready, conserver les approvals/sandbox du parent, et ne pas donner d'acces internet ou externe non borne sans gate separee.

## Invariants

- Les skills atomiques restent les sources de verite de leur discipline; `sf-build` orchestre, il ne duplique pas tous leurs controles.
- Le flux spec-first reste durable dans `specs/`.
- La conversation master reste comprehensible pour une utilisatrice non-developpeuse.
- Les sous-agents de `sf-build` sont autorises par l'invocation du chantier courant, mais ne peuvent pas sortir du scope courant ni ecrire sur les memes fichiers sans coordination explicite.
- Un seul sous-agent write-capable peut etre actif a la fois sauf si une spec ready definit des `Execution Batches` paralleles avec fichiers/surfaces exclusifs et dependances resolues.
- Si l'agent se demande s'il devrait paralleliser mais qu'aucune spec ready ne le dit explicitement, il doit considerer que la tache requiert d'abord une spec ou une mise a jour de spec.
- Toute modification de l'existant doit etre bornee par la spec ou approuvee par l'utilisatrice.
- Une feature partiellement implementee ne peut pas etre cloturee comme livree.
- Un ship ne vaut pas verification produit; `sf-build` doit distinguer "pousse" de "prouve".
- `sf-build` doit preferer poser trop de questions produit utiles que trop peu quand une reponse evite une regression.
- Les questions, choix préparés, mises à jour courtes et rapports finaux de `sf-build` doivent rester dans la langue active de l'utilisatrice; les instructions internes, noms de sections stables et critères techniques restent en anglais.
- `sf-build` ne doit jamais transformer une limite runtime en contournement silencieux; elle doit soit demander, soit degrader avec accord, soit bloquer.

## Links & Consequences

- Upstream systems: `sf-explore` peut rester une entree de reflexion, mais `sf-build` doit pouvoir absorber une story directement et declencher lui-meme une exploration courte si necessaire.
- Core lifecycle: `sf-spec`, `sf-ready`, `sf-start`, `sf-verify`, `sf-test`, `sf-end`, et `sf-ship` deviennent des etapes internes orchestrables.
- Existing chantier routing: `sf-build` doit traiter `specs/` comme registre durable, continuer un chantier existant quand il couvre deja la demande, et ne recommander une nouvelle spec que pour une nouvelle promesse utilisateur ou un nouveau resultat autonome.
- Runtime orchestration: `sf-build` doit expliciter quand il delegue, quel sous-agent sequentiel possede quel ownership, comment il integre les resultats, et quelles vagues paralleles sont autorisees seulement si la spec ready fournit des `Execution Batches`.
- Documentation orchestration: le Reader doit relier les changements prevus ou observes aux surfaces documentaires (`docs/`, `README.md`, guides techniques, workflow docs, specs, references internes), donner au master un plan de mise a jour a chaque fin de cycle/wave, relire les docs appliquees, et bloquer la wave suivante sauf update effectif ou `pending final integration` justifie.
- Model routing: `sf-model` reste une skill helper non tracante; `sf-build` peut l'utiliser comme gate de decision avant `sf-start` sans ecrire de trace chantier separee.
- Chantier tracking: `sf-build` doit tracer son propre run dans la spec quand une spec unique existe et doit conserver les traces des sous-etapes.
- Task tracking: `sf-end` reste responsable des updates de cloture `TASKS.md` / `CHANGELOG.md`; `sf-build` ne doit pas reimplementer cette logique mais doit l'appeler au bon moment.
- Shipping: `sf-ship` reste responsable du commit/push; `sf-build` doit lui transmettre un scope clair et ne pas utiliser `all-dirty` sauf demande explicite.
- Help/docs: `sf-help` et `shipflow-spec-driven-workflow.md` doivent presenter `sf-build` comme entree recommandee pour utilisateur final, tout en gardant les skills atomiques pour usage expert.
- README/docs publiques: le public doit comprendre que `sf-build` pose les questions utiles, orchestre les gates, et n'est pas une promesse d'autonomie sans controle.
- Regression surface: design, code existant, docs publiques, tests, bugs, securite, approvals runtime et dirty git state deviennent des gates explicites avant fermeture ou ship.

## Documentation Coherence

- `skills/sf-build/SKILL.md` doit etre cree avec description, argument hint, canonical paths, chantier tracking, role lifecycle, workflow complet, question fallback et regle "invocation = consentement a la delegation bornee" pour les sous-agents.
- `skills/sf-build/SKILL.md` doit inclure une section `Existing Chantier Check` avant tout lancement ou creation de spec.
- `skills/sf-build/SKILL.md` doit inclure une section `Execution Modes` ou equivalente: `main-only` pour reponse purement conversationnelle, `delegated sequential` par defaut pour lecture/edition/validation, et `spec-gated parallel` uniquement depuis des `Execution Batches` ready.
- `skills/sf-build/SKILL.md` doit inclure une section `Spec-Gated Parallelism` qui interdit le parallelisme opportuniste et route vers `sf-spec`/`sf-ready` quand les lots paralleles ne sont pas definis.
- `skills/sf-build/SKILL.md` doit inclure une section `Documentation Update Gate` qui impose la mise a jour docs a la fin de chaque cycle/wave avant la suite, avec exception `pending final integration`.
- `skills/references/subagent-roles/reader.md` doit definir le Reader Agent Contract: read-only strict, corpus documentaire a charger, cartographie des fichiers/dependances/risques, carte code-docs, propositions de lots, `Documentation Update Plan`, aucun edit, aucun staging, aucune validation destructive.
- `skills/references/subagent-roles/sequential-executor.md` doit definir le Sequential Executor Contract: un seul actif par defaut, write set assigne, application des updates docs techniques approuvees par le Reader, stop si un fichier hors scope devient necessaire, resume des edits/validations/risques restants.
- `skills/references/subagent-roles/wave-executor.md` doit definir le Wave Executor Contract: temporaire, uniquement appele depuis `Execution Batches` ready, write set exclusif, interdiction des surfaces partagees sauf assignation explicite.
- `skills/references/subagent-roles/integrator.md` doit definir l'Integrator Contract: role master ou executor sequentiel charge d'integrer entre waves, detecter conflits, relancer validation et autoriser la wave suivante seulement apres preuve.
- `skills/sf-build/SKILL.md` doit inclure une `Model Routing Gate` avant `sf-start`, avec appel ou raisonnement `sf-model` quand le chantier est gros, parallele, high-risk, long, ambigu, ou couteux.
- `skills/sf-build/SKILL.md` doit être écrit comme contrat interne en anglais, tout en exigeant que les questions et rapports utilisateur soient produits dans la langue active de l'utilisatrice.
- `skills/references/chantier-tracking.md` doit ajouter `sf-build` comme skill lifecycle obligatoire.
- `skills/sf-help/SKILL.md` doit ajouter `sf-build` comme entree user-facing principale et expliquer quand utiliser les skills atomiques.
- `shipflow-spec-driven-workflow.md` doit ajouter le flux recommande: `sf-build` pour les utilisateurs finaux, skills atomiques pour controle expert ou reprise manuelle.
- `README.md` ou les docs publiques doivent mentionner que lancer `sf-build` autorise la delegation sequentielle du chantier courant, que le parallelisme n'arrive que sur spec ready avec lots sans chevauchement, que la skill pose seulement les questions utiles hors routine, et qu'elle orchestre sans noyer l'utilisateur en details techniques.
- Les role reference files restent internes et ne doivent pas etre presentes comme commandes utilisateur; la documentation publique parle du comportement `sf-build`, pas de `/sf-reader` ou `/sf-executor`.
- `TASKS.md` doit inclure le chantier d'implementation si l'equipe veut suivre le travail hors spec.
- `CHANGELOG.md` ne doit pas etre modifie pendant la phase spec ni comme prerequis de `sf-start`; il sera aligne par `sf-end` seulement apres implementation/verifications.
- Aucun guide, FAQ, onboarding, pricing ou screenshot connu hors `README.md`, `sf-help`, et `shipflow-spec-driven-workflow.md` n'est requis pour ce chantier.

## Edge Cases

- L'utilisatrice donne une story tres vague: `sf-build` commence par des questions guidees et ne cree pas de spec finale tant que l'acteur, le resultat, le scope et les exclusions ne sont pas stables.
- L'utilisatrice demande une clarification ou extension qui touche une spec active: `sf-build` continue cette spec par defaut au lieu de creer un nouveau chantier.
- Plusieurs specs actives semblent proches: `sf-build` demande laquelle continuer ou si la demande est un nouveau chantier, puis attend la reponse.
- L'utilisatrice lance simplement `/sf-build <story>`: `sf-build` traite cette invocation comme consentement a la delegation pour le chantier courant et lance les sous-agents bornes necessaires en sequentiel par defaut sans redemander a chaque fois.
- L'utilisatrice demande un micro-fix qui implique lire ou modifier un fichier: `sf-build` garde le master propre et delegue le micro-fix a un sous-agent sequentiel borne, sauf si la demande est une reponse purement conversationnelle sans action fichier.
- Un executor modifie le code dans un workspace/zspace separe: le Reader compare le changement prevu ou resume avec le corpus documentaire, puis indique les docs techniques a mettre a jour avant `sf-end`.
- Une wave se termine avec des docs techniques impactees: le Sequential Executor ou l'Integrator applique les updates docs, le Reader relit, puis seulement apres l'Integrator autorise la wave suivante.
- Une doc depend d'un comportement encore instable: l'item reste dans le `Documentation Update Plan` avec statut `pending final integration`, raison explicite, et condition de resolution avant `sf-end`.
- Une spec ready contient des `Execution Batches` avec write sets exclusifs: `sf-build` peut lancer les agents d'un meme batch en parallele, puis integrer les resultats avant de passer au batch suivant.
- Le chantier semble trop gros pour etre rapide en sequentiel mais la spec ne contient pas de lots paralleles: `sf-build` ne parallelise pas; il met a jour la spec ou relance `sf-ready` pour obtenir un graphe de dependances et des lots safe.
- Le chantier est gros, multi-domaines ou couteux: `sf-build` lance ou applique `sf-model` avant `sf-start` pour choisir le modele principal, le reasoning, et les fallbacks rapides/economiques.
- Le chantier est petit et clair: `sf-build` peut documenter que `sf-model` n'est pas necessaire et continuer avec le modele courant sans bloquer.
- L'utilisatrice refuse les sous-agents ou le runtime ne les permet pas: `sf-build` explique la degradation, demande si elle accepte le risque/latence master/single-agent, ou recommande de decouper le chantier.
- L'outil de question integree est indisponible: `sf-build` pose une question plain-text courte avec options numerotees et attend la reponse avant action dangereuse.
- L'utilisatrice demande un changement qui peut toucher l'existant: `sf-build` demande si l'on modifie l'existant, si l'on ajoute un comportement parallele, ou si l'on s'arrete pour spec plus stricte.
- Une readiness review echoue: `sf-build` lance une passe de correction de spec, puis une nouvelle readiness review, dans une limite explicite.
- La boucle spec/ready echoue plusieurs fois: `sf-build` s'arrete avec un blocage court et une question ou une recommandation, plutot que coder quand meme.
- Deux sous-agents proposent des changements incompatibles: en mode sequentiel, le master stoppe avant de lancer le suivant ou demande correction; en mode parallele spec-gated, le master integre ou relance une decision; il ne shippe pas un merge incoherent.
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
  - Action: Ajouter une section `Question Gate` qui prefere `AskUserQuestion` ou l'outil integre disponible, puis degrade en question plain-text avec options preparees et reponse libre quand l'outil est indisponible. Les questions utilisateur doivent etre dans la langue active de l'utilisatrice, avec français accentué quand la conversation est en français.
  - User story link: Remplace les rapports techniques par des decisions utilisateur utiles sans bloquer sur une UI de prompt absente.
  - Depends on: Task 1
  - Validate with: `rg -n "Question Gate|AskUserQuestion|plain-text|fallback|options|reponse libre|scope|existant|design|securite|ship" skills/sf-build/SKILL.md`
  - Notes: Les questions doivent etre nombreuses quand elles reduisent le risque; ne pas poser de questions purement techniques que l'agent peut resoudre seul.

- [ ] Task 3: Definir la delegation sequentielle par defaut et le parallelisme spec-gated
  - File: `skills/sf-build/SKILL.md`
  - Action: Definir que l'invocation de `sf-build` autorise la delegation bornee du chantier courant; etablir `delegated sequential` comme mode par defaut pour spec repair, readiness adverse, implementation, verification, test, end/ship preparation; interdire le parallelisme sauf si une spec ready fournit des `Execution Batches` sans chevauchement et avec dependances explicites.
  - User story link: Garde la conversation master au niveau cockpit tout en respectant la politique runtime Codex.
  - Depends on: Task 2
  - Validate with: `rg -n "Execution Modes|delegated sequential|Spec-Gated Parallelism|Execution Batches|invocation.*sf-build|autorise.*delegation|sous-agent|subagent|ownership|master|max_threads|degradation single-agent" skills/sf-build/SKILL.md`
  - Notes: Si le runtime ne permet pas les sous-agents ou si l'utilisateur refuse, la skill doit demander confirmation avant degradation master/single-agent pour un chantier qui touche des fichiers, validations ou ship.

- [ ] Task 3a: Creer le contrat Reader Agent
  - File: `skills/references/subagent-roles/reader.md`
  - Action: Ajouter un contrat read-only strict pour le reader persistant: corpus documentaire a charger, contexte code a collecter, carte code-docs, `Documentation Update Plan`, sorties attendues, interdictions d'edition/staging/formatage, et format de rapport court au master.
  - User story link: Garde un contexte technique propre sans polluer la conversation master ni risquer des edits.
  - Depends on: Task 3
  - Validate with: `test -f skills/references/subagent-roles/reader.md && rg -n "Reader Agent Contract|read-only|documentation corpus|code-docs|Documentation Update Plan|no edits|dependencies|risks|write sets|report" skills/references/subagent-roles/reader.md`
  - Notes: Le reader peut proposer des lots, risques et cibles documentaires, mais ne doit jamais modifier de fichier.

- [ ] Task 3b: Creer le contrat Sequential Executor
  - File: `skills/references/subagent-roles/sequential-executor.md`
  - Action: Ajouter un contrat d'execution sequentielle: un seul executor write-capable actif par defaut, write set assigne, application des updates docs techniques approuvees par le Reader, stop conditions, validations attendues, et resume de sortie.
  - User story link: Permet l'execution deleguee sans conflit d'edition par defaut.
  - Depends on: Task 3a
  - Validate with: `test -f skills/references/subagent-roles/sequential-executor.md && rg -n "Sequential Executor Contract|one active|write set|assigned files|documentation update|stop|validation|summary" skills/references/subagent-roles/sequential-executor.md`
  - Notes: Ce role gere les micro-fixes, l'execution normale et les corrections apres verification.

- [ ] Task 3c: Creer le contrat Wave Executor
  - File: `skills/references/subagent-roles/wave-executor.md`
  - Action: Ajouter un contrat d'executor temporaire pour batches paralleles: uniquement depuis `Execution Batches` ready, write set exclusif, interdiction des surfaces partagees sauf assignation explicite, sortie integrable.
  - User story link: Permet la rapidite sur gros chantiers uniquement quand le parallelisme est prouve safe.
  - Depends on: Task 3b
  - Validate with: `test -f skills/references/subagent-roles/wave-executor.md && rg -n "Wave Executor Contract|Execution Batches|exclusive|write set|shared files|temporary|integration" skills/references/subagent-roles/wave-executor.md`
  - Notes: Les fichiers partages comme configs, lockfiles, exports centraux, README, TASKS et changelog doivent rester hors wave sauf assignation explicite.

- [ ] Task 3d: Creer le contrat Integrator
  - File: `skills/references/subagent-roles/integrator.md`
  - Action: Ajouter un contrat d'integration entre sous-agents et waves: verifier les sorties, detecter conflits, integrer les changements, verifier que les docs techniques impactees sont appliquees ou marquees `pending final integration`, relancer validations, et autoriser la wave suivante seulement apres preuve.
  - User story link: Maintient la responsabilite du master sur la coherence finale et evite les merges incoherents.
  - Depends on: Task 3c
  - Validate with: `test -f skills/references/subagent-roles/integrator.md && rg -n "Integrator Contract|conflicts|merge|wave|Documentation Update Plan|pending final integration|validation|next wave|master" skills/references/subagent-roles/integrator.md`
  - Notes: Ce role peut etre incarne par le master ou par l'executor sequentiel, mais jamais par un wave executor concurrent.

- [ ] Task 4: Implementer la boucle spec/readiness
  - File: `skills/sf-build/SKILL.md`
  - Action: Decrire la boucle `sf-spec` -> `sf-ready` -> correction spec -> nouvelle readiness, avec limite d'iterations, conditions de question utilisateur, conditions de blocage, et preservation de `Skill Run History`.
  - User story link: Supprime l'enchainement manuel que l'utilisatrice fait aujourd'hui.
  - Depends on: Task 3d
  - Validate with: `rg -n "sf-spec|sf-ready|iteration|not ready|blocked|Skill Run History|Current Chantier Flow" skills/sf-build/SKILL.md`
  - Notes: Recommander 3 iterations par defaut avant blocage ou decision utilisateur.

- [ ] Task 4b: Ajouter l'Existing Chantier Check
  - File: `skills/sf-build/SKILL.md`
  - Action: Avant toute creation de spec, ajouter une gate qui cherche les specs actives proches, compare user story, resultat attendu, linked systems, fichiers/surfaces et `Current Chantier Flow`, puis choisit update, nouvelle spec, ou question utilisateur si ambigu.
  - User story link: Evite de fragmenter un chantier en plusieurs specs quand l'utilisatrice continue en realite le meme travail.
  - Depends on: Task 4
  - Validate with: `rg -n "Existing Chantier Check|specs/|Current Chantier Flow|user story|linked systems|nouveau chantier|existing chantier" skills/sf-build/SKILL.md`
  - Notes: Default = continuer une spec existante; nouvelle spec seulement si nouvelle promesse ou nouveau resultat autonome.

- [ ] Task 5: Ajouter les gates anti-regression avant implementation
  - File: `skills/sf-build/SKILL.md`
  - Action: Definir les controles avant `sf-start`: dirty state baseline, fichiers/surfaces autorises, permission de toucher l'existant, design/docs impact, security/data impact, docs freshness, `Documentation Update Gate`, et stop conditions.
  - User story link: Evite qu'une demande simple devienne une regression code ou design.
  - Depends on: Task 4b
  - Validate with: `rg -n "dirty|regression|existing|existant|design|Documentation Update Gate|pending final integration|security|securite|fresh-docs|stop" skills/sf-build/SKILL.md`
  - Notes: `sf-build` doit travailler avec les changements utilisateur existants, pas les reverter.

- [ ] Task 6: Ajouter la gate `sf-model` avant `sf-start`
  - File: `skills/sf-build/SKILL.md`
  - Action: Ajouter une section `Model Routing Gate` qui decide si `sf-model` doit etre lance ou applique avant `sf-start`, selon complexite, duree, cout d'erreur, parallelisme spec-gated, budget token, latence et besoin d'efficacite.
  - User story link: Evite de lancer un gros chantier avec un modele inadapte tout en evitant une optimisation inutile sur les petits deltas.
  - Depends on: Task 5
  - Validate with: `rg -n "Model Routing Gate|sf-model|model routing|reasoning|token|cost|fallback|sf-start" skills/sf-build/SKILL.md`
  - Notes: `sf-model` est helper non tracant; `sf-build` doit resumer la decision modele dans son propre rapport/trace, pas creer une trace chantier separee pour `sf-model`.

- [ ] Task 7: Integrer `sf-start`, `sf-verify`, et `sf-test`
  - File: `skills/sf-build/SKILL.md`
  - Action: Decrire comment l'implementation est lancee depuis une spec ready, comment la verification juge la user story, quand `sf-test` est requis, et comment les echecs retournent vers correction ou question.
  - User story link: Garantit que le resultat est verifie au-dela du simple code ecrit.
  - Depends on: Task 6
  - Validate with: `rg -n "sf-start|sf-verify|sf-test|user story|verification|manual|bug" skills/sf-build/SKILL.md`
  - Notes: `sf-test` doit etre requis pour flows manuels, UI, auth, prod, ou comportements que les tests automatises ne prouvent pas.

- [ ] Task 8: Integrer `sf-end` et `sf-ship`
  - File: `skills/sf-build/SKILL.md`
  - Action: Ajouter la cloture par `sf-end`, puis le ship par `sf-ship`, avec gates de validation, bug gate, secret check, scope de staging, choix quick/full, et confirmation explicite si risque restant.
  - User story link: Livre le parcours complet jusqu'a la cloture et au push sans commande manuelle supplementaire.
  - Depends on: Task 7
  - Validate with: `rg -n "sf-end|sf-ship|staging|commit|push|bug gate|secret|full|all-dirty" skills/sf-build/SKILL.md`
  - Notes: `sf-build` ne doit pas utiliser `all-dirty`, `ship-all`, ou equivalent sans demande explicite.

- [ ] Task 9: Mettre a jour la doctrine chantier pour `sf-build`
  - File: `skills/references/chantier-tracking.md`
  - Action: Ajouter `sf-build` dans la matrice comme `Trace category: obligatoire` et `Process role: lifecycle`, avec son role d'orchestrateur user-facing.
  - User story link: Le nouveau flux reste visible dans le registre de chantier.
  - Depends on: Task 1
  - Validate with: `rg -n "sf-build.*obligatoire|sf-build.*lifecycle|orchestrateur" skills/references/chantier-tracking.md`
  - Notes: Ne pas casser les classifications existantes.

- [ ] Task 10: Mettre a jour l'aide et la doc workflow
  - File: `skills/sf-help/SKILL.md`, `shipflow-spec-driven-workflow.md`, `README.md`
  - Action: Documenter `sf-build` comme entree recommandee pour utilisateur final, expliquer que l'invocation autorise la delegation sequentielle bornee du chantier courant, que le parallelisme exige des `Execution Batches` dans une spec ready, et conserver les skills atomiques comme mode expert ou reprise manuelle.
  - User story link: Rend le nouveau modele decouvrable sans expliquer toute la plomberie.
  - Depends on: Tasks 1-9
  - Validate with: `rg -n "sf-build|utilisateur final|user-facing|delegated sequential|Execution Batches|spec-gated|sous-agent|sf-spec -> sf-ready|sf-end|sf-ship" skills/sf-help/SKILL.md shipflow-spec-driven-workflow.md README.md`
  - Notes: Le texte public doit dire que `sf-build` pose des questions utiles, pas qu'il agit sans controle.

- [ ] Task 11: Ajouter la tache locale de suivi sans changelog premature
  - File: `TASKS.md`
  - Action: Ajouter ou mettre a jour le suivi de travail dans `TASKS.md` pendant `sf-start` si le chantier n'y est pas deja visible; ne pas modifier `CHANGELOG.md` dans cette tache.
  - User story link: Garde le chantier visible sans sur-vendre un travail non encore livre.
  - Depends on: Tasks 1-10
  - Validate with: `rg -n "sf-build|Autonomous Master Skill" TASKS.md`
  - Notes: `CHANGELOG.md` sera mis a jour uniquement par `sf-end` apres implementation et verification.

- [ ] Task 12: Valider la coherence finale de la spec et des docs modifiees
  - File: `specs/sf-build-autonomous-master-skill.md`, `skills/sf-build/SKILL.md`, `skills/references/subagent-roles/reader.md`, `skills/references/subagent-roles/sequential-executor.md`, `skills/references/subagent-roles/wave-executor.md`, `skills/references/subagent-roles/integrator.md`, `skills/sf-help/SKILL.md`, `skills/references/chantier-tracking.md`, `shipflow-spec-driven-workflow.md`, `README.md`
  - Action: Relire les instructions comme un agent frais, verifier que les gates subagents/questions/end/ship sont testables, puis relancer `/sf-ready sf-build Autonomous Master Skill`.
  - User story link: Donne une preuve que le nouveau workflow est executable sans relire cette conversation.
  - Depends on: Tasks 1-11
  - Validate with: `rg -n "invocation.*sf-build|Execution Modes|delegated sequential|Spec-Gated Parallelism|Execution Batches|Documentation Update Gate|pending final integration|Model Routing Gate|sf-model|Question Gate|plain-text|sf-end|sf-ship|all-dirty|fresh-docs" skills/sf-build/SKILL.md specs/sf-build-autonomous-master-skill.md && rg -n "Reader Agent Contract|Sequential Executor Contract|Wave Executor Contract|Integrator Contract" skills/references/subagent-roles`
  - Notes: Puis lancer `/sf-ready sf-build Autonomous Master Skill`. Si `sf-ready` echoue encore sur un point de contrat, ne pas implementer par-dessus; corriger la spec.

## Acceptance Criteria

- [ ] AC 1: Given une utilisatrice lance `/sf-build "je veux X"`, when la demande est non triviale, then `sf-build` cree ou rattache une spec, boucle readiness, puis ne lance l'implementation que quand la spec est ready.
- [ ] AC 1b: Given une spec active couvre deja la meme user story, le meme resultat attendu ou les memes linked systems, when `sf-build` recoit une demande qui continue ce sujet, then il met a jour ou rattache cette spec au lieu de creer un nouveau chantier.
- [ ] AC 1c: Given plusieurs specs actives semblent plausibles, when `sf-build` ne peut pas choisir sans risque, then il pose une question de selection au lieu de deviner ou de creer une spec duplicate.
- [ ] AC 2: Given l'utilisatrice lance `/sf-build "je veux X"`, when le chantier implique lecture, edition, verification ou ship, then `sf-build` considere cette invocation comme autorisation explicite de delegation bornee et ne redemande pas avant chaque sous-agent sequentiel.
- [ ] AC 3: Given le runtime permet les sous-agents, when `sf-build` orchestre un chantier non trivial, then il lance un sous-agent borne a la fois avec ownership clair, integre ou valide son resultat, puis seulement ensuite lance le sous-agent suivant.
- [ ] AC 3b: Given une spec ready contient des `Execution Batches` avec fichiers/surfaces exclusifs, dependances explicites et validations par lot, when `sf-build` atteint un batch parallele, then il peut lancer les sous-agents du batch en meme temps et integre les resultats avant le batch suivant.
- [ ] AC 3c: Given la spec ready ne contient pas d'`Execution Batches` ou que les write sets se chevauchent, when `sf-build` envisage de paralleliser, then il bloque le parallelisme et route vers une mise a jour de spec ou une nouvelle readiness review.
- [ ] AC 3d: Given un agent frais doit remplir un role interne, when `sf-build` le lance ou le reutilise, then il charge le fichier de reference dedie a ce role (`reader`, `sequential-executor`, `wave-executor`, ou `integrator`) au lieu d'un contrat global ambigu.
- [ ] AC 3e: Given un executor modifie ou prevoit de modifier du code dans un workspace/zspace separe, when le master prepare l'integration ou la cloture, then le Reader fournit une carte code-docs et un `Documentation Update Plan` qui nomme les docs techniques a aligner ou justifie qu'aucune doc technique n'est impactee.
- [ ] AC 3f: Given une wave parallele ou un gros bloc sequentiel produit des changements de code, when `sf-build` veut passer a la wave suivante ou a `sf-end`, then les docs techniques impactees sont appliquees par un executor write-capable et relues par le Reader, ou chaque item restant est marque `pending final integration` avec raison et condition de resolution.
- [ ] AC 4: Given le runtime ne permet pas les sous-agents ou l'utilisatrice les refuse, when `sf-build` detecte la limitation, then il demande si l'utilisatrice accepte une degradation master/single-agent, veut decouper le chantier, ou prefere arreter.
- [ ] AC 4b: Given le chantier est long, high-risk, parallele, multi-domaines, ambigu, ou couteux en tokens, when `sf-build` a une spec ready et va lancer `sf-start`, then il lance ou applique `sf-model` pour choisir le modele principal, le reasoning et les fallbacks avant implementation.
- [ ] AC 4c: Given le chantier est petit, clair et local, when `sf-build` evalue la gate modele, then il peut noter que `sf-model` n'est pas necessaire et continuer avec le modele courant sans bloquer.
- [ ] AC 5: Given une decision produit, design, scope, donnees, securite, modification de l'existant, staging ou ship reste ambigue, when `sf-build` atteint cette decision, then il pose une question avec options preparees au lieu d'inventer.
- [ ] AC 5b: Given l'utilisatrice interagit en français, when `sf-build` pose une question, donne un statut ou rend son rapport final, then le texte utilisateur est en français naturel avec accents, même si les instructions internes de la skill sont en anglais.
- [ ] AC 6: Given l'outil de question integree est indisponible, when une decision materielle est requise, then `sf-build` pose une question plain-text courte avec options et attend la reponse avant de continuer.
- [ ] AC 7: Given `sf-ready` retourne `not ready`, when les gaps sont reparables sans decision utilisateur, then `sf-build` relance une passe de correction spec et une nouvelle readiness review dans la limite d'iterations.
- [ ] AC 8: Given `sf-verify` ou `sf-test` echoue sur la user story, when `sf-build` considere la cloture, then il interdit `sf-end` complet et `sf-ship` sauf decision explicite de ship a risque.
- [ ] AC 9: Given des fichiers sales hors scope existent, when `sf-build` arrive au ship, then il demande ou borne explicitement le staging et ne shippe pas tout par defaut.
- [ ] AC 10: Given l'utilisateur n'a pas explicitement demande `all-dirty` ou equivalent, when `sf-build` appelle `sf-ship`, then il transmet un scope de staging limite au chantier courant.
- [ ] AC 11: Given le travail est implemente et verifie, when `sf-build` termine, then il lance `sf-end`, puis `sf-ship`, et le rapport final reste court avec resultat, validations, mode d'execution, commit/push, fichiers exclus, et limites de preuve.
- [ ] AC 12: Given une utilisatrice relit la spec du chantier, when elle consulte `Skill Run History` et `Current Chantier Flow`, then elle voit le passage de `sf-build` et les etapes internes principales.
- [ ] AC 13: Given un agent frais lit `skills/sf-build/SKILL.md`, when il execute la skill, then il comprend les gates, les questions, la delegation sequentielle par defaut, le parallelisme spec-gated, les stop conditions, les limites de scope et les docs a revalider sans relire cette conversation.

## Test Strategy

- Unit: None, because ShipFlow skills are markdown instruction artifacts without executable unit harness today.
- Static checks: run `rg` validations for `sf-build`, `Trace category`, `Process role`, `Question Gate`, `Execution Modes`, `delegated sequential`, `Spec-Gated Parallelism`, `Execution Batches`, `Documentation Update Gate`, `pending final integration`, `Model Routing Gate`, `sf-model`, invocation-as-delegation-consent, `plain-text`, `sf-end`, `sf-ship`, `all-dirty`, `fresh-docs`, and `Current Chantier Flow` across the modified skill/docs.
- Role reference checks: verify each role file exists and contains its exact contract heading: `Reader Agent Contract`, `Sequential Executor Contract`, `Wave Executor Contract`, and `Integrator Contract`; verify the reader contract includes `documentation corpus`, `code-docs`, and `Documentation Update Plan`.
- Integration: run metadata/readiness checks on the new skill and docs with `rg` validations, then run `/sf-ready sf-build Autonomous Master Skill`.
- Manual scenario 1: simulate vague story requiring questions; verify no final spec/implementation starts before actor, result, scope and exclusions are stable.
- Manual scenario 1b: simulate a request that extends `sf-build Autonomous Master Skill`; verify `sf-build` continues that spec instead of proposing a new chantier.
- Manual scenario 1c: simulate two plausible specs; verify `sf-build` asks which chantier to continue.
- Manual scenario 2: simulate plain `/sf-build "build X"`; verify `sf-build` treats the command as delegation consent for the current chantier and launches bounded subagents sequentially without repeated authorization prompts.
- Manual scenario 2b: simulate a large parallel chantier with ready `Execution Batches`; verify `sf-build` applies `sf-model` before `sf-start`, launches only non-overlapping agents in a batch, and records the model/execution decision in its own report.
- Manual scenario 2c: simulate a large chantier without `Execution Batches`; verify `sf-build` does not parallelize and routes to `sf-spec`/`sf-ready`.
- Manual scenario 3: simulate `AskUserQuestion` unavailable; verify the plain-text fallback question is used and the action pauses.
- Manual scenario 4: simulate ready spec leading to implementation; verify each sequential subagent has disjoint ownership, the master integrates before the next one, and no concurrent writes happen without a batch.
- Manual scenario 4b: simulate code edits in separate workspaces/zspaces; verify the Reader identifies which technical docs must be updated, a write-capable executor applies them at cycle/wave end, the Reader reviews them, and the next wave is blocked unless docs are updated or marked `pending final integration`.
- Manual scenario 5: simulate failed verification; verify no full `sf-end` or `sf-ship` happens without explicit risk acceptance.
- Regression: inspect `skills/sf-spec/SKILL.md`, `skills/sf-ready/SKILL.md`, `skills/sf-start/SKILL.md`, `skills/sf-verify/SKILL.md`, `skills/sf-test/SKILL.md`, `skills/sf-end/SKILL.md`, and `skills/sf-ship/SKILL.md` to ensure `sf-build` orchestrates rather than contradicts them.

## Risks

- Security impact: yes, mitigated by bounded subagent scope, permissions gates, data exposure gates, secrets checks, destructive-action questions, dirty state checks, verification, bug risk, staging and ship confirmation.
- Runtime scope risk: high if `sf-build` treats invocation consent as permission to act outside the chantier; mitigated by bounded subagent missions, ownership, stop conditions, and separate questions for destructive, sensitive, out-of-scope, staging, or ship-risk decisions.
- Edit conflict risk: high if `sf-build` launches parallel agents opportunistically; mitigated by delegated sequential default, `Execution Batches` only after ready spec validation, non-overlapping write sets, dependency ordering, and master integration between waves.
- Product risk: high if `sf-build` hides too much; mitigated by asking more product questions while hiding only internal technical detail.
- Regression risk: high because a master skill can overstep; mitigated by scoped file ownership, readiness gates, verification gates, and no `all-dirty` ship by default.
- Operational risk: medium if the runtime cannot spawn subagents or surface approvals; mitigated by explicit degradation prompt, master/single-agent fallback only with consent, or clean stop.
- Prompt/tooling risk: medium if `AskUserQuestion` is unavailable; mitigated by plain-text fallback and stop-before-dangerous-action rule.
- Documentation risk: medium if docs keep advertising only the atomic flow or overpromise autonomy; mitigated by updating help, workflow docs, and README with the invocation-consent and question model.
- Technical docs drift risk: medium if code changes happen in isolated workspaces/zspaces and no single role maps them back to documentation; mitigated by the Reader's corpus-first code-docs map and `Documentation Update Plan`.
- Fresh docs risk: low after official Codex docs check, but `sf-start` must re-run freshness if it uses a concrete new Codex API, config file, plugin schema, or MCP integration beyond markdown instructions.

## Execution Notes

- Read first: `skills/sf-spec/SKILL.md`, `skills/sf-ready/SKILL.md`, `skills/sf-start/SKILL.md`, `skills/sf-verify/SKILL.md`, `skills/sf-test/SKILL.md`, `skills/sf-end/SKILL.md`, `skills/sf-ship/SKILL.md`, `skills/references/chantier-tracking.md`, `shipflow-spec-driven-workflow.md`.
- External docs already checked for this spec: `https://developers.openai.com/codex/subagents`, `https://developers.openai.com/codex/cli`, `https://developers.openai.com/codex/cloud/internet-access`, `https://developers.openai.com/learn/docs-mcp`.
- Implement in this order: create `sf-build` with internal instructions in English; add question gate and language-aware fallback; add execution modes (`main-only`, `delegated sequential`, `spec-gated parallel`); create one role file per internal agent role under `skills/references/subagent-roles/`; add `Execution Batches` rules and no-opportunistic-parallelism stop condition; add spec/readiness loop; add Existing Chantier Check; add anti-regression gates; add model routing gate; add implementation/verify/test orchestration; add end/ship integration; update chantier doctrine; update help/workflow/README; update `TASKS.md`; run readiness.
- Packages to avoid: no new runtime package or SDK unless `sf-start` proves it is necessary and applies fresh-docs again.
- Patterns to follow: existing skill frontmatter, canonical paths section, chantier tracking block, exact `Trace category` / `Process role` wording, standard `Chantier` final block, and concise user-facing reports.
- Abstractions to avoid: do not build a second task registry, do not duplicate all checks from lifecycle skills, do not create a hidden state machine outside the markdown skill instructions.
- Commands to validate: `rg -n "sf-build" skills/sf-build/SKILL.md skills/sf-help/SKILL.md skills/references/chantier-tracking.md shipflow-spec-driven-workflow.md README.md`; `rg -n "Existing Chantier Check|Execution Modes|delegated sequential|Spec-Gated Parallelism|Execution Batches|Documentation Update Gate|pending final integration|invocation.*sf-build|Model Routing Gate|sf-model|Question Gate|plain-text|sf-end|sf-ship|all-dirty|fresh-docs" skills/sf-build/SKILL.md`; `rg -n "Reader Agent Contract|documentation corpus|code-docs|Documentation Update Plan|Sequential Executor Contract|Wave Executor Contract|Integrator Contract" skills/references/subagent-roles`; `/sf-ready sf-build Autonomous Master Skill`.
- Stop conditions: no unique interpretation of ship behavior, disagreement with existing lifecycle skill contracts, missing decision about touching existing behavior, missing `Execution Batches` for requested parallelism, overlapping write ownership, inability to preserve user changes in dirty worktree, failed verification gate, docs contract contradiction, or public docs that imply autonomy without user decision gates.
- Implementation boundary: do not alter the behavior of existing lifecycle skills unless needed for discoverability or matrix registration; `sf-build` should compose them first.

## Open Questions

None

Readiness note: the previous open questions are resolved by this spec. `sf-build` uses delegated sequential execution as the normal model and treats the command invocation as the user's explicit request for bounded subagents in the current chantier; parallel execution is allowed only from ready `Execution Batches`; if the prompt tool is unavailable, it uses plain-text questions for material decisions; `CHANGELOG.md` is reserved for `sf-end`, not `sf-start`.

## Skill Run History

| Date UTC | Skill | Model | Action | Result | Next step |
|----------|-------|-------|--------|--------|-----------|
| 2026-04-29 09:02:11 UTC | sf-spec | GPT-5 Codex | Created spec for sf-build autonomous master skill | draft | /sf-ready sf-build autonomous master skill |
| 2026-04-29 10:16:26 UTC | sf-ready | GPT-5 Codex | Reviewed readiness; blocked on runtime authorization semantics for default subagents, integrated question fallback, and freshness evidence | not ready | /sf-spec sf-build Autonomous Master Skill |
| 2026-04-29 16:12:58 UTC | sf-spec | GPT-5 Codex | Revised spec to resolve readiness gaps around subagent consent, prompt fallback, fresh Codex docs, ship staging, and changelog timing | draft | /sf-ready sf-build Autonomous Master Skill |
| 2026-04-29 16:19:01 UTC | sf-ready | GPT-5 Codex | Validated revised spec structure, user story alignment, runtime consent semantics, security gates, fresh Codex docs, task ordering, and acceptance criteria | ready | /sf-start sf-build Autonomous Master Skill |
| 2026-04-29 16:32:00 UTC | sf-docs | GPT-5 Codex | Added ShipFlow language doctrine dependency and sf-build language requirements | draft | /sf-ready sf-build Autonomous Master Skill |
| 2026-04-30 20:48:38 UTC | sf-spec | GPT-5 Codex | Revised subagent consent contract so invoking sf-build authorizes bounded subagents for the current chantier without repeated prompts | draft | /sf-ready sf-build Autonomous Master Skill |
| 2026-04-30 20:51:41 UTC | sf-spec | GPT-5 Codex | Added sf-model gate before sf-start for large, high-risk, multi-agent, ambiguous, or token-costly chantiers | draft | /sf-ready sf-build Autonomous Master Skill |
| 2026-04-30 22:18:43 UTC | sf-spec | GPT-5 Codex | Added Existing Chantier Check so sf-build continues matching active specs before creating a new chantier | draft | /sf-ready sf-build Autonomous Master Skill |
| 2026-04-30 22:23:59 UTC | sf-spec | GPT-5 Codex | Revised execution doctrine to delegated sequential by default and spec-gated parallelism only through non-overlapping Execution Batches | draft | /sf-ready sf-build Autonomous Master Skill |
| 2026-05-01 08:43:00 UTC | sf-spec | GPT-5 Codex | Added one-reference-file-per-role doctrine for reader, sequential executor, wave executor, and integrator contracts | draft | /sf-ready sf-build Autonomous Master Skill |
| 2026-05-01 08:48:42 UTC | sf-spec | GPT-5 Codex | Added Reader corpus responsibility for code-docs mapping and technical Documentation Update Plan across execution workspaces | draft | /sf-ready sf-build Autonomous Master Skill |
| 2026-05-01 08:54:18 UTC | sf-spec | GPT-5 Codex | Added Documentation Update Gate at cycle/wave end with pending final integration exception | draft | /sf-ready sf-build Autonomous Master Skill |

## Current Chantier Flow

- `sf-spec`: done, draft spec revised after language doctrine update, sf-build invocation consent clarification, sf-model gate addition, Existing Chantier Check, delegated sequential/spec-gated parallelism update, one-file-per-role contract update, Reader corpus/code-docs responsibility, and Documentation Update Gate.
- `sf-ready`: needs rerun after Documentation Update Gate update.
- `sf-start`: not launched.
- `sf-verify`: not launched.
- `sf-end`: not launched.
- `sf-ship`: not launched.

Next step: `/sf-ready sf-build Autonomous Master Skill`
