import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import { mkdir, rename } from "node:fs/promises";
import { siteConfig } from "./site.config.ts";
import { generateSitemap } from "./scripts/generate-sitemap.mjs";

// Archive pages retain their .html filenames; existing clean URLs retain directories.
const cleanRoutes = {
  name: "preserve-clean-urls",
  hooks: {
    "astro:build:done": async ({ dir, pages }) => {
      for (const { pathname } of pages) {
        const route = pathname.replace(/^\/+|\/+$/g, "");
        if (!route || route === "404" || route === "500" || /^(en\/)?(article|page|download)\//.test(route)) continue;
        const folder = new URL(`${route}/`, dir);
        await mkdir(folder, { recursive: true });
        await rename(new URL(`${route}.html`, dir), new URL("index.html", folder));
      }
      await generateSitemap(dir, siteConfig);
    },
  },
};

export default defineConfig({
  site: siteConfig.siteUrl,
  output: "static",
  build: { format: "file" },
  devToolbar: { enabled: false },
  integrations: [cleanRoutes],
  vite: {
    plugins: [tailwindcss()],
  },
});
