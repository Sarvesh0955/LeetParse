/**
 * Python specific parsing utilities
 */

/**
 * Extracts parameter data types and names from Python function
 * @param {string} inputCode The Python code containing the function definition
 * @returns {Array<Array<string>>} Array of parameter strings with data types and names
 */
function extractParameterTypes(inputCode) {
  try {
    if (!inputCode) return [];
    
    // Python method pattern: def method_name(self, param1: Type1, param2: Type2, ...) -> ReturnType:
    // We need to handle both typed and untyped parameters
    const methodMatch = inputCode.match(/def\s+\w+\s*\(([^)]*)\)/);
    
    if (methodMatch && methodMatch[1]) {
      const parametersStr = methodMatch[1].trim();
      if (!parametersStr) return [];
      
      let parameters = [];
      let currentParam = '';
      let bracketDepth = 0;
      let squareBracketDepth = 0;
      
      for (let i = 0; i < parametersStr.length; i++) {
        const char = parametersStr[i];
        
        if (char === '[') {
          squareBracketDepth++;
          currentParam += char;
        } else if (char === ']') {
          squareBracketDepth--;
          currentParam += char;
        } else if (char === '(' || char === '<') {
          bracketDepth++;
          currentParam += char;
        } else if (char === ')' || char === '>') {
          bracketDepth--;
          currentParam += char;
        } else if (char === ',' && bracketDepth === 0 && squareBracketDepth === 0) {
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
        .filter(param => param !== 'self') // Filter out 'self' parameter
        .map(param => {
          const cleanParam = param.replace(/\n|\r/g, '').trim();
          
          // Handle typed parameters: paramName: ParamType
          if (cleanParam.includes(':')) {
            const parts = cleanParam.split(':');
            if (parts.length >= 2) {
              const paramName = parts[0].trim();
              const paramType = parts.slice(1).join(':').trim();
              return [paramType, paramName];
            }
          }
          
          // Handle untyped parameters (assume int as default)
          return ['int', cleanParam];
        });
    }
    
    return [];
  } catch (error) {
    console.error('Error extracting Python parameter types:', error);
    return [];
  }
}

/**
 * Splits Python class code into individual methods
 * @param {string} inputCode The Python code containing the class definition
 * @returns {Array<string>} Array of strings each containing one method
 */
function splitClassIntoFunctions(inputCode) {
  try {
    if (!inputCode) return [];
    
    // Find class definition
    const classMatch = inputCode.match(/class\s+\w+(?:\([^)]*\))?\s*:/);
    if (!classMatch) {
      console.warn('No valid Python class found in code');
      return [];
    }
    
    const lines = inputCode.split('\n');
    const methods = [];
    let currentMethod = '';
    let inMethod = false;
    let methodIndentLevel = 0;
    let baseIndentLevel = 0;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();
      
      // Skip empty lines and comments
      if (!trimmedLine || trimmedLine.startsWith('#')) {
        if (inMethod) currentMethod += line + '\n';
        continue;
      }
      
      // Calculate indentation level
      const indentLevel = line.length - line.trimStart().length;
      
      // Check if this is a method definition
      if (trimmedLine.startsWith('def ') && trimmedLine.includes('(') && trimmedLine.endsWith(':')) {
        // If we were already in a method, save it
        if (inMethod && currentMethod.trim()) {
          methods.push(currentMethod.trim());
        }
        
        // Start new method
        currentMethod = line + '\n';
        inMethod = true;
        methodIndentLevel = indentLevel;
        baseIndentLevel = indentLevel;
      } else if (inMethod) {
        // If we're in a method, check if we're still inside it
        if (indentLevel > baseIndentLevel || trimmedLine === '') {
          currentMethod += line + '\n';
        } else {
          // We've left the method
          if (currentMethod.trim()) {
            methods.push(currentMethod.trim());
          }
          inMethod = false;
          currentMethod = '';
        }
      }
    }
    
    // Add the last method if we were still in one
    if (inMethod && currentMethod.trim()) {
      methods.push(currentMethod.trim());
    }
    
    return methods.filter(method => method.trim() !== '');
  } catch (error) {
    console.error('Error splitting Python class into functions:', error);
    return [];
  }
}

/**
 * Extracts the function name from Python code
 * @param {string} inputCode The Python code containing the function definition
 * @returns {string} The extracted function name
 */
function extractFunctionName(inputCode) {
  try {
    if (!inputCode) return '';
    
    const functionNameMatch = inputCode.match(/def\s+(\w+)\s*\(/);
    if (functionNameMatch && functionNameMatch[1]) {
      return functionNameMatch[1];
    }
    
    return '';
  } catch (error) {
    console.error('Error extracting Python function name:', error);
    return '';
  }
}

/**
 * Extracts the return type of a Python function
 * @param {string} inputCode The Python code containing the function definition
 * @returns {string} The return type of the function
 */
function extractReturnType(inputCode) {
  try {
    if (!inputCode) return '';
    
    // Python return type pattern: def method(...) -> ReturnType:
    const returnTypeMatch = inputCode.match(/def\s+\w+\s*\([^)]*\)\s*->\s*([^:]+):/);
    if (returnTypeMatch && returnTypeMatch[1]) {
      return returnTypeMatch[1].trim();
    }

    // If no return type annotation, assume void
    return 'void';
  } catch (error) {
    console.error('Error extracting Python return type:', error);
    return '';
  }
}

/**
 * Extracts the class name from Python code
 * @param {string} inputCode The Python code containing the class definition
 * @returns {string} The extracted class name
 */
function extractClassName(inputCode) {
  try {
    if (!inputCode) return '';
    
    const classNameMatch = inputCode.match(/class\s+(\w+)(?:\([^)]*\))?\s*:/);
    if (classNameMatch && classNameMatch[1]) {
      return classNameMatch[1];
    }
    
    return '';
  } catch (error) {
    console.error('Error extracting Python class name:', error);
    return '';
  }
}

/**
 * Normalizes Python type annotations to match template expectations
 * @param {string} pythonType The Python type annotation
 * @returns {string} Normalized type for template generation
 */
function normalizePythonType(pythonType) {
  if (!pythonType) return 'int';
  
  // Handle Optional types
  if (pythonType.includes('Optional[')) {
    return pythonType.replace('Optional[', '').replace(']', '');
  }
  
  // Handle Union types (take first type)
  if (pythonType.includes('Union[')) {
    const unionMatch = pythonType.match(/Union\[([^,\]]+)/);
    if (unionMatch) {
      return unionMatch[1].trim();
    }
  }
  
  return pythonType;
}

export {
  extractParameterTypes,
  splitClassIntoFunctions,
  extractFunctionName,
  extractReturnType,
  extractClassName,
  normalizePythonType
};