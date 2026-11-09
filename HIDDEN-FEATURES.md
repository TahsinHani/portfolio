# Hidden Features Plan

Easter eggs and small surprises for the portfolio. They reward curious visitors and show off the skills recruiters hire for.

**Implemented:** ⬜ Not started · 🟡 In progress · ✅ Done
**Plan:** Phase 1 = start here · Phase 2 = next · Phase 3 = nice to have

## Recruiter impact

| # | Feature | Description | Implemented | Plan |
|---|---|---|---|---|
| 1 | Designer mode (press `G`) | Shows the page's grid, spacing and type scale on top of it. Hovering an element shows a Figma-style inspect tag. | ⬜ | Phase 1 · new `designer-mode.js` + overlay CSS |
| 2 | X-ray lens on case-study covers | Hovering a cover turns the cursor into a lens. It shows the wireframe beneath the final UI. | ⬜ | Phase 2 · one wireframe image per project |
| 3 | "The ones that didn't make it" | A crumpled paper ball at the end of each case study. It unfolds rejected directions and why you dropped them. | ⬜ | Phase 2 · add to `case-study.njk`, content per project |

## Personal moments

| # | Feature | Description | Implemented | Plan |
|---|---|---|---|---|
| 4 | Visitor's pin on the map | Drops a dashed pin in the visitor's time zone: "You're here. Let's make it 8." Each pin also shows its live local time. | ⬜ | Phase 1 · extend `map-clients.js` |
| 5 | Click the sun to set it | The hero turns to dusk, the birds land on the ridge, and stars form your initial. A dark mode that tells a story. | ⬜ | Phase 2 · `hero.js` + new night art layer |
| 6 | Knock on the window | Click the "Coming Soon" window three times. A hand passes out a sketch as a sneak peek. | ⬜ | Phase 2 · extend `contact-window.js`, needs hand + sketch art |
| 7 | Flip the polaroids | Double-tap a mood-board photo to flip it. The back has a handwritten age, place and memory. | ⬜ | Phase 3 · `mood-board.js` + back-side text |
| 8 | Peel the "Gentle Reminder" | Clicking the blue sticky note peels it away. Another reminder waits underneath. | ⬜ | Phase 3 · `polaroids.js` + list of reminders |

## Quick wins

| # | Feature | Description | Implemented | Plan |
|---|---|---|---|---|
| 9 | Console greeting | A text-art bird appears in DevTools. It says "Built by hand. Try pressing G." | ⬜ | Phase 1 · small script loaded in `base.njk` |
| 10 | Custom 404 page | "This bird flew off course," with the flock pointing home. GitHub Pages shows it for broken links. | ⬜ | Phase 1 · new `src/404.njk` |
| 11 | Print stylesheet | Ctrl+P gives a clean one-page summary. It ends with a QR code back to the site. | ⬜ | Phase 1 · `@media print` rules in `home.css` |
| 12 | Tab-away title | Switching tabs changes the title to "🐦 The birds are waiting…". The favicon turns sleepy. | ⬜ | Phase 3 · `visibilitychange` listener + sleepy avatar |
| 13 | Type "hire" anywhere | Sticky notes flutter down with "Excellent decision." A button copies your email. | ⬜ | Phase 3 · key listener, off inside form fields |

## Suggested order

1. **Phase 1:** Designer mode, console greeting, visitor's pin, 404 page, print stylesheet
2. **Phase 2:** X-ray lens, rejected directions, sunset, window knock
3. **Phase 3:** Polaroid flip, sticky-note peel, tab-away title, "hire" keyword

## Ground rules (check every feature)

- [ ] Nothing essential is hidden: work, resume and email stay visible.
- [ ] It has a hint, such as the console message or a footer "psst… press G".
- [ ] It respects `prefers-reduced-motion`, like the existing scripts.
- [ ] It works by keyboard, and shortcuts stay off while typing in a field.
- [ ] It fits the paper, watercolour and handwriting style.
