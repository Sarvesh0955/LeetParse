/**
 * LeetCode Parser - Background Script
 * 
 * This background script handles communication between the popup and content scripts,
 * as well as code generation based on extracted problem data from LeetCode.
 */
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
        
        console.log(`Popup connected for tab: ${tabId}`);
        activePopupPorts[tabId] = port;
        
        port.tabId = tabId;
        
        port.onDisconnect.addListener(() => {
          console.log(`Popup disconnected for tab: ${tabId}`);
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

// Helper function to send message to specific popup or all active popups
function sendToPopup(message, tabId = null) {
  console.log(`Attempting to send message to ${tabId ? `tab ${tabId}` : 'all tabs'}:`, message);
  
  if (tabId && activePopupPorts[tabId]) {
    // Send to specific tab's popup
    try {
      activePopupPorts[tabId].postMessage(message);
      console.log(`Message sent successfully to tab ${tabId}`);
    } catch (error) {
      console.error(`Error sending to popup on tab ${tabId}:`, error);
      delete activePopupPorts[tabId]; // Clean up broken connection
    }
  } else if (tabId && !activePopupPorts[tabId]) {
    console.warn(`No active popup found for tab ${tabId}. Active tabs:`, Object.keys(activePopupPorts));
  } else {
    // Send to all active popups
    const activeTabIds = Object.keys(activePopupPorts);
    console.log(`Broadcasting to ${activeTabIds.length} active popups:`, activeTabIds);
    
    activeTabIds.forEach(id => {
      try {
        activePopupPorts[id].postMessage(message);
        console.log(`Message sent successfully to tab ${id}`);
      } catch (error) {
        console.error(`Error sending to popup on tab ${id}:`, error);
        delete activePopupPorts[id]; // Clean up broken connection
      }
    });
  }
}

// Additional utility function to get tab-specific information
function getTabInfo(tabId) {
  return {
    isConnected: !!activePopupPorts[tabId],
    port: activePopupPorts[tabId],
    connectionTime: activePopupPorts[tabId]?.connectionTime
  };
}

// Function to handle tab-specific messaging with fallback
function sendToSpecificTab(message, tabId) {
  if (!tabId) {
    console.warn('No tab ID provided, broadcasting to all tabs');
    sendToPopup(message);
    return false;
  }
  
  if (activePopupPorts[tabId]) {
    sendToPopup(message, tabId);
    return true;
  } else {
    console.warn(`Tab ${tabId} not connected. Available tabs:`, Object.keys(activePopupPorts));
    return false;
  }
}

//Handles messages from popup and content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  try {
    // Acknowledge receipt of message
    sendResponse({ received: true });
    
    // Validate the message
    if (!message || !message.action) {
      console.error('Invalid message received:', message);
      return true;
    }
    
    if (message.action === "processCode") {
      // Handle code generation request from content script
      if (!message.data) {
        console.error('No data provided for code processing');
        return true;
      }
      
      const language = message.language || 'cpp';
      const senderTabId = sender.tab ? sender.tab.id : null;
      
      try {
        // Generate boilerplate code based on parsed problem data
        const generatedCode = generateCode(message.data, language);
        
        // Prepare message with generated code and test cases
        const messageToSend = {
          action: "codeGenerated",
          boilerplateCode: generatedCode,
          testCase: message.data.testCases || ''
        };
        
        // Send to the popup on the same tab as the sender
        sendToPopup(messageToSend, senderTabId);
        
      } catch (error) {
        // Handle code generation errors
        console.error('Error generating code:', error);
        
        sendToPopup({
          action: "codeGenerated",
          error: error.message || 'Unknown error generating code'
        }, senderTabId);
      }
    }
    else if (message.action === "parsedTests") {
      // Handle custom test cases from content script
      if (!message.data) {
        console.error('No data provided for custom tests');  
        return true;
      }
      
      const senderTabId = sender.tab ? sender.tab.id : null;
      
      try {
        // Prepare message with the custom test cases
        const messageToSend = {
          action: "otherTestsGenerated",
          testCase: message.data.testCases || '',
        };
        
        // Send to the popup on the same tab as the sender
        sendToPopup(messageToSend, senderTabId);
        
      } catch (error) {
        // Handle errors in test case processing
        console.error('Error processing test cases:', error);
        
        sendToPopup({
          action: "otherTestsGenerated",
          error: error.message || 'Unknown error processing test cases'
        }, senderTabId);
      }
    }
    else if (message.action === "pingTest") {
      // Handle ping test from debug panel
      const senderTabId = sender.tab ? sender.tab.id : null;
      console.log(`Ping received from tab ${senderTabId || 'unknown'}`);
      
      // Send pong response
      sendToPopup({
        action: "pongResponse",
        originalTimestamp: message.timestamp,
        responseTimestamp: Date.now(),
        tabId: senderTabId
      }, senderTabId);
    }
    
    // Keep the message channel open for the asynchronous response
    return true;
  } catch (error) {
    console.error('Error in message handler:', error);
    return true;
  }
});
