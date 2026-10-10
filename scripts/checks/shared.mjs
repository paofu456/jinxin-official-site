import fs from "node:fs";
import path from "node:path";

export function walkFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walkFiles(target) : [target];
  });
}

export function pageUrl(file, distDirectory) {
  const relative = path.relative(distDirectory, file).replaceAll("\\", "/");
  if (relative === "index.html") return "/";
  if (relative.endsWith("/index.html")) return `/${relative.slice(0, -"index.html".length)}`;
  return `/${relative}`;
}

export function readPages(distDirectory) {
  return walkFiles(distDirectory)
    .filter((file) => file.endsWith(".html"))
    .map((file) => ({
      file,
      url: pageUrl(file, distDirectory),
      html: fs.readFileSync(file, "utf8"),
    }));
}
