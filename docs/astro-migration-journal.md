# Astro Migration Journal

## Purpose

This file records the migration of `blog.ysmiles.com` from a checked-in static site plus Hugo-era source split into a single Astro source repository. It also keeps a lightweight record of the working process with Codex so the migration can later be turned into a retrospective blog post.

## Initial Context

- Workspace date: 2026-04-05
- Public repo target: `blog.ysmiles.com`
- Legacy source repo: `ysmiles-web-dev`
- Existing setup:
  - `blog.ysmiles.com` is the public GitHub Pages repo containing generated static output.
  - `ysmiles-web-dev` contains Hugo content, config, and helper scripts.
- Chosen direction:
  - Adopt Astro as the new static site generator.
  - Converge to one repository: `blog.ysmiles.com`.
  - Use `ysmiles-web-dev` only as migration input until parity is confirmed.

## Early Findings

- The current setup is partly migrated from Jekyll to Hugo.
- Helper scripts still generate Jekyll-style content paths and front matter.
- Site metadata contains placeholders and some broken asset references.
- Some content still contains legacy Jekyll templating or brittle third-party embeds.
- The deployment model can be simplified by building and deploying from one source repo.

## Migration Goals

- Preserve stable public URLs where practical.
- Keep canonical Markdown content in the main repo.
- Replace checked-in generated HTML with Astro source.
- Build and deploy with GitHub Actions and GitHub Pages.
- Normalize front matter and remove legacy Hugo/Jekyll assumptions.

## Working Notes

- 2026-04-05: Reviewed both repos, confirmed `blog.ysmiles.com` should become the single long-term source repo.
- 2026-04-05: Decided to keep a running migration journal for a future write-up about the Astro migration and Codex-assisted workflow.
- 2026-04-05: Wrote an Astro migration specification in `docs/astro-migration-spec.md` covering the target repo layout, route contract, content schema, asset migration, manual cleanup cases, and deployment cutover strategy.
- 2026-04-05: Created an `astro-migration` branch in `blog.ysmiles.com`.
- 2026-04-05: Installed Astro, `@astrojs/rss`, `zod`, `@astrojs/check`, and `typescript`.
- 2026-04-05: Bootstrapped the Astro project structure with `src/`, `public/`, content collections, layouts, basic routes, RSS, and a simple client-side search page.
- 2026-04-05: Copied canonical posts from `ysmiles-web-dev/content/posts/` into `src/content/posts/`.
- 2026-04-05: Copied site images into `public/images/` and added `CNAME` and `robots.txt` under `public/`.
- 2026-04-05: Configured Astro to keep local config writes inside the repo to avoid sandbox-only host config assumptions.
- 2026-04-05: Implemented slug normalization so the generated Astro routes match the existing public URL pattern, including `generic-recursive-lambda-in-c++14`.
- 2026-04-05: Verified the baseline Astro site with `npm run build` and `npm run check`; both now pass.
- 2026-04-05: Cleaned the first batch of legacy content issues in imported posts:
  - replaced Jekyll `{% highlight %}` blocks with fenced code blocks
  - removed Jekyll-only starter instructions from the old welcome post
  - rewrote the markdown test post to be a migration-friendly formatting playground
  - removed a raw Pixiv embed script and replaced it with direct links
  - removed an obsolete insecure `iframe` demo from the Docker HTTP server post
- 2026-04-05: Re-ran `npm run build` and `npm run check` after content cleanup; both still pass.
- 2026-04-05: Replaced the old GitHub Pages workflow that uploaded the repository root with a two-stage Astro workflow:
  - install dependencies with `npm ci`
  - run `npm run check`
  - run `npm run build`
  - upload `dist/` as the Pages artifact
  - deploy with the Pages deploy action
- 2026-04-05: Expanded the GitHub Actions trigger configuration after confirming the first Astro workflow only ran on pushes to `main`:
  - added validation runs for pushes to `astro-migration`
  - added validation runs for pull requests targeting `main`
  - kept the Pages deploy job restricted to pushes on `main`
- 2026-04-05: Removed the legacy checked-in publish output from the repository root as the planned cutover cleanup:
  - deleted the old generated HTML, XML, CSS, JS, font, and image trees from the repo root
  - kept deployment-owned root files sourced from `public/` instead of checked-in generated output
  - left the Astro source, `public/` assets, and generated `dist/` workflow contract as the new source-of-truth layout
- 2026-04-05: Pushed the cleanup follow-up commit to `astro-migration` and confirmed the GitHub Actions branch run started successfully.
  - the `build` job passed on the branch
  - the `deploy` job was skipped as intended because deploys are restricted to pushes on `main`
  - GitHub Actions emitted a platform warning that several official actions in the workflow still run on Node.js 20 internally and will need a future version review before the Node 24 transition deadline
- 2026-04-05: Added a first Astro-native `404` page and aligned site metadata with the current GitHub Pages hostname.
  - changed the configured Astro site URL to `https://blog.ysmiles.com`
  - restored generation of `/404.html` for GitHub Pages
  - re-ran `npm run check` and `npm run build`; both passed
- 2026-04-05: Improved repo and site metadata after the main migration cutover.
  - expanded `README.md` into a practical Astro workflow guide for local development and deployment
  - added favicon, RSS, theme-color, Open Graph, and Twitter metadata in the shared layout
  - marked post pages as `article` metadata pages
  - removed leftover kramdown box marker lines from `test-markdown.md`
  - re-ran `npm run check` and `npm run build`; both passed
- 2026-04-05: Pushed follow-up commits to `astro-migration` for the 404 work and metadata/docs cleanup.
  - `2c66cc6` `add astro 404 page`
  - `ba9ba4a` `update metadata and readme`
- 2026-04-05: Created a local commit for the migration baseline: `bootstrap Astro blog migration` (`1ce9201`).
- 2026-04-05: The `astro-migration` branch was pushed successfully by the user after Codex-side push attempts failed at the execution layer. Local Git state remained healthy, so this was treated as a tooling/runtime issue rather than a repository issue.
