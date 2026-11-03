(function () {
  const STORAGE_KEY = 'darbar-cart';
  const MAX_QTY = 10;

  const categories = {
    rings: { label: 'انگشتر', from: '#f3f6fc', to: '#c9d7ee', accent: '#9a6b12' },
    'gem-rings': { label: 'انگشتر نگین‌دار', from: '#f6f4fd', to: '#cfc8ee', accent: '#34308f' },
    necklaces: { label: 'گردنبند', from: '#f1f8f3', to: '#bfdcc9', accent: '#0c6b4b' },
    earrings: { label: 'گوشواره', from: '#f4f6f9', to: '#d2d9e4', accent: '#9c4f45' },
    bracelets: { label: 'دستبند', from: '#fff8f0', to: '#f4cfc4', accent: '#9b1c3c' },
    sets: { label: 'سرویس طلا', from: '#f8f0fc', to: '#d9bde8', accent: '#7a2a8f' }
  };

  const products = [
    { id: 1, cat: 'rings', name: 'انگشتر سولیتر الماس', spec: 'طلای ۱۸ عیار · ۳٫۲ گرم', price: 48500000, badge: 'پرفروش', img: 'ring', alt: 'انگشتر طلای سولیتر با الماس درشت' },
    { id: 2, cat: 'necklaces', name: 'گردنبند زمرد و الماس', spec: 'طلای ۱۸ عیار · ۵٫۸ گرم', price: 62900000, badge: 'جدید', img: 'necklace', alt: 'گردنبند طلا با آویز زمرد و حلقه‌ی الماس' },
    { id: 3, cat: 'earrings', name: 'گوشواره مروارید رزگلد', spec: 'رزگلد ۱۸ عیار · ۴٫۱ گرم', price: 27800000, badge: 'پرفروش', img: 'earrings', alt: 'گوشواره‌ی آویز رزگلد با الماس و مروارید سفید' },
    { id: 4, cat: 'bracelets', name: 'دستبند یاقوت سرخ', spec: 'طلای ۱۸ عیار · ۹٫۵ گرم', price: 94300000, badge: 'جدید', img: 'bangle', alt: 'دستبند طلای کنده‌کاری‌شده با یاقوت سرخ و الماس' },
    { id: 5, cat: 'gem-rings', name: 'انگشتر یاقوت کبود هاله‌دار', spec: 'طلای سفید ۱۸ عیار · ۴٫۰ گرم', price: 44900000, badge: '', img: 'sapphire-ring', alt: 'انگشتر طلای سفید با یاقوت کبود بیضی و هاله‌ی الماس' },
    { id: 6, cat: 'rings', name: 'انگشتر تک‌نگین برلیان', spec: 'طلای ۱۸ عیار · ۲٫۶ گرم', price: 36200000, badge: '', img: 'ring-brilliant', alt: 'انگشتر تک‌نگین برلیان با نگین الماس گرد' },
    { id: 7, cat: 'necklaces', name: 'گردنبند آویز زمرد', spec: 'طلای ۱۸ عیار · ۳٫۹ گرم', price: 21400000, badge: '', img: 'necklace-emerald-pendant', alt: 'گردنبند طلا با آویز زمرد تراش امرالد در قاب طلایی' },
    { id: 8, cat: 'earrings', name: 'گوشواره حلقه‌ای الماس', spec: 'رزگلد ۱۸ عیار · ۳٫۳ گرم', price: 33600000, badge: 'جدید', img: 'earrings-diamond-hoop', alt: 'گوشواره حلقه‌ای رزگلد با ردیف نگین‌های الماس' },
    { id: 9, cat: 'bracelets', name: 'دستبند کنده‌کاری سنتی', spec: 'طلای ۱۸ عیار · ۱۲٫۱ گرم', price: 41700000, badge: '', img: 'bangle-engraved', alt: 'دستبند النگویی طلا با کنده‌کاری سنتی گل و برگ' },
    { id: 10, cat: 'gem-rings', name: 'انگشتر زمرد تراش امرالد', spec: 'طلای ۱۸ عیار · ۴٫۸ گرم', price: 39500000, badge: 'جدید', img: 'ring-emerald', alt: 'انگشتر طلا با زمرد مستطیلی تراش امرالد و الماس در دو سوی نگین' },
    { id: 11, cat: 'sets', name: 'سرویس مروارید و رزگلد', spec: 'رزگلد ۱۸ عیار · ۱۸٫۵ گرم', price: 118000000, badge: '', img: 'set-pearl-rosegold', alt: 'سرویس رزگلد شامل گردنبند، گوشواره و انگشتر با مروارید سفید' },
    { id: 12, cat: 'sets', name: 'سرویس زمرد و الماس', spec: 'طلای ۱۸ عیار · ۲۴٫۲ گرم', price: 142000000, badge: 'پرفروش', img: 'set-emerald-diamond', alt: 'سرویس طلا شامل گردنبند، گوشواره و انگشتر با زمرد و هاله‌ی الماس' }
  ];

  const searchConfig = {
    popular: ['الماس', 'زمرد', 'مروارید', 'یاقوت', 'رزگلد', 'سرویس طلا'],
    banner: {
      image: 'images/set-pearl-rosegold.webp',
      imageAlt: 'سرویس رزگلد با مروارید سفید',
      eyebrow: 'ویژه‌ی عروس',
      title: 'درخشان‌ترین شب زندگی، با طلای دربار',
      cta: 'مشاهده‌ی سرویس‌ها',
      badge: 'پیشنهاد ویژه',
      href: 'shop.html?category=sets',
      from: '#f8f0fc',
      to: '#d9bde8',
      accent: '#7a2a8f'
    }
  };

  const COUPON_KEY = 'darbar-coupon';
  const FREE_SHIPPING_FROM = 50000000;

  const shippingMethods = {
    standard: { label: 'پست پیشتاز بیمه‌شده', eta: '۲ تا ۵ روز کاری', price: 180000 },
    express: { label: 'ارسال سریع با پیک', eta: 'همان روز در تهران، ۲ روز در سایر شهرها', price: 450000 },
    pickup: { label: 'تحویل حضوری از فروشگاه', eta: 'آماده‌ی تحویل در ۲۴ ساعت', price: 0 }
  };

  const coupons = {
    DARBAR10: { label: '۱۰٪ تخفیف (تا سقف ۱۰ میلیون تومان)', type: 'percent', value: 10, max: 10000000, min: 0 },
    WELCOME: { label: '۲ میلیون تومان تخفیف', type: 'fixed', value: 2000000, min: 20000000 },
    FREESHIP: { label: 'ارسال پستی رایگان', type: 'shipping', value: 0, min: 0 }
  };

  function format(number) {
    return number.toLocaleString('fa-IR');
  }

  function normalize(text) {
    return String(text)
      .toLowerCase()
      .replace(/ي/g, 'ی')
      .replace(/ك/g, 'ک')
      .replace(/[٠-٩]/g, function (digit) {
        return String(digit.charCodeAt(0) - 1632);
      })
      .replace(/[۰-۹]/g, function (digit) {
        return String(digit.charCodeAt(0) - 1776);
      })
      .replace(/\u200c/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function findProduct(id) {
    return products.find(function (product) {
      return product.id === id;
    });
  }

  function icon(paths, size) {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + paths + '</svg>';
  }

  const icons = {
    close: icon('<path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>', 22),
    search: icon('<circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path>', 22),
    bag: icon('<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path>', 44),
    trash: icon('<path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>', 18),
    plus: icon('<path d="M5 12h14"></path><path d="M12 5v14"></path>', 16),
    minus: icon('<path d="M5 12h14"></path>', 16),
    arrow: icon('<path d="m15 18-6-6 6-6"></path>', 18),
    trend: icon('<path d="M22 7 13.5 15.5l-5-5L2 17"></path><path d="M16 7h6v6"></path>', 16)
  };

  function loadCart() {
    try {
      const raw = JSON.parse(window.localStorage.getItem(STORAGE_KEY));

      if (!Array.isArray(raw)) {
        return [];
      }

      return raw
        .filter(function (line) {
          return line && findProduct(line.id) && Number.isInteger(line.qty) && line.qty > 0;
        })
        .map(function (line) {
          return { id: line.id, qty: Math.min(MAX_QTY, line.qty), size: typeof line.size === 'string' ? line.size : '' };
        });
    } catch (error) {
      return [];
    }
  }

  let cart = loadCart();

  function saveCart() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      // ممکن است ذخیره‌سازی مسدود باشد (حالت خصوصی)؛ در این صورت سبد فقط در همین صفحه می‌ماند
    }
  }

  function cartCount() {
    return cart.reduce(function (sum, line) {
      return sum + line.qty;
    }, 0);
  }

  function cartTotal() {
    return cart.reduce(function (sum, line) {
      return sum + findProduct(line.id).price * line.qty;
    }, 0);
  }

  const root = document.documentElement;
  const badges = document.querySelectorAll('.cart-count');
  const searchButton = document.querySelector('.header-actions [aria-label="جستجو"]');
  const cartButton = document.querySelector('.header-actions [aria-label="سبد خرید"]');

  const overlay = document.createElement('div');

  overlay.className = 'panel-overlay';
  overlay.hidden = true;

  const cartPanel = document.createElement('aside');

  cartPanel.className = 'cart-panel';
  cartPanel.id = 'cart-panel';
  cartPanel.setAttribute('role', 'dialog');
  cartPanel.setAttribute('aria-modal', 'true');
  cartPanel.setAttribute('aria-label', 'سبد خرید');
  cartPanel.innerHTML =
    '<div class="cart-head">' +
      '<h2 class="cart-title">سبد خرید <span class="cart-title-count"></span></h2>' +
      '<button type="button" class="panel-close" aria-label="بستن سبد خرید">' + icons.close + '</button>' +
    '</div>' +
    '<div class="cart-body">' +
      '<ul class="cart-items"></ul>' +
      '<div class="cart-empty">' + icons.bag +
        '<p>سبد خرید شما خالی است.</p>' +
        '<a href="shop.html" class="cart-shop-link">مشاهده‌ی محصولات</a>' +
      '</div>' +
    '</div>' +
    '<div class="cart-foot">' +
      '<div class="cart-total"><span>جمع کل</span><strong class="cart-total-value"></strong></div>' +
      '<p class="cart-note" role="status">هزینه‌ی ارسال و تخفیف در مرحله‌ی بعد محاسبه می‌شود.</p>' +
      '<a href="checkout.html" class="cart-checkout">ادامه و تکمیل خرید</a>' +
      '<a href="cart.html" class="cart-view">مشاهده‌ی صفحه‌ی سبد خرید</a>' +
      '<button type="button" class="cart-clear">خالی کردن سبد</button>' +
    '</div>';

  const searchPanel = document.createElement('div');

  searchPanel.className = 'search-panel';
  searchPanel.id = 'search-panel';
  searchPanel.setAttribute('role', 'dialog');
  searchPanel.setAttribute('aria-modal', 'true');
  searchPanel.setAttribute('aria-label', 'جستجو در محصولات');

  const tags = Object.keys(categories)
    .map(function (key) {
      return '<a href="shop.html?category=' + key + '">' + categories[key].label + '</a>';
    })
    .join('');

  const popularHtml = searchConfig.popular.length
    ? '<p class="search-label">' + icons.trend + 'جستجوهای پرطرفدار</p><div class="search-popular">' +
        searchConfig.popular
          .map(function (term, index) {
            return '<button type="button" class="search-term" data-term="' + term + '"><b>' + format(index + 1) + '</b>' + term + '</button>';
          })
          .join('') +
      '</div>'
    : '';

  const banner = searchConfig.banner;
  const bannerHtml = banner
    ? '<a class="search-banner" href="' + banner.href + '" style="--cat-from: ' + banner.from + '; --cat-to: ' + banner.to + '; --cat-accent: ' + banner.accent + ';">' +
        '<span class="search-banner-text">' +
          '<small>' + banner.eyebrow + '</small>' +
          '<strong>' + banner.title + '</strong>' +
          '<span class="search-banner-cta">' + banner.cta + icons.arrow + '</span>' +
        '</span>' +
        '<span class="search-banner-media">' +
          '<img src="' + banner.image + '" alt="' + banner.imageAlt + '" width="1000" height="1000" loading="lazy">' +
          (banner.badge ? '<em>' + banner.badge + '</em>' : '') +
        '</span>' +
      '</a>'
    : '';

  searchPanel.innerHTML =
    '<div class="search-box">' +
      '<form class="search-form" role="search" action="shop.html" method="get">' +
        icons.search +
        '<input type="search" name="q" class="search-input" placeholder="جستجوی انگشتر، گردنبند، گوشواره…" aria-label="جستجو در محصولات" autocomplete="off">' +
        '<button type="button" class="panel-close" aria-label="بستن جستجو">' + icons.close + '</button>' +
      '</form>' +
      '<div class="search-suggest">' +
        '<p class="search-label">دسته‌بندی‌ها</p><div class="search-tags">' + tags + '</div>' +
        popularHtml +
        bannerHtml +
      '</div>' +
      '<ul class="search-results"></ul>' +
      '<p class="search-status" role="status" aria-live="polite"></p>' +
      '<a class="search-all" href="shop.html" hidden><span></span>' + icons.arrow + '</a>' +
    '</div>';

  document.body.append(overlay, cartPanel, searchPanel);

  const cartList = cartPanel.querySelector('.cart-items');
  const cartEmpty = cartPanel.querySelector('.cart-empty');
  const cartFoot = cartPanel.querySelector('.cart-foot');
  const cartTitleCount = cartPanel.querySelector('.cart-title-count');
  const cartTotalValue = cartPanel.querySelector('.cart-total-value');
  const cartNote = cartPanel.querySelector('.cart-note');
  const cartNoteDefault = cartNote.textContent;

  const searchInput = searchPanel.querySelector('.search-input');
  const searchForm = searchPanel.querySelector('.search-form');
  const searchSuggest = searchPanel.querySelector('.search-suggest');
  const searchResults = searchPanel.querySelector('.search-results');
  const searchStatus = searchPanel.querySelector('.search-status');
  const searchAll = searchPanel.querySelector('.search-all');

  function updateBadges(bump) {
    const count = cartCount();
    const text = count > 99 ? format(99) + '+' : format(count);

    badges.forEach(function (badge) {
      badge.textContent = text;
      badge.classList.toggle('is-empty', count === 0);

      if (bump) {
        badge.classList.remove('is-bump');
        void badge.offsetWidth;
        badge.classList.add('is-bump');
      }
    });

    if (cartButton) {
      cartButton.setAttribute('aria-label', count ? 'سبد خرید، ' + format(count) + ' کالا' : 'سبد خرید');
    }
  }

  function renderCart() {
    const count = cartCount();

    cartList.innerHTML = cart
      .map(function (line) {
        const product = findProduct(line.id);

        return '<li class="cart-item" data-id="' + product.id + '" data-size="' + line.size + '">' +
          '<img class="cart-item-img" src="images/' + product.img + '.webp" alt="' + product.alt + '" width="1000" height="1000" loading="lazy" style="--cat-from: ' + categories[product.cat].from + '; --cat-to: ' + categories[product.cat].to + ';">' +
          '<div class="cart-item-info">' +
            '<h3 class="cart-item-name"><a href="product.html?id=' + product.id + '">' + product.name + '</a></h3>' +
            '<p class="cart-item-spec">' + product.spec + (line.size ? ' · سایز ' + format(Number(line.size)) : '') + '</p>' +
            '<p class="cart-item-price"><strong>' + format(product.price * line.qty) + '</strong> تومان</p>' +
          '</div>' +
          '<div class="cart-item-actions">' +
            '<div class="cart-qty">' +
              '<button type="button" data-act="inc" aria-label="افزایش تعداد"' + (line.qty >= MAX_QTY ? ' disabled' : '') + '>' + icons.plus + '</button>' +
              '<span aria-label="تعداد">' + format(line.qty) + '</span>' +
              '<button type="button" data-act="dec" aria-label="کاهش تعداد"' + (line.qty <= 1 ? ' disabled' : '') + '>' + icons.minus + '</button>' +
            '</div>' +
            '<button type="button" class="cart-remove" data-act="remove" aria-label="حذف ' + product.name + ' از سبد">' + icons.trash + '</button>' +
          '</div>' +
        '</li>';
      })
      .join('');

    cartEmpty.hidden = count > 0;
    cartList.hidden = count === 0;
    cartFoot.hidden = count === 0;
    cartTitleCount.textContent = count ? '(' + format(count) + ')' : '';
    cartTotalValue.textContent = format(cartTotal()) + ' تومان';
    cartNote.textContent = cartNoteDefault;
  }

  const listeners = [];

  function notify() {
    listeners.forEach(function (listener) {
      listener();
    });
  }

  function commit(bump) {
    saveCart();
    updateBadges(bump);
    renderCart();
    notify();
  }

  function readCoupon() {
    try {
      const code = window.localStorage.getItem(COUPON_KEY);

      return code && coupons[code] ? code : '';
    } catch (error) {
      return '';
    }
  }

  let couponCode = readCoupon();

  function writeCoupon(code) {
    couponCode = code;

    try {
      if (code) {
        window.localStorage.setItem(COUPON_KEY, code);
      } else {
        window.localStorage.removeItem(COUPON_KEY);
      }
    } catch (error) {
      // ممکن است ذخیره‌سازی مسدود باشد؛ در این صورت کد تخفیف فقط در همین صفحه می‌ماند
    }

    notify();
  }

  function applyCoupon(raw) {
    const code = normalize(raw).toUpperCase().replace(/\s/g, '');
    const coupon = coupons[code];

    if (!code) {
      return { ok: false, message: 'کد تخفیف را وارد کنید.' };
    }

    if (!coupon) {
      return { ok: false, message: 'این کد تخفیف معتبر نیست.' };
    }

    if (cartTotal() < coupon.min) {
      return { ok: false, message: 'این کد برای خرید بالای ' + format(coupon.min) + ' تومان قابل استفاده است.' };
    }

    writeCoupon(code);

    return { ok: true, message: 'کد تخفیف اعمال شد: ' + coupon.label + '.' };
  }

  function summary(method) {
    const subtotal = cartTotal();
    const coupon = couponCode ? coupons[couponCode] : null;
    const couponActive = Boolean(coupon) && subtotal >= coupon.min;
    const chosen = shippingMethods[method] ? method : 'standard';
    let discount = 0;
    let freeShipCoupon = false;

    if (couponActive) {
      if (coupon.type === 'percent') {
        discount = Math.min(coupon.max, Math.floor(subtotal * coupon.value / 100));
      } else if (coupon.type === 'fixed') {
        discount = Math.min(coupon.value, subtotal);
      } else {
        freeShipCoupon = true;
      }
    }

    const payable = subtotal - discount;
    let shipping = shippingMethods[chosen].price;

    if (subtotal === 0 || (chosen === 'standard' && (payable >= FREE_SHIPPING_FROM || freeShipCoupon))) {
      shipping = 0;
    }

    return {
      count: cartCount(),
      subtotal: subtotal,
      discount: discount,
      shipping: shipping,
      total: payable + shipping,
      method: chosen,
      couponCode: couponCode,
      coupon: coupon,
      couponActive: couponActive,
      freeFrom: FREE_SHIPPING_FROM,
      freeRemaining: Math.max(0, FREE_SHIPPING_FROM - payable)
    };
  }

  function addToCart(id, qty, size) {
    const amount = Math.max(1, Math.floor(qty) || 1);
    const lineSize = size ? String(size) : '';
    const line = cart.find(function (entry) {
      return entry.id === id && entry.size === lineSize;
    });

    if (!findProduct(id)) {
      return;
    }

    if (line) {
      line.qty = Math.min(MAX_QTY, line.qty + amount);
    } else {
      cart.push({ id: id, qty: Math.min(MAX_QTY, amount), size: lineSize });
    }

    commit(true);
  }

  function setQty(id, size, qty) {
    cart = cart
      .map(function (line) {
        return line.id === id && line.size === size ? { id: id, size: size, qty: Math.min(MAX_QTY, qty) } : line;
      })
      .filter(function (line) {
        return line.qty > 0;
      });

    commit(false);
  }

  let openPanel = null;
  let lastFocus = null;

  function openPanelFor(panel, focusTarget) {
    if (openPanel === panel) {
      return;
    }

    if (openPanel) {
      closePanel(true);
    }

    lastFocus = document.activeElement;
    openPanel = panel;
    overlay.hidden = false;
    void overlay.offsetWidth;
    overlay.classList.add('is-open');
    panel.classList.add('is-open');
    root.classList.add('has-panel');

    if (panel === cartPanel && cartButton) {
      cartButton.setAttribute('aria-expanded', 'true');
    }

    window.setTimeout(function () {
      if (focusTarget) {
        focusTarget.focus({ preventScroll: true });
      }
    }, 60);
  }

  function closePanel(keepFocus) {
    if (!openPanel) {
      return;
    }

    openPanel.classList.remove('is-open');
    overlay.classList.remove('is-open');
    root.classList.remove('has-panel');

    if (cartButton) {
      cartButton.setAttribute('aria-expanded', 'false');
    }

    openPanel = null;

    window.setTimeout(function () {
      if (!openPanel) {
        overlay.hidden = true;
      }
    }, 350);

    if (!keepFocus && lastFocus && lastFocus.focus) {
      lastFocus.focus({ preventScroll: true });
    }
  }

  function renderSearch() {
    const raw = searchInput.value;
    const query = normalize(raw);

    if (!query) {
      searchResults.innerHTML = '';
      searchStatus.textContent = '';
      searchAll.hidden = true;
      searchSuggest.hidden = false;
      return;
    }

    const matches = products.filter(function (product) {
      return normalize(product.name + ' ' + product.spec + ' ' + categories[product.cat].label).indexOf(query) !== -1;
    });

    searchSuggest.hidden = true;
    searchResults.innerHTML = matches
      .slice(0, 5)
      .map(function (product) {
        return '<li><a class="search-result" href="product.html?id=' + product.id + '">' +
          '<img src="images/' + product.img + '.webp" alt="' + product.alt + '" width="1000" height="1000" loading="lazy" style="--cat-from: ' + categories[product.cat].from + '; --cat-to: ' + categories[product.cat].to + ';">' +
          '<span class="search-result-info">' +
            '<strong>' + product.name + '</strong>' +
            '<small>' + categories[product.cat].label + ' · ' + product.spec + '</small>' +
          '</span>' +
          '<span class="search-result-price">' + format(product.price) + ' <small>تومان</small></span>' +
        '</a></li>';
      })
      .join('');

    if (matches.length) {
      searchStatus.textContent = '';
      searchAll.hidden = false;
      searchAll.href = 'shop.html?q=' + encodeURIComponent(raw.trim());
      searchAll.querySelector('span').textContent = 'مشاهده ' + format(matches.length) + ' نتیجه در فروشگاه';
    } else {
      searchStatus.textContent = 'نتیجه‌ای برای «' + raw.trim() + '» پیدا نشد. عبارت دیگری را امتحان کنید.';
      searchAll.hidden = true;
    }
  }

  searchInput.addEventListener('input', renderSearch);

  searchPanel.querySelectorAll('.search-term').forEach(function (button) {
    button.addEventListener('click', function () {
      searchInput.value = button.dataset.term;
      renderSearch();
      searchInput.focus({ preventScroll: true });
    });
  });

  searchForm.addEventListener('submit', function (event) {
    if (!normalize(searchInput.value)) {
      event.preventDefault();
      searchInput.focus();
    }
  });

  if (searchButton) {
    searchButton.setAttribute('aria-haspopup', 'dialog');
    searchButton.setAttribute('aria-controls', 'search-panel');
    searchButton.addEventListener('click', function () {
      openPanelFor(searchPanel, searchInput);
    });
  }

  if (cartButton) {
    cartButton.setAttribute('aria-haspopup', 'dialog');
    cartButton.setAttribute('aria-controls', 'cart-panel');
    cartButton.setAttribute('aria-expanded', 'false');
    cartButton.addEventListener('click', function (event) {
      event.preventDefault();
      openPanelFor(cartPanel, cartPanel.querySelector('.panel-close'));
    });
  }

  overlay.addEventListener('click', function () {
    closePanel();
  });

  [cartPanel, searchPanel].forEach(function (panel) {
    panel.querySelector('.panel-close').addEventListener('click', function () {
      closePanel();
    });
  });

  searchPanel.addEventListener('click', function (event) {
    if (event.target === searchPanel) {
      closePanel();
    }
  });

  searchPanel.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      closePanel(true);
    });
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && openPanel) {
      closePanel();
    }
  });

  cartList.addEventListener('click', function (event) {
    const button = event.target.closest('button[data-act]');

    if (!button) {
      return;
    }

    const row = button.closest('.cart-item');
    const id = Number(row.dataset.id);
    const size = row.dataset.size || '';
    const line = cart.find(function (entry) {
      return entry.id === id && entry.size === size;
    });

    if (!line) {
      return;
    }

    if (button.dataset.act === 'inc') {
      setQty(id, size, line.qty + 1);
    } else if (button.dataset.act === 'dec') {
      setQty(id, size, line.qty - 1);
    } else {
      setQty(id, size, 0);
    }
  });

  cartPanel.querySelector('.cart-clear').addEventListener('click', function () {
    cart = [];
    commit(false);
  });

  cartPanel.querySelector('.cart-shop-link').addEventListener('click', function () {
    closePanel(true);
  });

  document.addEventListener('click', function (event) {
    const button = event.target.closest('.product-add');

    if (!button) {
      return;
    }

    const item = button.closest('[data-id]');

    if (item) {
      addToCart(Number(item.dataset.id));
    }
  });

  window.addEventListener('storage', function (event) {
    if (event.key === STORAGE_KEY) {
      cart = loadCart();
      updateBadges(false);
      renderCart();
      notify();
    } else if (event.key === COUPON_KEY) {
      couponCode = readCoupon();
      notify();
    }
  });

  updateBadges(false);
  renderCart();

  window.Store = {
    products: products,
    categories: categories,
    format: format,
    normalize: normalize,
    addToCart: addToCart,
    setQty: setQty,
    maxQty: MAX_QTY,
    getCart: function () {
      return cart.map(function (line) {
        return { id: line.id, qty: line.qty, size: line.size, product: findProduct(line.id) };
      });
    },
    clearCart: function () {
      cart = [];
      commit(false);
    },
    subscribe: function (listener) {
      listeners.push(listener);
    },
    applyCoupon: applyCoupon,
    removeCoupon: function () {
      writeCoupon('');
    },
    summary: summary,
    shippingMethods: shippingMethods,
    coupons: coupons,
    freeShippingFrom: FREE_SHIPPING_FROM,
    openCart: function () {
      openPanelFor(cartPanel, cartPanel.querySelector('.panel-close'));
    }
  };
})();
