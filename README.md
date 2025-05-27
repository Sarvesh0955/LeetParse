# LeetCode Parser - Chrome Extension

A Chrome extension built with Vite and React that helps parse LeetCode problems and generates C++ boilerplate code.

## Directory Structure

```
/
├── public/
│   ├── manifest.json          # Chrome extension manifest
│   └── icons/                 # Extension icons
│       ├── icon16.png         # Small icon
│       ├── icon48.png         # Medium icon
│       └── icon128.png        # Large icon
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
│   │   └── content.js        # Content script for LeetCode pages
│   ├── background/           # Background scripts
│   │   └── background.js     # Service worker for code processing
│   └── utils/                # Utility modules
│       ├── codeGenerator.js  # Generates C++ boilerplate code
│       ├── extractor.js      # Extracts data from LeetCode DOM
│       ├── parser.js         # Parses extracted problem data
│       └── template.cpp      # C++ template file
├── popup.html                # Popup HTML template
├── options.html              # Options page HTML template
├── package.json              # Dependencies and scripts
├── vite.config.js            # Vite configuration
└── README.md                 # This file
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

## Usage

1. Navigate to a LeetCode problem page (https://leetcode.com/problems/*)
2. Click the LeetCode Parser extension icon in your browser toolbar
3. Click the "Parse Problem" button in the popup
4. The extension will extract:
   - Test cases from the problem
   - Solution template code
5. Use the "Copy Input" and "Copy Code" buttons to copy the test cases and generated boilerplate code
6. Paste the code into your preferred C++ environment for solving the problem

## Features

- **LeetCode Problem Parsing**: Parses LeetCode problem pages and extracts test cases and problem information
- **C++ Boilerplate Code Generation**: Automatically generates C++ boilerplate code for solving the LeetCode problem
- **Test Case Extraction**: Extracts test cases from the LeetCode problem page for easy testing
- **Copy to Clipboard**: One-click copy functionality for both generated code and test cases

## How It Works

1. **Content Script**: When the "Parse Problem" button is clicked, the content script activates on the LeetCode page and extracts:
   - The problem's solution function signature 
   - Required parameter types
   - Sample test cases

2. **Background Script**: Processes the extracted data and:
   - Converts LeetCode's format to a standardized C++ template
   - Automatically generates appropriate I/O handling code
   - Creates a ready-to-use solution template

3. **Popup Interface**: Displays the results and provides easy copy functionality for:
   - Generated C++ boilerplate code
   - Extracted test cases for testing your solution
