// Load saved settings
async function loadSettings() {
  try {
    const settings = await chrome.storage.sync.get({
      language: 'en',
      flagIcon: true,
      theme: 'default',
      cache: true,
      cacheDuration: 300000
    });
    
    // Set language
    document.getElementById('languageSelect').value = settings.language;
    applyTranslations(settings.language);
    
    // Set flag icon
    const flagToggle = document.getElementById('flagIconToggle');
    if (settings.flagIcon) {
      flagToggle.classList.add('active');
    } else {
      flagToggle.classList.remove('active');
    }
    
    // Set theme
    document.getElementById('themeSelect').value = settings.theme;
    
    // Set cache
    const cacheToggle = document.getElementById('cacheToggle');
    if (settings.cache) {
      cacheToggle.classList.add('active');
    } else {
      cacheToggle.classList.remove('active');
    }
    
    // Set cache duration
    document.getElementById('cacheDurationSelect').value = settings.cacheDuration;
    
  } catch (error) {
    console.error('Error loading settings:', error);
  }
}

// Save settings
async function saveSettings() {
  try {
    const settings = {
      language: document.getElementById('languageSelect').value,
      flagIcon: document.getElementById('flagIconToggle').classList.contains('active'),
      theme: document.getElementById('themeSelect').value,
      cache: document.getElementById('cacheToggle').classList.contains('active'),
      cacheDuration: parseInt(document.getElementById('cacheDurationSelect').value)
    };
    
    await chrome.storage.sync.set(settings);
    
    // Apply language and translations immediately
    applyTranslations(settings.language);
    
    // Show success message
    const savedMessage = document.getElementById('savedMessage');
    savedMessage.style.display = 'block';
    setTimeout(() => {
      savedMessage.style.display = 'none';
    }, 3000);
    
  } catch (error) {
    console.error('Error saving settings:', error);
    alert(t('errorGeneric'));
  }
}

// Toggle switches
function setupToggles() {
  const flagToggle = document.getElementById('flagIconToggle');
  const cacheToggle = document.getElementById('cacheToggle');
  
  flagToggle.addEventListener('click', () => {
    flagToggle.classList.toggle('active');
  });
  
  cacheToggle.addEventListener('click', () => {
    cacheToggle.classList.toggle('active');
  });
}

// Back button
document.getElementById('backBtn').addEventListener('click', () => {
  window.location.href = 'popup.html';
});

// Save button
document.getElementById('saveBtn').addEventListener('click', saveSettings);

// Language change
document.getElementById('languageSelect').addEventListener('change', (e) => {
  const lang = e.target.value;
  applyTranslations(lang);
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  setupToggles();
  loadSettings();
});

