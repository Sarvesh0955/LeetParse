export const defaultSettings = {
  theme: 'system',
  preferredLanguage: 'cpp',
  userTemplate: '',
};

export const supportedLanguages = [
    { value: 'cpp', label: 'C++' },
    // Future languages will be added here
    // { value: 'java', label: 'Java' },
    // { value: 'python', label: 'Python' }
];

export const themeOptions = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'System (Auto)' }
];