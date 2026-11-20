# DESIGN_SYSTEM.md

The design system as implemented in `src/assets/css/` on 2026-11-20. Values below are copied from the stylesheets. If a value here disagrees with the CSS, the CSS wins; update this file.

`home.css` (2916 lines), `work.css` (1496) and `story.css` (542) are separate files. `home.css` and `work.css` each declare their own `:root` and `@font-face` rules, so a token change must be made in both. `story.css` adds only two tokens of its own and otherwise uses `work.css` tokens.

Visual direction (from HIDDEN-FEATURES.md ground rules and the code): **paper, watercolour and handwriting**. Illustrated, painterly art, sticky notes, polaroids, tape, handwritten accents.

## Typography

| Role | Family | Token | Notes |
|---|---|---|---|
| Display / titles | Outfit (variable, 100-900) | `--font-display`, `--font-title` | system-ui fallback |
| Body text | Urbanist (variable, 100-900) | `--font-text` | system-ui fallback |
| Handwriting accent | Satisfy (400) | `--font-hand` | `cursive` fallback. Case-study headline word via `.cs__hand`, colour `#36416D` per 11tydata comment |

All fonts are self-hosted woff2 (latin and latin-ext subsets), `font-display: swap`.

Type scale (`:root`):

| Token | Value | Defined in |
|---|---|---|
| `--text-display` | `clamp(2.75rem, 1.6rem + 4.6vw, 5.5rem)` | home.css |
| `--text-title` | `clamp(2.25rem, 1.5rem + 3vw, 4rem)` | work.css |
| `--text-section` | `clamp(1.875rem, 1.3rem + 2.2vw, 3rem)` | work.css |
| `--text-card` | `clamp(1.375rem, 1.1rem + 1vw, 1.75rem)` | both |
| `--text-sub` | `clamp(1.125rem, 1.05rem + 0.3vw, 1.25rem)` | both |
| `--text-body-lg` / `--text-body` | `1.125rem` | both |
| `--text-meta` | `clamp(0.8125rem, 0.79rem + 0.1vw, 0.875rem)` | both |

Many components also use literal sizes (16px, 14px, 12px and 24px are the most frequent), so not everything goes through tokens.

Case-study kickers (`.st-k`, `.cs__eyebrow`): Outfit 500, meta size, `letter-spacing: 0.14em`, uppercase, `--st-accent`.

## Colour

Tokens (`:root`):

| Token | Value | Use |
|---|---|---|
| `--color-ink` | `#212121` | text, primary button |
| `--color-ink-secondary` | `#282828cc` | secondary text |
| `--color-ink-hover` | `color-mix(in srgb, var(--color-ink) 91%, #fff)` | hover |
| `--color-bg`, `--color-surface` | `#fff` | page and cards |
| `--color-surface-sunken` | `#f0f0f0` | |
| `--color-surface-tint` | `#f4f5fa` | cool tint: image frames (home), content cards (work) |
| `--color-line` | `#e0e0e0` | hairlines (`--border-hairline: 1px solid var(--color-line)`) |
| `--color-on-ink` | `#fff` | text on ink |
| `--color-accent` | `#1b4965` | **home.css only** |
| `--st-accent` | `#37437e` | story.css: labels, tabs, callouts, list numbers, progress bar |
| `--st-card-line` | `#dde0ec` | story.css card border |

Other hex values found in the three sheets, role not audited: `#36416d` (8 uses, the handwriting blue), `#0f2f42`, `#2a6288`, `#17415a`, `#1b2b6d`, `#7180b9`, `#ece8e3`, `#f4f7f9`, `#e6e6e6`, `#000` / `#000000` (shadows and overlays). Illustration colours live in the `.webp` art, not in CSS.

The theme is light only. No dark mode and no `prefers-color-scheme` rules exist. `<meta name="theme-color">` is `#ffffff`.

## Spacing and layout

| Token | Value |
|---|---|
| `--space-1` to `--space-9` | 0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4, 6 rem |
| `--margin` | 1rem; 2rem from 640px |
| `--page-pad` | 1rem; 2rem from 640px; 3rem from 1024px |
| `--container-max` | 1440px |
| `--container-wide` | 100% |
| `--container-text` | 42.5rem (work.css) |
| `--frame` | 1920px: `body` max-width, with a 1px line shadow at the edges |

`html` has `scroll-behavior: smooth`, `scroll-padding-top: 6rem`, `scroll-padding-bottom: 5rem` (auto under reduced motion).

Case-study content width: `calc(var(--container-max) + 2 * var(--page-pad))`. Case-study header spacing (story.css comment): breadcrumbs 48px, eyebrow 24px, title 16px, intro 24px, button 48px, facts.

## Shape, depth, motion

| Token | Value |
|---|---|
| `--radius-lg` | 24px |
| `--radius-sm` | 8px (work.css only) |
| `--radius-pill` | 999px (buttons, pills) |
| `--shadow` | `0 4px 12px #0000000a` |
| `--btn-height` / `--btn-height-compact` / `--btn-line` | 3rem / 2.5rem / 1.25rem |
| `--ease` | `cubic-bezier(0.2, 0, 0, 1)` |
| `--dur-fast` / `--dur` | 0.15s / 0.3s |

Frequent literal radii: 8px (15 uses), 50% (11), 4px (5). `story.css` adds `--st-num: 1.25rem` and `--rv-delay: 0.15s`.

Cursors: a custom drawn cursor (1x and 2x PNG data URIs) for the page and for `a`, `button`, `summary` and `.pola__card`.

## Responsive rules

Mobile-first. Breakpoints used in `@media` queries:

| Query | Where |
|---|---|
| `width>=640px` | all three sheets (page padding, margins) |
| `width>=768px` | all three sheets |
| `width>=1024px` | all three sheets (11 blocks in home.css) |
| `width>=1200px` | home.css, work.css |
| `width<=479px`, `<=639px`, `<640px`, `<=639.98px`, `<=1023.98px` | home.css (and one in work.css) |
| `hover` | home.css, work.css |
| `forced-colors` | home.css, work.css |
| `prefers-reduced-motion: reduce` | home.css (12 blocks), work.css (5), story.css (1) |

Mixed `<=639px` / `<640px` / `<=639.98px` forms exist for the same boundary. They were left as written.

Behaviour noted in templates and scripts: the nav is a floating pill on wide screens and a slide-down panel on small ones; the footer "Press G" hint is hidden on touch-only screens; case-study facts show 2 columns on small screens and one row of four on wide ones; the hero illustration is sized by `hero.js` plus CSS.

## Components

| Component | Source | Notes |
|---|---|---|
| Button | `components/button.njk` | Pill with rolling-label hover. Variants `primary` (default), `secondary`, `inverse` (home only). Options: `icon`, `trail`, `compact`, `external` (adds `target=_blank`, `rel=noopener` and an `sr-only` "(opens in a new tab)") |
| Icons | `components/icons.njk` | Inline SVG macro |
| Project card | `components/project-card.njk` | Eyebrow "Case study NN", 36px logo/initials tile, title, desc, image. Macros `projectCard`, `projectGrid` |
| Writing card | `components/writing-card.njk` | |
| Header pill nav | `partials/header.njk` | Active-section highlight via `data-section` |
| Footer | `partials/footer.njk` | Copyright, "Press G" hint, Back to top |
| Floating CTA | `partials/float-cta.njk` | "Say hello", compact button |
| Contact card | `partials/contact-card.njk` | Used on homepage, All work and case studies |
| Sticky notes / polaroids / mood-board / tape | `.note`, `.pola`, `.mood` in home.css | Variants `note--yellow`, `note--blue` |
| Story blocks | `story.css` | `cs__sec`, `st-k`, `cs__h`, `cs__p`, `st-grid` + `pcard`, `st-callout`, `st-list`, `st-stats`, `st-split`, `st-tabs`, `st-pal`, `st-note`, `st-details`, `st-credits`. `akij-insaf.njk` demonstrates all of them |

## Imagery

- WebP only. Hero: `hero.webp` (2000w), `hero-1000.webp`, plus separate layers `hero-sun`, `hero-ridge`, `hero-boat`, `hero-birds` (sprite sheet). Section backgrounds: `work-bg`, `glance-bg`, `process-sky`, `writing-sky`, `footer-bg`. Contact window: 5 layered files. About: `about-1`, `about-2`. Avatar: `avatar-96`, `avatar-192`.
- Project images: `<slug>.webp` (1200w) and `<slug>-600.webp`, with extras named `<slug>-<name>.webp`. Client logos: `assets/images/clients/*.webp`, 50x50 tiles with 8px corners, 100x100 source.
- Decorative SVGs inline from `_includes/svg/` (`world-map`, `note-pin`, `contact-arrow`).

## Accessibility measures present in the code

Skip link ("Skip to content" to `#work`), `aria-label` on nav and breadcrumbs, `aria-labelledby` on sections, decorative layers `aria-hidden`, `alt=""` on decorative images, `sr-only` text on external links, `tabindex="0"` on sticky notes and polaroids, pins in a deliberate Tab order, arrow-key tabs, reduced-motion and `forced-colors` rules. Whether these meet WCAG has not been tested.

## Motion inventory

Hero birds and boat, folder-open cards, process birds, mood-board deal-out, shutter/arrow window, glance row drift, button label roll, case-study reveal-on-scroll, count-up stats, reading progress bar. Each is reduced-motion aware per its script's header comment. Details in PROJECT_CONTEXT.md section 6.

## Rules for changes (from the project docs)

- Edit tokens or shared components in **both** `home.css` and `work.css`.
- Do not add bare absolute links; use the `rel` filter.
- New animation must check `prefers-reduced-motion` and keep a no-JS fallback.
- Keep `story.css` dependent on `work.css` tokens only.
