import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/posts',
    generateId: ({ entry }) => entry.split('/').pop()!.replace(/\.md$/, ''),
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    lang: z.enum(['zh', 'en']),
    category: z.enum(['tech', 'tutorial', 'essay', 'life']),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    cover: z.string().optional(),
    coverWord: z.string().optional(),
  }),
});

const optionalUrl = z
  .union([z.string().url(), z.literal('')])
  .optional()
  .transform((value) => value || undefined);

const projects = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/projects',
    generateId: ({ entry }) => entry.split('/').pop()!.replace(/\.md$/, ''),
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    year: z.number(),
    role: z.string(),
    stack: z.array(z.string()).default([]),
    status: z.enum(['进行中', '已完成', '持续维护', '原型']).default('已完成'),
    repo: optionalUrl,
    demo: optionalUrl,
    order: z.number().default(99),
    sample: z.boolean().default(false),
  }),
});

const life = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/life',
    generateId: ({ entry }) => entry.split('/').pop()!.replace(/\.md$/, ''),
  }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    location: z.string().optional(),
    kind: z.enum(['note', 'photo', 'link']).default('note'),
    tone: z.enum(['blue', 'clay', 'sage', 'sand', 'ink']).default('blue'),
    description: z.string(),
    link: optionalUrl,
  }),
});

export const collections = { posts, projects, life };
