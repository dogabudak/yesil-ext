# CLAUDE.md - Chrome Extension: YesilDoga Green Score

## Project Overview
Chrome extension that displays sustainability scores and environmental data for companies as you browse the web.

## Architecture

### Core Files
- **manifest.json**: Extension configuration (Manifest V3)
- **background.js**: Service worker — handles API lookups via `fetchCompanyByDomain` message
- **content.js**: Content script injected into all web pages — detects domain, fetches company data, renders sustainability overlay popup
- **popup.js**: Popup interface logic and controls
- **popup.html**: Extension popup HTML structure
- **popup.css**: Popup styling
- **config.js**: Configuration file for API endpoints and caching settings

### Key Features
1. **Sustainability Info Display**: Shows company environmental data in a floating overlay popup
2. **Domain-based Lookup**: Automatically identifies the company behind any website via backend API
3. **Multi-language Support**: Company descriptions available in EN, TR, DE

## Technical Details

### Permissions Required
- `storage`: Cache API responses and user preferences
- `activeTab`: Access current tab URL for domain lookup
- `tabs`: Detect tab navigation to trigger lookups
- `<all_urls>` (host permission): Needed to inject content script and fetch company data on any website

### Data Storage
- **Local Storage**: Cached API responses (24-hour expiration via `CONFIG.CACHE_DURATION`)

### Content Script Functionality
- **Domain Detection**: Extracts domain from current page URL
- **Company Info Display**: Creates floating overlay popup with sustainability data (carbon neutral status, renewable energy %, certifications, alternatives)
- **SPA Navigation**: Mutation observer detects URL changes on single-page apps

### Background Service Worker
- **API Proxy**: Fetches company data from backend via `handleFetchCompany(domain)`
- **Timeout Handling**: 10-second abort controller on API requests

### Popup Interface
- **Current Site Info**: Displays current URL and company sustainability summary
- **Action Buttons**: Quick access to extension features

### Backend API
- **Base URL**: `https://yesildoga-api.onrender.com`
- **Domain Lookup**: `GET /api/companies/domain/{domain}/`
- **Company Search**: `GET /api/companies/search?q=...`
- **Data Version**: `GET /api/data/version`

## Development Commands

### Installation & Testing
```bash
# Load extension in Chrome
# 1. Open chrome://extensions/
# 2. Enable Developer mode
# 3. Click "Load unpacked" and select this directory

# Test on various websites to verify company data loads
# Check popup functionality and overlay rendering
```

### Code Style Notes
- Uses async/await for Chrome API calls
- Implements proper error handling with try/catch blocks
- Follows Chrome Extension Manifest V3 standards
- Uses modern JavaScript features (URLSearchParams, fetch API)
- API-only architecture — no local data fallback

### Security Considerations
- Requires `<all_urls>` host permission to function on any website
- No user tracking — only fetches company data by domain
- No cookies, no visit history, no personal data collection
- Content script injects UI overlay only (no page modification)
