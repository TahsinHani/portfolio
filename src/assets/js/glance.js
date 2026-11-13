// Homepage "At a glance" (partials/home/glance.njk, styles in home.css → .glance).
// The row of photo cards drifts slowly from right to left and loops forever: the row gets copies of its
// cards after the originals (hidden from screen readers and the keyboard) and its position wraps by one set.
// ‹ › (beside the title) move it one card at a time. (Several rows would move together; there is one now.)
// Everything stops while the pointer is over the cards or a link has focus, while the section is off screen
// and while the tab is hidden. With reduced motion there is no drift; the arrows still step through the cards.
// Without JS each row simply scrolls sideways.
(function () {
  var stage = document.querySelector("[data-glance]");
  if (!stage) return;
  var viewport = stage.querySelector(".glance__viewport");
  var rows = Array.prototype.slice.call(stage.querySelectorAll(".glance__track")).map(function (track) {
    return { track: track, originals: Array.prototype.slice.call(track.children), set: 0 };
  }).filter(function (r) {
    return r.originals.length;
  });
  if (!rows.length) return;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var SPEED = 26; // px per second of drift
  var offset = 0; // how far the rows have moved left
  var pending = 0; // distance still to travel from the arrow buttons
  var step = 0; // one card plus the gap
  var hovering = false;
  var focused = false;
  var visible = true;
  var last = 0;
  var raf = 0;

  stage.classList.add("glance--live");

  function measure() {
    rows.forEach(function (row) {
      // Remove old copies, then add enough sets to cover the row twice over.
      Array.prototype.slice.call(row.track.querySelectorAll("[data-copy]")).forEach(function (n) {
        n.remove();
      });
      // Cards differ in width: one set runs from the first card's left edge to the last card's right edge,
      // plus one gap; an arrow press moves by an average card.
      var gap = parseFloat(getComputedStyle(row.track).columnGap) || 0;
      var firstBox = row.originals[0].getBoundingClientRect();
      var lastBox = row.originals[row.originals.length - 1].getBoundingClientRect();
      row.set = lastBox.right - firstBox.left + gap;
      step = row.set / row.originals.length;
      var sets = Math.max(1, Math.ceil(viewport.clientWidth / row.set)) + 1;
      for (var s = 0; s < sets; s++) {
        row.originals.forEach(function (li) {
          var copy = li.cloneNode(true);
          copy.setAttribute("data-copy", "");
          copy.setAttribute("aria-hidden", "true");
          copy.querySelectorAll("a, button").forEach(function (el) {
            el.setAttribute("tabindex", "-1");
          });
          row.track.appendChild(copy);
        });
      }
    });
    paint();
  }

  function wrap(v, w) {
    return ((v % w) + w) % w;
  }

  function paint() {
    rows.forEach(function (row) {
      row.track.style.transform = "translate3d(" + (-wrap(offset, row.set)).toFixed(2) + "px,0,0)";
    });
  }

  function frame(now) {
    var dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    var moving = false;
    if (pending) {
      var d = pending * (1 - Math.exp(-7 * dt));
      if (Math.abs(pending - d) < 0.3) d = pending;
      offset += d;
      pending -= d;
      moving = true;
    }
    if (!reduce && !hovering && !focused && visible && !document.hidden) {
      offset += SPEED * dt;
      moving = true;
    }
    if (Math.abs(offset) > 1e7) offset = wrap(offset, rows[0].set);
    paint();
    raf = moving ? requestAnimationFrame(frame) : 0;
  }

  function wake() {
    if (raf) return;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }

  function nudge(dir) {
    if (reduce) {
      offset += dir * step;
      paint();
      return;
    }
    pending += dir * step;
    wake();
  }

  stage.querySelector(".glance__arrow--prev").addEventListener("click", function () {
    nudge(-1);
  });
  stage.querySelector(".glance__arrow--next").addEventListener("click", function () {
    nudge(1);
  });

  viewport.addEventListener("pointerenter", function (e) {
    if (e.pointerType === "mouse") hovering = true;
  });
  viewport.addEventListener("pointerleave", function () {
    hovering = false;
    wake();
  });

  // Keyboard: stop while a link has focus, and bring its card fully into view (past the faded edges).
  viewport.addEventListener("focusin", function (e) {
    focused = true;
    var card = e.target.closest(".glance__item");
    if (!card) return;
    var v = viewport.getBoundingClientRect();
    var r = card.getBoundingClientRect();
    var pad = v.width * 0.08;
    if (r.left < v.left + pad) offset -= v.left + pad - r.left;
    else if (r.right > v.right - pad) offset += r.right - (v.right - pad);
    paint();
  });
  viewport.addEventListener("focusout", function () {
    focused = false;
    wake();
  });

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible) wake();
    }).observe(viewport);
  }
  document.addEventListener("visibilitychange", wake);

  var resizeTimer;
  addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(measure, 150);
  });

  measure();
  wake();
})();
