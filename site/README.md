# ShipFlow Public Site

Astro site for the public ShipFlow website.

Live URL:

```text
https://shipflowzsite.vercel.app
```

This site is the public explanation, docs, FAQ, pricing hypothesis, and skill-discovery surface for ShipFlow. It should stay aligned with the repository README, `shipflow_data/editorial/content-map.md`, and `shipflow_data/technical/public-site-and-content-runtime.md`.

## Commands

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Structure

- `src/pages/index.astro` - landing page
- `src/pages/docs.astro` - public docs overview
- `src/pages/skills/index.astro` - public skill index
- `src/pages/skills/[slug].astro` - public skill detail pages
- `src/pages/pricing.astro` - pricing hypothesis
- `src/pages/faq.astro` - public FAQ
- `src/pages/about.astro` and `src/pages/contact.astro` - trust and contact pages
- `src/pages/skill-modes.astro` - public skill launch guide
- `src/pages/remote-mcp-oauth-tunnel.astro` - remote MCP OAuth tunnel explanation
- `src/pages/why-not-just-prompts.astro` - positioning page
- `src/content/skills/` - public skill descriptions; do not paste full internal `SKILL.md` prompts
- `src/content.config.ts` - Astro content schema; keep generated content compatible
- `src/layouts/BaseLayout.astro` - base document shell
- `src/components/` - reusable page sections
- `src/styles/global.css` - global visual system

## Content Rules

- Do not publish `shipflow_data/technical/` as public site content.
- Do not expose secrets, private logs, credentials, private hostnames, or operator-only traces.
- Keep public claims aligned with `shipflow_data/business/`, `shipflow_data/editorial/`, and the current product reality.
- Keep plugin packaging claims aligned with `shipflow_data/technical/codex-plugin-packaging.md`.
- Run `npm --prefix site run build` after changing rendered site content or schemas.
