import React, { useState } from 'react';
import { Button, Tooltip, Box, CircularProgress } from '@mui/material';
import { Code as CodeIcon } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { EXPORT_TO_VSCODE, VSCODE_EXPORT_SUCCESS, VSCODE_EXPORT_ERROR } from '../../../messaging/messages.js';

/**
 * CPH Integration Component
 * Provides functionality to export parsed problems directly to CPH
 */
const VSCodeIntegration = ({ 
  selectedLanguage, 
  testCase, 
  codeSnippet, 
  parseLoading, 
  extractLoading,
  sampleOutputs = [],
  problemData = null
}) => {
  const [exporting, setExporting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  /**
   * Handles exporting the current problem to CPH
   */
  const handleExportToVSCode = async () => {
    if (!selectedLanguage) {
      enqueueSnackbar('Please select a language first', { variant: 'warning' });
      return;
    }

    if (!testCase && !codeSnippet) {
      enqueueSnackbar('Please parse the problem first', { variant: 'warning' });
      return;
    }

    try {
      setExporting(true);
      
      // Get current tab info for problem context
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      const currentTab = tabs[0];
      
      // Extract problem name from URL or use fallback
      const problemName = extractProblemName(currentTab.url) || 'leetcode-problem';
      
      // Send export request to background script
      const response = await chrome.runtime.sendMessage({
        action: EXPORT_TO_VSCODE,
        code: codeSnippet,
        testCases: testCase || '',
        problemName: problemName,
        language: selectedLanguage,
        problemUrl: currentTab.url,
        sampleOutputs: sampleOutputs,
        ...problemData // Any additional problem data
      });

      // Stop loading immediately after sending the request
      setExporting(false);

      if (response?.received) {
        enqueueSnackbar('Request sent to CPH', { variant: 'success' });
        
        // Listen for the actual result (optional - for additional feedback)
        const handleMessage = (message) => {
          if (message.action === VSCODE_EXPORT_SUCCESS) {
            enqueueSnackbar(message.message, { variant: 'success' });
            chrome.runtime.onMessage.removeListener(handleMessage);
          } else if (message.action === VSCODE_EXPORT_ERROR) {
            const variant = message.fallback ? 'warning' : 'error';
            enqueueSnackbar(message.message, { variant });
            chrome.runtime.onMessage.removeListener(handleMessage);
          }
        };
        
        chrome.runtime.onMessage.addListener(handleMessage);
        
        // Timeout after 10 seconds
        setTimeout(() => {
          chrome.runtime.onMessage.removeListener(handleMessage);
        }, 10000);
      } else {
        enqueueSnackbar('Failed to send request to CPH', { variant: 'error' });
      }
      
    } catch (error) {
      setExporting(false);
      console.error('Export to CPH failed:', error);
      enqueueSnackbar('Failed to export to CPH', { variant: 'error' });
    }
  };

  /**
   * Extracts problem name from LeetCode URL
   * @param {string} url - The current tab URL
   * @returns {string|null} - Extracted problem name or null
   */
  const extractProblemName = (url) => {
    try {
      const match = url.match(/\/problems\/([^\/]+)/);
      return match ? match[1] : null;
    } catch {
      return null;
    }
  };

  const isDisabled = parseLoading || extractLoading || exporting || !selectedLanguage || (!testCase && !codeSnippet);

  return (
    <Tooltip 
      title={
        !selectedLanguage 
          ? "Select a language to enable CPH export"
          : (!testCase && !codeSnippet)
          ? "Parse the problem first to enable CPH export"
          : "Export parsed problem directly to CPH"
      }
    >
      <Box sx={{ width: '100%' }}>
        <Button
          variant="outlined"
          startIcon={exporting ? <CircularProgress size={16} /> : <CodeIcon />}
          onClick={handleExportToVSCode}
          disabled={isDisabled}
          sx={{ 
            width: '100%',
            borderColor: 'secondary.main',
            color: 'secondary.main',
            '&:hover': {
              borderColor: 'secondary.dark',
              bgcolor: 'secondary.main',
              color: 'white',
            },
            '&:disabled': {
              borderColor: 'action.disabled',
              color: 'action.disabled',
            }
          }}
        >
          {exporting ? 'Exporting to VS Code...' : 'Export to VS Code'}
        </Button>
      </Box>
    </Tooltip>
  );
};

export default VSCodeIntegration;