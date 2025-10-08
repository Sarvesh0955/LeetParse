/**
 * C++ specific parsing utilities
 */

/**
 * Extracts parameter data types and names from C++ function
 * @param {string} inputCode The C++ code containing the function definition
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
    console.error('Error extracting C++ parameter types:', error);
    return [];
  }
}

/**
 * Splits C++ class code into individual functions
 * @param {string} inputCode The C++ code containing the class definition
 * @returns {Array<string>} Array of strings each containing one function
 */
function splitClassIntoFunctions(inputCode) {
  try {
    if (!inputCode) return [];
    
    const classBodyMatch = inputCode.match(/class\s+\w+\s*{([\s\S]*)}/);
    if (!classBodyMatch) {
      console.warn('No valid C++ class found in code');
      return [];
    }
     
    const classBody = classBodyMatch[1];
    const functions = [];
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
    console.error('Error splitting C++ class into functions:', error);
    return [];
  }
}

/**
 * Extracts the function name from C++ code
 * @param {string} inputCode The C++ code containing the function definition
 * @returns {string} The extracted function name
 */
function extractFunctionName(inputCode) {
  try {
    if (!inputCode) return '';
    
    const functionNameMatch = inputCode.match(/(\w+)\s*\(/);
    if (functionNameMatch && functionNameMatch[1]) {
      return functionNameMatch[1];
    }
    
    return '';
  } catch (error) {
    console.error('Error extracting C++ function name:', error);
    return '';
  }
}

/**
 * Extracts the return type of a C++ function
 * @param {string} inputCode The C++ code containing the function definition
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
    console.error('Error extracting C++ return type:', error);
    return '';
  }
}

export {
  extractParameterTypes,
  splitClassIntoFunctions,
  extractFunctionName,
  extractReturnType
};