const previewBoxes=document.getElementById('previewBoxes');
const boxesContainer=document.getElementById('boxes');
const result=document.getElementById('result');
const result2=document.getElementById('result2');
const input=document.getElementById('scanInput');
const input2=document.getElementById('scanInput2');
const searchInput=document.getElementById('boxSearch');

let totalBoxes=Number(localStorage.getItem('totalBoxes'))||48;
let boxes=[];

const themes={
 purple:['#8b5cf6','#5b21b6','rgba(139,92,246,.45)'],
 blue:['#3b82f6','#1d4ed8','rgba(59,130,246,.45)'],
 green:['#22c55e','#15803d','rgba(34,197,94,.45)'],
 orange:['#f97316','#c2410c','rgba(249,115,22,.45)'],
 red:['#ef4444','#991b1b','rgba(239,68,68,.45)']
};

function buildBoxes(){
 boxes=[];
 for(let i=1;i<=totalBoxes;i++){
  boxes.push({id:i,code:`Qboite${i}Q`,etat:localStorage.getItem('box'+i)||'Disponible'});
 }
}

function updateStats(){
 document.getElementById('indispoCount').innerText=boxes.filter(b=>b.etat==='Indisponible').length;
 document.getElementById('totalCount').innerText=totalBoxes;
}

function statusClass(etat){
 if(etat==='Disponible')return 'disponible';
 if(etat==='Stock faible')return 'faible';
 return 'indispo';
}

function boxCard(box){
 return `<div class="box" onclick="openBox(${box.id},'result')">
 <h3>Boîte ${box.id}</h3>
 <p>${box.code}</p>
 <p>Atelier H</p>
 <span class="status ${statusClass(box.etat)}">${box.etat}</span>
 </div>`;
}

function renderBoxes(){
 buildBoxes();
 previewBoxes.innerHTML='';
 boxesContainer.innerHTML='';
 boxes.slice(0,8).forEach(box=>previewBoxes.innerHTML+=boxCard(box));
 boxes.forEach(box=>boxesContainer.innerHTML+=boxCard(box));
 updateStats();
}

function openBox(id,targetId){
 const target=document.getElementById(targetId)||result;
 const found=boxes.find(b=>b.id===id);
 showBox(found,target);
 window.scrollTo({top:0,behavior:'smooth'});
}

function scan(value,target){
 const found=boxes.find(b=>b.code.toLowerCase()===value.trim().toLowerCase());
 if(found)showBox(found,target);
 else target.innerHTML=`<div class="result-card" style="border-color:red"><h2>Boîte introuvable</h2><p>Code scanné : ${value}</p></div>`;
}

function showBox(found,target){
 target.innerHTML=`<div class="result-card">
 <h2>✅ Boîte ${found.id} trouvée</h2>
 <p><strong>Code :</strong> ${found.code}</p>
 <p><strong>Emplacement :</strong> Atelier H</p>
 <p><strong>Quantité :</strong> 1</p>
 <label><strong>Modifier l'état :</strong></label><br>
 <select id="etatSelect-${found.id}">
  <option ${found.etat==='Disponible'?'selected':''}>Disponible</option>
  <option ${found.etat==='Stock faible'?'selected':''}>Stock faible</option>
  <option ${found.etat==='Indisponible'?'selected':''}>Indisponible</option>
 </select>
 <button class="save-btn" onclick="saveState(${found.id})">Sauvegarder</button>
 <p style="margin-top:14px"><strong>Note :</strong> Boîte n°${found.id} de l’atelier H Anguier</p>
 </div>`;
}

function saveState(id){
 const select=document.getElementById('etatSelect-'+id);
 localStorage.setItem('box'+id,select.value);
 renderBoxes();
 alert('État sauvegardé !');
}

input.addEventListener('change',()=>{scan(input.value,result);input.value='';});
input2.addEventListener('change',()=>{scan(input2.value,result2);input2.value='';});

searchInput.addEventListener('input',()=>{
 const q=searchInput.value.toLowerCase();
 boxesContainer.innerHTML='';
 boxes.filter(b=>b.code.toLowerCase().includes(q)||String(b.id).includes(q)).forEach(box=>boxesContainer.innerHTML+=boxCard(box));
});

function showPage(page){
 document.querySelectorAll('.page').forEach(p=>p.classList.remove('active-page'));
 document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
 document.getElementById(page+'Page').classList.add('active-page');
 document.querySelector(`[data-page="${page}"]`)?.classList.add('active');
 setTimeout(()=>{if(page==='home')input.focus();if(page==='scanner')input2.focus();},150);
}

document.querySelectorAll('.nav-btn').forEach(btn=>btn.addEventListener('click',()=>showPage(btn.dataset.page)));

function setTheme(name){
 const theme=themes[name];
 document.documentElement.style.setProperty('--accent',theme[0]);
 document.documentElement.style.setProperty('--accent2',theme[1]);
 document.documentElement.style.setProperty('--glow',theme[2]);
 localStorage.setItem('theme',name);
}

function addBox(){
 totalBoxes++;
 localStorage.setItem('totalBoxes',totalBoxes);
 renderBoxes();
 alert('Boîte ajoutée : Qboite'+totalBoxes+'Q');
}

function removeLastBox(){
 if(totalBoxes<=1){alert('Impossible de supprimer la dernière boîte.');return;}
 if(confirm('Supprimer la boîte '+totalBoxes+' ?')){
  localStorage.removeItem('box'+totalBoxes);
  totalBoxes--;
  localStorage.setItem('totalBoxes',totalBoxes);
  renderBoxes();
 }
}

setTheme(localStorage.getItem('theme')||'purple');
renderBoxes();
