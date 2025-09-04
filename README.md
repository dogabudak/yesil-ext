# Website Tracker & Cookie Manager Chrome Extension

A Chrome extension template for tracking website visits, manipulating cookies, and managing query parameters with a customizable popup interface.

## Features

- **Website Tracking**: Track visited websites with timestamps and time spent
- **Cookie Management**: View, clear, and manipulate cookies for current site
- **URL Parameter Tracking**: Monitor and modify query parameters
- **Customizable Interface**: Toggle features on/off from the popup
- **Data Export**: Export tracking data as JSON
- **Visit History**: View recent website visits

## Files Structure

- `manifest.json` - Extension configuration and permissions
- `popup.html` - Extension popup interface
- `popup.js` - Popup functionality and controls  
- `popup.css` - Styling for the popup interface
- `content.js` - Content script for website tracking
- `background.js` - Background service worker for data management
- `icons/` - Directory for extension icons (16x16, 48x48, 128x128)

## Installation

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked" and select this directory
4. The extension will appear in your browser toolbar

## Usage

1. Click the extension icon to open the popup
2. Toggle features on/off using the switches
3. View current site cookies and URL information
4. Clear cookies or export tracking data
5. View visit history by clicking "View History"

## Permissions

- `cookies` - Read and modify cookies
- `storage` - Store tracking data and settings
- `activeTab` - Access current tab information
- `tabs` - Monitor tab changes
- `scripting` - Inject scripts for URL manipulation
- `<all_urls>` - Access all websites for tracking

## Data Storage

- Visit history and settings stored locally
- Feature preferences synced across devices
- Automatic cleanup to prevent storage overflow

## Development

To modify the extension:
1. Edit the relevant files
2. Reload the extension in `chrome://extensions/`
3. Test functionality on various websites

## Note

You'll need to add actual icon files (icon16.png, icon48.png, icon128.png) to the `icons/` directory for the extension to display properly in the browser.# yesil-ext
