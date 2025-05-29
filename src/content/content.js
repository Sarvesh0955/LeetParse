import { parseData } from '../utils/parser.js';

console.log('Content script loaded');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "parseProblem") {
    try {
      sendResponse({ status: 'parsing' });
    
      const data = parseData();
      console.log('Parsed data:', data);
      
      setTimeout(() => {
        chrome.runtime.sendMessage({
          action: "processCode", 
          data: data
        }, (response) => {
          if (chrome.runtime.lastError) {
            console.error("Error sending to background:", chrome.runtime.lastError);
          }
        });
      }, 1000); 
    } catch (error) {
      console.error("Error parsing problem:", error);
      sendResponse({ status: 'error', message: error.message });
    }
    
    return true;
  }
});