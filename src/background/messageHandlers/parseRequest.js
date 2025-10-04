/**
 * Parse request handler
 * Handles code generation from parsed problem data
 */

import { generateCode } from '../../core/codegen/index.js';
import { defaultSettings } from '../../core/defaultSettings.js';
import { CODE_GENERATED } from '../../messaging/messages.js';

/**
 * Handles parse result from content script and generates code
 * @param {Object} message - Message containing parsed data
 * @param {Object} sender - Message sender info
 * @param {Function} sendToPopup - Function to send message to popup
 */
export async function handleParseRequest(message, sender, sendToPopup) {
  if (!message.data) {
    console.error('No data provided for code processing');
    return;
  }
  
  const senderTabId = sender.tab ? sender.tab.id : null;
  const language = message.language || defaultSettings.language || 'cpp';
  
  try {
    const generatedCode = await generateCode(message.data, language);
    const messageToSend = {
      action: CODE_GENERATED,
      codeSnippet: generatedCode,
      testCase: message.data.testCases || ''
    };
    sendToPopup(messageToSend, senderTabId);
  } catch (error) {
    console.error('Error generating code:', error);
    sendToPopup({
      action: CODE_GENERATED,
      error: error.message || 'Unknown error generating code'
    }, senderTabId);
  }
}
