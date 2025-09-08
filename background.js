// Background service worker for Chrome extension

// Initialize extension
chrome.runtime.onInstalled.addListener(async () => {
  console.log('Website Tracker extension installed');
  
  // Set default settings
  await chrome.storage.sync.set({
    trackingEnabled: true,
    cookieManagementEnabled: true,
    urlParamsEnabled: true
  });
  
  const data = await chrome.storage.local.get(['visitHistory', 'cookieHistory']);
  if (!data.visitHistory) {
    await chrome.storage.local.set({ visitHistory: [] });
  }
  if (!data.cookieHistory) {
    await chrome.storage.local.set({ cookieHistory: [] });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'trackVisit':
      handleTrackVisit(request.data);
      break;
      
    case 'trackTimeSpent':
      handleTrackTimeSpent(request.data);
      break;
      
    case 'cookieChanged':
      handleCookieChange(request.data);
      break;
      
    case 'toggleTracking':
      handleToggleTracking(request.enabled);
      break;
      
    case 'manipulateCookies':
      handleCookieManipulation(request.data, sendResponse);
      return true; // Keep message channel open for async response
      
    case 'manipulateUrlParams':
      handleUrlParamManipulation(request.data, sendResponse);
      return true;
  }
});

async function handleTrackVisit(visitData) {
  try {
    const data = await chrome.storage.local.get(['visitHistory']);
    const history = data.visitHistory || [];
    
    history.push(visitData);
    
    if (history.length > 1000) {
      history.splice(0, history.length - 1000);
    }
    
    await chrome.storage.local.set({ visitHistory: history });
    
    console.log('Tracked visit:', visitData.url);
  } catch (error) {
    console.error('Error tracking visit:', error);
  }
}

async function handleTrackTimeSpent(timeData) {
  try {
    const data = await chrome.storage.local.get(['visitHistory']);
    const history = data.visitHistory || [];
    
    // Find the most recent visit for this URL and update time spent
    for (let i = history.length - 1; i >= 0; i--) {
      if (history[i].url === timeData.url && !history[i].timeSpent) {
        history[i].timeSpent = timeData.timeSpent;
        break;
      }
    }
    
    await chrome.storage.local.set({ visitHistory: history });
  } catch (error) {
    console.error('Error tracking time spent:', error);
  }
}

async function handleCookieChange(cookieData) {
  try {
    const settings = await chrome.storage.sync.get({ cookieManagementEnabled: true });
    if (!settings.cookieManagementEnabled) return;
    
    const data = await chrome.storage.local.get(['cookieHistory']);
    const history = data.cookieHistory || [];
    
    history.push(cookieData);
    
    // Keep only last 500 cookie changes
    if (history.length > 500) {
      history.splice(0, history.length - 500);
    }
    
    await chrome.storage.local.set({ cookieHistory: history });
  } catch (error) {
    console.error('Error tracking cookie change:', error);
  }
}

function handleToggleTracking(enabled) {
  console.log('Tracking toggled:', enabled);
  // Could implement additional logic here like clearing intervals, etc.
}

async function handleCookieManipulation(data, sendResponse) {
  try {
    const { url, action, cookieName, cookieValue, domain } = data;
    
    switch (action) {
      case 'set':
        await chrome.cookies.set({
          url: url,
          name: cookieName,
          value: cookieValue,
          domain: domain
        });
        break;
        
      case 'remove':
        await chrome.cookies.remove({
          url: url,
          name: cookieName
        });
        break;
        
      case 'clear':
        const cookies = await chrome.cookies.getAll({ url: url });
        for (const cookie of cookies) {
          await chrome.cookies.remove({
            url: url,
            name: cookie.name
          });
        }
        break;
    }
    
    sendResponse({ success: true });
  } catch (error) {
    console.error('Error manipulating cookies:', error);
    sendResponse({ success: false, error: error.message });
  }
}

async function handleUrlParamManipulation(data, sendResponse) {
  try {
    const { tabId, params } = data;
    
    // Inject script to manipulate URL parameters
    await chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: (params) => {
        const url = new URL(window.location);
        Object.entries(params).forEach(([key, value]) => {
          if (value === null) {
            url.searchParams.delete(key);
          } else {
            url.searchParams.set(key, value);
          }
        });
        window.history.pushState({}, '', url.toString());
      },
      args: [params]
    });
    
    sendResponse({ success: true });
  } catch (error) {
    console.error('Error manipulating URL parameters:', error);
    sendResponse({ success: false, error: error.message });
  }
}

// Tab update listener to track navigation
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // Track tab navigation
    const settings = await chrome.storage.sync.get({ trackingEnabled: true });
    if (settings.trackingEnabled) {
      console.log('Tab navigation:', tab.url);
    }
  }
});

// Cookie change listener
chrome.cookies.onChanged.addListener(async (changeInfo) => {
  const settings = await chrome.storage.sync.get({ cookieManagementEnabled: true });
  if (settings.cookieManagementEnabled) {
    console.log('Cookie changed:', changeInfo);
    
    // Store cookie change in history
    const data = await chrome.storage.local.get(['cookieHistory']);
    const history = data.cookieHistory || [];
    
    history.push({
      cookie: changeInfo.cookie,
      removed: changeInfo.removed,
      cause: changeInfo.cause,
      timestamp: Date.now()
    });
    
    if (history.length > 500) {
      history.splice(0, history.length - 500);
    }
    
    await chrome.storage.local.set({ cookieHistory: history });
  }
});