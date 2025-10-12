// Translation system for Chabok WHOIS Extension

const translations = {
  en: {
    // Header
    extensionTitle: 'Chabok WHOIS',
    loading: 'Loading...',
    
    // Tabs
    tabOverview: 'Overview',
    tabDNS: 'DNS',
    tabSSL: 'SSL',
    tabWhois: 'WHOIS',
    
    // IP Addresses
    ipAddresses: 'IP Addresses',
    ipv4: 'IPv4',
    ipv6: 'IPv6',
    noIPs: 'No IP addresses found',
    
    // Location & ISP
    locationISP: 'Location & ISP',
    country: 'Country',
    isp: 'ISP',
    hostname: 'Hostname',
    unknown: 'Unknown',
    
    // DNS Records
    nameservers: 'Nameservers',
    mailServers: 'Mail Servers',
    priority: 'Priority',
    noNameservers: 'No nameservers found',
    noMailServers: 'No mail servers found',
    
    // SSL Certificate
    sslCertificate: 'SSL Certificate',
    issuer: 'Issuer',
    expiryDate: 'Expiry Date',
    validFrom: 'Valid From',
    noSSL: 'No SSL certificate found',
    
    // Domain Info
    domainInfo: 'Domain Information',
    domainAge: 'Domain Age',
    registrationDate: 'Registration Date',
    expirationDate: 'Expiration Date',
    noDomainInfo: 'Domain information not available',
    
    // Time units
    yearsOld: 'years old',
    monthsOld: 'months old',
    daysOld: 'days old',
    yearsAndMonths: '%years% years and %months% months',
    daysRemaining: '%days% days remaining',
    monthsRemaining: '%months% months remaining',
    yearsRemaining: '%years% years and %months% months remaining',
    expired: 'Expired',
    expiresAToday: 'Expires today',
    
    // Actions
    refresh: 'Refresh',
    settings: 'Settings',
    poweredBy: 'Powered by',
    
    // Errors
    errorLoading: 'Error loading data',
    errorServer: 'Error fetching data from server. Please make sure the backend is running.',
    errorGeneric: 'An error occurred. Please try again.',
    tryAgain: 'Try Again',
    
    // Settings
    settingsTitle: 'Settings',
    back: 'Back',
    saveSettings: 'Save Settings',
    settingsSaved: 'Settings saved successfully!',
    
    // Settings - Language
    languageSection: 'Language',
    languageLabel: 'Interface Language',
    languageDesc: 'Language for displaying information',
    
    // Settings - Display
    displaySection: 'Display',
    flagIconLabel: 'Show Flag as Icon',
    flagIconDesc: 'Extension icon changes to country flag',
    themeLabel: 'Color Theme',
    themeDesc: 'Interface color theme',
    themeDefault: 'Default (Orange)',
    themeBlue: 'Blue',
    themeGreen: 'Green',
    themePurple: 'Purple',
    
    // Settings - Data
    dataSection: 'Data',
    cacheLabel: 'Enable Cache',
    cacheDesc: 'Cache data for faster loading',
    cacheDurationLabel: 'Cache Duration',
    cacheDurationDesc: 'How long to keep cached data',
    duration1min: '1 minute',
    duration5min: '5 minutes',
    duration10min: '10 minutes',
    duration30min: '30 minutes',
  },
  
  fa: {
    // Header
    extensionTitle: 'چابک WHOIS',
    loading: 'در حال بارگذاری...',
    
    // Tabs
    tabOverview: 'نمای کلی',
    tabDNS: 'DNS',
    tabSSL: 'SSL',
    tabWhois: 'WHOIS',
    
    // IP Addresses
    ipAddresses: 'آدرس‌های IP',
    ipv4: 'IPv4',
    ipv6: 'IPv6',
    noIPs: 'آدرس IP یافت نشد',
    
    // Location & ISP
    locationISP: 'موقعیت و ISP',
    country: 'کشور',
    isp: 'ISP',
    hostname: 'نام میزبان',
    unknown: 'نامشخص',
    
    // DNS Records
    nameservers: 'نیم‌سرورها',
    mailServers: 'سرورهای ایمیل',
    priority: 'اولویت',
    noNameservers: 'نیم‌سرور یافت نشد',
    noMailServers: 'سرور ایمیل یافت نشد',
    
    // SSL Certificate
    sslCertificate: 'گواهی SSL',
    issuer: 'صادرکننده',
    expiryDate: 'تاریخ انقضا',
    validFrom: 'اعتبار از',
    noSSL: 'گواهی SSL یافت نشد',
    
    // Domain Info
    domainInfo: 'اطلاعات دامنه',
    domainAge: 'عمر دامنه',
    registrationDate: 'تاریخ ثبت',
    expirationDate: 'تاریخ انقضا',
    noDomainInfo: 'اطلاعات دامنه در دسترس نیست',
    
    // Time units
    yearsOld: 'سال',
    monthsOld: 'ماه',
    daysOld: 'روز',
    yearsAndMonths: '%years% سال و %months% ماه',
    daysRemaining: '%days% روز دیگر',
    monthsRemaining: '%months% ماه دیگر',
    yearsRemaining: '%years% سال و %months% ماه دیگر',
    expired: 'منقضی شده',
    expiresAToday: 'امروز منقضی می‌شود',
    
    // Actions
    refresh: 'بروزرسانی',
    settings: 'تنظیمات',
    poweredBy: 'قدرت گرفته از',
    chabokan: 'چابکان',
    
    // Errors
    errorLoading: 'خطا در بارگذاری اطلاعات',
    errorServer: 'خطا در دریافت اطلاعات از سرور. لطفاً مطمئن شوید که Backend راه‌اندازی شده است.',
    errorGeneric: 'خطایی رخ داده است. لطفاً دوباره تلاش کنید.',
    tryAgain: 'تلاش مجدد',
    
    // Settings
    settingsTitle: 'تنظیمات',
    back: 'بازگشت',
    saveSettings: 'ذخیره تنظیمات',
    settingsSaved: 'تنظیمات با موفقیت ذخیره شد!',
    
    // Settings - Language
    languageSection: 'زبان',
    languageLabel: 'زبان رابط کاربری',
    languageDesc: 'زبان نمایش اطلاعات در افزونه',
    
    // Settings - Display
    displaySection: 'نمایش',
    flagIconLabel: 'نمایش پرچم به عنوان آیکون',
    flagIconDesc: 'آیکون افزونه به پرچم کشور میزبان تغییر می‌کند',
    themeLabel: 'تم رنگی',
    themeDesc: 'تم رنگی رابط کاربری',
    themeDefault: 'پیش‌فرض (نارنجی)',
    themeBlue: 'آبی',
    themeGreen: 'سبز',
    themePurple: 'بنفش',
    
    // Settings - Data
    dataSection: 'داده‌ها',
    cacheLabel: 'ذخیره‌سازی موقت',
    cacheDesc: 'ذخیره اطلاعات برای بارگذاری سریع‌تر',
    cacheDurationLabel: 'مدت زمان ذخیره',
    cacheDurationDesc: 'مدت زمان نگهداری داده‌های ذخیره شده',
    duration1min: '۱ دقیقه',
    duration5min: '۵ دقیقه',
    duration10min: '۱۰ دقیقه',
    duration30min: '۳۰ دقیقه',
  }
};

// Get translation
function t(key, replacements = {}) {
  const lang = document.documentElement.getAttribute('lang') || 'en';
  let text = translations[lang][key] || translations['en'][key] || key;
  
  // Replace placeholders
  Object.keys(replacements).forEach(placeholder => {
    text = text.replace(`%${placeholder}%`, replacements[placeholder]);
  });
  
  return text;
}

// Apply translations to the page
function applyTranslations(lang = 'en') {
  document.documentElement.setAttribute('lang', lang);
  document.body.setAttribute('dir', lang === 'fa' ? 'rtl' : 'ltr');
  
  // Translate all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    element.textContent = t(key);
  });
  
  // Translate all elements with data-i18n-placeholder attribute
  document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
    const key = element.getAttribute('data-i18n-placeholder');
    element.placeholder = t(key);
  });
  
  // Translate all elements with data-i18n-title attribute
  document.querySelectorAll('[data-i18n-title]').forEach(element => {
    const key = element.getAttribute('data-i18n-title');
    element.title = t(key);
  });
}

// Format date based on language
function formatDateByLang(dateString, lang = 'en') {
  if (!dateString) return t('unknown');
  try {
    const date = new Date(dateString);
    const locale = lang === 'fa' ? 'fa-IR' : 'en-US';
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (e) {
    return dateString;
  }
}

// Calculate and format remaining time
function formatRemainingTime(dateString, lang = 'en') {
  if (!dateString) return '';
  try {
    const targetDate = new Date(dateString);
    const now = new Date();
    const diffTime = targetDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return t('expired');
    } else if (diffDays === 0) {
      return t('expiresAToday');
    } else if (diffDays < 30) {
      return t('daysRemaining', { days: diffDays });
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return t('monthsRemaining', { months });
    } else {
      const years = Math.floor(diffDays / 365);
      const months = Math.floor((diffDays % 365) / 30);
      return t('yearsRemaining', { years, months });
    }
  } catch (e) {
    return '';
  }
}

