(function () {
  'use strict';

  const authBox = document.getElementById('account-auth');
  const welcome = document.getElementById('account-welcome');

  if (!authBox || !welcome) {
    return;
  }

  const ACCOUNTS_KEY = 'darbar-accounts';
  const USER_KEY = 'darbar-user';

  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const tabs = Array.from(authBox.querySelectorAll('.account-tab'));
  const panels = Array.from(authBox.querySelectorAll('.account-panel'));

  // تبدیل رقم‌های فارسی و عربی به لاتین پیش از اعتبارسنجی
  function toLatinDigits(text) {
    return String(text)
      .replace(/[٠-٩]/g, function (digit) {
        return String(digit.charCodeAt(0) - 1632);
      })
      .replace(/[۰-۹]/g, function (digit) {
        return String(digit.charCodeAt(0) - 1776);
      });
  }

  function cleanMobile(value) {
    return toLatinDigits(value).replace(/[\s-]/g, '');
  }

  function isMobile(value) {
    return /^09\d{9}$/.test(value);
  }

  function isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
  }

  // هش ساده فقط برای نمونه‌ی نمایشی است تا رمز عبور به‌صورت متن ساده ذخیره نشود.
  // در پروژه‌ی واقعی ورود و ثبت‌نام باید سمت سرور و با الگوریتم امن (مثل bcrypt) انجام شود.
  function hashPassword(password, salt) {
    const text = salt + ':' + password;
    let hash = 2166136261;

    for (let i = 0; i < text.length; i += 1) {
      hash ^= text.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }

    return (hash >>> 0).toString(16);
  }

  function readJson(key, fallback) {
    try {
      const value = JSON.parse(window.localStorage.getItem(key) || 'null');

      return value === null ? fallback : value;
    } catch (error) {
      return fallback;
    }
  }

  function writeJson(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      return false;
    }

    return true;
  }

  function getAccounts() {
    const list = readJson(ACCOUNTS_KEY, []);

    return Array.isArray(list) ? list : [];
  }

  // به‌روزرسانی عنوان آیکن حساب در هدر بعد از ورود یا خروج
  function syncHeader() {
    const link = document.querySelector('.header-actions a[href="account.html"]');
    const user = readJson(USER_KEY, null);
    const name = user && user.loggedIn && user.name ? user.name : '';

    if (!link) {
      return;
    }

    link.classList.toggle('is-logged-in', Boolean(name));
    link.title = name ? 'حساب کاربری: ' + name : 'ورود یا ثبت‌نام';
    link.setAttribute('aria-label', name ? 'حساب کاربری ' + name : 'حساب کاربری');
  }

  function showError(form, key, text) {
    const field = form.elements[key];
    const box = document.getElementById(field.getAttribute('aria-describedby').split(' ').pop());

    box.textContent = text;
    field.closest('.contact-field').classList.toggle('has-error', Boolean(text));
    field.setAttribute('aria-invalid', text ? 'true' : 'false');
  }

  function showFormAlert(id, text) {
    const box = document.getElementById(id);

    box.textContent = text;
    box.hidden = !text;
  }

  const loginRules = {
    identifier: function (value) {
      const text = value.trim();

      if (!text) {
        return 'شماره‌ی موبایل یا ایمیل را وارد کنید.';
      }

      return isMobile(cleanMobile(text)) || isEmail(text) ? '' : 'شماره‌ی موبایل یا ایمیل واردشده معتبر نیست.';
    },
    password: function (value) {
      return value ? '' : 'رمز عبور را وارد کنید.';
    }
  };

  const registerRules = {
    name: function (value) {
      return value.trim().length >= 3 ? '' : 'نام و نام خانوادگی را وارد کنید.';
    },
    mobile: function (value) {
      const digits = cleanMobile(value);

      if (!digits) {
        return 'شماره‌ی موبایل را وارد کنید.';
      }

      return isMobile(digits) ? '' : 'شماره‌ی موبایل باید ۱۱ رقم و با ۰۹ شروع شود.';
    },
    email: function (value) {
      const text = value.trim();

      if (!text) {
        return 'ایمیل را وارد کنید.';
      }

      return isEmail(text) ? '' : 'ایمیل واردشده معتبر نیست.';
    },
    password: function (value) {
      if (!value) {
        return 'رمز عبور را وارد کنید.';
      }

      return value.length >= 8 ? '' : 'رمز عبور باید دست‌کم ۸ نویسه باشد.';
    },
    confirm: function (value) {
      if (!value) {
        return 'رمز عبور را دوباره وارد کنید.';
      }

      return value === registerForm.elements.password.value ? '' : 'رمز عبور و تکرار آن یکسان نیست.';
    },
    terms: function () {
      return registerForm.elements.terms.checked ? '' : 'برای ثبت‌نام باید قوانین را بپذیرید.';
    }
  };

  function fieldValue(form, key) {
    const field = form.elements[key];

    return field.type === 'checkbox' ? field.checked : field.value;
  }

  function validate(form, rules, key) {
    const text = rules[key](fieldValue(form, key));

    showError(form, key, text);

    return !text;
  }

  function bindValidation(form, rules, alertId) {
    Object.keys(rules).forEach(function (key) {
      const field = form.elements[key];

      field.addEventListener('blur', function () {
        if (fieldValue(form, key) && field.type !== 'checkbox') {
          validate(form, rules, key);
        }
      });

      field.addEventListener(field.type === 'checkbox' ? 'change' : 'input', function () {
        showFormAlert(alertId, '');

        if (field.closest('.contact-field').classList.contains('has-error')) {
          validate(form, rules, key);
        }

        if (key === 'password' && form.elements.confirm && form.elements.confirm.value) {
          validate(form, rules, 'confirm');
        }
      });
    });
  }

  // اعتبارسنجی همه‌ی فیلدها و فوکوس روی اولین فیلد نامعتبر
  function validateAll(form, rules) {
    let firstInvalid = null;

    Object.keys(rules).forEach(function (key) {
      if (!validate(form, rules, key) && !firstInvalid) {
        firstInvalid = form.elements[key];
      }
    });

    if (firstInvalid) {
      firstInvalid.focus();
    }

    return !firstInvalid;
  }

  function selectTab(key, focus) {
    tabs.forEach(function (tab, index) {
      const active = tab.dataset.tab === key;

      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      panels[index].hidden = !active;

      if (active && focus) {
        tab.focus();
      }
    });
  }

  tabs.forEach(function (tab, index) {
    tab.addEventListener('click', function () {
      selectTab(tab.dataset.tab, false);
    });

    // در صفحه‌ی راست‌به‌چپ، پیکان چپ تب بعدی و پیکان راست تب قبلی است
    tab.addEventListener('keydown', function (event) {
      let target = -1;

      if (event.key === 'ArrowLeft') {
        target = (index + 1) % tabs.length;
      } else if (event.key === 'ArrowRight') {
        target = (index - 1 + tabs.length) % tabs.length;
      } else if (event.key === 'Home') {
        target = 0;
      } else if (event.key === 'End') {
        target = tabs.length - 1;
      }

      if (target !== -1) {
        event.preventDefault();
        selectTab(tabs[target].dataset.tab, true);
      }
    });
  });

  authBox.querySelectorAll('[data-switch]').forEach(function (button) {
    button.addEventListener('click', function () {
      selectTab(button.dataset.switch, true);
    });
  });

  authBox.querySelectorAll('.account-toggle').forEach(function (button) {
    const input = document.getElementById(button.getAttribute('aria-controls'));
    const iconShow = button.querySelector('.icon-show');
    const iconHide = button.querySelector('.icon-hide');

    button.addEventListener('click', function () {
      const visible = input.type === 'password';

      input.type = visible ? 'text' : 'password';
      iconShow.hidden = visible;
      iconHide.hidden = !visible;
      button.setAttribute('aria-label', visible ? 'پنهان کردن رمز عبور' : 'نمایش رمز عبور');
    });
  });

  function showWelcome(user, focus) {
    document.getElementById('welcome-title').textContent = 'خوش آمدید، ' + user.name;
    document.getElementById('welcome-mobile').textContent = user.mobile ? toPersianDigits(user.mobile) : '—';
    document.getElementById('welcome-email').textContent = user.email || '—';

    authBox.hidden = true;
    welcome.hidden = false;
    syncHeader();

    if (focus) {
      document.getElementById('welcome-title').focus({ preventScroll: true });
    }
  }

  function toPersianDigits(text) {
    return String(text).replace(/\d/g, function (digit) {
      return '۰۱۲۳۴۵۶۷۸۹'.charAt(Number(digit));
    });
  }

  function login(account) {
    const user = {
      loggedIn: true,
      name: account.name,
      mobile: account.mobile,
      email: account.email
    };

    writeJson(USER_KEY, user);
    showWelcome(user, true);
  }

  bindValidation(loginForm, loginRules, 'login-form-error');
  bindValidation(registerForm, registerRules, 'register-form-error');

  loginForm.addEventListener('submit', function (event) {
    event.preventDefault();
    showFormAlert('login-form-error', '');

    if (!validateAll(loginForm, loginRules)) {
      return;
    }

    const identifier = loginForm.elements.identifier.value.trim();
    const mobile = cleanMobile(identifier);
    const email = identifier.toLowerCase();

    const account = getAccounts().find(function (item) {
      return item.mobile === mobile || item.email === email;
    });

    if (!account) {
      showFormAlert('login-form-error', 'حسابی با این مشخصات پیدا نشد. اگر تازه آمده‌اید، ابتدا ثبت‌نام کنید.');
      return;
    }

    if (account.hash !== hashPassword(loginForm.elements.password.value, account.mobile)) {
      showFormAlert('login-form-error', 'رمز عبور درست نیست. دوباره تلاش کنید.');
      return;
    }

    loginForm.reset();
    login(account);
  });

  registerForm.addEventListener('submit', function (event) {
    event.preventDefault();
    showFormAlert('register-form-error', '');

    if (!validateAll(registerForm, registerRules)) {
      return;
    }

    const mobile = cleanMobile(registerForm.elements.mobile.value);
    const email = registerForm.elements.email.value.trim().toLowerCase();
    const accounts = getAccounts();

    const exists = accounts.some(function (item) {
      return item.mobile === mobile || item.email === email;
    });

    if (exists) {
      showFormAlert('register-form-error', 'با این شماره‌ی موبایل یا ایمیل قبلاً ثبت‌نام شده است. وارد حساب خود شوید.');
      return;
    }

    const account = {
      name: registerForm.elements.name.value.trim().replace(/\s+/g, ' '),
      mobile: mobile,
      email: email,
      hash: hashPassword(registerForm.elements.password.value, mobile)
    };

    accounts.push(account);

    if (!writeJson(ACCOUNTS_KEY, accounts)) {
      showFormAlert('register-form-error', 'ذخیره‌ی اطلاعات در مرورگر شما ممکن نیست. تنظیمات حریم خصوصی را بررسی کنید.');
      return;
    }

    registerForm.reset();
    login(account);
  });

  document.getElementById('logout-btn').addEventListener('click', function () {
    try {
      window.localStorage.removeItem(USER_KEY);
    } catch (error) {
      writeJson(USER_KEY, { loggedIn: false });
    }

    welcome.hidden = true;
    authBox.hidden = false;
    selectTab('login', false);
    syncHeader();
    document.getElementById('login-id').focus();
  });

  const savedUser = readJson(USER_KEY, null);

  if (savedUser && savedUser.loggedIn && savedUser.name) {
    showWelcome(savedUser, false);
  }
})();
