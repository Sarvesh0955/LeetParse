import { useState, useEffect } from 'react'
import './Options.css'

function Options() {
  const defaultSettings = {
    theme: 'system', // system, light, dark
    preferredLanguage: 'cpp', // cpp
  };

  const [settings, setSettings] = useState(defaultSettings);
  const [saveNotification, setSaveNotification] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('light');

  useEffect(() => {
    chrome.storage.sync.get(defaultSettings, (items) => {
      setSettings(items);
      
      let themeToUse = items.theme;
      if (themeToUse === 'system') {
        themeToUse = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      setCurrentTheme(themeToUse);
      document.documentElement.setAttribute('data-theme', themeToUse);
    });
  }, []);

  const saveSettings = () => {
    chrome.storage.sync.set(settings, () => {
      showSaveNotification();
      
      let themeToUse = settings.theme;
      if (themeToUse === 'system') {
        themeToUse = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      setCurrentTheme(themeToUse);
      document.documentElement.setAttribute('data-theme', themeToUse);
    });
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    chrome.storage.sync.set(defaultSettings, () => {
      showSaveNotification();
    });
  };

  const showSaveNotification = () => {
    setSaveNotification(true);
    setTimeout(() => setSaveNotification(false), 3000);
  };

  const toggleTheme = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setCurrentTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    setSettings({...settings, theme: newTheme});
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value,
    });
  };
  
  return (
    <div className="options-container">
      <div className="header">
        <h1>LeetCode Parser Settings</h1>
        <button 
          onClick={toggleTheme}
          className="theme-switch"
          title="Toggle theme"
        >
          {currentTheme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
      
      <div className="section">
        <h2>Appearance</h2>
        <div className="option-row">
          <div className="option-description">
            <h3>Theme</h3>
            <p>Choose between light, dark, or system theme</p>
          </div>
          <div className="option-control">
            <select 
              name="theme" 
              value={settings.theme}
              onChange={handleChange}
            >
              <option value="system">System Default</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="button-group">
        <button className="reset-button" onClick={resetSettings}>
          Reset to Defaults
        </button>
        <button className="save-button" onClick={saveSettings}>
          Save Settings
        </button>
      </div>
      
      <div className={`save-notification ${saveNotification ? 'visible' : ''}`}>
        Settings saved successfully!
      </div>
    </div>
  )
}

export default Options
