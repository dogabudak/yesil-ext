// Background service worker for Chrome extension
importScripts('config.js');

// Initialize extension
chrome.runtime.onInstalled.addListener(async () => {
  console.log('YesilDoga extension installed');
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'fetchCompanyByDomain':
      handleFetchCompany(request.domain, sendResponse);
      return true;
  }
});

async function handleFetchCompany(domain, sendResponse) {
  try {
    const apiUrl = `${CONFIG.API_BASE_URL}${CONFIG.API_ENDPOINTS.DOMAIN_LOOKUP}/${encodeURIComponent(domain)}/`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONFIG.REQUEST_TIMEOUT || 10000);

    const response = await fetch(apiUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.ok) {
      const result = await response.json();
      sendResponse({ data: result });
    } else if (response.status === 404) {
      sendResponse({ data: null });
    } else {
      sendResponse({ data: null, error: `API ${response.status}` });
    }
  } catch (error) {
    console.error('API fetch failed:', error.message);
    sendResponse({ data: null, error: error.message });
  }
}
