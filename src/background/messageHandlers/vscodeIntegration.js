/**
 * VS Code integration message handler
 * Handles exporting parsed problems to CPH format
 */

import { VSCODE_EXPORT_SUCCESS, VSCODE_EXPORT_ERROR } from '../../messaging/messages.js';

/**
 * Extracts problem slug from a LeetCode URL
 * @param {string} url - The LeetCode problem URL
 * @returns {string} The extracted problem slug (e.g., "two-sum")
 */
function extractProblemSlugFromUrl(url) {
  try {
    const match = url.match(/\/problems\/([^\/]+)/);
    return match ? match[1] : '';
  } catch (error) {
    console.error("Error extracting problem slug:", error);
    return '';
  }
}

/**
 * Converts problem slug to a valid Java class name
 * @param {string} problemSlug - The problem slug (e.g., "two-sum", "add-two-numbers")
 * @returns {string} - Valid Java class name (e.g., "two_sum", "add_two_numbers")
 */
function formatClassNameFromSlug(problemSlug) {
  if (!problemSlug || typeof problemSlug !== 'string') {
    return 'Main';
  }
  
  // Replace hyphens and spaces with underscores, then ensure it's a valid Java identifier
  return problemSlug
    .replace(/[-\s]+/g, '_')
    .replace(/[^a-zA-Z0-9_]/g, '')
    .replace(/^(\d)/, '_$1'); // If it starts with a number, prefix with underscore
}

/**
 * Handles VS Code export requests from popup
 * Attempts to send parsed problem data to CPH extension
 * 
 * @param {Object} message - The message containing problem data
 * @param {Object} sender - The sender information  
 * @param {Function} sendToPopup - Function to send response back to popup
 */
export async function handleVSCodeExport(message, sender, sendToPopup) {
  try {
    const { code, testCases, problemName, language, problemUrl, sampleOutputs, ...problemData } = message;
    
    if (!problemName || !language) {
      throw new Error('Missing required data for VS Code export');
    }
    
    // For Java, regenerate code with custom class name based on problem URL slug
    let codeForVSCode = code;
    if (language === 'java' && problemUrl) {
      try {
        // Extract problem slug from URL
        const problemSlug = extractProblemSlugFromUrl(problemUrl);
        if (problemSlug) {
          // Replace class name in existing code
          const className = formatClassNameFromSlug(problemSlug);
          codeForVSCode = code.replace(/class Main/g, `class ${className}`);
        }
      } catch (error) {
        console.warn('Failed to update class name for VS Code, using original code:', error);
        // Fall back to original code if class name update fails
      }
    }
    
    // Format test cases with corresponding outputs for CPH
    const tests = formatTestCasesWithOutputs(testCases, sampleOutputs);
    
    const competitiveCompanionData = {
      name: problemName,
      url: problemUrl || '',
      tests: tests,
      interactive: false,
      memoryLimit: 256,
      timeLimit: 2000,
      group: "LeetCode",
      parsedCode: codeForVSCode || '',
      language: mapLanguageToCompetitiveCompanion(language)
    };

    console.log('CPH data with outputs:', competitiveCompanionData);
    
    // Attempt to send to CPH via local HTTP server
    const success = await sendToCompetitiveCompanion(competitiveCompanionData);
    
    if (success) {
      sendToPopup({
        action: VSCODE_EXPORT_SUCCESS,
        message: 'Problem exported to CPH successfully!'
      }, sender.tab?.id);
    } else {
      // Fallback: Copy formatted data to clipboard
      await copyToClipboardFallback(competitiveCompanionData);
      sendToPopup({
        action: VSCODE_EXPORT_ERROR,
        message: 'CPH not detected. Problem data copied to clipboard for manual import.',
        fallback: true
      }, sender.tab?.id);
    }
    
  } catch (error) {
    console.error('VS Code export error:', error);
    sendToPopup({
      action: VSCODE_EXPORT_ERROR,
      message: error.message || 'Failed to export to VS Code'
    }, sender.tab?.id);
  }
}

/**
 * Attempts to send problem data to CPH extension
 * via local HTTP server on port 27121
 * 
 * @param {Object} problemData - The problem data to send
 * @returns {Promise<boolean>} - Whether the export was successful
 */
async function sendToCompetitiveCompanion(problemData) {
  try {
    const response = await fetch('http://localhost:27121', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(problemData)
    });
    
    if (!response.ok) {
      console.warn('CPH server responded with error:', response.status);
      return false;
    }
    
    return true;
    
  } catch (error) {
    console.warn('CPH connection failed:', error.message);
    return false;
  }
}

/**
 * Formats test cases with their corresponding sample outputs for CPH
 * @param {string} testCases - The formatted input test cases
 * @param {string[]} sampleOutputs - Array of expected outputs
 * @returns {Array} Array of test objects with input and output
 */
function formatTestCasesWithOutputs(testCases, sampleOutputs = []) {
  try {
    if (!testCases || testCases.trim() === '') {
      return [{ input: '', output: ' ' }];
    }
    
    // Combine all sample outputs into a single output string, similar to how inputs are combined
    let combinedOutput = ' ';
    if (sampleOutputs && sampleOutputs.length > 0) {
      combinedOutput = sampleOutputs.join('\n').trim();
    }
    
    // Return single test case with all inputs and combined outputs
    return [{
      input: testCases,
      output: combinedOutput
    }];
    
  } catch (error) {
    console.error('Error formatting test cases with outputs:', error);
    return [{ input: testCases || '', output: ' ' }];
  }
}

/**
 * Map LeetParse language names to CPH format
 * @param {string} language - LeetParse language name
 * @returns {string} - CPH language name
 */
function mapLanguageToCompetitiveCompanion(language) {
  const languageMap = {
    'cpp': 'cpp',
    'c++': 'cpp',
    'java': 'java',
    'python': 'python',
    'python3': 'python',
    'javascript': 'javascript',
    'js': 'javascript',
    'typescript': 'typescript',
    'ts': 'typescript',
    'go': 'go',
    'rust': 'rust',
    'c#': 'csharp',
    'csharp': 'csharp'
  };
  
  return languageMap[language.toLowerCase()] || language.toLowerCase();
}

/**
 * Fallback method to copy problem data to clipboard
 * when CPH is not available
 * 
 * @param {Object} problemData - The problem data to copy
 */
async function copyToClipboardFallback(problemData) {
  const exportText = JSON.stringify(problemData, null, 2);

  try {
    // Use chrome.tabs API to inject clipboard copy script
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (text) => {
        navigator.clipboard.writeText(text).catch(() => {
          // Fallback for older browsers
          const textarea = document.createElement('textarea');
          textarea.value = text;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
        });
      },
      args: [exportText]
    });
    
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    throw new Error('Export failed and could not copy to clipboard');
  }
}