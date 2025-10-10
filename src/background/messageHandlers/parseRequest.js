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
  const language = message.language || defaultSettings.preferredLanguage || 'cpp';
  
  try {
    // Extract the necessary data for code generation
    const { userCode, inputCode, testCases, sampleOutputs } = message.data;
    
    // Use userCode if available, otherwise fall back to inputCode
    const codeToUse = userCode || inputCode || '';
    const testCasesToUse = testCases || '';
    
    const generatedCode = await generateCode(message.data, language, testCasesToUse, codeToUse);
    const messageToSend = {
      action: CODE_GENERATED,
      codeSnippet: generatedCode,
      testCase: testCasesToUse,
      sampleOutputs: sampleOutputs || []  // Include sample outputs in the response
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
