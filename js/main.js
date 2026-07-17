/* ============================================================
   MAIN.JS — Core: Navbar, Dark Mode, AOS, Back-to-Top,
             WhatsApp, Toast, Intersection Observer
   ============================================================ */

'use strict';

/* ─── DOM Ready ─────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initNavbar();
  initDarkMode();
  initSearch();
  initMobileNav();
  initBackToTop();
  initAOS();
  initStagger();
  initRippleEffect();
});

/* ─── Loading Screen ─────────────────────────────────────── */
function initLoader() {
  const loader = document.getElementById('loading-screen');
  if (!loader) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 600);
  });

  document.body.style.overflow = 'hidden';
}

/* ─── Navbar ─────────────────────────────────────────────── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const scrollThreshold = 80;

  function updateNavbar() {
    if (window.scrollY > scrollThreshold) {
      navbar.classList.add('scrolled');
      navbar.classList.remove('transparent');
    } else {
      navbar.classList.remove('scrolled');
      navbar.classList.add('transparent');
    }
  }

  updateNavbar();
  window.addEventListener('scroll', updateNavbar, { passive: true });

  // Active link highlighting
  const navLinks = document.querySelectorAll('.nav-link[href]');
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPath || href === '/' + currentPath)) {
      link.classList.add('active');
    }
  });

  // Mobile nav links active state
  const mobileLinks = document.querySelectorAll('.nav-mobile-links a');
  mobileLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPath || href.includes(currentPath))) {
      link.classList.add('active');
    }
  });
}

/* ─── Dark Mode ──────────────────────────────────────────── */
function initDarkMode() {
  const toggle = document.getElementById('dark-mode-toggle');
  const mobileToggle = document.getElementById('dark-mode-toggle-mobile');
  const root = document.documentElement;
  const STORAGE_KEY = 'rmt-theme';

  // Initialize from storage or system preference
  const saved = localStorage.getItem(STORAGE_KEY);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = saved ? saved === 'dark' : prefersDark;

  if (isDark) {
    root.setAttribute('data-theme', 'dark');
    updateToggleIcon(true);
  }

  function toggleDark() {
    const current = root.getAttribute('data-theme');
    const newTheme = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', newTheme);
    localStorage.setItem(STORAGE_KEY, newTheme);
    updateToggleIcon(newTheme === 'dark');
  }

  function updateToggleIcon(dark) {
    const iconHTML = dark
      ? `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`
      : `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;

    if (toggle) toggle.innerHTML = iconHTML;
    if (mobileToggle) mobileToggle.innerHTML = iconHTML;
  }

  if (toggle) toggle.addEventListener('click', toggleDark);
  if (mobileToggle) mobileToggle.addEventListener('click', toggleDark);
}

/* ─── Search Overlay ─────────────────────────────────────── */
function initSearch() {
  const searchBtn  = document.getElementById('search-btn');
  const overlay    = document.getElementById('search-overlay');
  const closeBtn   = document.getElementById('search-close');
  const input      = document.getElementById('search-input');

  if (!searchBtn || !overlay) return;

  searchBtn.addEventListener('click', () => {
    overlay.classList.add('active');
    setTimeout(() => input?.focus(), 100);
  });

  closeBtn?.addEventListener('click', closeSearch);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeSearch();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSearch();
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      overlay.classList.add('active');
      setTimeout(() => input?.focus(), 100);
    }
  });

  function closeSearch() {
    overlay.classList.remove('active');
  }

  // Search input handler
  input?.addEventListener('input', debounce((e) => {
    const query = e.target.value.trim().toLowerCase();
    // Basic search — redirect to doctors page with query
    if (query.length > 2) {
      // Could expand to search doctors/departments
    }
  }, 300));
}

/* ─── Mobile Navigation ───────────────────────────────────── */
function initMobileNav() {
  const hamburger  = document.getElementById('hamburger');
  const mobileNav  = document.getElementById('mobile-nav');
  const mobileClose = document.getElementById('mobile-nav-close');
  const overlay    = document.getElementById('nav-overlay');

  if (!hamburger || !mobileNav) return;

  function openMenu() {
    hamburger.classList.add('active');
    mobileNav.classList.add('open');
    overlay?.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('active');
    mobileNav.classList.remove('open');
    overlay?.classList.remove('show');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', openMenu);
  mobileClose?.addEventListener('click', closeMenu);
  overlay?.addEventListener('click', closeMenu);

  // Close on nav link click
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/* ─── Back to Top ────────────────────────────────────────── */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ─── AOS (Animate On Scroll) ────────────────────────────── */
function initAOS() {
  const elements = document.querySelectorAll('[data-aos]');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.aosDelay || 0;
        const duration = el.dataset.aosDuration || 600;

        el.style.transitionDuration = duration + 'ms';
        el.style.transitionDelay = delay + 'ms';

        setTimeout(() => {
          el.classList.add('aos-animate');
        }, parseInt(delay));

        observer.unobserve(el);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ─── Stagger Animation ───────────────────────────────────── */
function initStagger() {
  const staggerEls = document.querySelectorAll('.stagger');
  if (!staggerEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  staggerEls.forEach(el => observer.observe(el));
}

/* ─── Ripple Effect on Buttons ───────────────────────────── */
function initRippleEffect() {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.classList.add('btn-ripple');
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);

      ripple.classList.add('ripple');
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top  = (e.clientY - rect.top  - size / 2) + 'px';

      this.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });
}

/* ─── Toast Notification System ─────────────────────────── */
const Toast = {
  container: null,

  init() {
    this.container = document.getElementById('toast-container');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'toast-container';
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    }
  },

  show(message, type = 'info', duration = 4000) {
    if (!this.container) this.init();

    const icons = {
      success : '✅',
      error   : '❌',
      warning : '⚠️',
      info    : 'ℹ️'
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${icons[type] || icons.info}</span>
      <span class="toast-msg">${message}</span>
      <button class="toast-close" aria-label="Dismiss">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    `;

    this.container.appendChild(toast);

    const close = () => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    };

    toast.querySelector('.toast-close').addEventListener('click', close);
    setTimeout(close, duration);
  },

  success(msg) { this.show(msg, 'success'); },
  error(msg)   { this.show(msg, 'error'); },
  warning(msg) { this.show(msg, 'warning'); },
  info(msg)    { this.show(msg, 'info'); }
};

// Initialize toast on load
Toast.init();
window.Toast = Toast;

/* ─── FAQ Accordion ──────────────────────────────────────── */
function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    const question = item.querySelector('.faq-question');
    question?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      // Close all
      items.forEach(i => i.classList.remove('active'));
      // Open clicked (toggle)
      if (!isActive) item.classList.add('active');
    });
  });
}

/* ─── Smooth Scroll for anchor links ─────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const navHeight = document.getElementById('navbar')?.offsetHeight || 80;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ─── Utility: Debounce ─────────────────────────────────── */
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/* ─── Utility: Throttle ─────────────────────────────────── */
function throttle(fn, limit) {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/* ─── Utility: Format date ───────────────────────────────── */
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
}

// Expose utilities globally
window.RMT = { Toast, debounce, throttle, formatDate };

// Initialize FAQ and smooth scroll
document.addEventListener('DOMContentLoaded', () => {
  initFAQ();
  initSmoothScroll();
});
