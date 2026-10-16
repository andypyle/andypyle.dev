import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projects'>;

const byOrder = (a: { data: { order: number } }, b: { data: { order: number } }) => a.data.order - b.data.order;

export async function getSite() {
  const entry = await getEntry('site', 'site');
  if (!entry) throw new Error('Missing src/data/site.yaml');
  const site = entry.data;
  // Hide nav items whose id matches a disabled feature
  const nav = site.nav.filter((n) => site.features[n.id as keyof typeof site.features] !== false);
  return { ...site, nav };
}

export const getExperience = async () => (await getCollection('experience')).sort(byOrder).map((e) => e.data);

export const getSkills = async () => (await getCollection('skills')).sort(byOrder).map((e) => e.data.name);

export const getProjects = async () => (await getCollection('projects')).sort(byOrder);
