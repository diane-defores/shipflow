---
name: sf-docs
description: Générer, auditer et harmoniser la documentation — README, API docs, component docs, audit de cohérence, ou fichier spécifique
disable-model-invocation: true
argument-hint: [file-path | "readme" | "api" | "components" | "audit" | "update"]
---

## Context

- Current directory: !`pwd`
- Project CLAUDE.md: !`head -80 CLAUDE.md 2>/dev/null || echo "no CLAUDE.md"`
- Business context: !`head -40 BUSINESS.md 2>/dev/null || echo "no BUSINESS.md"`
- Brand voice: !`head -40 BRANDING.md 2>/dev/null || echo "no BRANDING.md"`
- Guidelines: !`head -40 GUIDELINES.md 2>/dev/null || echo "no GUIDELINES.md"`
- Package.json: !`cat package.json 2>/dev/null | head -40 || echo "no package.json"`
- Existing README: !`head -20 README.md 2>/dev/null || echo "no README.md"`
- Project structure: !`find . -maxdepth 3 -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.astro" -o -name "*.vue" -o -name "*.py" \) 2>/dev/null | grep -v node_modules | grep -v .git | grep -v dist | sort | head -40`

## Mode detection

- **`$ARGUMENTS` is a file path** → FILE MODE: document that specific file.
- **`$ARGUMENTS` is "readme"** → README MODE: generate or update README.md.
- **`$ARGUMENTS` is "api"** → API MODE: document all API endpoints.
- **`$ARGUMENTS` is "components"** → COMPONENTS MODE: document all UI components.
- **`$ARGUMENTS` is "audit"** → AUDIT MODE: vérifier la cohérence de toute la doc existante.
- **`$ARGUMENTS` is "update"** → UPDATE MODE: harmoniser et mettre à jour la doc existante.
- **`$ARGUMENTS` is empty** → AUTO MODE: detect gaps and suggest what to document.

---

## FILE MODE

Document a specific file with inline documentation.

### Flow

1. Read the target file and all its imports (1 level deep).
2. Analyze: exports, functions, types, classes, side effects.
3. Add documentation:
   - **TypeScript/JavaScript**: JSDoc/TSDoc comments for exports
   - **Python**: docstrings (Google style)
   - **Astro/Vue**: component description comment at top
4. Don't document obvious code. Focus on:
   - Why, not what
   - Non-obvious parameters and return values
   - Edge cases and gotchas
   - Usage examples for public APIs

---

## README MODE

Generate or update `README.md` for the project.

### Flow

1. Analyze the project: package.json, CLAUDE.md, directory structure, framework, features.
2. Generate sections:

```markdown
# [Project Name]

[One-line description]

## Features
- [Auto-detected from code and package.json]

## Quick Start
[Install + run commands from package.json scripts]

## Project Structure
[Key directories and their purpose]

## Tech Stack
[Framework, UI, backend, auth — auto-detected]

## Environment Variables
[From .env.example or CLAUDE.md]

## Scripts
[All package.json scripts with descriptions]

## Contributing
[Standard section]
```

3. If README.md exists, use **AskUserQuestion**:
   - Question: "README.md already exists. How should I update it?"
   - Options:
     - **Merge** — "Add missing sections, keep existing content" (Recommended)
     - **Replace** — "Overwrite with fresh generation"
     - **Skip** — "Don't modify README.md"

---

## API MODE

Document all API routes/endpoints.

### Flow

1. Find all API route files:
   - Next.js: `app/api/**/route.ts`, `pages/api/**/*.ts`
   - Astro: `src/pages/api/**/*.ts`
   - Convex: `convex/*.ts` (queries, mutations, actions)
   - Python: FastAPI routes, Flask routes
2. For each endpoint, document:
   - **Method**: GET, POST, PUT, DELETE
   - **Path**: full URL path
   - **Auth**: required? what type?
   - **Request body**: schema/type
   - **Response**: schema/type + status codes
   - **Example**: curl or fetch example
3. Output to `docs/API.md` or inline in the route files (ask user preference).

---

## COMPONENTS MODE

Document all UI components.

### Flow

1. Find all component files in the project.
2. For each component, document:
   - **Name**: component name
   - **Description**: what it does (from code analysis)
   - **Props/Slots**: all accepted props with types and defaults
   - **Usage example**: how to use the component
   - **Dependencies**: what it imports/requires
3. Output to `docs/COMPONENTS.md` or as a component index.

---

## AUDIT MODE

Vérifier que la doc existante est cohérente avec le code, à jour, et respecte les conventions.

### Flow

1. **Inventorier toute la doc existante :**
   - README.md, CLAUDE.md, CHANGELOG.md
   - BUSINESS.md, BRANDING.md, GUIDELINES.md
   - FOUNDER.md / AUTHOR.md, INSPIRATION.md, SOURCE.md
   - Dossier `docs/` (tous les fichiers .md)
   - JSDoc/TSDoc/docstrings dans le code
   - Commentaires d'en-tête de composants
   - `.env.example` vs variables réellement utilisées

2. **Vérifier la cohérence code ↔ doc :**
   - **Drift** : la doc mentionne-t-elle des fonctions/fichiers/routes qui n'existent plus ?
   - **Manques** : y a-t-il des exports publics, routes API, ou composants non documentés ?
   - **Exemples cassés** : les exemples de code dans la doc sont-ils encore valides ? (imports, noms de fonctions, signatures)
   - **Structure de fichiers** : l'arborescence documentée correspond-elle à la réalité ?
   - **Variables d'env** : `.env.example` liste-t-il toutes les variables utilisées dans le code ? Y a-t-il des variables documentées mais inutilisées ?

3. **Vérifier les conventions :**
   - **Langue** : la doc est-elle dans la bonne langue ? (FR pour projets FR, EN pour projets EN — vérifier CLAUDE.md)
   - **Accents français** : si doc en FR, vérifier que tous les accents sont corrects
   - **Format** : les fichiers .md suivent-ils un format cohérent entre eux ? (titres, sections, style)
   - **CLAUDE.md** : les règles et patterns documentés reflètent-ils le code actuel ?
   - **Nommage** : les noms de fichiers de doc suivent-ils une convention cohérente ?

4. **Vérifier la fraîcheur :**
   - Comparer la date du dernier commit qui touche la doc vs les commits récents qui touchent le code
   - Identifier les fichiers de doc qui n'ont pas été mis à jour depuis longtemps alors que le code associé a changé
   - Vérifier les numéros de version, dates, et compteurs mentionnés dans la doc

5. **Générer un rapport :**

```
## Audit Documentation — [projet]

### Résumé
| Check              | Résultat          |
|--------------------|-------------------|
| Cohérence code/doc | N drifts trouvés  |
| Conventions        | N écarts          |
| Fraîcheur          | N fichiers stale  |
| Couverture         | X% documenté      |

### DRIFT (doc ≠ code)
- [ ] [fichier.md:ligne] mentionne `functionX` qui n'existe plus
- [ ] [README.md] arborescence ne correspond plus à la réalité

### CONVENTIONS
- [ ] [fichier.md] accents manquants : "genere" → "génère"
- [ ] [docs/API.md] format incohérent avec docs/COMPONENTS.md

### STALE (doc périmée)
- [ ] [CLAUDE.md] dernière mise à jour il y a 3 mois, 15 commits code depuis

### MANQUES (code non documenté)
- [ ] `src/api/payments.ts` — 4 endpoints sans documentation
- [ ] `src/components/Modal.tsx` — props non documentées

### CONTEXTE BUSINESS/MARQUE
- [ ] BUSINESS.md absent — audience, proposition de valeur, business model non documentés
- [ ] BRANDING.md incomplet — section "Valeurs" contient `<!-- à confirmer -->`
- [ ] GUIDELINES.md stale — stack détecté ≠ stack documenté
```

---

## UPDATE MODE

Harmoniser et mettre à jour la doc existante pour la rendre cohérente.

### Flow

1. **Lancer d'abord un audit silencieux** (même logique que AUDIT MODE mais sans rapport).

2. **Vérifier les fichiers de contexte business/marque :**

   Pour chaque fichier (BUSINESS.md, BRANDING.md, GUIDELINES.md) :

   **Si absent** → le créer en posant les questions nécessaires :
   - BUSINESS.md : **AskUserQuestion** "Décris ton projet en une phrase — qu'est-ce que ça fait et pour qui ?" puis générer (même logique que sf-init Step 5a)
   - BRANDING.md : **AskUserQuestion** "Quel ton pour ce projet ?" avec options Pro & accessible / Corporate / Décontracté / Technique (même logique que sf-init Step 5b)
   - GUIDELINES.md : auto-généré depuis le stack détecté, pas de question

   **Si présent mais incomplet** (sections avec `<!-- à confirmer -->`, < 5 lignes de contenu, sections vides) → proposer de compléter :
   - Lire le fichier existant
   - Identifier les sections vides ou marquées à confirmer
   - Poser des questions ciblées UNIQUEMENT sur les sections manquantes
   - Compléter sans écraser le contenu existant

   **Si présent et complet** → vérifier la cohérence :
   - BUSINESS.md : l'audience décrite correspond-elle au contenu du site ? le business model est-il cohérent avec les intégrations détectées (Stripe = payant, etc.) ?
   - BRANDING.md : le ton décrit correspond-il au ton réel du contenu existant ?
   - GUIDELINES.md : le stack documenté correspond-il au stack réel ?
   - Si incohérence trouvée : proposer la correction avec **AskUserQuestion** "Le BUSINESS.md mentionne [X] mais le code montre [Y]. Je mets à jour ?"

   Stocker les fichiers dans `~/shipflow_data/projects/[name]/` et symlinker si pas déjà fait.

3. **Classer les problèmes techniques par priorité :**
   - **P0** : drift dangereux (doc qui induit en erreur — mauvaises commandes, fonctions supprimées)
   - **P1** : conventions non respectées (langue, accents, format)
   - **P2** : doc périmée mais pas fausse (dates, compteurs, arborescences)
   - **P3** : manques de couverture (code non documenté)

4. **Proposer un plan d'action** avec **AskUserQuestion** :
   - Question : "Quels niveaux de problèmes je corrige ?"
   - `multiSelect: true`
   - Options :
     - **P0 — Drift dangereux** — "Doc qui induit en erreur" (Recommandé)
     - **P1 — Conventions** — "Langue, accents, format"
     - **P2 — Doc périmée** — "Dates, compteurs, arborescences"
     - **P3 — Couverture** — "Ajouter la doc manquante"

5. **Appliquer les corrections** pour les niveaux sélectionnés :
   - Corriger chaque fichier de doc concerné
   - Pour les arborescences : régénérer depuis le filesystem réel
   - Pour les compteurs/dates : mettre à jour avec les valeurs actuelles
   - Pour les accents : corriger systématiquement
   - Pour les manques : ajouter la documentation (inline ou fichier séparé selon le pattern existant)

6. **Rapport final :**

```
## Mise à jour Documentation — [projet]

**Contexte business/marque :**
- BUSINESS.md : [créé / complété / mis à jour / OK]
- BRANDING.md : [créé / complété / mis à jour / OK]
- GUIDELINES.md : [créé / mis à jour / OK]

**Doc technique corrigée :**
- [N] drifts corrigés (P0)
- [N] conventions alignées (P1)
- [N] fichiers rafraîchis (P2)
- [N] docs ajoutées (P3)

**Fichiers modifiés :**
- BUSINESS.md — section Audience complétée
- README.md — arborescence mise à jour, compteur skills corrigé
- CLAUDE.md — section Framework actualisée
- docs/API.md — 3 endpoints ajoutés, 1 endpoint supprimé retiré
```

---

## AUTO MODE

Detect documentation gaps and suggest what to document.

### Flow

1. Check for:
   - Missing README.md
   - Undocumented exports (no JSDoc/docstring)
   - API routes without documentation
   - Components without prop documentation
   - Missing .env.example
   - Missing CHANGELOG.md
2. Use **AskUserQuestion**:
   - Question: "I found these documentation gaps. What should I document?"
   - `multiSelect: true`
   - Options based on detected gaps

---

## Important

- **Read actual code** — never invent functionality that doesn't exist.
- **Match existing doc style** — if the project uses a specific documentation format, follow it.
- **French for French projects** — GoCharbon, claiire, plaisirsurprise (FR content).
- Every code example must be **syntactically correct** and **runnable**.
- Don't over-document. Simple, self-explanatory code doesn't need comments.
- For component docs, include the actual prop types from the source code.
- Keep README concise — link to detailed docs instead of putting everything in one file.
- **Accents français obligatoires.** Lors de toute création ou modification de contenu en français, vérifier systématiquement que TOUS les accents sont présents et corrects (é, è, ê, à, â, ù, û, ô, î, ï, ç, œ, æ). Les accents manquants sont une faute d'orthographe. Relire chaque texte produit pour s'assurer qu'aucun accent n'a été oublié — c'est une erreur très fréquente à corriger impérativement.
