# andypyle.com

Static portfolio built with [Astro](https://astro.build) and [Tailwind CSS v4](https://tailwindcss.com) on the **Loam** design system (sage & slate, thick ink outlines, Fredoka + Figtree).

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
    theme.css        Loam tokens as a Tailwind @theme (colors, type, radii, shadows, motion) + dark mode
    global.css       Tailwind import, element defaults, prose, icon micro-interactions, view transitions
  components/
    ui/              Button, IconButton, Icon, Card, Badge, Tag, Placeholder
    ui/button.ts     shared button classes (variants × sizes)
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
- **Images:** every striped `<Placeholder>` marks where a real image goes. Swap for `astro:assets` `<Image>` and keep the outline (`border-3 border-line rounded-lg`).

## Styling

Styles are Tailwind utilities in the markup. The theme in `src/styles/theme.css` replaces Tailwind's defaults with Loam's tokens, so the classes you'll use are:

- **Color:** semantic names that flip in dark mode — `bg-page`, `bg-surface`, `bg-sunken`, `bg-inverse`, `text-fg-1/2/3`, `text-on-fill`, `border-line`, `border-subtle`, `text-link`, `bg-accent-soft` — plus the raw palette (`bg-sage-500`, `bg-mist-100`, …).
- **Type:** `font-display` / `font-body` / `font-mono`; sizes `text-xs`…`text-4xl` (12–36px), `text-body` (17), `text-prose` (19), `text-h4`…`text-h1`, `text-display`. Sizes don't change line-height.
- **Shape:** `rounded-sm/md/lg/xl`, `rounded-full` for pills; offset shadows `shadow-sm/md/lg/xl`; outlines `border-2` / `border-3`.
- **Layout:** spacing is Tailwind's 4px scale; `max-w-page` (1120) and `max-w-content` (680); one breakpoint — `max-md:` for phones (≤720px), `md:` above.
- **Dark mode** is automatic through the semantic colors; `dark:` exists for one-off tweaks.

Long-form case study copy uses `.loam-prose` (in `global.css`), since MDX output can't carry classes.

## Notes

- **Page transitions:** native cross-document View Transitions (`@view-transition { navigation: auto }` in global.css). The active nav pill morphs between pages in Chrome, Edge, Safari 18.2+; other browsers navigate normally. No client router.
- **Dark mode:** follows the OS setting. Force with `<html data-theme="dark">` or `"light"`.
- **Icons:** Lucide, inlined at build time from `lucide-static` (pinned to 0.460.0 — later versions drop brand icons like `linkedin` / `github`). Micro-interactions (`loam-anim-hop`) depend on Lucide's SVG structure.
- **Fonts:** self-hosted via Fontsource — nothing loads from Google.
- **JavaScript:** only three small inline scripts — header border on scroll, mobile menu, project filters (+ email copy toast).
