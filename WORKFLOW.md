# LeetCode Parser Chrome Extension - Detailed Workflow

## Overview
The LeetCode Parser is a Chrome extension that automatically extracts problem data from LeetCode pages, generates C++ boilerplate code, and formats test cases for competitive programming practice.

## Architecture Components

### 1. **Extension Structure**
```
├── manifest.json           # Extension configuration
├── popup.html/popup.js     # Extension popup UI
├── options.html/options.js # Settings page
├── background.js           # Service worker for message routing
├── content.js              # Injected script for LeetCode pages
└── utils/                  # Parsing and code generation utilities
```

### 2. **Core Components**
- **Popup**: React-based UI for user interaction
- **Background Script**: Message routing and coordination
- **Content Script**: DOM parsing on LeetCode pages
- **Parser Utils**: Problem data extraction and formatting
- **Code Generator**: Template-based C++ code generation

## Detailed Workflow (Start to End)

### Phase 1: Extension Initialization

#### 1.1 Extension Installation/Startup
```
Chrome Extension System
├── Loads manifest.json
├── Registers background service worker
├── Injects content script on leetcode.com/problems/*
└── Initializes default settings in chrome.storage
```

**Key Files:**
- `manifest.json` - Defines permissions, content scripts, and popup
- `background.js` - Sets up default settings on install
- `defaultSettings.js` - Contains default language (C++) and theme preferences

#### 1.2 Background Script Setup
```javascript
// background.js initialization
chrome.runtime.onInstalled.addListener() {
  // Save default settings to chrome.storage.sync
  // Settings: { theme: 'system', preferredLanguage: 'cpp' }
}

// Set up port connections for real-time communication
let activePopupPorts = {}; // Track popup connections per tab
chrome.runtime.onConnect.addListener() // Handle popup connections
```

### Phase 2: User Interaction Flow

#### 2.1 User Opens Extension Popup
```
User clicks extension icon
├── popup.html loads
├── React App.jsx initializes
├── Establishes port connection to background script
├── Checks if current tab is LeetCode problem page
└── Loads user's preferred language from storage
```

**Key Process in App.jsx:**
```javascript
// 1. Port connection setup
const backgroundPort = chrome.runtime.connect({ name: 'popup' });

// 2. Check current page
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const url = tabs[0]?.url || '';
  setIsLeetCodeProblem(url.match(/^https:\/\/leetcode\.com\/problems\//) !== null);
});

// 3. Load preferences
chrome.storage.sync.get(['preferredLanguage'], (result) => {
  setSelectedLanguage(result.preferredLanguage || 'cpp');
});
```

#### 2.2 UI State Determination
```
App.jsx renders based on current page:
├── If NOT on LeetCode problem page:
│   ├── Shows "NotOnLeetcodePage" component
│   ├── Displays "Go to LeetCode" button
│   └── Shows "AboutLeetParse" information
└── If ON LeetCode problem page:
    ├── Shows LanguageSelector (C++, Java, Python)
    ├── Shows ActionButtons (Parse/Extract)
    ├── Shows instructions/loading states
    └── Shows generated code/test cases
```

### Phase 3: Problem Parsing Flow

#### 3.1 User Clicks "Parse with Sample Tests" Button
```
ActionButtons.jsx → App.jsx.handleParseProblem()
├── Sets parseLoading = true
├── Clears previous results
├── Gets selected language
└── Sends message to content script
```

**Message Flow:**
```javascript
// App.jsx → Content Script
chrome.tabs.sendMessage(tabs[0].id, { 
  action: "parseProblem",
  language: selectedLanguage  // e.g., 'cpp'
});
```

#### 3.2 Content Script Processing
```
content.js receives "parseProblem" message
├── Calls handleParseProblem(language, useCustomTests=false)
├── Invokes parseData() from parser.js
└── Sends results to background script
```

**Content Script Flow:**
```javascript
// content.js
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "parseProblem") {
    handleParseProblem(message.language, false); // false = use sample tests
  }
});
```

### Phase 4: Data Extraction and Parsing

#### 4.1 Problem Data Extraction (extractor.js)
```
parseData() coordinates multiple extraction steps:
├── extractData() - Gets problem metadata from DOM/API
├── extractTestCase() - Parses test cases from page
├── extractUserCode() - Gets user's current solution
└── Processes and formats the extracted data
```

**Extraction Process:**
```javascript
// extractor.js
export async function extractData(useCustomTests = false) {
  // 1. Get problem slug from URL
  const problemSlug = extractProblemSlug(window.location.href);
  
  // 2. Fetch problem metadata from LeetCode API
  const response = await fetch(`https://leetcode.com/graphql/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `query questionTitle($titleSlug: String!) {
        question(titleSlug: $titleSlug) {
          questionId
          title
          content
          codeSnippets { lang langSlug code }
          sampleTestCase
        }
      }`,
      variables: { titleSlug: problemSlug }
    })
  });
  
  // 3. Extract test cases from page DOM
  const testCases = useCustomTests ? 
    extractTestCase() : // From custom test input
    data.question.sampleTestCase; // From API
  
  // 4. Get user's existing code
  const userCode = extractUserCode(questionId, language);
  
  return { problemData, testCases, userCode };
}
```

#### 4.2 Test Case Processing (parser.js)
```
parseTestCases() processes raw test case strings:
├── Splits test cases by lines
├── Identifies data types (arrays, strings, numbers)
├── Formats for C++ input processing
├── Handles nested arrays and special cases
└── Returns formatted test case string
```

**Example Test Case Processing:**
```
Input: "nums = [2,7,11,15]\ntarget = 9"
Processing:
├── Line 1: "nums = [2,7,11,15]" → Array detection
├── Line 2: "target = 9" → Integer detection
└── Output: "4\n2 7 11 15\n9\n"
```

#### 4.3 Parameter Extraction
```
extractParameterTypes() analyzes function signature:
├── Finds function definition in code
├── Parses parameter types and names
├── Handles template types (vector<int>, etc.)
└── Returns structured parameter data
```

### Phase 5: Code Generation

#### 5.1 Background Script Processing
```
background.js receives "processCode" message:
├── Validates received data
├── Calls generateCode() from codeGenerator.js
├── Handles success/error cases
└── Sends results back to popup
```

#### 5.2 C++ Code Generation (codeGenerator.js)
```
generateCode() creates boilerplate:
├── Loads base template.cpp
├── Analyzes problem type (function vs class)
├── Generates input/output handling code
├── Inserts user's solution code
└── Returns complete C++ program
```

**Code Generation Process:**
```cpp
// Generated structure:
#include<bits/stdc++.h>
using namespace std;

// Data structure definitions (ListNode, TreeNode, etc.)

// Helper functions for input/output

// USER'S SOLUTION CODE INSERTED HERE
class Solution {
    // ... user's code ...
};

int main() {
    int testCases;
    cin >> testCases;
    while(testCases--) {
        // GENERATED INPUT PARSING
        // Call user's solution
        // GENERATED OUTPUT FORMATTING
    }
    return 0;
}
```

### Phase 6: Result Display

#### 6.1 Background to Popup Communication
```
background.js sends results via port:
├── Action: "codeGenerated"
├── Payload: { boilerplateCode, testCase }
└── Routes to correct popup tab
```

#### 6.2 Popup UI Updates
```
App.jsx receives results via event listeners:
├── Stops loading indicators
├── Updates state with generated code
├── Renders CodeBlock components
└── Shows success notification
```

**UI Update Flow:**
```javascript
// App.jsx event handling
window.addEventListener('codeGenerated', (event) => {
  setParseLoading(false);
  setBoilerplateCode(event.detail.boilerplateCode);
  setCfInput(event.detail.testCase);
  enqueueSnackbar('Code generated successfully!', { variant: 'success' });
});
```

### Phase 7: Extract Test Cases Only Flow

#### 7.1 Alternative Flow for Custom Tests
```
User clicks "Extract test cases"
├── Similar to Phase 3, but action: "otherTests"
├── Content script calls parseData(language, useCustomTests=true)
├── Extracts from custom test input area instead of sample
├── Returns only formatted test cases (no code generation)
└── Updates popup with test cases only
```

## Communication Architecture

### Message Flow Diagram
```
Popup (React) ←→ Background Script ←→ Content Script
     ↑                   ↑                    ↑
     │                   │                    │
User Input        Message Routing        DOM Parsing
Settings          Code Generation       Data Extraction
UI Updates        Error Handling        LeetCode API
```

### Port-Based Communication
```javascript
// Real-time bidirectional communication
Popup establishes port connection
├── backgroundPort = chrome.runtime.connect({ name: 'popup' })
├── Background tracks active ports per tab
├── Messages sent via port.postMessage()
└── Events handled via port.onMessage.addListener()
```

## Error Handling Strategy

### 1. **Network Errors**
- API fetch failures → Fallback to DOM parsing
- Timeout handling → User notification

### 2. **Parsing Errors**
- Invalid HTML structure → Graceful degradation
- Missing elements → Default values

### 3. **Communication Errors**
- Content script not loaded → "Refresh page" message
- Port disconnection → Automatic reconnection

### 4. **User Experience**
- Loading indicators during processing
- Success/error notifications via snackbar
- Graceful fallbacks for unsupported pages

## Performance Optimizations

### 1. **Efficient Communication**
- Port-based real-time messaging
- Tab-specific message routing
- Minimal data transfer

### 2. **Resource Management**
- Lazy loading of components
- Cleanup of event listeners
- Port connection management

### 3. **Caching Strategy**
- User preferences in chrome.storage
- Template caching in memory
- Avoid redundant API calls

## Supported Features

### 1. **Programming Languages**
- C++ (primary with full template)
- Java (basic support)
- Python (basic support)

### 2. **Problem Types**
- Regular function problems
- Class-based problems (design problems)
- Multiple parameter types
- Nested data structures

### 3. **Test Case Formats**
- Sample test cases from API
- Custom test input from user
- Array formatting for C++
- String and primitive handling

This workflow ensures a seamless experience from problem identification to ready-to-compile C++ code generation.
