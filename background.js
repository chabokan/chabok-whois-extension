// Background Service Worker for Chabok WHOIS Extension
// Updates icon when tab changes or navigates

console.log('🚀 Chabok WHOIS Background Service started');

// Cache for domain info to avoid too many API calls
const domainCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Extract domain from URL (includes subdomain)
function extractDomain(url) {
  try {
    const urlObj = new URL(url);
    let hostname = urlObj.hostname;
    
    // Skip special URLs
    if (hostname === '' || 
        url.startsWith('chrome://') || 
        url.startsWith('chrome-extension://') ||
        url.startsWith('edge://') ||
        url.startsWith('about:') ||
        hostname === 'localhost' ||
        /^\d+\.\d+\.\d+\.\d+$/.test(hostname)) { // IP address
      return null;
    }
    
    return hostname;
    
  } catch (e) {
    console.error('Error extracting domain:', e);
    return null;
  }
}

// Fetch domain info from backend
async function fetchDomainInfo(domain) {
  // Check cache first
  const cached = domainCache.get(domain);
  if (cached && (Date.now() - cached.timestamp < CACHE_DURATION)) {
    console.log('📦 Using cached data for:', domain);
    return cached.data;
  }
  
  try {
    // Get backend URL from storage or use default
    const settings = await chrome.storage.sync.get({
      flagIcon: true
    });
    
    // If flag icon is disabled, don't fetch
    if (!settings.flagIcon) {
      console.log('🚫 Flag icon disabled');
      return null;
    }
    
    // Fetch from backend
    const backendUrl = 'https://chabokan.net/domain-data/';
    const url = `${backendUrl}?domain=${encodeURIComponent(domain)}`;
    
    console.log('🌐 Fetching info for:', domain);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.success && data.data && data.data.ip_info) {
      const result = {
        country_code: data.data.ip_info.country_code,
        country: data.data.ip_info.country
      };
      
      // Cache the result
      domainCache.set(domain, {
        data: result,
        timestamp: Date.now()
      });
      
      return result;
    }
    
    return null;
  } catch (error) {
    console.error('❌ Error fetching domain info:', error);
    return null;
  }
}

// Update extension icon with country flag
async function updateIcon(countryCode, tabId) {
  if (!countryCode) {
    // Reset to default icon
    try {
      await chrome.action.setIcon({
        tabId: tabId,
        path: {
          16: 'icons/icon16.png',
          32: 'icons/icon32.png',
          48: 'icons/icon48.png',
          128: 'icons/icon128.png'
        }
      });
    } catch (e) {
      console.error('Error resetting icon:', e);
    }
    return;
  }
  
  try {
    // Use flag from Flagcdn
    const flagUrl = `https://flagcdn.com/48x36/${countryCode.toLowerCase()}.png`;
    
    console.log('🚩 Setting flag icon:', countryCode);
    
    await chrome.action.setIcon({
      tabId: tabId,
      path: flagUrl
    });
    
  } catch (error) {
    console.error('❌ Error setting flag icon:', error);
  }
}

// Handle tab updates (navigation, reload)
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // Only process when page is complete and has a valid URL
  if (changeInfo.status === 'complete' && tab.url) {
    const domain = extractDomain(tab.url);
    
    if (!domain) {
      console.log('⚠️ No valid domain for tab:', tabId);
      await updateIcon(null, tabId);
      return;
    }
    
    console.log('📍 Tab updated:', domain);
    
    // Fetch domain info and update icon
    // Backend will handle extracting main domain for country info
    const info = await fetchDomainInfo(domain);
    if (info && info.country_code) {
      await updateIcon(info.country_code, tabId);
    } else {
      await updateIcon(null, tabId);
    }
  }
});

// Handle tab activation (switching between tabs)
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    
    if (!tab.url) {
      return;
    }
    
    const domain = extractDomain(tab.url);
    
    if (!domain) {
      await updateIcon(null, activeInfo.tabId);
      return;
    }
    
    console.log('🔄 Tab activated:', domain);
    
    // Fetch domain info and update icon
    // Backend will handle extracting main domain for country info
    const info = await fetchDomainInfo(domain);
    if (info && info.country_code) {
      await updateIcon(info.country_code, tabId);
    } else {
      await updateIcon(null, activeInfo.tabId);
    }
  } catch (error) {
    console.error('Error handling tab activation:', error);
  }
});

// Listen for settings changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.flagIcon) {
    console.log('🔧 Flag icon setting changed:', changes.flagIcon.newValue);
    
    // If disabled, reset all icons
    if (!changes.flagIcon.newValue) {
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach(tab => {
          updateIcon(null, tab.id);
        });
      });
    }
    
    // Clear cache when settings change
    domainCache.clear();
  }
});

// Clean cache periodically (every 10 minutes)
setInterval(() => {
  const now = Date.now();
  for (const [domain, cached] of domainCache.entries()) {
    if (now - cached.timestamp > CACHE_DURATION) {
      domainCache.delete(domain);
    }
  }
  console.log('🧹 Cache cleaned. Current size:', domainCache.size);
}, 10 * 60 * 1000);

console.log('✅ Background service initialized');

