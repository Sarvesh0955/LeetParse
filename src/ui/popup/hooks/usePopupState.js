import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';

/**
 * Custom hook to manage popup state and LeetCode page detection
 */
export const usePopupState = () => {
  const [isLeetCodeProblem, setIsLeetCodeProblem] = useState(false);
  const [parseLoading, setParseLoading] = useState(false);
  const [extractLoading, setExtractLoading] = useState(false);
  const [testCase, setTestCase] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('cpp');
  const [sampleOutputs, setSampleOutputs] = useState([]);
  
  const { enqueueSnackbar } = useSnackbar();

  // Load preferred language and check current page
  useEffect(() => {
    chrome.storage.sync.get(['preferredLanguage'], (result) => {
      if (result.preferredLanguage) {
        setSelectedLanguage(result.preferredLanguage);
      }
    });
    
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      try {
        const url = tabs[0]?.url || '';
        setIsLeetCodeProblem(url.match(/^https:\/\/leetcode\.com\/problems\//) !== null);
      } catch (err) {
        console.error('Error checking URL:', err);
        enqueueSnackbar('Failed to check current page', { variant: 'error' });
      }
    });
  }, [enqueueSnackbar]);

  return {
    // State
    isLeetCodeProblem,
    parseLoading,
    extractLoading,
    testCase,
    codeSnippet,
    selectedLanguage,
    sampleOutputs,
    
    // Setters
    setParseLoading,
    setExtractLoading,
    setTestCase,
    setCodeSnippet,
    setSelectedLanguage,
    setSampleOutputs
  };
};

export default usePopupState;
