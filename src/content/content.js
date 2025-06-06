import { parseData } from '../utils/parser.js';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "parseProblem") {
    sendResponse({ status: 'parsing' });
    
    (async () => {
      try {
        const language = message.language || 'cpp';
        const data = await parseData(language);
        console.log('Parsed data:', data);
        
        chrome.runtime.sendMessage({
          action: "processCode", 
          data: data,
          language: language
        }, (response) => {
          if (chrome.runtime.lastError) {
            console.error("Error sending to background:", chrome.runtime.lastError);
          }
        });
      } catch (error) {
        console.error("Error parsing problem:", error);
        chrome.runtime.sendMessage({
          action: "parseError",
          error: error.message
        });
      }
    })();
    
    return true; // Keep the message channel open for sendResponse
  }
});