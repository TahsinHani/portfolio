/* Writing section: load the latest Medium articles and update the article count. */
(() => {
  const FEED = "https://medium.com/feed/@tahsin.hani",
    MAX = 4,
    /* Top-read posts, most-read first. Use the ID at the end of each Medium URL (check Medium > Stats). Unlisted posts fill remaining slots, newest first. */
    TOP = ["94a5055059f4", "69a8bd2be726"],
    /* Views and reads per post, copied from Medium > Stats. Posts not listed here (or with 0/0) show no stats. */
    STATS = { "94a5055059f4": { views: 0, reads: 0 }, "69a8bd2be726": { views: 0, reads: 0 } },
    list = document.querySelector(".writing__list"),
    count = document.querySelector("[data-writing-count]");
  if (!list || !count) return;
  const fmt = (n) =>
      new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(n),
    full = (n) => new Intl.NumberFormat("en").format(n);
  const eye =
    '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M15.58 12C15.58 13.98 13.98 15.58 12 15.58C10.02 15.58 8.42004 13.98 8.42004 12C8.42004 10.02 10.02 8.42004 12 8.42004C13.98 8.42004 15.58 10.02 15.58 12Z"></path><path d="M12 20.27C15.53 20.27 18.82 18.19 21.11 14.59C22.01 13.18 22.01 10.81 21.11 9.39997C18.82 5.79997 15.53 3.71997 12 3.71997C8.46997 3.71997 5.17997 5.79997 2.88997 9.39997C1.98997 10.81 1.98997 13.18 2.88997 14.59C5.17997 18.19 8.46997 20.27 12 20.27Z"></path></svg>';
  const doc =
    '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M21 7V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V7C3 4 4.5 2 8 2H16C19.5 2 21 4 21 7Z"></path><path d="M14.5 4.5V6.5C14.5 7.6 15.4 8.5 16.5 8.5H18.5"></path><path d="M8 13H12"></path><path d="M8 17H16"></path></svg>';
  const addStats = (li) => {
    const st = STATS[li.dataset.post],
      foot = li.querySelector(".wpost__foot");
    if (!st || !foot || foot.querySelector(".wpost__stats") || !(st.views || st.reads)) return;
    const el = document.createElement("ul");
    el.className = "wpost__stats";
    el.setAttribute("aria-label", "Article stats");
    el.innerHTML =
      '<li title="' +
      full(st.views || 0) +
      ' views">' +
      eye +
      '<span aria-hidden="true">' +
      fmt(st.views || 0) +
      '</span><span class="sr-only">' +
      full(st.views || 0) +
      ' views</span></li><li title="' +
      full(st.reads || 0) +
      ' reads">' +
      doc +
      '<span aria-hidden="true">' +
      fmt(st.reads || 0) +
      '</span><span class="sr-only">' +
      full(st.reads || 0) +
      " reads</span></li>";
    foot.appendChild(el);
  };
  list.querySelectorAll(".wpost[data-post]").forEach(addStats);
  if (!window.fetch) return;
  const esc = (t) =>
    String(t).replace(
      /[&<>"']/g,
      (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
    );
  const idOf = (u) => ((u || "").split("?")[0].match(/-([0-9a-f]{8,})\/?$/) || [])[1] || "";
  const tag = (c) =>
    c
      .split("-")
      .map((w) => (/^(ui|ux|ai|ar|vr|seo)$/.test(w) ? w.toUpperCase() : w))
      .join(" ")
      .replace(/^./, (m) => m.toUpperCase());
  const arrow =
    '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 17L17 7"></path><path d="M8 7h9v9"></path></svg>';
  const logo =
    '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><circle cx="7.4" cy="12" r="5.4"></circle><ellipse cx="17" cy="12" rx="2.8" ry="5.1"></ellipse><ellipse cx="22" cy="12" rx="1" ry="4.5"></ellipse></svg>';
  const card = (it, id) => {
    const doc = new DOMParser().parseFromString(it.content || it.description || "", "text/html"),
      words = (doc.body.textContent || "").trim().split(/\s+/).length,
      mins = Math.max(1, Math.ceil(words / 230)),
      p = [...doc.querySelectorAll("p")].map((e) => e.textContent.trim()).find(Boolean) || "",
      d = new Date((it.pubDate || "").replace(" ", "T") + "Z"),
      iso = isNaN(d) ? "" : d.toISOString().slice(0, 10),
      date = isNaN(d)
        ? ""
        : d.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
            timeZone: "UTC",
          }),
      tags = (it.categories || [])
        .slice(0, 3)
        .map((c) => '<li class="badge">' + esc(tag(c)) + "</li>")
        .join(""),
      li = document.createElement("li");
    li.className = "wpost";
    li.dataset.post = id;
    li.innerHTML =
      '<span class="wpost__bg" aria-hidden="true" style="--ar:1200 / 797; background-image: url(assets/images/writing-sky.webp)"></span><p class="wpost__brand" aria-hidden="true">' +
      logo +
      '<span>Medium</span></p><p class="wpost__meta"><time datetime="' +
      iso +
      '">' +
      esc(date) +
      "</time> · " +
      mins +
      ' min read</p><h3 class="wpost__title"><a class="wpost__link" href="' +
      esc(it.link.split("?")[0]) +
      '" target="_blank" rel="noopener">' +
      esc(it.title) +
      '<span class="sr-only"> (opens in a new tab)</span></a></h3>' +
      (p ? '<p class="wpost__summary">' + esc(p) + "</p>" : "") +
      (tags ? '<ul class="wpost__tags" aria-label="Topics">' + tags + "</ul>" : "") +
      '<div class="wpost__foot"><p class="wpost__read"><span>Read on Medium</span>' +
      arrow +
      "</p></div>";
    addStats(li);
    return li;
  };
  fetch("https://api.rss2json.com/v1/api.json?rss_url=" + encodeURIComponent(FEED))
    .then((r) => (r.ok ? r.json() : Promise.reject()))
    .then((j) => {
      if (j.status !== "ok" || !Array.isArray(j.items) || !j.items.length) return;
      const rank = (it) => {
          const r = TOP.indexOf(idOf(it.link));
          return r < 0 ? TOP.length : r;
        },
        items = j.items
          .map((it, i) => [it, i])
          .sort((x, y) => rank(x[0]) - rank(y[0]) || x[1] - y[1])
          .map((x) => x[0]),
        have = {};
      list.querySelectorAll(".wpost[data-post]").forEach((e) => (have[e.dataset.post] = e));
      const frag = document.createDocumentFragment();
      items.slice(0, MAX).forEach((it) => {
        const id = idOf(it.link);
        frag.appendChild(have[id] || card(it, id));
      });
      list.replaceChildren(frag);
      count.textContent = items.length;
      count.setAttribute(
        "aria-label",
        items.length + (items.length === 1 ? " article" : " articles"),
      );
    })
    .catch(() => {});
})();
