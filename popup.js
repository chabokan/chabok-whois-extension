// Utility functions
function extractDomain(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (e) {
    return null;
  }
}

function getCountryFlag(countryCode) {
  if (!countryCode || countryCode.length !== 2) return '🌍';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function formatDate(dateString) {
  if (!dateString) return t('unknown');
  return formatDateByLang(dateString, window.currentLanguage || 'en');
}

function calculateDomainAge(createdDate) {
  if (!createdDate) return t('unknown');
  try {
    const created = new Date(createdDate);
    const now = new Date();
    const diffTime = Math.abs(now - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    
    if (years > 0) {
      return t('yearsAndMonths', { years, months });
    } else if (months > 0) {
      return `${months} ${t('monthsOld')}`;
    } else {
      return `${diffDays} ${t('daysOld')}`;
    }
  } catch (e) {
    return t('unknown');
  }
}

// محاسبه روزهای باقی‌مانده تا انقضا
function calculateDaysRemaining(expiryDate) {
  if (!expiryDate) return null;
  return formatRemainingTime(expiryDate, window.currentLanguage || 'en');
}

// آیکون توسط background.js مدیریت می‌شود
// این تابع دیگر استفاده نمی‌شود

function showError(message) {
  const loadingContainer = document.getElementById('loadingContainer');
  const errorContainer = document.getElementById('errorContainer');
  const errorMessage = document.getElementById('errorMessage');
  
  loadingContainer.style.display = 'none';
  errorContainer.style.display = 'block';
  errorMessage.textContent = message || t('errorGeneric');
}

function showContent() {
  const loadingContainer = document.getElementById('loadingContainer');
  const contentContainer = document.getElementById('contentContainer');
  
  loadingContainer.style.display = 'none';
  contentContainer.style.display = 'block';
}

// API functions
async function fetchWithTimeout(url, timeout = 15000, isDNS = false) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const headers = {
      'Accept': 'application/json',
    };
    
    // برای DNS over HTTPS، header خاص اضافه می‌کنیم
    if (isDNS) {
      headers['accept'] = 'application/dns-json';
    }
    
    const response = await fetch(url, {
      signal: controller.signal,
      headers: headers,
      mode: 'cors',
      cache: 'no-cache'
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

// استفاده از روش‌های ساده که در Extension کار می‌کنند
async function getIPAddresses(domain) {
  const ips = [];
  
  try {
    // روش 1: فقط نمایش اطلاعات اولیه از URL
    // در واقع ما نمی‌توانیم IP را بدون سرویس خارجی بگیریم
    // پس از اطلاعات موجود استفاده می‌کنیم
    
    console.log(`Attempting to resolve ${domain}`);
    
    // از آنجایی که API های عمومی مسدود هستند،
    // ما فقط می‌توانیم اطلاعات محدودی نمایش دهیم
    
    // نمایش یک IP placeholder
    console.log('Limited DNS resolution available');
    
    // اگر کاربر با VPN است، از crt.sh برای تخمین استفاده می‌کنیم
    try {
      const response = await fetchWithTimeout(
        `https://crt.sh/?q=${domain}&output=json`,
        8000
      );
      
      if (response.ok) {
        console.log('Certificate data available for additional info');
      }
    } catch (e) {
      console.log('Certificate lookup not available');
    }
    
    console.log('IP lookup completed with available methods');
    return ips;
  } catch (error) {
    console.error('Error fetching IPs:', error);
    return [];
  }
}

async function getIPInfo(ip) {
  try {
    // روش 1: استفاده از ipwhois.app (رایگان کامل)
    try {
      const response = await fetchWithTimeout(
        `http://ipwho.is/${ip}`,
        10000
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.success !== false) {
          return {
            country: data.country_code || 'نامشخص',
            countryName: data.country || 'نامشخص',
            isp: data.connection?.isp || data.connection?.org || 'نامشخص',
            hostname: data.connection?.domain || 'نامشخص'
          };
        }
      }
    } catch (e) {
      console.log('ipwho.is failed:', e);
    }
    
    // روش 2: استفاده از ip-api (بدون https)
    try {
      const response = await fetchWithTimeout(
        `http://ip-api.com/json/${ip}?fields=status,country,countryCode,city,isp,org,as,query`,
        10000
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          return {
            country: data.countryCode || 'نامشخص',
            countryName: data.country || 'نامشخص',
            isp: data.org || data.isp || 'نامشخص',
            hostname: data.isp || 'نامشخص'
          };
        }
      }
    } catch (e) {
      console.log('ip-api.com failed:', e);
    }
    
    // روش 3: استفاده از geoplugin
    try {
      const response = await fetchWithTimeout(
        `http://www.geoplugin.net/json.gp?ip=${ip}`,
        10000
      );
      
      if (response.ok) {
        const data = await response.json();
        return {
          country: data.geoplugin_countryCode || 'نامشخص',
          countryName: data.geoplugin_countryName || 'نامشخص',
          isp: 'نامشخص',
          hostname: 'نامشخص'
        };
      }
    } catch (e) {
      console.log('geoplugin failed:', e);
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching IP info:', error);
    return null;
  }
}

async function getNSRecords(domain) {
  const nsRecords = new Set();
  
  try {
    // روش 1: استفاده از viewdns.info
    try {
      const response = await fetchWithTimeout(
        `https://viewdns.info/dnsrecord/?domain=${domain}`,
        10000
      );
      
      if (response.ok) {
        const text = await response.text();
        // جستجو برای NS records در HTML
        const nsMatches = text.match(/NS Record:.*?<\/td>.*?<td[^>]*>(.*?)<\/td>/gi);
        if (nsMatches) {
          nsMatches.forEach(match => {
            const nsMatch = match.match(/<td[^>]*>([a-z0-9\.-]+\.[a-z]{2,})<\/td>/i);
            if (nsMatch && nsMatch[1]) {
              nsRecords.add(nsMatch[1]);
            }
          });
        }
      }
    } catch (e) {
      console.log('ViewDNS NS lookup failed:', e);
    }
    
    // روش 2: استفاده از who.is
    if (nsRecords.size === 0) {
      try {
        const response = await fetchWithTimeout(
          `https://www.who.is/dns/${domain}`,
          10000
        );
        
        if (response.ok) {
          const text = await response.text();
          // جستجو برای NS patterns
          const nsPattern = /ns\d*\.[a-z0-9\.-]+\.[a-z]{2,}/gi;
          const matches = text.match(nsPattern);
          if (matches) {
            matches.forEach(ns => nsRecords.add(ns.toLowerCase()));
          }
        }
      } catch (e) {
        console.log('Who.is NS lookup failed:', e);
      }
    }
    
    console.log('Found NS records:', Array.from(nsRecords));
    return Array.from(nsRecords);
  } catch (error) {
    console.error('Error fetching NS records:', error);
    return [];
  }
}

async function getSSLInfo(domain) {
  try {
    // Try crt.sh for SSL certificate info
    try {
      const response = await fetchWithTimeout(
        `https://crt.sh/?q=${domain}&output=json`,
        15000
      );
      
      if (response.ok) {
        const data = await response.json();
        
        if (data && data.length > 0) {
          // فیلتر کردن گواهی‌های منقضی نشده
          const validCerts = data.filter(cert => {
            const expiryDate = new Date(cert.not_after);
            return expiryDate > new Date();
          });
          
          if (validCerts.length > 0) {
            // Get the certificate with latest expiry
            const sortedCerts = validCerts.sort((a, b) => 
              new Date(b.not_after) - new Date(a.not_after)
            );
            
            const latestCert = sortedCerts[0];
            
            return {
              expiryDate: latestCert.not_after,
              issuer: latestCert.issuer_name || 'نامشخص',
              validFrom: latestCert.not_before
            };
          }
        }
      }
    } catch (e) {
      console.log('crt.sh SSL lookup failed:', e);
    }
    
    // Fallback: استفاده از API دیگر یا نمایش اطلاعات محدود
    console.log('SSL info not available via API');
    return null;
  } catch (error) {
    console.error('Error fetching SSL info:', error);
    return null;
  }
}

async function getDomainWhois(domain) {
  try {
    // استفاده از crt.sh برای تخمین عمر دامنه
    try {
      const response = await fetchWithTimeout(
        `https://crt.sh/?q=${domain}&output=json`,
        15000
      );
      
      if (response.ok) {
        const data = await response.json();
        
        if (data && data.length > 0) {
          // پیدا کردن قدیمی‌ترین گواهی
          const sortedCerts = data.sort((a, b) => 
            new Date(a.entry_timestamp) - new Date(b.entry_timestamp)
          );
          
          const oldestCert = sortedCerts[0];
          
          return {
            createdDate: oldestCert.entry_timestamp,
            expiryDate: null // Domain expiry is different from cert expiry
          };
        }
      }
    } catch (e) {
      console.log('crt.sh domain age lookup failed:', e);
    }
    
    console.log('Domain age info not available');
    return null;
  } catch (error) {
    console.error('Error fetching WHOIS info:', error);
    return null;
  }
}

// Display functions
function displayIPAddresses(ips) {
  const container = document.getElementById('ipAddresses');
  
  if (!ips || ips.length === 0) {
    container.innerHTML = '<div class="ip-item">هیچ آدرس IP یافت نشد</div>';
    return;
  }
  
  container.innerHTML = ips.map(({ ip, type }) => `
    <div class="ip-item">
      <span>${ip}</span>
      <span class="ip-type">${type}</span>
    </div>
  `).join('');
}

function displayLocationInfo(info, countryCode) {
  const flag = getCountryFlag(countryCode);
  
  // نمایش نام کشور
  const countryElement = document.getElementById('country');
  if (info && (info.countryName || countryCode)) {
    countryElement.innerHTML = `
      <span class="country-flag">${flag}</span>
      ${info.countryName || countryCode}
    `;
  } else {
    countryElement.textContent = 'نامشخص';
  }
  
  // نمایش ISP
  const ispElement = document.getElementById('isp');
  ispElement.textContent = (info && info.isp) ? info.isp : 'نامشخص';
  
  // نمایش Hostname
  const hostnameElement = document.getElementById('hostname');
  hostnameElement.textContent = (info && info.hostname) ? info.hostname : 'نامشخص';
}

function displayDomainInfo(whoisInfo) {
  const ageElement = document.getElementById('domainAge');
  const expiryElement = document.getElementById('expiryDate');
  
  if (whoisInfo && whoisInfo.createdDate) {
    ageElement.textContent = calculateDomainAge(whoisInfo.createdDate);
  } else {
    ageElement.textContent = 'نامشخص';
  }
  
  if (whoisInfo && whoisInfo.expiryDate) {
    const formattedDate = formatDate(whoisInfo.expiryDate);
    const daysRemaining = calculateDaysRemaining(whoisInfo.expiryDate);
    expiryElement.textContent = daysRemaining ? `${formattedDate} (${daysRemaining})` : formattedDate;
  } else {
    expiryElement.textContent = 'نامشخص';
  }
}

function displaySSLInfo(sslInfo) {
  const expiryElement = document.getElementById('sslExpiry');
  const issuerElement = document.getElementById('sslIssuer');
  
  if (sslInfo) {
    const formattedDate = formatDate(sslInfo.expiryDate);
    const daysRemaining = calculateDaysRemaining(sslInfo.expiryDate);
    expiryElement.textContent = daysRemaining ? `${formattedDate} (${daysRemaining})` : formattedDate;
    
    // Simplify issuer name
    let issuerName = sslInfo.issuer;
    if (issuerName.includes('CN=')) {
      const cnMatch = issuerName.match(/CN=([^,]+)/);
      if (cnMatch) {
        issuerName = cnMatch[1];
      }
    }
    issuerElement.textContent = issuerName;
  } else {
    expiryElement.textContent = 'نامشخص';
    issuerElement.textContent = 'نامشخص';
  }
}

function displayNSRecords(nsRecords) {
  const container = document.getElementById('nsRecords');
  
  if (!nsRecords || nsRecords.length === 0) {
    container.innerHTML = '<div class="ns-item">هیچ رکورد NS یافت نشد</div>';
    return;
  }
  
  container.innerHTML = nsRecords.map(ns => `
    <div class="ns-item">${ns}</div>
  `).join('');
}

// Main function - استفاده از Backend
async function loadDomainInfo() {
  try {
    // Get current tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab || !tab.url) {
      showError(t('errorLoading'));
      return;
    }
    
    // Extract domain (full hostname with subdomain)
    const domain = extractDomain(tab.url);
    
    if (!domain) {
      showError(t('errorLoading'));
      return;
    }
    
    // Display domain name
    document.getElementById('domainDisplay').textContent = domain;
    
    // Show content area
    showContent();
    
    // دریافت اطلاعات از Backend
    // Backend خودش تصمیم می‌گیرد کدام داده را از دامنه اصلی و کدام را از subdomain بگیرد
    try {
      const response = await fetchFromBackend(domain);
      
      console.log('📦 Backend response:', response);
      
      // Backend v2.0.0 returns data in 'data' object
      const backendData = response.data || response;
      
      // نمایش IP ها
      if (backendData.ips && backendData.ips.length > 0) {
        displayIPAddresses(backendData.ips.map(ip => ({
          ip: ip.ip,
          type: ip.type
        })));
      } else {
        displayIPAddresses([]);
      }
      
      // نمایش اطلاعات IP
      if (backendData.ip_info) {
        displayLocationInfo({
          country: backendData.ip_info.country_code,
          countryName: backendData.ip_info.country,
          isp: backendData.ip_info.isp,
          hostname: backendData.ip_info.hostname || 'نامشخص'
        }, backendData.ip_info.country_code);
      } else {
        displayLocationInfo(null, null);
      }
      
      // نمایش NS Records
      if (backendData.ns_records && backendData.ns_records.length > 0) {
        displayNSRecords(backendData.ns_records);
      } else {
        displayNSRecords([]);
      }
      
      // نمایش اطلاعات SSL
      if (backendData.ssl_info && backendData.ssl_info.valid) {
        displaySSLInfo({
          expiryDate: backendData.ssl_info.valid_to,
          issuer: backendData.ssl_info.issuer,
          validFrom: backendData.ssl_info.valid_from
        });
      } else {
        displaySSLInfo(null);
      }
      
      // نمایش عمر دامنه
      if (backendData.domain_age) {
        displayDomainInfo({
          createdDate: backendData.domain_age.created_date,
          expiryDate: backendData.domain_age.expiry_date || null
        });
      } else {
        displayDomainInfo(null);
      }
      
      // آیکون توسط background script تغییر می‌کند
      // نیازی به تغییر دستی نیست
      
    } catch (backendError) {
      console.error('Backend error:', backendError);
      showError(t('errorServer'));
    }
    
  } catch (error) {
    console.error('Error loading domain info:', error);
    showError(t('errorGeneric'));
  }
}

// Event listeners
document.addEventListener('DOMContentLoaded', async () => {
  const settings = await loadSettings();
  loadDomainInfo();
});

document.getElementById('refreshBtn').addEventListener('click', () => {
  // Reset to loading state
  document.getElementById('loadingContainer').style.display = 'flex';
  document.getElementById('contentContainer').style.display = 'none';
  document.getElementById('errorContainer').style.display = 'none';
  
  // Reload data
  loadDomainInfo();
});

document.getElementById('settingsBtn').addEventListener('click', () => {
  window.location.href = 'settings.html';
});

// Load and apply settings
async function loadSettings() {
  try {
    const settings = await chrome.storage.sync.get({
      language: 'en',
      flagIcon: true,
      theme: 'default',
      cache: true,
      cacheDuration: 300000
    });
    
    console.log('📚 Loading settings:', settings);
    console.log('🌍 Selected language:', settings.language);
    
    // Store current language globally
    window.currentLanguage = settings.language;
    
    // Apply language
    if (typeof applyTranslations === 'function') {
      console.log('✅ Applying translations for:', settings.language);
      applyTranslations(settings.language);
    } else {
      console.error('❌ applyTranslations is not a function!');
    }
    
    // Apply theme if needed
    if (settings.theme && settings.theme !== 'default') {
      applyTheme(settings.theme);
    }
    
    return settings;
    
  } catch (error) {
    console.error('Error loading settings:', error);
    window.currentLanguage = 'en';
    applyTranslations('en');
    return { language: 'en', flagIcon: true, theme: 'default', cache: true, cacheDuration: 300000 };
  }
}

// Apply theme colors
function applyTheme(theme) {
  const themes = {
    default: { primary: '#f16334', primaryDark: '#d94e1f' },
    blue: { primary: '#3b82f6', primaryDark: '#2563eb' },
    green: { primary: '#10b981', primaryDark: '#059669' },
    purple: { primary: '#8b5cf6', primaryDark: '#7c3aed' }
  };
  
  if (themes[theme]) {
    document.documentElement.style.setProperty('--primary-color', themes[theme].primary);
    document.documentElement.style.setProperty('--primary-dark', themes[theme].primaryDark);
  }
}

