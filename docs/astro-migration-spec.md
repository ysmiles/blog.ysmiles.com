# Astro Migration Specification

## Scope

Target repository: `blog.ysmiles.com`

Legacy input repository: `ysmiles-web-dev`

This migration replaces the current checked-in static site with an Astro source project while preserving the public site contract where practical.

## Current Status

Completed on `astro-migration`:

- Astro source project bootstrapped in `blog.ysmiles.com`
- posts imported into `src/content/posts/`
- images and required Pages files moved into `public/`
- homepage, post pages, tags, about page, RSS, search, and 404 page implemented
- GitHub Pages workflow updated to build Astro and deploy `dist/`
- legacy checked-in static site output removed from the repository root
- branch validation confirmed on GitHub Actions
- basic site metadata and repo documentation refreshed

Still open or worth revisiting:

- additional content polish for imported posts and standalone pages
- future review of GitHub Actions dependency warnings around the Node 24 transition
- final parity review before merging to `main`

## Public Routes To Preserve

- `/`
- `/about/`
- `/search/`
- `/posts/`
- `/posts/<slug>/`
- `/tags/`
- `/tags/<tag>/`
- `/rss.xml`
- existing root files required for Pages or search engines, especially `CNAME` and `robots.txt`

`/categories/` exists in the generated site, but categories are disabled in the current Hugo source. Do not preserve categories unless they are intentionally reintroduced later.

## Target Astro Layout

```text
blog.ysmiles.com/
  src/
    content/
      config.ts
      posts/
    pages/
      index.astro
      about.astro
      search.astro
      posts/
        index.astro
        [slug].astro
      tags/
        index.astro
        [tag].astro
      rss.xml.ts
    layouts/
      BaseLayout.astro
      PostLayout.astro
    components/
      Header.astro
      Footer.astro
      PostCard.astro
      TagList.astro
      SearchBox.astro
  public/
    images/
    CNAME
    favicon.ico
    robots.txt
```

## Content Collection Schema

Posts will live in `src/content/posts/` with this normalized front matter:

- `title: string`
- `date: Date`
- `tags: string[]`
- `summary: string`
- `subtitle?: string`
- `draft?: boolean`
- `updated?: Date`
- `slug?: string`

Drop these legacy fields during migration:

- `layout`
- `catalog`
- `header-img`
- `header-mask`
- `bigimg`
- `gh-repo`
- `gh-badge`
- theme-specific fields that Astro will not consume

## File Migration Map

### Standalone pages

- `ysmiles-web-dev/content/about.md` -> `src/pages/about.astro` or `src/content/pages/about.md` plus a thin route
- `ysmiles-web-dev/content/search.md` -> `src/pages/search.astro`
- `ysmiles-web-dev/content/default.md` -> discard; replace with Astro content schema and optional local scaffolding scripts

### Posts

Copy all posts from `ysmiles-web-dev/content/posts/` into `src/content/posts/`, then normalize front matter and content.

Direct-copy candidates after front matter cleanup:

- `ARP.md`
- `Bitcoin-price-prediction.md`
- `Differences-between-an-interface-and-abstract-class.md`
- `Generic-recursive-lambda-in-C++14.md`
- `Multiple-routers-bridge-connection.md`
- `Python-basics-for-algorithm-practices.md`
- `Run-a-basic-gRPC-example-with-Docker.md`
- `first-post.markdown`
- `jian-ping-san-ze.md`
- `magic-of-time.md`
- `vim-notes-1.md`
- `wenrou.md`

Manual cleanup required before publishing:

- `my-first-HTML.md`
  - contains Jekyll `{% highlight %}` blocks
- `welcome-to-jekyll.markdown`
  - contains Jekyll instructions and Jekyll code blocks
- `test-markdown.md`
  - appears to be a demo post; contains Jekyll-specific front matter and templating
- `youyuegan.md`
  - contains a raw Pixiv embed script over `http://`
- `HTTP-server-inside-a-docker-container.md`
  - contains a raw `iframe` pointing at an old `http://` host

### Assets

Copy static assets into `public/`:

- `ysmiles-web-dev/static/images/**` -> `public/images/**`

Retain or add root deployment files in `public/`:

- `blog.ysmiles.com/CNAME`
- `blog.ysmiles.com/robots.txt`

Also add real root icon assets or remove theme references to missing files:

- `favicon-32x32.png`
- `favicon-16x16.png`
- `apple-touch-icon.png`
- `safari-pinned-tab.svg`
- `site.webmanifest`

## Content Cleanup Rules

### Markdown and front matter

- Convert `.markdown` files to `.md` unless there is a specific reason not to.
- Remove tabs from front matter and normalize to consistent YAML formatting.
- Add `summary` to every post.
- Add `author` only if the final Astro implementation needs per-post overrides; otherwise use site-level author metadata.

### Legacy syntax

- Replace Jekyll `{% highlight %}` blocks with fenced code blocks.
- Remove Jekyll-only prose that describes `_posts`, `jekyll serve`, or Beautiful Jekyll behavior.
- Remove theme-specific shortcodes or fields that no longer map to the Astro design.

### Embeds and external content

- Replace insecure `http://` embeds where possible.
- Remove raw third-party scripts unless they are still necessary and safe.
- Prefer local images or standard links over brittle embedded widgets.
- Review the Google Drive audio link in `wenrou.md`; keep only if it still works and the UX is acceptable.

## Search, RSS, and Comments

### Search

Phase 1 recommendation:

- implement a simple client-side search using a generated JSON index
- do not attempt a heavy external search integration initially

### RSS

- implement `src/pages/rss.xml.ts` from the post collection
- preserve the public RSS route

### Comments

Phase 1 recommendation:

- remove Disqus during migration
- revisit later only if comments are still important

## Implementation Order

1. Bootstrap Astro and package tooling inside `blog.ysmiles.com`.
2. Add base layout, shared styling, and site metadata.
3. Import assets into `public/`.
4. Import posts and normalize front matter.
5. Port homepage, post detail pages, posts index, and tags.
6. Port about page.
7. Add RSS.
8. Add search.
9. Validate route parity and metadata.
10. Replace the current Pages workflow with Astro build and deploy.
11. Remove old checked-in generated HTML from the repo root.
12. Retire `ysmiles-web-dev` after parity is confirmed.

## Git and Cutover Strategy

- Work on a migration branch in `blog.ysmiles.com`.
- Keep the current published static site untouched until Astro parity is acceptable.
- Only change the GitHub Pages workflow once the Astro branch builds and serves the expected routes.
- Remove the legacy generated files in one deliberate cutover commit so rollback remains simple.
