import { generateCode } from '../utils/codeGenerator.js';
import { defaultSettings } from '../utils/defaultSettings.js';

// Initializes extension settings when installed
chrome.runtime.onInstalled.addListener((details) => {
  try {
    console.log('Extension installed or updated:', details.reason);
    
    if (details.reason === 'install') {
      chrome.storage.sync.set(defaultSettings, () => {
        if (chrome.runtime.lastError) {
          console.error('Error saving default settings:', chrome.runtime.lastError);
          return;
        }
        console.log('Default settings initialized');
      });
    }
  } catch (error) {
    console.error('Error in onInstalled handler:', error);
  }
});

// connection with different popups on different tabs
let activePopupPorts = {};

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
          action: 'connectionEstablished',
          tabId: tabId
        });
      });
    }
  } catch (error) {
    console.error('Error in onConnect handler:', error);
  }
});

function sendMessageToPopup(tabId, message) {
  try {
    activePopupPorts[tabId].postMessage(message);
  } catch (error) {
    console.error(`Error sending to popup on tab ${tabId}:`, error);
    delete activePopupPorts[tabId];
  }
}

// Helper function to send message to specific popup or all active popups
function sendToPopup(message, tabId = null) {
  console.log(`Attempting to send message to ${tabId ? `tab ${tabId}` : 'all tabs'}:`, message);
  
  if (tabId && activePopupPorts[tabId]) {
    sendMessageToPopup(tabId, message);
  } else if (tabId && !activePopupPorts[tabId]) {
    console.warn(`No active popup found for tab ${tabId}.`);
  } else {
    const activeTabIds = Object.keys(activePopupPorts);    
    activeTabIds.forEach(id => sendMessageToPopup(id, message));
  }
}

//Handles messages from popup and content scripts
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  try {
    sendResponse({ received: true });
    
    if (!message || !message.action) {
      console.error('Invalid message received:', message);
      return true;
    }
    const senderTabId = sender.tab ? sender.tab.id : null;
    if (message.action === "processCode") {
      if (!message.data) {
        console.error('No data provided for code processing');
        return true;
      }
      
      const language = message.language || defaultSettings.language || 'cpp';
      try {
        const generatedCode = await generateCode(message.data, language);
        const messageToSend = {
          action: "codeGenerated",
          codeSnippet : generatedCode,
          testCase: message.data.testCases || ''
        };
        sendToPopup(messageToSend, senderTabId);
      } catch (error) {
        console.error('Error generating code:', error);
        sendToPopup({
          action: "codeGenerated",
          error: error.message || 'Unknown error generating code'
        }, senderTabId);
      }
    }
    else if (message.action === "parsedTests") {
      if (!message.data) {
        console.error('No data provided for custom tests');  
        return true;
      }

      try {
        const messageToSend = {
          action: "otherTestsGenerated",
          testCase: message.data.testCases || '',
        };
        sendToPopup(messageToSend, senderTabId);
      } catch (error) {
        console.error('Error processing test cases:', error);
        sendToPopup({
          action: "otherTestsGenerated",
          error: error.message || 'Unknown error processing test cases'
        }, senderTabId);
      }
    }
    return true;
  } catch (error) {
    console.error('Error in message handler:', error);
    return true;
  }
});
