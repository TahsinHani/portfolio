/* About section mood board: bring the tapped card to the front on touch. */
(() => {
  "use strict";
  var e = document.querySelector(`[data-mood]`),
    t = Array.from(e.querySelectorAll(`.mood__card`));
  (t.forEach((e) =>
    e.addEventListener(`pointerdown`, (n) => {
      n.pointerType !== `mouse` && t.forEach((t) => t.classList.toggle(`is-front`, t === e));
    }),
  ),
    document.addEventListener(`pointerdown`, (e) => {
      e.target.closest(`[data-mood]`) || t.forEach((e) => e.classList.remove(`is-front`));
    }));
})();
