import fs from "node:fs";
import path from "node:path";
import { walkFiles } from "./shared.mjs";

const markers = [
  ["starter company name", /Northstar Industrial/i],
  ["demonstration copy", /\bdemonstration\b/i],
  ["placeholder copy", /\b(?:lorem ipsum|placeholder|replace this|starter content|demo content)\b/i],
];

function visibleText(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ");
}

export function checkReleaseContent(projectDirectory, pages) {
  const issues = [];

  for (const page of pages) {
    const text = visibleText(page.html);
    for (const [label, pattern] of markers) {
      if (pattern.test(text)) issues.push(`${page.url}: ${label} remains in public copy`);
    }
  }

  const mediaDirectory = path.join(projectDirectory, "public", "media");
  for (const file of walkFiles(mediaDirectory)) {
    const relative = path.relative(projectDirectory, file).replaceAll("\\", "/");
    if (/\b(?:demo|placeholder)\b/i.test(path.basename(file))) {
      issues.push(`${relative}: demo or placeholder filename remains`);
    }
    if (!/\.(?:svg|txt|md|json)$/i.test(file)) continue;
    const source = fs.readFileSync(file, "utf8");
    for (const [label, pattern] of markers) {
      if (pattern.test(source)) issues.push(`${relative}: ${label} remains in public media`);
    }
  }

  return [...new Set(issues)];
}
