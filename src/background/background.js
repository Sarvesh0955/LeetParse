/**
 * LeetCode Parser - Background Script
 * 
 * This background script handles communication between the popup and content scripts,
 * as well as code generation based on extracted problem data from LeetCode.
 */
import { generateCode } from '../utils/codeGenerator.js';

// Default extension settings
const defaultSettings = {
  theme: 'system',        // Theme preference (system, light, dark)
  preferredLanguage: 'cpp' // Default programming language
};

/**
 * Initializes extension settings when installed
 */
chrome.runtime.onInstalled.addListener((details) => {
  try {
    console.log('Extension installed or updated:', details.reason);
    
    if (details.reason === 'install') {
      // Set default settings on fresh install
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

let activePopupPorts = {};

chrome.runtime.onConnect.addListener((port) => {
  try {
    if (port.name === 'popup') {
      const tabId = port.sender.tab ? port.sender.tab.id : 'popup';
      activePopupPorts[tabId] = port;
      
      port.onDisconnect.addListener(() => {
        delete activePopupPorts[tabId];
      });
    }
  } catch (error) {
    console.error('Error in onConnect handler:', error);
  }
});

/**
 * Handles messages from popup and content scripts
 */
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
      
      try {
        // Generate boilerplate code based on parsed problem data
        const generatedCode = generateCode(message.data, language);
        
        // Prepare message with generated code and test cases
        const messageToSend = {
          action: "codeGenerated",
          boilerplateCode: generatedCode,
          testCase: message.data.testCases || ''
        };
        
        // Send the generated code back to the popup
        chrome.runtime.sendMessage(messageToSend, (response) => {
          if (chrome.runtime.lastError) {
            console.log('Info: Popup not currently active to receive message');
          }
        });
        
      } catch (error) {
        // Handle code generation errors
        console.error('Error generating code:', error);
        
        chrome.runtime.sendMessage({
          action: "codeGenerated",
          error: error.message || 'Unknown error generating code'
        }, () => {
          if (chrome.runtime.lastError) {
            console.log('Could not send error to popup (probably closed)');
          }
        });
      }
    }
    else if (message.action === "parsedTests") {
      // Handle custom test cases from content script
      if (!message.data) {
        console.error('No data provided for custom tests');  
        return true;
      }
      
      try {
        // Prepare message with the custom test cases
        const messageToSend = {
          action: "otherTestsGenerated",
          testCase: message.data.testCases || '',
        };
        
        // Send the test cases back to the popup
        chrome.runtime.sendMessage(messageToSend, (response) => {
          if (chrome.runtime.lastError) {
            console.log('Info: Popup not currently active to receive message');
          }
        });
        
      } catch (error) {
        // Handle errors in test case processing
        console.error('Error processing test cases:', error);
        
        chrome.runtime.sendMessage({
          action: "otherTestsGenerated",
          error: error.message || 'Unknown error processing test cases'
        }, () => {
          if (chrome.runtime.lastError) {
            console.log('Could not send error to popup (probably closed)');
          }
        });
      }
    }
    
    // Keep the message channel open for the asynchronous response
    return true;
  } catch (error) {
    console.error('Error in message handler:', error);
    return true;
  }
});
