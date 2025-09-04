document.addEventListener('DOMContentLoaded', async () => {
  // Initialize popup
  await loadCurrentSiteInfo();
  await loadFeatureStates();
  setupEventListeners();
});

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
    
  } catch (error) {
    console.error('Error loading site info:', error);
  }
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