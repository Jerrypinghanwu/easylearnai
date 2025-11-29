const links = document.querySelectorAll('a[href^="#"]');
links.forEach(l => {
  l.addEventListener('click', e => {
    const id = l.getAttribute('href');
    if (!id || id === '#') return;
    const el = document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

const revealEls = document.querySelectorAll('.card, .col');
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.transform = 'translateY(0)';
      entry.target.style.opacity = '1';
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });
revealEls.forEach(el => {
  el.style.transform = 'translateY(8px)';
  el.style.opacity = '0';
  el.style.transition = 'transform .35s ease, opacity .35s ease';
  io.observe(el);
});
