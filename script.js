const year = document.getElementById("year");
year.textContent = new Date().getFullYear();

const burger = document.getElementById("burger");
const mobileNav = document.getElementById("mobileNav");

burger?.addEventListener("click", () => {
  const open = mobileNav.classList.toggle("show");
  burger.setAttribute("aria-expanded", String(open));
  mobileNav.setAttribute("aria-hidden", String(!open));
});

mobileNav?.querySelectorAll("a").forEach(a => {
  a.addEventListener("click", () => {
    mobileNav.classList.remove("show");
    burger.setAttribute("aria-expanded", "false");
    mobileNav.setAttribute("aria-hidden", "true");
  });
});

// Counter animation
const counters = [...document.querySelectorAll("[data-count]")];
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function animateCount(el, target){
  const duration = 900;
  const start = performance.now();
  const from = 0;

  function tick(now){
    const t = Math.min((now - start) / duration, 1);
    const val = Math.round(from + (target - from) * (1 - Math.pow(1 - t, 3)));
    el.textContent = val;
    if(t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

if(!prefersReduced){
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting){
        counters.forEach(el => animateCount(el, Number(el.dataset.count)));
        io.disconnect();
      }
    });
  }, { threshold: 0.25 });
  io.observe(document.querySelector(".stats"));
} else {
  counters.forEach(el => el.textContent = el.dataset.count);
}

// Fake contact send
const fakeSend = document.getElementById("fakeSend");
const formNote = document.getElementById("formNote");
fakeSend?.addEventListener("click", () => {
  formNote.textContent = "✅ Message prêt. (Branche un vrai formulaire: Formspree / Netlify Forms / EmailJS)";
});
