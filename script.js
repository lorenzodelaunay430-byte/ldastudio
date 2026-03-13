const introText="Ici vous trouverez le bonheur des entrepreneurs"

let i=0

function typeIntro(){

if(i<introText.length){

document.getElementById("introText").innerHTML+=introText.charAt(i)

i++

setTimeout(typeIntro,40)

}

}

typeIntro()

setTimeout(()=>{

document.querySelector(".intro").style.display="none"

},4000)

function animateValue(id,end){

let el=document.getElementById(id)

let count=0

let interval=setInterval(()=>{

count++

el.innerText=count

if(count>=end){

clearInterval(interval)

}

},20)

}

animateValue("sitesCount",50)
animateValue("clientsCount",30)
animateValue("satisfactionCount",100)

function calculatePrice(){

let pages=document.getElementById("pages").value*1
let seo=document.getElementById("seo").value*1

let total=pages+seo

document.getElementById("priceResult").innerText="Prix estimé : "+total+"€"

}

document.getElementById("themeToggle").onclick=function(){

document.body.classList.toggle("dark")

}
