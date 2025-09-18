// Configuration file for Chrome extension
const CONFIG = {
  // Backend API configuration
  API_BASE_URL: 'http://localhost:8082',
  API_ENDPOINTS: {
    COMPANIES: '/api/companies',
    SEARCH: '/api/companies/search',
    DOMAIN_LOOKUP: '/api/companies/domain',
    VERSION: '/api/data/version'
  },
  
  // Cache settings
  // Cache settings
  CACHE_DURATION: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  CACHE_KEY: 'sustainability_data_cache',
  CACHE_VERSION_KEY: 'sustainability_data_version',
  
  // Fallback settings (disabled - API only)
  USE_LOCAL_FALLBACK: false,
  
  // API settings
  REQUEST_TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 2,
  
  // Development settings
  DEBUG_MODE: false,
  LOG_API_CALLS: true
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
} else if (typeof window !== 'undefined') {
  window.CONFIG = CONFIG;
}