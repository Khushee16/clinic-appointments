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
