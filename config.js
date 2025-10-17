// Backend Configuration
const CONFIG = {
  // Backend server URL - Update this to your backend URL
  BACKEND_URL: 'https://chabokan.net/domain-data/',
  
  // Fallback backends (optional)
  FALLBACK_BACKENDS: [],
  
  // Request timeout (milliseconds)
  REQUEST_TIMEOUT: 15000,
  
  // Cache settings
  ENABLE_CACHE: true,
  CACHE_DURATION: 300000, // 5 minutes
};

// Get backend URL
function getBackendURL() {
  return CONFIG.BACKEND_URL;
}

// Fetch domain information from backend
async function fetchFromBackend(domain) {
  const url = `${getBackendURL()}?domain=${encodeURIComponent(domain)}`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      timeout: CONFIG.REQUEST_TIMEOUT
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.success) {
      return data;
    } else {
      throw new Error(data.error || 'Backend error');
    }
  } catch (error) {
    // Try fallback servers
    for (const fallbackURL of CONFIG.FALLBACK_BACKENDS) {
      try {
        const url = `${fallbackURL}?domain=${encodeURIComponent(domain)}`;
        const response = await fetch(url, {
          method: 'GET',
          timeout: CONFIG.REQUEST_TIMEOUT
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            return data;
          }
        }
      } catch (e) {
        // Continue to next fallback
      }
    }
    
    throw error;
  }
}
