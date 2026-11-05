// Eleventy builds the plain-HTML site from the templates in src/ into _site/.
// Docs: https://www.11ty.dev/docs/

export default function (eleventyConfig) {
  // Copy CSS, JS, fonts and images to the output as-is.
  eleventyConfig.addPassthroughCopy("src/assets");
  // Put the resume PDF in src/resume/ (linked from site.json → "resume").
  eleventyConfig.addPassthroughCopy("src/resume");

  // Case studies, in the order set by `order:` in each file's front matter.
  eleventyConfig.addCollection("caseStudies", (collectionApi) =>
    collectionApi
      .getFilteredByGlob("src/case-studies/*.njk")
      .sort((a, b) => a.data.order - b.data.order),
  );

  /**
   * Turn a site-root path ("/assets/css/home.css", "/index.html#work") into a path
   * relative to the current page, so the built site also works when opened from disk.
   * A link to the current page keeps only its #hash.
   */
  eleventyConfig.addFilter("rel", function (target) {
    const pageUrl = this.page?.url ?? "/";
    const [targetPath, hash] = target.split("#");
    const pageFile = pageUrl.endsWith("/") ? `${pageUrl}index.html` : pageUrl;
    if (hash !== undefined && targetPath === pageFile) return `#${hash}`;
    const depth = pageFile.split("/").length - 2;
    return "../".repeat(depth) + target.replace(/^\//, "");
  });

  // Pick case studies by slug, in the given order: projects | bySlug(["ledgerly", "fieldnote"])
  eleventyConfig.addFilter("bySlug", (items, slugs) =>
    slugs.map((slug) => items.find((item) => item.page.fileSlug === slug)).filter(Boolean),
  );

  // "2026-11-01" -> "1 November 2026"
  eleventyConfig.addFilter("readableDate", (iso) =>
    new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }),
  );

  // 1 -> "01"
  eleventyConfig.addFilter("pad2", (n) => String(n).padStart(2, "0"));

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    templateFormats: ["njk"],
    htmlTemplateEngine: "njk",
  };
}
