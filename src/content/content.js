console.log('Content script loaded');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "parseProblem") {
    parseLeetCodeProblem();
  }
});

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
    console.log('Input code extracted',problemData.inputCode);
  } else {
    console.log('Code editor div not found');
  }

  console.log('Problem data:', problemData);
  
  return problemData;
}

function parseTestCase(data) {
  if (!data || !data.testCases) {
    console.log('No test cases to parse');
    return '';
  }
  
  const lines = data.testCases.split('\n').filter(line => line.trim()); // Remove empty lines
  let output = '';
  
  // Calculate number of test cases
  let numParams = 0;
  if (data.inputCode) {
    // Try to extract the number of parameters from the function signature in the input code
    const functionMatch = data.inputCode.match(/function\s+\w+\s*\((.*?)\)/);
    if (functionMatch && functionMatch[1]) {
      numParams = functionMatch[1].split(',').length;
    }
  }
  
  // If we found parameters, calculate test cases
  const numTestCases = numParams > 0 ? Math.ceil(lines.length / numParams) : 1;
  output += numTestCases + '\n';
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue; // Skip empty lines
    
    // Case 1: Line starts with a digit
    if (/^\d/.test(trimmedLine)) {
      output += trimmedLine + '\n';
    }
    // Case 2: Line starts with a quote (string)
    else if (trimmedLine.startsWith('"')) {
      // Remove quotes from beginning and end
      let processedString = trimmedLine;
      if (trimmedLine.startsWith('"') && trimmedLine.endsWith('"')) {
        processedString = trimmedLine.substring(1, trimmedLine.length - 1);
      }
      output += processedString + '\n';
    }
    // Case 3: Line starts with [ (array/vector)
    else if (trimmedLine.startsWith('[')) {
      output += processArray(JSON.parse(trimmedLine));
    }
  }
  console.log('Parsed test case output:', output);
  return output.trim();
}

// Helper function to process arrays recursively
function processArray(arr) {
  let result = '';
  
  // Add the size of the current array
  const dimensions = getDimensions(arr);
  result += dimensions.join(' ') + '\n';
  
  // Process array elements
  if (dimensions.length === 1) {
    // 1D array
    result += arr.join(' ') + '\n';
  } else {
    // Multi-dimensional array
    const flattenedElements = flattenArray(arr, dimensions.length);
    for (const elem of flattenedElements) {
      result += elem.join(' ') + '\n';
    }
  }
  
  return result;
}

// Get dimensions of nested arrays
function getDimensions(arr) {
  const dimensions = [];
  let current = arr;
  
  while (Array.isArray(current)) {
    dimensions.push(current.length);
    if (current.length === 0) break;
    current = current[0];
  }
  
  return dimensions;
}

// Flatten nested arrays for output
function flattenArray(arr, depth) {
  if (depth <= 1) return arr;
  
  const result = [];
  for (const item of arr) {
    if (Array.isArray(item)) {
      if (depth === 2) {
        result.push(item);
      } else {
        const flattened = flattenArray(item, depth - 1);
        flattened.forEach(f => result.push(f));
      }
    }
  }
  
  return result;
}

function parseLeetCodeProblem() {
  const data = extractData();
  
  // Process the test case data
  const parsedTestCase = parseTestCase(data);
  data.parsedTestCase = parsedTestCase;
  
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
};

export { extractData, parseTestCase };

