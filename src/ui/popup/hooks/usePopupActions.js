import { useSnackbar } from 'notistack';

/**
 * Custom hook to manage popup actions (parse, extract, navigate)
 */
export const usePopupActions = ({ 
  selectedLanguage, 
  setParseLoading, 
  setExtractLoading, 
  setTestCase, 
  setCodeSnippet 
}) => {
  const { enqueueSnackbar } = useSnackbar();

  // Handle parse button click
  const handleParseProblem = () => {
    try {
      setParseLoading(true);
      setTestCase('');
      setCodeSnippet('');
      const language = selectedLanguage;
      
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs[0]?.id) {
          setParseLoading(false);
          enqueueSnackbar('Cannot access the current tab', { variant: 'error' });
          return;
        }
        
        chrome.tabs.sendMessage(tabs[0].id, { 
          action: "parseProblem",
          language: language
        }, (response) => {
          if (chrome.runtime.lastError) {
            setParseLoading(false);
            enqueueSnackbar('Please refresh the page and try again', { variant: 'error' });
          }
        });
      });
    } catch (err) {
      setParseLoading(false);
      console.error('Error parsing problem:', err);
      enqueueSnackbar('Failed to parse problem', { variant: 'error' });
    }
  };

  // Handle extract test cases button click
  const handleExtractTestCasesOnly = () => {
    try {
      setExtractLoading(true);
      setTestCase('');
      setCodeSnippet('');
      const language = selectedLanguage;
      
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs[0]?.id) {
          setExtractLoading(false);
          enqueueSnackbar('Cannot access the current tab', { variant: 'error' });
          return;
        }
        
        chrome.tabs.sendMessage(tabs[0].id, { 
          action: "otherTests",
          language: language
        }, (response) => {
          if (chrome.runtime.lastError) {
            setExtractLoading(false);
            enqueueSnackbar('Please refresh the page and try again', { variant: 'error' });
          }
        });
      });
    } catch (err) {
      setExtractLoading(false);
      console.error('Error extracting test cases:', err);
      enqueueSnackbar('Failed to extract test cases', { variant: 'error' });
    }
  };

  // Handle navigate to LeetCode button click
  const handleGoToLeetCode = () => {
    try {
      chrome.tabs.create({ url: 'https://leetcode.com/problemset/all/' });
    } catch (err) {
      console.error('Error opening LeetCode:', err);
      enqueueSnackbar('Failed to open LeetCode', { variant: 'error' });
    }
  };

  return {
    handleParseProblem,
    handleExtractTestCasesOnly,
    handleGoToLeetCode
  };
};

export default usePopupActions;
