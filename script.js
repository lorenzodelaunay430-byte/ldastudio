const text="Ici vous trouverez le bonheur des entrepreneurs"

let i=0

function typeText(){

if(i<text.length){

document.getElementById("intro-text").innerHTML+=text.charAt(i)

i++

setTimeout(typeText,40)

}

}

gsap.to("#intro-title",{opacity:1,duration:1.5})

setTimeout(typeText,1500)

setTimeout(()=>{

document.querySelector(".intro").style.display="none"

},6000)
