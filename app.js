const burger = document.querySelector(".burger");
const mobileNav = document.querySelector(".mobileNav");
const toTop = document.getElementById("toTop");
const scrollFill = document.getElementById("scrollFill");

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

// ===== 3D SCROLL EFFECT =====
const stage3d = document.getElementById("stage3d");

function onScroll3D(){
  if (!stage3d) return;

  const rect = stage3d.getBoundingClientRect();
  const vh = window.innerHeight;

  // progression visible (0 → 1)
  const progress = Math.min(
    1,
    Math.max(0, 1 - rect.top / vh)
  );

  const rotateX = (1 - progress) * 12;
  const rotateY = (progress - 0.5) * 10;
  const translateZ = progress * 40;

  stage3d.style.transform = `
    rotateX(${rotateX}deg)
    rotateY(${rotateY}deg)
    translateZ(${translateZ}px)
  `;
}

window.addEventListener("scroll", onScroll3D);
onScroll3D();


// Scroll progress + Back to top
function onScroll() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const p = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (scrollFill) scrollFill.style.width = `${p}%`;

  if (toTop) {
    if (scrollTop > 500) toTop.classList.add("show");
    else toTop.classList.remove("show");
  }
}
window.addEventListener("scroll", onScroll);
onScroll();

if (toTop) toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// Tabs (Web / PC)
const tabs = document.querySelectorAll(".tab");
tabs.forEach(btn => {
  btn.addEventListener("click", () => {
    tabs.forEach(b => {
      b.classList.remove("is-on");
      b.setAttribute("aria-selected", "false");
    });
    btn.classList.add("is-on");
    btn.setAttribute("aria-selected", "true");

    const key = btn.dataset.tab;
    document.querySelectorAll(".panel").forEach(p => p.classList.remove("is-on"));
    document.getElementById(`tab-${key}`)?.classList.add("is-on");
  });
});

// Counters (smooth) — but numbers already set, so it's just a nice touch
function animateCount(el, to, ms = 700) {
  const from = 0;
  const start = performance.now();
  function tick(now) {
    const p = Math.min(1, (now - start) / ms);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = String(Math.round(from + (to - from) * eased));
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const counters = document.querySelectorAll("[data-count]");
const counterIO = new IntersectionObserver((entries, obs) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    if (el.dataset.done) return;
    el.dataset.done = "1";
    animateCount(el, Number(el.dataset.count || "0"), 700);
    obs.unobserve(el);
  });
}, { threshold: 0.4 });

counters.forEach(c => counterIO.observe(c));

// Form demo (confirmation)
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
