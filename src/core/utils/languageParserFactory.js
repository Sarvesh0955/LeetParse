import * as cppParser from '../languages/cpp/parser.js';
import * as javaParser from '../languages/java/parser.js';

/**
 * Language parser factory
 * Returns the appropriate parser functions based on the language
 * @param {string} language - The programming language (cpp, java, python)
 * @returns {Object} Parser object with language-specific parsing functions
 */
export function getLanguageParser(language) {
  switch (language.toLowerCase()) {
    case 'cpp':
    case 'c++':
      return {
        language: 'cpp',
        extractParameterTypes: cppParser.extractParameterTypes,
        splitClassIntoFunctions: cppParser.splitClassIntoFunctions,
        extractFunctionName: cppParser.extractFunctionName,
        extractReturnType: cppParser.extractReturnType,
        extractClassName: (inputCode) => {
          const classMatch = inputCode.match(/class\s+(\w+)/);
          return classMatch ? classMatch[1] : 'Solution';
        }
      };
      
    case 'java':
      return {
        language: 'java',
        extractParameterTypes: javaParser.extractParameterTypes,
        splitClassIntoFunctions: javaParser.splitClassIntoFunctions,
        extractFunctionName: javaParser.extractFunctionName,
        extractReturnType: javaParser.extractReturnType,
        extractClassName: javaParser.extractClassName
      };
      
    case 'python':
    case 'python3':
      // Fallback to C++ parser for now - can be extended later
      return {
        language: 'python',
        extractParameterTypes: cppParser.extractParameterTypes,
        splitClassIntoFunctions: cppParser.splitClassIntoFunctions,
        extractFunctionName: cppParser.extractFunctionName,
        extractReturnType: cppParser.extractReturnType,
        extractClassName: (inputCode) => {
          const classMatch = inputCode.match(/class\s+(\w+)/);
          return classMatch ? classMatch[1] : 'Solution';
        }
      };
      
    default:
      console.warn(`Language '${language}' not fully supported, falling back to C++ parser`);
      return {
        language: 'cpp',
        extractParameterTypes: cppParser.extractParameterTypes,
        splitClassIntoFunctions: cppParser.splitClassIntoFunctions,
        extractFunctionName: cppParser.extractFunctionName,
        extractReturnType: cppParser.extractReturnType,
        extractClassName: (inputCode) => {
          const classMatch = inputCode.match(/class\s+(\w+)/);
          return classMatch ? classMatch[1] : 'Solution';
        }
      };
  }
}

/**
 * Get list of supported languages
 * @returns {Array<string>} Array of supported language identifiers
 */
export function getSupportedLanguages() {
  return ['cpp', 'c++', 'java', 'python', 'python3'];
}

/**
 * Check if a language is supported
 * @param {string} language - The language to check
 * @returns {boolean} True if language is supported
 */
export function isLanguageSupported(language) {
  return getSupportedLanguages().includes(language.toLowerCase());
}