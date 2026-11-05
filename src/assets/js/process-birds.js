/* Process section: animated birds canvas. */
(() => {
  "use strict";
  var e = document.querySelector(`.process`),
    t = e?.querySelector(`.process__birds`);
  if (e && t) {
    let n = t.getContext(`2d`),
      r = JSON.parse(e.dataset.birds),
      i = matchMedia(`(prefers-reduced-motion: reduce)`).matches,
      a = Math.min(...r.map((e) => e.cx)),
      o = Math.max(...r.map((e) => e.cx)),
      s = Math.min(...r.map((e) => e.cy)),
      c = Math.max(...r.map((e) => e.cy)),
      l = { w: o - a, h: c - s },
      u = { x: (a + o) / 2, y: (s + c) / 2 },
      d = [...r].sort((e, t) => t.cx - e.cx),
      f = r.map((e) => ({
        m: e,
        ox: 0,
        oy: 0,
        vx: 0,
        vy: 0,
        ex: 0,
        ph: Math.random() * 6.283,
        hz: 2.4 + Math.random() * 1.4,
        rank: d.indexOf(e) / r.length,
        dr: Math.random() * 6.283,
      })),
      p = (e) => e * e * (3 - 2 * e),
      m = (e, t, n) => e + (t - e) * n,
      h = (e) => {
        let t = { x: 0.9 * l.w, y: -0.5 * l.h, s: 0.3 },
          n = { x: -0.8 * l.w, y: 0.3 * l.h, s: 0.3 },
          r = { x: -0.4 * l.w, y: 0.18 * l.h, s: 0.6 };
        if (e < 0.4) {
          let n = p(e / 0.4);
          return { x: m(0, t.x, n), y: m(0, t.y, n), s: m(1, t.s, n), o: 1 - n };
        }
        if (e < 0.53) return { x: t.x, y: t.y, s: t.s, o: 0 };
        if (e < 0.68) {
          let t = p((e - 0.53) / 0.15);
          return { x: m(n.x, r.x, t), y: m(n.y, r.y, t), s: m(n.s, r.s, t), o: t };
        }
        let i = p((e - 0.68) / 0.32);
        return { x: m(r.x, 0, i), y: m(r.y, 0, i), s: m(r.s, 1, i), o: 1 };
      },
      g = { x: -9999, y: -9999, on: !1 },
      _ = 0,
      v = 0,
      y = 1,
      b = 1,
      x = !1,
      S = 0,
      C = 0,
      w = new Image();
    w.src = e.dataset.birdsrc;
    let T = () => {
        let e = t.getBoundingClientRect();
        ((b = Math.min(devicePixelRatio || 1, 1.5)),
          (_ = e.width),
          (v = e.height),
          (y = _ / 1e3),
          (t.width = Math.round(_ * b)),
          (t.height = Math.round(v * b)));
      },
      E = (e, t) => {
        ((C += e), n.setTransform(b, 0, 0, b, 0, 0), n.clearRect(0, 0, _, v));
        for (let r of f) {
          let i = t ? 0 : (((C / 30 - 0.035 * r.rank) % 1) + 1) % 1,
            a = h(i),
            o = a.s,
            s = t ? 0 : Math.sin(C * 0.7 + r.dr) * 4 * y,
            c = (u.x + (r.m.cx - u.x) * o + a.x) * y + r.ox,
            l = (u.y + (r.m.cy - u.y) * o + a.y) * y + r.oy + s;
          if (!t) {
            let t = c - g.x,
              n = l - g.y,
              i = Math.hypot(t, n);
            if (g.on && i < 130 && a.o > 0.2) {
              let a = 1 - i / 130,
                o = a * a * 2600 * y;
              ((r.vx += (t / (i || 1)) * o * e),
                (r.vy += (n / (i || 1)) * o * e),
                (r.ex = Math.min(1.6, r.ex + a * 3 * e + 0.2 * a)));
            }
            ((r.vx += (-r.ox * 5 - r.vx * 3.2) * e),
              (r.vy += (-r.oy * 5 - r.vy * 3.2) * e),
              (r.ox += r.vx * e),
              (r.oy += r.vy * e),
              (r.ex = Math.max(0, r.ex - 0.7 * e)));
          }
          let d = t
            ? 1
            : 1 -
              0.5 *
                (0.5 +
                  0.5 * Math.sin(C * 6.283 * r.hz * (1 + r.ex * 1.4) * (0.6 + 0.4 * o) + r.ph));
          if (a.o <= 0.01) continue;
          n.globalAlpha = a.o * 0.8;
          let f = r.m.w * y * o,
            p = r.m.h * y * o;
          (n.save(),
            n.translate(c, l),
            n.rotate(-(r.vx / 900) * 0.6),
            n.scale(1, d),
            n.drawImage(w, r.m.sx, 0, r.m.w, r.m.h, -f / 2, -p / 2, f, p),
            n.restore());
        }
        n.globalAlpha = 1;
      },
      D = (e) => {
        requestAnimationFrame(D);
        let t = Math.min((e - (S || e)) / 1e3, 0.05);
        ((S = e), x && !document.hidden && E(t, !1));
      },
      O = (e) => {
        let n = t.getBoundingClientRect();
        ((g.x = e.clientX - n.left), (g.y = e.clientY - n.top));
      };
    w.onload = () => {
      (T(),
        new ResizeObserver(T).observe(t),
        i
          ? (E(0, !0), new ResizeObserver(() => E(0, !0)).observe(t))
          : (e.addEventListener(`pointermove`, (e) => {
              (O(e), (g.on = !0));
            }),
            e.addEventListener(`pointerleave`, () => {
              g.on = !1;
            }),
            new IntersectionObserver(
              ([e]) => {
                x = e.isIntersecting;
              },
              { threshold: 0 },
            ).observe(e),
            requestAnimationFrame(D)));
    };
  }
})();
