// تنظیمات Backend
const CONFIG = {
  // URL سرور backend
  BACKEND_URL: 'https://chabokan.net/domain-data/',
  
  // می‌توانید چند backend برای fallback داشته باشید
  FALLBACK_BACKENDS: [
    // سرورهای پشتیبان در صورت نیاز...
  ],
  
  // Timeout برای درخواست‌ها (میلی‌ثانیه)
  REQUEST_TIMEOUT: 15000,
  
  // فعال/غیرفعال کردن cache
  ENABLE_CACHE: true,
  CACHE_DURATION: 300000, // 5 دقیقه
};

// تابع برای دریافت URL backend
function getBackendURL() {
  return CONFIG.BACKEND_URL;
}

// تابع برای دریافت اطلاعات دامنه از backend
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
      return data.data;
    } else {
      throw new Error(data.error || 'Backend error');
    }
  } catch (error) {
    console.error('Backend fetch error:', error);
    
    // تلاش با fallback servers
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
            return data.data;
          }
        }
      } catch (e) {
        console.log('Fallback also failed:', e);
      }
    }
    
    throw error;
  }
}

