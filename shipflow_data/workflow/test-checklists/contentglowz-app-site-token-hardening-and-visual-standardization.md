---
artifact: manual_test_checklist
metadata_schema_version: "1.0"
artifact_version: "1.0.0"
project: "contentglowz"
created: "2026-06-11"
created_at: "2026-06-11 18:00:00 UTC"
updated: "2026-06-11"
updated_at: "2026-06-11 18:00:00 UTC"
status: draft
source_skill: sf-start
scope: "app-site-token-hardening-and-visual-standardization"
owner: "Diane"
confidence: medium
risk_level: high
security_impact: none
docs_impact: yes
linked_systems:
  - "shipflow_data/workflow/specs/contentglowz-app-site-token-hardening-and-visual-standardization.md"
  - "/home/claude/contentglowz/contentglowz_theme.json"
  - "/home/claude/contentglowz/tools/check_design_tokens.mjs"
  - "/home/claude/contentglowz/tools/generate_app_theme_tokens.mjs"
  - "/home/claude/contentglowz/contentglowz_app/lib/presentation/theme/app_theme_tokens.dart"
  - "/home/claude/contentglowz/contentglowz_site/src"
  - "/home/claude/shipflow/tools/design_system_drift_check.py"
depends_on:
  - artifact: "shipflow_data/workflow/specs/contentglowz-app-site-token-hardening-and-visual-standardization.md"
    artifact_version: "1.0.0"
    required_status: ready
supersedes: []
evidence: []
next_step: "/103-sf-verify ContentGlowz app/site token hardening and visual standardization"
stack_profile: "flutter + astro"
target_scope: "contentglowz-app-site-token-hardening-and-visual-standardization"
proof_profile: "automated -> script/build -> manual"
---

# Manual Test Checklist: ContentGlowz App and Site Token Hardening and Visual Standardization

| Scenario ID | Surface | Scenario | Required | Expected | Status | Observed | Evidence pointer | Notes | Bug Link |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CG-DT-APP-TOKENS-001 | app-tokens | Migration app visuals to canonical tokens | yes | Tous les composants changés consomment `AppTheme` / `AppThemeTokens` et aucune valeur visuelle hardcodee non autorisee n'apparaît dans les fichiers de screens/widgets modifiés. | NOT_RUN | not run | N/A | Executer `node /home/claude/contentglowz/tools/check_design_tokens.mjs` puis relever les sorties hors allowlist. | |
| CG-DT-SITE-TOKENS-001 | site-tokens | Migration site visuals to shared variables | yes | Les pages et composants critiques utilisent les variables/tokens partages; pas de literals visuels non autorises pour layout/typographie/couleurs. | NOT_RUN | not run | N/A | Executer `python3 /home/claude/shipflow/tools/design_system_drift_check.py --root /home/claude/contentglowz/contentglowz_site --changed --format markdown`. | |
| CG-DT-MOBILE-001 | mobile-ux | Cohérence mobile app+site | yes | Rendus lisibles et interactifs a 360px: tailles, spacing, boutons et navigation exploitables. | NOT_RUN | not run | N/A | Verifier manuellement `contentglowz_site` (`index.astro`, `sign-in.astro`) et app (entry, feed, settings). | |
