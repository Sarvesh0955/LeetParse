# Refactoring Migration Guide

## Overview

This document describes the major refactoring that restructured the LeetParse extension into a modular, maintainable architecture.

## What Changed

### Previous Structure
```
src/
├── popup/           # Popup React components
├── options/         # Options page components
├── background/      # Background script (single file)
├── content/         # Content script (single file)
├── common/          # Shared theme and hooks
└── utils/           # Parsers, extractors, code generator
```

### New Structure
```
src/
├── background/
│   ├── index.js                    # Entry point
│   └── messageHandlers/            # Modular message handlers
│       ├── parseRequest.js
│       ├── testsRequest.js
│       └── settings.js
├── content/
│   ├── index.js                    # Entry point
│   ├── parser/
│   │   └── leetcodeParser.js      # DOM parsing logic
│   └── messenger.js                # Message sending utilities
├── ui/
│   ├── popup/
│   │   ├── PopupApp.jsx           # Main popup component
│   │   ├── index.jsx              # Popup mount entry
│   │   ├── components/
│   │   └── hooks/
│   ├── options/
│   │   ├── OptionsApp.jsx         # Main options component
│   │   ├── index.jsx              # Options mount entry
│   │   ├── components/
│   │   └── hooks/
│   └── common/                     # Shared UI code
│       ├── hooks/
│       └── theme/
├── core/                           # Pure business logic
│   ├── codegen/
│   │   └── index.js
│   ├── languages/
│   │   └── cpp.template.cpp
│   └── utils/
│       ├── parser.js
│       └── extractor.js
├── messaging/                      # Centralized messaging
│   ├── messages.js                # Message type constants
│   └── router.js                  # Message dispatcher
└── utils/
    └── defaultSettings.js
```

## Key Improvements

### 1. Separation of Concerns

- **Background**: Message handling split into focused handler modules
- **Content**: Parsing logic separated from messaging
- **UI**: Popup and options clearly separated with shared common code
- **Core**: Pure JavaScript modules with no browser API dependencies

### 2. Messaging Abstraction

All message types are now defined as constants in `src/messaging/messages.js`:

```javascript
// Instead of string literals scattered throughout
chrome.runtime.sendMessage({ action: "parseProblem" })

// Now using constants
import { PARSE_REQUEST } from '../messaging/messages.js';
chrome.runtime.sendMessage({ action: PARSE_REQUEST })
```

**Benefits:**
- Type safety through constants
- Single source of truth
- Easy to refactor
- Auto-complete in IDE

### 3. Message Router

Background script now uses a router pattern:

```javascript
// Old: Large switch statement
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === "processCode") { /* ... */ }
  else if (message.action === "parsedTests") { /* ... */ }
  // etc.
});

// New: Clean router with handlers
const messageHandlers = {
  [PARSE_RESULT]: handleParseRequest,
  [TESTS_RESULT]: handleTestsRequest
};

chrome.runtime.onMessage.addListener(createMessageRouter(messageHandlers));
```

### 4. Modular Components

React components are now properly organized:

- `PopupApp.jsx` - Main popup component
- `OptionsApp.jsx` - Main options component  
- `index.jsx` - Entry points for mounting
- Shared hooks and theme in `ui/common/`

### 5. Core Logic Separation

Parser and code generation logic moved to `core/`:
- No direct browser API calls
- Easier to unit test
- Can be reused in different contexts

## Migration Path for New Features

### Adding a New Message Type

1. Add constant to `src/messaging/messages.js`:
```javascript
export const NEW_ACTION = 'newAction';
```

2. Create handler in `src/background/messageHandlers/`:
```javascript
export async function handleNewAction(message, sender, sendToPopup) {
  // Handle the message
}
```

3. Register in `src/background/index.js`:
```javascript
import { handleNewAction } from './messageHandlers/newAction.js';

const messageHandlers = {
  // ... existing handlers
  [NEW_ACTION]: handleNewAction
};
```

### Adding a New Language

1. Create template in `src/core/languages/`:
```
src/core/languages/python.template.py
```

2. Update `src/core/codegen/index.js` to handle the new language

3. Add language option to options UI

### Adding New UI Components

For popup:
```
src/ui/popup/components/NewComponent.jsx
```

For options:
```
src/ui/options/components/NewComponent.jsx
```

For shared:
```
src/ui/common/components/SharedComponent.jsx
```

## Testing

Tests are now organized in:
```
tests/
├── core/              # Tests for pure logic
│   ├── parser.test.js
│   └── codegen.test.js
└── README.md
```

Core modules are pure JavaScript and don't require browser APIs, making them easy to test.

## Build System

No changes to build commands:
- `npm run dev` - Development mode
- `npm run build` - Production build

Output is in `dist/` directory, ready to load as unpacked extension.

## Import Path Changes

If extending the code, use these import patterns:

```javascript
// Message constants
import { PARSE_REQUEST } from '../messaging/messages.js';

// Core utilities (from UI)
import { parseData } from '../../core/utils/parser.js';

// UI components (from same level)
import { AppHeader } from './components';

// Common hooks (from UI components)
import useThemeMode from '../common/hooks/useThemeMode';
```

## Backward Compatibility

The refactoring maintains all existing functionality:
- ✅ Popup UI works the same
- ✅ Options page works the same
- ✅ Content script parsing works the same
- ✅ Code generation works the same
- ✅ Message flow works the same

Only the internal organization has changed.

## Benefits Summary

1. **Maintainability**: Clear separation makes code easier to understand
2. **Testability**: Core logic can be tested without browser APIs
3. **Extensibility**: Easy to add new languages, features, message types
4. **Type Safety**: Message constants prevent typos
5. **Scalability**: Modular structure supports growth
6. **Documentation**: Clear structure self-documents architecture

## Questions?

For questions about the new structure, see:
- `README.md` - High-level architecture
- `tests/README.md` - Testing guide
- This document - Migration details
