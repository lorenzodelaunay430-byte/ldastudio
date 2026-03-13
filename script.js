const glow=document.querySelector(".cursor-glow")

document.addEventListener("mousemove",e=>{
glow.style.left=e.clientX+"px"
glow.style.top=e.clientY+"px"
})

/* PARTICLES */

const canvas=document.getElementById("particles")
const ctx=canvas.getContext("2d")

canvas.width=window.innerWidth
canvas.height=window.innerHeight

let particles=[]

for(let i=0;i<80;i++){

particles.push({
x:Math.random()*canvas.width,
y:Math.random()*canvas.height,
size:Math.random()*2,
speedX:(Math.random()-0.5)*0.5,
speedY:(Math.random()-0.5)*0.5
})

}

function animateParticles(){

ctx.clearRect(0,0,canvas.width,canvas.height)

particles.forEach(p=>{

p.x+=p.speedX
p.y+=p.speedY

ctx.fillStyle="#6366f1"

ctx.beginPath()
ctx.arc(p.x,p.y,p.size,0,Math.PI*2)
ctx.fill()

})

requestAnimationFrame(animateParticles)

}

animateParticles()

/* INTRO TEXT */

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

gsap.to(".intro",{
opacity:0,
delay:6,
duration:1.5,
onComplete:()=>{
document.querySelector(".intro").style.display="none"
}
})

/* TILT EFFECT */

document.querySelectorAll(".tilt").forEach(card=>{

card.addEventListener("mousemove",e=>{

let rect=card.getBoundingClientRect()

let x=e.clientX-rect.left
let y=e.clientY-rect.top

let rotateX=(y-rect.height/2)/10
let rotateY=(rect.width/2-x)/10

card.style.transform=`rotateX(${rotateX}deg) rotateY(${rotateY}deg)`

})

card.addEventListener("mouseleave",()=>{
card.style.transform="rotateX(0) rotateY(0)"
})

})
