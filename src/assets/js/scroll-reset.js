/* Start every visit at the top of the page (no restored scroll, no leftover #hash),
   except when a link opened the page at a section (e.g. About on a case study → index.html#about). */
// Reloads and back/forward trips start at the top of the page with no #section left in the address.
// A fresh visit from a link with a #section lands on that section, then the #section is cleared from the address too.
// While it lands, the page stays hidden, so the top of the page (the hero) never flashes before the jump;
// it then fades in already at the section. Links to a section of the page already open scroll there in place,
// without reloading, even when the address differs only by "index.html" (e.g. "/" and "/index.html#about").
try {
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  var root = document.documentElement;
  var reduced = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var nav = performance.getEntriesByType ? performance.getEntriesByType("navigation")[0] : null;
  var targetId = location.hash && (!nav || nav.type === "navigate") ? decodeURIComponent(location.hash.slice(1)) : "";
  if (location.hash) history.replaceState(null, "", location.pathname + location.search);
  root.style.scrollBehavior = "auto";

  var touched = false; // the visitor scrolled on their own: stop moving the page for them
  ["wheel", "touchstart", "keydown", "mousedown"].forEach(function (type) {
    window.addEventListener(type, function () { touched = true; }, { passive: true, once: true });
  });
  var land = function () {
    if (touched) return;
    var target = targetId && document.getElementById(targetId);
    if (target) target.scrollIntoView({ block: "start" });
    else window.scrollTo(0, 0);
  };

  var shown = !targetId;
  var reveal = function () {
    if (shown) return;
    shown = true;
    land();
    if (!reduced) root.style.transition = "opacity .35s ease";
    root.style.opacity = "";
    setTimeout(function () { root.style.transition = ""; }, 400);
  };
  if (targetId) {
    root.style.opacity = "0";
    setTimeout(reveal, 1200); // never keep the page hidden for long, whatever happens
    document.addEventListener("DOMContentLoaded", function () {
      land();
      // Wait for the web fonts (they change the height of everything above the section), but not for long.
      var fonts = document.fonts && document.fonts.ready;
      if (fonts) Promise.race([fonts, new Promise(function (r) { setTimeout(r, 500); })]).then(reveal);
      else reveal();
    });
  }
  window.scrollTo(0, 0);
  window.addEventListener("load", function () {
    land();
    reveal();
    requestAnimationFrame(function () {
      root.style.scrollBehavior = "";
    });
  });

  // In-page section links: scroll smoothly instead of reloading the page.
  var samePage = function (path) {
    return path.replace(/index\.html$/, "") === location.pathname.replace(/index\.html$/, "");
  };
  document.addEventListener("click", function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var link = e.target.closest && e.target.closest("a[href*='#']");
    if (!link || link.target === "_blank") return;
    var url = new URL(link.href, location.href);
    if (url.origin !== location.origin || !samePage(url.pathname) || !url.hash) return;
    var id = decodeURIComponent(url.hash.slice(1));
    var section = document.getElementById(id);
    var behavior = reduced ? "auto" : "smooth";
    // "#top" (the footer's "Back to top") glides to the very top, on pages with or without a #top element.
    if (id === "top") {
      e.preventDefault();
      touched = true;
      window.scrollTo({ top: 0, behavior: behavior });
      var first = section || document.querySelector("main") || document.body;
      if (!first.hasAttribute("tabindex")) first.setAttribute("tabindex", "-1");
      first.focus({ preventScroll: true });
      return;
    }
    if (!section) return;
    e.preventDefault();
    touched = true;
    section.scrollIntoView({ behavior: behavior, block: "start" });
    // Move keyboard focus there too, as following the link normally would.
    if (!section.hasAttribute("tabindex") && !/^(A|BUTTON|INPUT|SELECT|TEXTAREA)$/.test(section.tagName)) section.setAttribute("tabindex", "-1");
    section.focus({ preventScroll: true });
  });
} catch (e) {}
