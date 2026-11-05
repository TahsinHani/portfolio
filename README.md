# Tahsin Portfolio

Static portfolio site built with [Eleventy](https://www.11ty.dev/). You edit the templates in `src/`, and Eleventy writes plain HTML to `_site/`.

## Commands

```sh
npm install      # first time only
npm start        # local preview at http://localhost:8080, rebuilds on save
npm run build    # write the finished site to _site/
```

## Publishing (GitHub Pages)

`.github/workflows/deploy.yml` builds the site and publishes it on every push to `main`.

One-time setup: in the repository go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**. Do not choose "Deploy from a branch". That would publish the raw templates instead of the built site.

Progress and errors show in the repository's **Actions** tab. To redeploy without a code change, open the **Deploy to GitHub Pages** workflow and click **Run workflow**.

All links are relative, so the site works both at `https://<user>.github.io/<repo>/` and at a custom domain.

## Where things are

```
src/
  index.njk                 Homepage: section order, plus the homepage lists (process steps, facts, roles, map pins)
  work/index.njk            All work page
  case-studies/*.njk        One file per project: page header, card text and the case-study story
  _data/
    site.json               Name, email, resume path, Medium link, nav links, social links
    writing.json            Medium articles shown in the Writing section
    birds.json              Bird positions for the hero and process animations
  _includes/
    layouts/base.njk        Page shell shared by every page (head, nav, footer, floating button)
    layouts/case-study.njk  Shared case-study layout
    partials/               Header, footer, floating button, and the homepage sections in home/
    components/             Reusable pieces: button, icons, project card, writing card
    svg/                    Large decorative SVGs
  assets/                   CSS, JS, fonts and images, copied to the output as-is
  resume/                   Put Tahsin-Resume.pdf here
```

## Common edits

- **Add a project:** copy a file in `src/case-studies/`, rename it (the file name becomes the URL, `/work/<name>/`), then edit its front matter and story. Set `order` to choose its place in lists, and add the image files to `src/assets/images/projects/` (`<name>.webp` plus `<name>-600.webp`).
- **Choose homepage projects:** edit `featuredWork` in `src/index.njk`.
- **Add an article:** add an entry to `src/_data/writing.json`. `writing-feed.js` also loads the latest posts from Medium in the browser.
- **Change the client logos on the map:** put the logo files in `src/assets/images/clients/` (SVG, or square PNG/WebP at 100×100), then edit the `clients` list under each pin in `mapPins` in `src/index.njk`. The `demo-*.svg` files there are [Logoipsum](https://logoipsum.com/) placeholders; delete them once you have real logos.
- **Change the email, nav or social links:** edit `src/_data/site.json`.
- **Add a button:** `{{ button("Label", "/path/index.html" | rel, variant="secondary", trail="arrow-right") }}`. See `components/button.njk` for the options.

Write links and asset paths from the site root and pass them through the `rel` filter, for example `{{ '/assets/css/home.css' | rel }}`. The filter turns them into relative paths, so the built site works on any host and when opened straight from disk.
