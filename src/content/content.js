console.log('Content script loaded');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "parseProblem") {
    parseLeetCodeProblem();
  }
});

function extractData() {
  const problemData = {
    problemDescription: '',
    inputCode: ''
  };
  
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    problemData.problemDescription = metaDescription.getAttribute('content');
    console.log('Problem description extracted');
  } else {
    console.log('Meta description tag not found');
  }
  
  const editorDiv = document.querySelector('.view-lines');
  if (editorDiv) {
    let codeContent = '';
    
    const lineDivs = editorDiv.querySelectorAll('.view-line');
    lineDivs.forEach(lineDiv => {
      codeContent += lineDiv.textContent + '\n';
    });
    
    problemData.inputCode = codeContent.trim();
    console.log('Input code extracted');
  } else {
    console.log('Code editor div not found');
  }

  console.log('Problem data:', problemData);
  
  return problemData;
}

function parseLeetCodeProblem() {
  const data = extractData();
  
  chrome.runtime.sendMessage({
    action: "sendToGemini", 
    data: data
  }, (response) => {
    if (response && response.error) {
      console.error('Error from Gemini API:', response.error);
      chrome.runtime.sendMessage({
        action: "geminiResponse",
        error: response.error
      });
    } else {
      console.log('Response from Gemini API:', response);
      chrome.runtime.sendMessage({
        action: "geminiResponse",
        cfInput: response.cfInput,
        boilerplateCode: response.boilerplateCode
      });
    }
  });
};

