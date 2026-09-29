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
      handleLogin(request.email, request.password, sendResponse);
      return true;
    case 'signupUser':
      handleSignup(request.email, request.password, sendResponse);
      return true;
    case 'refreshSession':
      handleRefreshSession(request.refreshToken, sendResponse);
      return true;
    case 'logoutUser':
      handleLogout(request.accessToken, sendResponse);
      return true;
    case 'fetchCampaigns':
      handleFetchCampaigns(sendResponse);
      return true;
  }
});

// --- Supabase Auth (GoTrue REST) ---------------------------------------------
// Called over REST rather than @supabase/supabase-js: this extension has no
// bundler, and the client's default localStorage session store does not exist
// in an MV3 service worker.

function authHeaders(accessToken) {
  const headers = {
    'Content-Type': 'application/json',
    apikey: CONFIG.SUPABASE_ANON_KEY
  };

  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  return headers;
}

// GoTrue reports failures under several different keys depending on the endpoint.
function authErrorMessage(data, fallback) {
  if (!data) return fallback;

  return data.error_description || data.msg || data.message || data.error || fallback;
}

// A session is returned flat by /token and nested under `session` by /signup.
function extractSession(data) {
  const session = data && data.session ? data.session : data;

  if (!session || !session.access_token) return null;

  return {
    accessToken: session.access_token,
    refreshToken: session.refresh_token,
    // expires_in is seconds from now; store an absolute deadline instead.
    expiresAt: Date.now() + (session.expires_in || 3600) * 1000,
    email: (session.user && session.user.email) || (data.user && data.user.email) || null,
    userId: (session.user && session.user.id) || (data.user && data.user.id) || null
  };
}

async function authFetch(path, options) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CONFIG.REQUEST_TIMEOUT || 10000);

  try {
    const response = await fetch(`${CONFIG.SUPABASE_URL}${path}`, {
      ...options,
      signal: controller.signal
    });
    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    return { response, data };
  } finally {
    clearTimeout(timeoutId);
  }
}

async function handleLogin(email, password, sendResponse) {
  try {
    const { response, data } = await authFetch(
      `${CONFIG.AUTH_ENDPOINTS.TOKEN}?grant_type=password`,
      {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ email, password })
      }
    );

    if (!response.ok) {
      sendResponse({ error: authErrorMessage(data, 'Invalid credentials') });
      return;
    }

    const session = extractSession(data);
    if (!session) {
      sendResponse({ error: 'Auth service returned no session' });
      return;
    }

    sendResponse({ session });
  } catch (error) {
    console.error('Login request failed:', error.message);
    sendResponse({ error: 'Could not connect to auth service' });
  }
}

async function handleSignup(email, password, sendResponse) {
  try {
    const { response, data } = await authFetch(CONFIG.AUTH_ENDPOINTS.SIGNUP, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      sendResponse({ error: authErrorMessage(data, 'Signup failed') });
      return;
    }

    // With "Confirm email" enabled (the Supabase default) signup succeeds but
    // returns no session — the user has to click the link in their inbox first.
    const session = extractSession(data);

    sendResponse(session ? { session } : { confirmationRequired: true });
  } catch (error) {
    console.error('Signup request failed:', error.message);
    sendResponse({ error: 'Could not connect to auth service' });
  }
}

async function handleRefreshSession(refreshToken, sendResponse) {
  try {
    const { response, data } = await authFetch(
      `${CONFIG.AUTH_ENDPOINTS.TOKEN}?grant_type=refresh_token`,
      {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ refresh_token: refreshToken })
      }
    );

    if (!response.ok) {
      sendResponse({ error: authErrorMessage(data, 'Session expired') });
      return;
    }

    const session = extractSession(data);
    sendResponse(session ? { session } : { error: 'Session expired' });
  } catch (error) {
    console.error('Session refresh failed:', error.message);
    sendResponse({ error: 'Could not connect to auth service' });
  }
}

async function handleLogout(accessToken, sendResponse) {
  try {
    await authFetch(CONFIG.AUTH_ENDPOINTS.LOGOUT, {
      method: 'POST',
      headers: authHeaders(accessToken)
    });
  } catch (error) {
    // Revoking server-side is best effort — the popup clears local state regardless.
    console.error('Logout request failed:', error.message);
  }

  sendResponse({ ok: true });
}

async function handleFetchCampaigns(sendResponse) {
  try {
    const apiUrl = `${CONFIG.API_BASE_URL}${CONFIG.API_ENDPOINTS.CAMPAIGNS}/`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONFIG.REQUEST_TIMEOUT || 10000);

    const response = await fetch(apiUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.ok) {
      const result = await response.json();
      sendResponse({ data: result });
    } else {
      sendResponse({ data: null, error: `API ${response.status}` });
    }
  } catch (error) {
    console.error('Campaigns fetch failed:', error.message);
    sendResponse({ data: null, error: error.message });
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
