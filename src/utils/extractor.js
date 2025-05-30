/**
 * Extracts test cases and input code data from the LeetCode problem page
 * @returns {Object} The extracted problem data
 */
function extractData() {
  const problemData = {
    testCases: '',
    inputCode: ''
  };
  
  try {
    const testCaseDiv = document.querySelector('div.cm-content');
    if (testCaseDiv) {
      const testCaseLines = testCaseDiv.querySelectorAll('.cm-line');
      const testCaseContentArray = [];
      testCaseLines.forEach(line => {
        testCaseContentArray.push(line.textContent);
      });
      
      problemData.testCases = testCaseContentArray.join('\n').trim();
    } else {
      console.error('Test case div not found');
    }
    
    const editorDiv = document.querySelector('.view-lines');
    if (editorDiv) {
      let codeContent = '';
      
      const lineDivs = editorDiv.querySelectorAll('.view-line');
      lineDivs.forEach(lineDiv => {
        codeContent += lineDiv.textContent + '\n';
      });
      
      problemData.inputCode = codeContent;
      const classPos = problemData.inputCode.indexOf('class');
      if (classPos !== -1) {
        problemData.inputCode = problemData.inputCode.substring(classPos);
      }
      const functionEndPos = problemData.inputCode.indexOf('};');
      if (functionEndPos !== -1) {
        problemData.inputCode = problemData.inputCode.substring(0, functionEndPos + 2);
      }
    } else {
      console.error('Code editor div not found');
    }
  } catch (error) {
    console.error('Error extracting data:', error);
  }
  
  return problemData;
}

export { extractData };
