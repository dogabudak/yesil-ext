let lastUrl = location.href;
let visitStartTime = Date.now();
let websiteData = null; 

let observer = new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    checkWebsiteAndShowInfo();
    trackPageVisit();
  }
});

observer.observe(document, { subtree: true, childList: true });

// Track page visibility changes
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    trackPageExit();
  } else {
    visitStartTime = Date.now();
  }
});

window.addEventListener('beforeunload', trackPageExit);

// Initialize when DOM is loaded or script runs (for dynamic pages)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    checkWebsiteAndShowInfo();
    trackPageVisit();
  });
} else {
  // DOM already loaded
  checkWebsiteAndShowInfo();
  trackPageVisit();
}
async function trackPageVisit() {
  try {
    // Check if tracking is enabled
    const settings = await chrome.storage.sync.get({ trackingEnabled: true });
    if (!settings.trackingEnabled) return;
    
    const visitData = {
      url: location.href,
      title: document.title,
      timestamp: Date.now(),
      domain: location.hostname,
      path: location.pathname,
      search: location.search,
      referrer: document.referrer
    };
    
    // Get URL parameters if enabled
    const urlSettings = await chrome.storage.sync.get({ urlParamsEnabled: true });
    if (urlSettings.urlParamsEnabled && location.search) {
      visitData.parameters = Object.fromEntries(new URLSearchParams(location.search));
    }
    
    // Send to background script
    chrome.runtime.sendMessage({
      action: 'trackVisit',
      data: visitData
    });
    
    visitStartTime = Date.now();
  } catch (error) {
    console.error('Error tracking page visit:', error);
  }
}

function trackPageExit() {
  try {
    const timeSpent = Date.now() - visitStartTime;
    
    chrome.runtime.sendMessage({
      action: 'trackTimeSpent',
      data: {
        url: location.href,
        timeSpent: timeSpent,
        timestamp: Date.now()
      }
    });
  } catch (error) {
    console.error('Error tracking page exit:', error);
  }
}

// Listen for messages from popup or background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'getCurrentPageInfo':
      sendResponse({
        url: location.href,
        title: document.title,
        domain: location.hostname,
        cookies: document.cookie.split(';').length
      });
      break;
      
    case 'manipulateUrl':
      if (request.params) {
        const url = new URL(location.href);
        Object.entries(request.params).forEach(([key, value]) => {
          if (value === null) {
            url.searchParams.delete(key);
          } else {
            url.searchParams.set(key, value);
          }
        });
        history.pushState({}, '', url.toString());
        lastUrl = url.toString();
      }
      sendResponse({ success: true });
      break;
      
    case 'getCookies':
      sendResponse({
        cookies: document.cookie,
        count: document.cookie ? document.cookie.split(';').length : 0
      });
      break;
      
    default:
      sendResponse({ error: 'Unknown action' });
  }
});

// Track cookie changes
let lastCookieString = document.cookie;
setInterval(() => {
  if (document.cookie !== lastCookieString) {
    chrome.runtime.sendMessage({
      action: 'cookieChanged',
      data: {
        url: location.href,
        oldCookies: lastCookieString,
        newCookies: document.cookie,
        timestamp: Date.now()
      }
    });
    lastCookieString = document.cookie;
  }
}, 1000);

async function getCompanyByDomain(domain) {
  try {
    // Check domain-specific cache first
    const cacheKey = `company_${domain}`;
    const cachedCompany = await getDomainCachedData(cacheKey);
    if (cachedCompany) {
      console.log('Loaded company from cache:', cachedCompany.company);
      return cachedCompany;
    }
    
    // Query specific domain from API
    const apiUrl = `${CONFIG.API_BASE_URL}${CONFIG.API_ENDPOINTS.DOMAIN_LOOKUP}/${encodeURIComponent(domain)}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONFIG.REQUEST_TIMEOUT);
    
    const response = await fetch(apiUrl, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const result = await response.json();
      const company = result.data;
      
      // Cache the company data for this domain
      await setDomainCachedData(cacheKey, company);
      
      if (CONFIG.LOG_API_CALLS) {
        console.log('Loaded company from API:', company?.company || 'Not found');
      }
      return company;
    } else if (response.status === 404) {
      // Cache "not found" to avoid repeated requests
      await setDomainCachedData(cacheKey, null);
      console.log('Company not found for domain:', domain);
      return null;
    } else {
      throw new Error(`API request failed: ${response.status}`);
    }
  } catch (apiError) {
    console.error('API request failed:', apiError.message);
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

async function checkWebsiteAndShowInfo() {
  const currentDomain = location.hostname.replace('www.', '');
  console.log('Checking website for popup...', currentDomain);
  
  // Query specific domain from database
  const companyData = await getCompanyByDomain(currentDomain);
  
  if (companyData) {
    console.log('Company found:', companyData.company);
    createWebsiteInfoPopup(companyData);
  } else {
    console.log('No company data found for domain:', currentDomain);
  }
}

function createWebsiteInfoPopup(companyInfo) {
  // Remove existing popup if any
  const existingPopup = document.getElementById('website-info-popup');
  if (existingPopup) {
    existingPopup.remove();
  }

  const sustainabilityColor = companyInfo.carbon_neutral ? '#28a745' : '#dc3545';
  
  const popup = document.createElement('div');
  popup.id = 'website-info-popup';
  popup.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      background: white;
      border: 2px solid #007bff;
      border-radius: 10px;
      padding: 15px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      z-index: 10000;
      font-family: Arial, sans-serif;
      text-align: left;
      width: 300px;
      max-height: 400px;
      overflow-y: auto;
    ">
      <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 10px;">
        <div style="flex: 1;">
          <h3 style="color: #007bff; margin: 0; font-size: 16px;">${companyInfo.company}</h3>
          <p style="margin: 2px 0; color: #666; font-size: 12px;">${companyInfo.domain}</p>
        </div>
        <button id="close-popup" style="
          background: #ccc;
          color: #333;
          border: none;
          border-radius: 50%;
          width: 25px;
          height: 25px;
          cursor: pointer;
          font-size: 14px;
          margin-left: 10px;
        ">✕</button>
      </div>
      
      <div style="margin: 10px 0; font-size: 12px;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
          <div><strong>Sector:</strong> ${companyInfo.sector}</div>
          <div><strong>HQ:</strong> ${companyInfo.hq_city}</div>
          <div style="grid-column: 1 / -1;"><strong>Parent:</strong> ${companyInfo.parent || 'Independent'}</div>
        </div>
      </div>

      <div style="margin: 10px 0; padding: 8px; background: #f8f9fa; border-radius: 5px;">
        <div style="display: flex; align-items: center; margin-bottom: 5px;">
          <div style="width: 8px; height: 8px; border-radius: 50%; background: ${sustainabilityColor}; margin-right: 6px;"></div>
          <strong style="font-size: 12px;">Sustainability</strong>
        </div>
        <div style="font-size: 11px;">
          <div>Carbon Neutral: ${companyInfo.carbon_neutral ? '✅ Yes' : '❌ No'}</div>
          ${companyInfo.renewable_share_percent ? `<div>Renewable: ${companyInfo.renewable_share_percent}%</div>` : ''}
        </div>
      </div>

      ${companyInfo.data_confidence ? `<div style="font-size: 10px; color: #666; font-style: italic; margin-top: 8px;">Data confidence: ${companyInfo.data_confidence}</div>` : ''}
    </div>
  `;

  document.body.appendChild(popup);

  // Add click handlers
  document.getElementById('close-popup').onclick = () => {
    popup.remove();
  };
}