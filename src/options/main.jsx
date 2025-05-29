import React from 'react'
import ReactDOM from 'react-dom/client'
import Options from './Options.jsx'

const applyTheme = (theme) => {
  if (theme === 'system') {
    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  document.documentElement.setAttribute('data-theme', theme);
}

const initializeTheme = () => {
  chrome.storage.sync.get(['theme'], (result) => {
    let theme = result.theme || 'system';
    applyTheme(theme);
  });
}

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.theme) {
    applyTheme(changes.theme.newValue);
  }
});

initializeTheme();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>,
)
