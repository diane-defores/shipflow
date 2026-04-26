# sf-audit-translate

> Check whether a multilingual product is complete, coherent, and safe to ship across locales.

## What It Does

`sf-audit-translate` audits translation quality and i18n implementation for a page or a full project. It checks completeness, terminology consistency, locale-specific SEO, hardcoded strings, formatting, and routing behavior.

The outcome is practical: it shows where localization is missing, misleading, or technically broken.

## Who It's For

- Solo founders shipping in more than one language
- Product teams maintaining localized marketing sites or apps
- Operators who need confidence before expanding a multilingual surface

## When To Use It

- when a new locale has been added
- when translation work was done quickly and needs a real audit
- when you suspect inconsistencies between locale files, routes, and rendered UI

## What You Give It

- a page path, a multilingual project, or `global`
- existing locale files, content collections, or i18n setup in the repo

## What You Get Back

- a review of missing translations and terminology drift
- visibility into technical i18n issues such as `lang`, `hreflang`, canonical, or routing mistakes
- concrete guidance on what to fix before users see broken or mixed-language interfaces

## Typical Examples

```bash
/sf-audit-translate
/sf-audit-translate src/pages/fr/pricing.astro
/sf-audit-translate global
```

## Limits

This skill depends on the repo exposing the translation system clearly. It can identify likely quality issues, but nuanced cultural adaptation may still need a native speaker review.

## Related Skills

- `sf-audit-copy` for localized copy quality
- `sf-audit-seo` for multilingual search and indexing issues
- `sf-audit` when translation quality is only one part of a wider release review
