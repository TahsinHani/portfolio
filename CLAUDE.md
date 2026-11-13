# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```sh
npm install      # first time only
npm start        # eleventy --serve: local preview at http://localhost:8080, rebuilds on save
npm run build    # eleventy: writes the static site to _site/
```

There is no test suite, linter or formatter. `npm run build` is the only check: a Nunjucks error fails the build.

Deployment: `.github/workflows/deploy.yml` builds and publishes `_site/` to GitHub Pages on every push to `main`. The Pages source must stay set to **GitHub Actions**. If it is "Deploy from a branch", Jekyll tries to build the raw templates and fails with errors like `Unknown tag 'from'`.

## Architecture

A static portfolio built with Eleventy 3 (ESM config in `eleventy.config.js`). Only `.njk` files are templates; `src/assets/` and `src/resume/` are copied to the output unchanged. There is no bundler: CSS and JS are hand-written, plain files served as they are.

### Relative links: always use the `rel` filter

Every internal link and asset path is written from the site root and piped through the custom `rel` filter, e.g. `{{ '/assets/css/home.css' | rel }}` or `{{ '/index.html#work' | rel }}`. The filter turns them into paths relative to the current page, so the site works on a GitHub Pages subpath, on a custom domain and when opened from disk. Never write bare absolute (`/...`) links in templates. Link to `.../index.html`, not to a bare directory. Macros that build links (`projectGrid`) must be imported `with context` so `rel` can see `page.url`.

### Page shell and stylesheets

`layouts/base.njk` is the shell for every page. Front matter controls it: `stylesheet` (`home.css` or `work.css`), `extraStyles` (more sheets from `assets/css/`), `footer`, `floatCta`, `metaTitle`, `ogTitle`, `description`.

`home.css` (homepage) and `work.css` (All work page and case studies) are two **independent, self-contained** stylesheets. Each repeats the same `@font-face` rules, `:root` design tokens and shared components (buttons, header, footer, cursors). A change to tokens or to shared UI usually has to be made in **both** files. Each sheet keeps only the rules, tokens and keyframes its own pages use (for example, `work.css` has no homepage sections and `home.css` no case-study layout), so copy a rule across when a component starts appearing on the other kind of page. `story.css`, the case study template sheet, builds only on the tokens in `work.css`.

### Case studies

- Each project is one file in `src/case-studies/<slug>.njk`. The file name is the slug: it sets the URL (`/work/<slug>/`), the image names and the IDs used to reference the project.
- `case-studies.11tydata.js` applies the layout (`layouts/case-study.njk`), the permalink and the default page settings to the whole folder. Its header comment is the reference for every front-matter field (`order`, `summary`, `facts`, `cover`, `glance`, `card`, `moreWork`, `format`, `headline`, `lead`, ...).
- The front matter holds the page header **and** the project card shown in lists (`card:`). The page body is plain HTML story sections inserted into the layout at `{{ content }}`.
- `collections.caseStudies` (in `eleventy.config.js`) sorts by `order`. The card eyebrow "Case study 01" is taken from `order`, so `order` values should stay unique.
- Projects are selected by slug with the `bySlug` filter: `featuredWork` in `src/index.njk` (homepage) and `moreWork` in each case study.
- Images go in `src/assets/images/projects/`: `<slug>.webp` (1200w cover/card) and `<slug>-600.webp`. `cover.image` / `card.image` override the base name. Extra screenshots for the story follow `<slug>-<name>.webp`.
- Every case study uses the same template and structure, with `akij-insaf.njk` as the reference. `case-studies.11tydata.js` adds `story.css` to every page, and the layout adds the `cs--story` class and loads `assets/js/story.js`. The body is numbered sections (`cs__sec` with an `st-k` kicker such as "01 · Challenge", a `cs__h` heading and a `cs__p` intro), built from `st-*` blocks: cards, callout, numbered list, stats, decision rows (`st-split`), tabs, palette and notes. The usual order is Challenge, Research, Defining the experience, Key UX decisions, Visual design, Core screens, Launch or handoff, Reflection. Leave out a section the project has no real content for rather than inventing some. `credits:` in the front matter renders the closing "Project credits" list.

### Homepage

`src/index.njk` defines the section order and holds the homepage data in its front matter: `featuredWork`, `process` steps, About `facts` and `experience`, and `mapPins` (pin positions and client logos; the list order is also the keyboard Tab order). Each section is a partial in `_includes/partials/home/`.

Global data in `src/_data/`: `site.json` (name, email, resume, nav, social links), `writing.json` (Medium articles; `writing-feed.js` also fetches the live Medium RSS in the browser), `birds.json` (sprite coordinates for the hero and process canvases, passed to the scripts through `data-birds` attributes).

### JavaScript

There is one small script per feature in `assets/js/`, each a self-contained IIFE without modules or dependencies. Scripts are loaded with `<script defer>` from the partial that renders the feature, not from the base layout (the exception is `scroll-reset.js`, which loads in the `<head>`). Animated scripts check `prefers-reduced-motion`, and features should still work without JS where possible (for example, story tabs show every panel when JS is off). Keep these conventions when you add features.

`HIDDEN-FEATURES.md` is the plan for planned easter eggs, and its ground rules apply to any new one: nothing essential hidden, a discoverable hint, reduced-motion support, keyboard access with shortcuts off inside form fields, and the paper / watercolour / handwriting visual style.
