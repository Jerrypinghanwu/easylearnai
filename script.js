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

// Enhanced scroll reveal for cards and columns
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

// Button ripple effect on click
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.4);
      transform: scale(0);
      animation: ripple 0.6s ease-out;
      pointer-events: none;
    `;
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// Add ripple animation keyframes
const style = document.createElement('style');
style.textContent = `@keyframes ripple { to { transform: scale(4); opacity: 0; } }`;
document.head.appendChild(style);

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
    navigator.serviceWorker.register('sw.js').catch(() => { });
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
      } catch { }
    });
  } catch { }
})();

const newsletterForm = document.getElementById('newsletter-form');
if (newsletterForm) {
  const emailInput = document.getElementById('newsletter-email');
  const submitBtn = document.getElementById('newsletter-submit');
  const feedbackEl = document.getElementById('newsletter-feedback');
  const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const setLoading = (loading) => {
    if (!submitBtn) return;
    submitBtn.disabled = loading;
    submitBtn.textContent = loading ? '訂閱中…' : '立即訂閱';
  };
  const handleSubscribe = async () => {
    const email = emailInput ? emailInput.value.trim() : '';
    if (!isValidEmail(email)) {
      if (feedbackEl) feedbackEl.textContent = '請輸入有效的 Email';
      return;
    }
    setLoading(true);
    if (feedbackEl) feedbackEl.textContent = '';
    try {
      const action = newsletterForm.getAttribute('action') || 'https://app.convertkit.com/forms/8866341/subscriptions';
      const fd = new FormData(newsletterForm);
      // Ensure the email field exists even if name changed
      if (!fd.has('email_address') && email) fd.append('email_address', email);
      const res = await fetch(action, { method: 'POST', body: fd, headers: { 'Accept': 'application/json' } });
      setLoading(false);
      if (res.ok) {
        if (feedbackEl) feedbackEl.textContent = '感謝訂閱！';
        if (emailInput) emailInput.value = '';
      } else {
        if (feedbackEl) feedbackEl.textContent = '送出失敗，請稍後再試';
      }
    } catch {
      setLoading(false);
      if (feedbackEl) feedbackEl.textContent = '送出失敗，請檢查網路連線';
    }
  };
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleSubscribe();
  });
}


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
  } catch { }
})();
