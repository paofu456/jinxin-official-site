import { getCollection } from "astro:content";

export async function getPublishedProducts() {
  const products = await getCollection("products", ({ data }) => !data.draft);
  return products.sort((a, b) => a.data.order - b.data.order);
}
