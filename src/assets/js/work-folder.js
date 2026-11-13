/* Selected work section: folder open / scroll animation of the project cards. */
(() => {
  "use strict";
  var e = document.querySelector(`.work`),
    t = e.querySelector(`.work__grid`),
    n = e.querySelector(`.work__intro`),
    r = e.querySelector(`.container`),
    i = e.querySelector(`.work__fback`),
    a = e.querySelector(`.work__ffront`),
    o = Array.from(t.children),
    s = matchMedia(`(min-width: 1024px) and (prefers-reduced-motion: no-preference)`),
    c = [
      { rot: -6, ox: 0, oy: 0 },
      { rot: 4, ox: 0.1, oy: -0.12 },
      { rot: -3, ox: -0.14, oy: 0.1 },
      { rot: 8, ox: 0.2, oy: 0.04 },
    ],
    l = 0.56,
    u = [],
    d = 0,
    f = 1,
    p = !1,
    m = (e) => e * e * (3 - 2 * e),
    h = () => {
      o.forEach((e) => (e.style.transform = ``));
      let s = window.scrollY,
        l = e.getBoundingClientRect(),
        p = n.getBoundingClientRect(),
        m = t.getBoundingClientRect(),
        h = m.left + m.width * 0.8,
        g = Math.min(416, window.innerWidth * 0.3 + 40),
        _ = g * 0.87,
        v = r.getBoundingClientRect(),
        y = p.top + p.height / 2 - _ / 2,
        b = y + _ * 0.4;
      ([i, a].forEach((e) => {
        ((e.style.width = g + `px`),
          (e.style.height = _ + `px`),
          (e.style.left = h - g / 2 - v.left + `px`),
          (e.style.top = y - v.top + `px`));
      }),
        (u = o.map((e, t) => {
          let n = e.getBoundingClientRect(),
            r = c[t % c.length];
          return {
            dx: h + r.ox * n.width - (n.left + n.width / 2),
            dy: b + r.oy * n.width - (n.top + n.height / 2),
            rot: r.rot,
            w: n.width,
          };
        })),
        (d = s + l.top - window.innerHeight * 0.3),
        (f = s + t.getBoundingClientRect().top - window.innerHeight * 0.1),
        x(!0));
    },
    g = 0,
    _ = 0,
    v = 0,
    y = (e) => {
      let t = 1 - m(Math.min(1, Math.max(0, (e - 0.1) / 0.6)));
      ([i, a].forEach((e) => {
        ((e.style.opacity = t.toFixed(3)),
          (e.style.transform = `translate3d(0, ${((1 - t) * 36).toFixed(1)}px, 0) scale(${(0.95 + 0.05 * t).toFixed(4)})`),
          (e.style.visibility = t < 0.005 ? `hidden` : `visible`));
      }),
        o.forEach((t, n) => {
          let r = u[n];
          if (!r) return;
          // Each card starts 0.05 after the one before; the span is sized so the last card lands at 1 (0.85 with 4 cards).
          let i = m(Math.min(1, Math.max(0, (e - n * 0.05) / (1 - (o.length - 1) * 0.05)))),
            a = 1 - i;
          ((t.style.transform = `translate3d(${(r.dx * a).toFixed(1)}px, ${(r.dy * a).toFixed(1)}px, 0) rotate(${(r.rot * a).toFixed(2)}deg) scale(${(l + 0.43999999999999995 * i).toFixed(4)})`),
            (t.style.zIndex = String(i < 1 ? 10 - n : 0)));
        }));
    },
    b = () => {
      ((_ += (g - _) * 0.12),
        Math.abs(g - _) < 8e-4 && (_ = g),
        y(_),
        (v = _ === g ? 0 : requestAnimationFrame(b)));
    },
    x = (e = !1) => {
      p &&
        ((g = Math.min(1.05, Math.max(-0.05, (window.scrollY - d) / Math.max(1, f - d)))),
        e && (_ = g),
        (v ||= requestAnimationFrame(b)));
    },
    S = () => {
      ((p = s.matches),
        e.classList.toggle(`work--live`, p),
        p
          ? h()
          : (o.forEach((e) => {
              ((e.style.transform = ``), (e.style.zIndex = ``));
            }),
            [i, a].forEach((e) => {
              e.style.visibility = `hidden`;
            })));
    };
  (addEventListener(`scroll`, () => x(), { passive: !0 }),
    addEventListener(`resize`, () => {
      p && h();
    }),
    s.addEventListener(`change`, S),
    S(),
    addEventListener(`load`, () => {
      p && h();
    }));
})();
