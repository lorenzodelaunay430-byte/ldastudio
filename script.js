const glow=document.querySelector(".cursor-glow")

document.addEventListener("mousemove",e=>{

glow.style.left=e.clientX+"px"
glow.style.top=e.clientY+"px"

})

const text="Ici vous trouverez le bonheur des entrepreneurs"

let i=0

function typeText(){

if(i<text.length){

document.getElementById("intro-text").innerHTML+=text.charAt(i)

i++

setTimeout(typeText,40)

}

}

typeText()

setTimeout(()=>{

document.querySelector(".intro").style.display="none"

},5000)
