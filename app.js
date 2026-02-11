// year
document.getElementById("year").textContent = new Date().getFullYear();

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
  });
});

// ===== INTRO 3D (robuste) =====
document.addEventListener("DOMContentLoaded", () => {
  const intro = document.getElementById("intro3D");
  const canvas = document.getElementById("introCanvas");

  if (!intro || !canvas) return;

  // si WebGL/Three indispo => on enlève l'intro pour ne pas bloquer
  if (!window.THREE) {
    intro.remove();
    return;
  }

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance"
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight, false);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.z = 7;

  // Lights
  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(4, 3, 6);
  scene.add(key);

  const fill = new THREE.PointLight(0xffffff, 0.8);
  fill.position.set(-4, -2, 3);
  scene.add(fill);

  // Mesh (stylé + léger)
  const geo = new THREE.TorusKnotGeometry(1.7, 0.55, 140, 18);
  const mat = new THREE.MeshStandardMaterial({
    color: 0xff8a00,
    metalness: 0.82,
    roughness: 0.22
  });
  const mesh = new THREE.Mesh(geo, mat);
  scene.add(mesh);

  // Particules simples (points)
  const pCount = 600;
  const pGeo = new THREE.BufferGeometry();
  const pos = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    pos[i * 3 + 0] = (Math.random() - 0.5) * 18;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 12;
  }
  pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const pMat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.03,
    transparent: true,
    opacity: 0.65
  });
  const points = new THREE.Points(pGeo, pMat);
  scene.add(points);

  let t = 0;
  let raf = 0;

  function render() {
    raf = requestAnimationFrame(render);
    t += 0.01;

    mesh.rotation.x += 0.010;
    mesh.rotation.y += 0.014;
    mesh.position.y = Math.sin(t) * 0.08;

    points.rotation.y += 0.0016;
    points.rotation.x += 0.0008;

    renderer.render(scene, camera);
  }
  render();

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight, false);
  }
  window.addEventListener("resize", onResize);

  // Durée intro
  setTimeout(() => {
    intro.classList.add("introFadeOut");
    setTimeout(() => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      intro.remove();
    }, 950);
  }, 2600);
});
