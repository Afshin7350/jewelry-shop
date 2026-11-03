(function () {
  const page = document.querySelector('.co');

  if (!page || !window.Store) {
    return;
  }

  const Store = window.Store;
  const format = Store.format;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const DRAFT_KEY = 'darbar-checkout';
  const ORDERS_KEY = 'darbar-orders';

  const provinces = ['آذربایجان شرقی', 'آذربایجان غربی', 'اردبیل', 'اصفهان', 'البرز', 'ایلام', 'بوشهر', 'تهران', 'چهارمحال و بختیاری', 'خراسان جنوبی', 'خراسان رضوی', 'خراسان شمالی', 'خوزستان', 'زنجان', 'سمنان', 'سیستان و بلوچستان', 'فارس', 'قزوین', 'قم', 'کردستان', 'کرمان', 'کرمانشاه', 'کهگیلویه و بویراحمد', 'گلستان', 'گیلان', 'لرستان', 'مازندران', 'مرکزی', 'هرمزگان', 'همدان', 'یزد'];

  const payMethods = {
    online: { label: 'پرداخت آنلاین', desc: 'اتصال به درگاه بانکی با تمام کارت‌های عضو شتاب' },
    card: { label: 'کارت به کارت', desc: 'واریز به شماره‌کارت فروشگاه و ارسال تصویر رسید' },
    store: { label: 'پرداخت در محل فروشگاه', desc: 'هنگام تحویل حضوری، فقط برای دریافت از فروشگاه' }
  };

  const textFields = ['firstName', 'lastName', 'mobile', 'email', 'national', 'province', 'city', 'postal', 'address', 'receiverName', 'receiverMobile', 'giftText', 'note'];
  const checkFields = ['otherReceiver', 'gift'];
  const digitFields = ['mobile', 'national', 'postal', 'receiverMobile'];

  const wrap = page.querySelector('.co-wrap');
  const emptyBox = page.querySelector('.co-empty');
  const form = page.querySelector('.co-form');
  const panels = Array.from(page.querySelectorAll('.co-panel'));
  const steps = Array.from(page.querySelectorAll('.co-step'));
  const methodsEl = page.querySelector('.co-methods');
  const payEl = page.querySelector('.co-pay');
  const addressBox = page.querySelector('.co-address');
  const pickupBox = page.querySelector('.co-pickup');
  const receiverBox = page.querySelector('.co-receiver');
  const giftBox = page.querySelector('.co-gift');
  const giftCounter = page.querySelector('.co-counter span');
  const cardInfo = page.querySelector('.co-cardinfo');
  const reviewEl = page.querySelector('.co-review');
  const termsError = page.querySelector('.co-terms-error');
  const submitButton = page.querySelector('.co-submit');
  const submitLabel = page.querySelector('.co-submit-label');
  const successBox = page.querySelector('.co-success');

  const itemsEl = page.querySelector('.co-items');
  const sumCount = page.querySelector('.co-sum-count');
  const sumSubtotal = page.querySelector('.co-sum-subtotal');
  const sumDiscountRow = page.querySelector('.cp-row--discount');
  const sumDiscount = page.querySelector('.co-sum-discount');
  const sumCode = page.querySelector('.co-sum-code');
  const sumShipping = page.querySelector('.co-sum-shipping');
  const sumTotal = page.querySelector('.co-sum-total');

  const couponForm = page.querySelector('.cp-coupon-form');
  const couponInput = page.querySelector('.cp-coupon-input');
  const couponMsg = page.querySelector('.cp-coupon-msg');
  const couponApplied = page.querySelector('.cp-coupon-applied');

  const gateway = document.querySelector('.co-gateway');
  const gatewayLoad = gateway.querySelector('.co-gateway-load');
  const gatewayMsg = gateway.querySelector('.co-gateway-msg');
  const gatewayPay = gateway.querySelector('.co-gateway-pay');
  const gatewayAmount = gateway.querySelector('.co-gateway-amount strong');

  const state = { step: 1, method: 'standard', pay: 'online', done: false, placing: false };
  let gatewayTimer = 0;

  function esc(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char];
    });
  }

  function toFa(value) {
    return String(value).replace(/\d/g, function (digit) {
      return '۰۱۲۳۴۵۶۷۸۹'[digit];
    });
  }

  function digits(value) {
    return Store.normalize(value).replace(/\s/g, '');
  }

  function field(name) {
    return form.elements[name];
  }

  function value(name) {
    return field(name).value.trim();
  }

  function validNational(code) {
    if (!/^\d{10}$/.test(code) || /^(\d)\1{9}$/.test(code)) {
      return false;
    }

    let sum = 0;

    for (let index = 0; index < 9; index += 1) {
      sum += Number(code[index]) * (10 - index);
    }

    const rest = sum % 11;
    const check = Number(code[9]);

    return rest < 2 ? check === rest : check === 11 - rest;
  }

  function setError(input, message) {
    const box = input.closest('.contact-field');

    if (!box) {
      return;
    }

    box.classList.toggle('has-error', Boolean(message));
    box.querySelector('.contact-error').textContent = message || '';

    if (message) {
      input.setAttribute('aria-invalid', 'true');
    } else {
      input.removeAttribute('aria-invalid');
    }
  }

  const rules = {
    firstName: function () {
      return value('firstName').length >= 2 ? '' : 'نام را وارد کنید (حداقل ۲ حرف).';
    },
    lastName: function () {
      return value('lastName').length >= 2 ? '' : 'نام خانوادگی را وارد کنید (حداقل ۲ حرف).';
    },
    mobile: function () {
      return /^09\d{9}$/.test(digits(value('mobile'))) ? '' : 'شماره‌ی موبایل معتبر نیست؛ مثال: ۰۹۱۲۳۴۵۶۷۸۹';
    },
    email: function () {
      const email = value('email');

      return !email || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) ? '' : 'ایمیل واردشده معتبر نیست.';
    },
    national: function () {
      const code = digits(value('national'));

      return !code || validNational(code) ? '' : 'کد ملی واردشده معتبر نیست.';
    },
    province: function () {
      return value('province') ? '' : 'استان را انتخاب کنید.';
    },
    city: function () {
      return value('city').length >= 2 ? '' : 'نام شهر را وارد کنید.';
    },
    postal: function () {
      return /^\d{10}$/.test(digits(value('postal'))) ? '' : 'کد پستی باید ۱۰ رقم باشد.';
    },
    address: function () {
      return value('address').length >= 10 ? '' : 'نشانی کامل را وارد کنید (حداقل ۱۰ حرف).';
    },
    receiverName: function () {
      return value('receiverName').length >= 3 ? '' : 'نام گیرنده را وارد کنید.';
    },
    receiverMobile: function () {
      return /^09\d{9}$/.test(digits(value('receiverMobile'))) ? '' : 'موبایل گیرنده معتبر نیست.';
    }
  };

  function namesForStep(step) {
    if (step === 1) {
      return ['firstName', 'lastName', 'mobile', 'email', 'national'];
    }

    if (step === 2) {
      const names = [];

      if (state.method !== 'pickup') {
        names.push('province', 'city', 'postal', 'address');
      }

      if (field('otherReceiver').checked) {
        names.push('receiverName', 'receiverMobile');
      }

      return names;
    }

    return [];
  }

  function validateStep(step) {
    let first = null;

    namesForStep(step).forEach(function (name) {
      const input = field(name);
      const message = rules[name]();

      setError(input, message);

      if (message && !first) {
        first = input;
      }
    });

    if (first) {
      first.focus();
      return false;
    }

    return true;
  }

  function saveDraft() {
    const draft = { method: state.method, pay: state.pay };

    textFields.forEach(function (name) {
      draft[name] = field(name).value;
    });
    checkFields.forEach(function (name) {
      draft[name] = field(name).checked;
    });

    try {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch (error) {
      // ممکن است ذخیره‌سازی مسدود باشد؛ در این صورت فرم فقط به خاطر سپرده نمی‌شود
    }
  }

  function loadDraft() {
    try {
      const draft = JSON.parse(window.localStorage.getItem(DRAFT_KEY));

      if (!draft || typeof draft !== 'object') {
        return;
      }

      textFields.forEach(function (name) {
        if (typeof draft[name] === 'string') {
          field(name).value = draft[name];
        }
      });
      checkFields.forEach(function (name) {
        field(name).checked = Boolean(draft[name]);
      });

      if (Store.shippingMethods[draft.method]) {
        state.method = draft.method;
      }

      if (payMethods[draft.pay]) {
        state.pay = draft.pay;
      }
    } catch (error) {
      // پیش‌نویس خراب نادیده گرفته می‌شود
    }
  }

  function renderMethods() {
    methodsEl.innerHTML = Object.keys(Store.shippingMethods)
      .map(function (key) {
        const method = Store.shippingMethods[key];
        const cost = Store.summary(key).shipping;

        return '<label class="co-option">' +
          '<input type="radio" name="shipping" value="' + key + '"' + (state.method === key ? ' checked' : '') + '>' +
          '<span class="co-option-box">' +
            '<span class="co-option-main"><strong>' + method.label + '</strong><small>' + method.eta + '</small></span>' +
            '<span class="co-option-price' + (cost === 0 ? ' is-free' : '') + '">' + (cost === 0 ? 'رایگان' : format(cost) + ' <small>تومان</small>') + '</span>' +
          '</span>' +
        '</label>';
      })
      .join('');
  }

  function renderPay() {
    if (state.pay === 'store' && state.method !== 'pickup') {
      state.pay = 'online';
    }

    payEl.innerHTML = Object.keys(payMethods)
      .map(function (key) {
        const method = payMethods[key];
        const disabled = key === 'store' && state.method !== 'pickup';

        return '<label class="co-option' + (disabled ? ' is-disabled' : '') + '">' +
          '<input type="radio" name="payment" value="' + key + '"' + (state.pay === key ? ' checked' : '') + (disabled ? ' disabled' : '') + '>' +
          '<span class="co-option-box">' +
            '<span class="co-option-main"><strong>' + method.label + '</strong><small>' + (disabled ? 'فقط با انتخاب «تحویل حضوری از فروشگاه» فعال می‌شود.' : method.desc) + '</small></span>' +
          '</span>' +
        '</label>';
      })
      .join('');

    cardInfo.hidden = state.pay !== 'card';
    submitLabel.textContent = state.pay === 'online' ? 'پرداخت آنلاین و ثبت سفارش' : 'ثبت سفارش';
  }

  function applyMethodView() {
    const pickup = state.method === 'pickup';

    addressBox.hidden = pickup;
    pickupBox.hidden = !pickup;
  }

  function renderSummary() {
    const lines = Store.getCart();
    const summary = Store.summary(state.method);

    itemsEl.innerHTML = lines
      .map(function (line) {
        const product = line.product;
        const colors = Store.categories[product.cat];

        return '<li class="co-item">' +
          '<span class="co-item-media" style="--cat-from: ' + colors.from + '; --cat-to: ' + colors.to + ';">' +
            '<img src="images/' + product.img + '.webp" alt="' + product.alt + '" width="1000" height="1000" loading="lazy">' +
            '<b>' + format(line.qty) + '</b>' +
          '</span>' +
          '<span class="co-item-info"><strong>' + product.name + '</strong><small>' + product.spec + (line.size ? ' · سایز ' + format(Number(line.size)) : '') + '</small></span>' +
          '<span class="co-item-price">' + format(product.price * line.qty) + '</span>' +
        '</li>';
      })
      .join('');

    sumCount.textContent = lines.length ? '(' + format(summary.count) + ')' : '';
    sumSubtotal.textContent = format(summary.subtotal) + ' تومان';
    sumDiscountRow.hidden = summary.discount === 0;
    sumDiscount.textContent = '− ' + format(summary.discount) + ' تومان';
    sumCode.textContent = summary.couponCode && summary.discount ? '(' + summary.couponCode + ')' : '';
    sumShipping.textContent = summary.shipping === 0 ? 'رایگان' : format(summary.shipping) + ' تومان';
    sumShipping.classList.toggle('is-free', summary.shipping === 0);
    sumTotal.textContent = format(summary.total) + ' تومان';

    couponApplied.hidden = !summary.couponCode;
    couponForm.hidden = Boolean(summary.couponCode);

    if (summary.couponCode) {
      const coupon = Store.coupons[summary.couponCode];

      couponApplied.querySelector('b').textContent = summary.couponCode;
      couponApplied.querySelector('small').textContent = summary.couponActive ? coupon.label : 'برای خرید بالای ' + format(coupon.min) + ' تومان فعال می‌شود';
      couponApplied.classList.toggle('is-inactive', !summary.couponActive);
    }
  }

  function deliveryText() {
    const method = Store.shippingMethods[state.method];

    if (state.method === 'pickup') {
      return { title: method.label + ' · ' + method.eta, address: 'تهران، خیابان نمونه، پلاک ۰' };
    }

    return {
      title: method.label + ' · ' + method.eta,
      address: value('province') + '، ' + value('city') + '، ' + value('address') + ' · کد پستی ' + toFa(digits(value('postal')))
    };
  }

  function receiverText() {
    return field('otherReceiver').checked ? value('receiverName') + ' (' + toFa(digits(value('receiverMobile'))) + ')' : '';
  }

  function renderReview() {
    const delivery = deliveryText();
    const receiver = receiverText();
    const summary = Store.summary(state.method);
    const gift = field('gift').checked;
    const contact = [value('firstName') + ' ' + value('lastName'), toFa(digits(value('mobile')))];

    if (value('email')) {
      contact.push(value('email'));
    }

    reviewEl.innerHTML =
      '<div class="co-review-block">' +
        '<div class="co-review-head"><h3>اطلاعات تماس</h3><button type="button" data-goto="1">ویرایش</button></div>' +
        '<p>' + esc(contact.join(' · ')) + '</p>' +
      '</div>' +
      '<div class="co-review-block">' +
        '<div class="co-review-head"><h3>ارسال و تحویل</h3><button type="button" data-goto="2">ویرایش</button></div>' +
        '<p>' + esc(delivery.title) + '</p>' +
        '<p>' + esc(delivery.address) + '</p>' +
        (receiver ? '<p>گیرنده: ' + esc(receiver) + '</p>' : '') +
        (gift ? '<p>بسته‌بندی هدیه' + (value('giftText') ? ' با کارت: «' + esc(value('giftText')) + '»' : '') + '</p>' : '') +
        (value('note') ? '<p>توضیحات: ' + esc(value('note')) + '</p>' : '') +
      '</div>' +
      '<div class="co-review-block">' +
        '<div class="co-review-head"><h3>مبلغ نهایی</h3><a href="cart.html">ویرایش سبد</a></div>' +
        '<p><strong>' + format(summary.total) + '</strong> تومان برای ' + format(summary.count) + ' کالا</p>' +
      '</div>';
  }

  function scrollToTop() {
    const top = wrap.getBoundingClientRect().top + window.scrollY - 96;

    window.scrollTo({ top: Math.max(0, top), behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  function goStep(step, shouldScroll) {
    state.step = step;

    panels.forEach(function (panel) {
      const active = Number(panel.dataset.panel) === step;

      panel.hidden = !active;
      panel.classList.toggle('is-active', active);
    });

    steps.forEach(function (item) {
      const number = Number(item.dataset.step);
      const done = number < step;

      item.classList.toggle('is-active', number === step);
      item.classList.toggle('is-done', done);

      if (number === step) {
        item.setAttribute('aria-current', 'step');
      } else {
        item.removeAttribute('aria-current');
      }

      if (done) {
        item.setAttribute('role', 'button');
        item.setAttribute('tabindex', '0');
      } else {
        item.removeAttribute('role');
        item.removeAttribute('tabindex');
      }
    });

    if (step === 3) {
      renderReview();
    }

    if (shouldScroll) {
      scrollToTop();

      const title = panels[step - 1].querySelector('.co-panel-title');

      title.setAttribute('tabindex', '-1');
      title.focus({ preventScroll: true });
    }
  }

  function showNotice(message) {
    let notice = form.querySelector('.co-notice');

    if (!message) {
      if (notice) {
        notice.remove();
      }

      return;
    }

    if (!notice) {
      notice = document.createElement('p');
      notice.className = 'co-notice';
      notice.setAttribute('role', 'alert');
      panels[2].querySelector('.co-actions').before(notice);
    }

    notice.textContent = message;
  }

  function sync() {
    if (state.done) {
      return;
    }

    const empty = Store.getCart().length === 0;

    wrap.hidden = empty;
    emptyBox.hidden = !empty;

    if (!empty) {
      renderMethods();
      renderPay();
      renderSummary();

      if (state.step === 3) {
        renderReview();
      }
    }
  }

  function openGateway(amount) {
    window.clearTimeout(gatewayTimer);
    gateway.hidden = false;
    document.documentElement.classList.add('has-panel');
    gatewayLoad.hidden = false;
    gatewayPay.hidden = true;
    gatewayMsg.textContent = 'در حال اتصال به درگاه پرداخت امن…';
    gatewayAmount.textContent = format(amount) + ' تومان';
    void gateway.offsetWidth;
    gateway.classList.add('is-open');

    gatewayTimer = window.setTimeout(function () {
      gatewayLoad.hidden = true;
      gatewayPay.hidden = false;
      gatewayPay.querySelector('[data-gw="ok"]').focus({ preventScroll: true });
    }, reduceMotion ? 200 : 1500);
  }

  function closeGateway() {
    window.clearTimeout(gatewayTimer);
    gateway.classList.remove('is-open');
    document.documentElement.classList.remove('has-panel');
    gateway.hidden = true;
  }

  function buildOrder() {
    const summary = Store.summary(state.method);
    const delivery = deliveryText();
    const id = 'DR-' + String(Date.now()).slice(-6) + String(Math.floor(Math.random() * 90) + 10);

    return {
      id: id,
      date: new Date().toISOString(),
      method: state.method,
      pay: state.pay,
      total: summary.total,
      subtotal: summary.subtotal,
      discount: summary.discount,
      shipping: summary.shipping,
      couponCode: summary.couponActive ? summary.couponCode : '',
      count: summary.count,
      items: Store.getCart().map(function (line) {
        return { id: line.id, qty: line.qty, size: line.size, name: line.product.name, price: line.product.price };
      }),
      contact: { name: value('firstName') + ' ' + value('lastName'), mobile: digits(value('mobile')), email: value('email') },
      delivery: delivery,
      receiver: receiverText(),
      gift: field('gift').checked ? value('giftText') || true : false,
      note: value('note')
    };
  }

  function saveOrder(order) {
    try {
      const list = JSON.parse(window.localStorage.getItem(ORDERS_KEY));
      const orders = Array.isArray(list) ? list : [];

      orders.unshift(order);
      window.localStorage.setItem(ORDERS_KEY, JSON.stringify(orders.slice(0, 10)));
      window.localStorage.removeItem(DRAFT_KEY);
    } catch (error) {
      // ذخیره‌ی تاریخچه‌ی سفارش‌ها اختیاری است
    }
  }

  function renderSuccess(order) {
    const statusText = {
      online: 'پرداخت موفق (آنلاین)',
      card: 'در انتظار ارسال رسید',
      store: 'پرداخت هنگام تحویل'
    }[order.pay];
    const message = {
      online: 'پرداخت شما تأیید شد و سفارش به‌زودی آماده‌ی ارسال می‌شود.',
      card: 'پس از واریز مبلغ، تصویر رسید را برای ما ارسال کنید تا سفارش شما آماده‌ی ارسال شود.',
      store: 'سفارش شما رزرو شد و تا ۲۴ ساعت آینده در فروشگاه آماده‌ی تحویل است.'
    }[order.pay];

    successBox.querySelector('.co-success-text').textContent = message + (order.contact.mobile ? ' اطلاعات سفارش به شماره‌ی ' + toFa(order.contact.mobile) + ' پیامک می‌شود.' : '');
    successBox.querySelector('.co-order-id').textContent = toFa(order.id);
    successBox.querySelector('.co-order-date').textContent = new Date(order.date).toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    successBox.querySelector('.co-order-total').textContent = format(order.total) + ' تومان';
    successBox.querySelector('.co-order-status').textContent = statusText;

    successBox.querySelector('.co-success-detail').innerHTML =
      '<h3>اقلام سفارش</h3>' +
      '<ul>' +
        order.items.map(function (item) {
          return '<li><span>' + esc(item.name) + (item.size ? ' · سایز ' + format(Number(item.size)) : '') + ' × ' + format(item.qty) + '</span><b>' + format(item.price * item.qty) + ' تومان</b></li>';
        }).join('') +
      '</ul>' +
      '<h3>تحویل</h3>' +
      '<p>' + esc(order.delivery.title) + '</p>' +
      '<p>' + esc(order.delivery.address) + '</p>' +
      (order.receiver ? '<p>گیرنده: ' + esc(order.receiver) + '</p>' : '');

    wrap.hidden = true;
    emptyBox.hidden = true;
    successBox.hidden = false;
    scrollToTop();
    successBox.focus({ preventScroll: true });
  }

  function placeOrder() {
    const order = buildOrder();

    saveOrder(order);
    state.done = true;
    Store.removeCoupon();
    Store.clearCart();
    renderSuccess(order);
  }

  function finishLoading() {
    state.placing = false;
    submitButton.classList.remove('is-loading');
    submitButton.disabled = false;
  }

  function submitOrder() {
    if (state.placing) {
      return;
    }

    showNotice('');

    if (!field('terms').checked) {
      termsError.textContent = 'برای ثبت سفارش باید قوانین و مقررات را بپذیرید.';
      field('terms').focus();
      return;
    }

    if (!validateStep(1)) {
      goStep(1, true);
      return;
    }

    if (!validateStep(2)) {
      goStep(2, true);
      return;
    }

    state.placing = true;
    submitButton.classList.add('is-loading');
    submitButton.disabled = true;

    if (state.pay === 'online') {
      openGateway(Store.summary(state.method).total);
      return;
    }

    window.setTimeout(function () {
      finishLoading();
      placeOrder();
    }, reduceMotion ? 100 : 900);
  }

  gateway.addEventListener('click', function (event) {
    const button = event.target.closest('button[data-gw]');

    if (!button) {
      return;
    }

    if (button.dataset.gw === 'cancel') {
      closeGateway();
      finishLoading();
      showNotice('پرداخت انجام نشد. می‌توانید دوباره تلاش کنید یا روش پرداخت دیگری انتخاب کنید.');
      submitButton.focus({ preventScroll: true });
      return;
    }

    gatewayPay.hidden = true;
    gatewayLoad.hidden = false;
    gatewayMsg.textContent = 'در حال تأیید پرداخت، لطفاً صبر کنید…';

    gatewayTimer = window.setTimeout(function () {
      closeGateway();
      finishLoading();
      placeOrder();
    }, reduceMotion ? 200 : 1400);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && !gateway.hidden && !gatewayPay.hidden) {
      gateway.querySelector('[data-gw="cancel"]').click();
    }
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    if (state.step < 3) {
      next();
    } else {
      submitOrder();
    }
  });

  function next() {
    if (validateStep(state.step)) {
      goStep(state.step + 1, true);
    }
  }

  form.addEventListener('click', function (event) {
    const nextButton = event.target.closest('[data-next]');
    const prevButton = event.target.closest('[data-prev]');
    const gotoButton = event.target.closest('[data-goto]');

    if (nextButton) {
      next();
    } else if (prevButton) {
      goStep(state.step - 1, true);
    } else if (gotoButton) {
      goStep(Number(gotoButton.dataset.goto), true);
    }
  });

  function stepActivate(item) {
    if (item.classList.contains('is-done')) {
      goStep(Number(item.dataset.step), true);
    }
  }

  steps.forEach(function (item) {
    item.addEventListener('click', function () {
      stepActivate(item);
    });
    item.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        stepActivate(item);
      }
    });
  });

  form.addEventListener('input', function (event) {
    const input = event.target;

    if (digitFields.indexOf(input.name) !== -1) {
      const cleaned = digits(input.value).replace(/\D/g, '');

      if (cleaned !== input.value) {
        input.value = cleaned;
      }
    }

    if (input.name === 'giftText') {
      giftCounter.textContent = format(input.value.length);
    }

    if (input.name === 'terms') {
      termsError.textContent = '';
    }

    setError(input, '');
    saveDraft();
  });

  form.addEventListener('change', function (event) {
    const input = event.target;

    if (input.name === 'shipping') {
      state.method = input.value;
      applyMethodView();
      renderPay();
      renderSummary();
    } else if (input.name === 'payment') {
      state.pay = input.value;
      cardInfo.hidden = state.pay !== 'card';
      submitLabel.textContent = state.pay === 'online' ? 'پرداخت آنلاین و ثبت سفارش' : 'ثبت سفارش';
      showNotice('');
    } else if (input.name === 'otherReceiver') {
      receiverBox.hidden = !input.checked;
    } else if (input.name === 'gift') {
      giftBox.hidden = !input.checked;
    }

    if (input.name === 'shipping' || input.name === 'payment' || checkFields.indexOf(input.name) !== -1) {
      saveDraft();
    }
  });

  textFields.forEach(function (name) {
    const input = field(name);

    if (name === 'province' || input.tagName === 'SELECT') {
      return;
    }

    input.addEventListener('blur', function () {
      const message = rules[name] ? rules[name]() : '';

      if (input.value.trim() && message) {
        setError(input, message);
      }
    });
  });

  function applyCode(raw) {
    const result = Store.applyCoupon(raw);

    couponMsg.textContent = result.message;
    couponMsg.className = 'cp-coupon-msg ' + (result.ok ? 'is-ok' : 'is-error');

    if (result.ok) {
      couponInput.value = '';
    } else {
      couponInput.focus();
    }
  }

  couponForm.addEventListener('submit', function (event) {
    event.preventDefault();
    applyCode(couponInput.value);
  });

  couponInput.addEventListener('input', function () {
    if (couponMsg.classList.contains('is-error')) {
      couponMsg.textContent = '';
      couponMsg.className = 'cp-coupon-msg';
    }
  });

  page.querySelector('.cp-coupon-remove').addEventListener('click', function () {
    Store.removeCoupon();
    couponMsg.textContent = 'کد تخفیف حذف شد.';
    couponMsg.className = 'cp-coupon-msg';
  });

  page.querySelector('.co-print').addEventListener('click', function () {
    window.print();
  });

  const provinceSelect = field('province');

  provinces.forEach(function (name) {
    const option = document.createElement('option');

    option.value = name;
    option.textContent = name;
    provinceSelect.append(option);
  });

  loadDraft();
  receiverBox.hidden = !field('otherReceiver').checked;
  giftBox.hidden = !field('gift').checked;
  giftCounter.textContent = format(field('giftText').value.length);
  applyMethodView();
  sync();
  goStep(1, false);
  Store.subscribe(sync);
})();
