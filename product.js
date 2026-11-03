(function () {
  const root = document.getElementById('product-page');

  if (!root || !window.Store) {
    return;
  }

  const Store = window.Store;
  const categories = Store.categories;
  const products = Store.products;
  const format = Store.format;
  const MAX_QTY = 10;
  const WISH_KEY = 'darbar-wish';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function icon(paths, size, fill) {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="' + (fill || 'none') + '" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + paths + '</svg>';
  }

  const icons = {
    star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>',
    heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>',
    share: '<circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"></line><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"></line>',
    check: '<path d="M20 6 9 17l-5-5"></path>',
    shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path><path d="m9 12 2 2 4-4"></path>',
    truck: '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"></path><path d="M15 18H9"></path><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"></path><circle cx="17" cy="18" r="2"></circle><circle cx="7" cy="18" r="2"></circle>',
    rotate: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path>',
    lock: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>',
    gem: '<path d="M6 3h12l4 6-10 12L2 9Z"></path><path d="M11 3 8 9l4 12 4-12-3-6"></path><path d="M2 9h20"></path>',
    weight: '<circle cx="12" cy="5" r="3"></circle><path d="M6.5 8a2 2 0 0 0-1.905 1.46L2.1 18.5A2 2 0 0 0 4 21h16a2 2 0 0 0 1.925-2.54L19.4 9.5A2 2 0 0 0 17.48 8Z"></path>',
    layers: '<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"></path><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"></path><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"></path>',
    plus: '<path d="M5 12h14"></path><path d="M12 5v14"></path>',
    minus: '<path d="M5 12h14"></path>',
    prev: '<path d="m9 18 6-6-6-6"></path>',
    next: '<path d="m15 18-6-6 6-6"></path>',
    zoom: '<circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path><path d="M11 8v6"></path><path d="M8 11h6"></path>',
    bag: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path>',
    ruler: '<path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z"></path><path d="m14.5 12.5 2-2"></path><path d="m11.5 9.5 2-2"></path><path d="m8.5 6.5 2-2"></path><path d="m17.5 15.5 2-2"></path>',
    chevron: '<path d="m6 9 6 6 6-6"></path>'
  };

  const stones = {
    1: 'الماس سولیتر، ۰٫۳۰ قیراط',
    2: 'زمرد تراش امرالد با هاله‌ی الماس',
    3: 'مروارید پرورشی ۹ میلی‌متری با الماس',
    4: 'یاقوت سرخ',
    5: 'یاقوت کبود با هاله‌ی الماس',
    6: 'الماس برلیان گرد، تک‌نگین',
    7: 'زمرد تراش امرالد با قاب طلا',
    8: 'الماس برلیان، ردیف نگین‌های ریز',
    9: 'ندارد (کنده‌کاری دست)',
    10: 'زمرد تراش امرالد با الماس در دو سوی نگین',
    11: 'مروارید پرورشی سفید، قاب رزگلد',
    12: 'زمرد تراش امرالد با هاله‌ی الماس'
  };

  const ratings = {
    1: [4.9, 48], 2: [4.8, 31], 3: [4.9, 64], 4: [4.7, 22], 5: [4.8, 17], 6: [4.9, 39],
    7: [4.6, 12], 8: [4.8, 26], 9: [4.7, 9], 10: [4.9, 18], 11: [4.8, 14], 12: [4.9, 21]
  };

  const sizeConfig = {
    rings: { label: 'سایز انگشتر', sizes: [50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62], guide: true },
    'gem-rings': { label: 'سایز انگشتر', sizes: [50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62], guide: true },
    necklaces: { label: 'طول زنجیر (سانتی‌متر)', sizes: [40, 45, 50, 55] },
    bracelets: { label: 'دور مچ دست (سانتی‌متر)', sizes: [16, 17, 18, 19, 20] }
  };

  const intros = {
    rings: 'خطوط ظریف و نشست راحت روی دست، این انگشتر را هم برای هر روز مناسب کرده و هم برای مناسبت‌های خاص.',
    'gem-rings': 'نگین این انگشتر یکی‌یکی انتخاب و با دقت روی طلا نشانده می‌شود تا در هر نور و از هر زاویه بدرخشد.',
    necklaces: 'زنجیر و آویز این گردنبند هماهنگ با هم طراحی شده‌اند و روی گردن سبک و آرام می‌نشینند.',
    earrings: 'سبک و راحت، بدون فشار روی لاله‌ی گوش؛ گوشواره‌ای که هم در روز و هم در شب می‌درخشد.',
    bracelets: 'قفل مطمئن و ساخت یکپارچه، به این دستبند ظاهری باشکوه و دوامی ماندگار داده است.',
    sets: 'چند قطعه‌ی هماهنگ که کنار هم طراحی شده‌اند؛ انتخابی شایسته برای عروس و هدیه‌های ماندگار.'
  };

  const views = [
    { label: 'نمای کامل', scale: 1, ox: '50%', oy: '50%' },
    { label: 'جزئیات بالا', scale: 1.9, ox: '34%', oy: '30%' },
    { label: 'جزئیات پایین', scale: 1.9, ox: '66%', oy: '66%' }
  ];

  const reviews = [
    { name: 'سارا م.', date: '۱۴۰۵/۰۷/۱۲', rating: 5, text: 'دقیقاً مثل عکس بود. بسته‌بندی عالی و ارسال سریع بود و گواهی و فاکتور هم همراهش آمد.' },
    { name: 'علی ر.', date: '۱۴۰۵/۰۶/۲۸', rating: 5, text: 'برای هدیه‌ی سالگرد خریدم و همسرم خیلی خوشش آمد. مشاور فروش هم کامل راهنمایی کرد.' },
    { name: 'نرگس ک.', date: '۱۴۰۵/۰۵/۱۵', rating: 4, text: 'کیفیت ساخت و براقیت عالی است. فقط کاش جعبه‌ی هدیه کمی بزرگ‌تر بود.' },
    { name: 'مهدی ش.', date: '۱۴۰۵/۰۴/۰۳', rating: 5, text: 'قیمت شفاف و بدون هزینه‌ی پنهان. تجربه‌ی خرید قابل اعتمادی بود.' }
  ];

  const distribution = [78, 16, 4, 1, 1];

  function stars(value) {
    const filled = (value / 5 * 100).toFixed(0);
    let row = '';

    for (let i = 0; i < 5; i++) {
      row += icon(icons.star, 16, 'currentColor');
    }

    return '<span class="pd-stars" role="img" aria-label="امتیاز ' + format(value) + ' از ۵"><span class="pd-stars-empty">' + row + '</span><span class="pd-stars-fill" style="width: ' + filled + '%">' + row + '</span></span>';
  }

  function productUrl(product) {
    return 'product.html?id=' + product.id;
  }

  function createCard(product) {
    const colors = categories[product.cat];

    return '<li class="product-item reveal" data-id="' + product.id + '">' +
      '<article class="product-card' + (product.img === 'necklace' ? ' product-card--necklace' : '') + '" style="--cat-from: ' + colors.from + '; --cat-to: ' + colors.to + '; --cat-accent: ' + colors.accent + ';">' +
        '<div class="product-media">' +
          (product.badge ? '<span class="product-badge">' + product.badge + '</span>' : '') +
          '<button type="button" class="product-wish" aria-label="افزودن به علاقه‌مندی‌ها" aria-pressed="false">' + icon(icons.heart, 18) + '</button>' +
          '<a href="' + productUrl(product) + '" class="product-photo" tabindex="-1" aria-hidden="true"><img src="images/' + product.img + '.webp" alt="' + product.alt + '" width="1000" height="1000" loading="lazy"></a>' +
        '</div>' +
        '<div class="product-body">' +
          '<h3 class="product-name"><a href="' + productUrl(product) + '">' + product.name + '</a></h3>' +
          '<p class="product-spec">' + product.spec + '</p>' +
          '<p class="product-price"><strong>' + format(product.price) + '</strong> تومان</p>' +
          '<button type="button" class="product-add"><span class="product-add-label">افزودن به سبد</span><span class="product-add-done">به سبد اضافه شد</span></button>' +
        '</div>' +
      '</article>' +
    '</li>';
  }

  function renderMissing() {
    document.title = 'محصول پیدا نشد | طلا و جواهرات دربار';
    root.innerHTML =
      '<section class="pd-missing">' +
        '<span class="pd-missing-icon">' + icon(icons.gem, 40) + '</span>' +
        '<h1>این محصول پیدا نشد</h1>' +
        '<p>ممکن است نشانی را اشتباه وارد کرده باشید یا محصول دیگر موجود نباشد.</p>' +
        '<a href="shop.html" class="pd-missing-link">دیدن همه‌ی محصولات</a>' +
      '</section>';
  }

  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get('id'));
  const product = products.find(function (item) {
    return item.id === id;
  });

  if (!product) {
    renderMissing();
    return;
  }

  const cat = categories[product.cat];
  const specParts = product.spec.split(' · ');
  const metal = specParts[0];
  const weight = specParts[1] || '';
  const stone = stones[product.id] || 'بدون نگین';
  const rating = ratings[product.id] || [4.8, 10];
  const sizing = sizeConfig[product.cat];
  const sku = 'DR-' + (1000 + product.id);
  const intro = intros[product.cat];

  document.title = product.name + ' | طلا و جواهرات دربار';

  // عنوان و توضیح پیش‌نمایش اشتراک‌گذاری هم با محصول فعلی هماهنگ می‌شود
  function setMeta(property, value) {
    const tag = document.querySelector('meta[property="' + property + '"]');

    if (tag) {
      tag.setAttribute('content', value);
    }
  }

  setMeta('og:title', document.title);
  setMeta('og:image', new URL('images/' + product.img + '.webp', window.location.href).href);
  setMeta('og:image:alt', product.alt);

  const description = document.querySelector('meta[name="description"]');

  if (description) {
    const summaryText = product.name + ' از جنس ' + metal + '؛ مشخصات، قیمت و گواهی اصالت را ببینید و با ارسال بیمه‌شده از طلا و جواهرات دربار سفارش دهید.';

    description.setAttribute('content', summaryText);
    setMeta('og:description', summaryText);
  }

  const schema = document.createElement('script');

  schema.type = 'application/ld+json';
  schema.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    sku: sku,
    category: cat.label,
    image: new URL('images/' + product.img + '.webp', window.location.href).href,
    description: intro,
    offers: { '@type': 'Offer', priceCurrency: 'IRR', price: product.price * 10, availability: 'https://schema.org/InStock' }
  });
  document.head.append(schema);

  const related = products
    .filter(function (item) {
      return item.id !== product.id;
    })
    .sort(function (a, b) {
      const scoreA = (a.cat === product.cat ? 0 : 1e12) + Math.abs(a.price - product.price);
      const scoreB = (b.cat === product.cat ? 0 : 1e12) + Math.abs(b.price - product.price);

      return scoreA - scoreB;
    })
    .slice(0, 4);

  function sizeBlock() {
    if (!sizing) {
      return '';
    }

    let guide = '';

    if (sizing.guide) {
      const rows = [50, 52, 54, 56, 58, 60, 62].map(function (size) {
        return '<tr><td>' + format(size) + '</td><td>' + (size / Math.PI).toLocaleString('fa-IR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' میلی‌متر</td><td>' + format(size) + ' میلی‌متر</td></tr>';
      }).join('');

      guide =
        '<details class="pd-guide">' +
          '<summary>' + icon(icons.ruler, 18) + '<span>راهنمای انتخاب سایز</span>' + icon(icons.chevron, 18) + '</summary>' +
          '<div class="pd-guide-body">' +
            '<p>یک نوار کاغذی دور انگشت بپیچید، محیط را با خط‌کش بخوانید و عدد نزدیک به آن را از جدول انتخاب کنید. اگر بین دو سایز مانده‌اید، سایز بزرگ‌تر را بردارید.</p>' +
            '<table><thead><tr><th>سایز</th><th>قطر داخلی</th><th>محیط</th></tr></thead><tbody>' + rows + '</tbody></table>' +
          '</div>' +
        '</details>';
    }

    return '<fieldset class="pd-sizes">' +
      '<legend>' + sizing.label + '</legend>' +
      '<div class="pd-size-list">' +
        sizing.sizes.map(function (size) {
          return '<label class="pd-size"><input type="radio" name="size" value="' + size + '"><span>' + format(size) + '</span></label>';
        }).join('') +
      '</div>' +
      '<p class="pd-size-error" role="alert" hidden>' + icon('<circle cx="12" cy="12" r="10"></circle><path d="M12 8v4"></path><path d="M12 16h.01"></path>', 16) + 'پیش از افزودن به سبد، گزینه‌ی مورد نظرتان را انتخاب کنید.</p>' +
      guide +
    '</fieldset>';
  }

  function descriptionPanel() {
    const care = [
      'از تماس مستقیم با عطر، مواد شوینده و کلر دور نگه دارید.',
      'برای تمیز کردن از پارچه‌ی نرم و خشک استفاده کنید.',
      'جدا از سایر جواهرات و داخل جعبه‌ی مخصوص نگهداری کنید.'
    ];

    return '<div class="pd-prose">' +
      '<p>' + product.name + ' از مجموعه‌ی «' + cat.label + '» دربار است. ' + intro + '</p>' +
      '<p>این قطعه از ' + metal + ' ساخته شده و وزن آن حدود ' + weight + ' است. نگین به‌کاررفته: ' + stone + '. وزن دقیق روی فاکتور درج می‌شود.</p>' +
      '<p>هر قطعه پیش از ارسال توسط گوهرشناس ما بازبینی می‌شود و همراه گواهی اصالت، فاکتور رسمی و جعبه‌ی هدیه تحویل داده می‌شود.</p>' +
    '</div>' +
    '<div class="pd-columns">' +
      '<div class="pd-box">' +
        '<h2>ویژگی‌های خرید از دربار</h2>' +
        '<ul class="pd-checks">' +
          ['گواهی اصالت و فاکتور رسمی', 'عیار و وزن دقیق روی فاکتور', 'جعبه‌ی هدیه‌ی مخصوص', 'ارسال بیمه‌شده به سراسر کشور'].map(function (text) {
            return '<li>' + icon(icons.check, 18) + '<span>' + text + '</span></li>';
          }).join('') +
        '</ul>' +
      '</div>' +
      '<div class="pd-box">' +
        '<h2>نکات نگهداری</h2>' +
        '<ul class="pd-checks pd-checks--soft">' +
          care.map(function (text) {
            return '<li>' + icon(icons.check, 18) + '<span>' + text + '</span></li>';
          }).join('') +
        '</ul>' +
      '</div>' +
    '</div>';
  }

  function specsPanel() {
    const rows = [
      ['کد کالا', sku],
      ['دسته‌بندی', cat.label],
      ['جنس', metal],
      ['وزن تقریبی', weight],
      ['نگین', stone],
      ['گواهی اصالت', 'دارد'],
      ['بسته‌بندی', 'جعبه‌ی هدیه‌ی مخصوص'],
      ['ضمانت', '۷ روز بازگشت کالا']
    ];

    return '<dl class="pd-specs">' +
      rows.map(function (row) {
        return '<div><dt>' + row[0] + '</dt><dd>' + row[1] + '</dd></div>';
      }).join('') +
    '</dl>';
  }

  function reviewsPanel() {
    return '<div class="pd-reviews">' +
      '<div class="pd-summary">' +
        '<strong class="pd-summary-score">' + rating[0].toLocaleString('fa-IR', { minimumFractionDigits: 1 }) + '</strong>' +
        stars(rating[0]) +
        '<span class="pd-summary-count">از ' + format(rating[1]) + ' نظر</span>' +
        '<ul class="pd-bars">' +
          distribution.map(function (value, index) {
            return '<li><span>' + format(5 - index) + '</span><i><b style="--w: ' + value + '%"></b></i><em>' + format(value) + '٪</em></li>';
          }).join('') +
        '</ul>' +
      '</div>' +
      '<ul class="pd-review-list">' +
        reviews.map(function (review) {
          return '<li class="pd-review">' +
            '<div class="pd-review-head">' +
              '<span class="pd-review-avatar">' + review.name.charAt(0) + '</span>' +
              '<div><strong>' + review.name + '</strong><small>' + review.date + '</small></div>' +
              stars(review.rating) +
            '</div>' +
            '<p>' + review.text + '</p>' +
            '<span class="pd-review-badge">' + icon(icons.check, 14) + 'خریدار این محصول</span>' +
          '</li>';
        }).join('') +
      '</ul>' +
    '</div>';
  }

  function shippingPanel() {
    const items = [
      [icons.truck, 'ارسال بیمه‌شده', 'سفارش‌ها با بسته‌بندی ضدضربه و بیمه‌ی کامل ارسال می‌شوند. زمان تحویل در تهران تا ۲ روز کاری و در سایر شهرها تا ۵ روز کاری است.'],
      [icons.rotate, 'بازگشت ۷ روزه', 'اگر محصول را نپسندیدید، تا ۷ روز پس از دریافت می‌توانید آن را به‌شرط سالم بودن و همراه داشتن گواهی و جعبه مرجوع کنید.'],
      [icons.lock, 'پرداخت امن', 'پرداخت از طریق درگاه بانکی انجام می‌شود و اطلاعات کارت شما نزد ما ذخیره نمی‌شود.'],
      [icons.shield, 'گواهی اصالت', 'هر قطعه با گواهی اصالت و فاکتور رسمی شامل عیار، وزن و مشخصات نگین‌ها تحویل داده می‌شود.']
    ];

    return '<ul class="pd-policies">' +
      items.map(function (item) {
        return '<li><span class="pd-policy-icon">' + icon(item[0], 22) + '</span><div><h3>' + item[1] + '</h3><p>' + item[2] + '</p></div></li>';
      }).join('') +
    '</ul>';
  }

  const tabs = [
    { key: 'desc', label: 'توضیحات', html: descriptionPanel() },
    { key: 'specs', label: 'مشخصات', html: specsPanel() },
    { key: 'reviews', label: 'نظرات (' + format(rating[1]) + ')', html: reviewsPanel() },
    { key: 'shipping', label: 'ارسال و بازگشت', html: shippingPanel() }
  ];

  root.innerHTML =
    '<nav class="pd-crumbs-wrap" aria-label="مسیر صفحه">' +
      '<ol class="shop-crumbs pd-crumbs">' +
        '<li><a href="index.html">صفحه اصلی</a></li>' +
        '<li><a href="shop.html">محصولات</a></li>' +
        '<li><a href="shop.html?category=' + product.cat + '">' + cat.label + '</a></li>' +
        '<li aria-current="page">' + product.name + '</li>' +
      '</ol>' +
    '</nav>' +

    '<section class="pd-main" style="--cat-from: ' + cat.from + '; --cat-to: ' + cat.to + '; --cat-accent: ' + cat.accent + ';">' +
      '<div class="pd-gallery reveal">' +
        '<div class="pd-stage" style="--vs: 1; --ox: 50%; --oy: 50%; --zx: 50%; --zy: 50%;">' +
          (product.badge ? '<span class="pd-badge">' + product.badge + '</span>' : '') +
          '<div class="pd-stage-tools">' +
            '<button type="button" class="pd-tool pd-wish" aria-label="افزودن به علاقه‌مندی‌ها" aria-pressed="false">' + icon(icons.heart, 20) + '</button>' +
            '<button type="button" class="pd-tool pd-share" aria-label="اشتراک‌گذاری">' + icon(icons.share, 20) + '</button>' +
          '</div>' +
          '<div class="pd-stage-frame' + (product.img === 'necklace' ? ' pd-stage-frame--necklace' : '') + '">' +
            '<img class="pd-stage-img" src="images/' + product.img + '.webp" alt="' + product.alt + '" width="1000" height="1000" fetchpriority="high">' +
          '</div>' +
          '<button type="button" class="pd-nav pd-nav--prev" aria-label="تصویر قبلی">' + icon(icons.prev, 22) + '</button>' +
          '<button type="button" class="pd-nav pd-nav--next" aria-label="تصویر بعدی">' + icon(icons.next, 22) + '</button>' +
          '<span class="pd-zoom-hint">' + icon(icons.zoom, 16) + '<span class="pd-zoom-hint-touch">برای بزرگ‌نمایی لمس کنید</span></span>' +
        '</div>' +
        '<ul class="pd-thumbs">' +
          views.map(function (view, index) {
            return '<li><button type="button" class="pd-thumb' + (index === 0 ? ' is-active' : '') + '" data-view="' + index + '" aria-label="' + view.label + '" aria-pressed="' + (index === 0) + '" style="--vs: ' + view.scale + '; --ox: ' + view.ox + '; --oy: ' + view.oy + ';">' +
              '<img src="images/' + product.img + '.webp" alt="' + product.alt + '" width="1000" height="1000" loading="lazy"></button></li>';
          }).join('') +
        '</ul>' +
      '</div>' +

      '<div class="pd-info reveal stagger">' +
        '<a class="pd-cat" href="shop.html?category=' + product.cat + '">' + cat.label + '</a>' +
        '<h1 class="pd-title">' + product.name + '</h1>' +
        '<div class="pd-meta">' +
          '<a class="pd-rating" href="#pd-tabs" data-tab="reviews">' + stars(rating[0]) + '<b>' + rating[0].toLocaleString('fa-IR', { minimumFractionDigits: 1 }) + '</b><span>(' + format(rating[1]) + ' نظر)</span></a>' +
          '<span class="pd-sku">کد کالا: <bdi dir="ltr">' + sku + '</bdi></span>' +
          '<span class="pd-stock">' + icon(icons.check, 14) + 'موجود در انبار</span>' +
        '</div>' +
        '<div class="pd-price-box">' +
          '<p class="pd-price"><strong>' + format(product.price) + '</strong> <span>تومان</span></p>' +
          '<small>قیمت نهایی شامل اجرت ساخت و مالیات بر ارزش افزوده است.</small>' +
        '</div>' +
        '<p class="pd-lead">' + intro + '</p>' +
        '<ul class="pd-facts">' +
          '<li>' + icon(icons.layers, 20) + '<span>جنس</span><strong>' + metal + '</strong></li>' +
          '<li>' + icon(icons.weight, 20) + '<span>وزن</span><strong>' + weight + '</strong></li>' +
          '<li>' + icon(icons.gem, 20) + '<span>نگین</span><strong>' + stone + '</strong></li>' +
        '</ul>' +
        sizeBlock() +
        '<div class="pd-buy">' +
          '<div class="pd-qty" role="group" aria-label="تعداد">' +
            '<button type="button" data-qty="1" aria-label="افزایش تعداد">' + icon(icons.plus, 18) + '</button>' +
            '<output class="pd-qty-value" aria-live="polite">' + format(1) + '</output>' +
            '<button type="button" data-qty="-1" aria-label="کاهش تعداد" disabled>' + icon(icons.minus, 18) + '</button>' +
          '</div>' +
          '<button type="button" class="pd-add">' +
            '<span class="pd-add-label">' + icon(icons.bag, 20) + 'افزودن به سبد خرید</span>' +
            '<span class="pd-add-done">' + icon(icons.check, 20) + 'به سبد اضافه شد</span>' +
          '</button>' +
        '</div>' +
        '<button type="button" class="pd-viewcart" hidden>مشاهده‌ی سبد خرید و ادامه‌ی خرید</button>' +
        '<p class="pd-note" role="status"></p>' +
        '<ul class="pd-trust">' +
          [[icons.shield, 'گواهی اصالت'], [icons.truck, 'ارسال بیمه‌شده'], [icons.rotate, '۷ روز بازگشت'], [icons.lock, 'پرداخت امن']].map(function (item) {
            return '<li>' + icon(item[0], 22) + '<span>' + item[1] + '</span></li>';
          }).join('') +
        '</ul>' +
      '</div>' +
    '</section>' +

    '<section class="pd-tabs-section reveal" id="pd-tabs">' +
      '<div class="pd-tablist" role="tablist" aria-label="اطلاعات محصول">' +
        tabs.map(function (tab, index) {
          return '<button type="button" role="tab" class="pd-tab" id="tab-' + tab.key + '" aria-controls="panel-' + tab.key + '" aria-selected="' + (index === 0) + '" tabindex="' + (index === 0 ? 0 : -1) + '" data-tab="' + tab.key + '">' + tab.label + '</button>';
        }).join('') +
      '</div>' +
      tabs.map(function (tab, index) {
        return '<div class="pd-panel" role="tabpanel" id="panel-' + tab.key + '" aria-labelledby="tab-' + tab.key + '"' + (index === 0 ? '' : ' hidden') + '>' + tab.html + '</div>';
      }).join('') +
    '</section>' +

    '<section class="products pd-related" aria-labelledby="related-title">' +
      '<div class="section-head reveal">' +
        '<p class="section-eyebrow">پیشنهاد ما</p>' +
        '<h2 class="section-title" id="related-title">شاید اینها را هم بپسندید</h2>' +
      '</div>' +
      '<ul class="product-list">' + related.map(createCard).join('') + '</ul>' +
    '</section>';

  const sticky = document.createElement('div');

  sticky.className = 'pd-sticky';
  sticky.innerHTML =
    '<div class="pd-sticky-inner">' +
      '<img src="images/' + product.img + '.webp" alt="' + product.alt + '" width="1000" height="1000" loading="lazy" style="--cat-from: ' + cat.from + '; --cat-to: ' + cat.to + ';">' +
      '<div class="pd-sticky-info"><strong>' + product.name + '</strong><span>' + format(product.price) + ' تومان</span></div>' +
      '<button type="button" class="pd-sticky-add">' + icon(icons.bag, 20) + '<span>افزودن به سبد</span></button>' +
    '</div>';
  document.body.append(sticky);

  const stage = root.querySelector('.pd-stage');
  const thumbs = Array.from(root.querySelectorAll('.pd-thumb'));
  const state = { view: 0, qty: 1, size: '' };

  function setView(index) {
    const next = (index + views.length) % views.length;
    const view = views[next];

    state.view = next;
    stage.classList.remove('is-zoom');
    stage.style.setProperty('--vs', view.scale);
    stage.style.setProperty('--ox', view.ox);
    stage.style.setProperty('--oy', view.oy);

    thumbs.forEach(function (thumb, thumbIndex) {
      thumb.classList.toggle('is-active', thumbIndex === next);
      thumb.setAttribute('aria-pressed', String(thumbIndex === next));
    });
  }

  thumbs.forEach(function (thumb, index) {
    thumb.addEventListener('click', function () {
      setView(index);
    });
  });

  root.querySelector('.pd-nav--prev').addEventListener('click', function (event) {
    event.stopPropagation();
    setView(state.view - 1);
  });

  root.querySelector('.pd-nav--next').addEventListener('click', function (event) {
    event.stopPropagation();
    setView(state.view + 1);
  });

  let pointerType = 'mouse';

  function moveZoom(event) {
    const rect = stage.getBoundingClientRect();

    stage.style.setProperty('--zx', ((event.clientX - rect.left) / rect.width * 100).toFixed(1) + '%');
    stage.style.setProperty('--zy', ((event.clientY - rect.top) / rect.height * 100).toFixed(1) + '%');
  }

  stage.addEventListener('pointerdown', function (event) {
    pointerType = event.pointerType;
  });

  stage.addEventListener('click', function (event) {
    if (pointerType === 'mouse' || event.target.closest('button')) {
      return;
    }

    moveZoom(event);
    stage.classList.toggle('is-zoom');
  });

  function readWish() {
    try {
      const list = JSON.parse(window.localStorage.getItem(WISH_KEY));

      return Array.isArray(list) ? list : [];
    } catch (error) {
      return [];
    }
  }

  const wishButton = root.querySelector('.pd-wish');
  const note = root.querySelector('.pd-note');
  let noteTimer;

  function say(text) {
    note.textContent = text;
    note.classList.toggle('is-shown', Boolean(text));
    window.clearTimeout(noteTimer);

    if (text) {
      noteTimer = window.setTimeout(function () {
        note.classList.remove('is-shown');
        note.textContent = '';
      }, 2600);
    }
  }

  function paintWish(active) {
    wishButton.classList.toggle('is-active', active);
    wishButton.setAttribute('aria-pressed', String(active));
    wishButton.setAttribute('aria-label', active ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها');
  }

  paintWish(readWish().indexOf(product.id) !== -1);

  wishButton.addEventListener('click', function () {
    const list = readWish();
    const index = list.indexOf(product.id);

    if (index === -1) {
      list.push(product.id);
    } else {
      list.splice(index, 1);
    }

    try {
      window.localStorage.setItem(WISH_KEY, JSON.stringify(list));
    } catch (error) {
      // ممکن است ذخیره‌سازی مسدود باشد؛ در این صورت قلب فقط در همین بازدید نمایش داده می‌شود
    }

    paintWish(index === -1);
    say(index === -1 ? 'به علاقه‌مندی‌ها اضافه شد.' : 'از علاقه‌مندی‌ها حذف شد.');
  });

  root.querySelector('.pd-share').addEventListener('click', function () {
    const url = window.location.href;

    if (navigator.share) {
      navigator.share({ title: product.name, url: url }).catch(function () {});
      return;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(function () {
        say('پیوند محصول کپی شد.');
      }, function () {
        say('کپی پیوند انجام نشد.');
      });
    } else {
      say('این مرورگر از کپی پیوند پشتیبانی نمی‌کند.');
    }
  });

  const qtyValue = root.querySelector('.pd-qty-value');
  const qtyUp = root.querySelector('[data-qty="1"]');
  const qtyDown = root.querySelector('[data-qty="-1"]');

  function paintQty() {
    qtyValue.textContent = format(state.qty);
    qtyUp.disabled = state.qty >= MAX_QTY;
    qtyDown.disabled = state.qty <= 1;
  }

  [qtyUp, qtyDown].forEach(function (button) {
    button.addEventListener('click', function () {
      state.qty = Math.min(MAX_QTY, Math.max(1, state.qty + Number(button.dataset.qty)));
      paintQty();
    });
  });

  const sizeBox = root.querySelector('.pd-sizes');
  const sizeError = root.querySelector('.pd-size-error');

  if (sizeBox) {
    sizeBox.addEventListener('change', function (event) {
      state.size = event.target.value;
      sizeError.hidden = true;
      sizeBox.classList.remove('has-error');
    });
  }

  const addButton = root.querySelector('.pd-add');
  const viewCart = root.querySelector('.pd-viewcart');
  const stickyButton = sticky.querySelector('.pd-sticky-add');
  let addTimer;

  function handleAdd() {
    if (sizing && !state.size) {
      sizeError.hidden = false;
      sizeBox.classList.remove('has-error');
      void sizeBox.offsetWidth;
      sizeBox.classList.add('has-error');
      sizeBox.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
      return;
    }

    Store.addToCart(product.id, state.qty, state.size);

    addButton.classList.add('is-added');
    viewCart.hidden = false;
    window.clearTimeout(addTimer);
    addTimer = window.setTimeout(function () {
      addButton.classList.remove('is-added');
    }, 1800);
  }

  addButton.addEventListener('click', handleAdd);
  stickyButton.addEventListener('click', handleAdd);

  viewCart.addEventListener('click', function () {
    Store.openCart();
  });

  const buyRow = root.querySelector('.pd-buy');
  const footer = document.querySelector('.site-footer');
  let buyHidden = false;
  let footerVisible = false;

  function updateSticky() {
    sticky.classList.toggle('is-visible', buyHidden && !footerVisible);
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      buyHidden = !entries[0].isIntersecting;
      updateSticky();
    }).observe(buyRow);

    if (footer) {
      new IntersectionObserver(function (entries) {
        footerVisible = entries[0].isIntersecting;
        updateSticky();
      }).observe(footer);
    }
  }

  const tabButtons = Array.from(root.querySelectorAll('.pd-tab'));
  const panels = Array.from(root.querySelectorAll('.pd-panel'));

  function selectTab(key, focus) {
    tabButtons.forEach(function (tab, index) {
      const active = tab.dataset.tab === key;

      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      panels[index].hidden = !active;

      if (active && focus) {
        tab.focus();
      }
    });

    window.requestAnimationFrame(function () {
      window.dispatchEvent(new Event('resize'));
    });
  }

  tabButtons.forEach(function (tab, index) {
    tab.addEventListener('click', function () {
      selectTab(tab.dataset.tab, false);
    });

    tab.addEventListener('keydown', function (event) {
      let target = -1;

      if (event.key === 'ArrowLeft') {
        target = (index + 1) % tabButtons.length;
      } else if (event.key === 'ArrowRight') {
        target = (index - 1 + tabButtons.length) % tabButtons.length;
      } else if (event.key === 'Home') {
        target = 0;
      } else if (event.key === 'End') {
        target = tabButtons.length - 1;
      }

      if (target !== -1) {
        event.preventDefault();
        selectTab(tabButtons[target].dataset.tab, true);
      }
    });
  });

  root.querySelector('.pd-rating').addEventListener('click', function (event) {
    event.preventDefault();
    selectTab('reviews', false);
    document.getElementById('pd-tabs').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  });

  paintQty();
})();
