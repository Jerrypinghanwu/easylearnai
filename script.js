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

const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
if (menuToggle && mobileMenu) {
  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') === 'true';
    const next = !open;
    menuToggle.setAttribute('aria-expanded', String(next));
    if (next) {
      mobileMenu.hidden = false;
    } else {
      mobileMenu.hidden = true;
    }
  });

  mobileMenu.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      mobileMenu.hidden = true;
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
  });
}
