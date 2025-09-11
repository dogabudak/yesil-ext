# CLAUDE.md - Chrome Extension: Website Tracker & Cookie Manager

## Project Overview
This is a Chrome extension that disclose information for sustainability information.

## Architecture

### Core Files
- **manifest.json**: Extension configuration (Manifest V3)
- **background.js**: Service worker for data management and message handling
- **content.js**: Content script injected into all web pages for tracking and UI injection
- **popup.js**: Popup interface logic and controls
- **popup.html**: Extension popup HTML structure
- **popup.css**: Popup styling
- **config.js**: Configuration file for API endpoints and caching settings

### Key Features
1. **URL Parameter Tracking**: Monitor and modify query parameters
2. **Sustainability Info Display**: Shows company environmental data in an overlay popup
3. **Data Export**: Export tracking data as JSON files

## Technical Details

### Permissions Required
- `cookies`: Read and modify cookies across all websites
- `storage`: Store tracking data and user settings
- `activeTab`: Access current tab information
- `tabs`: Monitor tab changes for navigation tracking
- `scripting`: Inject scripts for URL parameter manipulation
- `<all_urls>`: Access all websites for comprehensive tracking

### Data Storage
- **Local Storage**: Visit history, cookie history (limited to 1000 visits, 500 cookie changes)
- **Sync Storage**: User preferences and feature toggles
- **Automatic Cleanup**: Prevents storage overflow with size limits

### Content Script Functionality
- **Page Visit Tracking**: Captures URL, title, timestamp, domain, path, search params, referrer
- **Cookie Monitoring**: Polls for cookie changes every 1000ms
- **URL Manipulation**: Handles query parameter modifications via history API
- **Company Info Display**: Creates overlay popup with sustainability data

### Background Service Worker
- **Data Management**: Stores and retrieves visit/cookie history
- **Cookie API Integration**: Handles cookie get/set/remove operations
- **Tab Monitoring**: Listens to tab updates and cookie changes

### Popup Interface
- **Current Site Info**: Displays URL, parameters, and cookie count
- **Action Buttons**: Clear cookies, export data, view history
- **Visit History**: Shows last 10 visits with timestamps

## Development Commands

### Installation & Testing
```bash
# Load extension in Chrome
# 1. Open chrome://extensions/
# 2. Enable Developer mode
# 3. Click "Load unpacked" and select project directory

# Test on various websites to verify tracking
# Check popup functionality and data export
```

### Data Management
The extension fetches company sustainability data from a backend API service and caches it locally in `data/data.json`. The data includes:
- Company domains and names
- Parent company relationships
- Headquarters locations
- Carbon neutrality status
- Renewable energy percentages
- Sector classifications
- ESG policy information

#### Backend Service Integration
- **API-Only Architecture**: Exclusively uses backend service for data (no local fallback)
- **Caching Strategy**: Local caching with periodic updates to minimize API calls
- **Data Freshness**: Configurable cache expiration and refresh intervals
- **Error Handling**: Graceful degradation when API is unavailable

### Code Style Notes
- Uses async/await for Chrome API calls
- Implements proper error handling with try/catch blocks
- Follows Chrome Extension Manifest V3 standards
- Uses modern JavaScript features (URLSearchParams, fetch API)
- Implements proper cleanup and memory management

### Security Considerations
- Requires broad permissions (`<all_urls>`) for comprehensive tracking
- Stores sensitive tracking data locally
- Accesses and manipulates cookies across all websites
- Injects content scripts into all web pages

## Backend Service Requirements
The extension requires a backend service that provides:
- RESTful API endpoint for company sustainability data
- Support for domain-based queries
- JSON response format matching the expected data structure
- Optional authentication and rate limiting
- Data versioning and update notifications

## Future Enhancements
- Real-time data updates from backend service
- Enhanced privacy controls and data retention policies
- Better data visualization in popup interface
- Advanced API integration features
- Offline mode with comprehensive local caching

## Usage Notes
- Extension icon appears in browser toolbar
- Click to open popup with current site information
- Toggle features on/off as needed
- Export data regularly for backup
- Monitor visit history through popup interface
- Company sustainability info appears automatically on matching websites