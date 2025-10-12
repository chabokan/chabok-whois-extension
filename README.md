# 🔍 Chabok WHOIS Extension

افزونه مرورگر برای نمایش اطلاعات دامنه و WHOIS

## ✨ ویژگی‌ها

- 🌍 **آیکون پویا**: آیکون Extension به پرچم کشور میزبان تبدیل می‌شود
- 📍 **اطلاعات IP**: نمایش IP، ISP، Hostname و موقعیت جغرافیایی
- 🔐 **اطلاعات SSL**: تاریخ انقضا، صادرکننده و اعتبار گواهینامه
- 📅 **عمر دامنه**: تاریخ ثبت، تاریخ انقضا و عمر دامنه
- 🌐 **NS Records**: نمایش Name Server های دامنه
- 🌓 **چند زبانه**: پشتیبانی از فارسی و انگلیسی
- 🎨 **تم‌های رنگی**: 4 تم مختلف (نارنجی، آبی، سبز، بنفش)
- ⚡ **Cache هوشمند**: ذخیره موقت برای سرعت بیشتر

## 📦 نصب

### Chrome / Edge / Brave

1. فایل‌های Extension را دانلود کنید
2. `chrome://extensions/` را باز کنید
3. "Developer mode" را فعال کنید
4. "Load unpacked" را کلیک کنید
5. پوشه Extension را انتخاب کنید

### Firefox

1. فایل‌های Extension را دانلود کنید
2. `manifest.json` را به `manifest.v2.json` تغییر نام دهید
3. `about:debugging#/runtime/this-firefox` را باز کنید
4. "Load Temporary Add-on" را کلیک کنید
5. فایل `manifest.v2.json` را انتخاب کنید

## ⚙️ تنظیم Backend

Extension نیاز به یک Backend PHP دارد:

1. فایل `backend/api.php` را روی سرور PHP خود آپلود کنید
2. فایل `config.js` را باز کنید
3. `BACKEND_URL` را به آدرس سرور خود تغییر دهید:

```javascript
const BACKEND_URL = 'https://your-domain.com/path-to/api.php';
```

## 🎯 نحوه استفاده

1. به هر سایتی بروید
2. آیکون Extension به پرچم کشور میزبان تبدیل می‌شود
3. روی آیکون کلیک کنید تا اطلاعات کامل را ببینید

## 🔧 تنظیمات

روی دکمه ⚙️ در گوشه بالا کلیک کنید:

- **زبان**: فارسی یا انگلیسی
- **نمایش پرچم**: خاموش/روشن کردن آیکون پرچم
- **تم رنگی**: انتخاب از 4 تم مختلف
- **Cache**: خاموش/روشن و تنظیم مدت زمان

## 🏗️ ساختار

```
chabok-whois/
├── manifest.json          # Chrome/Edge manifest (V3)
├── manifest.v2.json       # Firefox manifest (V2)
├── popup.html            # رابط کاربری اصلی
├── popup.js              # منطق اصلی
├── popup.css             # استایل‌ها
├── background.js         # Service Worker (تغییر آیکون)
├── settings.html         # صفحه تنظیمات
├── settings.js           # منطق تنظیمات
├── translations.js       # ترجمه‌های فارسی و انگلیسی
├── config.js             # تنظیمات Backend
├── icons/                # آیکون‌های Extension
└── backend/
    └── api.php           # Backend API
```

## 🔍 Backend چگونه کار می‌کند؟

Backend به صورت هوشمند تصمیم می‌گیرد:

- **IP, SSL, ISP**: از دامنه دقیق (با subdomain)
- **NS, Domain Age**: از دامنه اصلی (بدون subdomain)

مثال:
```
www.digikala.com →
  IP & SSL: از www.digikala.com
  NS & Age: از digikala.com
```

## 📝 لایسنس

این پروژه با لایسنس MIT منتشر شده است.

## 🤝 مشارکت

Issue ها و Pull Request ها خوش آمدید!

## 📧 تماس

برای پشتیبانی: https://chabokan.net

---

**ساخته شده با ❤️ توسط Chabokan**
