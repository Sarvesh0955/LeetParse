# LeetParse - Chrome Extension

<p align="center">
   <img src="public/icons/icon2.png" alt="LeetParse Logo" width="128">
</p>

A powerful Chrome extension built with Vite and React that helps competitive programmers parse LeetCode problems and generate ready-to-use boilerplate code with test cases.

## 📝 Description

LeetParse is a developer-oriented Chrome extension that streamlines the process of solving LeetCode problems in your own development environment. It automatically extracts problem details, generates boilerplate code with proper input/output handling, and formats test cases for easy testing.

## ✨ Features

- **One-Click Problem Parsing**: Extract all necessary information from LeetCode problem pages with a single click
- **Automatic Code Template Generation**: Generate complete, compilable code with:
  - Solution function signature automatically extracted from the problem
  - Standard input/output handling code included
  - Support for standard data structures (vectors, maps, strings, etc.)
  - Support for LeetCode special data structures (ListNode, TreeNode)
- **Sample Test Output Extraction**: Automatically extract expected outputs from problem examples:
  - Parse "Output:" values from example blocks in problem descriptions
  - Send both inputs and expected outputs to CPH (Competitive Programming Helper)
  - Enable seamless integration with competitive programming workflows
- **CPH Integration**: One-click export to Competitive Companion for VS Code:
  - Automatically format test cases with both input and expected output
  - Support for multiple test cases from sample examples
  - Direct integration with competitive programming extensions
- **Theme Support**: Choose between:
  - Light mode
  - Dark mode
  - System preference
- **Complex Data Structure Support**: Automatically handle:
  - Linked Lists (ListNode)
  - Binary Trees (TreeNode)
  - Nested vectors/arrays
  - Strings and characters
  - Integer types of various sizes
  - Hash maps and sets
- **Template Customization**: Modify code templates to match your coding style
- **Language Selection**: Support for multiple programming languages (extensible architecture)

## 🏗️ Project Structure

```
leetparse/
├── public/              # Static assets and manifest
│   ├── icons/          # Extension icons
│   └── manifest.json   # Chrome extension manifest
│
├── src/
│   ├── background/     # Background service worker
│   │   ├── index.js
│   │   └── messageHandlers/  # Message handling modules
│   │
│   ├── content/        # Content script
│   │   ├── index.js
│   │   ├── parser/     # DOM parsing logic
│   │   └── messenger.js
│   │
│   ├── ui/             # React UI components
│   │   ├── popup/      # Popup UI
│   │   ├── options/    # Options page
│   │   └── common/     # Shared components, hooks, theme
│   │
│   ├── core/           # Pure business logic (browser API-free)
│   │   ├── codegen/    # Code generation
│   │   ├── languages/  # Language templates
│   │   └── utils/      # Parser and extractor utilities
│   │
│   ├── messaging/      # Message type constants and router
│   └── utils/          # General utilities
│
├── tests/              # Unit tests
├── popup.html          # Popup entry HTML
├── options.html        # Options entry HTML
├── vite.config.js      # Vite build configuration
└── package.json
```

## 🚀 Installation

### Method 1: From Chrome Web Store (Recommended)
*Coming soon - Extension is currently in development*

### Method 2: From Source (Development)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Sarvesh0955/leetparse.git
   cd leetparse
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build the extension:**
   ```bash
   npm run build
   ```

4. **Load the extension in Chrome:**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top-right corner
   - Click "Load unpacked" and select the `dist` folder created by the build
   - The extension icon should appear in your browser toolbar

## 🔧 Development

### Development Mode
Run the development server:
```bash
npm run dev
```

This will start Vite's dev server. Note that for full extension functionality, you'll still need to load the built `dist/` folder as an unpacked extension.

### Build for Production
```bash
npm run build
```

Output will be in the `dist/` directory, ready to be loaded as an unpacked extension.

### Project Architecture

- **Background Script** (`src/background/`): Handles message routing, code generation, and extension lifecycle
- **Content Script** (`src/content/`): Runs on LeetCode pages to extract problem information
- **UI Components** (`src/ui/`): React-based popup and options interfaces
- **Core Logic** (`src/core/`): Pure JavaScript modules for parsing and code generation
- **Messaging** (`src/messaging/`): Centralized message type definitions for type safety

### Adding New Language Support

To add support for a new programming language:

1. Create a template file in `src/core/languages/` (e.g., `python.template.py`)
2. Update `src/core/codegen/index.js` to handle the new language
3. Add language option to the options page UI

### Extending Functionality

The modular structure makes it easy to:
- Add new message types in `src/messaging/messages.js`
- Create new message handlers in `src/background/messageHandlers/`
- Add new UI components in `src/ui/popup/components/` or `src/ui/options/components/`
- Extend parsing logic in `src/content/parser/`

### Running Tests

Tests are currently scaffolded. To set up:

1. Install test dependencies:
```bash
npm install --save-dev jest @babel/preset-env @babel/preset-react
```

2. Run tests:
```bash
npm test
```

See `tests/README.md` for more details.

## 📦 Build Output

The `dist/` directory contains:
- `popup.html` & `popup.js` - Popup interface
- `options.html` & `options.js` - Options page
- `background.js` - Background service worker
- `content.js` - Content script
- `manifest.json` - Extension manifest
- `icons/` - Extension icons

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

**Made with ❤️ for competitive programmers and LeetCoders**

*Happy coding! 🚀*
