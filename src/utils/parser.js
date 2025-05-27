import { extractData } from "./extractor";

/**
 * Extracts parameter data types and names from the Solution class function
 * @param {string} inputCode The code containing the function definition
 * @returns {Array<Array<string>>} Array of parameter strings with data types and names
 */
function extractParameterTypes(inputCode) {
  if (!inputCode) return [];
  
  const functionMatch = inputCode.match(/class\s+Solution\s*{[^{]*?(?:public|private|protected)?:?\s*(?:\w+(?:<.*?>)?)\s+(\w+)\s*\(([^)]*)\)/s);
  
  if (functionMatch && functionMatch[2]) {
    const parametersStr = functionMatch[2].trim();
    if (!parametersStr) return [];
    
    let parameters = [];
    let currentParam = '';
    let templateDepth = 0;
    
    for (let i = 0; i < parametersStr.length; i++) {
      const char = parametersStr[i];
      
      if (char === '<') {
        templateDepth++;
        currentParam += char;
      } else if (char === '>') {
        templateDepth--;
        currentParam += char;
      } else if (char === ',' && templateDepth === 0) {
        parameters.push(currentParam.trim());
        currentParam = '';
      } else {
        currentParam += char;
      }
    }
    
    if (currentParam.trim()) {
      parameters.push(currentParam.trim());
    }
    
    // Clean up parameters and create 2D array
    return parameters
      .filter(param => param.trim())
      .map(param => {
        const cleanParam = param.replace(/&|\n|\r/g, '').trim();
        // Extract parameter name as second word in the parameter
        const paramNameMatch = cleanParam.match(/\S+\s+(\S+)/);
        const paramName = paramNameMatch ? paramNameMatch[1] : '';
        return [cleanParam, paramName];
      });
  }
  
  return [];
}

/**
 * Processes an array from the test case
 * @param {Array} arr The array to process
 * @returns {string} Formatted array output
 */
function processArray(arr) {
  let result = '';
  
  const dimensions = getDimensions(arr);
  result += dimensions.join(' ') + '\n';
  
  if (dimensions.length === 1) {
    if (arr.length > 0 && typeof arr[0] === 'string') {
      for (const str of arr) {
        result += str + '\n';
      }
    } else {
      result += arr.join(' ') + '\n';
    }
  } else {
    const flattenedElements = flattenArray(arr, dimensions.length);
    for (const elem of flattenedElements) {
      if (elem.length > 0 && typeof elem[0] === 'string') {
        for (const str of elem) {
          result += str + '\n';
        }
      } else {
        result += elem.join(' ') + '\n';
      }
    }
  }
  
  return result;
}

/**
 * Gets the dimensions of a multidimensional array
 * @param {Array} arr The array to analyze
 * @returns {Array} Array of dimensions
 */
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

/**
 * Flattens a multidimensional array to the specified depth
 * @param {Array} arr The array to flatten
 * @param {number} depth The depth to flatten to
 * @returns {Array} The flattened array
 */
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

/**
 * Counts the number of parameters in a function definition
 * @param {string} inputCode The code containing the function definition
 * @returns {number} The number of parameters
 */
function countFunctionParameters(inputCode) {
  if (!inputCode) return 1;
  
  const functionMatch = inputCode.match(/\w+\s*\(([^)]*)\)/);
  if (functionMatch && functionMatch[1]) {
    const parameterString = functionMatch[1].trim();
    if (!parameterString) return 0;
    
    const commaCount = (parameterString.match(/,/g) || []).length;
    return commaCount + 1;
  }
  
  return 1;
}

/**
 * Parses the test cases into the required format
 * @param {Object} data The problem data containing test cases and input code
 * @returns {string} The parsed test case output
 */
function parseTestCase(data) {
  if (!data || !data.testCases) {
    console.log('No test cases to parse');
    return '';
  }

  const lines = data.testCases.split('\n');
  let output = '';
  
  const nonEmptyLines = lines.filter(line => line.trim() !== '').length;
  
  const parameterCount = countFunctionParameters(data.inputCode);
  let testCaseCount = nonEmptyLines > 0 ? Math.ceil(nonEmptyLines / parameterCount) : 1;
  
  output += testCaseCount + '\n';
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue; 

    if (/^\d/.test(trimmedLine)) {
      output += trimmedLine + '\n';
    }

    else if (trimmedLine.startsWith('"')) {
      let processedString = trimmedLine;
      if (trimmedLine.startsWith('"') && trimmedLine.endsWith('"')) {
        processedString = trimmedLine.substring(1, trimmedLine.length - 1);
      }
      output += processedString + '\n';
    }
    else if (trimmedLine.startsWith('[')) {
      output += processArray(JSON.parse(trimmedLine));
    }
  }
  console.log('Parsed test case output:', output);
  return output.trim();
}

function parseData() {
  const data = extractData();
  if (!data || !data.testCases || !data.inputCode) {
    console.log('Invalid data provided for parsing');
    return '';
  }

  const result = {
    problemClass: '',
    testCases: '',
    inputCode: '',
    parameters: ''
  };

  result.inputCode = data.inputCode.trim();

  if (!(data.inputCode.includes('Solution'))) {
    result.problemClass = 'Special';
    result.testCases = data.testCases.trim();
  }
  else{
    result.problemClass = 'Solution';
    result.parameters = extractParameterTypes(data.inputCode);
    result.testCases = parseTestCase(data).trim();
    console.log('Parsed parameters:', result.parameters);
  }

  return result;
}

export { parseData };
