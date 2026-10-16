import { getCollection } from "astro:content";
import type { Locale } from "../i18n/ui";

export async function getPublishedNews() {
  const items = await getCollection("news");
  return items.sort((a, b) => (a.data.date < b.data.date ? 1 : a.data.date > b.data.date ? -1 : a.data.order - b.data.order));
}

export function formatNewsDate(date: string, lang: Locale = "zh") {
  const [year, month, day] = date.split("-");
  if (lang === "en") {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[Number(month) - 1]} ${Number(day)}, ${year}`;
  }
  return `${year} 年 ${Number(month)} 月 ${Number(day)} 日`;
}

export function getNewsHref(slug: string, lang: Locale = "zh") {
  return lang === "en" ? `/en/news/${slug}/` : `/news/${slug}/`;
}

export function splitNewsTitle(title: string) {
  const index = title.indexOf("|");
  if (index <= 0) {
    return { tag: "", display: title };
  }
  return { tag: title.slice(0, index).trim(), display: title.slice(index + 1).trim() };
}
