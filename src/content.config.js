import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";

// Long-form case-study write-ups. Each file is named after a project slug in
// src/data/site.js, which stays the source of truth for names, stacks and links.
const work = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/work" }),
});

export const collections = { work };
