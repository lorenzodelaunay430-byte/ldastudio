const burger = document.querySelector(".burger");
const mobileNav = document.querySelector(".mobileNav");
const toTop = document.getElementById("toTop");

// Mobile menu
if (burger && mobileNav) {
  burger.addEventListener("click", () => {
    const expanded = burger.getAttribute("aria-expanded") === "true";
    burger.setAttribute("aria-expanded", String(!expanded));
    mobileNav.hidden = expanded;
  });

  mobileNav.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      burger.setAttribute("aria-expanded", "false");
      mobileNav.hidden = true;
    });
  });
}

// Reveal on scroll
const reveals = document.querySelectorAll(".reveal");
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add("in");
  });
}, { threshold: 0.16 });
reveals.forEach(el => io.observe(el));

// Tilt effect
const tilt = document.querySelector("[data-tilt]");
if (tilt) {
  const max = 10;
  tilt.addEventListener("mousemove", (ev) => {
    const r = tilt.getBoundingClientRect();
    const x = (ev.clientX - r.left) / r.width - 0.5;
    const y = (ev.clientY - r.top) / r.height - 0.5;
    tilt.style.transform = `rotateY(${x * max}deg) rotateX(${-(y * max)}deg) translateZ(0)`;
  });
  tilt.addEventListener("mouseleave", () => {
    tilt.style.transform = "rotateY(0deg) rotateX(0deg)";
  });
}

// Back to top
function onScroll() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  if (toTop) {
    if (scrollTop > 500) toTop.classList.add("show");
    else toTop.classList.remove("show");
  }
}
window.addEventListener("scroll", onScroll);
onScroll();
if (toTop) toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// Tabs
const tabs = document.querySelectorAll(".tab");
tabs.forEach(btn => {
  btn.addEventListener("click", () => {
    tabs.forEach(b => b.classList.remove("is-on"));
    btn.classList.add("is-on");

    const key = btn.dataset.tab;
    document.querySelectorAll(".panel").forEach(p => p.classList.remove("is-on"));
    document.getElementById(`tab-${key}`)?.classList.add("is-on");
  });
});

// Counters (reliable)
function animateCount(el, to, ms = 900) {
  const start = performance.now();
  const from = 0;

  function tick(now) {
    const p = Math.min(1, (now - start) / ms);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = String(Math.round(from + (to - from) * eased));
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const counters = document.querySelectorAll("[data-count]");
function triggerCountersIfVisible() {
  counters.forEach(el => {
    if (el.dataset.done) return;
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) {
      el.dataset.done = "1";
      animateCount(el, Number(el.dataset.count || "0"), 900);
    }
  });
}

const counterIO = new IntersectionObserver((entries, obs) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    if (el.dataset.done) return;
    el.dataset.done = "1";
    animateCount(el, Number(el.dataset.count || "0"), 900);
    obs.unobserve(el);
  });
}, { threshold: 0.2 });

counters.forEach(c => counterIO.observe(c));
window.addEventListener("load", triggerCountersIfVisible);
window.addEventListener("hashchange", () => setTimeout(triggerCountersIfVisible, 50));

// Form demo
const form = document.getElementById("leadForm");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const btn = form.querySelector("button");
    const old = btn.textContent;
    btn.textContent = "Envoyé ✅";
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = old;
      btn.disabled = false;
      form.reset();
    }, 1400);
  });
}

document.getElementById("year").textContent = new Date().getFullYear();
