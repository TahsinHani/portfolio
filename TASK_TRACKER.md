# TASK_TRACKER.md

Status as of **2026-11-20**, HEAD `3f476aa` on `main` ("I have updated few case study images, add another case study"). Working tree clean. `npm run build` succeeds (17 pages).

Only items found in the repo are listed. Items marked **(needs confirmation)** are not recorded anywhere and are the owner's call. Keep this file updated at the end of each work session.

## Completed (present in the repo)

- Eleventy 3 setup, GitHub Pages deploy workflow, README, CLAUDE.md
- Relative-link system (`rel` filter) used across all templates
- Page shell, header (floating pill nav, mobile panel, Resume button), footer ("Back to top"), floating "Say hello" button
- Homepage: hero (animated birds, boat, sticky notes), Selected work folder, Process, About (mood board, facts, roles), Writing, At a glance, Connect (watercolour window), world map with client logos
- All work page
- 9 full case studies in the shared story template: BloodConnect, Keystone Scheduler, Docomate.ai, SumoSum, Akij Insaf, Akij Bakers, SkillCoach AI, Apex AI Studio, IVISATS
- Story template blocks and `story.js` (tabs, stats, progress bar, reveal)
- Reduced-motion handling and no-JS fallbacks in the animated scripts (per header comments)
- Case-study logos on project cards (commit `a5a1154`)
- Onest font removed (commit `2c7d5e7`)
- SumoSum page cover (`sumosum-cover.webp`, 2240×1680) replaced with "Feature Image - SumoSum" (marketing hero above the dashboard); alt text and caption updated (2026-11-22). The project card still uses "Cover Image - SumoSum" (`sumosum.webp` / `-600`)
- Akij Bakers "08 · Responsive design" figure replaced with the staggered four-phone mockup supplied by the owner: `akij-bakers-phones.webp` (1400×905) replaces `akij-bakers-mobile.webp` (deleted); alt text updated (2026-11-22)

## In progress / unfinished

| Item | Evidence |
|---|---|
| 6 demo case studies (Ledgerly, Fieldnote, Harbor, Kiosk Kitchen, Tidewater, Atlas Notes) | `demo: true`, ~90 lines each, 2 images each, page says text and images are placeholders. No record of which, if any, will become real studies. **(needs confirmation)** |
| Keystone Scheduler screen data | The page states names, emails and figures in the screens are placeholder data |
| Homepage features only 6 of 9 real studies | SkillCoach AI, Apex AI Studio and IVISATS are not in `featuredWork`. Intentional or not is not recorded. **(needs confirmation)** |
| Map: BAT logo and Apex/Docomate pins | The designer supplied a BAT SVG (an embedded PNG); it could not be copied intact from chat, so the map still uses the Wikimedia `bat.png` until the file is placed in `src/assets/images/clients/`. `apex.svg` and `docomate.svg` are saved but not on the map: the repo does not say which country each client is in. FFL Studio ("FFL Studio Barcelona" in the gallery) sits under Bangladesh as asked. **(needs confirmation)** |
| Medium article stats | `STATS` in `writing-feed.js` is 0/0 for both articles, so none are displayed |
| "Artistic Creations: Coming Soon" | Shown in the contact window. The feature behind it is not in the repo |

## Known bugs / mismatches

1. **Footer promises Design Mode, which does not exist.** `footer.njk` shows "Press G for Design Mode". No code handles `G`. Either build the feature (HIDDEN-FEATURES #1) or remove the hint. **(needs decision)**
2. No other functional bugs were found by reading the code and building. Nothing was tested in a browser during this audit, so absence of bugs is **not** confirmed.

## Pending: planned hidden features (HIDDEN-FEATURES.md, all marked ⬜ not started)

Phase 1:
- [ ] 1. Designer mode (press `G`): new `designer-mode.js` + overlay CSS
- [ ] 4. Visitor's pin on the map: extend `map-clients.js`
- [ ] 9. Console greeting: small script in `base.njk`
- [ ] 10. Custom 404 page: new `src/404.njk`
- [ ] 11. Print stylesheet: `@media print` in `home.css`

Phase 2:
- [ ] 2. X-ray lens on case-study covers (needs a wireframe image per project)
- [ ] 3. "The ones that didn't make it" (content per project)
- [ ] 5. Click the sun to set it (`hero.js` + night art)
- [ ] 6. Knock on the window (`contact-window.js`, needs hand + sketch art)

Phase 3:
- [ ] 7. Flip the polaroids
- [ ] 8. Peel the "Gentle Reminder"
- [ ] 12. Tab-away title
- [ ] 13. Type "hire" anywhere

Ground rules for every one: nothing essential hidden, a discoverable hint, reduced-motion support, keyboard access with shortcuts off in form fields, paper / watercolour / handwriting style.

## Absent from the repo (gaps, not necessarily tasks)

- No tests, linter or formatter
- No 404 page, sitemap, robots file, canonical tags or `og:image`
- Only `src/assets/images/avatar-96.webp` is used as the favicon (no touch icon or manifest)
- No recorded accessibility audit, cross-browser or device test results, or performance (Lighthouse) results **(needs confirmation of whether these were done)**

## Next-step candidates (suggestions, not decisions)

1. Resolve the Design Mode mismatch (build or remove the footer hint)
2. Decide the fate of the 6 demo case studies (finish, hide from lists, or remove)
3. Decide whether SkillCoach, Apex and IVISATS should be featured on the homepage
4. Start HIDDEN-FEATURES Phase 1 if wanted

## Session log

| Date | Entry |
|---|---|
| 2026-11-20 | Documentation audit. Added PROJECT_CONTEXT.md, TASK_TRACKER.md, DESIGN_SYSTEM.md; CLAUDE.md got a docs index and status pointer. No application files changed. |
| 2026-11-20 | Docomate.ai project card image replaced with the designer's composite (template preview over dashboard, with mascot): `docomate.webp` (1200×1114) and `docomate-600.webp`; card alt text updated. |
| 2026-11-20 | Docomate.ai cover replaced with the designer's composite (dashboard behind the template preview): `docomate-cover.webp` (1920×1440); cover alt text and caption updated. |
| 2026-11-20 | IVISATS project card image replaced with the designer's composite (logo above the homepage hero on desktop and mobile): `ivisats.webp` (1448×1344, native size) and `ivisats-600.webp`; card alt text updated. Cover (`ivisats-cover.webp`) unchanged. |
| 2026-11-20 | IVISATS Decision D image (`ivisats-form.webp`) replaced with the designer's two-part view of the whole enquiry form (3712×2784, native size); width/height, alt text and caption updated. |
| 2026-11-21 | Map, Bangladesh: added BAT Bangladesh (`bat.png`, from Wikimedia Commons, resized to 256px wide), Vivo (`vivo.svg`, Wikimedia Commons) and Shanta Holdings (`shanta-holdings.png`, Wikipedia), plus PMG and FFL Studio as lettered tiles. Map tiles accept an optional `mark` for the letters shown when there is no logo. Bangladesh now has 8 logos. |
| 2026-11-21 | Map, Bangladesh: PMG and FFL Studio now use the designer's SVGs (`pmg.svg`, `ffl-studio.svg`) instead of lettered tiles. Saved `apex.svg` and `docomate.svg` in `src/assets/images/clients/` (not yet on the map). |
| 2026-11-22 | BloodConnect, 06 · From design to launch: removed the "5 reviews behind that rating" stat; the section now shows 500+ downloads and the 4.8 rating. |
| 2026-11-22 | Akij Insaf page cover (`akij-insaf-cover.webp`, 1920×1440) replaced with "Feature Image - Akij Insaf Diagnostic" (desktop homepage beside two mobile screens); cover alt text updated, caption unchanged. Project card (`akij-insaf-card.webp`) unchanged. |
