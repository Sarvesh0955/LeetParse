import { extractData } from "./extractor";

/**
 * Extracts parameter data types and names from the Solution class function
 * @param {string} inputCode The code containing the function definition
 * @returns {Array<Array<string>>} Array of parameter strings with data types and names
 */
function extractParameterTypes(inputCode) {
  if (!inputCode) return [];
  
  const functionMatch = inputCode.match(/\w+\s*\(([^)]*)\)/);
  
  if (functionMatch && functionMatch[1]) {
    const parametersStr = functionMatch[1].trim();
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
    
    return parameters
      .filter(param => param.trim())
      .map(param => {
        const cleanParam = param.replace(/&|\n|\r/g, '').trim();
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
  return output.trim();
}


/**
 * Splits a class code into individual functions
 * @param {string} inputCode The code containing the class definition
 * @returns {Array<string>} Array of strings each containing one function
 */
function splitClassIntoFunctions(inputCode) {
  if (!inputCode) return [];
  
  const classBodyMatch = inputCode.match(/class\s+\w+\s*{([\s\S]*)}/);
  if (!classBodyMatch) return [];
   
  let classBody = classBodyMatch[1];
  let functions = [];
  let currentFunction = '';
  let braceCount = 0;
  let inFunction = false;

  for (let i = 0; i < classBody.length; i++) {
    const char = classBody[i];
    currentFunction += char;
    
    if (char === '{') {
      braceCount++;
      inFunction = true;
    } else if (char === '}') {
      braceCount--;
      
      if (braceCount === 0 && inFunction) {
        if (currentFunction.includes('(') && currentFunction.includes(')')) {
          functions.push(currentFunction.trim());
        }
        currentFunction = '';
        inFunction = false;
      }
    }
  }
  
  return functions.filter(func => func.trim() !== '');
}

function extractFunctionName(inputCode) {
  if (!inputCode) return '';
  
  const functionNameMatch = inputCode.match(/(\w+)\s*\(/);
  if (functionNameMatch && functionNameMatch[1]) {
    return functionNameMatch[1];
  }
  
  return '';
}

/**
 * Extracts the return type of a function from the code
 * @param {string} inputCode The code containing the function definition
 * @returns {string} The return type of the function
 */
function extractReturnType(inputCode) {
  if (!inputCode) return '';

  const returnTypeMatch = inputCode.match(/(\w+(?:<[\w,\s<>]+>)?(?:\s*\*)?)\s+\w+\s*\(/);
  if (returnTypeMatch && returnTypeMatch[1]) {
    return returnTypeMatch[1].trim();
  }

  return '';
}


function parseTestCasesSpecialClass(data) {
  if (!data || !data.testCases) {
    console.log('No test cases to parse');
    return '';
  }

  const lines = data.testCases.split('\n');
  let output = '';
  
  const nonEmptyLines = lines.filter(line => line.trim() !== '').length;
  let testCaseCount = nonEmptyLines > 0 ? Math.ceil(nonEmptyLines / 2) : 1;
  
  output += testCaseCount + '\n';
  const lengthTestCase = lines.length;  
  for (let i = 0; i < lengthTestCase; i+=2) {
    const trimmedLine1 = lines[i].trim();
    if (!trimmedLine1) continue; 
    const trimmedLine2 = lines[i+1].trim();
    if (!trimmedLine2) continue; 

    const functionNames = JSON.parse(trimmedLine1);
    const functionParams = JSON.parse(trimmedLine2);
    if (functionNames.length !== functionParams.length) {
      console.log(`Function names and parameters count mismatch: ${functionNames.length} function names and ${functionParams.length} parameters`);
      continue;
    }
    output += functionNames.length + '\n';
    for (let j = 0; j < functionNames.length; j++) {
      output += functionNames[j] + '\n';

      output += processArray(functionParams[j]);
    }
  }
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
    parameters: '',
  };

  result.inputCode = data.inputCode;
  const arr = [];
  const functions = splitClassIntoFunctions(data.inputCode);
  for (const func of functions) {
    arr.push([extractFunctionName(func), extractParameterTypes(func), extractReturnType(func)]);
  }
  result.parameters = arr;
  if (!(data.inputCode.includes('Solution'))) {
    const classMatch = data.inputCode.match(/class\s+(\w+)/);
    result.problemClass = classMatch ? classMatch[1] : 'Unknown';
    result.testCases = parseTestCasesSpecialClass(data).trim();
  }
  else{
    result.problemClass = 'Solution';
    result.testCases = parseTestCase(data).trim();
  }

  return result;
}

export { parseData };
