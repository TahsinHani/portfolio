/* About section mood board.
   - The two photos start stacked, the baby photo on top with "Curious from the beginning…" written under it.
     When the middle of the board scrolls up past 60% of the screen height they are dealt out into the layout;
     scrolling back up past that line stacks them again. The motion itself is CSS (home.css, .mood--animate);
     this file only plays it forwards or backwards. Without this script, or with reduced motion, the
     dealt-out layout simply shows.
   - On touch screens, tapping a card brings it to the front. */
(() => {
  "use strict";
  const board = document.querySelector("[data-mood]");
  if (!board) return;
  const cards = Array.from(board.querySelectorAll(".mood__card"));

  cards.forEach((card) =>
    card.addEventListener("pointerdown", (e) => {
      if (e.pointerType !== "mouse") cards.forEach((c) => c.classList.toggle("is-front", c === card));
    }),
  );
  document.addEventListener("pointerdown", (e) => {
    if (!e.target.closest("[data-mood]")) cards.forEach((c) => c.classList.remove("is-front"));
  });

  if (!board.getAnimations || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // The CSS animations start paused at their first frame, which is the stacked look.
  board.classList.add("mood--animate");
  const deal = board.getAnimations({ subtree: true }).filter((a) => a.animationName?.startsWith("mood-"));
  if (!deal.length) return;

  let open = false;
  const setOpen = (want, instantly) => {
    if (want === open) return;
    open = want;
    for (const a of deal) {
      const end = a.effect.getComputedTiming().endTime;
      if (instantly) {
        a.pause();
        a.currentTime = want ? end : 0;
        continue;
      }
      // Changing direction keeps the current point, so a reversal mid-way carries on from where it is.
      a.playbackRate = want ? 1 : -1;
      const t = a.currentTime ?? 0;
      if (want ? t < end : t > 0) a.play();
    }
  };

  const shouldOpen = () => {
    const r = board.getBoundingClientRect();
    return r.top + r.height / 2 < innerHeight * 0.6;
  };
  // Already scrolled past (a reload part-way down, or a link to #about): show the layout without playing.
  setOpen(shouldOpen(), true);

  let queued = false;
  const check = () => {
    queued = false;
    setOpen(shouldOpen());
  };
  const queue = () => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(check);
    }
  };
  addEventListener("scroll", queue, { passive: true });
  addEventListener("resize", queue, { passive: true });
})();
