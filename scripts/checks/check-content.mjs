import fs from "node:fs";
import path from "node:path";
import { walkFiles } from "./shared.mjs";

export function checkProductContent(projectDirectory) {
  const directory = path.join(projectDirectory, "src", "content", "products");
  const files = walkFiles(directory).filter((file) => file.endsWith(".md"));
  const errors = [];
  const slugs = new Map();

  for (const file of files) {
    const source = fs.readFileSync(file, "utf8");
    const slug = source.match(/^slug:\s*([^\r\n]+)$/m)?.[1]?.trim();
    if (!slug) {
      errors.push(`${path.relative(projectDirectory, file)}: missing slug`);
      continue;
    }
    if (slugs.has(slug)) {
      errors.push(`duplicate product slug "${slug}" in ${path.relative(projectDirectory, file)} and ${slugs.get(slug)}`);
    } else {
      slugs.set(slug, path.relative(projectDirectory, file));
    }
  }

  return errors;
}
