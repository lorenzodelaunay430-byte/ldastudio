// ===== Helpers
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

// Year
document.getElementById("year").textContent = new Date().getFullYear();

// Mobile menu
const burger = document.getElementById("burger");
const mobileNav = document.getElementById("mobileNav");
if (burger && mobileNav){
  burger.addEventListener("click", () => {
    mobileNav.classList.toggle("isOn");
    mobileNav.setAttribute("aria-hidden", mobileNav.classList.contains("isOn") ? "false" : "true");
  });
  mobileNav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    mobileNav.classList.remove("isOn");
    mobileNav.setAttribute("aria-hidden", "true");
  }));
}

// Tabs Web/PC
const tabs = document.querySelectorAll(".tab");
const web = document.getElementById("cardsWeb");
const pc = document.getElementById("cardsPC");

tabs.forEach(btn => {
  btn.addEventListener("click", () => {
    tabs.forEach(b => b.classList.remove("isOn"));
    btn.classList.add("isOn");

    const tab = btn.dataset.tab;
    if (tab === "web") {
      web.classList.remove("hidden");
      pc.classList.add("hidden");
    } else {
      pc.classList.remove("hidden");
      web.classList.add("hidden");
    }
    requestAnimationFrame(updatePC3D);
  });
});

// ===== Tilt effect (site 3D feel)
function initTilt(){
  const els = document.querySelectorAll("[data-tilt]");
  els.forEach(el => {
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;

      const rx = (0.5 - y) * 10; // -5..+5
      const ry = (x - 0.5) * 12; // -6..+6
      el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;

      el.style.setProperty("--mx", `${x*100}%`);
      el.style.setProperty("--my", `${y*100}%`);
    });

    el.addEventListener("mouseleave", () => {
      el.style.transform = `perspective(900px) rotateX(0deg) rotateY(0deg)`;
      el.style.setProperty("--mx", `50%`);
      el.style.setProperty("--my", `40%`);
    });
  });
}
initTilt();

// ===== PC 3D scroll effect (real 3D rotation)
const pc3d = document.getElementById("pc3d");
function updatePC3D(){
  if (!pc3d) return;
  if (pc.classList.contains("hidden")) return;

  const pcZone = pc.getBoundingClientRect();
  const vh = window.innerHeight || 800;
  const progress = clamp(1 - (pcZone.top / (vh * 0.95)), 0, 1);

  const rx = -10 + progress * 22; // -10 -> +12
  const ry = 25 + progress * 55;  // 25 -> 80
  const tz = 0 + progress * 18;   // 0 -> 18

  pc3d.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(${tz}px)`;
}
window.addEventListener("scroll", updatePC3D, { passive:true });
window.addEventListener("resize", updatePC3D);
updatePC3D();

// ===== INTRO 3D — L D A luminous (no fonts, pure geometry)
document.addEventListener("DOMContentLoaded", () => {
  const intro = document.getElementById("intro3D");
  const canvas = document.getElementById("introCanvas");
  if (!intro || !canvas) return;

  // If Three.js missing => don't block
  if (!window.THREE) {
    intro.remove();
    return;
  }

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance"
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight, false);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0.2, 10);

  // Lights
  scene.add(new THREE.AmbientLight(0xffffff, 0.35));

  const key = new THREE.DirectionalLight(0xffffff, 1.2);
  key.position.set(4, 3, 6);
  scene.add(key);

  const orangeLight = new THREE.PointLight(0xff8a00, 2.2, 50);
  orangeLight.position.set(0, 1.2, 6);
  scene.add(orangeLight);

  const rim = new THREE.PointLight(0xffb14a, 1.2, 50);
  rim.position.set(0, 2.5, -6);
  scene.add(rim);

  // Material (glowy)
  const mat = new THREE.MeshStandardMaterial({
    color: 0xff8a00,
    emissive: 0xff8a00,
    emissiveIntensity: 0.9,
    metalness: 0.55,
    roughness: 0.25
  });

  const glowMat = new THREE.MeshBasicMaterial({
    color: 0xff8a00,
    transparent: true,
    opacity: 0.18
  });

  // Create letter shapes via extrude (manual)
  function extrudeShape(shape, depth = 0.55){
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: true,
      bevelThickness: 0.08,
      bevelSize: 0.06,
      bevelSegments: 2,
      steps: 1
    });
    geo.center();
    const m = new THREE.Mesh(geo, mat);

    // fake outer glow by scaling a duplicate mesh
    const g = new THREE.Mesh(geo.clone(), glowMat);
    g.scale.setScalar(1.08);
    m.add(g);
    return m;
  }

  // L
  const L = new THREE.Shape();
  L.moveTo(0,0);
  L.lineTo(0,3.6);
  L.lineTo(0.9,3.6);
  L.lineTo(0.9,0.9);
  L.lineTo(3.0,0.9);
  L.lineTo(3.0,0);
  L.lineTo(0,0);

  // D (outer + inner hole)
  const D = new THREE.Shape();
  D.moveTo(0,0);
  D.lineTo(0,3.6);
  D.lineTo(1.9,3.6);
  D.absarc(1.9,1.8,1.8,Math.PI/2,-Math.PI/2,true);
  D.lineTo(0,0);

  const Dhole = new THREE.Path();
  Dhole.moveTo(0.9,0.7);
  Dhole.lineTo(0.9,2.9);
  Dhole.lineTo(1.75,2.9);
  Dhole.absarc(1.75,1.8,1.05,Math.PI/2,-Math.PI/2,true);
  Dhole.lineTo(0.9,0.7);
  D.holes.push(Dhole);

  // A (outer + inner hole)
  const A = new THREE.Shape();
  A.moveTo(1.8,3.6);
  A.lineTo(3.3,0);
  A.lineTo(2.3,0);
  A.lineTo(1.95,0.9);
  A.lineTo(0.75,0.9);
  A.lineTo(0.4,0);
  A.lineTo(-0.6,0);
  A.lineTo(0.9,3.6);
  A.lineTo(1.8,3.6);

  const Ahole = new THREE.Path();
  Ahole.moveTo(1.05,2.0);
  Ahole.lineTo(0.6,1.2);
  Ahole.lineTo(2.1,1.2);
  Ahole.lineTo(1.65,2.0);
  Ahole.lineTo(1.05,2.0);
  A.holes.push(Ahole);

  const g = new THREE.Group();
  const mL = extrudeShape(L, 0.55);
  const mD = extrudeShape(D, 0.55);
  const mA = extrudeShape(A, 0.55);

  mL.position.x = -4.1;
  mD.position.x = 0;
  mA.position.x = 4.1;

  g.add(mL, mD, mA);
  scene.add(g);

  // Subtle particles
  const pCount = 700;
  const pGeo = new THREE.BufferGeometry();
  const pos = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++){
    pos[i*3+0] = (Math.random() - 0.5) * 26;
    pos[i*3+1] = (Math.random() - 0.5) * 14;
    pos[i*3+2] = (Math.random() - 0.5) * 18;
  }
  pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const pMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.03, transparent: true, opacity: 0.55 });
  const points = new THREE.Points(pGeo, pMat);
  scene.add(points);

  // Animate
  let t = 0;
  let raf = 0;

  function render(){
    raf = requestAnimationFrame(render);
    t += 0.012;

    g.rotation.y = Math.sin(t * 0.8) * 0.35;
    g.rotation.x = Math.sin(t * 0.5) * 0.12;
    g.position.y = Math.sin(t) * 0.12;

    points.rotation.y += 0.0015;
    renderer.render(scene, camera);
  }
  render();

  function onResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight, false);
  }
  window.addEventListener("resize", onResize);

  // Remove intro
  setTimeout(() => {
    intro.classList.add("introFadeOut");
    setTimeout(() => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      intro.remove();
    }, 950);
  }, 2600);
});
