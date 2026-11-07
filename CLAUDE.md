# andypyle.dev

## Content pages must be SEO-ready

Every new page or content entry (case study, project, or a new section) ships with all of the following. Check the built HTML in `dist/`, not just the source.

- **Unique title and description.** Pass `title` and `description` to `BaseLayout`. Never fall back to the site-wide description from `site.yaml`; a page that does looks identical to the home page in search results. Search results cut descriptions off around 155 to 160 characters, so put the key point first.
  - Case studies: `summary` frontmatter. Projects: `blurb` frontmatter. Index pages: a description written for that page.
- **Share image.** Pass `image` to `BaseLayout` (case study `hero`, project `image`) so link previews show the real work instead of `/og.png`.
- **Structured data.** Pass `schema` to `BaseLayout` using a builder from `src/lib/schema.ts`: `article()` for case studies, `softwareApplication()` for projects. A new content type gets its own builder there, with `author` pointing at `/#person`.
- **Alt text** on every meaningful image (`heroAlt`, `imageAlt`, `<Figure alt>`). Decorative only when the image repeats nearby text.
- **Heading order.** One `h1` per page, no skipped levels. Cards take a `headingLevel` prop to fit the page they're on.
- **Sitemap.** New routes must appear in `dist/sitemap-0.xml`. Pages that shouldn't be indexed use `noindex` on `BaseLayout`.
- **Run `pnpm a11y`** before calling the work done. It builds the site and runs axe on every page in both color schemes at desktop and phone widths.
