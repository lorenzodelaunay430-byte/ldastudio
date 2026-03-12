const glow = document.querySelector(".cursor-glow")

document.addEventListener("mousemove",e=>{

glow.style.left = e.clientX + "px"
glow.style.top = e.clientY + "px"

})

const cards = document.querySelectorAll(".glass-card")

const observer = new IntersectionObserver(entries=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.style.opacity=1
entry.target.style.transform="translateY(0)"

}

})

})

cards.forEach(card=>{

card.style.opacity=0
card.style.transform="translateY(80px)"
card.style.transition="0.8s"

observer.observe(card)

})
