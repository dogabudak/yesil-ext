let CAMPAIGNS = [];

async function fetchCampaigns() {
  try {
    // Check cache first
    const cached = await chrome.storage.local.get(['campaigns_data', 'campaigns_data_time']);
    const cacheDuration = CONFIG.CAMPAIGNS_CACHE_DURATION || 60 * 60 * 1000;
    if (cached.campaigns_data && cached.campaigns_data_time) {
      const age = Date.now() - cached.campaigns_data_time;
      if (age < cacheDuration) {
        CAMPAIGNS = cached.campaigns_data;
        return;
      }
    }

    // Fetch from API via background service worker
    const response = await chrome.runtime.sendMessage({ action: 'fetchCampaigns' });

    if (response && response.data && Array.isArray(response.data) && response.data.length > 0) {
      CAMPAIGNS = response.data.map(c => ({
        id: c.slug,
        title: c.name,
        description: c.tagline,
        icon: c.icon,
        accentColor: c.accent_color || null
      }));

      // Update campaign colors from API accent_color
      response.data.forEach(c => {
        if (c.accent_color && c.slug) {
          CONFIG.CAMPAIGN_COLORS[c.slug] = {
            primary: c.accent_color,
            secondary: CONFIG.CAMPAIGN_COLORS[c.slug]?.secondary || c.accent_color
          };
        }
      });

      // Cache the result
      await chrome.storage.local.set({
        campaigns_data: CAMPAIGNS,
        campaigns_data_time: Date.now()
      });
    }
  } catch (error) {
    console.error('Error fetching campaigns:', error);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  await I18N.load();
  I18N.apply();
  setupUILangSelector();
  await loadAndApplyCampaignTheme();
  await fetchCampaigns();
  renderCampaignCards();
  setupCampaignListeners();
  setupTabNavigation();
  await checkAuthState();
  setupLoginListeners();
  await loadCompanyData();
});

// UI language selector (persists preference; reloads popup to re-render fully)
function setupUILangSelector() {
  const buttons = document.querySelectorAll('#ui-lang-selector .ui-lang-btn');
  buttons.forEach(btn => {
    const lang = btn.getAttribute('data-uilang');
    btn.classList.toggle('active', lang === I18N.getLang());
    btn.addEventListener('click', async () => {
      if (lang === I18N.getLang()) return;
      await I18N.save(lang);
      location.reload();
    });
  });
}

// Tab Navigation
function setupTabNavigation() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabName = button.getAttribute('data-tab');
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      button.classList.add('active');
      document.getElementById(`${tabName}-tab`).classList.add('active');
    });
  });
}

// Auth
async function checkAuthState() {
  try {
    const authData = await chrome.storage.local.get(['authToken', 'username', 'authProvider', 'authTimestamp']);
    if (authData.authToken) {
      showProfileView(authData);
    } else {
      showLoginView();
    }
  } catch (error) {
    console.error('Error checking auth state:', error);
    showLoginView();
  }
}

function showLoginView() {
  document.getElementById('account-login-view').style.display = 'block';
  document.getElementById('account-profile-view').style.display = 'none';
  showAuthForm('login');
}

function showAuthForm(mode) {
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const title = document.getElementById('auth-view-title');
  const toggleLink = document.getElementById('toggle-auth-view');

  hideAuthError();

  if (mode === 'signup') {
    loginForm.style.display = 'none';
    signupForm.style.display = 'flex';
    title.textContent = I18N.t('btn_create_account');
    toggleLink.textContent = I18N.t('link_back_to_login');
  } else {
    loginForm.style.display = 'flex';
    signupForm.style.display = 'none';
    title.textContent = I18N.t('auth_signin_title');
    toggleLink.textContent = I18N.t('link_create_account');
  }
}

function showProfileView(authData) {
  document.getElementById('account-login-view').style.display = 'none';
  document.getElementById('account-profile-view').style.display = 'block';

  const username = authData.username || 'User';

  document.getElementById('profile-avatar-text').textContent = username.charAt(0).toUpperCase();
  document.getElementById('profile-name').textContent = username;
  document.getElementById('profile-email').textContent = username;
  document.getElementById('profile-provider').textContent = I18N.t('provider_username_password');

  if (authData.authTimestamp) {
    document.getElementById('profile-member-since').textContent = new Date(authData.authTimestamp).toLocaleDateString();
  }
}

function showAuthError(message) {
  const errorEl = document.getElementById('auth-error');
  errorEl.textContent = message;
  errorEl.style.display = 'block';
}

function hideAuthError() {
  document.getElementById('auth-error').style.display = 'none';
}

function setupLoginListeners() {
  // Login form
  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    if (!username || !password) return;
    await handleLogin(username, password);
  });

  // Signup form
  document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('signup-username').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;

    if (!username || !password) return;
    if (password !== confirmPassword) {
      showAuthError(I18N.t('err_passwords_no_match'));
      return;
    }
    await handleSignup(username, password);
  });

  // Toggle login/signup
  document.getElementById('toggle-auth-view').addEventListener('click', (e) => {
    e.preventDefault();
    const loginForm = document.getElementById('login-form');
    const isLogin = loginForm.style.display !== 'none';
    showAuthForm(isLogin ? 'signup' : 'login');
  });

  document.getElementById('logout-btn').addEventListener('click', handleLogout);
}

async function handleLogin(username, password) {
  hideAuthError();
  try {
    const response = await chrome.runtime.sendMessage({
      action: 'loginUser',
      username,
      password
    });

    if (response.error) {
      showAuthError(response.error);
      return;
    }

    const authData = {
      authToken: response.token,
      username: username,
      authProvider: 'username',
      authTimestamp: Date.now()
    };
    await chrome.storage.local.set(authData);
    showProfileView(authData);
  } catch (error) {
    console.error('Login error:', error);
    showAuthError(I18N.t('err_login_failed'));
  }
}

async function handleSignup(username, password) {
  hideAuthError();
  try {
    const response = await chrome.runtime.sendMessage({
      action: 'signupUser',
      username,
      password
    });

    if (response.error) {
      showAuthError(response.error);
      return;
    }

    // Auto-login after successful signup
    await handleLogin(username, password);
  } catch (error) {
    console.error('Signup error:', error);
    showAuthError(I18N.t('err_signup_failed'));
  }
}

async function handleLogout() {
  try {
    await chrome.storage.local.remove(['authToken', 'username', 'authProvider', 'authTimestamp']);
    showLoginView();
  } catch (error) {
    console.error('Logout error:', error);
    await chrome.storage.local.remove(['authToken', 'username', 'authProvider', 'authTimestamp']);
    showLoginView();
  }
}

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

function getCountryName(code) {
  const names = {
    'US': 'United States', 'GB': 'United Kingdom', 'DE': 'Germany', 'FR': 'France', 'JP': 'Japan',
    'CN': 'China', 'KR': 'South Korea', 'CA': 'Canada', 'AU': 'Australia', 'BR': 'Brazil',
    'IN': 'India', 'IT': 'Italy', 'ES': 'Spain', 'NL': 'Netherlands', 'SE': 'Sweden',
    'CH': 'Switzerland', 'NO': 'Norway', 'DK': 'Denmark', 'FI': 'Finland', 'IE': 'Ireland',
    'AT': 'Austria', 'BE': 'Belgium', 'PT': 'Portugal', 'PL': 'Poland', 'CZ': 'Czech Republic',
    'RU': 'Russia', 'MX': 'Mexico', 'AR': 'Argentina', 'CL': 'Chile', 'CO': 'Colombia',
    'ZA': 'South Africa', 'NG': 'Nigeria', 'EG': 'Egypt', 'KE': 'Kenya', 'IL': 'Israel',
    'AE': 'UAE', 'SA': 'Saudi Arabia', 'TR': 'Turkey', 'TH': 'Thailand', 'SG': 'Singapore',
    'MY': 'Malaysia', 'ID': 'Indonesia', 'PH': 'Philippines', 'VN': 'Vietnam', 'TW': 'Taiwan',
    'HK': 'Hong Kong', 'NZ': 'New Zealand', 'GR': 'Greece', 'HU': 'Hungary', 'RO': 'Romania',
    'UA': 'Ukraine', 'HR': 'Croatia', 'SK': 'Slovakia', 'SI': 'Slovenia', 'BG': 'Bulgaria',
    'LT': 'Lithuania', 'LV': 'Latvia', 'EE': 'Estonia', 'LU': 'Luxembourg', 'IS': 'Iceland',
    'MT': 'Malta', 'CY': 'Cyprus'
  };
  return names[code?.toUpperCase()] || code;
}

function showView(viewId) {
  document.querySelectorAll('.state-view').forEach(v => v.style.display = 'none');
  document.getElementById(viewId).style.display = 'block';
}

async function loadCompanyData() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.url || tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
      showView('no-data-view');
      document.getElementById('no-data-domain').textContent = I18N.t('internal_browser_page');
      return;
    }

    const domain = new URL(tab.url).hostname.replace('www.', '');
    const companyData = await getCompanyByDomain(domain);

    if (companyData) {
      displayCompanyInfo(companyData);
      showView('company-view');
    } else {
      document.getElementById('no-data-domain').textContent = domain;
      showView('no-data-view');
    }
  } catch (error) {
    console.error('Error loading company data:', error);
    showView('error-view');
  }
}

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
      const cacheDuration = CONFIG.CACHE_DURATION || 24 * 60 * 60 * 1000;
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

function displayCompanyInfo(data) {
  // Company name & domain
  document.getElementById('company-name').textContent = data.company || 'Unknown';
  document.getElementById('company-domain').textContent = data.domain || '';

  // Country flag (large, in hero)
  const flagEl = document.getElementById('country-flag');
  if (data.origin) {
    flagEl.textContent = getCountryEmoji(data.origin);
  } else {
    flagEl.style.display = 'none';
  }

  // Carbon badge
  const badge = document.getElementById('carbon-badge');
  const leafIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8a8 8 0 0 1-10 10Z"/><path d="M11 20c-1.2 0-2 0-2-1.33s.8-2.67 2-4V20Z"/></svg>`;
  const cloudIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19a5.5 5.5 0 0 0 0-11h-1.3a8 8 0 1 0-14.5 4.5"/><path d="m11 13 3 3-3 3"/><path d="m11 16h9"/></svg>`;

  if (data.carbon_neutral) {
    badge.className = 'carbon-badge positive';
    badge.innerHTML = `${leafIcon} <span>${escapeHtml(I18N.t('badge_carbon_neutral'))}</span>`;
  } else {
    badge.className = 'carbon-badge negative';
    badge.innerHTML = `${cloudIcon} <span>${escapeHtml(I18N.t('badge_not_carbon_neutral'))}</span>`;
  }

  // Sector
  document.getElementById('company-sector').textContent = data.sector || I18N.t('na');

  // HQ
  document.getElementById('company-hq').textContent = data.headquarters || I18N.t('na');

  // Country of origin card
  if (data.origin) {
    const originCard = document.getElementById('origin-card');
    originCard.style.display = 'flex';
    document.getElementById('origin-flag-small').textContent = getCountryEmoji(data.origin);
    document.getElementById('company-origin').textContent = getCountryName(data.origin);
  }

  // Parent company card
  if (data.parent && data.parent !== 'Independent') {
    const parentCard = document.getElementById('parent-card');
    parentCard.style.display = 'flex';
    document.getElementById('company-parent').textContent = data.parent;
  }

  // Carbon neutral value
  const cnValue = document.getElementById('carbon-neutral-value');
  if (data.carbon_neutral) {
    cnValue.textContent = `✅ ${I18N.t('value_yes')}`;
    cnValue.style.color = '#28a745';
  } else {
    cnValue.textContent = `❌ ${I18N.t('value_no')}`;
    cnValue.style.color = '#dc3545';
  }

  // Renewable energy bar
  if (data.renewable_share_percent != null) {
    document.getElementById('renewable-row').style.display = 'flex';
    const pct = Math.min(100, Math.max(0, data.renewable_share_percent));
    document.getElementById('renewable-bar').style.width = pct + '%';
    document.getElementById('renewable-value').textContent = pct + '%';
  }

  // Alternatives
  const alternatives = data.carbon_neutral_alternatives || [];
  if (!data.carbon_neutral && alternatives.length > 0) {
    document.getElementById('alternatives-section').style.display = 'block';
    const list = document.getElementById('alternatives-list');
    list.innerHTML = alternatives.map(alt => `
      <div class="alt-card">
        <div class="alt-info">
          <div class="alt-name">${escapeHtml(alt.name)}</div>
          <div class="alt-description">${escapeHtml(alt.description || '')}</div>
        </div>
        <a href="${escapeHtml(alt.url)}" target="_blank" class="alt-visit-btn">${escapeHtml(I18N.t('btn_visit'))}</a>
      </div>
    `).join('');
  }

  // Certifications/Documents
  const documents = data.documents || [];
  if (documents.length > 0) {
    document.getElementById('certifications-section').style.display = 'block';
    const certList = document.getElementById('certifications-list');
    certList.innerHTML = documents.map(doc => {
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

      return `<span class="cert-badge ${badgeClass}"><span class="cert-badge-icon">${icon}</span>${escapeHtml(doc)}</span>`;
    }).join('');
  }

  // Description with language support
  const description = data.description;
  if (description && typeof description === 'object') {
    document.getElementById('description-section').style.display = 'block';

    // Store description data for language switching
    window.companyDescription = description;

    // Default the description to the chosen UI language when available
    const uiLang = I18N.getLang();
    const defaultLang = description[uiLang] ? uiLang : (description['en'] ? 'en' : Object.keys(description)[0]);

    // Display description in default language
    displayDescription(defaultLang);

    // Setup language buttons
    setupLanguageButtons(description, defaultLang);
  }

  // Data updated date
  if (data.data_updated_date) {
    document.getElementById('data-info-row').style.display = 'block';
    const date = new Date(data.data_updated_date);
    document.getElementById('data-updated-value').textContent = `${I18N.t('data_updated')}: ${date.toLocaleDateString()}`;
  }
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function displayDescription(lang) {
  const description = window.companyDescription;
  if (!description) return;

  const content = description[lang] || description['en'] || Object.values(description)[0] || '';
  const contentEl = document.getElementById('description-content');

  // Truncate if too long and format nicely
  let displayText = content;
  if (displayText.length > 500) {
    displayText = displayText.substring(0, 500) + '...';
  }

  // Replace newlines with <br> for proper formatting
  contentEl.innerHTML = escapeHtml(displayText).replace(/\n/g, '<br>');
}

// Campaign theme functions
async function loadAndApplyCampaignTheme() {
  try {
    const result = await chrome.storage.sync.get({ selectedCampaign: null });
    applyCampaignTheme(result.selectedCampaign);
  } catch (e) {
    console.error('Error loading campaign theme:', e);
  }
}

function applyCampaignTheme(campaignId) {
  const colors = (campaignId && CONFIG.CAMPAIGN_COLORS[campaignId]) || CONFIG.DEFAULT_THEME_COLORS;
  const style = document.documentElement.style;
  style.setProperty('--theme-primary', colors.primary);
  style.setProperty('--theme-secondary', colors.secondary);
  // Compute a lighter tertiary from secondary for gradient endpoints
  style.setProperty('--theme-tertiary', colors.secondary);
  updateCampaignDot(campaignId);
}

function updateCampaignDot(campaignId) {
  const dot = document.getElementById('score-campaign-dot');
  if (!dot) return;
  if (campaignId && CONFIG.CAMPAIGN_COLORS[campaignId]) {
    dot.classList.add('visible');
    dot.style.background = CONFIG.CAMPAIGN_COLORS[campaignId].primary;
  } else {
    dot.classList.remove('visible');
    dot.style.background = '';
  }
}

function renderCampaignCards() {
  const list = document.getElementById('campaigns-list');
  if (!list) return;

  chrome.storage.sync.get({ selectedCampaign: null }, (result) => {
    const selected = result.selectedCampaign;
    list.innerHTML = CAMPAIGNS.map(c => `
      <div class="campaign-card${c.id === selected ? ' selected' : ''}" data-campaign="${c.id}">
        <div class="campaign-card-icon">${c.icon}</div>
        <div class="campaign-card-content">
          <div class="campaign-card-title">${c.title}</div>
          <div class="campaign-card-desc">${c.description}</div>
        </div>
        <div class="campaign-card-check">${c.id === selected ? '\u2713' : ''}</div>
      </div>
    `).join('');

  });
}

function setupCampaignListeners() {
  const list = document.getElementById('campaigns-list');

  if (list) {
    list.addEventListener('click', (e) => {
      const card = e.target.closest('.campaign-card');
      if (!card) return;
      const campaignId = card.dataset.campaign;

      chrome.storage.sync.get({ selectedCampaign: null }, (result) => {
        // Toggle: if already selected, deselect
        const newSelection = result.selectedCampaign === campaignId ? null : campaignId;
        chrome.storage.sync.set({ selectedCampaign: newSelection }, () => {
          applyCampaignTheme(newSelection);
          renderCampaignCards();
        });
      });
    });
  }
}

function setupLanguageButtons(description, defaultLang) {
  const buttons = document.querySelectorAll('.lang-btn');
  const availableLangs = Object.keys(description);

  buttons.forEach(btn => {
    const lang = btn.getAttribute('data-lang');

    // Hide buttons for languages not available
    if (!availableLangs.includes(lang)) {
      btn.style.display = 'none';
      return;
    }

    // Set active state
    btn.classList.toggle('active', lang === defaultLang);

    // Add click handler
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      displayDescription(lang);
    });
  });
}
