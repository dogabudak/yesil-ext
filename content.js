// Content script for tracking website visits and URL changes
let lastUrl = location.href;
let visitStartTime = Date.now();

// Track initial page load
trackPageVisit();

// Track URL changes (for SPAs)
let observer = new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
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

// Track page unload
window.addEventListener('beforeunload', trackPageExit);

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