import { languageRegistry } from './languages/index.js';

export const defaultSettings = {
  theme: 'system',
  preferredLanguage: 'cpp',
  userTemplates: {
    cpp: ' ',
    java: ' ',
    python3: ' ',
    javascript: ' '
  }
};

// Get supported languages dynamically from the language registry
export const supportedLanguages = languageRegistry.getLanguageOptions();

export const themeOptions = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'System (Auto)' }
];