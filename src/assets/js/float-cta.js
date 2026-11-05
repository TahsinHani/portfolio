/* Floating call-to-action: show it between the hero and the contact section. */
(() => {
  "use strict";
  var e = document.querySelector(`.float-cta`),
    t = document.getElementById(`top`),
    n = document.getElementById(`connect`),
    r = !t,
    i = !1,
    a = () => {
      e.dataset.visible = String(r && !i);
    };
  (t &&
    new IntersectionObserver(([e]) => {
      ((r = !e.isIntersecting), a());
    }).observe(t),
    n &&
      new IntersectionObserver(
        ([e]) => {
          ((i = e.isIntersecting), a());
        },
        { rootMargin: `0px 0px -10% 0px` },
      ).observe(n),
    a());
})();
