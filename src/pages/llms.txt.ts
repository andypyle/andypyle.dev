// llms.txt (https://llmstxt.org): a markdown summary of the site for AI answer engines
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getProjects, getSite, hasProjectPage } from '../lib/data';

export const GET: APIRoute = async ({ site }) => {
  const { name, description, links, features } = await getSite();
  const url = (path: string) => new URL(path, site).href;
  const cases = (await getCollection('case-studies')).sort((a, b) => a.data.order - b.data.order);
  const projects = features.projects ? (await getProjects()).filter(hasProjectPage) : [];

  const lines = [
    `# ${name}`,
    '',
    `> ${description}`,
    '',
    `- [About](${url('/about/')}): background, experience and skills`,
    `- [LinkedIn](${links.linkedin})`,
    '',
    '## Case studies',
    '',
    ...cases.map((c) => `- [${c.data.title}](${url(`/case-studies/${c.id}/`)}): ${c.data.summary}`),
  ];
  if (projects.length)
    lines.push('', '## Projects', '', ...projects.map((p) => `- [${p.data.title}](${url(`/projects/${p.id}/`)}): ${p.data.blurb}`));

  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
