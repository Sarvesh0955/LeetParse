/**
 * VS Code integration message handler
 * Handles exporting parsed problems to Competitive Companion format
 */

import { VSCODE_EXPORT_SUCCESS, VSCODE_EXPORT_ERROR } from '../../messaging/messages.js';

/**
 * Handles VS Code export requests from popup
 * Attempts to send parsed problem data to Competitive Companion extension
 * 
 * @param {Object} message - The message containing problem data
 * @param {Object} sender - The sender information  
 * @param {Function} sendToPopup - Function to send response back to popup
 */
export async function handleVSCodeExport(message, sender, sendToPopup) {
  try {
    const { code, testCases, problemName, language, problemUrl } = message;
    
    if (!problemName || !language) {
      throw new Error('Missing required data for VS Code export');
    }
    
    const competitiveCompanionData = {
      name: problemName,
      url: problemUrl || '',
      tests: [{
        input: testCases,
        output: ' '
      }],
      interactive: false,
      memoryLimit: 256,
      timeLimit: 2000,
      group: "LeetCode",
      parsedCode: code || '',
      language: mapLanguageToCompetitiveCompanion(language)
    };

    console.log(competitiveCompanionData);
    
    // Attempt to send to Competitive Companion via local HTTP server
    const success = await sendToCompetitiveCompanion(competitiveCompanionData);
    
    if (success) {
      sendToPopup({
        action: VSCODE_EXPORT_SUCCESS,
        message: 'Problem exported to Competitive Companion successfully!'
      }, sender.tab?.id);
    } else {
      // Fallback: Copy formatted data to clipboard
      await copyToClipboardFallback(competitiveCompanionData);
      sendToPopup({
        action: VSCODE_EXPORT_ERROR,
        message: 'Competitive Companion not detected. Problem data copied to clipboard for manual import.',
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
 * Attempts to send problem data to Competitive Companion extension
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
      console.warn('Competitive Companion server responded with error:', response.status);
      return false;
    }
    
    return true;
    
  } catch (error) {
    console.warn('Competitive Companion connection failed:', error.message);
    return false;
  }
}

/**
 * Map LeetParse language names to Competitive Companion format
 * @param {string} language - LeetParse language name
 * @returns {string} - Competitive Companion language name
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
 * when Competitive Companion is not available
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