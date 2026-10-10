# Agent instructions

CUSTOMER PROJECT: 深圳金鑫绿建股份有限公司 official Chinese company website.
Source materials and intake notes live in the git-ignored `materials/` and `notes/`.

Selected template: Nexus. Preserve its structured business hierarchy, balanced content density, capability blocks, and accessible corporate tone unless the user explicitly requests a broader redesign.

This repository is a front-end starter. You are expected to edit Astro pages, components, content, and styles directly. Do not build a separate page generator, CMS, backend, or storage service.

## Before editing

1. Read this file and `README.md`.
2. Inspect `site.config.ts`, `src/data/company.json`, and existing product content.
3. Inspect Git status and preserve unrelated or uncommitted user changes.
4. Treat everything in `materials/` and `notes/` as private input, not publishable website content.
5. For a first customer build or a scoped site change, read `skills/company-website/SKILL.md` and the reference it selects before editing.

## Sources of truth

- Technical site mode, language, canonical domain, and navigation: `site.config.ts`
- Confirmed public company facts: `src/data/company.json`
- Brand colors and visual tokens: `src/styles/theme.css`
- Product facts and SEO fields: `src/content/products/*.md`
- Publicly approved files only: `public/media/`
- Page composition and ordering: `src/pages/`
- Shared presentation: `src/components/`

Do not duplicate company phone numbers, email addresses, or descriptions inside page components.

## Content safety

- Never invent certifications, production capacity, delivery times, customers, testimonials, addresses, product specifications, or performance claims.
- When a fact cannot be confirmed, omit the dependent section and record the gap in `notes/content-gaps.md`.
- Copy only approved public assets from `materials/` into `public/media/` and rename them with stable descriptive filenames.
- Never import from `materials/` or `notes/` in website source code.
- Remove all demo company and product content before delivery.

## Change rules

- Make the smallest change that satisfies the user's request.
- Product names and SEO copy may change without changing the existing `slug`.
- Do not rebuild the entire site for a local content or style request.
- When editing a shared component, inspect every page that uses it.
- Keep interactive JavaScript small and accessible. Prefer Astro and native TypeScript; do not add React or Vue without a concrete need.

## Required checks

After each meaningful editing batch run the no-build check:

```bash
npm run verify:quick
```

For final acceptance choose exactly one build command. Use `npm run verify` for local/no-deployment work, or use the stricter command below for production delivery with a real canonical domain:

```bash
npm run verify:delivery
```

Do not run `build`, `verify`, and `verify:delivery` in sequence; both final verification commands already build the site.

The default acceptance scope is desktop-only at approximately 1440px. Keep the starter's existing responsive behavior, but do not spend time on mobile adaptation or 390px QA unless the user explicitly adds mobile work. Check every public route, navigation and CTA, image loading, horizontal overflow, and browser console output. Do not claim visual verification unless it was actually performed.
