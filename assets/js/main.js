// BrightSmile Dental Care — shared front-end behaviour
document.addEventListener("DOMContentLoaded", () => {
  // Scroll-reveal animations (IntersectionObserver, no library needed)
  const revealEls = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealEls.forEach((el) => observer.observe(el));

  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Navbar shadow on scroll
  const nav = document.querySelector(".navbar");
  const onScroll = () => {
    if (nav) nav.classList.toggle("shadow-sm", window.scrollY > 8);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
});

/* Polish upgrade: reduced-motion-safe reveals, back-to-top, stagger */
(function () {
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.addEventListener("DOMContentLoaded", function () {
    var els = document.querySelectorAll(".reveal-left,.reveal-right,.reveal-zoom");
    if (reduced || !("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("visible"); });
      document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("visible"); });
    } else {
      var io2 = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("visible"); io2.unobserve(e.target); } });
      }, { threshold: 0.12 });
      els.forEach(function (el) { io2.observe(el); });
    }
    var btn = document.createElement("button");
    btn.id = "back-to-top"; btn.type = "button";
    btn.setAttribute("aria-label", "Back to top");
    btn.textContent = "\u2191";
    btn.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" }); });
    document.body.appendChild(btn);
    window.addEventListener("scroll", function () { btn.classList.toggle("show", window.scrollY > 600); }, { passive: true });
  });
})();
