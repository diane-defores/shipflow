# Tasks — ShipFlow

> **Priority:** 🔴 P0 blocker · 🟠 P1 high · 🟡 P2 normal · 🟢 P3 low · ⚪ deferred
> **Status:** 📋 todo · 🔄 in progress · ✅ done · ⛔ blocked · 💤 deferred

---

## Bootstrap universel

| Pri | Task | Status |
|-----|------|--------|
| 🔴 | Concevoir un bootstrap universel multi-OS (`Linux`, `macOS`, `WSL`, `Windows`) avec comportement explicite selon la plateforme | 📋 todo |
| 🔴 | Supprimer l'hypothèse implicite "`python3` déjà installé" hors `sudo ./install.sh` serveur et définir la stratégie officielle de provisioning runtime | 📋 todo |
| 🟠 | Ajouter un chemin d'installation local sans root quand possible pour les outils docs/metadata qui reposent sur Python | 📋 todo |
| 🟠 | Faire échouer les scripts avec un diagnostic précis et actionnable quand un runtime requis manque au lieu de dépendre d'erreurs secondaires | 📋 todo |
| 🟠 | Corriger la configuration Playwright MCP pour pointer le Chromium ARM64 local au lieu de Google Chrome stable absent | 🔄 in progress |
| 🟠 | Provisionner Flutter/Dart via Flox par projet (validation overrides + réparation `.flox` existants + docs/tests) | ✅ done |
| 🟠 | Documenter la matrice de bootstrap par environnement : serveur Debian/Ubuntu, poste macOS, poste Linux non-root, Windows/WSL | 📋 todo |
| 🟡 | Évaluer s'il faut fournir un wrapper unique (`bootstrap` / `doctor`) pour vérifier et installer les prérequis avant usage | 📋 todo |
| 🟡 | Vérifier que `README.md`, `AGENT.md`, `CONTEXT.md` et `GUIDELINES.md` racontent le même contrat de bootstrap | 📋 todo |

---

## Documentation contracts

| Pri | Task | Status |
|-----|------|--------|
| 🟠 | Relire et shipper les docs `BUSINESS.md`, `PRODUCT.md`, `BRANDING.md`, `GTM.md`, `ARCHITECTURE.md`, `GUIDELINES.md` après la passe de durcissement en cours | 🔄 in progress |
| 🟠 | Bootstrapper les corpus de gouvernance technique/éditoriale via `sf-init`/`sf-docs` et les intégrer au contrat `sf-build` | ✅ done |
| ✅ | Ajouter la couche de gouvernance éditoriale ShipFlow (`docs/editorial/`, Editorial Reader, claim register, page intent, schema Astro, blog-surface stop conditions) | ✅ done |
| ✅ | Ajouter au site public ShipFlow un tutoriel marketing sur les modes des skills, une page FAQ dédiée, puis renforcer le maillage interne vers ces surfaces | ✅ done |
| 🟠 | Corriger la synchronisation finale des aliases/symlinks dans `dotfiles/install.sh` pour qu'elle s'applique aussi en mode `--only=<component>` (éviter les alias/symlinks fantômes) | ✅ done |
| 🟡 | Normaliser à terme le schéma metadata si on veut éliminer la différence `linked_systems` / `linked_artifacts` | 📋 todo |

---

## Skills

🟢 [ShipFlow] task: Integrer le TDD proof-first et les checklists manuelles durables dans les skills | status: done | area: skills
🟢 [ShipFlow] task: Ajouter une boucle d'audit des conversations et d'auto-evolution des skills | status: done | area: skills
🟢 [ShipFlow] task: Auditer en batch les conversations Markdown pour identifier les travers agents et router les améliorations | status: done | area: skills
🟢 [ShipFlow] task: Durcir les retours humains des skills, l'autonomie des questions, les claims de preuve et la sortie `sf-ready` | status: done | area: skills | spec: shipflow_data/workflow/specs/shipflow-skill-reporting-and-proof-hardening.md | next: /sf-ship shipflow-skill-reporting-and-proof-hardening
🟢 [ShipFlow] task: Router les preuves hébergées manquantes vers un owner concret après un verdict `partial` | status: done | area: skills | spec: shipflow_data/workflow/specs/shipflow-hosted-proof-follow-through-and-user-report-discipline.md | next: none
🟢 [ShipFlow] task: Forcer les exports et audits de conversation ShipFlow dans le repo ShipFlow | status: done | area: skills | spec: shipflow_data/workflow/specs/conversation-audit-canonical-storage-hardening.md | next: none
🟢 [ShipFlow] task: Ajouter un index numerique canonique des skills sans renommer les invocations | status: done | area: skills | spec: shipflow_data/workflow/specs/numeric-skill-code-index.md | next: /sf-ship Numeric Skill Code Index
🟢 [ShipFlow] task: Autoriser `sf-start` a enchaîner une auto-verification locale bornee quand la preuve restante est sure et non destructive | status: done | area: skills | spec: shipflow_data/workflow/specs/auto-follow-through-for-local-only-sf-start-verification.md | next: /sf-ship Auto-follow-through for local-only sf-start verification

| Pri | Task | Status |
|-----|------|--------|
| 🟠 | Faire des specs le registre global des chantiers spec-first avec historique de skills | ✅ done |
| 🟠 | Ajouter la taxonomie interne des skills et les sources de chantier potentiel | ✅ done |
| 🟠 | Durable Exploration Reports for `sf-explore` | ✅ done |
| ✅ | Skill description budget compliance: audit script, descriptions compactes et checks `sf-docs`/`sf-skills-refresh` scoppés | ✅ done |
| ✅ | Patch global des skills pour résoudre les références et outils internes depuis le root canonique ShipFlow | ✅ done |
| ✅ | Créer `sf-test` pour guider les tests manuels, loguer `TEST_LOG.md` et ouvrir `BUGS.md` | ✅ done |
| 🟠 | Implémenter Professional Bug Management avec index compact, dossiers bug et preuves séparées | ✅ done |
| 🟠 | Durcir `sf-fix` pour exiger une trace bug durable même en fix direct, sauf exception mineure explicitement justifiée | ✅ done |
| ✅ | Créer `sf-bug` comme orchestrateur de boucle bug (`sf-test -> dossier -> sf-fix -> retest -> sf-verify -> sf-ship`) et aligner docs/help/site | ✅ done |
| ✅ | Documenter et propager le mode de développement projet (`local`, `vercel-preview-push`, `hybrid`) dans les skills de validation et de ship | ✅ done |
| ✅ | Créer `sf-browser` comme skill navigateur généraliste non-auth et l'intégrer aux routes `sf-auth-debug`, `sf-test`, `sf-prod`, `sf-fix`, `sf-start`, `sf-verify`, `sf-check`, aux specs de taxonomie/catalogue, aux README internes et au site public | ✅ done |
| 🟠 | Construire `sf-build` comme skill maître autonome (orchestrateur spec -> ready -> start -> verify -> end -> ship avec délégation bornée) | ✅ done |
| ✅ | Empêcher `sf-build` de renvoyer manuellement vers `sf-end`/`sf-ship` après vérification réussie sauf blocage explicite | ✅ done |
| ✅ | Implémenter `sf-skill-build` comme skill maître de maintenance des skills (`sf-explore si nécessaire -> sf-spec -> SKILL.md -> sf-skills-refresh -> budget audit -> sf-verify -> sf-docs/help -> sf-ship`) et aligner les surfaces publiques/docs | ✅ done |
| ✅ | Créer `sf-deploy` comme skill maître de release (`sf-check -> sf-ship -> sf-prod -> preuve -> sf-verify -> sf-changelog`) et aligner docs/help/site | ✅ done |
| ✅ | Promouvoir `sf-maintain` en skill maître de maintenance projet (`triage -> spec/ready -> délégation bornée -> verify -> ship/deploy`) et aligner docs/help/site | ✅ done |
| ✅ | Ajouter un helper partagé de synchronisation des skills Claude/Codex (`tools/shipflow_sync_skills.sh`) et l'intégrer à l'installateur, `sf-skill-build`, `sf-check`, `sf-verify` et `sf-ship` | ✅ done |
| ✅ | Ajouter un contrat partagé de rapports compacts pour les skills (`report=user` par défaut, `report=agent` explicite) et le propager aux skills lifecycle, bug et audit | ✅ done |
| ✅ | Ajouter une discipline Spec-Driven Development + Proof-First TDD/Evidence Gates aux skills d'exécution, bug, skill-build, verify et délégation | ✅ done |
| ✅ | Auditer la taxonomie des skills et compacter les descriptions de découverte sans changer les invocations, rôles ni catégories de trace | ✅ done |
| ✅ | Renforcer les questions `sf-build` en mode plan avec contexte, racine du problème, enjeu business, options et recommandation best practice | ✅ done |
| ✅ | Ajouter une cheatsheet publique et Markdown repo des master skills, supporting skills et modes d'arguments, avec page publique `sf-build` | ✅ done |
| 🟠 | Créer une skill `sf-prs` pour trier les PR GitHub ouvertes (`gh`), vérifier repo/branches/diffs/checks, regrouper Dependabot quand possible, merger les PRs vertes et fermer/commenter les PRs obsolètes selon une politique explicite | 📋 todo |

---

## Historical completed work

> Imported from the master tracker to keep local ShipFlow context coherent. These items are historical context, not active backlog.

| Pri | Task | Status |
|-----|------|--------|
| ✅ | Extraction action handlers dans `lib.sh` + `shipflow.sh` réduit à 48 lignes | ✅ done |
| ✅ | Retirer ou restreindre `shipflow-inspector` et `shipflow-eruda` du layout de production | ✅ done |
| ✅ | Auditer et sécuriser `shipflow-inspector.js` (intégration upload + clé IMGBB exposée) | ✅ done |

---

## Backlog

| Pri | Task | Status |
|-----|------|--------|
| 🟠 | Harmoniser tous les sous-menus CLI : lettres au lieu de chiffres, `x) Cancel` unique, et comportement Cancel cohérent entre `gum` et fallback bash | ✅ done |
| 🟠 | Regrouper le menu racine ShipFlow en entrées lisibles avec sous-menus iconés (`Dashboard`, `Deploy / Start`, `Environments`, `Tools`, `System`, `Agents / ShipFlow`, `Help`) | ✅ done |
| ✅ | Aligner `sf-veille` avec la gouvernance contenu : router les idées blog/newsletter vers `sf-content`/`sf-repurpose` et signaler `surface missing: blog` quand aucune surface n'est déclarée | ✅ done |
| 🟢 | Ajouter un handoff contenu à `sf-research` et `sf-market-study` quand leurs rapports recommandent des contenus publics, avec sources, claims et route vers `sf-content` | 💤 deferred |
| 🟢 | Renforcer `sf-audit` master pour charger explicitement les corpus éditorial/technique quand l'audit touche des surfaces publiques, claims ou docs mappées | 💤 deferred |
| 🟢 | Ajouter une micro-intégration `technical-docs-corpus` à `sf-content`/`sf-repurpose` quand les opportunités ou handoffs touchent des docs techniques internes | 💤 deferred |
| 🟡 | Cadrer une grille de notation éditoriale réutilisable par les skills contenu, avec critères communs et règles spécifiques par projet depuis le corpus de gouvernance — preuve sample rubric ajoutée et `sf-verify` validé | ✅ done |
| 🟢 | Étudier `models.dev` comme source externe pour actualiser la référence `sf-model` sans hardcoder prix, limites, capacités et fenêtres de contexte | 💤 deferred |
| 🟢 | Étudier OpenPostern comme inspiration pour les skills de codage et veille technologique: vendor-risk score, CVE/NVD, CISA KEV, SSL/TLS, DNS, headers HTTP, news sécurité IA et recommandations actionnables | 💤 deferred |
| 🟢 | Étudier Alpic comme inspiration pour packager, déployer, monitorer et distribuer des MCP servers / ChatGPT Apps liés aux skills ShipFlow | 💤 deferred |
| 🟢 | Idée à cadrer : créer une brique partagée de journaux opérationnels append-only (`OPERATIONS_LOG.md` / `DEPENDENCY_LOG.md`) pour tracer les runs importants sans remplacer `specs/`, `bugs/`, `TASKS.md` ni `CHANGELOG.md` | 💤 deferred |
| 🟢 | Cadrer plus tard le mécanisme de synchronisation `project repo -> master` pour `shipflow_data` (symlink, copie, index généré, ingestion web app ou autre) dans une spec dédiée | 💤 deferred |

🟢 [ShipFlow] task: Évaluer models.dev comme registre externe optionnel pour `sf-model` | status: deferred | area: model-routing | source: veille utilisateur https://models.dev/ 2026-06-10
🟢 [ShipFlow] task: Évaluer OpenPostern comme pattern pour enrichir `sf-veille`, `sf-deps`, `sf-audit-code` et les skills de codage avec scoring vendor-risk et signaux sécurité actionnables | status: deferred | area: tech-watch-security-skills | source: veille utilisateur https://betalist.com/startups/openpostern et https://openpostern.com/ 2026-06-10
🟢 [ShipFlow] task: Évaluer Alpic comme référence d'infrastructure MCP/ChatGPT Apps pour packaging, déploiement, monitoring, sécurité et distribution de skills ou serveurs MCP ShipFlow | status: deferred | area: mcp-app-distribution | source: veille utilisateur https://alpic.ai/ et https://alpic.ai/blog/deploy-chatgpt-apps-on-alpic 2026-06-10

---

### Audit: Code

| Pri | Task | Status |
|-----|------|--------|
| ✅ | Harden `local/dev-tunnel.sh` SSH target and identity validation so saved config cannot be interpreted as SSH options or malformed key paths | ✅ done |
| ✅ | Make `local/dev-tunnel.sh` session and PM2 SSH failures fail soft enough to show actionable local errors under `set -e` | ✅ done |
| ✅ | Validate PM2 ports, stop on duplicate remote ports before mutating tunnels, and check local port occupancy before `autossh` launch | ✅ done |
| ✅ | Replace broad `pkill -f "autossh.*$REMOTE_HOST"` guidance with managed tunnel PID selection and `local/dev-tunnel.sh --stop` | ✅ done |
| ✅ | Add a polished animated SSH sonar scan loader to `local/local.sh` so startup remote checks no longer look frozen | ✅ done |
| ✅ | Corriger la validation et l'affichage Termux du prompt serveur SSH local (`BUG-2026-05-02-002`) | ✅ done |
| ✅ | Corriger la résolution des noms simples de clés SSH locales (`BUG-2026-05-02-003`) | ✅ done |
| ✅ | Remplacer l'IP opérateur par une IP de documentation et purger l'historique GitHub récent (`BUG-2026-05-02-004`) | ✅ done |
| 🟠 | Rendre les alertes de cleanup disque explicites quand `/` est en pression critique (`BUG-2026-05-04-001`) | 🔄 in progress |
| ✅ | Corriger le raccourci CLI `sf u` et harmoniser les retours `x`/`Esc`/Backspace dans les sous-menus (`BUG-2026-05-04-002`) | ✅ done |
| 🟠 | Consolidate duplicated tunnel lifecycle logic between `local/dev-tunnel.sh` and `local/local.sh` so the interactive menu inherits the same validation, collision handling, and managed stop behavior | 📋 todo |
| 🟠 | Harden `install.sh` supply-chain and failure handling: replace live `curl | bash`/direct downloads with pinned, verified install steps and strict failure behavior | 🔄 in progress |
| 🟡 | Corriger la détection de commande dev quand un projet Flutter contient un `package.json` uniquement Convex (`BUG-2026-05-04-004`) | 🔄 in progress |
| 🟡 | Empêcher ShipFlow de créer des symlinks `TASKS.md` dans les projets et garder le tracking dans `shipflow_data` (`BUG-2026-05-05-001`) | 🔄 in progress |
| 🟠 | Local MCP OAuth tunnel login: commande `shipflow-mcp-login`, intégration menu local, alias install, tests de validation et docs | ✅ done |
| 🟠 | Split `lib.sh` hotspots around environment lifecycle, publishing, dashboard, inspector, and metadata helpers to reduce the 5,900+ line blast radius | 📋 todo |
| 🟡 | Resolve the `site` production dependency advisory for Astro (`GHSA-j687-52p2-xcff`) through a planned Astro upgrade/migration | 📋 todo |
| 🟡 | Fix `test_priority3.sh` so the PM2 jq parsing fixture passes or is explicitly skipped with an accurate reason | 📋 todo |
| ✅ | Validate DuckDNS publish inputs, encode DuckDNS update requests, harden secret writes, and remove the default public ImgBB upload key | ✅ done |
| ✅ | Restore the Astro docs page build by moving dynamic GitHub URLs into frontmatter and escaping shell-style `${...}` text | ✅ done |
| ✅ | Corriger la latence du menu ShipFlow et bloquer les auto-sélections dangereuses dans Health/cleanup (`BUG-2026-05-08-001`, `BUG-2026-05-08-002`) | ✅ done |

### Audit: Perf (2026-04-29) — Score: B

| Pri | Task | Status |
|-----|------|--------|
| ✅ | Load the public site fonts asynchronously in [site/src/layouts/BaseLayout.astro](/home/ubuntu/shipflow/site/src/layouts/BaseLayout.astro:24) so the Google Fonts stylesheet no longer blocks first paint | ✅ done |
| ✅ | Reduce compositor cost in [site/src/styles/global.css](/home/ubuntu/shipflow/site/src/styles/global.css:105) by gating blur effects behind `@supports` and lowering the blur radius on glass panels | ✅ done |
| ✅ | Defer below-the-fold layout and paint work on long static pages via `content-visibility` in [site/src/styles/global.css](/home/ubuntu/shipflow/site/src/styles/global.css:283) | ✅ done |
| ✅ | Prune heavyweight directories from [lib.sh](/home/ubuntu/shipflow/lib.sh:2233) project resolution scans and replace remote PM2 Python parsing with Node in [local/local.sh](/home/ubuntu/shipflow/local/local.sh:415) and [local/dev-tunnel.sh](/home/ubuntu/shipflow/local/dev-tunnel.sh:260) | ✅ done |
| 🟠 | Self-host the marketing site fonts or move to a local-first stack to eliminate the remaining cross-origin font dependency after the non-blocking preload patch | ✅ done |
| 🟡 | Consolidate duplicated remote PM2/tunnel parsing logic between [local/local.sh](/home/ubuntu/shipflow/local/local.sh:415) and [local/dev-tunnel.sh](/home/ubuntu/shipflow/local/dev-tunnel.sh:260) so future perf and failure-handling fixes do not drift | ✅ done |

## Audit Findings
<!-- Populated by /sf-audit — dated sections with Fixed: / Remaining: -->
