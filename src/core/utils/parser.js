import { extractData } from "./extractor";
import { getLanguageParser } from "./languageParserFactory.js";

/**
 * Processes a nested array recursively, outputting size before each level
 * @param {Array} arr The nested array to process
 * @returns {string} Formatted nested array output
 */
function processNestedArray(arr) {
  try {
    if (!arr || !Array.isArray(arr)) {
      console.error('Invalid array provided to processNestedArray');
      return '0\n';
    }
    
    let result = arr.length + '\n';
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
 * Parses the test cases into the required format
 * @param {Object} data The problem data containing test cases and input code
 * @returns {string} The parsed test case output
 */
function parseTestCase(data,parameterCount) {
  try {
    if (!data || !data.testCases) {
      console.log('No test cases to parse');
      return '';
    }

    const lines = data.testCases.split('\n');
    let output = '';
    
    const nonEmptyLines = lines.filter(line => line.trim() !== '').length;
    
    // const parameterCount = countFunctionParameters(data.inputCode);
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
 * Parses test cases for problems with multiple class methods
 * @param {Object} data The problem data containing test cases and input code
 * @returns {string} The parsed test case output formatted for special class problems
 */
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
        break;
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


/**
 * Main function to parse LeetCode problem data
 * 
 * This function orchestrates the entire parsing process:
 * 1. Extracts data from the LeetCode page using extractData
 * 2. Extracts function information from the code
 * 3. Parses test cases into the required format
 * 4. Determines if it's a standard problem or special class problem
 * 
 * @param {string} language Programming language to use (default: 'cpp')
 * @param {boolean} otherTests Whether to extract test cases from custom input
 * @returns {Object|null} Parsed problem data object with the following properties:
 *   - problemClass: The name of the class in the problem
 *   - testCases: Formatted test cases ready for use
 *   - inputCode: The original code template
 *   - parameters: Array of function details [name, parameters, returnType]
 *   - userCode: The user's solution code if available
 *   - sampleOutputs: Array of expected outputs for sample test cases
 */
async function parseData(language = 'cpp', otherTests = false) {
  try {
    const data = await extractData(language, otherTests);
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
      userCode: '',
      sampleOutputs: [],     
      isSpecialClass: false  
    };

    result.inputCode = data.inputCode;
    result.userCode = data.userCode; 
    result.sampleOutputs = data.sampleOutputs || [];
    const functionDetails = [];
    
    try {
      // Get language-specific parser
      const parser = getLanguageParser(language);
      
      const functions = parser.splitClassIntoFunctions(data.inputCode);
      if (!functions || functions.length === 0) {
        console.warn('No functions found in the input code');
      }
      for (const func of functions) {
        functionDetails.push([
          parser.extractFunctionName(func),
          parser.extractParameterTypes(func),
          parser.extractReturnType(func)
        ]);
      }
      result.parameters = functionDetails;
      
      if (functionDetails.length > 1) {
        // Multiple functions indicate a special class (like data structure)
        result.problemClass = parser.extractClassName(data.inputCode);
        result.testCases = parseTestCasesSpecialClass(data).trim();
        result.isSpecialClass = true;
      }
      else {
        // Single function indicates a regular Solution class
        result.problemClass = parser.extractClassName(data.inputCode);
        result.testCases = parseTestCase(data,result.parameters[0][1].length).trim();
        result.isSpecialClass = false;
      }
    } catch (processingError) {
      console.error('Error processing code:', processingError);
      result.problemClass = 'Solution';
      result.parameters = functionDetails.length > 0 ? functionDetails : [['solve', [], '']];
      result.testCases = data.testCases ? '1\n0' : '';
      result.isSpecialClass = false;
    }
    result.testCases += '\n';
    return result;
  } catch (error) {
    console.error('Critical error in parseData:', error);
    return {
      problemClass: 'Solution',
      testCases: '1\n0',
      inputCode: 'class Solution { void solve() {} }',
      parameters: [['solve', [], '']], 
      userCode: '',
      sampleOutputs: [],
      isSpecialClass: false
    };
  }
}

export { parseData };
