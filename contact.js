(function () {
  const form = document.getElementById('contact-form');

  if (!form) {
    return;
  }

  const toPersian = window.Store ? window.Store.format : function (number) {
    return number.toLocaleString('fa-IR');
  };

  function toLatinDigits(text) {
    return String(text)
      .replace(/[٠-٩]/g, function (digit) {
        return String(digit.charCodeAt(0) - 1632);
      })
      .replace(/[۰-۹]/g, function (digit) {
        return String(digit.charCodeAt(0) - 1776);
      });
  }

  const fields = {
    name: form.elements.name,
    phone: form.elements.phone,
    subject: form.elements.subject,
    email: form.elements.email,
    message: form.elements.message
  };

  const rules = {
    name: function (value) {
      return value.trim().length >= 3 ? '' : 'نام و نام خانوادگی را وارد کنید.';
    },
    phone: function (value) {
      const digits = toLatinDigits(value).replace(/[\s-]/g, '');

      if (!digits) {
        return 'شماره‌ی موبایل را وارد کنید.';
      }

      return /^09\d{9}$/.test(digits) ? '' : 'شماره‌ی موبایل باید ۱۱ رقم و با ۰۹ شروع شود.';
    },
    subject: function (value) {
      return value ? '' : 'موضوع پیام را انتخاب کنید.';
    },
    email: function (value) {
      const text = value.trim();

      return !text || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(text) ? '' : 'ایمیل واردشده معتبر نیست.';
    },
    message: function (value) {
      return value.trim().length >= 10 ? '' : 'متن پیام را حداقل در ۱۰ کاراکتر بنویسید.';
    }
  };

  function showError(key, text) {
    const field = fields[key];
    const box = document.getElementById(field.getAttribute('aria-describedby'));

    box.textContent = text;
    field.closest('.contact-field').classList.toggle('has-error', Boolean(text));
    field.setAttribute('aria-invalid', text ? 'true' : 'false');
  }

  function validate(key) {
    const text = rules[key](fields[key].value);

    showError(key, text);

    return !text;
  }

  Object.keys(fields).forEach(function (key) {
    fields[key].addEventListener('blur', function () {
      if (fields[key].value || key === 'subject') {
        validate(key);
      }
    });

    fields[key].addEventListener('input', function () {
      if (fields[key].closest('.contact-field').classList.contains('has-error')) {
        validate(key);
      }
    });

    fields[key].addEventListener('change', function () {
      if (key === 'subject') {
        validate(key);
      }
    });
  });

  const counter = document.getElementById('cf-counter');

  fields.message.addEventListener('input', function () {
    counter.textContent = toPersian(fields.message.value.length);
  });

  const success = document.querySelector('.contact-success');
  const submit = form.querySelector('.contact-submit');
  const submitLabel = form.querySelector('.contact-submit-label');

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    let firstInvalid = null;

    Object.keys(fields).forEach(function (key) {
      if (!validate(key) && !firstInvalid) {
        firstInvalid = fields[key];
      }
    });

    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    submit.disabled = true;
    submit.classList.add('is-loading');
    submitLabel.textContent = 'در حال ارسال…';

    window.setTimeout(function () {
      form.hidden = true;
      success.hidden = false;
      success.classList.add('is-shown');
      success.querySelector('h3').setAttribute('tabindex', '-1');
      success.querySelector('h3').focus({ preventScroll: true });
      submit.disabled = false;
      submit.classList.remove('is-loading');
      submitLabel.textContent = 'ارسال پیام';
    }, 900);
  });

  success.querySelector('.contact-again').addEventListener('click', function () {
    form.reset();
    counter.textContent = toPersian(0);

    Object.keys(fields).forEach(function (key) {
      showError(key, '');
    });

    success.hidden = true;
    success.classList.remove('is-shown');
    form.hidden = false;
    fields.name.focus();
  });

  const hoursList = document.getElementById('contact-hours');
  const statusBadge = document.getElementById('contact-status');

  if (hoursList && statusBadge) {
    const schedule = { 0: [10, 20], 1: [10, 20], 2: [10, 20], 3: [10, 20], 4: [10, 14], 6: [10, 20] };
    const dayNames = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

    function updateStatus() {
      let day;
      let hour;

      try {
        const parts = new Intl.DateTimeFormat('en-US', {
          timeZone: 'Asia/Tehran',
          weekday: 'short',
          hour: 'numeric',
          hourCycle: 'h23'
        }).formatToParts(new Date());

        day = dayNames[parts.find(function (part) {
          return part.type === 'weekday';
        }).value];
        hour = Number(parts.find(function (part) {
          return part.type === 'hour';
        }).value);
      } catch (error) {
        const now = new Date();

        day = now.getDay();
        hour = now.getHours();
      }

      const range = schedule[day];
      const open = Boolean(range) && hour >= range[0] && hour < range[1];

      statusBadge.textContent = open ? 'اکنون باز است' : 'اکنون بسته است';
      statusBadge.classList.toggle('is-open', open);

      hoursList.querySelectorAll('li').forEach(function (item) {
        const today = Number(item.dataset.day) === day;

        item.classList.toggle('is-today', today);

        if (today) {
          item.setAttribute('aria-current', 'date');
        } else {
          item.removeAttribute('aria-current');
        }
      });
    }

    updateStatus();
    window.setInterval(updateStatus, 60000);
  }
})();
