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

function calculateDaysRemaining(expiryDate) {
  if (!expiryDate) return null;
  return formatRemainingTime(expiryDate, window.currentLanguage || 'en');
}

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

// fetchFromBackend is defined in config.js

// Display functions
function displayIPAddresses(ips) {
  const container = document.getElementById('ipAddresses');
  
  if (!ips || ips.length === 0) {
    container.innerHTML = `<div class="ip-item">${t('noIPFound')}</div>`;
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
  
  const countryElement = document.getElementById('country');
  if (info && (info.countryName || countryCode)) {
    countryElement.innerHTML = `
      <span class="country-flag">${flag}</span>
      ${info.countryName || countryCode}
    `;
  } else {
    countryElement.textContent = t('unknown');
  }
  
  const ispElement = document.getElementById('isp');
  ispElement.textContent = (info && info.isp) ? info.isp : t('unknown');
  
  const hostnameElement = document.getElementById('hostname');
  hostnameElement.textContent = (info && info.hostname) ? info.hostname : t('unknown');
}

function displayDomainInfo(whoisInfo) {
  const ageElement = document.getElementById('domainAge');
  const expiryElement = document.getElementById('expiryDate');
  
  if (whoisInfo && whoisInfo.createdDate) {
    ageElement.textContent = calculateDomainAge(whoisInfo.createdDate);
  } else {
    ageElement.textContent = t('unknown');
  }
  
  if (whoisInfo && whoisInfo.expiryDate) {
    const formattedDate = formatDate(whoisInfo.expiryDate);
    const daysRemaining = calculateDaysRemaining(whoisInfo.expiryDate);
    expiryElement.textContent = daysRemaining ? `${formattedDate} (${daysRemaining})` : formattedDate;
  } else {
    expiryElement.textContent = t('unknown');
  }
}

function displaySSLInfo(sslInfo) {
  const expiryElement = document.getElementById('sslExpiry');
  const issuerElement = document.getElementById('sslIssuer');
  
  if (sslInfo) {
    const formattedDate = formatDate(sslInfo.expiryDate);
    const daysRemaining = calculateDaysRemaining(sslInfo.expiryDate);
    expiryElement.textContent = daysRemaining ? `${formattedDate} (${daysRemaining})` : formattedDate;
    
    let issuerName = sslInfo.issuer;
    if (issuerName.includes('CN=')) {
      const cnMatch = issuerName.match(/CN=([^,]+)/);
      if (cnMatch) {
        issuerName = cnMatch[1];
      }
    }
    issuerElement.textContent = issuerName;
  } else {
    expiryElement.textContent = t('unknown');
    issuerElement.textContent = t('unknown');
  }
}

function displayNSRecords(nsRecords) {
  const container = document.getElementById('nsRecords');
  
  if (!nsRecords || nsRecords.length === 0) {
    container.innerHTML = `<div class="ns-item">${t('noNSFound')}</div>`;
    return;
  }
  
  container.innerHTML = nsRecords.map(ns => `
    <div class="ns-item">${ns}</div>
  `).join('');
}

// Main function
async function loadDomainInfo() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab || !tab.url) {
      showError(t('errorLoading'));
      return;
    }
    
    const domain = extractDomain(tab.url);
    
    if (!domain) {
      showError(t('errorLoading'));
      return;
    }
    
    document.getElementById('domainDisplay').textContent = domain;
    showContent();
    
    try {
      const response = await fetchFromBackend(domain);
      const backendData = response.data || response;
      
      if (backendData.ips && backendData.ips.length > 0) {
        displayIPAddresses(backendData.ips.map(ip => ({
          ip: ip.ip,
          type: ip.type
        })));
      } else {
        displayIPAddresses([]);
      }
      
      if (backendData.ip_info) {
        displayLocationInfo({
          country: backendData.ip_info.country_code,
          countryName: backendData.ip_info.country,
          isp: backendData.ip_info.isp,
          hostname: backendData.ip_info.hostname || t('unknown')
        }, backendData.ip_info.country_code);
      } else {
        displayLocationInfo(null, null);
      }
      
      if (backendData.ns_records && backendData.ns_records.length > 0) {
        displayNSRecords(backendData.ns_records);
      } else {
        displayNSRecords([]);
      }
      
      if (backendData.ssl_info && backendData.ssl_info.valid) {
        displaySSLInfo({
          expiryDate: backendData.ssl_info.valid_to,
          issuer: backendData.ssl_info.issuer,
          validFrom: backendData.ssl_info.valid_from
        });
      } else {
        displaySSLInfo(null);
      }
      
      if (backendData.domain_age) {
        displayDomainInfo({
          createdDate: backendData.domain_age.created_date,
          expiryDate: backendData.domain_age.expiry_date || null
        });
      } else {
        displayDomainInfo(null);
      }
      
    } catch (backendError) {
      showError(t('errorServer'));
    }
    
  } catch (error) {
    showError(t('errorGeneric'));
  }
}

// Event listeners
document.addEventListener('DOMContentLoaded', async () => {
  const settings = await loadSettings();
  loadDomainInfo();
});

document.getElementById('refreshBtn').addEventListener('click', () => {
  document.getElementById('loadingContainer').style.display = 'flex';
  document.getElementById('contentContainer').style.display = 'none';
  document.getElementById('errorContainer').style.display = 'none';
  loadDomainInfo();
});

document.getElementById('settingsBtn').addEventListener('click', () => {
  window.location.href = 'settings.html';
});

// Settings
async function loadSettings() {
  try {
    const settings = await chrome.storage.sync.get({
      language: 'en',
      flagIcon: true,
      theme: 'default',
      cache: true,
      cacheDuration: 300000
    });
    
    window.currentLanguage = settings.language;
    
    if (typeof applyTranslations === 'function') {
      applyTranslations(settings.language);
    }
    
    if (settings.theme && settings.theme !== 'default') {
      applyTheme(settings.theme);
    }
    
    return settings;
    
  } catch (error) {
    window.currentLanguage = 'en';
    applyTranslations('en');
    return { language: 'en', flagIcon: true, theme: 'default', cache: true, cacheDuration: 300000 };
  }
}

// Apply theme
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
