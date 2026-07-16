/* ============================================================
   HERO.JS — Hero parallax, floating doctor card,
             animated text, scroll indicator
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initParallax();
  initTypewriter();
  initHeroCardTilt();
});

/* ─── Parallax Effect ────────────────────────────────────── */
function initParallax() {
  const heroBg = document.querySelector('.hero-bg');
  if (!heroBg) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrolled = window.scrollY;
        const rate = scrolled * 0.4;
        heroBg.style.transform = `translateY(${rate}px)`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ─── Typewriter Effect ──────────────────────────────────── */
function initTypewriter() {
  const el = document.querySelector('.typewriter');
  if (!el) return;

  const words = ['Innovation', 'Excellence', 'Compassion', 'Healing'];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let isPaused = false;

  function type() {
    const currentWord = words[wordIndex];

    if (!isDeleting) {
      el.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentWord.length) {
        isPaused = true;
        setTimeout(() => {
          isPaused = false;
          isDeleting = true;
          type();
        }, 2000);
        return;
      }
    } else {
      el.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
      }
    }

    const speed = isDeleting ? 60 : 100;
    if (!isPaused) setTimeout(type, speed);
  }

  type();
}

/* ─── Hero Card Mouse Tilt ────────────────────────────────── */
function initHeroCardTilt() {
  const card = document.querySelector('.hero-doctor-card');
  if (!card) return;

  // Disable on mobile
  if (window.innerWidth < 768) return;

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const midX = rect.width / 2;
    const midY = rect.height / 2;
    const rotateX = ((y - midY) / midY) * -8;
    const rotateY = ((x - midX) / midX) * 8;

    card.style.transform = `
      translateY(-12px) 
      rotateX(${rotateX}deg) 
      rotateY(${rotateY}deg)
      scale(1.02)
    `;
    card.style.transition = 'transform 0.1s linear';
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s ease';
    setTimeout(() => {
      card.style.transition = '';
    }, 500);
  });
}
