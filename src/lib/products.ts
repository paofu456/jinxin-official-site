import { getCollection, type CollectionEntry } from "astro:content";
import type { Locale } from "../i18n/ui";

export async function getPublishedProducts(lang: Locale = "zh"): Promise<CollectionEntry<"products">[]> {
  const products = await getCollection(lang === "en" ? "productsEn" : "products", ({ data }) => !data.draft);
  return (products as CollectionEntry<"products">[]).sort((a, b) => a.data.order - b.data.order);
}
