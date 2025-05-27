import { generateCode } from '../utils/codeGenerator.js';

chrome.runtime.onInstalled.addListener((details) => {
  console.log('Extension installed or updated:', details.reason);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "processCode" && message.data) {
    console.log('Processing code from parsed data');
    
    try {
      const generatedCode = generateCode(message.data);
      
      console.log('Generated C++ code successfully');
      
      chrome.runtime.sendMessage({
        action: "codeGenerated",
        boilerplateCode: generatedCode,
        testCase: message.data.testCases || ''
      });
    } catch (error) {
      console.error('Error generating code:', error);
      chrome.runtime.sendMessage({
        action: "codeGenerated",
        error: error.message
      });
    }
    
    return true;
  }
});
