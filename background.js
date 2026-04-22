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
    case 'loginUser':
      handleLogin(request.username, request.password, sendResponse);
      return true;
    case 'signupUser':
      handleSignup(request.username, request.password, sendResponse);
      return true;
  }
});

async function handleLogin(username, password, sendResponse) {
  try {
    const response = await fetch(`${CONFIG.AUTH_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (response.ok) {
      const token = await response.text();
      sendResponse({ token: token.trim() });
    } else {
      const errorText = await response.text();
      sendResponse({ error: errorText || 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login request failed:', error.message);
    sendResponse({ error: 'Could not connect to auth service' });
  }
}

async function handleSignup(username, password, sendResponse) {
  try {
    const response = await fetch(`${CONFIG.USER_BASE_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: { username, password } })
    });

    const data = await response.json();
    if (response.ok) {
      sendResponse({ message: data.message || 'User registered successfully' });
    } else {
      sendResponse({ error: data.message || data.error || 'Signup failed' });
    }
  } catch (error) {
    console.error('Signup request failed:', error.message);
    sendResponse({ error: 'Could not connect to user service' });
  }
}

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
