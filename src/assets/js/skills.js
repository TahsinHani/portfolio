/* Homepage Skills (partials/home/skills.njk, data in src/_data/skills.json).
   CSS does the hover and keyboard-focus effects (the tile lifts and straightens, its icon plays). This script:
   - changes the text under the headline to the skill that was picked (hover, focus or tap) and puts the default
     text back when the pointer leaves the stage;
   - lets a tap light up a tile on touch screens;
   - walks through the tiles by itself while the section is mostly on screen, until the visitor first hovers, taps or
     tabs into one. It never runs with reduced motion.
   Without the script the tiles still show; the text under the headline stays on its default words. */
(() => {
  "use strict";
  const root = document.querySelector("[data-skills]");
  if (!root) return;
  const tiles = Array.from(root.querySelectorAll(".fl__tile"));
  const stage = root.querySelector(".fl");
  const now = root.querySelector("[data-fl-now]");
  const lead = root.querySelector("[data-fl-lead]");
  const desc = root.querySelector("[data-fl-desc]");
  const hand = root.querySelector("[data-fl-hand]");
  if (!tiles.length || !stage || !now || !lead || !desc || !hand) return;

  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const defaultLead = lead.textContent;
  const defaultDesc = desc.textContent;
  const defaultHand = hand.textContent;
  let current = -1;
  let timer = 0;
  let stopped = false;

  function show(i) {
    if (i < 0) {
      lead.textContent = defaultLead;
      desc.textContent = defaultDesc;
      hand.textContent = defaultHand;
    } else {
      const d = tiles[i].dataset;
      lead.textContent = d.title;
      desc.textContent = d.desc;
      hand.textContent = d.hand || "";
    }
    if (!reduce.matches) {
      now.classList.remove("is-in");
      void now.offsetWidth; // let the browser see the class gone, so the fade plays again
      now.classList.add("is-in");
    }
  }
  function light(i) {
    current = i;
    tiles.forEach((el, j) => el.classList.toggle("is-active", j === i));
    show(i);
  }
  function stop() {
    if (!stopped) tiles.forEach((el) => el.classList.remove("is-active"));
    stopped = true;
    clearInterval(timer);
    timer = 0;
  }
  function play() {
    if (stopped || reduce.matches || timer) return;
    timer = setInterval(() => light((current + 1) % tiles.length), 3200);
  }
  function pause() {
    clearInterval(timer);
    timer = 0;
  }

  tiles.forEach((el, i) => {
    el.addEventListener("pointerenter", (e) => {
      if (e.pointerType !== "mouse") return;
      stop();
      current = i;
      show(i);
    });
    el.addEventListener("pointerdown", (e) => {
      if (e.pointerType === "mouse") return;
      stop();
      light(i);
    });
    el.addEventListener("focus", () => {
      stop();
      current = i;
      show(i);
    });
  });
  stage.addEventListener("pointerleave", (e) => {
    if (e.pointerType === "mouse" && stopped) {
      current = -1;
      show(-1);
    }
  });
  document.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "mouse" && !e.target.closest(".fl__tile"))
      tiles.forEach((el) => el.classList.remove("is-active"));
  });

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? play() : pause()),
      { threshold: 0.5 },
    ).observe(root);
  }
  document.addEventListener("visibilitychange", () =>
    document.hidden ? pause() : null,
  );
})();
