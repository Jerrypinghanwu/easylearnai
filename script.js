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

// Register service worker for caching
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}

// Upgrade images to WebP when available
(function () {
  try {
    const canWebP = (() => {
      const c = document.createElement('canvas');
      return c.toDataURL && c.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    })();
    if (!canWebP) return;
    const imgs = document.querySelectorAll('img');
    imgs.forEach(async (img) => {
      const src = img.getAttribute('src');
      if (!src) return;
      const webp = src.replace(/\.(png|jpg|jpeg)$/i, '.webp');
      if (webp === src) return;
      try {
        const res = await fetch(webp, { method: 'HEAD' });
        if (res.ok) img.src = webp;
      } catch {}
    });
  } catch {}
})();

 

// Basic performance metrics
(function () {
  try {
    const po = new PerformanceObserver((list) => {
      list.getEntries().forEach((e) => {
        if (e.entryType === 'largest-contentful-paint') {
          console.log('LCP:', Math.round(e.startTime));
        }
        if (e.entryType === 'layout-shift' && !e.hadRecentInput) {
          console.log('CLS:', e.value);
        }
      });
    });
    po.observe({ type: 'largest-contentful-paint', buffered: true });
    po.observe({ type: 'layout-shift', buffered: true });
  } catch {}
})();
