# Public content contract

The website only consumes content that is confirmed and approved for publication.

## Company data

`src/data/company.json` contains shared public facts. Keep contact values in international format and leave optional fields empty when they are not confirmed. Pages should hide empty optional fields rather than display placeholders.

## Products

Each file in `src/content/products/` represents one product. The schema in `src/content.config.ts` validates:

- stable lowercase `slug`
- title and summary
- draft and featured flags
- one or more public images with alt text
- optional confirmed specifications
- page-specific SEO title and description

Changing a product title does not imply changing its slug. Draft products do not receive public routes.

## Media

Only publishable media belongs in `public/media/`. Raw documents, original uploads, internal notes, and license evidence stay outside the static website.

## Missing information

Do not create facts to fill visual gaps. Hide the section when possible and describe the missing information in `notes/content-gaps.md`.
