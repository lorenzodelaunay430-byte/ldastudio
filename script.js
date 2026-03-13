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

document.getEle
