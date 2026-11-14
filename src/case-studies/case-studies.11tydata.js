/*
  Shared settings for every case study in this folder.
  Each case study is one .njk file: front matter for the page header and its project card,
  then the story sections as HTML. Every case study uses the same "story" template (story.css and
  story.js are added here for all of them). To add a project, copy akij-insaf.njk, the reference for
  the structure and every building block, and change it.

  Body structure: numbered sections, each <section class="cs__sec" aria-labelledby="sN"> with a
  kicker <p class="st-k rv">01 · Challenge</p>, a heading <h2 class="cs__h rv" id="sN">, an intro
  <p class="cs__p rv"> and then building blocks: cards (.st-grid + .pcard), a callout (.st-callout),
  a numbered list (.st-list; an item may open with <strong>Title</strong>, which puts its
  description on the next line), stats (.st-stats), decision rows (.st-split), tabs (.st-tabs),
  a colour palette (.st-pal) and notes (.st-note). The usual order is Challenge, Research, Defining
  the experience, Key UX decisions, Visual design, Core screens, Launch or handoff, Reflection; leave
  out a section the project has nothing true to say about.

  Front matter fields:
    title        project name
    order        position in project lists (1 = first)
    summary      one-sentence intro under the title (also the meta description)
    facts        [{ label, value }] shown under the summary (Role, Timeline, ...)
    demo         true shows the "Demo case study" note
    headline     optional statement used as the page title; the project name then sits above it
    headlineHand optional word from the headline set in the handwriting font (Satisfy, #36416D):
                 the word that carries the change the project makes, e.g. "easier"
    website      optional link to the live product; adds a "View Website" button under the intro
    websiteLabel optional label for that button instead of "View Website"
    lead         optional intro shown instead of summary (summary stays the meta description)
    cover        { alt, image?, caption? }  cover image; image defaults to the file name
    glance       optional [{ word, text }] the three "At a glance" cards
    credits      optional [{ label, value }] the "Project credits" list that closes the story
    card         { desc, client, mark, alt, image?, logo? } the project card in lists; logo is a
                 file in assets/images/projects/ (<slug>-logo.webp or .svg) shown in the 36px tile
                 in place of the initials (mark)
    moreWork     slugs of the projects shown under "More work"
    extraStyles  optional extra page-only stylesheets from assets/css/ (added after story.css)
*/
export default {
  layout: "layouts/case-study.njk",
  permalink: "work/{{ page.fileSlug }}/index.html",
  stylesheet: "work.css",
  footer: true,
  floatCta: true,
  extraStyles: ["story.css"],
  eleventyComputed: {
    metaTitle: (data) => `${data.title} · ${data.site.name}`,
    description: (data) => data.summary,
  },
};
