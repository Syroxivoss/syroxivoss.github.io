/* Ramble site — small interaction layer. No dependencies. */
(function () {
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- living waveform: build mood-colored bars ------------------------- */
  var wave = document.getElementById("wave");
  if (wave) {
    var moods = ["--peach", "--honey", "--sage", "--blue", "--lav", "--rose", "--coral-soft"];
    var N = 44;
    var frag = document.createDocumentFragment();
    for (var i = 0; i < N; i++) {
      var b = document.createElement("span");
      b.className = "bar";
      // organic envelope: taller toward the middle, with per-bar jitter
      var t = i / (N - 1);
      var envelope = Math.sin(t * Math.PI);           // 0..1..0
      var jitter = 0.55 + Math.random() * 0.45;
      var h = Math.round((24 + envelope * 62) * jitter); // %
      b.style.setProperty("--h", Math.max(16, Math.min(96, h)) + "%");
      b.style.setProperty("--d", (0.9 + Math.random() * 1.1).toFixed(2) + "s");
      b.style.setProperty("--delay", (-Math.random() * 1.6).toFixed(2) + "s");
      b.style.background = "var(" + moods[i % moods.length] + ")";
      frag.appendChild(b);
    }
    wave.appendChild(frag);
  }

  /* ---- live REC timer (counts up like a real recording) ---------------- */
  var rec = document.getElementById("rec-time");
  if (rec && !reduce) {
    var s = 14;
    setInterval(function () {
      s++;
      var m = Math.floor(s / 60), ss = s % 60;
      rec.textContent = (m < 10 ? "0" : "") + m + ":" + (ss < 10 ? "0" : "") + ss;
    }, 1000);
  }

  /* ---- nav solidifies once you scroll past the hero -------------------- */
  var nav = document.querySelector(".nav");
  if (nav && document.body.classList.contains("home")) {
    var onScroll = function () {
      nav.classList.toggle("scrolled", window.scrollY > 40);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---- scroll reveal --------------------------------------------------- */
  var targets = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    targets.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    targets.forEach(function (el) { io.observe(el); });
  }
})();
