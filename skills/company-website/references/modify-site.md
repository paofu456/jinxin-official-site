# Modify an existing site

Work from the existing customer's repository. If it is not present locally, clone its HTTPS URL directly; do not clone the catalog, run `create-site`, select another template, or replace the project history.

Read `AGENTS.md`, inspect the relevant source files, then check `git status --short`, the current branch, and `git remote -v`. Preserve unrelated or uncommitted work. Fetch the existing remote when safe, but do not pull, switch branches, rewrite history, or change `origin` over dirty work without explicit direction.

Change only the requested scope, preserve existing slugs and confirmed facts, and check every consumer of a shared component. Record newly discovered content gaps instead of inventing facts. Run `npm run verify:quick` after meaningful editing batches. For final acceptance choose exactly one build: `npm run verify` for local/no-deployment work, or `npm run verify:delivery` for production delivery with a real canonical domain.

When Git delivery is requested, stage only the intended verified files, create a focused commit, and push the designated branch to the existing customer `origin`. Never push customer changes to the template catalog. Report the commit, remote/branch, verification result, and unresolved content gaps.
