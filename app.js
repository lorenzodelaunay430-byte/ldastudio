// Mobile menu
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

// Reveal on scroll
const reveals = document.querySelectorAll(".reveal");
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add("in");
  });
}, { threshold: 0.18 });

reveals.forEach(el => io.observe(el));

// Card tilt (subtle)
const tilt = document.querySelector("[data-tilt]");
if (tilt) {
  const max = 10; // degrees
  tilt.addEventListener("mousemove", (ev) => {
    const r = tilt.getBoundingClientRect();
    const x = (ev.clientX - r.left) / r.width - 0.5;
    const y = (ev.clientY - r.top) / r.height - 0.5;
    tilt.style.transform = `rotateY(${x * max}deg) rotateX(${-(y * max)}deg)`;
  });
  tilt.addEventListener("mouseleave", () => {
    tilt.style.transform = "rotateY(0deg) rotateX(0deg)";
  });
}

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
    }, 1600);
  });
}

document.getElementById("year").textContent = new Date().getFullYear();
