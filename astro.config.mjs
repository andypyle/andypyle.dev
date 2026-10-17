import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import { readFileSync } from 'node:fs'
import { parse } from 'yaml'

import expressiveCode, { createRenderer } from 'astro-expressive-code'

const siteFile = new URL('./src/data/site.yaml', import.meta.url)

// Expressive Code adds an external <script> before the first code block on a page. If it's still downloading
// when Chrome first paints, Chrome skips the page transition (the nav pill morph), so strip it. The script
// only made horizontally scrollable code blocks keyboard-focusable; a static tabindex covers that instead.
const noScripts = {
  name: 'no-scripts',
  hooks: {
    postprocessRenderedBlockGroup: ({ renderData }) => {
      const walk = (node) => {
        if (node.tagName === 'pre') node.properties.tabindex = '0'
        node.children = node.children?.filter((child) => child.tagName !== 'script')
        node.children?.forEach(walk)
      }
      walk(renderData.groupAst)
    },
  },
}
// Runs after astro-expressive-code's own plugin, which is what inserts the script
const createRendererWithoutScripts = (options) =>
  createRenderer({ ...options, plugins: [...options.plugins, noScripts] })

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
    expressiveCode({
      themes: ['catppuccin-frappe'],
      langs: [],
      // The copy button needs the script stripped below
      frames: { showCopyToClipboardButton: false },
      customCreateRenderer: createRendererWithoutScripts,
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
