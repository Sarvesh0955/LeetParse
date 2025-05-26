import { parseData } from '../utils/parser.js';

console.log('Content script loaded');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "parseProblem") {
    const data = parseData();
    console.log('Parsed data:', data);

    // chrome.runtime.sendMessage({
  //   action: "sendToGemini", 
  //   data: data
  // }, (response) => {
  //   if (response && response.error) {
  //     console.error('Error from Gemini API:', response.error);
  //     chrome.runtime.sendMessage({
  //       action: "geminiResponse",
  //       error: response.error
  //     });
  //   } else {
  //     console.log('Response from Gemini API:', response);
  //     chrome.runtime.sendMessage({
  //       action: "geminiResponse",
  //       cfInput: response.cfInput,
  //       boilerplateCode: response.boilerplateCode
  //     });
  //   }
  // });
  }
});