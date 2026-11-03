# Darbar Jewelry Shop

A responsive, right-to-left Persian storefront for a gold and jewelry brand, built with plain HTML, CSS and JavaScript.

**Live demo:** https://afshin7350.github.io/jewelry-shop/

## Features

- Home page with a hero slider, featured products, a gold price board and customer reviews
- Shop page with category chips, search, sorting and a price filter
- Product page with an image viewer, size picker, tabs for details, specs, reviews and shipping, and structured data
- Cart drawer and a full cart page with coupon codes and a free-shipping progress bar
- Three-step checkout with validation, delivery options and a mock payment gateway
- Account page with accessible login and sign-up tabs, Persian validation and a welcome view
- About and contact pages with a working hours status and a validated message form
- Custom 404 page
- Persian and Arabic digits are converted before validation, and prices use Persian digits
- Keyboard friendly, visible focus styles, skip link and reduced-motion support

## Tech stack

- HTML5, CSS3 and vanilla JavaScript (no frameworks, no build step, no external requests)
- Local YekanBakh font files
- Inline SVG icons
- `localStorage` for the cart, coupons, wishlist, orders and demo accounts

## Project structure

```
.
├── index.html          Home
├── shop.html           Product listing
├── product.html        Product details (rendered from product.js)
├── cart.html           Cart
├── checkout.html       Checkout
├── account.html        Login and sign-up
├── about.html          About us
├── contact.html        Contact
├── 404.html            Not found page
├── style.css           Shared styles
├── hero.css            Home hero styles
├── store.js            Product data, cart store, header cart and search panels
├── script.js           Shared behavior: menu, reveal effects, newsletter, header account icon
├── hero.js             Hero slider
├── shop.js             Product listing logic
├── product.js          Product page rendering and behavior
├── cart.js             Cart page
├── checkout.js         Checkout flow
├── contact.js          Contact form
├── account.js          Login and sign-up logic
├── fonts/              Web fonts
└── images/             Product photos, logo and icons
```

## Run locally

No installation is needed. Open `index.html` in a browser, or serve the folder with any static server:

```
python -m http.server 8000
```

Then visit http://localhost:8000.

## Notes

- This is a front-end only demo. There is no backend and no real payment: the checkout gateway is a simulation.
- Accounts, orders and the cart live in the browser's `localStorage`. The sign-up form only stores a salted hash of the password, which is not real authentication and must be replaced by server-side auth in a real project.
- Prices, reviews, phone number, email, address and social links are placeholders and should be replaced with real values.

---

## خلاصه‌ی فارسی

«طلا و جواهرات دربار» یک فروشگاه نمونه‌ی راست‌به‌چپ برای طلا و جواهر است که فقط با HTML، CSS و جاوااسکریپت ساده نوشته شده و به هیچ کتابخانه یا سرور نیاز ندارد.

- صفحه‌ی اصلی، فروشگاه با جستجو و فیلتر، صفحه‌ی محصول، سبد خرید، تسویه‌حساب سه‌مرحله‌ای، حساب کاربری، درباره‌ی ما و تماس با ما
- اعتبارسنجی فارسی فرم‌ها، تبدیل ارقام فارسی و عربی، ذخیره‌ی سبد و سفارش‌ها در مرورگر
- برای اجرا کافی است `index.html` را باز کنید.
- پرداخت و حساب کاربری فقط نمایشی هستند و هیچ اطلاعاتی به سرور فرستاده نمی‌شود.
