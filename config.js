// Configuration file for Chrome extension
const CONFIG = {
  // Backend API configuration
  API_BASE_URL: 'https://yesildoga-api.onrender.com',
  AUTH_BASE_URL: 'https://piarch-a-token-rs.onrender.com',
  USER_BASE_URL: 'http://localhost:3020', // TODO: Deploy user service to Render and update this URL
  API_ENDPOINTS: {
    COMPANIES: '/api/companies',
    SEARCH: '/api/companies/search',
    DOMAIN_LOOKUP: '/api/companies/domain',
    VERSION: '/api/data/version',
    CAMPAIGNS: '/api/campaigns'
  },

  // Cache settings
  CACHE_DURATION: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  CAMPAIGNS_CACHE_DURATION: 60 * 60 * 1000, // 1 hour in milliseconds
  CACHE_KEY: 'sustainability_data_cache',
  CACHE_VERSION_KEY: 'sustainability_data_version',
  
  // Fallback settings (disabled - API only)
  USE_LOCAL_FALLBACK: false,
  
  // API settings
  REQUEST_TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 2,
  
  // Development settings
  DEBUG_MODE: false,
  LOG_API_CALLS: false,

  // Campaign theme colors
  CAMPAIGN_COLORS: {
    forest:      { primary: '#0C6100', secondary: '#0d7a01' },
    seas:        { primary: '#23cafd', secondary: '#5dd8fd' },
    agriculture: { primary: '#dabc0c', secondary: '#e6cd3a' },
    education:   { primary: '#0015fa', secondary: '#3344ff' },
    charity:     { primary: '#6d836c', secondary: '#8a9f89' }
  },
  DEFAULT_THEME_COLORS: { primary: '#2d6a4f', secondary: '#40916c' }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
} else if (typeof window !== 'undefined') {
  window.CONFIG = CONFIG;
}