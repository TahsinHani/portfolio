/* Design Mode (HIDDEN-FEATURES.md #1, tokens layer only): press G for a panel of the design tokens this page
   is built from (colour, typefaces, type scale, spacing, radius, shadow). The footer hint "Press G for Design
   Mode" advertises it.
   - Tokens are read live from the custom properties on :root in the page's stylesheets, so the panel follows
     home.css / work.css as they change. If the sheets can't be read (some browsers block that for pages opened
     from disk), a built-in list of token names is used instead.
   - Values are resolved by the browser, so clamp() sizes show their current px plus their fluid range.
   - Clicking a token copies its plain value (hex colour, px size, font name, shadow), ready to paste into Figma
     or other CSS.
   - G toggles the panel, Esc or the Close button closes it, and focus returns where it was. G is ignored while
     typing in a field or with Ctrl / Cmd / Alt held.
   - The panel's stylesheet (design-mode.css, from data-css on this script tag) loads on first use only. */
(() => {
  "use strict";
  const script = document.currentScript;
  const cssHref = script?.dataset.css;
  const doc = document.documentElement;

  // Groups shown in the panel, in order. Names are matched by prefix.
  const GROUPS = [
    { id: "color", title: "Colour", prefix: "--color-" },
    { id: "font", title: "Typefaces", prefix: "--font-" },
    { id: "text", title: "Type scale", prefix: "--text-" },
    { id: "space", title: "Spacing", prefix: "--space-" },
    { id: "radius", title: "Radius", prefix: "--radius-" },
    { id: "shadow", title: "Shadow", prefix: "--shadow" },
  ];
  // Used only when the stylesheets can't be read.
  const FALLBACK = [
    ...["ink", "ink-secondary", "ink-hover", "on-ink", "bg", "surface", "surface-sunken", "surface-tint", "line", "accent"].map((n) => `--color-${n}`),
    ...["title", "display", "text", "hand"].map((n) => `--font-${n}`),
    ...["display", "title", "section", "card", "sub", "body-lg", "body", "meta"].map((n) => `--text-${n}`),
    ...Array.from({ length: 11 }, (_, i) => `--space-${i + 1}`),
    ...["sm", "md", "lg", "pill"].map((n) => `--radius-${n}`),
    "--shadow",
  ];

  let panel = null;
  let returnFocus = null;

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
  const num = (v) => String(Math.round(v * 10) / 10);
  const isTyping = (t) =>
    t instanceof Element && (t.isContentEditable || !!t.closest("input, textarea, select, [contenteditable]"));

  // "rgb(33, 33, 33)" / "rgba(40, 40, 40, 0.8)" / "color(srgb 0.2 0.2 0.2)" → "#212121" / "#282828cc" / "#333333"
  const hex = (c) => {
    let p;
    let m = c.match(/^rgba?\(([^)]+)\)$/);
    if (m) p = m[1].split(/[\s,/]+/).filter(Boolean).map(Number);
    else if ((m = c.match(/^color\(srgb ([^)]+)\)$/))) {
      p = m[1].split(/[\s/]+/).filter(Boolean).map(Number);
      p = [p[0] * 255, p[1] * 255, p[2] * 255, p[3]];
    } else return c;
    const h = (v) => Math.round(v).toString(16).padStart(2, "0");
    return `#${h(p[0])}${h(p[1])}${h(p[2])}${p[3] !== undefined && p[3] < 1 ? h(p[3] * 255) : ""}`;
  };

  // Custom property names declared on :root in the page's stylesheets, in source order.
  const tokenNames = () => {
    const names = new Set();
    const walk = (rules) => {
      for (const r of rules) {
        if (r.selectorText === ":root") {
          for (const prop of r.style) if (prop.startsWith("--")) names.add(prop);
        } else if (r.cssRules) walk(r.cssRules);
      }
    };
    for (const sheet of document.styleSheets) {
      try {
        walk(sheet.cssRules);
      } catch {
        /* unreadable sheet (e.g. a page opened from disk); the fallback list covers it */
      }
    }
    return names.size ? [...names] : FALLBACK;
  };

  // "clamp(2.75rem, 1.6rem + 4.6vw, 5.5rem)" → "44–88" (px, at the default 16px root size)
  const fluidRange = (raw) => {
    const m = raw.match(/^clamp\(\s*([\d.]+)(rem|px)\s*,.*,\s*([\d.]+)(rem|px)\s*\)$/);
    if (!m) return null;
    const px = (v, u) => (u === "rem" ? v * parseFloat(getComputedStyle(doc).fontSize) : v);
    return `${num(px(+m[1], m[2]))}–${num(px(+m[3], m[4]))}`;
  };

  // Resolve every token by applying it to a hidden probe and reading the computed value back.
  const readTokens = () => {
    const root = getComputedStyle(doc);
    const probe = document.createElement("div");
    probe.style.cssText = "position:absolute;left:-9999px;top:0;visibility:hidden;pointer-events:none";
    document.body.append(probe);
    const cs = getComputedStyle(probe);
    const read = (prop, name) => {
      probe.style[prop] = `var(${name})`;
      return cs[prop];
    };
    const groups = GROUPS.map((g) => ({ ...g, items: [] }));
    for (const name of tokenNames()) {
      const raw = root.getPropertyValue(name).trim();
      const g = groups.find((x) => name.startsWith(x.prefix));
      if (!raw || !g) continue;
      const short = name.slice(2);
      if (g.id === "color") g.items.push({ name, short, color: read("color", name) });
      else if (g.id === "font") g.items.push({ name, short, family: raw.split(",")[0].trim().replace(/["']/g, "") });
      else if (g.id === "text") g.items.push({ name, short, px: parseFloat(read("fontSize", name)), range: fluidRange(raw) });
      else if (g.id === "space") g.items.push({ name, short, px: parseFloat(read("width", name)) });
      else if (g.id === "radius") g.items.push({ name, short, px: parseFloat(read("borderTopLeftRadius", name)) });
      else g.items.push({ name, short, raw: raw.replace(/\s*\/\*.*?\*\/\s*/g, "") });
    }
    probe.remove();
    return groups.filter((g) => g.items.length);
  };

  // `copy` is the plain value a visitor can paste into Figma or their own CSS: hex, px, a font name.
  const row = (t, visual, value, copy) =>
    `<li><button class="dmode__token" type="button" data-copy="${esc(copy)}" title="Copy ${esc(copy)}">` +
    `<span class="dmode__vis" aria-hidden="true">${visual}</span><b>${esc(t.short)}</b><span class="dmode__val">${value}</span>` +
    `</button></li>`;

  const renderGroup = (g) => {
    const items = g.items.map((t) => {
      switch (g.id) {
        case "color":
          return row(t, `<i class="dmode__swatch" style="background:${t.color}"></i>`, hex(t.color), hex(t.color));
        case "font":
          return row(t, `<span class="dmode__aa" style="font-family:var(${t.name})">Aa</span>`, esc(t.family), t.family);
        case "text":
          return row(
            t,
            `<span class="dmode__aa" style="font-size:${Math.min(t.px, 32)}px">Aa</span>`,
            `${num(t.px)}px${t.range ? `<small>${t.range} fluid</small>` : ""}`,
            `${num(t.px)}px`,
          );
        case "space":
          return row(t, `<i class="dmode__bar" style="width:${Math.min(t.px, 64)}px"></i>`, `${num(t.px)}px`, `${num(t.px)}px`);
        case "radius":
          return row(t, `<i class="dmode__corner" style="border-radius:${Math.min(t.px, 16)}px"></i>`, `${num(t.px)}px`, `${num(t.px)}px`);
        default:
          return row(t, `<i class="dmode__shadow" style="box-shadow:var(${t.name})"></i>`, `<small>${esc(t.raw)}</small>`, t.raw);
      }
    });
    return `<section class="dmode__group dmode__group--${g.id}"><h3 class="dmode__sub">${g.title}</h3><ul>${items.join("")}</ul></section>`;
  };

  const fill = () => {
    panel.querySelector(".dmode__body").innerHTML = readTokens().map(renderGroup).join("");
  };

  const loadCss = () =>
    new Promise((resolve) => {
      if (!cssHref) return resolve();
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = cssHref;
      link.onload = link.onerror = () => resolve();
      document.head.append(link);
    });

  const build = async () => {
    await loadCss();
    panel = document.createElement("aside");
    panel.className = "dmode";
    panel.id = "design-mode";
    panel.hidden = true;
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-labelledby", "dmode-title");
    panel.innerHTML = `
      <header class="dmode__head">
        <p class="dmode__kicker">Design Mode</p>
        <h2 class="dmode__title" id="dmode-title">Design tokens</h2>
        <p class="dmode__intro">The building blocks behind this page, read live from its CSS. Click a token to copy its value.</p>
        <button class="dmode__close" type="button">Close <kbd>Esc</kbd></button>
      </header>
      <div class="dmode__body"></div>
      <p class="dmode__status" role="status" aria-live="polite"></p>`;
    document.body.append(panel);

    panel.querySelector(".dmode__close").addEventListener("click", () => setOpen(false));
    panel.addEventListener("click", async (e) => {
      const btn = e.target.closest("[data-copy]");
      if (!btn) return;
      const text = btn.dataset.copy;
      let ok = false;
      try {
        await navigator.clipboard.writeText(text);
        ok = true;
      } catch {
        /* clipboard blocked (e.g. a page opened from disk): say so instead */
      }
      panel.querySelector(".dmode__status").textContent = ok ? `Copied ${text}` : `Copy not allowed here: ${text}`;
      btn.classList.add("is-copied");
      setTimeout(() => btn.classList.remove("is-copied"), 1200);
    });

    let queued = false;
    addEventListener(
      "resize",
      () => {
        // Fluid sizes change with the window: refresh while open.
        if (panel.hidden || queued) return;
        queued = true;
        requestAnimationFrame(() => {
          queued = false;
          fill();
        });
      },
      { passive: true },
    );
  };

  let building = null;
  const setOpen = async (open) => {
    if (!panel) await (building ||= build());
    if (open === !panel.hidden) return;
    if (open) {
      returnFocus = document.activeElement;
      fill();
      panel.querySelector(".dmode__status").textContent = "";
      panel.hidden = false;
      doc.classList.add("dmode-on");
      panel.querySelector(".dmode__close").focus({ preventScroll: true });
    } else {
      panel.hidden = true;
      doc.classList.remove("dmode-on");
      if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
      returnFocus = null;
    }
  };

  document.addEventListener("keydown", (e) => {
    if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey || e.isComposing || isTyping(e.target)) return;
    if ((e.key === "g" || e.key === "G") && !e.repeat) {
      e.preventDefault();
      setOpen(!panel || panel.hidden);
    } else if (e.key === "Escape" && panel && !panel.hidden) {
      setOpen(false);
    }
  });
})();
