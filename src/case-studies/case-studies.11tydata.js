/*
  Shared settings for every case study in this folder.
  Each case study is one .njk file: front matter for the page header and its project card,
  then the story sections as HTML. To add a project, copy an existing file and change it.

  Front matter fields:
    title        project name
    order        position in project lists (1 = first)
    summary      one-sentence intro under the title (also the meta description)
    badges       project type tags
    facts        [{ label, value }] shown under the summary (Role, Timeline, ...)
    demo         true shows the "Demo case study" note
    cover        { alt, image? }  cover image; image defaults to the file name
    glance       [{ word, text }] the three "At a glance" cards
    card         { desc, client, mark, alt, image? } the project card in lists
    moreWork     slugs of the projects shown under "More work"
    extraStyles  optional page-only stylesheets from assets/css/
*/
export default {
  layout: "layouts/case-study.njk",
  permalink: "work/{{ page.fileSlug }}/index.html",
  stylesheet: "work.css",
  footer: true,
  floatCta: true,
  eleventyComputed: {
    metaTitle: (data) => `${data.title} · ${data.site.name}`,
    description: (data) => data.summary,
  },
};
