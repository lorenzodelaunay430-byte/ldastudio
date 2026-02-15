// /assets/app.js
document.querySelectorAll('[data-scroll]').forEach(a=>{
  a.addEventListener('click', (e)=>{
    const id = a.getAttribute('data-scroll');
    const el = document.querySelector(id);
    if(!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior:'smooth', block:'start' });
  });
});
