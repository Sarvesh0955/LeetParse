import { useState, useEffect } from 'react';
import { 
  ThemeProvider, 
  CssBaseline,
  Box,
  Stack
} from '@mui/material';
import { SnackbarProvider, useSnackbar } from 'notistack';

// Components
import AppHeader from './components/AppHeader';
import LanguageSelector from './components/LanguageSelector';
import ActionButtons from './components/ActionButtons';
import NotOnLeetcodePage from './components/NotOnLeetcodePage';
import AboutLeetParse from './components/AboutLeetParse';
import TestCaseInstructions from './components/TestCaseInstructions';
import CodeBlock from './components/CodeBlock';
import LoadingIndicator from './components/LoadingIndicator';

// Common hooks and theme
import useThemeMode from '../common/hooks/useThemeMode';
import { createAppTheme } from '../common/theme/theme';

function App() {
  // State
  const [isLeetCodeProblem, setIsLeetCodeProblem] = useState(false);
  const [parseLoading, setParseLoading] = useState(false);
  const [extractLoading, setExtractLoading] = useState(false);
  const [error, setError] = useState('');
  const [cfInput, setCfInput] = useState('');
  const [boilerplateCode, setBoilerplateCode] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('cpp');
  
  // Hooks
  const [mode, toggleTheme] = useThemeMode();
  const { enqueueSnackbar } = useSnackbar();
  const theme = createAppTheme(mode);

  // Load preferred language and check if on LeetCode page
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

    // Message listener for background communication
    const messageListener = (message) => {
      if (message.action === "codeGenerated") {
        setParseLoading(false);
        
        if (message.error) {
          setError(message.error);
          enqueueSnackbar(message.error, { variant: 'error' });
        } else {
          setBoilerplateCode(message.boilerplateCode || '');
          setCfInput(message.testCase || '');
          setError('');
        }
      }
      else if(message.action === "otherTestsGenerated") {
        setExtractLoading(false);
        
        if (message.error) {
          setError(message.error);
          enqueueSnackbar(message.error, { variant: 'error' });
        } else {
          setCfInput(message.testCase || '');
          setError('');
        }
      }
    };
    
    chrome.runtime.onMessage.addListener(messageListener);
    return () => chrome.runtime.onMessage.removeListener(messageListener);
  }, [enqueueSnackbar]);

  // Handle parse button click
  const handleParseProblem = () => {
    try {
      setParseLoading(true);
      setError('');
      setCfInput('');
      setBoilerplateCode('');
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
      setError('');
      setCfInput('');
      setBoilerplateCode('');
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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        width: 400,
        p: 2,
        minHeight: 200,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <AppHeader mode={mode} toggleTheme={toggleTheme} />

        {!isLeetCodeProblem ? (
          <>
            <NotOnLeetcodePage handleGoToLeetCode={handleGoToLeetCode} />
            <AboutLeetParse />
          </>
        ) : (
          <>
            <Stack spacing={2} sx={{ mb: 2 }}>
              <LanguageSelector 
                selectedLanguage={selectedLanguage} 
                setSelectedLanguage={setSelectedLanguage}
              />
              <ActionButtons 
                parseLoading={parseLoading} 
                extractLoading={extractLoading}
                handleParseProblem={handleParseProblem}
                handleExtractTestCasesOnly={handleExtractTestCasesOnly}
              />
            </Stack>

            {!cfInput && !boilerplateCode ? (
              <TestCaseInstructions />
            ) : null}
            
            <LoadingIndicator loading={parseLoading || extractLoading} />

            {cfInput && (
              <CodeBlock
                title="Test Cases"
                content={cfInput}
                type="terminal"
                onCopy={() => enqueueSnackbar('Test cases copied to clipboard', { variant: 'success' })}
              />
            )}

            {boilerplateCode && (
              <CodeBlock
                title="C++ Solution"
                content={boilerplateCode}
                type="code"
                onCopy={() => enqueueSnackbar('Code copied to clipboard', { variant: 'success' })}
              />
            )}
          </>
        )}
      </Box>
    </ThemeProvider>
  );
}

function AppWrapper() {
  return (
    <SnackbarProvider 
      maxSnack={3}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      autoHideDuration={2000}
    >
      <App />
    </SnackbarProvider>
  );
}

export default AppWrapper;
