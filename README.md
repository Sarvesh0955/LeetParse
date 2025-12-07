# LeetParse - Chrome Extension

<p align="center">
   <img src="public/icons/icon2.png" alt="LeetParse Logo" width="128">
</p>

A powerful Chrome extension that helps competitive programmers parse LeetCode problems and generate ready-to-use boilerplate code with test cases and with VS Code CPH extension support.

## 📝 Description

LeetParse is a developer-oriented Chrome extension that streamlines the process of solving LeetCode problems in your preferred development environment. It automatically extracts problem details, generates boilerplate code with proper input/output handling, formats test cases for easy testing, and integrates seamlessly with VS Code through the Competitive Programming Helper (CPH) extension.

## ✨ Features

### Core Functionality
- **One-Click Problem Parsing**: Extract all necessary information from LeetCode problem pages with a single click
- **Multi-Language Support**: Currently supports **C++**, **Java**, and **Python** with extensible architecture for more languages
- **Automatic Code Template Generation**: Generate complete, compilable code with:
  - Solution function signature automatically extracted from the problem
  - Standard input/output handling code included
  - Support for standard data structures (vectors, maps, strings, etc.)
  - Support for LeetCode special data structures (ListNode, TreeNode)

### Advanced Features
- **VS Code Integration**: Seamless integration with VS Code through Competitive Programming Helper (CPH):
  - One-click export to VS Code with formatted test cases
  - Automatically send both inputs and expected outputs
  - Direct integration with competitive programming workflows
- **Sample Test Case Extraction**: Automatically extract expected outputs from problem examples:
  - Parse "Output:" values from example blocks in problem descriptions
  - Support for multiple test cases from sample examples
  - Intelligent parsing of complex data structures in examples

### User Experience
- **Theme Support**: Choose between:
  - Light mode
  - Dark mode  
  - System preference (automatic)
- **Template Customization**: Modify code templates to match your coding style and preferences
- **Settings Persistence**: All preferences saved locally and synced across browser sessions

### Data Structure Support
- **Complex Data Structure Handling**: Automatically parse and handle:
  - Linked Lists (ListNode)
  - Binary Trees (TreeNode)  
  - Nested arrays/vectors
  - Strings and characters
  - Integer types of various sizes
  - Hash maps and sets
  - Custom object types

## 🏗️ Project Structure

```
leetcode-parser/
├── public/                    # Static assets and manifest
│   ├── manifest.json         # Chrome extension manifest v3
│   └── icons/               # Extension icons (16px, 48px, 128px)
│
├── src/
│   ├── background/          # Background service worker (Manifest v3)
│   │   ├── index.js         # Main background script
│   │   └── messageHandlers/ # Modular message handling
│   │       ├── parseRequest.js      # Problem parsing logic
│   │       ├── settings.js          # Settings management
│   │       ├── testsRequest.js      # Test case handling
│   │       └── vscodeIntegration.js # VS Code CPH integration
│   │
│   ├── content/             # Content script for LeetCode pages
│   │   ├── index.js         # Main content script entry
│   │   ├── messenger.js     # Content-background communication
│   │   └── parser/          # DOM parsing logic
│   │       └── leetcodeParser.js    # LeetCode page parser
│   │
│   ├── ui/                  # React UI components with Material-UI
│   │   ├── common/          # Shared UI components and utilities
│   │   │   ├── hooks/       # Custom React hooks
│   │   │   └── theme/       # Material-UI theme configuration
│   │   ├── popup/           # Extension popup interface
│   │   │   ├── index.jsx    # Popup entry point
│   │   │   ├── PopupApp.jsx # Main popup component
│   │   │   ├── components/  # Popup-specific components
│   │   │   └── hooks/       # Popup-specific hooks
│   │   └── options/         # Extension options page
│   │       ├── index.jsx    # Options entry point
│   │       ├── OptionsApp.jsx # Main options component
│   │       ├── components/  # Options-specific components
│   │       └── hooks/       # Options-specific hooks
│   │
│   ├── core/                # Pure business logic (browser API-free)
│   │   ├── defaultSettings.js # Default configuration values
│   │   ├── codegen/         # Code generation engine
│   │   ├── languages/       # Language-specific templates and parsers
│   │   │   ├── index.js     # Language registry
│   │   │   ├── cpp/         # C++ support
│   │   │   ├── java/        # Java support
│   │   │   └── python/      # Python support
│   │   └── utils/           # Core utilities
│   │       ├── extractor.js          # Data extraction utilities
│   │       ├── languageParserFactory.js # Language parser factory
│   │       └── parser.js             # Generic parsing utilities
│   │
│   └── messaging/           # Message system
│       ├── messages.js      # Message type definitions
│       └── router.js        # Message routing logic
│
├── tests/                   # Test files (unit tests structure)
├── popup.html              # Popup HTML entry point
├── options.html            # Options page HTML entry point
├── vite.config.js          # Vite build configuration
├── package.json            # Node.js dependencies and scripts
└── README.md              # Project documentation
```

## 🚀 Installation

### Method 1: From Chrome Web Store (Recommended)
*Coming soon - Extension is currently in development*

### Method 2: From Source (Development)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Sarvesh0955/leetcode-parser.git
   cd leetcode-parser
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

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### Ways to Contribute
- **Add Language Support**: Implement templates for new programming languages
- **Improve Parsing**: Enhance the LeetCode problem parser for edge cases
- **UI/UX Improvements**: Enhance the Material-UI interface
- **Bug Reports**: Report issues with detailed reproduction steps
- **Feature Requests**: Suggest new functionality

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌐 Website

Visit our landing page: [LeetParse Website](https://sarvesh0955.github.io/leetcode-parser/)

The website includes:
- Complete feature showcase
- Demo video and tutorials
- Download links for Chrome & VS Code extensions
- Product roadmap
- Contact information

## 🔗 Links

- **Website**: [leetparse.com](https://sarvesh0955.github.io/leetcode-parser/)
- **Chrome Extension**: [Coming Soon - Chrome Web Store]
- **CPH Extension**: [Competitive Programming Helper](https://github.com/Sarvesh0955/cph-leetparse)
- **Issues**: [GitHub Issues](https://github.com/Sarvesh0955/leetcode-parser/issues)

---

**Made with ❤️ for competitive programmers**

*Happy coding! 🚀*
