import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import { mkdir, rename } from "node:fs/promises";

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
    },
  },
};

export default defineConfig({
  output: "static",
  build: { format: "file" },
  devToolbar: { enabled: false },
  integrations: [cleanRoutes],
  vite: {
    plugins: [tailwindcss()],
  },
});
