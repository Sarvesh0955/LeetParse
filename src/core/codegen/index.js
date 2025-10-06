import { createCodeGenerator, isLanguageSupported } from '../languages/index.js';

/**
 * Main code generation function that delegates to language-specific generators
 * @param {Object} data - The parsed problem data
 * @param {string} language - The programming language to generate code for (default: 'cpp')
 * @param {string} testCases - Test case data
 * @param {string} userCode - User's solution code
 * @returns {Promise<string>} The generated code
 */
async function generateCode(data, language = 'cpp', testCases = '', userCode = '') {
    if (!data) {
        throw new Error('No data provided for code generation.');
    }
    
    // Validate language support
    if (!isLanguageSupported(language)) {
        console.warn(`Language ${language} not yet fully implemented, falling back to C++`);
        language = 'cpp';
    }
    
    if (!data.inputCode && !userCode) {
        throw new Error('Invalid data provided. Either inputCode or userCode is required.');
    }
    
    if (!data.parameters || !Array.isArray(data.parameters)) {
        console.warn('No parameters provided, using fallback generation');
        data.parameters = [];
    }

    try {
        // Create language-specific code generator
        const codeGenerator = createCodeGenerator(language);
        if (!codeGenerator) {
            throw new Error(`Failed to create code generator for language: ${language}`);
        }
        
        // Get user template from storage if available
        let userTemplate = '';
        try {
            if (typeof chrome !== 'undefined' && chrome.storage) {
                const result = await chrome.storage.sync.get(['userTemplate']);
                userTemplate = result.userTemplate || '';
            }
        } catch (error) {
            console.warn('Failed to get user template from storage:', error);
        }
        
        // Use userCode if provided, otherwise fall back to inputCode
        const codeToUse = userCode || data.inputCode || '';
        const testCasesToUse = testCases || data.testCases || '';
        
        // Generate code using language-specific generator
        let generatedCode = codeGenerator.generateCode(data, testCasesToUse, codeToUse);
        
        // Apply user template if available
        if (userTemplate) {
            generatedCode = generatedCode.replace('{{user template}}', userTemplate);
        } else {
            // Remove the user template placeholder if no template is provided
            generatedCode = generatedCode.replace('{{user template}}', '');
        }
        
        // Clean up whitespace and special characters
        generatedCode = generatedCode
            .replace(/\u00A0/g, ' ')  // Replace non-breaking spaces
            .replace(/[\t\f\v\r]+/g, ' '); // Replace tabs and other whitespace
            
        return generatedCode.trim();
    } catch (error) {
        console.error('Error generating code:', error);
        throw new Error(`Failed to generate code: ${error.message}`);
    }
}

// Legacy functions for backward compatibility
// These will be deprecated once all components are updated

/**
 * @deprecated Use generateCode with language parameter instead
 */
function solutionClassInputCode(data) {
    console.warn('solutionClassInputCode is deprecated. Use generateCode with language-specific generators.');
    const cppGenerator = createCodeGenerator('cpp');
    return cppGenerator ? cppGenerator.generateSolutionClassInputCode(data) : '';
}

/**
 * @deprecated Use generateCode with language parameter instead
 */
function specialClassInputCode(data) {
    console.warn('specialClassInputCode is deprecated. Use generateCode with language-specific generators.');
    const cppGenerator = createCodeGenerator('cpp');
    return cppGenerator ? cppGenerator.generateSpecialClassInputCode(data) : '';
}

export { generateCode };