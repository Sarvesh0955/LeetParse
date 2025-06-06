import { generateCode } from '../utils/codeGenerator.js';

const defaultSettings = {
  theme: 'system',
  preferredLanguage: 'cpp'
};

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

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  try {
    sendResponse({ received: true });
    
    if (!message || !message.action) {
      console.error('Invalid message received:', message);
      return true;
    }
    
    if (message.action === "processCode") {
      if (!message.data) {
        console.error('No data provided for code processing');
        return true;
      }
      
      const language = message.language || 'cpp';
      
      try {
        const generatedCode = generateCode(message.data, language);
        
        const messageToSend = {
          action: "codeGenerated",
          boilerplateCode: generatedCode,
          testCase: message.data.testCases || ''
        };
        
        chrome.runtime.sendMessage(messageToSend, (response) => {
          if (chrome.runtime.lastError) {
            console.log('Info: Popup not currently active to receive message');
          }
        });
        
      } catch (error) {
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
      if (!message.data) {
        console.error('No data provided for other tests');  
      }
      try {
        
        const messageToSend = {
          action: "otherTestsGenerated",
          testCase: message.data.testCases || '',
        };
        
        chrome.runtime.sendMessage(messageToSend, (response) => {
          if (chrome.runtime.lastError) {
            console.log('Info: Popup not currently active to receive message');
          }
        });
        
      } catch (error) {
        console.error('Error generating other test:', error);
        
        chrome.runtime.sendMessage({
          action: "otherTestsGenerated",
          error: error.message || 'Unknown error generating other test'
        }, () => {
          if (chrome.runtime.lastError) {
            console.log('Could not send error to popup (probably closed)');
          }
        });
      }
    }
    
    
    return true;
  } catch (error) {
    console.error('Error in message handler:', error);
    return true;
  }
});
