console.log('Background script loaded');

// Check if Gemini API key exists
const checkApiKey = () => {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['geminiApiKey'], (result) => {
      resolve(!!result.geminiApiKey);
    });
  });
};

// Open options page if API key is not set
const openOptionsPageIfNeeded = async () => {
  const hasApiKey = await checkApiKey();
  
  if (!hasApiKey) {
    console.log('Gemini API key not found, opening options page...');
    chrome.runtime.openOptionsPage();
  } else {
    console.log('Gemini API key found!');
  }
};

// Run on extension installation or update
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Extension installed or updated:', details.reason);
  
  if (details.reason === 'install' || details.reason === 'update') {
    openOptionsPageIfNeeded();
  }
});
