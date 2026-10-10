import { getCollection } from "astro:content";

export async function getPublishedNews() {
  const items = await getCollection("news");
  return items.sort((a, b) => (a.data.date < b.data.date ? 1 : a.data.date > b.data.date ? -1 : a.data.order - b.data.order));
}

export function formatNewsDate(date: string) {
  const [year, month, day] = date.split("-");
  return `${year} 年 ${Number(month)} 月 ${Number(day)} 日`;
}
