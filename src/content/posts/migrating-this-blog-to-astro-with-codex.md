---
title: Migrating this blog to Astro with Codex
date: 2026-04-05
summary: "A practical retrospective on moving this blog from a split Hugo/generated-site setup into one Astro source repo, with Codex helping drive the migration, cleanup, validation, and deployment."
tags: [Astro, GitHub, Workflow]
---

For a while, this blog lived in an awkward middle state.

The source content was in one repository from the Hugo era, the published static output lived in another repository, and older Jekyll leftovers were still mixed into some content and assumptions. The site stayed online, but it was no longer pleasant to maintain. Writing a post was not the hard part anymore. Remembering how the whole pipeline fit together was.

This migration had two goals:

- move the blog into a single Astro source repository
- use Codex as a hands-on implementation partner instead of just a source of advice

That second part was the experiment. I did not want a generic “here is how to migrate to Astro” answer. I wanted to work through the actual repo, make decisions in context, verify each step, and keep notes that could later turn into a retrospective.

## What changed

By the end of the migration, the blog had moved to:

- one source repository in `blog.ysmiles.com`
- Astro-based routes for the homepage, posts, tags, about, search, RSS, and 404
- content collections in `src/content/posts`
- static assets and Pages-owned files in `public`
- GitHub Pages deployment from Astro’s `dist` output
- cleaner metadata, cleaner imported posts, and a lighter maintenance story

That is the short version. The more interesting part is how we got there.

## The starting point

Before touching code, we clarified what the workspace actually contained.

The setup looked like this:

- `ysmiles-web-dev` contained the Hugo-era source content, config, and helper scripts
- `blog.ysmiles.com` contained the checked-in generated site that GitHub Pages served
- some content still reflected Jekyll assumptions and theme-specific leftovers
- deployment behavior was more complicated than it needed to be

That led to one simple direction: make `blog.ysmiles.com` the long-term source repository, adopt Astro, and treat the older Hugo repo as migration input instead of the future home of the site.

We also wrote two working documents before the migration got too deep:

- `docs/astro-migration-spec.md`
- `docs/astro-migration-journal.md`

That was one of the better decisions in the whole process. It gave us somewhere to record the target structure, note cleanup cases, and track what had already been verified.

## How the migration happened

The implementation itself was fairly direct.

First, we bootstrapped Astro inside `blog.ysmiles.com` and created the basic source layout:

- content collections under `src/content/posts`
- shared layouts and components
- routes for posts, tags, about, search, RSS, and 404
- static assets moved into `public`

Once that skeleton existed, we copied the canonical posts and images into the Astro project and started cleaning what came over.

Some content only needed front matter cleanup. Other posts needed more hands-on work:

- Jekyll `{% highlight %}` blocks had to become fenced code blocks
- old “welcome to Jekyll” tutorial text had to be trimmed or rewritten
- raw third-party embed scripts had to be removed
- insecure or obsolete embeds had to be replaced with simpler links

One important detail was URL preservation. The blog had already accumulated public routes, so it was worth making Astro respect those patterns instead of casually changing slugs during the move.

## Where Codex actually helped

The most useful part was not “generate an entire website.”

It was helping with the real migration chores that are individually small but collectively exhausting:

- inspect the existing repo structure and infer what should stay stable
- bootstrap Astro in an existing repository instead of a blank demo
- normalize imported content and metadata
- update GitHub Pages deployment
- verify route behavior, build output, and post-cutover behavior
- keep a running implementation record while the work was still happening

In practice, the session felt more like pairing than prompting. I would set direction, sanity-check the browser result, and call out what felt wrong. Codex would inspect files, make targeted edits, run validation, and keep momentum across a long string of incremental tasks.

The loop that worked best was simple:

1. decide the next concrete task
2. let Codex inspect the relevant files and make the change
3. validate locally
4. check the result in the browser
5. record what changed before moving on

That was much more useful than either extreme:

- doing the whole migration manually without help
- or asking for a giant one-shot rewrite without verification

## Deployment and verification

The workflow changes were just as important as the page work.

The old Pages setup uploaded the repository root. The Astro version needed to build the site and publish `dist/` instead, so the workflow was changed to:

- install dependencies with `npm ci`
- run `npm run check`
- run `npm run build`
- upload the Astro build artifact
- deploy through the Pages action

One concrete problem showed up early: the new workflow initially ran only on pushes to `main`, which meant the migration branch did not show the validation run I expected. That turned out not to be a GitHub problem at all. It was simply the trigger configuration. Once the workflow was updated to validate branch pushes and pull requests, iteration became much safer.

Throughout the migration, we kept repeating the same checks:

```bash
npm run check
npm run build
```

That sounds obvious, but during a migration it is easy to confuse “many files changed” with “the system is getting healthier.” Repeating the same verification loop made it much easier to trust each batch of changes before moving on.

We also verified the GitHub side after merge:

- Actions build and deploy status
- Pages settings
- custom domain behavior
- live routes on `blog.ysmiles.com`

At one point the live site looked inconsistent from different fetch paths, which was a good reminder that deployment verification is not always just “the workflow passed, therefore the rollout is done.” Browser checks and direct fetches still mattered.

## Cleanup after the cutover

Once the baseline Astro migration was solid, we moved into cleanup that made the site feel finished instead of merely converted.

That included:

- rewriting the About page into a proper Astro page with working metadata
- improving summaries and front matter for imported posts so cards, RSS, and search results read better
- restoring a real `404.html` for GitHub Pages
- cleaning up shared metadata, favicon handling, and social tags
- expanding the README so the repository documents the Astro workflow clearly

Only after that did it make sense to do a design pass.

That later pass added:

- a persistent theme switcher
- a light `Fresh` theme
- a darker `Stage` theme
- improved article readability
- theme-aware code blocks

That part was more iterative than the migration itself. We adjusted colors, code contrast, spacing, and post layout in the browser until the result felt usable instead of just novel. The final theme system ended up simpler than the earlier experiments, which was probably a good sign.

## What I would keep from this process

The biggest lesson was not really “Astro was the right framework.”

It was that the migration worked because it stayed grounded in small, verifiable steps:

- define the target
- make one change
- validate it
- look at the real result
- write down what happened

Codex was most helpful when used inside that loop. Not as a detached suggestion engine, but as a hands-on collaborator working against the real repository and the real outputs.

The blog is still not “finished,” and that is fine. Personal sites are rarely finished. But it is now much easier to understand, easier to extend, and easier to keep alive. For this project, that was the real success condition.
