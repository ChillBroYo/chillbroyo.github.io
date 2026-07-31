document.getElementById("year").textContent = new Date().getFullYear();

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Scroll-reveal
const revealObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    }
  },
  { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
);

document.querySelectorAll(".reveal").forEach((el) => {
  if (reduceMotion) {
    el.classList.add("visible");
  } else {
    revealObserver.observe(el);
  }
});

// Timeline progress line fills as the journey section scrolls through the viewport
const timeline = document.querySelector(".timeline");
const progress = document.querySelector(".timeline-progress");

function updateTimeline() {
  const rect = timeline.getBoundingClientRect();
  const viewport = window.innerHeight;
  const total = rect.height + viewport * 0.4;
  const scrolled = Math.min(Math.max(viewport * 0.7 - rect.top, 0), total);
  progress.style.height = `${(scrolled / total) * 100}%`;
}

if (timeline && progress && !reduceMotion) {
  window.addEventListener("scroll", updateTimeline, { passive: true });
  updateTimeline();
} else if (progress) {
  progress.style.height = "100%";
}

// Animated stat counters
function animateCount(el) {
  const target = parseInt(el.dataset.count, 10);
  const duration = 1200;
  const start = performance.now();
  function tick(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(target * eased);
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const statObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statObserver.unobserve(entry.target);
      }
    }
  },
  { threshold: 0.5 }
);

document.querySelectorAll(".stat-num").forEach((el) => {
  if (reduceMotion) {
    el.textContent = el.dataset.count;
  } else {
    statObserver.observe(el);
  }
});
