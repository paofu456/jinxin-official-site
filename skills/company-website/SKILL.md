---
name: company-website
description: Build or safely modify a customer-specific Astro company website from confirmed business materials using the generated project's content contract, desktop QA, and repository handoff gates.
---

# Company website workflow

Read the repository `AGENTS.md`, then choose one route:

- First customer build: read `references/first-build.md` completely.
- Scoped change to an existing site: read `references/modify-site.md`. Clone that customer's repository directly when it is not present; never regenerate it from the catalog.
- SEO-specific work: also read `references/seo-baseline.md`.

Work in the generated Astro project. Do not add a CMS, backend, storage service, React, Vue, or another page-generator runtime.

Before editing, establish the project as an absolute path and record:

```text
git -C <absolute-project-path> status --short
git -C <absolute-project-path> branch --show-current
git -C <absolute-project-path> remote -v
```

For a first build, origin is intentionally absent until implementation and QA pass. Record the intended GitHub owner/name; create the default public customer repository only after verification using company-site-bootstrap. For an existing site, require its actual customer origin. Never edit with origin pointing to the catalog or overwrite unrelated work. HTTPS via saved gh authentication is supported.

Raw inputs stay in `materials/`; internal facts and gaps stay in `notes/`; only authorized public assets go in `public/media/`. Keep user-confirmed facts, source-material facts, Agent inferences, and conflicts visibly separate. An inference is never confirmation.

For a first build, preserve the selected template and use the content contract first. Do not recursively read or explain the whole template. Inspect `src/pages/` or `src/components/` only for a requested layout change or a specific defect found during verification.

Follow the implementation order: configuration and company data, real content entries, authorized media, theme tokens, then only the specific page/component needed by a concrete requirement or failed check. After each meaningful editing batch, run `npm run verify:quick` and keep a compact checkpoint. If a Patch fails because its old text is not present, re-read the current file, reassess the smallest change, and apply one new patch; never repeat the stale patch.

Run verification commands directly so their real exit codes are preserved. The current acceptance scope is desktop-only unless the user explicitly adds mobile work. A complete first build includes Commit and Push to the existing customer `origin` unless the user explicitly requested local-only output. Never push customer files to the catalog repository.

For a generated project or a dependency recovery, use its lockfile and run `npm ci --include=optional`. Do not install native bindings one by one with `npm install --no-save`, and do not mutate the lockfile merely to make the current machine pass. Retry the same failed command at most once after a concrete corrective change; if it fails again, report the root error and the incomplete gate instead of starting another install/verify loop.

## Efficient verification and browser QA

Use two passes. Do not run `npm run build`, `npm run verify`, and `npm run verify:delivery` in sequence because both verification commands already build the site.

1. **Terminal pass first.** Choose exactly one final build command: run `npm run verify` for a local/no-deployment result, or `npm run verify:delivery` when production delivery with a real canonical domain is in scope. Use a batch HTTP check or the project's available route checker for all public routes, recording only status, title, and failed resources.
2. **Visual pass second.** At approximately `1440 × 900`, inspect only `/`, `/products/`, one representative detail route, `/about/`, and `/contact/`. Take at most one full-page screenshot and one targeted DOM/layout check per page. Add more pages only when a defect or an explicit user requirement requires it. Do not perform mobile QA unless it is explicitly in scope.

Browser calls must return a compact record: route, status, title, key element counts, overflow/errors, and screenshot path. Do not return full HTML, full DOM trees, accessibility dumps, network bodies, or repeated screenshots. Keep screenshots and browser artifacts in ignored temporary directories. Start one task-owned Dev Server, confirm it is healthy, and stop only that server after QA. External image or URL checks get at most one retry; an unavailable external site must not block a build that uses authorized local media.

Announce a compact checkpoint immediately before and after a long dependency, verification, build, or browser phase so progress is visible. Bound the visual pass to ten minutes for the default five-route scope. If a browser operation times out, retry that route at most once with a smaller status/layout check; after a second timeout, mark visual QA incomplete and continue reporting the verified terminal results.

Use loopback for ordinary local QA. Only when the user explicitly requests LAN access, start the project with `npm run dev -- --host 0.0.0.0` and report the actual listening port. Host firewall, router, and container port publication remain operator-managed; do not silently alter them from the website workflow.

Do not alternate browser inspection after every small edit. Finish a coherent content/style batch, run terminal checks, then do the limited visual pass. Re-open only the page whose check found a problem.

Before delivery, search for demo or placeholder text and confirm the customer `origin`, clean intended Git status, pushed commit, and `npm run verify:handoff`. Report exactly which routes and viewport were inspected; never claim a visual check that was not performed.
