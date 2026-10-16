# andypyle.com

Static portfolio built with [Astro](https://astro.build) on the **Loam** design system (sage & slate, thick ink outlines, Fredoka + Figtree).

## Getting started

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
npm run preview
```

Requires Node 18.17+ (Astro 5).

## Structure

```
src/
  styles/
    tokens/          colors, dark theme, type, spacing, effects, base — from the design system
    components.css   .loam-* component classes
    site.css         page layout (header, mobile nav, cards, about, case study)
    global.css       imports everything above
  components/
    ui/              Button, IconButton, Icon, Card, Badge, Tag, Placeholder
    Header, MobileNav, Footer, SectionHead, CaseCard, ProjectCard
  layouts/BaseLayout.astro   fonts, global CSS, header/footer/mobile nav
  data/site.ts               name, links, nav, projects, experience, skills
  content/case-studies/*.md  one file per case study (schema in content.config.ts)
  pages/                     /, /about/, /case-studies/, /projects/, 404
  routes/case-study.astro    /case-studies/<slug>/ (wired up via injectRoute in astro.config.mjs —
                             you can move it to pages/case-studies/[slug].astro and drop the integration)
```

## Editing content

- **Case study:** add `src/content/case-studies/my-thing.md` with the frontmatter fields from `content.config.ts`. `featured: true` puts it on the home page (first two by `order`).
- **Projects / experience / skills / links:** edit `src/data/site.ts`. Add your GitHub URL there.
- **Images:** every striped `<Placeholder>` marks where a real image goes. Swap for `astro:assets` `<Image>` and keep the 3px `var(--line)` border.

## Notes

- **Page transitions:** native cross-document View Transitions (`@view-transition { navigation: auto }` in components.css). The active nav pill morphs between pages in Chrome, Edge, Safari 18.2+; other browsers navigate normally. No client router.
- **Dark mode:** follows the OS setting. Force with `<html data-theme="dark">` or `"light"`.
- **Icons:** Lucide, inlined at build time from `lucide-static` (pinned to 0.460.0 — later versions drop brand icons like `linkedin` / `github`). Micro-interactions (`loam-anim-hop`) depend on Lucide's SVG structure.
- **Fonts:** self-hosted via Fontsource — nothing loads from Google.
- **JavaScript:** only three small inline scripts — header border on scroll, mobile menu, project filters (+ email copy toast).
