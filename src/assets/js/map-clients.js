/* "Where I have worked" map: show a country's client logos on hover, keyboard focus or tap.
   The logos sit as tight round the country's dot and label as the tiles allow: one or two logos
   sit on top of the label; three or more run on a half circle from one side of it, over the top,
   to the other. Before opening, this tries the half circle above, below, right and left of the
   label and keeps the one that stays inside the page (most important), then over the map.
   One or two logos stay on top unless the page edge would cut them off. */
(() => {
  "use strict";
  const map = document.querySelector(".map");
  if (!map) return;
  const page = map.closest(".finale") || document.body;
  const hits = Array.from(map.querySelectorAll("button.map__hit"));
  const GAP = 6; // px between neighbouring logos, and between the logos and the label
  const EDGE = 8; // px kept clear of the page edge
  // Where each half circle opens towards (degrees, 90 = up) and which way the logos run along it,
  // so they read left to right or top to bottom.
  const SIDES = [
    { dir: 90, sweep: 1 },
    { dir: -90, sweep: -1 },
    { dir: 0, sweep: 1 },
    { dir: 180, sweep: -1 },
  ];
  let mouse = false; // the last pointer press came from a mouse

  // How far a box sticks out of an area (0 when it fits).
  const spill = (box, area, inset = 0) =>
    Math.max(0, area.left + inset - box.left) +
    Math.max(0, box.right - (area.right - inset)) +
    Math.max(0, area.top + inset - box.top) +
    Math.max(0, box.bottom - (area.bottom - inset));

  // Centres of n tiles on the smallest half circle round `label` (a box, from the pin) where no two
  // tiles touch and none covers the label.
  const arc = (n, tile, label, { dir, sweep }) => {
    const cx = (label.left + label.right) / 2;
    const cy = (label.top + label.bottom) / 2;
    const clearX = (label.right - label.left) / 2 + GAP + tile / 2;
    const clearY = (label.bottom - label.top) / 2 + GAP + tile / 2;
    // Three or more spread over the full half circle; two sit side by side on top (60deg apart).
    const step = n > 2 ? 180 / (n - 1) : 60;
    const angles = Array.from(
      { length: n },
      (_, i) => ((dir + sweep * ((n - 1) / 2 - i) * step) * Math.PI) / 180,
    );
    let points = [];
    for (let r = tile / 2; r < 1000; r += 1) {
      points = angles.map((a) => [Math.cos(a) * r, -Math.sin(a) * r]);
      const offLabel = points.every(([x, y]) => Math.abs(x) >= clearX || Math.abs(y) >= clearY);
      const apart = points.every(([x, y], i) =>
        points.every(
          ([u, v], j) => j <= i || Math.max(Math.abs(x - u), Math.abs(y - v)) >= tile + GAP,
        ),
      );
      if (offLabel && apart) break;
    }
    return points.map(([x, y]) => [cx + x, cy + y]);
  };

  // Place a pin's logos on the half circle that fits best.
  const aim = (pin) => {
    const fan = pin.querySelector(".map__fan");
    const logos = Array.from(fan.children);
    const tile = logos[0].offsetWidth;
    const at = pin.getBoundingClientRect(); // zero-size box at the pin point
    const boxes = [".map__dot", ".map__pill"].map((s) => pin.querySelector(s).getBoundingClientRect());
    const label = {
      left: Math.min(...boxes.map((b) => b.left)) - at.x,
      right: Math.max(...boxes.map((b) => b.right)) - at.x,
      top: Math.min(...boxes.map((b) => b.top)) - at.y,
      bottom: Math.max(...boxes.map((b) => b.bottom)) - at.y,
    };
    const pageBox = page.getBoundingClientRect();
    const mapBox = map.getBoundingClientRect();
    let best = null;
    let least = Infinity;
    for (const side of SIDES) {
      const points = arc(logos.length, tile, label, side);
      const xs = points.map(([x]) => at.x + x);
      const ys = points.map(([, y]) => at.y + y);
      const box = {
        left: Math.min(...xs) - tile / 2,
        right: Math.max(...xs) + tile / 2,
        top: Math.min(...ys) - tile / 2,
        bottom: Math.max(...ys) + tile / 2,
      };
      const cost = 10 * spill(box, pageBox, EDGE) + (logos.length > 2 ? spill(box, mapBox) : 0);
      if (cost < least) [best, least] = [points, cost];
    }
    fan.style.setProperty("--cx", `${(label.left + label.right) / 2}px`);
    fan.style.setProperty("--cy", `${(label.top + label.bottom) / 2}px`);
    logos.forEach((logo, i) => {
      logo.style.setProperty("--x", `${best[i][0]}px`);
      logo.style.setProperty("--y", `${best[i][1]}px`);
    });
  };

  const isOpen = (hit) => hit.getAttribute("aria-expanded") === "true";
  const close = (hit) => hit.setAttribute("aria-expanded", "false");
  const open = (hit) => {
    hits.forEach((other) => other !== hit && close(other));
    if (!isOpen(hit)) aim(hit.parentElement);
    hit.setAttribute("aria-expanded", "true");
  };

  hits.forEach((hit) => {
    hit.addEventListener("pointerenter", (e) => e.pointerType === "mouse" && open(hit));
    hit.addEventListener("pointerleave", (e) => e.pointerType === "mouse" && close(hit));
    hit.addEventListener("focus", () => hit.matches(":focus-visible") && open(hit));
    hit.addEventListener("blur", () => close(hit));
    // Taps and Enter/Space (detail 0) toggle. A mouse click leaves it to the hover.
    hit.addEventListener("click", (e) => {
      if (e.detail !== 0 && mouse) return;
      isOpen(hit) ? close(hit) : open(hit);
    });
  });
  document.addEventListener("pointerdown", (e) => {
    mouse = e.pointerType === "mouse";
    if (!e.target.closest(".map__hit")) hits.forEach(close);
  });
  document.addEventListener("keydown", (e) => e.key === "Escape" && hits.forEach(close));
})();
