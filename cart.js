(function () {
  const page = document.querySelector('.cp');

  if (!page || !window.Store) {
    return;
  }

  const Store = window.Store;
  const format = Store.format;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const layout = page.querySelector('.cp-layout');
  const emptyBox = page.querySelector('.cp-empty');
  const itemsEl = page.querySelector('.cp-items');
  const listCount = page.querySelector('.cp-list-count');
  const clearButton = page.querySelector('.cp-clear');
  const shipText = page.querySelector('.cp-ship-text');
  const shipBox = page.querySelector('.cp-ship');
  const shipFill = page.querySelector('.cp-ship-fill');

  const couponForm = page.querySelector('.cp-coupon-form');
  const couponInput = page.querySelector('.cp-coupon-input');
  const couponMsg = page.querySelector('.cp-coupon-msg');
  const couponApplied = page.querySelector('.cp-coupon-applied');
  const couponHints = page.querySelector('.cp-coupon-hints');

  const sumCount = page.querySelector('.cp-sum-count');
  const sumSubtotal = page.querySelector('.cp-sum-subtotal');
  const sumDiscountRow = page.querySelector('.cp-row--discount');
  const sumDiscount = page.querySelector('.cp-sum-discount');
  const sumCode = page.querySelector('.cp-sum-code');
  const sumShipping = page.querySelector('.cp-sum-shipping');
  const sumTotal = page.querySelector('.cp-sum-total');
  const saveNote = page.querySelector('.cp-save');
  const checkoutLink = page.querySelector('.cp-summary .cp-btn');

  const recoBox = page.querySelector('.cp-reco');
  const recoList = page.querySelector('.cp-reco-list');

  const heartIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>';
  const trashIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>';
  const plusIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>';
  const minusIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"></path></svg>';
  const checkIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg>';
  const truckIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"></path><path d="M15 18H9"></path><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"></path><circle cx="17" cy="18" r="2"></circle><circle cx="7" cy="18" r="2"></circle></svg>';

  const toast = document.createElement('div');

  toast.className = 'cp-toast';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  document.body.append(toast);

  let toastTimer = 0;
  let clearTimer = 0;

  function showToast(message, undo) {
    toast.innerHTML = '<span></span>';
    toast.firstChild.textContent = message;

    if (undo) {
      const button = document.createElement('button');

      button.type = 'button';
      button.textContent = 'بازگردانی';
      button.addEventListener('click', function () {
        undo();
        hideToast();
      });
      toast.append(button);
    }

    toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(hideToast, undo ? 7000 : 3500);
  }

  function hideToast() {
    toast.classList.remove('is-visible');
  }

  function lineHtml(line) {
    const product = line.product;
    const colors = Store.categories[product.cat];
    const href = 'product.html?id=' + product.id;
    const size = line.size ? ' · سایز ' + format(Number(line.size)) : '';

    return '<li class="cp-item" data-id="' + product.id + '" data-size="' + line.size + '">' +
      '<a class="cp-item-media" href="' + href + '" tabindex="-1" aria-hidden="true" style="--cat-from: ' + colors.from + '; --cat-to: ' + colors.to + ';">' +
        '<img src="images/' + product.img + '.webp" alt="' + product.alt + '" width="1000" height="1000" loading="lazy">' +
      '</a>' +
      '<div class="cp-item-info">' +
        '<span class="cp-item-cat" style="--cat-accent: ' + colors.accent + ';">' + colors.label + '</span>' +
        '<h3 class="cp-item-name"><a href="' + href + '">' + product.name + '</a></h3>' +
        '<p class="cp-item-spec">' + product.spec + size + '</p>' +
        '<p class="cp-item-unit">قیمت واحد: <b>' + format(product.price) + '</b> تومان</p>' +
        (line.qty >= Store.maxQty ? '<p class="cp-item-max">حداکثر ' + format(Store.maxQty) + ' عدد برای هر سفارش</p>' : '') +
      '</div>' +
      '<div class="cp-item-side">' +
        '<div class="cp-qty" role="group" aria-label="تعداد ' + product.name + '">' +
          '<button type="button" data-act="inc" aria-label="افزایش تعداد"' + (line.qty >= Store.maxQty ? ' disabled' : '') + '>' + plusIcon + '</button>' +
          '<span aria-live="polite">' + format(line.qty) + '</span>' +
          '<button type="button" data-act="dec" aria-label="کاهش تعداد"' + (line.qty <= 1 ? ' disabled' : '') + '>' + minusIcon + '</button>' +
        '</div>' +
        '<p class="cp-item-total"><strong>' + format(product.price * line.qty) + '</strong> تومان</p>' +
        '<button type="button" class="cp-item-remove" data-act="remove" aria-label="حذف ' + product.name + ' از سبد">' + trashIcon + '<span>حذف</span></button>' +
      '</div>' +
    '</li>';
  }

  function setMessage(text, kind) {
    couponMsg.textContent = text;
    couponMsg.className = 'cp-coupon-msg' + (kind ? ' is-' + kind : '');
  }

  function renderHints() {
    couponHints.innerHTML = '<span>کدهای پیشنهادی:</span>' +
      Object.keys(Store.coupons)
        .map(function (code) {
          return '<button type="button" data-code="' + code + '" title="' + Store.coupons[code].label + '">' + code + '</button>';
        })
        .join('');
  }

  function render() {
    const lines = Store.getCart();
    const summary = Store.summary('standard');
    const empty = lines.length === 0;
    const focused = document.activeElement;
    let focusKey = '';

    if (focused && itemsEl.contains(focused) && focused.dataset.act) {
      const row = focused.closest('.cp-item');

      focusKey = row.dataset.id + '|' + row.dataset.size + '|' + focused.dataset.act;
    }

    layout.hidden = empty;
    emptyBox.hidden = !empty;

    itemsEl.innerHTML = lines.map(lineHtml).join('');
    listCount.textContent = empty ? '' : '(' + format(summary.count) + ' کالا)';

    if (focusKey) {
      const parts = focusKey.split('|');
      const target = Array.from(itemsEl.querySelectorAll('.cp-item')).find(function (row) {
        return row.dataset.id === parts[0] && row.dataset.size === parts[1];
      });
      const button = target && target.querySelector('[data-act="' + parts[2] + '"]:not(:disabled)');

      if (button) {
        button.focus({ preventScroll: true });
      }
    }

    const payable = summary.subtotal - summary.discount;
    const progress = Math.min(1, payable / summary.freeFrom);
    const couponFree = summary.couponActive && summary.coupon.type === 'shipping';

    shipBox.classList.toggle('is-done', summary.freeRemaining === 0 || couponFree);
    shipFill.style.setProperty('--fill', couponFree ? 1 : progress);

    if (couponFree) {
      shipText.innerHTML = truckIcon + 'با کد تخفیف شما، ارسال پستی این سفارش رایگان است.';
    } else if (summary.freeRemaining === 0) {
      shipText.innerHTML = checkIcon + 'تبریک! ارسال پستی این سفارش رایگان است.';
    } else {
      shipText.innerHTML = truckIcon + '<span><b>' + format(summary.freeRemaining) + '</b> تومان دیگر خرید کنید تا ارسال پستی رایگان شود.</span>';
    }

    sumCount.textContent = empty ? '' : '(' + format(summary.count) + ')';
    sumSubtotal.textContent = format(summary.subtotal) + ' تومان';
    sumDiscountRow.hidden = summary.discount === 0;
    sumDiscount.textContent = '− ' + format(summary.discount) + ' تومان';
    sumCode.textContent = summary.couponCode && summary.discount ? '(' + summary.couponCode + ')' : '';
    sumShipping.textContent = summary.shipping === 0 ? 'رایگان' : 'در مرحله‌ی بعد';
    sumShipping.classList.toggle('is-free', summary.shipping === 0);
    sumTotal.textContent = format(payable) + ' تومان';
    saveNote.hidden = summary.discount === 0;
    saveNote.textContent = 'شما ' + format(summary.discount) + ' تومان در این خرید صرفه‌جویی کردید.';
    checkoutLink.classList.toggle('is-disabled', empty);

    couponApplied.hidden = !summary.couponCode;
    couponForm.hidden = Boolean(summary.couponCode);

    if (summary.couponCode) {
      const coupon = Store.coupons[summary.couponCode];

      couponApplied.querySelector('b').textContent = summary.couponCode;
      couponApplied.querySelector('small').textContent = summary.couponActive ? coupon.label : 'برای خرید بالای ' + format(coupon.min) + ' تومان فعال می‌شود';
      couponApplied.classList.toggle('is-inactive', !summary.couponActive);
    }
  }

  function applyCode(raw) {
    const result = Store.applyCoupon(raw);

    setMessage(result.message, result.ok ? 'ok' : 'error');

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
      setMessage('', '');
    }
  });

  couponHints.addEventListener('click', function (event) {
    const button = event.target.closest('button[data-code]');

    if (button) {
      applyCode(button.dataset.code);
    }
  });

  page.querySelector('.cp-coupon-remove').addEventListener('click', function () {
    Store.removeCoupon();
    setMessage('کد تخفیف حذف شد.', '');
    couponInput.focus();
  });

  function removeLine(row) {
    const id = Number(row.dataset.id);
    const size = row.dataset.size || '';
    const line = Store.getCart().find(function (entry) {
      return entry.id === id && entry.size === size;
    });

    if (!line) {
      return;
    }

    function commitRemoval() {
      Store.setQty(id, size, 0);
      showToast('«' + line.product.name + '» از سبد حذف شد.', function () {
        Store.addToCart(id, line.qty, size);
      });
    }

    if (reduceMotion) {
      commitRemoval();
      return;
    }

    row.classList.add('is-leaving');
    window.setTimeout(commitRemoval, 260);
  }

  itemsEl.addEventListener('click', function (event) {
    const button = event.target.closest('button[data-act]');

    if (!button) {
      return;
    }

    const row = button.closest('.cp-item');
    const id = Number(row.dataset.id);
    const size = row.dataset.size || '';
    const line = Store.getCart().find(function (entry) {
      return entry.id === id && entry.size === size;
    });

    if (!line) {
      return;
    }

    if (button.dataset.act === 'inc') {
      Store.setQty(id, size, line.qty + 1);
    } else if (button.dataset.act === 'dec') {
      Store.setQty(id, size, line.qty - 1);
    } else {
      removeLine(row);
    }
  });

  clearButton.addEventListener('click', function () {
    if (!clearButton.classList.contains('is-confirm')) {
      clearButton.classList.add('is-confirm');
      clearButton.textContent = 'مطمئنید؟ دوباره بزنید';
      window.clearTimeout(clearTimer);
      clearTimer = window.setTimeout(resetClear, 3500);
      return;
    }

    const snapshot = Store.getCart();

    resetClear();
    Store.clearCart();
    showToast('سبد خرید خالی شد.', function () {
      snapshot.forEach(function (line) {
        Store.addToCart(line.id, line.qty, line.size);
      });
    });
  });

  function resetClear() {
    window.clearTimeout(clearTimer);
    clearButton.classList.remove('is-confirm');
    clearButton.textContent = 'خالی کردن سبد';
  }

  checkoutLink.addEventListener('click', function (event) {
    if (checkoutLink.classList.contains('is-disabled')) {
      event.preventDefault();
    }
  });

  function createCard(product) {
    const colors = Store.categories[product.cat];
    const item = document.createElement('li');

    item.className = 'product-item reveal';
    item.dataset.id = product.id;
    item.innerHTML =
      '<article class="product-card' + (product.img === 'necklace' ? ' product-card--necklace' : '') + '" style="--cat-from: ' + colors.from + '; --cat-to: ' + colors.to + '; --cat-accent: ' + colors.accent + ';">' +
        '<div class="product-media">' +
          (product.badge ? '<span class="product-badge">' + product.badge + '</span>' : '') +
          '<button type="button" class="product-wish" aria-label="افزودن به علاقه‌مندی‌ها" aria-pressed="false">' + heartIcon + '</button>' +
          '<a href="product.html?id=' + product.id + '" class="product-photo" tabindex="-1" aria-hidden="true"><img src="images/' + product.img + '.webp" alt="' + product.alt + '" width="1000" height="1000" loading="lazy"></a>' +
        '</div>' +
        '<div class="product-body">' +
          '<h3 class="product-name"><a href="product.html?id=' + product.id + '">' + product.name + '</a></h3>' +
          '<p class="product-spec">' + product.spec + '</p>' +
          '<p class="product-price"><strong>' + format(product.price) + '</strong> تومان</p>' +
          '<button type="button" class="product-add"><span class="product-add-label">افزودن به سبد</span><span class="product-add-done">به سبد اضافه شد</span></button>' +
        '</div>' +
      '</article>';

    return item;
  }

  function renderRecommendations() {
    const lines = Store.getCart();
    const inCart = new Set();
    const cats = new Set();

    lines.forEach(function (line) {
      inCart.add(line.product.id);
      cats.add(line.product.cat);
    });

    const pool = Store.products
      .filter(function (product) {
        return !inCart.has(product.id);
      })
      .sort(function (a, b) {
        const byCat = (cats.has(b.cat) ? 1 : 0) - (cats.has(a.cat) ? 1 : 0);

        return byCat || (b.badge === 'پرفروش' ? 1 : 0) - (a.badge === 'پرفروش' ? 1 : 0);
      })
      .slice(0, 4);

    pool.forEach(function (product) {
      recoList.append(createCard(product));
    });

    recoBox.hidden = pool.length === 0;
  }

  renderHints();
  renderRecommendations();
  render();
  Store.subscribe(render);
})();
