console.log('Background script loaded');

const checkApiKey = () => {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['geminiApiKey'], (result) => {
      resolve(!!result.geminiApiKey);
    });
  });
};

const openOptionsPageIfNeeded = async () => {
  const hasApiKey = await checkApiKey();
  
  if (!hasApiKey) {
    console.log('Gemini API key not found, opening options page...');
    chrome.runtime.openOptionsPage();
  } else {
    console.log('Gemini API key found!');
  }
};

chrome.runtime.onInstalled.addListener((details) => {
  console.log('Extension installed or updated:', details.reason);
  
  if (details.reason === 'install' || details.reason === 'update') {
    openOptionsPageIfNeeded();
  }
});

import { sendToGemini } from '../utils/geminiService.js';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "sendToGemini" && message.data) {
    console.log('Received data to send to Gemini.');

    sendToGemini(message.data)
      .then(response => {
        console.log('Received response from Gemini:', response);
        sendResponse(response);
      })
      .catch(error => {
        console.error('Error with Gemini API:', error);
        sendResponse({ error: error.message });
      });
    
    return true;
  }
});
