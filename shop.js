(function () {
  const list = document.querySelector('.shop-list');

  if (!list) {
    return;
  }

  if (!window.Store) {
    return;
  }

  const categories = window.Store.categories;
  const products = window.Store.products;

  const heartIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>';

  const format = window.Store.format;
  const normalize = window.Store.normalize;

  function createItem(product) {
    const colors = categories[product.cat];
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

  const items = new Map();

  products.forEach(function (product) {
    const item = createItem(product);

    items.set(product.id, item);
    list.append(item);
  });

  const chips = Array.from(document.querySelectorAll('.shop-chip'));
  const searchInput = document.querySelector('.shop-search-input');
  const sortSelect = document.querySelector('.shop-sort');
  const priceRange = document.querySelector('.shop-price-range');
  const priceValue = document.querySelector('.shop-price-value');
  const countText = document.querySelector('.shop-count');
  const emptyBox = document.querySelector('.shop-empty');
  const resetButton = document.querySelector('.shop-reset');

  const prices = products.map(function (product) {
    return product.price;
  });
  const minPrice = Math.floor(Math.min.apply(null, prices) / 1000000) * 1000000;
  const maxPrice = Math.ceil(Math.max.apply(null, prices) / 1000000) * 1000000;

  priceRange.min = minPrice;
  priceRange.max = maxPrice;
  priceRange.step = 1000000;
  priceRange.value = maxPrice;

  chips.forEach(function (chip) {
    const key = chip.dataset.cat;
    const total = key === 'all' ? products.length : products.filter(function (product) {
      return product.cat === key;
    }).length;

    chip.querySelector('.shop-chip-count').textContent = '(' + format(total) + ')';
  });

  const state = { cat: 'all', query: '', sort: 'default', max: maxPrice };

  const initialCategory = new URLSearchParams(window.location.search).get('category');

  if (initialCategory && categories[initialCategory]) {
    state.cat = initialCategory;
  }

  const initialQuery = new URLSearchParams(window.location.search).get('q');

  if (initialQuery) {
    state.query = initialQuery.trim();
    searchInput.value = state.query;
  }

  function sortProducts(visible) {
    const sorted = visible.slice();

    if (state.sort === 'newest') {
      // محصولات دارای برچسب «جدید» اول می‌آیند و بقیه بر اساس شناسه‌ی نزولی مرتب می‌شوند
      sorted.sort(function (a, b) {
        const diff = (b.badge === 'جدید') - (a.badge === 'جدید');

        return diff || b.id - a.id;
      });
    } else if (state.sort === 'price-asc') {
      sorted.sort(function (a, b) {
        return a.price - b.price;
      });
    } else if (state.sort === 'price-desc') {
      sorted.sort(function (a, b) {
        return b.price - a.price;
      });
    }

    return sorted;
  }

  function render() {
    const query = normalize(state.query);

    const visible = products.filter(function (product) {
      return (state.cat === 'all' || product.cat === state.cat) &&
        product.price <= state.max &&
        (!query || normalize(product.name + ' ' + product.spec).indexOf(query) !== -1);
    });
    const shown = sortProducts(visible);
    const shownIds = new Set(shown.map(function (product) {
      return product.id;
    }));

    products.forEach(function (product) {
      items.get(product.id).hidden = !shownIds.has(product.id);
    });

    shown.forEach(function (product) {
      list.append(items.get(product.id));
    });

    chips.forEach(function (chip) {
      const active = chip.dataset.cat === state.cat;

      chip.classList.toggle('is-active', active);
      chip.setAttribute('aria-pressed', String(active));
    });

    priceValue.textContent = format(state.max) + ' تومان';
    priceRange.style.setProperty('--range', ((state.max - minPrice) / (maxPrice - minPrice) * 100).toFixed(1) + '%');
    countText.textContent = shown.length ? format(shown.length) + ' محصول' : '';
    emptyBox.hidden = shown.length > 0;
    list.hidden = shown.length === 0;

    window.requestAnimationFrame(function () {
      window.dispatchEvent(new Event('resize'));
    });
  }

  function updateUrl() {
    if (!window.history.replaceState) {
      return;
    }

    const url = state.cat === 'all' ? window.location.pathname : window.location.pathname + '?category=' + state.cat;

    window.history.replaceState(null, '', url);
  }

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      state.cat = chip.dataset.cat;
      updateUrl();
      render();
    });
  });

  searchInput.addEventListener('input', function () {
    state.query = searchInput.value;
    render();
  });

  sortSelect.addEventListener('change', function () {
    state.sort = sortSelect.value;
    render();
  });

  priceRange.addEventListener('input', function () {
    state.max = Number(priceRange.value);
    render();
  });

  resetButton.addEventListener('click', function () {
    state.cat = 'all';
    state.query = '';
    state.sort = 'default';
    state.max = maxPrice;
    searchInput.value = '';
    sortSelect.value = 'default';
    priceRange.value = maxPrice;
    updateUrl();
    render();
  });

  render();
})();
