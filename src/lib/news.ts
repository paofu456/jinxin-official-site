import { getCollection } from "astro:content";

export async function getPublishedNews() {
  const items = await getCollection("news");
  return items.sort((a, b) => (a.data.date < b.data.date ? 1 : a.data.date > b.data.date ? -1 : a.data.order - b.data.order));
}

export function formatNewsDate(date: string) {
  const [year, month, day] = date.split("-");
  return `${year} 年 ${Number(month)} 月 ${Number(day)} 日`;
}

export function getNewsHref(slug: string) {
  return `/news/${slug}/`;
}

export function splitNewsTitle(title: string) {
  const index = title.indexOf("|");
  if (index <= 0) {
    return { tag: "", display: title };
  }
  return { tag: title.slice(0, index).trim(), display: title.slice(index + 1).trim() };
}
