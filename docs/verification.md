# Verification

`npm run verify:quick` performs Astro type checking without producing a build. Use it after meaningful editing batches.

`npm run verify` performs type checking, one production build, and static output checks. Use it for final local/no-deployment acceptance.

The output checker validates:

- every HTML page has a title and meta description
- local page and asset references resolve inside `dist/`
- images have non-empty alt text, unless an empty alt is paired with explicit decorative semantics
- private directory names are not leaked into HTML
- no localhost canonical URL is emitted
- starter/demo/placeholder public copy and media do not remain when `contentStatus` is `ready`

`npm run verify:delivery` performs the same single build and checks, then adds a release gate: `site.config.ts` must use `contentStatus: "ready"` and must not use `siteMode: "local"`. Run it instead of `npm run verify` when production delivery is in scope; never run `build`, `verify`, and `verify:delivery` in sequence.

After committing and pushing a customer site, run `npm run verify:handoff -- --owner <owner> --repo <customer-repo>`. It requires an SSH `origin` for that customer repository, a clean worktree, no tracked private/generated files, and the same commit on local and remote `main`.
