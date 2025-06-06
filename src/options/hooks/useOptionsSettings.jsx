import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';

/**
 * Custom hook to manage options settings
 * 
 * @param {Object} defaultSettings - Default settings object
 * @param {boolean} prefersDarkMode - Whether the system prefers dark mode
 * @param {Function} setMode - Function to update the current theme mode
 * @returns {Object} - Settings state and functions
 */
const useOptionsSettings = (defaultSettings, prefersDarkMode, setMode) => {
  const [settings, setSettings] = useState(defaultSettings);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    chrome.storage.sync.get(defaultSettings, (items) => {
      try {
        setSettings(items || defaultSettings);
        let themeToUse = items?.theme || 'system';
        if (themeToUse === 'system') {
          themeToUse = prefersDarkMode ? 'dark' : 'light';
        }
        setMode(themeToUse);
      } catch (error) {
        console.error('Failed to load settings:', error);
        setSettings(defaultSettings);
        setMode(prefersDarkMode ? 'dark' : 'light');
      }
    });
    
    const handleStorageChange = (changes, area) => {
      if (area === 'sync') {
        try {
          const updatedSettings = { ...settings };
          let shouldUpdateSettings = false;
          
          if (changes.theme) {
            let themeToUse = changes.theme.newValue;
            if (themeToUse === 'system') {
              themeToUse = prefersDarkMode ? 'dark' : 'light';
            }
            setMode(themeToUse);
            updatedSettings.theme = changes.theme.newValue;
            shouldUpdateSettings = true;
          }
          
          if (changes.preferredLanguage) {
            updatedSettings.preferredLanguage = changes.preferredLanguage.newValue;
            shouldUpdateSettings = true;
          }
          
          if (shouldUpdateSettings) {
            setSettings(updatedSettings);
          }
        } catch (error) {
          console.error('Failed to handle storage change:', error);
        }
      }
    };
    
    try {
      chrome.storage.onChanged.addListener(handleStorageChange);
    } catch (error) {
      console.error('Failed to set up storage listener:', error);
    }
    
    return () => {
      try {
        chrome.storage.onChanged.removeListener(handleStorageChange);
      } catch (error) {
        console.error('Failed to remove storage listener:', error);
      }
    };
  }, [defaultSettings, prefersDarkMode, setMode, settings]);

  const saveSettings = () => {
    try {
      chrome.storage.sync.set(settings, () => {
        if (chrome.runtime.lastError) {
          console.error('Save settings error:', chrome.runtime.lastError);
          enqueueSnackbar('Failed to save settings', { variant: 'error' });
          return;
        }
        enqueueSnackbar('Settings saved successfully', { variant: 'success' });
        let themeToUse = settings.theme;
        if (themeToUse === 'system') {
          themeToUse = prefersDarkMode ? 'dark' : 'light';
        }
        setMode(themeToUse);
        
        console.log('Saved preferred language:', settings.preferredLanguage);
      });
    } catch (error) {
      console.error('Failed to save settings:', error);
      enqueueSnackbar('Failed to save settings', { variant: 'error' });
    }
  };

  const resetSettings = () => {
    try {
      setSettings(defaultSettings);
      chrome.storage.sync.set(defaultSettings, () => {
        if (chrome.runtime.lastError) {
          console.error('Reset settings error:', chrome.runtime.lastError);
          enqueueSnackbar('Failed to reset settings', { variant: 'error' });
          return;
        }
        enqueueSnackbar('Settings reset to defaults', { variant: 'info' });
        
        let themeToUse = defaultSettings.theme;
        if (themeToUse === 'system') {
          themeToUse = prefersDarkMode ? 'dark' : 'light';
        }
        setMode(themeToUse);
      });
    } catch (error) {
      console.error('Failed to reset settings:', error);
      enqueueSnackbar('Failed to reset settings', { variant: 'error' });
    }
  };

  return {
    settings,
    setSettings,
    saveSettings,
    resetSettings
  };
};

export default useOptionsSettings;
