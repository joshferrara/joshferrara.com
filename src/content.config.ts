import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const writing = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
    tags: z.array(z.string()).default([]),
    growthStage: z.enum(['draft', 'published']).default('published'),
    coverImage: z.string().optional(),
  }),
});

const notes = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    growthStage: z.enum(['draft', 'published']).default('published'),
  }),
});

const archive = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/archive' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    growthStage: z.enum(['draft', 'published']).default('published'),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    url: z.string().optional(),
    image: z.string().optional(),
    status: z.enum(['active', 'archived']).default('active'),
    tags: z.array(z.string()).default([]),
    year: z.number().optional(),
    sortOrder: z.number().default(0),
  }),
});

const talks = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/talks' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    event: z.string().optional(),
    videoUrl: z.string().optional(),
    slidesUrl: z.string().optional(),
    description: z.string().optional(),
  }),
});

const travel = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/travel' }),
  schema: z.object({
    title: z.string(),
    region: z.string().optional(),
    country: z.string().optional(),
    coverImage: z.string().optional(),
    lastUpdated: z.coerce.date().optional(),
  }),
});

const guides = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/guides' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
    tags: z.array(z.string()).default([]),
    growthStage: z.enum(['draft', 'published']).default('published'),
  }),
});

const favorites = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/favorites' }),
  schema: z.object({
    title: z.string(),
    category: z.string(),
    lastUpdated: z.coerce.date().optional(),
  }),
});

const recaps = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/recaps' }),
  schema: z.object({
    title: z.string(),
    year: z.number(),
    description: z.string().optional(),
    coverImage: z.string().optional(),
  }),
});

export const collections = {
  writing,
  notes,
  archive,
  projects,
  talks,
  travel,
  guides,
  favorites,
  recaps,
};
