import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { checkProductContent } from "./checks/check-content.mjs";
import { checkLinks } from "./checks/check-links.mjs";
import { checkOutputSafety } from "./checks/check-output-safety.mjs";
import { checkReleaseContent } from "./checks/check-release-content.mjs";
import { checkSeo } from "./checks/check-seo.mjs";
import { readPages } from "./checks/shared.mjs";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectDirectory = path.resolve(scriptDirectory, "..");
const distDirectory = path.join(projectDirectory, "dist");
const deliveryMode = process.argv.includes("--delivery");

if (!fs.existsSync(distDirectory)) {
  console.error("[verify] dist/ does not exist. Run npm run build first.");
  process.exit(1);
}

const pages = readPages(distDirectory);
const checks = [
  ["SEO and accessible markup", checkSeo(pages)],
  ["Local links and assets", checkLinks(pages, distDirectory)],
  ["Product content", checkProductContent(projectDirectory)],
  ["Output safety", checkOutputSafety(pages)],
];

const siteConfig = fs.readFileSync(path.join(projectDirectory, "site.config.ts"), "utf8");
const warnings = [];
const contentIsReady = /contentStatus:\s*["']ready["']/.test(siteConfig);
const releaseContentIssues = checkReleaseContent(projectDirectory, pages);

if (contentIsReady) {
  checks.push(["Release content", releaseContentIssues]);
} else if (releaseContentIssues.length > 0) {
  warnings.push(`${releaseContentIssues.length} starter/demo marker(s) remain; they become errors when contentStatus is ready`);
}

if (/contentStatus:\s*["']demo["']/.test(siteConfig)) {
  warnings.push("site.config.ts still marks content as demo");
}
if (/siteMode:\s*["']local["']/.test(siteConfig)) {
  warnings.push("site.config.ts is in local noindex mode");
}

if (deliveryMode) {
  const deliveryErrors = [];
  if (!contentIsReady) deliveryErrors.push("contentStatus must be ready");
  if (!/siteMode:\s*["']production["']/.test(siteConfig)) deliveryErrors.push("siteMode must be production");
  checks.push(["Delivery readiness", deliveryErrors]);
}

let errorCount = 0;
for (const [name, errors] of checks) {
  if (errors.length === 0) {
    console.log(`[pass] ${name}`);
    continue;
  }
  console.error(`[fail] ${name}`);
  for (const error of errors) console.error(`  - ${error}`);
  errorCount += errors.length;
}

for (const warning of warnings) console.warn(`[warn] ${warning}`);

if (errorCount > 0) {
  console.error(`[verify] Failed with ${errorCount} issue(s).`);
  process.exit(1);
}

console.log(`[verify] ${pages.length} pages checked successfully.`);
