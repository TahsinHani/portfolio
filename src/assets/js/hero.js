/* Hero illustration sizing and animated birds. */
(() => {
  "use strict";
  var e = document.querySelector(`.hero`),
    t = e.querySelector(`.hero__art`),
    n = 2e3 / 1250,
    r = 0.35,
    i = () => {
      let i = e.clientWidth,
        a = e.clientHeight,
        o = Math.max(i, a * n),
        s = o / n,
        c = i < 768 ? 0.72 : 0.5;
      t.style.cssText = `left:${(i - o) * c}px;top:${(a - s) * r}px;width:${o}px;height:${s}px`;
    };
  (i(), (e.dataset.art = `on`), new ResizeObserver(i).observe(e));
  var a = t.querySelector(`.hero__birdcv`),
    o = a.getContext(`2d`),
    s = JSON.parse(e.dataset.birds),
    c = new Image();
  c.src = e.dataset.birdsrc;
  var l = { x: 439, y: 112, w: 412, h: 156 },
    u = { x: l.x + l.w / 2, y: l.y + l.h / 2 },
    d = 30,
    f = [...s].sort((e, t) => t.cx - e.cx),
    p = s.map((e) => ({
      m: e,
      ox: 0,
      oy: 0,
      vx: 0,
      vy: 0,
      ex: 0,
      ph: Math.random() * 6.283,
      hz: 2.4 + Math.random() * 1.4,
      rank: f.indexOf(e) / s.length,
      dr: Math.random() * 6.283,
    })),
    m = (e) => e * e * (3 - 2 * e),
    h = (e, t, n) => e + (t - e) * n,
    g = (e) => {
      let t = { x: 1.5 * l.w, y: -0.6 * l.h, s: 0.28 },
        n = { x: -1.1 * l.w, y: 0.4 * l.h, s: 0.3 },
        r = { x: -0.6 * l.w, y: 0.24 * l.h, s: 0.55 };
      if (e < 0.4) {
        let n = m(e / 0.4);
        return { x: h(0, t.x, n), y: h(0, t.y, n), s: h(1, t.s, n), o: 1 - n };
      }
      if (e < 0.53) return { x: t.x, y: t.y, s: t.s, o: 0 };
      if (e < 0.68) {
        let t = m((e - 0.53) / 0.15);
        return { x: h(n.x, r.x, t), y: h(n.y, r.y, t), s: h(n.s, r.s, t), o: t };
      }
      let i = m((e - 0.68) / 0.32);
      return { x: h(r.x, 0, i), y: h(r.y, 0, i), s: h(r.s, 1, i), o: 1 };
    },
    _ = { x: -9999, y: -9999, on: !1, lean: 0 },
    v = 0,
    y = 0,
    b = 1,
    x = 1,
    S = !1,
    C = !0,
    w = 0,
    T = 0,
    E = () => {
      let e = t.getBoundingClientRect();
      ((x = Math.min(devicePixelRatio || 1, 1.5)),
        (v = e.width),
        (y = e.height),
        (b = v / 2e3),
        (a.width = Math.round(v * x)),
        (a.height = Math.round(y * x)));
    },
    D = (e, t) => {
      ((T += e), o.setTransform(x, 0, 0, x, 0, 0), o.clearRect(0, 0, v, y));
      let n = _.on ? (_.x / v - 0.5) * 14 : 0;
      for (let r of p) {
        let i = g(t ? 0 : (((T / d - 0.035 * r.rank) % 1) + 1) % 1),
          a = i.s,
          s = t ? 0 : Math.sin(T * 0.7 + r.dr) * 6 * b,
          l = (u.x + (r.m.cx - u.x) * a + i.x) * b + r.ox + n * b * a,
          f = (u.y + (r.m.cy - u.y) * a + i.y) * b + r.oy + s;
        if (!t) {
          let t = l - _.x,
            n = f - _.y,
            a = Math.hypot(t, n),
            o = 150 * Math.max(b, 0.5);
          if (_.on && a < o && i.o > 0.2) {
            let i = 1 - a / o,
              s = i * i * 2600 * b;
            ((r.vx += (t / (a || 1)) * s * e),
              (r.vy += (n / (a || 1)) * s * e),
              (r.ex = Math.min(1.6, r.ex + i * 3 * e + 0.2 * i)));
          }
          ((r.vx += (-r.ox * 5 - r.vx * 3.2) * e),
            (r.vy += (-r.oy * 5 - r.vy * 3.2) * e),
            (r.ox += r.vx * e),
            (r.oy += r.vy * e),
            (r.ex = Math.max(0, r.ex - 0.7 * e)));
        }
        let p = t
          ? 1
          : 1 -
            0.5 *
              (0.5 + 0.5 * Math.sin(T * 6.283 * r.hz * (1 + r.ex * 1.4) * (0.6 + 0.4 * a) + r.ph));
        if (((o.globalAlpha = i.o), i.o <= 0.01)) continue;
        let m = r.m.w * b * a,
          h = r.m.h * b * a;
        (o.save(),
          o.translate(l, f),
          o.rotate(-(r.vx / 900) * 0.6),
          o.scale(1, p),
          o.drawImage(c, r.m.sx, 0, r.m.w, r.m.h, -m / 2, -h / 2, m, h),
          o.restore());
      }
      o.globalAlpha = 1;
    },
    O = (e) => {
      if (!S) return;
      requestAnimationFrame(O);
      let t = Math.min((e - (w || e)) / 1e3, 0.05);
      ((w = e), C && !document.hidden && D(t, !1));
    },
    k = (e) => {
      let n = t.getBoundingClientRect();
      ((_.x = e.clientX - n.left), (_.y = e.clientY - n.top));
    },
    A = () => {
      (E(),
        new ResizeObserver(E).observe(t),
        M
          ? (D(0, !0), new ResizeObserver(() => D(0, !0)).observe(t))
          : (e.addEventListener(`pointermove`, (e) => {
              (k(e), (_.on = !0));
            }),
            e.addEventListener(`pointerleave`, () => {
              _.on = !1;
            }),
            e.addEventListener(`pointerdown`, (e) => {
              k(e);
              let t = 320 * Math.max(b, 0.5);
              ((_.on = !0), j(_.x, _.y, t));
            }),
            new IntersectionObserver(
              ([e]) => {
                C = e.isIntersecting;
              },
              { threshold: 0 },
            ).observe(e),
            (S = !0),
            requestAnimationFrame(O)));
    },
    j = (e, t, n) => {
      for (let r of p) {
        let i = g((((T / d - 0.035 * r.rank) % 1) + 1) % 1),
          a = (u.x + (r.m.cx - u.x) * i.s + i.x) * b + r.ox,
          o = (u.y + (r.m.cy - u.y) * i.s + i.y) * b + r.oy,
          s = a - e,
          c = o - t,
          l = Math.hypot(s, c);
        if (l < n && i.o > 0.2) {
          let e = 1 - l / n;
          ((r.vx += (s / (l || 1)) * 700 * e * b),
            (r.vy += (c / (l || 1)) * 700 * e * b - 120 * e),
            (r.ex = 1.6));
        }
      }
    };
  c.onload = A;
  var M = matchMedia(`(prefers-reduced-motion: reduce)`).matches,
    N = matchMedia(`(hover: hover) and (pointer: fine)`).matches,
    P = (t) => {
      e.dataset.sun = t ? `up` : `down`;
    };
  M
    ? P(!0)
    : N
      ? (P(!1),
        e.addEventListener(`pointerenter`, () => P(!0)),
        e.addEventListener(`pointerleave`, () => P(!1)))
      : (P(!1), setTimeout(() => P(!0), 900));
})();
