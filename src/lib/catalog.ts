import projectsZh from "../data/project-catalog.json";
import projectsEnMap from "../data/project-catalog-en.json";
import newsZh from "../data/news-catalog.json";
import newsEnMap from "../data/news-catalog-en.json";
import type { Locale } from "../i18n/ui";

type ProjectRecord = (typeof projectsZh)[number];
type ProjectEnFields = {
  slug?: string;
  title?: string;
  categories?: string[];
  summary?: string;
  images?: ProjectRecord["images"];
  specifications?: ProjectRecord["specifications"];
  bodyHtml?: string;
  related?: ProjectRecord["related"];
};
export type LocalizedProject = ProjectRecord & ProjectEnFields;

type NewsRecordItem = (typeof newsZh)[number];

/** Project catalog in the requested language. English overlays translated fields onto the Chinese source of truth. */
export function getProjectCatalog(lang: Locale = "zh"): LocalizedProject[] {
  if (lang === "zh") return projectsZh;
  const map = projectsEnMap as Record<string, ProjectEnFields>;
  return projectsZh.map((p) => ({ ...p, ...(map[p.path] ?? {}) }));
}

/** Localize news without changing the source dates, images, ordering or routes. */
export function getNewsCatalog(lang: Locale = "zh"): NewsRecordItem[] {
  if (lang === "zh") return newsZh;
  const map = newsEnMap as Record<string, Pick<NewsRecordItem, "title" | "summary" | "bodyHtml">>;
  return newsZh.map(n => ({ ...n, ...(map[n.path] ?? {}) }));
}

/** English URL for a catalog record: translated detail page when available, otherwise the English-framed archive page. */
export function localizedRecordHref(record: { path: string; slug?: string }, type: "projects" | "news", lang: Locale) {
  if (lang !== "en") return record.path;
  if (record.slug) return `/en/${type}/${record.slug}/`;
  return "/en" + record.path;
}

/**
 * Rewrite archive-internal links in scraped HTML for the English route tree:
 * every archive path also exists under /en/, so links stay within the English frame.
 * Already-prefixed hrefs ("/en/…") are not touched.
 */
export function localizeArchiveHtml(html: string, lang: Locale) {
  if (lang !== "en") return html;
  return html.replace(/href="\/(article|page|download)\//g, 'href="/en/$1/');
}
