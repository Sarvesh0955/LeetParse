/**
 * Java specific parsing utilities
 */

/**
 * Extracts parameter data types and names from Java function
 * @param {string} inputCode The Java code containing the function definition
 * @returns {Array<Array<string>>} Array of parameter strings with data types and names
 */
function extractParameterTypes(inputCode) {
  try {
    if (!inputCode) return [];
    
    // Java method pattern: public/private/protected [static] returnType methodName(parameters)
    const methodMatch = inputCode.match(/(?:public|private|protected)?\s*(?:static)?\s*[\w<>\[\]]+\s+\w+\s*\(([^)]*)\)/);
    
    if (methodMatch && methodMatch[1]) {
      const parametersStr = methodMatch[1].trim();
      if (!parametersStr) return [];
      
      let parameters = [];
      let currentParam = '';
      let genericDepth = 0;
      let arrayDepth = 0;
      
      for (let i = 0; i < parametersStr.length; i++) {
        const char = parametersStr[i];
        
        if (char === '<') {
          genericDepth++;
          currentParam += char;
        } else if (char === '>') {
          genericDepth--;
          currentParam += char;
        } else if (char === '[') {
          arrayDepth++;
          currentParam += char;
        } else if (char === ']') {
          arrayDepth--;
          currentParam += char;
        } else if (char === ',' && genericDepth === 0 && arrayDepth === 0) {
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
          const cleanParam = param.replace(/\n|\r/g, '').trim();
          // Java parameter format: Type variableName
          const parts = cleanParam.split(/\s+/);
          if (parts.length >= 2) {
            const paramType = parts.slice(0, -1).join(' ');
            const paramName = parts[parts.length - 1];
            return [paramType + ' ' + paramName, paramName];
          }
          return [cleanParam, ''];
        });
    }
    
    return [];
  } catch (error) {
    console.error('Error extracting Java parameter types:', error);
    return [];
  }
}

/**
 * Splits Java class code into individual methods
 * @param {string} inputCode The Java code containing the class definition
 * @returns {Array<string>} Array of strings each containing one method
 */
function splitClassIntoFunctions(inputCode) {
  try {
    if (!inputCode) return [];
    
    // Find class definition
    const classBodyMatch = inputCode.match(/class\s+\w+\s*(?:extends\s+\w+)?\s*(?:implements\s+[\w,\s]+)?\s*{([\s\S]*)}/);
    if (!classBodyMatch) {
      console.warn('No valid Java class found in code');
      return [];
    }
     
    const classBody = classBodyMatch[1];
    const methods = [];
    let currentMethod = '';
    let braceCount = 0;
    let inMethod = false;
    let i = 0;
    
    while (i < classBody.length) {
      const char = classBody[i];
      
      // Look for method signature pattern
      if (!inMethod && (char.match(/\w/) || char === ' ' || char === '\n' || char === '\t')) {
        let lookAhead = '';
        let j = i;
        
        // Collect potential method signature
        while (j < classBody.length && classBody[j] !== '{' && classBody[j] !== ';') {
          lookAhead += classBody[j];
          j++;
        }
        
        // Check if this looks like a method signature
        if (j < classBody.length && classBody[j] === '{' && 
            lookAhead.match(/(?:public|private|protected)?\s*(?:static)?\s*[\w<>\[\]]+\s+\w+\s*\([^)]*\)\s*$/)) {
          inMethod = true;
          currentMethod = lookAhead + '{';
          braceCount = 1;
          i = j + 1;
          continue;
        }
      }
      
      if (inMethod) {
        currentMethod += char;
        
        if (char === '{') {
          braceCount++;
        } else if (char === '}') {
          braceCount--;
          if (braceCount === 0) {
            methods.push(currentMethod.trim());
            currentMethod = '';
            inMethod = false;
          }
        }
      }
      
      i++;
    }
    
    return methods.filter(method => method.trim() !== '');
  } catch (error) {
    console.error('Error splitting Java class into methods:', error);
    return [];
  }
}

/**
 * Extracts the method name from Java code
 * @param {string} inputCode The Java code containing the method definition
 * @returns {string} The extracted method name
 */
function extractFunctionName(inputCode) {
  try {
    if (!inputCode) return '';
    
    // Match Java method pattern: [modifiers] returnType methodName(parameters)
    const methodNameMatch = inputCode.match(/(?:public|private|protected)?\s*(?:static)?\s*[\w<>\[\]]+\s+(\w+)\s*\(/);
    if (methodNameMatch && methodNameMatch[1]) {
      return methodNameMatch[1];
    }
    
    return '';
  } catch (error) {
    console.error('Error extracting Java method name:', error);
    return '';
  }
}

/**
 * Extracts the return type of a Java method
 * @param {string} inputCode The Java code containing the method definition
 * @returns {string} The return type of the method
 */
function extractReturnType(inputCode) {
  try {
    if (!inputCode) return '';
    
    // Match Java method pattern to extract return type
    const returnTypeMatch = inputCode.match(/(?:public|private|protected)?\s*(?:static)?\s*([\w<>\[\]]+(?:<[^>]+>)?(?:\[\])*)\s+\w+\s*\(/);
    if (returnTypeMatch && returnTypeMatch[1]) {
      return returnTypeMatch[1].trim();
    }

    return '';
  } catch (error) {
    console.error('Error extracting Java return type:', error);
    return '';
  }
}

/**
 * Extracts class name from Java code
 * @param {string} inputCode The Java code containing the class definition
 * @returns {string} The extracted class name
 */
function extractClassName(inputCode) {
  try {
    if (!inputCode) return '';
    
    const classMatch = inputCode.match(/class\s+(\w+)/);
    if (classMatch && classMatch[1]) {
      return classMatch[1];
    }
    
    return 'Solution'; // Default fallback
  } catch (error) {
    console.error('Error extracting Java class name:', error);
    return 'Solution';
  }
}

export {
  extractParameterTypes,
  splitClassIntoFunctions,
  extractFunctionName,
  extractReturnType,
  extractClassName
};