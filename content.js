let lastUrl = location.href;

function getCountryEmoji(countryCode) {
  if (!countryCode || countryCode.length !== 2) return '';
  
  const countryCodeMap = {
    'AD': '🇦🇩', 'AE': '🇦🇪', 'AF': '🇦🇫', 'AG': '🇦🇬', 'AI': '🇦🇮', 'AL': '🇦🇱', 'AM': '🇦🇲', 'AO': '🇦🇴', 'AQ': '🇦🇶', 'AR': '🇦🇷',
    'AS': '🇦🇸', 'AT': '🇦🇹', 'AU': '🇦🇺', 'AW': '🇦🇼', 'AX': '🇦🇽', 'AZ': '🇦🇿', 'BA': '🇧🇦', 'BB': '🇧🇧', 'BD': '🇧🇩', 'BE': '🇧🇪',
    'BF': '🇧🇫', 'BG': '🇧🇬', 'BH': '🇧🇭', 'BI': '🇧🇮', 'BJ': '🇧🇯', 'BL': '🇧🇱', 'BM': '🇧🇲', 'BN': '🇧🇳', 'BO': '🇧🇴', 'BQ': '🇧🇶',
    'BR': '🇧🇷', 'BS': '🇧🇸', 'BT': '🇧🇹', 'BV': '🇧🇻', 'BW': '🇧🇼', 'BY': '🇧🇾', 'BZ': '🇧🇿', 'CA': '🇨🇦', 'CC': '🇨🇨', 'CD': '🇨🇩',
    'CF': '🇨🇫', 'CG': '🇨🇬', 'CH': '🇨🇭', 'CI': '🇨🇮', 'CK': '🇨🇰', 'CL': '🇨🇱', 'CM': '🇨🇲', 'CN': '🇨🇳', 'CO': '🇨🇴', 'CR': '🇨🇷',
    'CU': '🇨🇺', 'CV': '🇨🇻', 'CW': '🇨🇼', 'CX': '🇨🇽', 'CY': '🇨🇾', 'CZ': '🇨🇿', 'DE': '🇩🇪', 'DJ': '🇩🇯', 'DK': '🇩🇰', 'DM': '🇩🇲',
    'DO': '🇩🇴', 'DZ': '🇩🇿', 'EC': '🇪🇨', 'EE': '🇪🇪', 'EG': '🇪🇬', 'EH': '🇪🇭', 'ER': '🇪🇷', 'ES': '🇪🇸', 'ET': '🇪🇹', 'FI': '🇫🇮',
    'FJ': '🇫🇯', 'FK': '🇫🇰', 'FM': '🇫🇲', 'FO': '🇫🇴', 'FR': '🇫🇷', 'GA': '🇬🇦', 'GB': '🇬🇧', 'GD': '🇬🇩', 'GE': '🇬🇪', 'GF': '🇬🇫',
    'GG': '🇬🇬', 'GH': '🇬🇭', 'GI': '🇬🇮', 'GL': '🇬🇱', 'GM': '🇬🇲', 'GN': '🇬🇳', 'GP': '🇬🇵', 'GQ': '🇬🇶', 'GR': '🇬🇷', 'GS': '🇬🇸',
    'GT': '🇬🇹', 'GU': '🇬🇺', 'GW': '🇬🇼', 'GY': '🇬🇾', 'HK': '🇭🇰', 'HM': '🇭🇲', 'HN': '🇭🇳', 'HR': '🇭🇷', 'HT': '🇭🇹', 'HU': '🇭🇺',
    'ID': '🇮🇩', 'IE': '🇮🇪', 'IL': '🇮🇱', 'IM': '🇮🇲', 'IN': '🇮🇳', 'IO': '🇮🇴', 'IQ': '🇮🇶', 'IR': '🇮🇷', 'IS': '🇮🇸', 'IT': '🇮🇹',
    'JE': '🇯🇪', 'JM': '🇯🇲', 'JO': '🇯🇴', 'JP': '🇯🇵', 'KE': '🇰🇪', 'KG': '🇰🇬', 'KH': '🇰🇭', 'KI': '🇰🇮', 'KM': '🇰🇲', 'KN': '🇰🇳',
    'KP': '🇰🇵', 'KR': '🇰🇷', 'KW': '🇰🇼', 'KY': '🇰🇾', 'KZ': '🇰🇿', 'LA': '🇱🇦', 'LB': '🇱🇧', 'LC': '🇱🇨', 'LI': '🇱🇮', 'LK': '🇱🇰',
    'LR': '🇱🇷', 'LS': '🇱🇸', 'LT': '🇱🇹', 'LU': '🇱🇺', 'LV': '🇱🇻', 'LY': '🇱🇾', 'MA': '🇲🇦', 'MC': '🇲🇨', 'MD': '🇲🇩', 'ME': '🇲🇪',
    'MF': '🇲🇫', 'MG': '🇲🇬', 'MH': '🇲🇭', 'MK': '🇲🇰', 'ML': '🇲🇱', 'MM': '🇲🇲', 'MN': '🇲🇳', 'MO': '🇲🇴', 'MP': '🇲🇵', 'MQ': '🇲🇶',
    'MR': '🇲🇷', 'MS': '🇲🇸', 'MT': '🇲🇹', 'MU': '🇲🇺', 'MV': '🇲🇻', 'MW': '🇲🇼', 'MX': '🇲🇽', 'MY': '🇲🇾', 'MZ': '🇲🇿', 'NA': '🇳🇦',
    'NC': '🇳🇨', 'NE': '🇳🇪', 'NF': '🇳🇫', 'NG': '🇳🇬', 'NI': '🇳🇮', 'NL': '🇳🇱', 'NO': '🇳🇴', 'NP': '🇳🇵', 'NR': '🇳🇷', 'NU': '🇳🇺',
    'NZ': '🇳🇿', 'OM': '🇴🇲', 'PA': '🇵🇦', 'PE': '🇵🇪', 'PF': '🇵🇫', 'PG': '🇵🇬', 'PH': '🇵🇭', 'PK': '🇵🇰', 'PL': '🇵🇱', 'PM': '🇵🇲',
    'PN': '🇵🇳', 'PR': '🇵🇷', 'PS': '🇵🇸', 'PT': '🇵🇹', 'PW': '🇵🇼', 'PY': '🇵🇾', 'QA': '🇶🇦', 'RE': '🇷🇪', 'RO': '🇷🇴', 'RS': '🇷🇸',
    'RU': '🇷🇺', 'RW': '🇷🇼', 'SA': '🇸🇦', 'SB': '🇸🇧', 'SC': '🇸🇨', 'SD': '🇸🇩', 'SE': '🇸🇪', 'SG': '🇸🇬', 'SH': '🇸🇭', 'SI': '🇸🇮',
    'SJ': '🇸🇯', 'SK': '🇸🇰', 'SL': '🇸🇱', 'SM': '🇸🇲', 'SN': '🇸🇳', 'SO': '🇸🇴', 'SR': '🇸🇷', 'SS': '🇸🇸', 'ST': '🇸🇹', 'SV': '🇸🇻',
    'SX': '🇸🇽', 'SY': '🇸🇾', 'SZ': '🇸🇿', 'TC': '🇹🇨', 'TD': '🇹🇩', 'TF': '🇹🇫', 'TG': '🇹🇬', 'TH': '🇹🇭', 'TJ': '🇹🇯', 'TK': '🇹🇰',
    'TL': '🇹🇱', 'TM': '🇹🇲', 'TN': '🇹🇳', 'TO': '🇹🇴', 'TR': '🇹🇷', 'TT': '🇹🇹', 'TV': '🇹🇻', 'TW': '🇹🇼', 'TZ': '🇹🇿', 'UA': '🇺🇦',
    'UG': '🇺🇬', 'UM': '🇺🇲', 'US': '🇺🇸', 'UY': '🇺🇾', 'UZ': '🇺🇿', 'VA': '🇻🇦', 'VC': '🇻🇨', 'VE': '🇻🇪', 'VG': '🇻🇬', 'VI': '🇻🇮',
    'VN': '🇻🇳', 'VU': '🇻🇺', 'WF': '🇼🇫', 'WS': '🇼🇸', 'YE': '🇾🇪', 'YT': '🇾🇹', 'ZA': '🇿🇦', 'ZM': '🇿🇲', 'ZW': '🇿🇼'
  };
  
  return countryCodeMap[countryCode.toUpperCase()] || '';
} 

let observer = new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    checkWebsiteAndShowInfo();
  }
});

observer.observe(document, { subtree: true, childList: true });

// Initialize when DOM is loaded or script runs (for dynamic pages)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', checkWebsiteAndShowInfo);
} else {
  checkWebsiteAndShowInfo();
}
// Listen for messages from popup or background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'getCurrentPageInfo':
      sendResponse({
        url: location.href,
        title: document.title,
        domain: location.hostname
      });
      break;

    case 'toggleAlwaysOn':
      checkWebsiteAndShowInfo();
      sendResponse({ success: true });
      break;

    default:
      sendResponse({ error: 'Unknown action' });
  }
});

async function getCompanyByDomain(domain) {
  try {
    const cacheKey = `company_${domain}`;
    const cachedCompany = await getDomainCachedData(cacheKey);
    if (cachedCompany !== undefined) {
      return cachedCompany;
    }

    // Fetch via background service worker to avoid HTTPS/HTTP issues
    const response = await chrome.runtime.sendMessage({
      action: 'fetchCompanyByDomain',
      domain: domain
    });

    if (response && response.data) {
      await setDomainCachedData(cacheKey, response.data);
      if (CONFIG.LOG_API_CALLS) {
        console.log('Loaded company from API:', response.data.company);
      }
      return response.data;
    } else {
      await setDomainCachedData(cacheKey, null);
      return null;
    }
  } catch (error) {
    console.error('API request failed:', error.message);
    return null;
  }
}

async function getDomainCachedData(cacheKey) {
  try {
    const result = await chrome.storage.local.get([cacheKey, `${cacheKey}_time`]);
    const cached = result[cacheKey];
    const cacheTime = result[`${cacheKey}_time`];
    
    if (cached !== undefined && cacheTime) {
      const age = Date.now() - cacheTime;
      if (age < CONFIG.CACHE_DURATION) {
        return cached; // Return cached data (could be null for "not found")
      }
    }
  } catch (error) {
    console.error('Error reading domain cache:', error);
  }
  return undefined; // Not cached or expired
}

async function setDomainCachedData(cacheKey, data) {
  try {
    await chrome.storage.local.set({
      [cacheKey]: data, // Store the data (null if not found)
      [`${cacheKey}_time`]: Date.now()
    });
  } catch (error) {
    console.error('Error setting domain cache:', error);
  }
}

function getCarbonNeutralAlternatives(companyData) {
  return companyData.carbon_neutral_alternatives || [];
}

async function checkWebsiteAndShowInfo() {
  const currentDomain = location.hostname.replace('www.', '');

  // Check if always-on mode is enabled
  const settings = await chrome.storage.sync.get({ alwaysOnEnabled: false });

  // Query specific domain from database
  const companyData = await getCompanyByDomain(currentDomain);

  if (companyData) {
    createWebsiteInfoPopup(companyData);
  } else if (settings.alwaysOnEnabled) {
    createUnknownGreenScorePopup(currentDomain);
  }
}

function createWebsiteInfoPopup(companyInfo) {
  // Remove existing popup if any
  const existingPopup = document.getElementById('website-info-popup');
  if (existingPopup) {
    existingPopup.remove();
  }

  const isCarbon = companyInfo.carbon_neutral;
  const countryFlag = getCountryEmoji(companyInfo.origin);

  // Get carbon neutral alternatives if the company is not carbon neutral
  let alternativesHtml = '';
  if (!isCarbon) {
    const alternatives = getCarbonNeutralAlternatives(companyInfo);
    if (alternatives.length > 0) {
      alternativesHtml = `
        <div class="gs-alternatives-section">
          <h3 class="gs-section-title">🌱 Green Alternatives</h3>
          <p class="gs-alternatives-subtitle">Consider these carbon-neutral options:</p>
          <div class="gs-alternatives-list">
            ${alternatives.map(alt => `
              <div class="gs-alt-card">
                <div class="gs-alt-info">
                  <div class="gs-alt-name">${alt.name}</div>
                  <div class="gs-alt-description">${alt.description || ''}</div>
                </div>
                <a href="${alt.url}" target="_blank" class="gs-alt-visit-btn">Visit</a>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
  }

  const popup = document.createElement('div');
  popup.id = 'website-info-popup';
  popup.innerHTML = `
    <style>
      #website-info-popup * { margin: 0; padding: 0; box-sizing: border-box; }
      #website-info-popup .gs-container {
        position: fixed;
        top: 20px;
        right: 20px;
        width: 360px;
        max-height: 580px;
        overflow-y: auto;
        background: #f0f4f0;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        z-index: 10000;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }
      #website-info-popup .gs-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px 16px;
        background: linear-gradient(135deg, #2d6a4f, #40916c);
        color: white;
        border-radius: 12px 12px 0 0;
      }
      #website-info-popup .gs-header-left {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      #website-info-popup .gs-header-icon { font-size: 20px; }
      #website-info-popup .gs-header h1 { font-size: 17px; font-weight: 600; }
      #website-info-popup .gs-close-btn {
        background: rgba(255,255,255,0.2);
        border: none;
        color: white;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      #website-info-popup .gs-close-btn:hover { background: rgba(255,255,255,0.3); }
      #website-info-popup .gs-content { padding: 16px; }
      #website-info-popup .gs-company-hero {
        background: white;
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 12px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      }
      #website-info-popup .gs-company-hero-top {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 12px;
      }
      #website-info-popup .gs-company-name { font-size: 18px; font-weight: 700; color: #1a1a1a; margin-bottom: 2px; }
      #website-info-popup .gs-company-domain { font-size: 12px; color: #888; }
      #website-info-popup .gs-country-flag { font-size: 36px; line-height: 1; }
      #website-info-popup .gs-carbon-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
      }
      #website-info-popup .gs-carbon-badge.positive { background: #d4edda; color: #155724; }
      #website-info-popup .gs-carbon-badge.negative { background: #f8d7da; color: #721c24; }
      #website-info-popup .gs-info-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
        margin-bottom: 12px;
      }
      #website-info-popup .gs-info-card {
        background: white;
        border-radius: 10px;
        padding: 12px;
        display: flex;
        align-items: flex-start;
        gap: 8px;
        box-shadow: 0 1px 4px rgba(0,0,0,0.06);
      }
      #website-info-popup .gs-info-card-icon { font-size: 18px; }
      #website-info-popup .gs-info-card-label { font-size: 10px; color: #999; text-transform: uppercase; margin-bottom: 2px; }
      #website-info-popup .gs-info-card-value { font-size: 13px; color: #333; font-weight: 500; }
      #website-info-popup .gs-sustainability-section {
        background: white;
        border-radius: 12px;
        padding: 14px 16px;
        margin-bottom: 12px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      }
      #website-info-popup .gs-section-title {
        font-size: 13px;
        font-weight: 600;
        color: #555;
        text-transform: uppercase;
        margin-bottom: 10px;
      }
      #website-info-popup .gs-meter-row {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
      }
      #website-info-popup .gs-meter-label { font-size: 12px; color: #555; min-width: 100px; }
      #website-info-popup .gs-meter-value { font-size: 13px; font-weight: 600; }
      #website-info-popup .gs-progress-bar-container {
        flex: 1;
        height: 8px;
        background: #e9ecef;
        border-radius: 4px;
        overflow: hidden;
      }
      #website-info-popup .gs-progress-bar {
        height: 100%;
        border-radius: 4px;
        background: linear-gradient(90deg, #40916c, #52b788);
      }
      #website-info-popup .gs-meter-percent { font-size: 12px; font-weight: 600; color: #40916c; min-width: 36px; text-align: right; }
      #website-info-popup .gs-alternatives-section {
        background: white;
        border-radius: 12px;
        padding: 14px 16px;
        margin-bottom: 12px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        border-left: 4px solid #40916c;
      }
      #website-info-popup .gs-alternatives-subtitle { font-size: 11px; color: #888; margin-bottom: 10px; }
      #website-info-popup .gs-alternatives-list { display: flex; flex-direction: column; gap: 8px; }
      #website-info-popup .gs-alt-card {
        display: flex;
        align-items: center;
        padding: 10px;
        background: #f0f9f4;
        border-radius: 8px;
        gap: 10px;
      }
      #website-info-popup .gs-alt-info { flex: 1; min-width: 0; }
      #website-info-popup .gs-alt-name { font-size: 13px; font-weight: 600; color: #1a1a1a; }
      #website-info-popup .gs-alt-description { font-size: 10px; color: #888; margin-top: 2px; }
      #website-info-popup .gs-alt-visit-btn {
        display: inline-flex;
        padding: 5px 10px;
        background: #40916c;
        color: white;
        text-decoration: none;
        border-radius: 6px;
        font-size: 11px;
        font-weight: 600;
      }
      #website-info-popup .gs-alt-visit-btn:hover { background: #2d6a4f; }
      #website-info-popup .gs-certifications-section {
        background: white;
        border-radius: 12px;
        padding: 14px 16px;
        margin-bottom: 12px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      }
      #website-info-popup .gs-cert-list { display: flex; flex-wrap: wrap; gap: 6px; }
      #website-info-popup .gs-cert-badge {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 4px 10px;
        background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
        border: 1px solid #a5d6a7;
        border-radius: 16px;
        font-size: 11px;
        font-weight: 600;
        color: #2e7d32;
      }
      #website-info-popup .gs-cert-badge.iso {
        background: linear-gradient(135deg, #e3f2fd, #bbdefb);
        border-color: #90caf9;
        color: #1565c0;
      }
      #website-info-popup .gs-cert-badge.ce {
        background: linear-gradient(135deg, #fff3e0, #ffe0b2);
        border-color: #ffcc80;
        color: #e65100;
      }
      #website-info-popup .gs-description-section {
        background: white;
        border-radius: 12px;
        padding: 14px 16px;
        margin-bottom: 12px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      }
      #website-info-popup .gs-description-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
      }
      #website-info-popup .gs-description-header .gs-section-title { margin-bottom: 0; }
      #website-info-popup .gs-lang-selector { display: flex; gap: 4px; }
      #website-info-popup .gs-lang-btn {
        padding: 4px 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        background: white;
        font-size: 10px;
        font-weight: 600;
        color: #666;
        cursor: pointer;
      }
      #website-info-popup .gs-lang-btn:hover { border-color: #40916c; color: #40916c; }
      #website-info-popup .gs-lang-btn.active { background: #40916c; border-color: #40916c; color: white; }
      #website-info-popup .gs-description-content {
        font-size: 12px;
        line-height: 1.6;
        color: #444;
        max-height: 100px;
        overflow-y: auto;
      }
      #website-info-popup .gs-data-info { text-align: center; padding: 8px 0 4px; font-size: 10px; color: #aaa; font-style: italic; }
      #website-info-popup ::-webkit-scrollbar { width: 5px; }
      #website-info-popup ::-webkit-scrollbar-track { background: transparent; }
      #website-info-popup ::-webkit-scrollbar-thumb { background: #ccc; border-radius: 3px; }
    </style>
    <div class="gs-container">
      <div class="gs-header">
        <div class="gs-header-left">
          <div class="gs-header-icon">🌿</div>
          <h1>Green Score</h1>
        </div>
        <button class="gs-close-btn" id="close-popup">✕</button>
      </div>
      <div class="gs-content">
        <div class="gs-company-hero">
          <div class="gs-company-hero-top">
            <div>
              <h2 class="gs-company-name">${companyInfo.company}</h2>
              <span class="gs-company-domain">${companyInfo.domain}</span>
            </div>
            ${countryFlag ? `<div class="gs-country-flag">${countryFlag}</div>` : ''}
          </div>
          <div class="gs-carbon-badge ${isCarbon ? 'positive' : 'negative'}">
            ${isCarbon ? '✓ Carbon Neutral' : '✗ Not Carbon Neutral'}
          </div>
        </div>

        <div class="gs-info-grid">
          <div class="gs-info-card">
            <div class="gs-info-card-icon">🏢</div>
            <div>
              <div class="gs-info-card-label">Sector</div>
              <div class="gs-info-card-value">${companyInfo.sector || 'N/A'}</div>
            </div>
          </div>
          <div class="gs-info-card">
            <div class="gs-info-card-icon">📍</div>
            <div>
              <div class="gs-info-card-label">Headquarters</div>
              <div class="gs-info-card-value">${companyInfo.headquarters || 'N/A'}</div>
            </div>
          </div>
          ${companyInfo.origin ? `
          <div class="gs-info-card">
            <div class="gs-info-card-icon">${countryFlag}</div>
            <div>
              <div class="gs-info-card-label">Country of Origin</div>
              <div class="gs-info-card-value">${companyInfo.origin}</div>
            </div>
          </div>
          ` : ''}
          ${companyInfo.parent ? `
          <div class="gs-info-card">
            <div class="gs-info-card-icon">🏛️</div>
            <div>
              <div class="gs-info-card-label">Parent Company</div>
              <div class="gs-info-card-value">${companyInfo.parent}</div>
            </div>
          </div>
          ` : ''}
        </div>

        <div class="gs-sustainability-section">
          <h3 class="gs-section-title">Sustainability</h3>
          <div class="gs-meter-row">
            <span class="gs-meter-label">Carbon Neutral</span>
            <span class="gs-meter-value">${isCarbon ? '✅ Yes' : '❌ No'}</span>
          </div>
          ${companyInfo.renewable_share_percent ? `
          <div class="gs-meter-row">
            <span class="gs-meter-label">Renewable Energy</span>
            <div class="gs-progress-bar-container">
              <div class="gs-progress-bar" style="width: ${companyInfo.renewable_share_percent}%"></div>
            </div>
            <span class="gs-meter-percent">${companyInfo.renewable_share_percent}%</span>
          </div>
          ` : ''}
        </div>

        ${generateCertificationsHtml(companyInfo.documents)}

        ${generateDescriptionHtml(companyInfo.description)}

        ${alternativesHtml}

        ${companyInfo.data_updated_date ? `<div class="gs-data-info">Data updated: ${new Date(companyInfo.data_updated_date).toLocaleDateString()}</div>` : ''}
      </div>
    </div>
  `;

  document.body.appendChild(popup);

  document.getElementById('close-popup').onclick = () => {
    popup.remove();
  };

  // Setup language buttons if description exists
  if (companyInfo.description && typeof companyInfo.description === 'object') {
    setupDescriptionLanguageButtons(companyInfo.description);
  }
}

function generateCertificationsHtml(documents) {
  if (!documents || !Array.isArray(documents) || documents.length === 0) {
    return '';
  }

  const badges = documents.map(doc => {
    const docUpper = doc.toUpperCase();
    let badgeClass = '';
    let icon = '📜';

    if (docUpper.includes('ISO')) {
      badgeClass = 'iso';
      icon = '🏅';
    } else if (docUpper === 'CE') {
      badgeClass = 'ce';
      icon = '🇪🇺';
    }

    return `<span class="gs-cert-badge ${badgeClass}">${icon} ${doc}</span>`;
  }).join('');

  return `
    <div class="gs-certifications-section">
      <h3 class="gs-section-title">Certifications</h3>
      <div class="gs-cert-list">${badges}</div>
    </div>
  `;
}

function generateDescriptionHtml(description) {
  if (!description || typeof description !== 'object') {
    return '';
  }

  const availableLangs = Object.keys(description);
  if (availableLangs.length === 0) return '';

  // Detect browser language or default to 'en'
  const browserLang = navigator.language.slice(0, 2).toLowerCase();
  const defaultLang = description[browserLang] ? browserLang : (description['en'] ? 'en' : availableLangs[0]);

  // Get initial description text
  let descText = description[defaultLang] || '';
  if (descText.length > 300) {
    descText = descText.substring(0, 300) + '...';
  }

  // Build language buttons
  const langButtons = ['en', 'tr', 'de']
    .filter(lang => availableLangs.includes(lang))
    .map(lang => `<button class="gs-lang-btn ${lang === defaultLang ? 'active' : ''}" data-lang="${lang}">${lang.toUpperCase()}</button>`)
    .join('');

  return `
    <div class="gs-description-section">
      <div class="gs-description-header">
        <h3 class="gs-section-title">About</h3>
        <div class="gs-lang-selector">${langButtons}</div>
      </div>
      <div class="gs-description-content" id="gs-description-text">${descText.replace(/\n/g, '<br>')}</div>
    </div>
  `;
}

function setupDescriptionLanguageButtons(description) {
  const buttons = document.querySelectorAll('#website-info-popup .gs-lang-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      let text = description[lang] || '';
      if (text.length > 300) {
        text = text.substring(0, 300) + '...';
      }

      document.getElementById('gs-description-text').innerHTML = text.replace(/\n/g, '<br>');

      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

function createUnknownGreenScorePopup(domain) {
  // Remove existing popup if any
  const existingPopup = document.getElementById('website-info-popup');
  if (existingPopup) {
    existingPopup.remove();
  }

  const popup = document.createElement('div');
  popup.id = 'website-info-popup';
  popup.innerHTML = `
    <style>
      #website-info-popup * { margin: 0; padding: 0; box-sizing: border-box; }
      #website-info-popup .gs-container {
        position: fixed;
        top: 20px;
        right: 20px;
        width: 360px;
        max-height: 580px;
        overflow-y: auto;
        background: #f0f4f0;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        z-index: 10000;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }
      #website-info-popup .gs-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px 16px;
        background: linear-gradient(135deg, #2d6a4f, #40916c);
        color: white;
        border-radius: 12px 12px 0 0;
      }
      #website-info-popup .gs-header-left {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      #website-info-popup .gs-header-icon { font-size: 20px; }
      #website-info-popup .gs-header h1 { font-size: 17px; font-weight: 600; }
      #website-info-popup .gs-close-btn {
        background: rgba(255,255,255,0.2);
        border: none;
        color: white;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      #website-info-popup .gs-close-btn:hover { background: rgba(255,255,255,0.3); }
      #website-info-popup .gs-content { padding: 16px; }
      #website-info-popup .gs-no-data-icon { font-size: 40px; text-align: center; margin: 20px 0 12px; }
      #website-info-popup .gs-no-data-title { font-size: 16px; font-weight: 600; color: #555; text-align: center; margin-bottom: 6px; }
      #website-info-popup .gs-no-data-domain { font-size: 13px; color: #999; text-align: center; margin-bottom: 8px; word-break: break-all; }
      #website-info-popup .gs-no-data-text { font-size: 12px; color: #999; text-align: center; line-height: 1.5; margin-bottom: 20px; }
      #website-info-popup .gs-help-card {
        background: white;
        border-radius: 12px;
        padding: 14px 16px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        border-left: 4px solid #40916c;
      }
      #website-info-popup .gs-help-title { font-size: 12px; font-weight: 600; color: #2d6a4f; margin-bottom: 6px; }
      #website-info-popup .gs-help-text { font-size: 11px; color: #666; line-height: 1.4; }
      #website-info-popup .gs-footer { font-size: 10px; color: #aaa; font-style: italic; text-align: center; margin-top: 12px; }
    </style>
    <div class="gs-container">
      <div class="gs-header">
        <div class="gs-header-left">
          <div class="gs-header-icon">🌿</div>
          <h1>Green Score</h1>
        </div>
        <button class="gs-close-btn" id="close-popup">✕</button>
      </div>
      <div class="gs-content">
        <div class="gs-no-data-icon">🔍</div>
        <h2 class="gs-no-data-title">No Data Available</h2>
        <p class="gs-no-data-domain">${domain}</p>
        <p class="gs-no-data-text">We don't have sustainability information for this website yet.</p>

        <div class="gs-help-card">
          <div class="gs-help-title">💡 Help us improve</div>
          <div class="gs-help-text">If you know about this company's sustainability practices, consider contributing to our database.</div>
        </div>

        <div class="gs-footer">Always-on mode is enabled</div>
      </div>
    </div>
  `;

  document.body.appendChild(popup);

  document.getElementById('close-popup').onclick = () => {
    popup.remove();
  };
}