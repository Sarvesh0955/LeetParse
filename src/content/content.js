/**
 * LeetCode Parser - Content Script
 * 
 * This content script runs on LeetCode problem pages and handles parsing requests
 * from the extension popup. It communicates with the background script to process
 * extracted problem data.
 */
import { parseData } from '../utils/parser.js';

/**
 * Handler for parsing the problem and sending data to the background script
 * @param {string} language - The programming language to use
 * @param {boolean} useCustomTests - Whether to use custom test input
 * @returns {Promise<void>}
 */
async function handleParseProblem(language = 'cpp', useCustomTests = false) {
  try {
    // Parse the problem data
    const data = await parseData(language, useCustomTests);
    console.log(`Parsed data (${useCustomTests ? 'custom tests' : 'default tests'}):`, data);
    
    // Send the parsed data to the background script
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
  // Send immediate acknowledgment
  sendResponse({ status: 'parsing' });
  
  if (message.action === "parseProblem") {
    // Handle regular problem parsing
    const language = message.language || 'cpp';
    handleParseProblem(language, false);
    return true; // Keep the message channel open
  }
  else if (message.action === "otherTests") {
    // Handle custom test input parsing
    const language = message.language || 'cpp';
    handleParseProblem(language, true);
    return true; // Keep the message channel open
  }
});
