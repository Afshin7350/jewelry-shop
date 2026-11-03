(function () {
  'use strict';

  const hero = document.querySelector('.hero');

  if (hero && hero.querySelector('.hero-slide') && hero.querySelector('.hero-dots')) {
    const slides = Array.from(hero.querySelectorAll('.hero-slide'));
    const dotsBox = hero.querySelector('.hero-dots');
    const prevButton = hero.querySelector('.hero-prev');
    const nextButton = hero.querySelector('.hero-next');
    const dots = [];

    let current = 0;
    let cleanupTimer;

    function goTo(index) {
      const nextIndex = (index + slides.length) % slides.length;

      if (nextIndex === current) {
        return;
      }

      const leaving = slides[current];
      const entering = slides[nextIndex];

      slides.forEach(function (slide) {
        slide.classList.remove('is-prev');
      });

      leaving.classList.remove('is-active');
      leaving.classList.add('is-prev');
      leaving.setAttribute('aria-hidden', 'true');

      entering.classList.add('is-active');
      entering.removeAttribute('aria-hidden');

      dots[current].classList.remove('is-active');
      dots[current].removeAttribute('aria-current');
      dots[nextIndex].classList.add('is-active');
      dots[nextIndex].setAttribute('aria-current', 'true');

      clearTimeout(cleanupTimer);
      cleanupTimer = setTimeout(function () {
        leaving.classList.remove('is-prev');
      }, 1600);

      current = nextIndex;
    }

    function next() {
      goTo(current + 1);
    }

    function prev() {
      goTo(current - 1);
    }

    slides.forEach(function (slide, index) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'hero-dot';
      dot.setAttribute('aria-label', 'اسلاید ' + (index + 1));
      dot.innerHTML = '<span class="hero-dot-track"><i></i></span>';
      dot.addEventListener('click', function () {
        goTo(index);
      });
      dotsBox.append(dot);
      dots.push(dot);

      slide.setAttribute('aria-label', (index + 1) + ' از ' + slides.length);

      if (index !== 0) {
        slide.setAttribute('aria-hidden', 'true');
      }
    });

    dots[0].classList.add('is-active');
    dots[0].setAttribute('aria-current', 'true');

    nextButton.addEventListener('click', next);
    prevButton.addEventListener('click', prev);

    // پخش خودکار: وقتی نوار پیشرفتِ نقطه‌ی فعال تمام شد، اسلاید بعدی نمایش داده می‌شود
    hero.addEventListener('animationend', function (event) {
      if (event.animationName === 'hero-fill') {
        next();
      }
    });

    // صفحه‌کلید: چون صفحه راست‌به‌چپ است، فلش چپ یعنی «بعدی»
    hero.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowLeft') {
        next();
      } else if (event.key === 'ArrowRight') {
        prev();
      }
    });

    // کشیدن انگشت روی صفحه‌ی لمسی
    let touchStartX = null;

    hero.addEventListener('touchstart', function (event) {
      touchStartX = event.touches[0].clientX;
    }, { passive: true });

    hero.addEventListener('touchend', function (event) {
      if (touchStartX === null) {
        return;
      }

      const distance = event.changedTouches[0].clientX - touchStartX;
      touchStartX = null;

      if (Math.abs(distance) < 50) {
        return;
      }

      if (distance > 0) {
        next();
      } else {
        prev();
      }
    });
  }
})();
