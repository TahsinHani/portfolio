/* Header navigation: mobile menu toggle and active-section highlighting. */
(() => {
  "use strict";
  var e = document.querySelector(`.nav`),
    t = e.querySelector(`.nav__menu`),
    [n, r] = Array.from(t.querySelectorAll(`[data-icon]`)),
    i = (i) => {
      ((e.dataset.open = String(i)),
        t.setAttribute(`aria-expanded`, String(i)),
        t.setAttribute(`aria-label`, i ? `Close menu` : `Open menu`),
        (n.hidden = i),
        (r.hidden = !i));
    };
  (t.addEventListener(`click`, () => i(e.dataset.open !== `true`)),
    e.querySelectorAll(`.nav__panel a`).forEach((e) => e.addEventListener(`click`, () => i(!1))),
    document.addEventListener(`keydown`, (n) => {
      n.key === `Escape` && e.dataset.open === `true` && (i(!1), t.focus());
    }));
  var a = Array.from(document.querySelectorAll(`.nav__link[data-section]`)),
    o = [`work`, `about`, `writing`, `connect`],
    s = o.map((e) => document.getElementById(e));
  if (s.every(Boolean)) {
    let e = !1,
      t = () => {
        e = !1;
        let t = window.innerHeight * 0.4,
          n = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4,
          r = ``;
        (s.forEach((e, n) => {
          e.getBoundingClientRect().top <= t && (r = o[n]);
        }),
          n && (r = `connect`),
          a.forEach((e) => {
            e.dataset.section === r
              ? e.setAttribute(`aria-current`, `true`)
              : e.removeAttribute(`aria-current`);
          }));
      },
      n = () => {
        e || ((e = !0), requestAnimationFrame(t));
      };
    (window.addEventListener(`scroll`, n, { passive: !0 }),
      window.addEventListener(`resize`, n),
      t());
  }
})();
