const boxesContainer = document.getElementById("boxes");
const result = document.getElementById("result");
const input = document.getElementById("scanInput");

let boxes = [];

for(let i=1;i<=48;i++){

let savedState = localStorage.getItem("box"+i) || "Disponible";

boxes.push({
id:i,
code:`Qboite${i}Q`,
etat:savedState
});
}

function updateStats(){
let indispo = boxes.filter(b => b.etat === "Indisponible").length;
document.getElementById("indispoCount").innerText = indispo;
}

function statusClass(etat){
if(etat === "Disponible") return "disponible";
if(etat === "Stock faible") return "faible";
return "indispo";
}

function renderBoxes(){

boxesContainer.innerHTML = "";

boxes.forEach(box=>{

boxesContainer.innerHTML += `
<div class="box">
<h3>Boîte ${box.id}</h3>
<p>${box.code}</p>
<span class="status ${statusClass(box.etat)}">${box.etat}</span>
</div>
`;

});

updateStats();
}

renderBoxes();

input.addEventListener("change",()=>{

let value = input.value.trim();

let found = boxes.find(b => b.code.toLowerCase() === value.toLowerCase());

if(found){

result.innerHTML = `
<div class="result-card">
<h2>Boîte ${found.id} trouvée</h2>

<p><strong>Code :</strong> ${found.code}</p>
<p><strong>Emplacement :</strong> Atelier H</p>
<p><strong>Quantité :</strong> 1</p>

<label>Modifier l'état :</label><br>

<select id="etatSelect">
<option ${found.etat==="Disponible"?"selected":""}>Disponible</option>
<option ${found.etat==="Stock faible"?"selected":""}>Stock faible</option>
<option ${found.etat==="Indisponible"?"selected":""}>Indisponible</option>
</select>

<button class="save-btn" onclick="saveState(${found.id})">Sauvegarder</button>

</div>
`;

}else{

result.innerHTML = `
<div class="result-card" style="border-color:red">
<h2>Boîte introuvable</h2>
</div>
`;

}

input.value = "";

});

function saveState(id){

let select = document.getElementById("etatSelect");

let box = boxes.find(b=>b.id===id);

box.etat = select.value;

localStorage.setItem("box"+id,select.value);

renderBoxes();

alert("État sauvegardé !");

}
