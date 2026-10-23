import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { readPages } from "./checks/shared.mjs";

function escapeXml(value) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

// Run after clean-route relocation, using only indexable, self-canonical pages.
export async function generateSitemap(dir, config) {
  if (config.siteMode !== "production") return;
  const origin = new URL(config.siteUrl);
  if (origin.protocol !== "https:") throw new Error("Production sitemap requires an HTTPS siteUrl.");
  const urls = new Set();
  for (const page of readPages(fileURLToPath(dir))) {
    if (/^\/(?:404|500)(?:\.html|\/)?$/.test(page.url)) continue;
    if (/<meta\b[^>]*\bname=["'](?:robots|googlebot)["'][^>]*\bcontent=["'][^"']*\bnoindex\b/i.test(page.html)) continue;
    const canonical = page.html.match(/<link\b[^>]*\brel=["']canonical["'][^>]*\bhref=["']([^"']+)["']/i)?.[1];
    if (!canonical) continue; // Includes plain-text ownership verification files.
    const target = new URL(canonical);
    if (target.origin !== origin.origin || target.href !== new URL(page.url, origin).href) {
      throw new Error(`Sitemap canonical does not match the output route: ${page.url}`);
    }
    urls.add(target.href);
  }
  if (urls.size === 0) throw new Error("Production sitemap contains no indexable pages.");
  const xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    + '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    + [...urls].sort().map(url => `  <url><loc>${escapeXml(url)}</loc></url>`).join("\n")
    + '\n</urlset>\n';
  await writeFile(new URL("sitemap.xml", dir), xml, "utf8");
  console.log(`[sitemap] ${urls.size} indexable URLs written.`);
}
