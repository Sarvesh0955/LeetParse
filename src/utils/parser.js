import { extractData } from "./extractor";

/**
 * Extracts parameter data types and names from the Solution class function
 * @param {string} inputCode The code containing the function definition
 * @returns {Array<Array<string>>} Array of parameter strings with data types and names
 */
function extractParameterTypes(inputCode) {
  try {
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
  } catch (error) {
    console.error('Error extracting parameter types:', error);
    return [];
  }
}

/**
 * Processes a nested array recursively, outputting size before each level
 * @param {Array} arr The nested array to process
 * @returns {string} Formatted nested array output
 */
function processNestedArray(arr) {
  try {
    let result = '';
    
    if (!arr || !Array.isArray(arr)) {
      console.error('Invalid array provided to processNestedArray');
      return '0\n';
    }
    
    result += arr.length + '\n';
    
    if (arr.length === 0 || !Array.isArray(arr[0])) {
      if (arr.length > 0 && typeof arr[0] === 'string') {
        for (const item of arr) {
          result += (item === null ? "null" : item) + '\n';
        }
      } else {
        result += arr.map(item => item === null ? "null" : item).join(' ') + '\n';
      }
    } else {
      for (const subArr of arr) {
        if (Array.isArray(subArr)) {
          result += processNestedArray(subArr);
        } 
      }
    }
    
    return result;
  } catch (error) {
    console.error('Error in processNestedArray:', error);
    return '0\n';
  }
}

/**
 * Counts the number of parameters in a function definition
 * @param {string} inputCode The code containing the function definition
 * @returns {number} The number of parameters
 */
function countFunctionParameters(inputCode) {
  try {
    if (!inputCode) return 1;
    
    const functionMatch = inputCode.match(/\w+\s*\(([^)]*)\)/);
    if (functionMatch && functionMatch[1]) {
      const parameterString = functionMatch[1].trim();
      if (!parameterString) return 0;
      
      const commaCount = (parameterString.match(/,/g) || []).length;
      return commaCount + 1;
    }
    
    return 1;
  } catch (error) {
    console.error('Error counting function parameters:', error);
    return 1; // Default to 1 parameter on error
  }
}

/**
 * Parses the test cases into the required format
 * @param {Object} data The problem data containing test cases and input code
 * @returns {string} The parsed test case output
 */
function parseTestCase(data) {
  try {
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
        try {
          const parsedArray = JSON.parse(trimmedLine);
          output += processNestedArray(parsedArray);
        } catch (jsonError) {
          console.error('Failed to parse JSON array:', jsonError);
          output += '0\n';
        }
      }
    }
    return output.trim();
  } catch (error) {
    console.error('Error parsing test case:', error);
    return '1\n0';
  }
}


/**
 * Splits a class code into individual functions
 * @param {string} inputCode The code containing the class definition
 * @returns {Array<string>} Array of strings each containing one function
 */
function splitClassIntoFunctions(inputCode) {
  try {
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
  } catch (error) {
    console.error('Error splitting class into functions:', error);
    return [];
  }
}

function extractFunctionName(inputCode) {
  try {
    if (!inputCode) return '';
    
    const functionNameMatch = inputCode.match(/(\w+)\s*\(/);
    if (functionNameMatch && functionNameMatch[1]) {
      return functionNameMatch[1];
    }
    
    return '';
  } catch (error) {
    console.error('Error extracting function name:', error);
    return '';
  }
}

/**
 * Extracts the return type of a function from the code
 * @param {string} inputCode The code containing the function definition
 * @returns {string} The return type of the function
 */
function extractReturnType(inputCode) {
  try {
    if (!inputCode) return '';

    const returnTypeMatch = inputCode.match(/(\w+(?:<[\w\s,<>*]+>)?(?:\s*\*)?)\s+\w+\s*\(/);
    if (returnTypeMatch && returnTypeMatch[1]) {
      return returnTypeMatch[1].trim();
    }

    return '';
  } catch (error) {
    console.error('Error extracting return type:', error);
    return '';
  }
}


function parseTestCasesSpecialClass(data) {
  try {
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
      if (i + 1 >= lengthTestCase) {
        break; // Avoid out-of-bounds access
      }
      
      const trimmedLine1 = lines[i].trim();
      if (!trimmedLine1) continue; 
      const trimmedLine2 = lines[i+1].trim();
      if (!trimmedLine2) continue; 

      try {
        const functionNames = JSON.parse(trimmedLine1);
        const functionParams = JSON.parse(trimmedLine2);
        
        if (!Array.isArray(functionNames) || !Array.isArray(functionParams)) {
          console.error('Invalid JSON structure: Expected arrays');
          continue;
        }
        
        if (functionNames.length !== functionParams.length) {
          console.log(`Function names and parameters count mismatch: ${functionNames.length} function names and ${functionParams.length} parameters`);
          continue;
        }
        output += functionNames.length + '\n';
        for (let j = 0; j < functionNames.length; j++) {
          output += functionNames[j] + '\n';
          output += processNestedArray(functionParams[j]);
        }
      } catch (jsonError) {
        console.error('Failed to parse JSON in test cases:', jsonError);
        continue;
      }
    }
    return output.trim() || '1\n0';
  } catch (error) {
    console.error('Error parsing special class test cases:', error);
    return '1\n0';
  }
}

async function parseData(language = 'cpp') {
  try {
    const data = await extractData(language);
    if (!data) {
      console.error('Failed to extract data from page');
      return null;
    }
    
    if (!data.testCases) {
      console.warn('No test cases found in extracted data');
    }
    
    if (!data.inputCode) {
      console.error('No input code found in extracted data');
      return null;
    }

    const result = {
      problemClass: '',
      testCases: '',
      inputCode: '',
      parameters: [],
      userCode: ''
    };

    result.inputCode = data.inputCode;
    result.userCode = data.userCode; 
    const arr = [];
    
    try {
      const functions = splitClassIntoFunctions(data.inputCode);
      if (!functions || functions.length === 0) {
        console.warn('No functions found in the input code');
      }
      
      for (const func of functions) {
        arr.push([
          extractFunctionName(func), 
          extractParameterTypes(func), 
          extractReturnType(func)
        ]);
      }
      result.parameters = arr;
      
      if (arr.length > 1) {
        const classMatch = data.inputCode.match(/class\s+(\w+)/);
        result.problemClass = classMatch ? classMatch[1] : 'Unknown';
        result.testCases = parseTestCasesSpecialClass(data).trim();
      }
      else {
        result.problemClass = 'Solution';
        result.testCases = parseTestCase(data).trim();
      }
    } catch (processingError) {
      console.error('Error processing code:', processingError);
      result.problemClass = 'Solution';
      result.parameters = arr.length > 0 ? arr : [['solve', [], '']];
      result.testCases = data.testCases ? '1\n0' : '';
    }

    return result;
  } catch (error) {
    console.error('Critical error in parseData:', error);
    return {
      problemClass: 'Solution',
      testCases: '1\n0',
      inputCode: 'class Solution { void solve() {} }',
      parameters: [['solve', [], '']]
    };
  }
}

export { parseData };
