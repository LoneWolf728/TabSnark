# Passive-Aggressive Tab Manager

A Chrome extension that gently shames users for having too many open tabs with cheeky, passive-aggressive messages.

## Overview

This extension monitors the number of open tabs in your Chrome browser and displays increasingly snarky messages as you open more tabs. It's designed to help you become aware of your tab hoarding tendencies in a humorous way.

## Features

- 👀 Monitors the number of tabs open across all windows
- 🔔 Displays passive-aggressive notifications when you exceed certain thresholds
- 😏 Shows progressively snarkier messages as your tab count increases
- 🌟 Updates the extension badge with your current tab count
- ⚙️ Customizable thresholds and message intensity (optional)

## Installation

### For Development

1. Clone this repository:
   ```
   git clone https://github.com/LoneWolf728/TabSnark.git
   ```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable "Developer mode" by toggling the switch in the top right corner

4. Click "Load unpacked" and select the directory containing this extension

5. The extension should now be installed and active

### For Users (When Published)

1. Haven't published yet 🙂

## Usage

- The extension runs automatically in the background once installed
- Click on the extension icon to see your current tab count and a personalized passive-aggressive message
- The badge on the extension icon shows your current tab count
- Notifications will appear at certain thresholds to remind you of your tab addiction

## Development

### Project Structure

```
passive-aggressive-tab-manager/
│
├── manifest.json           # Extension configuration
├── background.js           # Background tab monitoring script
├── popup/
│   ├── popup.html          # Popup UI
│   ├── popup.css           # Popup styles
│   └── popup.js            # Popup logic
│
├── icons/                  # Extension icons
│
└── README.md               # This file
```

### Technologies Used

- JavaScript
- HTML/CSS
- Chrome Extension APIs

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by every browser session that ended with 50+ tabs
- Special thanks to all tab hoarders who refuse to acknowledge their problem