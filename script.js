(function () {
  'use strict';

  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('#main-nav');
  const menuClose = document.querySelector('.menu-close');
  const menuOverlay = document.querySelector('.menu-overlay');

  function closeMenu() {
    mainNav.classList.remove('is-open');
    menuOverlay.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }

  // اگر هدر در صفحه نباشد (مثلاً صفحه‌ی ساده)، فقط بخش منو کنار گذاشته می‌شود
  if (menuToggle && mainNav && menuClose && menuOverlay) {
    menuToggle.addEventListener('click', function () {
      mainNav.classList.toggle('is-open');
      menuOverlay.classList.toggle('is-open');

      const isOpen = mainNav.classList.contains('is-open');
      menuToggle.setAttribute('aria-expanded', isOpen);
    });

    menuClose.addEventListener('click', closeMenu);
    menuOverlay.addEventListener('click', closeMenu);

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        closeMenu();
      }
    });

    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
  }

  // با اسکرول صفحه، هدر سایه می‌گیرد و جمع‌وجورتر می‌شود
  const siteHeader = document.querySelector('header');

  if (siteHeader) {
    const updateHeader = function () {
      siteHeader.classList.toggle('is-scrolled', window.scrollY > 24);
    };

    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();
  }

  const revealItems = document.querySelectorAll('.reveal');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (revealItems.length && 'IntersectionObserver' in window && !reduceMotion) {
    document.documentElement.classList.add('is-reveal-ready');

    const revealObserver = new IntersectionObserver(function (entries) {
      entries
        .filter(function (entry) {
          return entry.isIntersecting;
        })
        .forEach(function (entry, index) {
          if (entry.target.classList.contains('is-visible')) {
            return;
          }

          entry.target.style.setProperty('--d', index * 120 + 'ms');
          entry.target.classList.add('is-visible');
        });
    }, { threshold: 0.25, rootMargin: '0px 0px -8% 0px' });

    // وقتی عنصر کاملاً از صفحه خارج شد، حالتش بازنشانی می‌شود تا با ورود دوباره انیمیشن تکرار شود
    const resetObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) {
          entry.target.classList.remove('is-visible');
        }
      });
    });

    revealItems.forEach(function (item) {
      revealObserver.observe(item);
      resetObserver.observe(item);
    });
  }

  const categoryCards = document.querySelectorAll('.category-card, .product-media');

  if (categoryCards.length && !reduceMotion) {
    const waterStates = Array.from(categoryCards).map(function (card) {
      return { card: card, target: 0, front: 0, back: 0, frontSpeed: 0, backSpeed: 0 };
    });
    let waterRunning = false;
    let waterLastTime = 0;

    // میزان پر شدن به جای مرکز کارت روی صفحه بستگی دارد:
    // وقتی مرکز کارت در ۹۰٪ ارتفاع صفحه باشد خالی، در وسط نیمه‌پر و در ۱۰٪ کاملاً پر است
    function measureCategoryFill() {
      const viewportHeight = window.innerHeight;
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - viewportHeight;
      const startCenter = viewportHeight * 0.9;

      waterStates.forEach(function (state) {
        const rect = state.card.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const lowestCenter = center + scrollY - maxScroll;
        const endCenter = Math.min(Math.max(viewportHeight * 0.1, lowestCenter + 4), startCenter - 60);
        const progress = Math.min(1, Math.max(0, (startCenter - center) / (startCenter - endCenter)));

        state.target = progress + (progress * progress * (3 - 2 * progress) - progress) * 0.5;
      });
    }

    // هر لایه یک فنر است: با وزن دنبال اسکرول می‌رود، کمی بالاتر می‌زند و مثل آب واقعی آرام می‌گیرد.
    // لایه‌ی پشتی نرم‌تر و کندتر است و کمی زودتر از لایه‌ی جلویی بالا می‌آید.
    function stepSpring(value, speed, target, stiffness, damping, dt) {
      const acceleration = stiffness * (target - value) - damping * speed;
      const nextSpeed = speed + acceleration * dt;
      let nextValue = value + nextSpeed * dt;
      let finalSpeed = nextSpeed;

      if (nextValue < 0 || nextValue > 1) {
        nextValue = Math.min(1, Math.max(0, nextValue));
        finalSpeed = 0;
      }

      return [nextValue, finalSpeed];
    }

    function animateWater(now) {
      const elapsed = waterLastTime ? Math.min(0.05, (now - waterLastTime) / 1000) : 1 / 60;
      const steps = Math.max(1, Math.round(elapsed / (1 / 120)));
      const dt = elapsed / steps;
      let moving = false;

      waterLastTime = now;

      waterStates.forEach(function (state) {
        const backTarget = Math.min(1, state.target + 0.08 * Math.sin(Math.PI * state.target));

        for (let i = 0; i < steps; i++) {
          const front = stepSpring(state.front, state.frontSpeed, state.target, 70, 11, dt);
          const back = stepSpring(state.back, state.backSpeed, backTarget, 38, 8, dt);

          state.front = front[0];
          state.frontSpeed = front[1];
          state.back = back[0];
          state.backSpeed = back[1];
        }

        const frontSettled = Math.abs(state.target - state.front) < 0.0005 && Math.abs(state.frontSpeed) < 0.002;
        const backSettled = Math.abs(backTarget - state.back) < 0.0005 && Math.abs(state.backSpeed) < 0.002;

        if (frontSettled) {
          state.front = state.target;
          state.frontSpeed = 0;
        }

        if (backSettled) {
          state.back = backTarget;
          state.backSpeed = 0;
        }

        if (!frontSettled || !backSettled) {
          moving = true;
        }

        state.card.style.setProperty('--fill', state.front.toFixed(4));
        state.card.style.setProperty('--fill-back', state.back.toFixed(4));
      });

      if (moving) {
        requestAnimationFrame(animateWater);
      } else {
        waterRunning = false;
        waterLastTime = 0;
      }
    }

    function requestCategoryFill() {
      measureCategoryFill();

      if (!waterRunning) {
        waterRunning = true;
        waterLastTime = 0;
        requestAnimationFrame(animateWater);
      }
    }

    window.addEventListener('scroll', requestCategoryFill, { passive: true });
    window.addEventListener('resize', requestCategoryFill);

    measureCategoryFill();
    waterStates.forEach(function (state) {
      state.front = state.target;
      state.back = state.target;
      state.card.style.setProperty('--fill', state.front.toFixed(4));
      state.card.style.setProperty('--fill-back', state.back.toFixed(4));
    });
  }

  // بخش‌هایی که با اسکرول جابه‌جا می‌شوند: تا وقتی بلوک از صفحه رد می‌شود، --p از ۰ به ۱ می‌رسد
  const parallaxBlocks = document.querySelectorAll('[data-parallax]');

  if (parallaxBlocks.length && !reduceMotion) {
    let parallaxTicking = false;

    function updateParallax() {
      const viewportHeight = window.innerHeight;

      parallaxBlocks.forEach(function (block) {
        const rect = block.getBoundingClientRect();

        if (rect.bottom < -200 || rect.top > viewportHeight + 200) {
          return;
        }

        const progress = Math.min(1, Math.max(0, (viewportHeight - rect.top) / (viewportHeight + rect.height)));
        block.style.setProperty('--p', progress.toFixed(3));
      });

      parallaxTicking = false;
    }

    function requestParallax() {
      if (!parallaxTicking) {
        parallaxTicking = true;
        requestAnimationFrame(updateParallax);
      }
    }

    window.addEventListener('scroll', requestParallax, { passive: true });
    window.addEventListener('resize', requestParallax);
    updateParallax();
  }

  // هر بار که عددها وارد صفحه می‌شوند، از ابتدا شمرده می‌شوند
  const counters = document.querySelectorAll('[data-count]');

  if (counters.length && 'IntersectionObserver' in window && !reduceMotion) {
    const counterFrames = new WeakMap();

    function showCount(element, value) {
      element.textContent = Math.round(value).toLocaleString('fa-IR') + (element.dataset.suffix || '');
    }

    function runCount(element, start, end) {
      const startTime = performance.now() + 450;
      const duration = 1800;

      function step(now) {
        const progress = Math.min(1, Math.max(0, (now - startTime) / duration));
        const eased = 1 - Math.pow(1 - progress, 4);

        showCount(element, start + (end - start) * eased);

        if (progress < 1) {
          counterFrames.set(element, requestAnimationFrame(step));
        }
      }

      counterFrames.set(element, requestAnimationFrame(step));
    }

    const counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        const element = entry.target;
        const end = Number(element.dataset.count);
        const start = end * Number(element.dataset.from || 0);

        cancelAnimationFrame(counterFrames.get(element));

        if (entry.isIntersecting) {
          runCount(element, start, end);
        } else {
          showCount(element, start);
        }
      });
    }, { threshold: 0.6 });

    counters.forEach(function (counter) {
      counterObserver.observe(counter);
    });
  }

  // محصولات: بازخورد افزودن به سبد (خود سبد در store.js است) و علاقه‌مندی‌ها
  document.querySelectorAll('.product-add').forEach(function (button) {
    let resetTimer;

    button.addEventListener('click', function () {
      button.classList.add('is-added');
      clearTimeout(resetTimer);
      resetTimer = setTimeout(function () {
        button.classList.remove('is-added');
      }, 1600);
    });
  });

  document.querySelectorAll('.product-wish').forEach(function (button) {
    button.addEventListener('click', function () {
      const active = button.classList.toggle('is-active');
      button.setAttribute('aria-pressed', String(active));
    });
  });

  // خبرنامه: فعلاً فقط سمت کاربر است و سروری برای ارسال اطلاعات وجود ندارد
  const newsletterForm = document.querySelector('.newsletter-form');

  if (newsletterForm) {
    const newsletterInput = newsletterForm.querySelector('.newsletter-input');
    const newsletterNote = newsletterForm.querySelector('.newsletter-note');

    newsletterForm.addEventListener('submit', function (event) {
      event.preventDefault();

      if (!newsletterInput.value.trim()) {
        newsletterNote.textContent = 'لطفاً ایمیل یا شماره‌ی موبایل خود را وارد کنید.';
        newsletterInput.focus();
        return;
      }

      newsletterNote.textContent = 'ممنون! عضویت شما ثبت شد.';
      newsletterForm.reset();
    });
  }

  // نام کاربرِ واردشده روی آیکن حساب کاربری در هدر نشان داده می‌شود (فقط برای نمایش)
  const accountLink = document.querySelector('.header-actions a[href="account.html"]');

  if (accountLink) {
    let accountName = '';

    try {
      const savedUser = JSON.parse(window.localStorage.getItem('darbar-user') || 'null');

      if (savedUser && savedUser.loggedIn && savedUser.name) {
        accountName = savedUser.name;
      }
    } catch (error) {
      accountName = '';
    }

    if (accountName) {
      accountLink.title = 'حساب کاربری: ' + accountName;
      accountLink.setAttribute('aria-label', 'حساب کاربری ' + accountName);
      accountLink.classList.add('is-logged-in');
    } else {
      accountLink.title = 'ورود یا ثبت‌نام';
    }
  }
})();
