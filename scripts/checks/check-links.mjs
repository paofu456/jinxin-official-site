import fs from "node:fs";
import path from "node:path";

function candidatesFor(pathname, distDirectory) {
  const decoded = decodeURIComponent(pathname).replace(/^\/+/, "");
  if (!decoded) return [path.join(distDirectory, "index.html")];

  const exact = path.join(distDirectory, decoded);
  if (pathname.endsWith("/")) return [path.join(exact, "index.html")];
  if (path.extname(decoded)) return [exact];
  return [exact, `${exact}.html`, path.join(exact, "index.html")];
}

export function checkLinks(pages, distDirectory) {
  const errors = [];
  const referencePattern = /\s(?:href|src)=["']([^"']+)["']/gi;

  for (const page of pages) {
    for (const match of page.html.matchAll(referencePattern)) {
      const reference = match[1].trim();
      if (!reference || reference.startsWith("#") || /^(?:https?:|mailto:|tel:|data:|javascript:)/i.test(reference)) continue;

      const resolved = new URL(reference, `https://starter.invalid${page.url}`);
      const candidates = candidatesFor(resolved.pathname, distDirectory);
      if (!candidates.some((candidate) => fs.existsSync(candidate))) {
        errors.push(`${page.url}: unresolved reference ${reference}`);
      }
    }
  }

  return [...new Set(errors)];
}
