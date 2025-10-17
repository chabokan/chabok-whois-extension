// Background Service Worker for Chabok WHOIS Extension

const domainCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000;

function extractDomain(url) {
  try {
    const urlObj = new URL(url);
    let hostname = urlObj.hostname;
    
    if (hostname === '' || 
        url.startsWith('chrome://') || 
        url.startsWith('chrome-extension://') ||
        url.startsWith('edge://') ||
        url.startsWith('about:') ||
        hostname === 'localhost' ||
        /^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
      return null;
    }
    
    return hostname;
    
  } catch (e) {
    return null;
  }
}

async function fetchDomainInfo(domain) {
  const cached = domainCache.get(domain);
  if (cached && (Date.now() - cached.timestamp < CACHE_DURATION)) {
    return cached.data;
  }
  
  try {
    const settings = await chrome.storage.sync.get({
      flagIcon: true
    });
    
    if (!settings.flagIcon) {
      return null;
    }
    
    const backendUrl = 'https://chabokan.net/domain-data/';
    const url = `${backendUrl}?domain=${encodeURIComponent(domain)}`;
    
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
      
      domainCache.set(domain, {
        data: result,
        timestamp: Date.now()
      });
      
      return result;
    }
    
    return null;
  } catch (error) {
    return null;
  }
}

async function updateIcon(countryCode, tabId) {
  if (!countryCode) {
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
      // Ignore errors
    }
    return;
  }
  
  try {
    const flagUrl = `https://flagcdn.com/48x36/${countryCode.toLowerCase()}.png`;
    
    await chrome.action.setIcon({
      tabId: tabId,
      path: flagUrl
    });
    
  } catch (error) {
    // Ignore errors
  }
}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    const domain = extractDomain(tab.url);
    
    if (!domain) {
      await updateIcon(null, tabId);
      return;
    }
    
    const info = await fetchDomainInfo(domain);
    if (info && info.country_code) {
      await updateIcon(info.country_code, tabId);
    } else {
      await updateIcon(null, tabId);
    }
  }
});

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
    
    const info = await fetchDomainInfo(domain);
    if (info && info.country_code) {
      await updateIcon(info.country_code, tabId);
    } else {
      await updateIcon(null, activeInfo.tabId);
    }
  } catch (error) {
    // Ignore errors
  }
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.flagIcon) {
    if (!changes.flagIcon.newValue) {
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach(tab => {
          updateIcon(null, tab.id);
        });
      });
    }
    
    domainCache.clear();
  }
});

setInterval(() => {
  const now = Date.now();
  for (const [domain, cached] of domainCache.entries()) {
    if (now - cached.timestamp > CACHE_DURATION) {
      domainCache.delete(domain);
    }
  }
}, 10 * 60 * 1000);
