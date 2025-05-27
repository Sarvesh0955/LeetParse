/**
 * Extracts test cases and input code data from the LeetCode problem page
 * @returns {Object} The extracted problem data
 */
function extractData() {
  const problemData = {
    testCases: '',
    inputCode: ''
  };
  
  const testCaseDiv = document.querySelector('div.cm-content');
  if (testCaseDiv) {
    let testCaseContent = '';
    
    const testCaseLines = testCaseDiv.querySelectorAll('.cm-line');
    testCaseLines.forEach(line => {
      testCaseContent += line.textContent + '\n';
    });
    
    problemData.testCases = testCaseContent.trim();
  } else {
    console.log('Test case div not found');
  }
  
  const editorDiv = document.querySelector('.view-lines');
  if (editorDiv) {
    let codeContent = '';
    
    const lineDivs = editorDiv.querySelectorAll('.view-line');
    lineDivs.forEach(lineDiv => {
      codeContent += lineDiv.textContent + '\n';
    });
    
    problemData.inputCode = codeContent;
    // Find the closing bracket of the function and remove everything after it
    const functionEndPos = codeContent.indexOf('};');
    if (functionEndPos !== -1) {
      problemData.inputCode = codeContent.substring(0, functionEndPos + 2);
    }
  } else {
    console.log('Code editor div not found');
  }
  
  return problemData;
}

export { extractData };
