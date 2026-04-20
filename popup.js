document.addEventListener('DOMContentLoaded', async () => {
  setupTabNavigation();
  await checkAuthState();
  setupLoginListeners();
  await loadCompanyData();
});

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
    const authData = await chrome.storage.local.get(['authToken', 'userEmail', 'authProvider', 'authTimestamp']);
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
}

function showProfileView(authData) {
  document.getElementById('account-login-view').style.display = 'none';
  document.getElementById('account-profile-view').style.display = 'block';

  const email = authData.userEmail || 'user@example.com';
  const provider = authData.authProvider || 'email';

  document.getElementById('profile-avatar-text').textContent = email.charAt(0).toUpperCase();
  document.getElementById('profile-name').textContent = email.split('@')[0];
  document.getElementById('profile-email').textContent = email;
  document.getElementById('profile-provider').textContent = provider.charAt(0).toUpperCase() + provider.slice(1);

  if (authData.authTimestamp) {
    document.getElementById('profile-member-since').textContent = new Date(authData.authTimestamp).toLocaleDateString();
  }
}

function setupLoginListeners() {
  document.getElementById('google-login-btn').addEventListener('click', () => handleMockLogin('google', 'user@gmail.com'));
  document.getElementById('facebook-login-btn').addEventListener('click', () => handleMockLogin('facebook', 'user@facebook.com'));
  document.getElementById('apple-login-btn').addEventListener('click', () => handleMockLogin('apple', 'user@apple.com'));
  document.getElementById('github-login-btn').addEventListener('click', () => handleMockLogin('github', 'user@github.com'));

  document.getElementById('email-login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email-input').value;
    await handleMockLogin('email', email);
  });

  document.getElementById('forgot-password-link').addEventListener('click', (e) => {
    e.preventDefault();
  });

  document.getElementById('create-account-link').addEventListener('click', (e) => {
    e.preventDefault();
  });

  document.getElementById('logout-btn').addEventListener('click', handleLogout);
}

async function handleMockLogin(provider, email) {
  try {
    const authData = {
      authToken: 'mock_token_' + Date.now(),
      userEmail: email,
      authProvider: provider,
      authTimestamp: Date.now()
    };
    await chrome.storage.local.set(authData);
    showProfileView(authData);
  } catch (error) {
    console.error('Login error:', error);
  }
}

async function handleLogout() {
  try {
    await chrome.storage.local.remove(['authToken', 'userEmail', 'authProvider', 'authTimestamp']);
    showLoginView();
  } catch (error) {
    console.error('Logout error:', error);
    await chrome.storage.local.remove(['authToken', 'userEmail', 'authProvider', 'authTimestamp']);
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
      document.getElementById('no-data-domain').textContent = 'Internal browser page';
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
    badge.innerHTML = `${leafIcon} <span>Carbon Neutral</span>`;
  } else {
    badge.className = 'carbon-badge negative';
    badge.innerHTML = `${cloudIcon} <span>Not Carbon Neutral</span>`;
  }

  // Sector
  document.getElementById('company-sector').textContent = data.sector || 'N/A';

  // HQ
  document.getElementById('company-hq').textContent = data.hq_city || 'N/A';

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
    cnValue.textContent = '✅ Yes';
    cnValue.style.color = '#28a745';
  } else {
    cnValue.textContent = '❌ No';
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
        <a href="${escapeHtml(alt.url)}" target="_blank" class="alt-visit-btn">Visit</a>
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

    // Get browser language or default to 'en'
    const browserLang = navigator.language.slice(0, 2).toLowerCase();
    const defaultLang = description[browserLang] ? browserLang : (description['en'] ? 'en' : Object.keys(description)[0]);

    // Display description in default language
    displayDescription(defaultLang);

    // Setup language buttons
    setupLanguageButtons(description, defaultLang);
  }

  // Data updated date
  if (data.data_updated_date) {
    document.getElementById('data-info-row').style.display = 'block';
    const date = new Date(data.data_updated_date);
    document.getElementById('data-updated-value').textContent = `Data updated: ${date.toLocaleDateString()}`;
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
