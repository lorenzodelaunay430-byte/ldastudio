const boxes = Array.from({ length: 48 }, (_, i) => {
  const n = i + 1;
  return {
    id: `Qboite${n}Q`,
    normal: `boite${n}`,
    title: `Boîte ${n}`,
    place: 'Atelier H',
    status: 'Disponible',
    quantity: 1,
    note: `Boîte n°${n} de l’atelier H Anguier`
  };
});

const grid = document.getElementById('boxesGrid');
const scanInput = document.getElementById('scanInput');
const scanBtn = document.getElementById('scanBtn');
const result = document.getElementById('result');
const searchInput = document.getElementById('searchInput');
const themeBtn = document.getElementById('themeBtn');

function cleanCode(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replaceAll(' ', '')
    .replace(/^q/, '')
    .replace(/q$/, '');
}

function renderBoxes(list = boxes) {
  grid.innerHTML = list.map(box => `
    <article class="boxCard" data-id="${box.id}">
      <div class="boxIcon">◈</div>
      <div>
        <div class="boxTitle">${box.title}</div>
        <span class="tag">${box.id}</span>
        <div class="loc">${box.place}</div>
        <div class="status">▧ ${box.status}</div>
      </div>
      <div class="arrow">→</div>
    </article>
  `).join('');

  document.querySelectorAll('.boxCard').forEach(card => {
    card.addEventListener('click', () => {
      scanInput.value = card.dataset.id;
      findBox();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

function findBox() {
  const raw = scanInput.value;
  const code = cleanCode(raw);
  const box = boxes.find(b => cleanCode(b.id) === code || b.normal === code);

  result.classList.remove('hidden', 'bad');

  if (!box) {
    result.classList.add('bad');
    result.innerHTML = `
      <h2>❌ Boîte introuvable</h2>
      <p>Code scanné : <b>${raw || 'vide'}</b></p>
      <p>Format attendu : <b>Qboite1Q</b> à <b>Qboite48Q</b>.</p>
    `;
    return;
  }

  result.innerHTML = `
    <h2>✅ ${box.title} trouvée</h2>
    <p><b>Code :</b> ${box.id}</p>
    <p><b>Emplacement :</b> ${box.place}</p>
    <p><b>Quantité :</b> ${box.quantity}</p>
    <p><b>État :</b> ${box.status}</p>
    <p><b>Note :</b> ${box.note}</p>
  `;
}

scanInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') findBox();
});
scanBtn.addEventListener('click', findBox);

searchInput.addEventListener('input', () => {
  const q = cleanCode(searchInput.value);
  const filtered = boxes.filter(b => cleanCode(b.id).includes(q) || cleanCode(b.title).includes(q));
  renderBoxes(filtered);
});

themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('light');
});

renderBoxes();
setTimeout(() => scanInput.focus(), 300);
