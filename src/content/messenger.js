/**
 * Messenger utility for content script communication
 * Handles sending messages to background script
 */

import { PARSE_RESULT, TESTS_RESULT, PARSE_ERROR } from '../messaging/messages.js';

/**
 * Sends parsed problem data to background script
 * @param {Object} result - Parse result from leetcodeParser
 * @param {boolean} useCustomTests - Whether this is for custom tests
 */
export function sendParseResult(result, useCustomTests = false) {
  if (!result.success) {
    chrome.runtime.sendMessage({
      action: PARSE_ERROR,
      error: result.error
    });
    return;
  }

  const action = useCustomTests ? TESTS_RESULT : PARSE_RESULT;
  const message = useCustomTests
    ? { action, data: result.data }
    : { action, data: result.data, language: result.language };

  chrome.runtime.sendMessage(message, (response) => {
    if (chrome.runtime.lastError) {
      console.error("Error communicating with background script:", chrome.runtime.lastError);
    }
  });
}
