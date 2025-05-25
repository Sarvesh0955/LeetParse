console.log('Content script loaded');

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "parseProblem") {
    parseLeetCodeProblem();
  }
});

// Function to parse LeetCode problem
function parseLeetCodeProblem() {
  console.log('Parsing LeetCode problem...');
}

