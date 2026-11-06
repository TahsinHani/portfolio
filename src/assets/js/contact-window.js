/* Contact card: the watercolor window's shutters stay closed, with the arrow waiting inside, until the window is
   scrolled into view. Then they swing open and the arrow flies out of the window, drawing itself as it goes, to
   point at "Artistic Creations: Coming Soon". Scrolling back up until the window
   drops out of view closes it again. The animation itself is CSS (home.css, .cpanel--animate / .is-open).
   Without this script, or with reduced motion, the open painting simply shows. */
(() => {
  "use strict";
  const card = document.querySelector(".cpanel");
  const art = card?.querySelector(".cwin");
  if (!art || !("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // The arrow starts inside the window: tell the CSS how far its resting place is from the centre of the glass
  // (44.7% across and 46% down the painting). Its transform scales round its own centre, so the centre only moves
  // by the translate, which is taken back out to find the resting place.
  const arrow = card.querySelector(".cpanel__arrow");
  let shift = [0, 0];
  const placeArrow = () => {
    if (!arrow) return;
    const a = arrow.getBoundingClientRect();
    const w = art.getBoundingClientRect();
    if (!a.width || !w.width) return; // hidden on narrower screens
    const restX = a.left + a.width / 2 - shift[0];
    const restY = a.top + a.height / 2 - shift[1];
    shift = [w.left + w.width * 0.447 - restX, w.top + w.height * 0.46 - restY];
    arrow.style.setProperty("--arrow-x", `${shift[0].toFixed(1)}px`);
    arrow.style.setProperty("--arrow-y", `${shift[1].toFixed(1)}px`);
  };

  // Start closed without animating the change, then allow transitions from the next frame on.
  card.classList.add("cpanel--animate", "cpanel--still");
  void art.offsetWidth;
  placeArrow();
  requestAnimationFrame(() => card.classList.remove("cpanel--still"));
  addEventListener("resize", placeArrow, { passive: true });

  new IntersectionObserver(
    ([entry]) => {
      // Open once at least half the window is on screen (above the bottom 15%), and stay open while it leaves
      // through the top; close when scrolling back up drops it below that line again.
      const leavingTop = entry.boundingClientRect.top < (entry.rootBounds?.top ?? 0);
      const open = entry.intersectionRatio >= 0.5 || leavingTop;
      if (open && !card.classList.contains("is-open")) placeArrow();
      card.classList.toggle("is-open", open);
    },
    { rootMargin: "0px 0px -15% 0px", threshold: [0, 0.5] },
  ).observe(art);
})();
