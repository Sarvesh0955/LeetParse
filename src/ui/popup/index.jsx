import React from 'react';
import ReactDOM from 'react-dom/client';
import PopupApp from './PopupApp.jsx';

/**
 * Applies theme to the popup based on stored settings
 */
const applyTheme = (theme) => {
  try {
    if (theme === 'system') {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', theme);
  } catch (error) {
    console.error('Error applying theme:', error);
    document.documentElement.setAttribute('data-theme', 'light');
  }
};

/**
 * Initializes theme from chrome storage
 */
const initializeTheme = () => {
  try {
    chrome.storage.sync.get(['theme'], (result) => {
      if (chrome.runtime.lastError) {
        console.error('Storage error:', chrome.runtime.lastError);
        applyTheme('system'); 
        return;
      }
      let theme = result.theme || 'system';
      applyTheme(theme);
    });
  } catch (error) {
    console.error('Error initializing theme:', error);
    applyTheme('system');
  }
};

// Listen for theme changes
try {
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync' && changes.theme) {
      applyTheme(changes.theme.newValue);
    }
  });
} catch (error) {
  console.error('Error setting up storage listener:', error);
}

// Initialize theme
initializeTheme();

// Mount the React app
const root = document.getElementById('root');
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <PopupApp />
  </React.StrictMode>
);
