---
name: sf-prod
description: "Production verification for deploy status, Vercel logs, runtime logs, and live health checks."
argument-hint: [optional: project name or URL]
---

## Canonical Paths

Before resolving any ShipFlow-owned file, load `$SHIPFLOW_ROOT/skills/references/canonical-paths.md` (`$SHIPFLOW_ROOT` defaults to `$HOME/shipflow`). ShipFlow tools, shared references, skill-local `references/*`, templates, workflow docs, and internal scripts must resolve from `$SHIPFLOW_ROOT`, not from the project repo where the skill is running. Project artifacts and source files still resolve from the current project root unless explicitly stated otherwise.

## Chantier Tracking

Trace category: `conditionnel`.
Process role: `source-de-chantier`.

Before producing the final report, load `$SHIPFLOW_ROOT/skills/references/chantier-tracking.md` when this run is attached to a spec-first chantier. If exactly one active `specs/*.md` chantier is identified, append the current run to `Skill Run History`, update `Current Chantier Flow` when the run changes the chantier state, and include a final `Chantier` block. If no unique chantier is identified, do not write to any spec; report `Chantier: non applicable` or `Chantier: non trace` with the reason.

## Chantier Potential Intake

Because this skill has process role `source-de-chantier`, evaluate the standard threshold from `$SHIPFLOW_ROOT/skills/references/chantier-tracking.md` before the final report. If the findings reveal non-trivial future work and no unique chantier owns it, do not write to an existing spec; add a `Chantier potentiel` block with `oui`, `non`, or `incertain`, a proposed title, reason, severity, scope, evidence, recommended `/sf-spec ...` command, and next step. If the work is only a direct local fix or already belongs to the current chantier, state `Chantier potentiel: non` with the concrete reason.


## Context

- Current directory: !`pwd`
- Project name: !`basename $(pwd)`
- Git remote: !`git remote -v 2>/dev/null | head -1 || echo "no remote"`
- Latest commit: !`git log --oneline -1 2>/dev/null || echo "no commits"`
- Current branch: !`git branch --show-current 2>/dev/null || echo "unknown"`
- Vercel project link: !`cat .vercel/project.json 2>/dev/null || echo "no .vercel/project.json"`
- ShipFlow development mode: !`rg -n "ShipFlow Development Mode|development_mode|validation_surface|ship_before_preview_test|post_ship_verification|deployment_provider" CLAUDE.md SHIPFLOW.md 2>/dev/null || echo "No project development mode documented"`
- CLAUDE.md (for prod URL): !`grep -i "url\|domain\|vercel\|netlify\|prod" CLAUDE.md 2>/dev/null | head -5 || echo "no CLAUDE.md or no URL found"`

## Your task

Vérifier que le dernier déploiement en production a réussi. Trois checks : status du deploy, health check de l'URL, et accès aux logs si erreur.
Le but est de donner un signal de confiance honnête sur la prod, pas un faux "tout va bien" basé sur un seul `200 OK`.

Le registry `PROJECTS.md` est en lecture seule dans cette skill.
`sf-prod` ne doit jamais modifier `TASKS.md`, `AUDIT_LOG.md` ou `PROJECTS.md`.

Lire `${SHIPFLOW_ROOT:-$HOME/shipflow}/skills/references/project-development-mode.md` avant de choisir la cible. Si le projet est en mode `vercel-preview-push`, `sf-prod` vérifie le déploiement Vercel correspondant au dernier commit poussé et renvoie l'URL de preview prête pour les tests. Dans ce mode, le mot "prod" désigne le gate post-push, pas forcément le domaine de production custom.

---

### Step 1 — Identifier le projet

Si `$ARGUMENTS` est fourni, l'utiliser comme nom de projet ou URL.

Sinon, utiliser le répertoire courant. Si pas de git remote, utiliser **AskUserQuestion** :
- Question : "Quel projet vérifier ?"
- Options depuis `${SHIPFLOW_DATA_DIR:-$HOME/shipflow_data}/PROJECTS.md`

**Extraire le owner/repo** depuis le git remote :
```bash
# git@github.com:owner/repo.git → owner/repo
# https://github.com/owner/repo.git → owner/repo
```

### Step 2 — Vérifier le status du dernier deploy

**Source primaire Vercel MCP quand Vercel est détecté :**

Si `.vercel/project.json` existe, si le status GitHub pointe vers Vercel, ou si le mode projet est `vercel-preview-push` :
1. Utiliser le serveur MCP Vercel avant de conclure :
   - `mcp__vercel__list_deployments` pour trouver les déploiements récents du projet.
   - `mcp__vercel__get_deployment` pour suivre le déploiement qui correspond au dernier commit, à la branche courante ou à l'URL fournie.
   - `mcp__vercel__get_deployment_build_logs` pour les logs build.
   - `mcp__vercel__get_runtime_logs` si le build est vert mais que le health check ou le flow live échoue.
2. Attendre l'état final du déploiement via MCP (`READY`, `ERROR`, `CANCELED`, ou équivalent). Ne pas demander un test preview tant que le déploiement correspondant au push n'est pas prêt.
3. Si aucun `teamId` ou `projectId` n'est connu, lire `.vercel/project.json`, puis utiliser `list_teams` / `list_projects` pour retrouver le projet. Si cela reste impossible, signaler le blocage et utiliser les GitHub statuses comme fallback partiel.
4. Si plusieurs déploiements existent, préférer celui qui correspond au dernier SHA local (`git rev-parse HEAD`) et à la branche courante. Signaler explicitement si la correspondance SHA/branche n'a pas pu être prouvée.

**Via GitHub commit statuses API** (Vercel, Netlify y publient leurs résultats) :

Utiliser cette voie comme fallback ou comme corroboration lorsque Vercel MCP n'est pas disponible, pas comme source primaire pour un projet Vercel en mode preview-push.

```bash
# Récupérer le SHA du dernier commit
SHA=$(gh api repos/{owner}/{repo}/commits --jq '.[0].sha')

# Récupérer les statuses de ce commit
gh api "repos/{owner}/{repo}/commits/$SHA/statuses" --jq '.[0:5] | .[] | {state, context, description, target_url}'
```

**Interpréter le résultat :**

| State | Signification | Action |
|-------|--------------|--------|
| `success` | Deploy réussi | Continuer vers le health check |
| `pending` | Build en cours | Attendre et réessayer |
| `failure` | Build échoué | Afficher l'erreur + récupérer les logs |
| `error` | Erreur système | Afficher le lien vers le dashboard |
| Aucun status | Pas de CI/CD détecté | Signaler et proposer un curl direct |

Si plusieurs statuses existent, ne pas s'arrêter au premier résultat ambigu. Prioriser le status du provider de déploiement le plus récent et signaler les conflits éventuels (ex: GitHub check vert mais deploy provider en échec).

**Si pending — polling patient :**

Boucle d'attente avec backoff progressif :
1. Attendre 30s → re-check
2. Attendre 45s → re-check
3. Attendre 60s → re-check
4. Attendre 60s → re-check (total ~3min15)
5. Attendre 60s → re-check (total ~4min15)
6. Attendre 60s → re-check (total ~5min15)
7. Attendre 90s → re-check (total ~6min45)
8. Attendre 90s → re-check (total ~8min15)
9. Attendre 90s → re-check (total ~9min45)
10. Attendre 90s → re-check (total ~11min15)

**Pendant l'attente**, afficher un point de progression toutes les 30s pour montrer que c'est actif :
```
⏳ Build en cours... (30s)
⏳ Build en cours... (1min15)
⏳ Build en cours... (2min15)
```

**Si toujours pending après 10 tentatives (~11 min)** : arrêter le polling et proposer via **AskUserQuestion** :
- Question : "Le build prend plus de 11 minutes. Que faire ?"
- Options :
  - **Continuer à attendre** — "Relancer 5 tentatives supplémentaires (~5 min)"
  - **Abandonner** — "Afficher le lien du dashboard pour suivi manuel"

### Step 3 — Health check de l'URL live

**Trouver l'URL de prod** (dans cet ordre) :
1. URL du déploiement confirmé par Vercel MCP quand disponible
2. `target_url` du deployment status (URL du preview Vercel)
3. URL dans CLAUDE.md (domaine custom)
4. Demander à l'utilisateur via **AskUserQuestion**

**Lancer le check :**
```bash
curl -s -o /dev/null -w "%{http_code}" [URL] --max-time 10
```

| Code | Résultat |
|------|----------|
| 200-299 | Site live et fonctionnel |
| 301-308 | Redirection (vérifier la cible) |
| 4xx | Erreur client (page introuvable, auth requise) |
| 5xx | Erreur serveur — problème de build ou de runtime |
| Timeout | Site ne répond pas |

Ne pas assimiler automatiquement `200-299` à "prod OK". Vérifier et signaler les hypothèses risquées suivantes si elles ne sont pas couvertes :
- la page d'accueil répond mais le flow principal n'a pas été exercé
- la réponse provient d'une page marketing/statique alors que la feature livrée concerne un flow applicatif
- une redirection masque un domaine mal configuré, un environnement preview, ou une page de login inattendue
- le endpoint de health est vert mais le produit public peut encore échouer sur auth, permissions, paiements, webhooks, jobs ou données

Quand c'est faisable sans inventer de scénario fragile, ajouter un check de cohérence léger en plus du simple `curl` :
- vérifier l'URL finale après redirection (`curl -I -L` ou équivalent)
- vérifier qu'on touche bien le domaine de prod attendu
- vérifier un marqueur simple de contenu si la page principale doit afficher un titre ou un mot-clé connu

Si la release concerne l'auth, une zone protégée, un dashboard privé, ou un callback OAuth:
- signaler qu'un `200` public ne prouve pas le flow principal
- recommander un passage `sf-auth-debug` ou une vérification Playwright ciblée si le doute principal porte sur login, session ou redirect

Si la nature de la release rend le health check insuffisant, dire explicitement ce qui n'a pas été vérifié au lieu de conclure trop fort.

### Step 4 — Collecter les logs sans troncature

**Quel que soit le résultat (success ou failure), collecter les logs de build en mode complet, puis filtrer les erreurs :**

1. **Récupérer le déploiement cible** :
   - Depuis le `target_url` du status GitHub (Vercel/Netlify).
   - Si Vercel, extraire `teamId`, `projectId` et `idOrUrl` du déploiement.

2. **Source primaire Vercel: logs paginés (obligatoire avant toute conclusion)** :
   - Utiliser `mcp__vercel__get_deployment_build_logs`.
   - Ne pas se limiter à un seul appel avec petite `limit`.
   - Paginer/relancer jusqu'à stabilisation (plus de nouvelles lignes) ou jusqu'au plafond de sécurité ci-dessous.
   - Plafond recommandé: jusqu'à 5000 lignes ou 10 appels successifs, puis marquer explicitement "collecte partielle" si incomplet.

3. **Filtrage erreurs/warnings (obligatoire)** :
   - Après collecte brute, filtrer localement les lignes pertinentes.
   - Priorité de filtres:
     - erreurs: `Error:`, `failed`, `exited with 1`, `Target .* failed`
     - fichiers/positions: `lib/.*:[0-9]+:[0-9]+`, `src/.*:[0-9]+:[0-9]+`
     - warnings critiques: `warning`, `WARN`, `deprecated`, `missing env`
   - Exemples:
   ```bash
   rg -n "Error:|failed|exited with 1|Target .* failed" build-logs.txt
   rg -n "lib/.*:[0-9]+:[0-9]+|src/.*:[0-9]+:[0-9]+" build-logs.txt
   rg -n "warning|WARN|deprecated|missing env" build-logs.txt
   ```

4. **Fallback si logs incomplets ou tronqués** :
   - Si la réponse indique troncature (`truncated`, volume incomplet, stack trace sans erreur source), relancer la collecte avec pagination supplémentaire.
   - Si toujours incomplet via MCP, utiliser le dashboard Vercel (web) pour capturer le bloc complet d'erreur.
   - Toujours fournir le `DASHBOARD_URL` dans le rapport final.

5. **Analyser les logs filtrés** :
   - Identifier la **première erreur causale** (pas seulement la stack finale).
   - Extraire fichier/ligne/colonne si présent.
   - Classifier: TypeScript, ESLint, import, env var, runtime, build toolchain, autre.
   - Inclure 3 à 8 lignes de contexte utiles autour de l'erreur principale quand possible.

6. **Si erreur détectée** — proposer des actions via **AskUserQuestion** :
   - "Le build a échoué. Que veux-tu faire ?"
   - Options :
     - **Corriger automatiquement** — "Je corrige l'erreur identifiée et je re-push" (Recommandé)
     - **Lancer /sf-check** — "Diagnostic complet avant de corriger"
     - **Rollback** — "Reverter le dernier commit et re-push"
     - **Ignorer** — "Je gère manuellement"

7. **Si success** — résumer aussi les signaux faibles :
   - Durée du build (si visible)
   - Warnings éventuels
   - URL de preview/déploiement
   - Mention explicite si les logs ont été partiels malgré statut `success`

Même en cas de succès, remonter les warnings qui indiquent une fragilité produit ou sécurité, par exemple :
- variable d'environnement manquante mais fallback silencieux
- migration, seed, cache, queue ou job ignoré
- warning de bundle/config qui peut casser en runtime
- domaine, headers, CSP, auth callback ou secret potentiellement mal configuré

Si les logs ou le contexte révèlent une hypothèse non prouvée sur la sécurité ou la cohérence du déploiement, l'écrire dans le rapport au lieu de laisser entendre que la prod est entièrement sûre.

### Step 5 — Rapport

Si tout est OK :
```
## Prod Check — [project name]

**Dernier commit :** abc1234 — "feat: add payment flow"
**Deploy :**        ✓ success (il y a 3 min)
**Build :**         32s, 0 warnings
**URL :**           https://winflowz.vercel.app
**Health check :**  ✓ 200 OK (142ms)
**Mode dev :**      vercel-preview-push
**Source deploy :** Vercel MCP

Tout est live.
```

Si erreur :
```
## Prod Check — [project name]

**Dernier commit :** abc1234 — "feat: add payment flow"
**Deploy :**        ✗ failure
**Logs :**          [lien dashboard Vercel]

**Erreur identifiée :**
  Type: TypeScript error
  Fichier: src/components/PaymentForm.tsx:42
  Message: Property 'amount' does not exist on type 'Props'

**Options :** Corriger automatiquement | /sf-check | Rollback | Ignorer
```

Dans tous les cas, ajouter une ligne `Hypothèses / risques restants` dès qu'un point important n'a pas été prouvé. Exemples :
- "Le domaine répond, mais le flow de paiement n'a pas été exercé."
- "Le deploy est vert, mais aucun signal n'a confirmé que les variables d'env de prod sont correctes."
- "Le site répond en 200, mais la vérification n'a pas couvert auth, permissions ou webhooks."

---

### Rules

- Ne jamais rollback automatiquement — toujours demander confirmation
- Si le build est encore pending, patienter selon la boucle de polling ci-dessus avant de déclarer un problème
- Toujours fournir le lien vers les logs — l'utilisateur peut vouloir regarder lui-même
- Ne jamais conclure sur un échec avec des logs tronqués: d'abord collecter/paginer, ensuite filtrer.
- En cas de Vercel, privilégier `get_deployment_build_logs` + filtrage local; dashboard web en fallback, pas en source primaire.
- En mode `vercel-preview-push`, Vercel MCP est la source primaire pour attendre la fin du déploiement; les GitHub commit statuses ne suffisent pas à autoriser le test preview.
- Si pas de CI/CD détecté (pas de statuses sur le commit), proposer un simple curl + signaler que le projet n'a pas de deploy automatique
- Compatible Vercel, Netlify, et tout service qui publie des GitHub commit statuses
- Ne jamais déclarer "prod OK" si seuls des signaux partiels ont été vérifiés. Préférer une conclusion précise du type : "deploy vert et URL répond, mais validation fonctionnelle/sécurité partielle".
- Si la release semble sensible (auth, paiement, données privées, permissions, multi-tenant, webhooks, admin), être explicite sur l'absence éventuelle de preuve côté sécurité ou cohérence produit et recommander `/sf-verify` ou une vérification manuelle ciblée.
- Si le risque principal est un flow d'auth navigateur, recommander explicitement `/sf-auth-debug [URL ou bug]`.
