```javascript
const cards = document.querySelectorAll(".card")

const observer = new IntersectionObserver(entries => {

entries.forEach(entry => {

if(entry.isIntersecting){

entry.target.style.opacity = 1
entry.target.style.transform = "translateY(0)"

}

})

})

cards.forEach(card=>{

card.style.opacity = 0
card.style.transform = "translateY(60px)"
card.style.transition = "0.9s"

observer.observe(card)

})
```
