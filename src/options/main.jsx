import React from 'react'
import ReactDOM from 'react-dom/client'
import Options from './Options.jsx'
import '../popup/index.css' 

const initializeTheme = () => {
  chrome.storage.sync.get(['theme'], (result) => {
    let theme = result.theme || 'system';
    if (theme === 'system') {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', theme);
  });
}

initializeTheme();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>,
)
