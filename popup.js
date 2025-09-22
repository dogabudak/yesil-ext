document.addEventListener('DOMContentLoaded', async () => {
  await loadCurrentSiteInfo();
  await loadFeatureStates();
  setupEventListeners();
});

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
// TODO create a flow where user can define if this popup pops up on every website or only on specific websites (like not carbon neutral websites)
async function loadCurrentSiteInfo() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // Display current URL
    const urlElement = document.getElementById('current-url');
    urlElement.textContent = `URL: ${tab.url}`;
    
    // Get URL parameters
    const url = new URL(tab.url);
    const params = new URLSearchParams(url.search);
    if (params.toString()) {
      urlElement.textContent += `\nParams: ${params.toString()}`;
    }
    
    // Display cookies for current domain
    const cookies = await chrome.cookies.getAll({ url: tab.url });
    const cookiesElement = document.getElementById('current-cookies');
    cookiesElement.textContent = `Cookies: ${cookies.length} found`;
    
    // Load company information
    await loadCompanyInfo(tab.url);
    
  } catch (error) {
    console.error('Error loading site info:', error);
  }
}

async function getCompanyByDomain(domain) {
  try {
    const cacheKey = `company_${domain}`;
    const cachedCompany = await getDomainCachedData(cacheKey);
    if (cachedCompany) {
      return cachedCompany;
    }
    
    const apiUrl = `${CONFIG.API_BASE_URL}${CONFIG.API_ENDPOINTS.DOMAIN_LOOKUP}/${encodeURIComponent(domain)}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONFIG.REQUEST_TIMEOUT || 10000);
    
    const response = await fetch(apiUrl, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const result = await response.json();
      await setDomainCachedData(cacheKey, result);
      return result;
    } else if (response.status === 404) {
      await setDomainCachedData(cacheKey, null);
      return null;
    } else {
      throw new Error(`API request failed: ${response.status}`);
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
      const cacheDuration = 24 * 60 * 60 * 1000; // 24 hours
      if (age < cacheDuration) {
        return cached;
      }
    }
  } catch (error) {
    console.error('Error reading domain cache:', error);
  }
  return undefined;
}

async function setDomainCachedData(cacheKey, data) {
  try {
    await chrome.storage.local.set({
      [cacheKey]: data,
      [`${cacheKey}_time`]: Date.now()
    });
  } catch (error) {
    console.error('Error setting domain cache:', error);
  }
}

async function loadCompanyInfo(url) {
  try {
    const domain = new URL(url).hostname.replace('www.', '');
    const companyData = await getCompanyByDomain(domain);
    
    if (companyData) {
      displayCompanyInfo(companyData);
    }
  } catch (error) {
    console.error('Error loading company info:', error);
  }
}

function displayCompanyInfo(companyData) {
  const section = document.getElementById('product-info-section');
  section.style.display = 'block';
  
  document.getElementById('company-name').textContent = companyData.company;
  document.getElementById('company-domain').textContent = companyData.domain;
  document.getElementById('company-sector').textContent = companyData.sector || 'N/A';
  document.getElementById('company-hq').textContent = companyData.hq_city || 'N/A';
  document.getElementById('company-parent').textContent = companyData.parent || 'Independent';
  
  // Show country if available
  if (companyData.country_of_origin) {
    const countryRow = document.getElementById('country-row');
    const countryElement = document.getElementById('company-country');
    const countryEmoji = getCountryEmoji(companyData.country_of_origin);
    countryElement.textContent = `${countryEmoji} ${companyData.country_of_origin}`;
    countryRow.style.display = 'flex';
  }
  
  // Display sustainability info
  const sustainabilityStatus = document.getElementById('sustainability-status');
  const sustainabilityDetails = document.getElementById('sustainability-details');
  
  const isNeutral = companyData.carbon_neutral;
  sustainabilityStatus.style.backgroundColor = isNeutral ? '#28a745' : '#dc3545';
  
  let details = `Carbon Neutral: ${isNeutral ? '✅ Yes' : '❌ No'}`;
  if (companyData.renewable_share_percent) {
    details += `\nRenewable: ${companyData.renewable_share_percent}%`;
  }
  
  sustainabilityDetails.textContent = details;
}

async function loadFeatureStates() {
  const settings = await chrome.storage.sync.get({
    trackingEnabled: true,
    cookieManagementEnabled: true,
    urlParamsEnabled: true
  });
  
  document.getElementById('tracking-toggle').checked = settings.trackingEnabled;
  document.getElementById('cookie-management-toggle').checked = settings.cookieManagementEnabled;
  document.getElementById('url-params-toggle').checked = settings.urlParamsEnabled;
}

function setupEventListeners() {
  // Feature toggles
  document.getElementById('tracking-toggle').addEventListener('change', async (e) => {
    await chrome.storage.sync.set({ trackingEnabled: e.target.checked });
    chrome.runtime.sendMessage({ action: 'toggleTracking', enabled: e.target.checked });
  });
  
  document.getElementById('cookie-management-toggle').addEventListener('change', async (e) => {
    await chrome.storage.sync.set({ cookieManagementEnabled: e.target.checked });
  });
  
  document.getElementById('url-params-toggle').addEventListener('change', async (e) => {
    await chrome.storage.sync.set({ urlParamsEnabled: e.target.checked });
  });
  
  // Action buttons
  document.getElementById('clear-cookies').addEventListener('click', clearCookies);
  document.getElementById('export-data').addEventListener('click', exportData);
  document.getElementById('view-history').addEventListener('click', toggleHistory);
}

async function clearCookies() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const cookies = await chrome.cookies.getAll({ url: tab.url });
    
    for (const cookie of cookies) {
      await chrome.cookies.remove({
        url: tab.url,
        name: cookie.name
      });
    }
    
    alert(`Cleared ${cookies.length} cookies for ${new URL(tab.url).hostname}`);
    await loadCurrentSiteInfo();
  } catch (error) {
    console.error('Error clearing cookies:', error);
    alert('Error clearing cookies');
  }
}

async function exportData() {
  try {
    const data = await chrome.storage.local.get(['visitHistory', 'cookieHistory']);
    const exportData = {
      visitHistory: data.visitHistory || [],
      cookieHistory: data.cookieHistory || [],
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `website-tracker-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting data:', error);
    alert('Error exporting data');
  }
}

async function toggleHistory() {
  const historySection = document.getElementById('history-section');
  const isVisible = historySection.style.display !== 'none';
  
  if (!isVisible) {
    await loadVisitHistory();
    historySection.style.display = 'block';
  } else {
    historySection.style.display = 'none';
  }
}

async function loadVisitHistory() {
  try {
    const data = await chrome.storage.local.get(['visitHistory']);
    const history = data.visitHistory || [];
    
    const siteList = document.getElementById('site-list');
    siteList.innerHTML = '';
    
    if (history.length === 0) {
      siteList.innerHTML = '<div class="no-data">No visit history found</div>';
      return;
    }
    
    // Show last 10 visits
    const recentHistory = history.slice(-10).reverse();
    
    recentHistory.forEach(visit => {
      const visitElement = document.createElement('div');
      visitElement.className = 'visit-item';
      visitElement.innerHTML = `
        <div class="visit-url">${visit.url}</div>
        <div class="visit-time">${new Date(visit.timestamp).toLocaleString()}</div>
      `;
      siteList.appendChild(visitElement);
    });
  } catch (error) {
    console.error('Error loading visit history:', error);
  }
}