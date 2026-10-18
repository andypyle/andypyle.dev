import { defineCollection, z } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { parse } from 'yaml';

// A YAML file holding one object → a single entry, read with getEntry(collection, id)
const yamlObject = (path: string, id: string) => file(path, { parser: (text) => [{ ...parse(text), id }] });

// A YAML list → one entry per item, keeping file order in `order`. Plain strings become { name }.
const yamlList = (path: string) =>
  file(path, {
    parser: (text) =>
      (parse(text) as unknown[]).map((item, i) => ({
        ...(typeof item === 'string' ? { name: item } : (item as object)),
        id: String(i),
        order: i,
      })),
  });

const site = defineCollection({
  loader: yamlObject('src/data/site.yaml', 'site'),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    description: z.string(),
    email: z.string().email().optional(),
    // Header status badge; omit to hide it
    availability: z.string().optional(),
    links: z.object({ linkedin: z.string(), github: z.string().optional() }),
    nav: z.array(z.object({ id: z.string(), label: z.string(), href: z.string() })),
    features: z.object({ projects: z.boolean().default(true) }).default({}),
  }),
});

const experience = defineCollection({
  loader: yamlList('src/data/experience.yaml'),
  schema: z.object({ when: z.string(), role: z.string(), org: z.string(), order: z.number() }),
});

const skills = defineCollection({
  loader: yamlList('src/data/skills.yaml'),
  schema: z.object({ name: z.string(), order: z.number() }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    kind: z.enum(['App', 'Library', 'Experiment']),
    year: z.string(),
    blurb: z.string(),
    stack: z.array(z.string()),
    code: z.string().optional(),
    live: z.string().optional(),
    order: z.number().default(0),
  }),
});

const caseStudies = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/case-studies' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      company: z.string(),
      year: z.string(),
      summary: z.string(),
      role: z.string(),
      team: z.string(),
      timeline: z.string(),
      // When the case study was published (not when the work happened; that's `year`)
      published: z.coerce.date(),
      stack: z.array(z.string()).optional(),
      tags: z.array(z.string()).optional(),
      hero: image().optional(),
      heroAlt: z.string().optional(),
      tone: z.enum(['sage', 'mist', 'moss', 'lichen', 'dusk']).default('sage'),
      outcome: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
      order: z.number().default(0),
      featured: z.boolean().default(false),
    }),
});

export const collections = { site, experience, skills, projects, 'case-studies': caseStudies };
