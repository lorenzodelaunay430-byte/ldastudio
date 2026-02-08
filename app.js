// Menu mobile
const burger = document.querySelector(".burger");
const mobileNav = document.querySelector(".mobileNav");
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

// Reveal
const reveals = document.querySelectorAll(".reveal");
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("in"); });
}, { threshold: 0.16 });
reveals.forEach(el => io.observe(el));

// Scroll progress + toTop
const toTop = document.getElementById("toTop");
const scrollFill = document.getElementById("scrollFill");
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

// Tabs
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

    setTimeout(() => {
      updatePc3D();
      updateHero3D();
    }, 80);
  });
});

// Counters
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

// HERO 3D
const stage3d = document.getElementById("stage3d");
function updateHero3D(){
  if (!stage3d) return;
  const rect = stage3d.getBoundingClientRect();
  const vh = window.innerHeight;
  const p = Math.min(1, Math.max(0, 1 - rect.top / vh));
  const rx = (1 - p) * 12;
  const ry = (p - 0.5) * 10;
  const z = p * 40;
  stage3d.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(${z}px)`;
}
window.addEventListener("scroll", updateHero3D, { passive: true });
window.addEventListener("resize", updateHero3D);
updateHero3D();

// PC 3D (tab PC only)
const pcWrap = document.getElementById("pcWrap");
const pcCase = document.getElementById("pcCase");
const pcPanel = document.getElementById("tab-pc");

function isPcTabActive(){
  return pcPanel && pcPanel.classList.contains("is-on");
}

function updatePc3D(){
  if (!pcWrap || !pcCase || !isPcTabActive()) return;

  const rect = pcWrap.getBoundingClientRect();
  const vh = window.innerHeight;

  const start = vh * 0.88;
  const end = vh * 0.18;
  const p = Math.min(1, Math.max(0, (start - rect.top) / (start - end)));

  const rotX = 18 - p * 28;     // 18 -> -10
  const rotY = -32 + p * 64;    // -32 -> 32
  const lift = 26 + p * 34;     // profondeur
  const y = -56 - p * 2;

  pcCase.style.transform =
    `translate(-50%, ${y}%) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(${lift}px)`;

  // vitesse ventilos selon le scroll
  document.querySelectorAll(".fanBlades").forEach(f => {
    f.style.animationDuration = `${1.9 - p * 0.9}s`;
  });
}

document.querySelectorAll(".addToCart").forEach(btn => {
  btn.addEventListener("click", () => {
    if (btn.classList.contains("is-adding")) return;

    btn.classList.remove("is-done");
    btn.classList.add("is-adding");

    setTimeout(() => {
      btn.classList.remove("is-adding");
      btn.classList.add("is-done");

      // reset after a moment
      setTimeout(() => btn.classList.remove("is-done"), 2200);
    }, 560);
  });
});

}

