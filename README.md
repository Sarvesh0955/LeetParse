# Chrome Extension - Vite + React

A Chrome extension built with Vite and React (JavaScript).

## Directory Structure

```
/
├── public/
│   └── manifest.json          # Chrome extension manifest
├── src/
│   ├── popup/                 # Popup UI components
│   │   ├── App.jsx           # Main popup component
│   │   ├── App.css           # Popup styles
│   │   ├── index.css         # Global popup styles
│   │   └── main.jsx          # Popup entry point
│   ├── options/               # Options page components
│   │   ├── Options.jsx       # Main options component
│   │   ├── Options.css       # Options page styles
│   │   └── main.jsx          # Options page entry point
│   ├── content/              # Content scripts
│   │   └── content.js        # Content script for web pages
│   └── background/           # Background scripts
│       └── background.js     # Service worker
├── popup.html                # Popup HTML template
├── options.html              # Options page HTML template
├── package.json             # Dependencies and scripts
├── vite.config.js          # Vite configuration
└── README.md               # This file
```

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the extension:
   ```bash
   npm run build
   ```

3. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `dist` folder

## Development

Run in development mode:
```bash
npm run dev
```

Then build and reload the extension in Chrome to see changes.

## Features

- **Popup UI**: React-based popup interface
- **Options Page**: Settings configuration interface
- **Content Script**: Injects into web pages for DOM manipulation
- **Background Script**: Service worker for extension logic
- **Vite Build**: Fast development and optimized production builds
- **No TypeScript**: Pure JavaScript implementation
