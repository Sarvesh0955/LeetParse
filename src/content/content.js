import { parseData } from '../utils/parser.js';

async function handleParseProblem(language, useCustomTests = false) {
  try {
    const data = await parseData(language, useCustomTests);
    
    const action = useCustomTests ? "parsedTests" : "processCode";
    const message = useCustomTests
      ? { action, data }
      : { action, data, language };
      
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error communicating with background script:", chrome.runtime.lastError);
      }
    });
  } catch (error) {
    console.error("Error parsing problem:", error);
    chrome.runtime.sendMessage({
      action: "parseError",
      error: error.message || "Unknown error parsing problem"
    });
  }
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  sendResponse({ status: 'parsing' });
  
  if (message.action === "parseProblem") {
    const language = message.language || 'cpp';
    handleParseProblem(language, false);
  }
  else if (message.action === "otherTests") {
    const language = message.language || 'cpp';
    handleParseProblem(language, true);
  }
  return true;
});
