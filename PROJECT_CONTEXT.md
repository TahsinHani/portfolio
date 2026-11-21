# PROJECT_CONTEXT.md

Audit of the portfolio as it exists on `main`, last audited **2026-11-20** (HEAD `3f476aa`, working tree clean). This file records what is in the repo. Anything that could not be verified from the repo is listed under "Unverified" at the end.

Related files: [CLAUDE.md](CLAUDE.md) (rules and commands), [TASK_TRACKER.md](TASK_TRACKER.md) (status), [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) (tokens and styles), [HIDDEN-FEATURES.md](HIDDEN-FEATURES.md) (easter-egg plan), [README.md](README.md) (editing how-to).

## 1. What this is

A personal portfolio site for **Tahsin**, a UI/UX designer (site name and copy come from `src/_data/site.json` and the templates). Static site, deployed to GitHub Pages. 22 commits since 2026-11-06 (first commit "Portfolio site built with Eleventy").

## 2. Stack

| Item | Value |
|---|---|
| Generator | Eleventy (`@11ty/eleventy` ^3.1.8, only dependency), ESM (`"type": "module"`) |
| Templates | Nunjucks (`.njk` only; `templateFormats: ["njk"]`) |
| CSS / JS | Hand-written plain files in `src/assets/`, no bundler, no framework, no npm runtime deps |
| Fonts | Self-hosted woff2 in `src/assets/fonts/` (Outfit, Urbanist, Satisfy) |
| Images | `.webp` in `src/assets/images/` |
| Scripts | `npm start` (`eleventy --serve`, port 8080), `npm run build` (writes `_site/`) |
| CI/CD | `.github/workflows/deploy.yml`: on push to `main` (and manual run), Node 24, `npm ci`, `npm run build`, upload `_site`, deploy to Pages |
| Tests / lint / format | None. A successful `npm run build` is the only check (it passed during this audit). |
| Ignored | `node_modules/`, `_site/` |

Config: `eleventy.config.js` defines passthrough copy (`src/assets`, `src/resume`), the `caseStudies` collection (sorted by `order`) and the filters `rel`, `bySlug`, `readableDate`, `pad2`. `readableDate` is defined but its use was not checked.

## 3. Entry points and pages

Output is 17 HTML files:

| Page | Source | Stylesheet |
|---|---|---|
| Homepage `/index.html` | `src/index.njk` | `home.css` |
| All work `/work/index.html` | `src/work/index.njk` | `work.css` |
| 15 case studies `/work/<slug>/index.html` | `src/case-studies/<slug>.njk` | `work.css` + `story.css` |

Shell: `src/_includes/layouts/base.njk` (head, skip link, header, content, optional footer, optional floating CTA). Case studies use `layouts/case-study.njk`, with folder-wide settings in `src/case-studies/case-studies.11tydata.js` (its header comment is the front-matter reference).

There is no 404 page, no sitemap and no `og:image` tag (only `og:title`, `og:description`, `og:type`).

## 4. Homepage structure

Order set in `src/index.njk`, each section a partial in `src/_includes/partials/home/`:

1. `hero.njk`: layered illustration (sky, sun, ridge, boat, bird canvas), headline "I Craft Ideas into Experience", two buttons, two sticky notes ("Focus", "Gentle Reminder").
2. `work.njk`: "Product challenges I've worked on". Cards slide out of a folder on scroll. Featured: bloodconnect, keystone-scheduler, docomate, sumosum, akij-insaf, akij-bakers.
3. `process.njk`: Understand, Design, Deliver (data in front matter), with an animated bird canvas.
4. `about.njk`: dealt-out photo mood board, intro text, "Basic Information" facts, prior roles.
5. `writing.njk`: Medium articles.
6. `glance.njk`: "At a glance", a looping row of 8 photo cards with ‹ › controls.
7. `connect.njk`: contact area with the watercolour window ("Artistic Creations: Coming Soon").

Shared partials: `header.njk` (floating pill nav, mobile slide-down panel, Resume button), `footer.njk`, `float-cta.njk` ("Say hello" button), `contact-card.njk`. Components: `button.njk`, `icons.njk`, `project-card.njk` (macros `projectCard`, `projectGrid`), `writing-card.njk`.

Homepage data in front matter: `featuredWork`, `glance`, `process`, `facts`, `experience`, `mapPins` (7 pins: Hawaii, USA, UK, Netherlands, South Africa, India, Bangladesh, with client logos from `assets/images/clients/`). The map SVG is `_includes/svg/world-map.svg`.

Global data (`src/_data/`): `site.json` (name, email, Calendly booking link, resume path, Medium link, nav, 5 social links), `writing.json` (2 articles), `birds.json` (sprite coordinates for the hero and process canvases).

## 5. Case studies (15)

All 15 files use the same story template. The audit counted these from front matter and the `demo` flag.

| order | slug | demo flag | On homepage | Notes |
|---|---|---|---|---|
| 1 | bloodconnect | false | yes | `website` set (Play Store) |
| 2 | keystone-scheduler | false | yes | body says screen data is placeholder data |
| 3 | docomate | false | yes | `website` set |
| 4 | sumosum | false | yes | `website` set |
| 5 | akij-insaf | false | yes | the structural reference file |
| 6 | akij-bakers | false | yes | |
| 7 | skillcoach | false | no | |
| 8 | apex-ai-studio | false | no | |
| 9 | ivisats | false | no | |
| 10 | ledgerly | **true** | no | ~90-line file |
| 11 | fieldnote | **true** | no | ~90-line file |
| 12 | harbor | **true** | no | ~90-line file |
| 13 | kiosk-kitchen | **true** | no | ~90-line file |
| 14 | tidewater | **true** | no | ~90-line file |
| 15 | atlas-notes | **true** | no | ~90-line file |

- The 9 real studies are 435 to 707 lines each, with 11 to 21 images each in `src/assets/images/projects/`.
- The 6 demo studies each have only `<slug>.webp` and `<slug>-600.webp`. The layout prints "Demo case study. Text and images are placeholders." for them, and `src/work/index.njk` says "Demo projects for now."
- Every `moreWork` slug points to an existing case study.
- `order` values 1 to 15 are unique (the card eyebrow "Case study NN" comes from `order`).

## 6. JavaScript features (`src/assets/js/`)

Each file is a self-contained IIFE, loaded with `<script defer>` from the partial that renders the feature (exception: `scroll-reset.js` loads in `<head>`). Descriptions come from each file's header comment.

| File | Behaviour |
|---|---|
| `scroll-reset.js` | Every visit starts at the top. A `#section` link lands on that section, then the hash is cleared from the URL. The page is hidden until the jump finishes, then fades in. |
| `nav.js` | Mobile menu toggle and active-section highlight |
| `hero.js` | Hero illustration sizing and animated birds (canvas, from `birds.json`) |
| `hero-boat.js` | Boat drifts right to left as the page scrolls, eased and time-based. Stays still under reduced motion. |
| `polaroids.js` | Taps bring a hero sticky note to the front on touch |
| `work-folder.js` | Folder open / scroll animation of the project cards |
| `process-birds.js` | Animated bird canvas in the Process section |
| `mood-board.js` | About photos are dealt out when scrolled to and re-stacked on scroll up. Touch tap brings a card to front. |
| `writing-feed.js` | Fetches the live Medium RSS (`medium.com/feed/@tahsin.hani`, max 4), updates the article count, adds view/read stats when set |
| `glance.js` | Looping drift of the photo row. Pauses on hover, focus, off-screen and hidden tab. Arrows step one card. |
| `map-clients.js` | Client logos appear on pin hover, focus or tap |
| `contact-window.js` | Shutters on the watercolour window open on scroll into view, the arrow draws itself |
| `float-cta.js` | Shows the floating button between the hero and the contact section |
| `story.js` | Case-study tabs (arrow-key navigation), counting stats, reading progress bar, reveal-on-scroll |
| `design-mode.js` | G opens the Design Mode panel: the page's design tokens read live from `:root` (colour, typefaces, type scale, spacing, radius, shadow); click copies the plain value (hex, px, font name, shadow); Esc / G closes. Loaded from `footer.njk`; loads `design-mode.css` on first use |

Conventions seen in the code: IIFEs, no dependencies, `prefers-reduced-motion` checks in animated scripts, and a no-JS fallback (for example, story tab panels all show without JS; the About and contact animations show their final state).

## 7. Key technical decisions (from CLAUDE.md, README, config comments and commit history)

- **Relative links through the `rel` filter.** All internal links and asset paths are site-root paths piped through `rel`, so the site works on a Pages subpath, a custom domain and from disk (`file://`). Links go to `.../index.html`, never a bare directory. Macros that build links are imported `with context`.
- **Two independent stylesheets.** `home.css` and `work.css` are each self-contained and repeat the fonts, tokens and shared components. A shared change must be made in both. `story.css` builds on `work.css` tokens.
- **No bundler.** Plain CSS/JS served as written.
- **GitHub Pages source must be "GitHub Actions"**, not "Deploy from a branch", or Jekyll fails on the raw templates (`Unknown tag 'from'`).
- **One case-study template** with `akij-insaf.njk` as the reference. Sections that have no real content are left out rather than invented.
- **Content lives in front matter** (page header and project card), so lists and cards stay in sync with the page.
- **Onest font removed** (commit `2c7d5e7`); the site uses Outfit, Urbanist and Satisfy.
- **Hidden features are mostly planned, not built**: only Design Mode's tokens panel exists (see HIDDEN-FEATURES.md and TASK_TRACKER.md).

## 8. Known discrepancies found in the audit

These are facts from the repo, not fixes. No file was changed.

1. The footer's "Press **G** for Design Mode" opens the design tokens panel (`design-mode.js`). The rest of the planned Designer mode (grid, inspect, measure) is not built; HIDDEN-FEATURES.md marks it 🟡.
2. `writing-feed.js` has `STATS` with `views: 0, reads: 0` for both articles, so no stats are displayed.
3. `writing.json` holds 2 articles that match the `TOP` ids in `writing-feed.js`.
4. Case studies 10 to 15 are demo placeholders but appear in "All work" and "More work".
5. `keystone-scheduler.njk` carries a visible note that the screen data is placeholder data.

## 9. Unverified (not determinable from the repo)

- Whether GitHub Pages is currently set to "GitHub Actions" and whether the latest deploy succeeded.
- The live URL or custom domain, if any.
- Whether the Calendly link, social links and Medium feed work and are the intended ones.
- Whether the Medium stats (currently 0) are meant to be filled in.
- Cross-browser and device testing status, accessibility audit status and performance measurements. None are recorded anywhere in the repo.
- Which of the real case studies' text and images are final. Only the `demo` flag and file sizes were checked, not the content.
- Whether "6 Years in Design · 3 Years as UI/UX Designer" (hero) matches the `experience` dates in `src/index.njk`. The audit did not judge this.
