// "Story" case study format (see assets/css/story.css): tabs, counting stats, a reading
// progress bar and reveal-on-scroll. Without JS, every tab panel is simply shown in order.
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var root = document.querySelector(".cs--story");
  if (!root) return;

  // Tabs, with arrow-key movement between them.
  root.querySelectorAll("[role=tablist]").forEach(function (list) {
    var tabs = Array.prototype.slice.call(list.querySelectorAll("[role=tab]"));
    function select(i, focus) {
      tabs.forEach(function (t, j) {
        var on = i === j;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
      });
      if (focus) tabs[i].focus();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () {
        select(i);
      });
      t.addEventListener("keydown", function (e) {
        var n = tabs.length;
        var k = e.key;
        var next =
          k === "ArrowRight" ? (i + 1) % n :
          k === "ArrowLeft" ? (i - 1 + n) % n :
          k === "Home" ? 0 :
          k === "End" ? n - 1 : -1;
        if (next < 0) return;
        e.preventDefault();
        select(next, true);
      });
    });
    select(0);
  });

  if (!("IntersectionObserver" in window)) return;

  // Stats count up from 0 the first time they are seen. The real value is in the HTML; any text
  // around the number ("500+", "$2M") and its decimals ("4.8") are kept.
  if (!reduce) {
    var counter = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          counter.unobserve(entry.target);
          var el = entry.target;
          var m = el.textContent.trim().match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/);
          if (!m) return;
          var n = parseFloat(m[2]);
          var dp = (m[2].split(".")[1] || "").length;
          var t = 0;
          var timer = setInterval(function () {
            t++;
            el.textContent = m[1] + ((n * t) / 30).toFixed(dp) + m[3];
            if (t >= 30) clearInterval(timer);
          }, 30);
        });
      },
      { threshold: 0.6 }
    );
    root.querySelectorAll(".st-stat").forEach(function (el) {
      counter.observe(el);
    });
  }

  // Reading progress bar.
  var bar = document.createElement("div");
  bar.className = "st-bar";
  bar.setAttribute("aria-hidden", "true");
  document.body.appendChild(bar);
  function progress() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    bar.style.transform = "scaleX(" + (max > 0 ? h.scrollTop / max : 0) + ")";
  }
  addEventListener("scroll", progress, { passive: true });
  progress();

  // Reveal on scroll: only content that starts below the fold is hidden, so nothing flashes.
  // A block with screenshots waits (briefly) until they are decoded, so an image never pops in mid-fade.
  if (reduce) return;
  function show(el) {
    el.classList.remove("st-hide");
  }
  function whenImagesReady(el, done) {
    var imgs = Array.prototype.slice.call(el.querySelectorAll("img"));
    if (!imgs.length || !imgs[0].decode) return done();
    var finished = false;
    function finish() {
      if (finished) return;
      finished = true;
      done();
    }
    setTimeout(finish, 700);
    Promise.all(
      imgs.map(function (img) {
        img.loading = "eager";
        return img.decode().catch(function () {});
      })
    ).then(finish);
  }
  var revealer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        revealer.unobserve(entry.target);
        whenImagesReady(entry.target, function () {
          show(entry.target);
        });
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
  );
  // Hide first and switch the transition on a moment later, so hidden content starts hidden instead of fading out.
  var pending = [];
  root.querySelectorAll(".rv").forEach(function (el) {
    if (el.getBoundingClientRect().top < innerHeight) return;
    el.classList.add("st-hide");
    pending.push(el);
  });
  setTimeout(function () {
    pending.forEach(function (el) {
      el.classList.add("st-reveal");
      revealer.observe(el);
    });
  }, 50);
})();
