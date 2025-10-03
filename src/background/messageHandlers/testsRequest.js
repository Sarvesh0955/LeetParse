/**
 * Test cases handler
 * Handles custom test case extraction
 */

import { TESTS_GENERATED } from '../../messaging/messages.js';

/**
 * Handles custom test cases from content script
 * @param {Object} message - Message containing test case data
 * @param {Object} sender - Message sender info
 * @param {Function} sendToPopup - Function to send message to popup
 */
export async function handleTestsRequest(message, sender, sendToPopup) {
  if (!message.data) {
    console.error('No data provided for custom tests');
    return;
  }

  const senderTabId = sender.tab ? sender.tab.id : null;

  try {
    const messageToSend = {
      action: TESTS_GENERATED,
      testCase: message.data.testCases || '',
    };
    sendToPopup(messageToSend, senderTabId);
  } catch (error) {
    console.error('Error processing test cases:', error);
    sendToPopup({
      action: TESTS_GENERATED,
      error: error.message || 'Unknown error processing test cases'
    }, senderTabId);
  }
}
