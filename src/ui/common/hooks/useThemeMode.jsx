import { useState, useEffect } from 'react';
import { useMediaQuery } from '@mui/material';

/**
 * Custom hook to manage theme preferences
 * 
 * @returns {Array} [mode, toggleTheme, setMode] - Current theme mode, toggle function, and set function
 */
export const useThemeMode = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState(prefersDarkMode ? 'dark' : 'light');

  useEffect(() => {
    chrome.storage.sync.get(['theme'], (result) => {
      let themeToUse = result.theme || 'system';
      if (themeToUse === 'system') {
        themeToUse = prefersDarkMode ? 'dark' : 'light';
      }
      setMode(themeToUse);
    });
    
    const handleStorageChange = (changes, area) => {
      if (area === 'sync' && changes.theme) {
        let themeToUse = changes.theme.newValue;
        if (themeToUse === 'system') {
          themeToUse = prefersDarkMode ? 'dark' : 'light';
        }
        setMode(themeToUse);
      }
    };
    
    chrome.storage.onChanged.addListener(handleStorageChange);
    
    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, [prefersDarkMode]);

  const toggleTheme = () => {
    try {
      const newMode = mode === 'light' ? 'dark' : 'light';
      setMode(newMode);
      chrome.storage.sync.set({ theme: newMode });
    } catch (err) {
      console.error('Error toggling theme:', err);
    }
  };

  return [mode, toggleTheme, setMode];
};

export default useThemeMode;
