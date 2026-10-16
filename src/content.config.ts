import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const images = z.array(
  z.object({
    src: z.string().startsWith("/"),
    alt: z.string().min(1),
  }),
).min(1);

const specifications = z.array(
  z.object({
    label: z.string().min(1),
    value: z.string().min(1),
  }),
).default([]);

const seo = z.object({
  title: z.string().min(10).max(70),
  description: z.string().min(40).max(170),
});

const productsSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().min(1),
  summary: z.string().min(1),
  draft: z.boolean().default(false),
  featured: z.boolean().default(false),
  order: z.number().int().nonnegative().default(0),
  images,
  specifications,
  seo,
});

const projectsSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().min(1),
  summary: z.string().min(1),
  category: z.string().min(1),
  draft: z.boolean().default(false),
  featured: z.boolean().default(false),
  order: z.number().int().nonnegative().default(0),
  images,
  specifications,
  seo,
});

const newsSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  category: z.string().min(1),
  summary: z.string().default(""),
  image: z
    .object({
      src: z.string().startsWith("/"),
      alt: z.string().min(1),
    })
    .optional(),
  featured: z.boolean().default(false),
  order: z.number().int().nonnegative().default(0),
});

const products = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/products" }),
  schema: productsSchema,
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: projectsSchema,
});

const news = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/news" }),
  schema: newsSchema,
});

const productsEn = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/products-en" }),
  schema: productsSchema,
});

const projectsEn = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects-en" }),
  schema: projectsSchema,
});

export const collections = { products, projects, news, productsEn, projectsEn };
