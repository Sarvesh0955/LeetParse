/**
 * Settings handler
 * Manages extension settings initialization
 */

import { defaultSettings } from '../../utils/defaultSettings.js';

/**
 * Initializes default settings when extension is installed
 */
export function initializeSettings() {
  chrome.storage.sync.set(defaultSettings, () => {
    if (chrome.runtime.lastError) {
      console.error('Error saving default settings:', chrome.runtime.lastError);
      return;
    }
    console.log('Default settings initialized');
  });
}
