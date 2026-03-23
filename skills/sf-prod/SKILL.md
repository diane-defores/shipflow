---
name: sf-prod
description: Vérifier que la prod fonctionne après un push — status du deploy, logs Vercel, health check de l'URL live
argument-hint: [optional: project name or URL]
---

## Context

- Current directory: !`pwd`
- Project name: !`basename $(pwd)`
- Git remote: !`git remote -v 2>/dev/null | head -1 || echo "no remote"`
- Latest commit: !`git log --oneline -1 2>/dev/null || echo "no commits"`
- CLAUDE.md (for prod URL): !`grep -i "url\|domain\|vercel\|netlify\|prod" CLAUDE.md 2>/dev/null | head -5 || echo "no CLAUDE.md or no URL found"`

## Your task

Vérifier que le dernier déploiement en production a réussi. Trois checks : status du deploy, health check de l'URL, et accès aux logs si erreur.

---

### Step 1 — Identifier le projet

Si `$ARGUMENTS` est fourni, l'utiliser comme nom de projet ou URL.

Sinon, utiliser le répertoire courant. Si pas de git remote, utiliser **AskUserQuestion** :
- Question : "Quel projet vérifier ?"
- Options depuis `/home/claude/shipflow_data/PROJECTS.md`

**Extraire le owner/repo** depuis le git remote :
```bash
# git@github.com:owner/repo.git → owner/repo
# https://github.com/owner/repo.git → owner/repo
```

### Step 2 — Vérifier le status du dernier deploy

**Via GitHub commit statuses API** (Vercel, Netlify y publient leurs résultats) :

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
| `pending` | Build en cours | Attendre 30s et réessayer (max 3 fois) |
| `failure` | Build échoué | Afficher l'erreur + lien vers les logs |
| `error` | Erreur système | Afficher le lien vers le dashboard |
| Aucun status | Pas de CI/CD détecté | Signaler et proposer un curl direct |

**Si pending** : attendre 30 secondes, re-checker. Jusqu'à 3 tentatives (total ~90s). Si toujours pending après 3 essais, afficher le lien du dashboard pour suivi manuel.

### Step 3 — Health check de l'URL live

**Trouver l'URL de prod** (dans cet ordre) :
1. `target_url` du deployment status (URL du preview Vercel)
2. URL dans CLAUDE.md (domaine custom)
3. Demander à l'utilisateur via **AskUserQuestion**

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

### Step 4 — En cas d'erreur : accéder aux logs

**Si le deploy a échoué (failure) ou le site ne répond pas :**

1. **Afficher le lien direct vers les logs** :
   - Le `target_url` du commit status pointe vers le dashboard Vercel/Netlify
   - Ex : `https://vercel.com/diane-ds-projects/winflowz/8eyp8qqwq1qcaZC9KkmzdEmQi5SM`

2. **Récupérer le deployment via GitHub API** pour plus de contexte :
   ```bash
   gh api "repos/{owner}/{repo}/deployments" --jq '.[0] | {id, environment, created_at}'
   gh api "repos/{owner}/{repo}/deployments/{id}/statuses" --jq '.[0] | {state, description, target_url}'
   ```

3. **Si Playwright MCP est disponible** : naviguer vers le dashboard Vercel pour extraire les logs d'erreur directement :
   - Ouvrir `target_url`
   - Chercher les messages d'erreur dans la page
   - Extraire et afficher les lignes pertinentes

4. **Proposer des actions** via **AskUserQuestion** :
   - "Le build a échoué. Que veux-tu faire ?"
   - Options :
     - **Voir les logs** — "Ouvrir le dashboard dans le navigateur" (lance Playwright)
     - **Corriger** — "Lancer /sf-check pour identifier et corriger les erreurs"
     - **Rollback** — "Reverter le dernier commit et re-push"

### Step 5 — Rapport

```
## Prod Check — [project name]

**Dernier commit :** [short SHA] — "[message]"
**Deploy :**        [✓ success / ⏳ pending / ✗ failure]
**Temps de build :** [si disponible]
**URL :**           [URL testée]
**Health check :**  [✓ 200 OK / ✗ status code / ⏱ timeout]

[Si erreur :]
**Erreur :** [description du status]
**Logs :**   [lien vers le dashboard]
**Action recommandée :** [/sf-check pour corriger | rollback | voir les logs]
```

Si tout est OK :
```
## Prod Check — [project name]

**Dernier commit :** abc1234 — "feat: add payment flow"
**Deploy :**        ✓ success (il y a 3 min)
**URL :**           https://winflowz.vercel.app
**Health check :**  ✓ 200 OK (142ms)

Tout est live.
```

---

### Rules

- Ne jamais rollback automatiquement — toujours demander confirmation
- Si le build est encore pending, patienter (30s x 3) avant de déclarer un problème
- Toujours fournir le lien vers les logs — l'utilisateur peut vouloir regarder lui-même
- Si pas de CI/CD détecté (pas de statuses sur le commit), proposer un simple curl + signaler que le projet n'a pas de deploy automatique
- Compatible Vercel, Netlify, et tout service qui publie des GitHub commit statuses
