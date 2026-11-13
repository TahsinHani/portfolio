// Homepage hero: the boat on the lake (.hero__boat, cut out of hero.webp) drifts from right to left as the
// page scrolls down, and drifts back to the right as it scrolls up. The scroll sets where the boat should be;
// the boat follows that point slowly (time-based easing, the same speed at any frame rate), so it glides
// instead of keeping pace with the wheel, and leans very slightly into the direction it is drifting.
// With reduced motion it stays where it was painted.
(function () {
  var hero = document.querySelector(".hero");
  var boat = hero && hero.querySelector(".hero__boat");
  if (!boat || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var art = hero.querySelector(".hero__art");

  var TRAVEL = 0.3; // share of the picture's width it crosses while the hero scrolls away (77% → 47%)
  var EASE = 0.9; // seconds the boat takes to cover most of the way to where the scroll puts it
  var x = 0;
  var target = 0;
  var last = 0;
  var running = false;

  function aim() {
    var p = Math.min(1, Math.max(0, window.scrollY / hero.offsetHeight));
    target = -p * TRAVEL * art.offsetWidth;
    if (!running) {
      running = true;
      last = performance.now();
      requestAnimationFrame(step);
    }
  }

  function step(now) {
    var dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    var gap = target - x;
    x += gap * (1 - Math.exp((-3 * dt) / EASE));
    var lean = Math.max(-1.5, Math.min(1.5, gap * 0.01));
    if (Math.abs(gap) < 0.2) {
      x = target;
      lean = 0;
      running = false;
    }
    boat.style.transform = "translate3d(" + x.toFixed(2) + "px,0,0) rotate(" + lean.toFixed(2) + "deg)";
    if (running) requestAnimationFrame(step);
  }

  addEventListener("scroll", aim, { passive: true });
  addEventListener("resize", aim);
  aim();
})();
