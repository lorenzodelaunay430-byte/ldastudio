document.getElementById("year").textContent = new Date().getFullYear();

/* Mobile menu */
const menuBtn = document.getElementById("menuBtn");
const mobileNav = document.getElementById("mobileNav");
menuBtn?.addEventListener("click", () => {
  const open = mobileNav.classList.toggle("show");
  menuBtn.setAttribute("aria-expanded", String(open));
  mobileNav.setAttribute("aria-hidden", String(!open));
});
mobileNav?.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
  mobileNav.classList.remove("show");
  menuBtn.setAttribute("aria-expanded", "false");
  mobileNav.setAttribute("aria-hidden", "true");
}));

/* Reveal on scroll */
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealEls = [...document.querySelectorAll(".reveal")];

if (prefersReduced) {
  revealEls.forEach(el => el.classList.add("is-in"));
} else {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add("is-in");
    });
  }, { threshold: 0.14 });
  revealEls.forEach(el => io.observe(el));
}

/* Counters */
const counters = [...document.querySelectorAll("[data-count]")];
function animateCount(el, target){
  const duration = 900;
  const start = performance.now();
  const from = 0;

  function tick(now){
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(from + (target - from) * eased);
    if(t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

if (!prefersReduced) {
  const stats = document.querySelector(".stats");
  if (stats) {
    const io2 = new IntersectionObserver((entries) => {
      if(entries.some(e => e.isIntersecting)){
        counters.forEach(el => animateCount(el, Number(el.dataset.count)));
        io2.disconnect();
      }
    }, { threshold: 0.3 });
    io2.observe(stats);
  }
} else {
  counters.forEach(el => el.textContent = el.dataset.count);
}

/* Premium tilt (setup card) */
const tilt = document.getElementById("tiltCard");
if (tilt && !prefersReduced) {
  const card = tilt.querySelector(".card");

  tilt.addEventListener("mousemove", (e) => {
    const r = tilt.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;

    const rx = (y - 0.5) * -10;
    const ry = (x - 0.5) * 12;
    card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
  });

  tilt.addEventListener("mouseleave", () => {
    card.style.transform = "rotateX(0deg) rotateY(0deg)";
  });
}

/* Fake send */
document.getElementById("sendBtn")?.addEventListener("click", () => {
  const note = document.getElementById("note");
  note.textContent = "✅ Message prêt. (On peut brancher Formspree / EmailJS ensuite.)";
});
