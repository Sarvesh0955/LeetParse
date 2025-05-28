import { generateCode } from '../utils/codeGenerator.js';

const defaultSettings = {
  theme: 'system',
  preferredLanguage: 'cpp'
};

chrome.runtime.onInstalled.addListener((details) => {
  console.log('Extension installed or updated:', details.reason);
  
  if (details.reason === 'install') {
    chrome.storage.sync.set(defaultSettings, () => {
      console.log('Default settings initialized');
    });
  }
});

let activePopupPorts = {};

chrome.runtime.onConnect.addListener((port) => {
  if (port.name === 'popup') {
    const tabId = port.sender.tab ? port.sender.tab.id : 'popup';
    activePopupPorts[tabId] = port;
    
    port.onDisconnect.addListener(() => {
      delete activePopupPorts[tabId];
    });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  sendResponse({ received: true });
  
  if (message.action === "processCode" && message.data) {
    console.log('Processing code from parsed data');
    
    try {
      const generatedCode = generateCode(message.data);
      console.log('Generated C++ code successfully');
      
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
        error: error.message
      }, () => {
        if (chrome.runtime.lastError) {
          console.log('Could not send error to popup (probably closed)');
        }
      });
    }
    
    return true;
  }
});
