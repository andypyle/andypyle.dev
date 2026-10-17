// Accessibility check: runs axe-core on every built page in light and dark mode at desktop and phone widths.
// Run with `pnpm a11y` (builds first). Exits non-zero if axe finds any violations.
import AxeBuilder from '@axe-core/playwright'
import { readdir, readFile } from 'node:fs/promises'
import http from 'node:http'
import { extname, join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const dist = fileURLToPath(new URL('../dist/', import.meta.url))
const tags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice']
const schemes = ['light', 'dark']
const widths = [1280, 390]

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

// Every .html file in dist/ is a page: about/index.html -> /about/, 404.html -> /404.html
async function findPages(dir) {
  const pages = []
  for (const entry of await readdir(dir, { withFileTypes: true, recursive: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.html')) continue
    const path = '/' + relative(dist, join(entry.parentPath, entry.name)).split(sep).join('/')
    pages.push(path.replace(/index\.html$/, ''))
  }
  return pages.sort()
}

// Minimal static server for dist/, matching trailingSlash: 'always'
const server = http.createServer(async (req, res) => {
  let path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
  if (path.endsWith('/')) path += 'index.html'
  try {
    const body = await readFile(join(dist, path))
    res.writeHead(200, { 'content-type': types[extname(path)] ?? 'application/octet-stream' })
    res.end(body)
  } catch {
    res.writeHead(404).end()
  }
})
await new Promise((resolve) => server.listen(0, resolve))
const origin = `http://localhost:${server.address().port}`

const pages = await findPages(dist)
const browser = await chromium.launch()
let failures = 0

for (const colorScheme of schemes) {
  for (const width of widths) {
    const context = await browser.newContext({ colorScheme, viewport: { width, height: 900 } })
    const page = await context.newPage()
    for (const path of pages) {
      await page.goto(origin + path)
      const { violations } = await new AxeBuilder({ page }).withTags(tags).analyze()
      for (const v of violations) {
        failures++
        console.log(`\n[${colorScheme} ${width}px] ${path}  ${v.id} (${v.impact}): ${v.help}`)
        console.log(`  ${v.helpUrl}`)
        for (const node of v.nodes) console.log(`  - ${node.target.join(' ')}\n    ${node.failureSummary.split('\n').slice(1).join(' ').trim()}`)
      }
    }
    await context.close()
  }
}

await browser.close()
server.close()

const runs = pages.length * schemes.length * widths.length
if (failures) {
  console.log(`\n${failures} violation(s) across ${runs} page checks`)
  process.exit(1)
}
console.log(`No violations: ${pages.length} pages x ${schemes.length} color schemes x ${widths.length} widths`)
