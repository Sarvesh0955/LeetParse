/**
 * Background service worker entry point
 * Manages extension lifecycle and message routing
 */

import { createMessageRouter, sendToPopup as sendToPopupUtil } from '../messaging/router.js';
import { PARSE_RESULT, TESTS_RESULT, CONNECTION_ESTABLISHED, EXPORT_TO_VSCODE } from '../messaging/messages.js';
import { handleParseRequest } from './messageHandlers/parseRequest.js';
import { handleTestsRequest } from './messageHandlers/testsRequest.js';
import { handleVSCodeExport } from './messageHandlers/vscodeIntegration.js';
import { initializeSettings } from './messageHandlers/settings.js';

// Track active popup connections
let activePopupPorts = {};

/**
 * Initialize extension on install
 */
chrome.runtime.onInstalled.addListener((details) => {
  try {
    console.log('Extension installed or updated:', details.reason);
    
    if (details.reason === 'install') {
      initializeSettings();
    }
  } catch (error) {
    console.error('Error in onInstalled handler:', error);
  }
});

/**
 * Handle popup connections
 */
chrome.runtime.onConnect.addListener((port) => {
  try {
    if (port.name === 'popup') {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tabId = tabs[0] ? tabs[0].id : 'unknown';
        
        activePopupPorts[tabId] = port;
        port.tabId = tabId;
        
        port.onDisconnect.addListener(() => {
          delete activePopupPorts[tabId];
        });
        
        port.postMessage({
          action: CONNECTION_ESTABLISHED,
          tabId: tabId
        });
      });
    }
  } catch (error) {
    console.error('Error in onConnect handler:', error);
  }
});

/**
 * Helper to send messages to popup
 */
function sendToPopup(message, tabId = null) {
  sendToPopupUtil(activePopupPorts, message, tabId);
}

/**
 * Message handlers map
 */
const messageHandlers = {
  [PARSE_RESULT]: async (message, sender) => {
    await handleParseRequest(message, sender, sendToPopup);
  },
  [TESTS_RESULT]: async (message, sender) => {
    await handleTestsRequest(message, sender, sendToPopup);
  },
  [EXPORT_TO_VSCODE]: async (message, sender) => {
    await handleVSCodeExport(message, sender, sendToPopup);
  }
};

/**
 * Set up message listener with router
 */
chrome.runtime.onMessage.addListener(createMessageRouter(messageHandlers));
