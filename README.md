# blog.ysmiles.com

This repository is the Astro source for `https://blog.ysmiles.com`.

It replaces the earlier split setup where Hugo source lived in `ysmiles-web-dev/` and generated static output was checked into this repository root. The migration branch keeps the existing posts and assets while moving the site to a single-source Astro workflow.

## Project layout

- `src/`: Astro pages, layouts, components, styles, and content collections
- `src/content/posts/`: canonical Markdown posts
- `public/`: static assets copied directly into the built site
- `.github/workflows/static.yml`: GitHub Pages build and deploy workflow
- `docs/`: migration notes and handoff history

## Local development

This repo uses Node and npm. In WSL environments where Node is managed by `nvm`, make sure `nvm` is loaded before running npm scripts.

```bash
npm install
npm run dev
```

Available scripts:

- `npm run dev`: start the Astro dev server
- `npm run check`: run Astro diagnostics
- `npm run build`: generate the static site into `dist/`
- `npm run preview`: preview the built output locally

## Deployment

GitHub Actions builds the Astro site and deploys `dist/` to GitHub Pages.

- pushes to `astro-migration`: run validation builds only
- pull requests targeting `main`: run validation builds only
- pushes to `main`: build and deploy

## Notes

- `public/CNAME` defines the GitHub Pages custom domain: `blog.ysmiles.com`
- the current migration journal lives in `docs/astro-migration-journal.md`
- old checked-in static site output has been removed in favor of the Astro source tree

## License

Personal posts are licensed under the [Attribution-NonCommercial 4.0 International License](https://creativecommons.org/licenses/by-nc/4.0/).
