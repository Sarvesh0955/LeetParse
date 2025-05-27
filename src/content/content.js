import { parseData } from '../utils/parser.js';

console.log('Content script loaded');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "parseProblem") {
    const data = parseData();
    console.log('Parsed data:', data);
    
    chrome.runtime.sendMessage({
      action: "processCode", 
      data: data
    });
  }
});