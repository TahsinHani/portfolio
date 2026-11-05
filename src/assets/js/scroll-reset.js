/* Start every visit at the top of the page (no restored scroll, no leftover #hash). */
// Every visit, reload and return trip starts at the top of the page: no restored scroll position, no leftover #section in the address.
try {
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  if (location.hash) history.replaceState(null, "", location.pathname + location.search);
  document.documentElement.style.scrollBehavior = "auto";
  window.scrollTo(0, 0);
  window.addEventListener("load", function () {
    window.scrollTo(0, 0);
    requestAnimationFrame(function () {
      document.documentElement.style.scrollBehavior = "";
    });
  });
} catch (e) {}
