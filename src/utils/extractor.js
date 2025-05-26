console.log('Extractor module loaded');

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
    console.log('Test cases extracted:', problemData.testCases);
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
    
    problemData.inputCode = codeContent.trim();
    console.log('Input code extracted', problemData.inputCode);
  } else {
    console.log('Code editor div not found');
  }

  console.log('Problem data:', problemData);
  
  return problemData;
}

export { extractData };
