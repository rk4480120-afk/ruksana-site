/* ============================================================
   COUNTER.JS — Animated number counter for statistics section
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', initCounters);

function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el) {
  const target    = parseFloat(el.dataset.counter);
  const suffix    = el.dataset.suffix || '';
  const prefix    = el.dataset.prefix || '';
  const decimals  = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
  const duration  = parseInt(el.dataset.duration) || 2000;
  const start     = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed  = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease     = easeOutQuart(progress);
    const value    = start + (target - start) * ease;

    el.textContent = prefix + formatNumber(value, decimals) + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = prefix + formatNumber(target, decimals) + suffix;
    }
  }

  requestAnimationFrame(update);
}

function easeOutQuart(t) {
  return 1 - Math.pow(1 - t, 4);
}

function formatNumber(num, decimals) {
  if (decimals > 0) return num.toFixed(decimals);
  return Math.floor(num).toLocaleString('en-IN');
}
