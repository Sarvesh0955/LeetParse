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
