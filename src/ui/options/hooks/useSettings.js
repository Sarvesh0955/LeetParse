import { useState, useEffect } from 'react';
import { defaultSettings } from '../../../core/defaultSettings.js';

/**
 * Custom hook to manage extension settings
 * Handles loading, saving, and tracking changes for extension settings
 */
export const useSettings = () => {
  // Settings state
  const [settings, setSettings] = useState(defaultSettings);
  const [userTemplates, setUserTemplates] = useState(defaultSettings.userTemplates);
  const [savedSettings, setSavedSettings] = useState(defaultSettings);
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Load settings from storage
  useEffect(() => {
    chrome.storage.sync.get(['theme', 'preferredLanguage', 'userTemplates'], (result) => {
      let templates = result.userTemplates || { ...defaultSettings.userTemplates };
      const loadedSettings = {
        theme: result.theme || defaultSettings.theme,
        preferredLanguage: result.preferredLanguage || defaultSettings.preferredLanguage,
      };
      setSettings(loadedSettings);
      setSavedSettings({ ...loadedSettings, userTemplates: templates });
      setUserTemplates(templates);
      setLoading(false);
    });
  }, []);

  // Track changes
  useEffect(() => {
    const hasChanged = 
      settings.theme !== savedSettings.theme ||
      settings.preferredLanguage !== savedSettings.preferredLanguage ||
      JSON.stringify(userTemplates) !== JSON.stringify(savedSettings.userTemplates);
    setHasChanges(hasChanged);
  }, [settings, userTemplates, savedSettings]);

  // Handle setting changes
  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // Handle user template changes for a specific language
  const handleUserTemplateChange = (language, template) => {
    setUserTemplates(prev => ({
      ...prev,
      [language]: template
    }));
  };

  // Save settings to storage
  const handleSaveSettings = async () => {
    try {
      const settingsToSave = {
        ...settings,
        userTemplates: userTemplates
      };
      
      await chrome.storage.sync.set(settingsToSave);
      setSavedSettings(settingsToSave);
      setSaveSuccess(true);
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  };

  // Reset to default settings
  const handleResetToDefaults = () => {
    setSettings(defaultSettings);
    setUserTemplates(defaultSettings.userTemplates);
    setSavedSettings(defaultSettings);
    chrome.storage.sync.set(defaultSettings);
    setResetSuccess(true);
    setHasChanges(false);
  };

  // Close save success notification
  const closeSaveSuccess = () => {
    setSaveSuccess(false);
  };

  // Close reset success notification
  const closeResetSuccess = () => {
    setResetSuccess(false);
  };

  return {
    // State
    settings,
    userTemplates,
    hasChanges,
    loading,
    saveSuccess,
    resetSuccess,
    
    // Actions
    handleSettingChange,
    handleUserTemplateChange,
    handleSaveSettings,
    handleResetToDefaults,
    closeSaveSuccess,
    closeResetSuccess
  };
};

export default useSettings;
