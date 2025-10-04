/**
 * Content script entry point
 * Listens for messages from popup and parses LeetCode problems
 */

import { parseLeetCodeProblem } from './parser/leetcodeParser.js';
import { sendParseResult } from './messenger.js';
export const PARSE_REQUEST = 'parseProblem';
export const EXTRACT_TESTS_REQUEST = 'otherTests';

/**
 * Handles parse problem request
 */
async function handleParseProblem(language = 'cpp', useCustomTests = false) {
  const result = await parseLeetCodeProblem(language, useCustomTests);
  sendParseResult(result, useCustomTests);
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  sendResponse({ status: 'parsing' });
  
  if (message.action === PARSE_REQUEST) {
    const language = message.language || 'cpp';
    handleParseProblem(language, false);
  }
  else if (message.action === EXTRACT_TESTS_REQUEST) {
    const language = message.language || 'cpp';
    handleParseProblem(language, true);
  }
  return true;
});
