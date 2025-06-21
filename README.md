# LeetParse - Chrome Extension

<p align="center">
   <img src="public/icons/icon2.png" alt="LeetParse Logo" width="128">
</p>

A powerful Chrome extension built with Vite and React that helps competitive programmers parse LeetCode problems and generate ready-to-use boilerplate code with test cases.

## 📝 Description

LeetParse is a developer-oriented Chrome extension that streamlines the process of solving LeetCode problems in your own development environment. It automatically extracts problem details, generates boilerplate code with proper input/output handling, and formats test cases for easy testing.

## ✨ Features

- **One-Click Problem Parsing**: Extract all necessary information from LeetCode problem pages with a single click
- **Automatic C++ Template Generation**: Generate complete, compilable C++ code with:
  - Solution function signature automatically extracted from the problem
  - Standard input/output handling code included
  - Support for standard C++ data structures (vectors, maps, strings, etc.)
  - Support for LeetCode special data structures (ListNode, TreeNode)
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


**Made with ❤️ for competitive programmers and LeetCoders**

*Happy coding! 🚀*
