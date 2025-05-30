import React from 'react'
import ReactDOM from 'react-dom/client'
import Options from './Options.jsx'

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
}

const initializeTheme = () => {
  chrome.storage.sync.get(['theme'], (result) => {
    try {
      let theme = result.theme || 'system';
      applyTheme(theme);
    } catch (error) {
      console.error('Error initializing theme:', error);
      applyTheme('system');
    }
  });
}

try {
  chrome.storage.onChanged.addListener((changes, area) => {
    try {
      if (area === 'sync' && changes.theme) {
        applyTheme(changes.theme.newValue);
      }
    } catch (error) {
      console.error('Error handling storage changes:', error);
    }
  });

  initializeTheme();

  const root = document.getElementById('root');
  if (root) {
    ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <Options />
      </React.StrictMode>,
    );
  } else {
    console.error('Root element not found');
  }
} catch (error) {
  console.error('Critical application error:', error);
}
