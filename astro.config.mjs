import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import { readFileSync } from 'node:fs'
import { parse } from 'yaml'

import expressiveCode from 'astro-expressive-code'
import mermaid from 'astro-mermaid'

const siteFile = new URL('./src/data/site.yaml', import.meta.url)

// Routes kept in src/routes/: case study detail pages, plus pages that can be switched off via `features` in site.yaml
const routes = {
  name: 'routes',
  hooks: {
    'astro:config:setup': ({ injectRoute, addWatchFile }) => {
      addWatchFile(siteFile) // restart dev server when features change
      const { features = {} } = parse(readFileSync(siteFile, 'utf8'))

      injectRoute({
        pattern: '/case-studies/[slug]',
        entrypoint: './src/routes/case-study.astro',
      })
      if (features.projects !== false) {
        injectRoute({
          pattern: '/projects',
          entrypoint: './src/routes/projects.astro',
        })
      }
    },
  },
}

export default defineConfig({
  integrations: [
    mermaid({
      theme: 'default',
      autoTheme: true,
    }),
    expressiveCode({
      themes: ['catppuccin-frappe'],
      langs: [],
    }),
    mdx(),
    sitemap(),
    routes,
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  site: 'https://andypyle.dev', // update to your real domain
  trailingSlash: 'always',
  markdown: {
    // Keep code blocks styled by .loam-prose pre instead of Shiki's inline theme
    syntaxHighlight: false,
  },
})
