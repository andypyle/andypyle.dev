// schema.org JSON-LD builders, rendered by BaseLayout's `schema` prop
import { getImage } from 'astro:assets';
import type { CollectionEntry } from 'astro:content';
import headshot from '../assets/andy-pyle-headshot.jpg';
import { getSite } from './data';

export type Schema = Record<string, unknown>;

const absolute = (path: string, site: URL) => new URL(path, site).href;

/** The site owner. Other schemas point to it via its @id rather than repeating it. */
export async function person(site: URL): Promise<Schema> {
  const { name, role, links } = await getSite();
  const photo = await getImage({ src: headshot, width: 600, format: 'jpg' });
  return {
    '@type': 'Person',
    '@id': absolute('/#person', site),
    name,
    jobTitle: role,
    url: site.href,
    image: absolute(photo.src, site),
    sameAs: [links.linkedin, links.github].filter((l) => l && l.startsWith('http')),
  };
}

export async function website(site: URL): Promise<Schema> {
  const { name, description } = await getSite();
  return {
    '@type': 'WebSite',
    '@id': absolute('/#website', site),
    name,
    description,
    url: site.href,
    publisher: { '@id': absolute('/#person', site) },
  };
}

export async function profilePage(site: URL, url: URL): Promise<Schema> {
  return {
    '@type': 'ProfilePage',
    url: url.href,
    mainEntity: await person(site),
  };
}

export async function article(entry: CollectionEntry<'case-studies'>, site: URL, url: URL): Promise<Schema> {
  const d = entry.data;
  const hero = d.hero ? await getImage({ src: d.hero, width: 1200, format: 'jpg' }) : undefined;
  return {
    '@type': 'Article',
    headline: d.title,
    description: d.summary,
    url: url.href,
    mainEntityOfPage: url.href,
    datePublished: d.published.toISOString().slice(0, 10),
    image: absolute(hero?.src ?? '/og.png', site),
    keywords: d.tags,
    author: { '@id': absolute('/#person', site) },
    isPartOf: { '@id': absolute('/#website', site) },
  };
}
