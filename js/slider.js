/* ============================================================
   SLIDER.JS — Testimonials slider with autoplay,
               touch swipe, dots & arrow controls
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initTestimonialsSlider();
});

function initTestimonialsSlider() {
  const track   = document.getElementById('testimonials-track');
  const dotsWrap = document.getElementById('slider-dots');
  const prevBtn  = document.getElementById('slider-prev');
  const nextBtn  = document.getElementById('slider-next');

  if (!track) return;

  const cards = Array.from(track.querySelectorAll('.testimonial-card'));
  if (!cards.length) return;

  let current    = 0;
  let autoplayTimer;
  let touchStartX = 0;
  let touchEndX   = 0;

  function getSlidesPerView() {
    if (window.innerWidth < 768) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  }

  function getMaxIndex() {
    return Math.max(0, cards.length - getSlidesPerView());
  }

  function getCardWidth() {
    const gap = 24; // --space-6
    const containerWidth = track.parentElement.offsetWidth;
    const perView = getSlidesPerView();
    return (containerWidth - (gap * (perView - 1))) / perView;
  }

  function updateSlider() {
    const gap = 24;
    const cardWidth = getCardWidth();

    cards.forEach(card => {
      card.style.minWidth = cardWidth + 'px';
    });

    const offset = current * (cardWidth + gap);
    track.style.transform = `translateX(-${offset}px)`;

    // Update dots
    if (dotsWrap) {
      Array.from(dotsWrap.children).forEach((dot, i) => {
        dot.classList.toggle('active', i === current);
      });
    }

    // Update button states
    if (prevBtn) prevBtn.disabled = current === 0;
    if (nextBtn) nextBtn.disabled = current >= getMaxIndex();
  }

  function goTo(index) {
    current = Math.max(0, Math.min(index, getMaxIndex()));
    updateSlider();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAutoplay() {
    autoplayTimer = setInterval(() => {
      if (current >= getMaxIndex()) {
        goTo(0);
      } else {
        next();
      }
    }, 5000);
  }

  function stopAutoplay() {
    clearInterval(autoplayTimer);
  }

  // Create dots
  if (dotsWrap) {
    const totalDots = getMaxIndex() + 1;
    for (let i = 0; i < totalDots; i++) {
      const dot = document.createElement('button');
      dot.className = `slider-dot${i === 0 ? ' active' : ''}`;
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => {
        goTo(i);
        stopAutoplay();
        startAutoplay();
      });
      dotsWrap.appendChild(dot);
    }
  }

  // Event listeners
  prevBtn?.addEventListener('click', () => {
    prev();
    stopAutoplay();
    startAutoplay();
  });

  nextBtn?.addEventListener('click', () => {
    next();
    stopAutoplay();
    startAutoplay();
  });

  // Touch / swipe support
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoplay();
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const delta = touchStartX - touchEndX;

    if (Math.abs(delta) > 50) {
      if (delta > 0) next(); else prev();
    }

    startAutoplay();
  }, { passive: true });

  // Pause autoplay on hover
  track.addEventListener('mouseenter', stopAutoplay);
  track.addEventListener('mouseleave', startAutoplay);

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    const section = document.getElementById('testimonials');
    if (!section) return;
    const rect = section.getBoundingClientRect();
    if (rect.top > window.innerHeight || rect.bottom < 0) return;

    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });

  // Resize handler
  window.addEventListener('resize', window.RMT?.debounce
    ? window.RMT.debounce(updateSlider, 200)
    : updateSlider
  );

  // Initialize
  updateSlider();
  startAutoplay();
}
