import { getCollection, type CollectionEntry } from "astro:content";
import type { Locale } from "../i18n/ui";

export async function getPublishedProjects(lang: Locale = "zh"): Promise<CollectionEntry<"projects">[]> {
  const projects = await getCollection(lang === "en" ? "projectsEn" : "projects", ({ data }) => !data.draft);
  return (projects as CollectionEntry<"projects">[]).sort((a, b) => a.data.order - b.data.order);
}
