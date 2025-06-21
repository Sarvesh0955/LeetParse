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
  const [testCase, setTestCase] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('cpp');
  
  // Hooks
  const [mode, toggleTheme] = useThemeMode();
  const { enqueueSnackbar } = useSnackbar();
  const theme = createAppTheme(mode);

  // Initialize port connection
  useEffect(() => {
    const backgroundPort = chrome.runtime.connect({ name: 'popup' });

    const messageListener = (message) => {
      switch (message.action) {
        case 'connectionEstablished':
          break;
          
        case 'codeGenerated':
          setParseLoading(false);
          if (message.error) {
            console.error('Code generation error:', message.error);
            enqueueSnackbar(message.error, { variant: 'error' });
          } else {
            setCodeSnippet(message.codeSnippet || '');
            setTestCase(message.testCase || '');
            enqueueSnackbar('Code generated successfully!', { variant: 'success' });
          }
          break;
          
        case 'otherTestsGenerated':
          setExtractLoading(false);
          if (message.error) {
            console.error('Test case error:', message.error);
            enqueueSnackbar(message.error, { variant: 'error' });
          } else {
            console.log('Test cases generated successfully');
            setTestCase(message.testCase || '');
            enqueueSnackbar('Test cases extracted successfully!', { variant: 'success' });
          }
          break;
          
        default:
          console.log('Unknown message action:', message.action);
      }
    };

    backgroundPort.onMessage.addListener(messageListener);

    const disconnectListener = () => {
      console.log('Popup disconnected from background');
    };

    backgroundPort.onDisconnect.addListener(disconnectListener);

    return () => {
      if (backgroundPort) {
        backgroundPort.onMessage.removeListener(messageListener);
        backgroundPort.onDisconnect.removeListener(disconnectListener);
        backgroundPort.disconnect();
      }
    };
  }, [enqueueSnackbar]);

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

            {!testCase && !codeSnippet ? (
              <TestCaseInstructions />
            ) : null}
            
            <LoadingIndicator loading={parseLoading || extractLoading} />

            {testCase && (
              <CodeBlock
                title="Test Cases"
                content={testCase}
                type="terminal"
                onCopy={() => enqueueSnackbar('Test cases copied to clipboard', { variant: 'success' })}
              />
            )}

            {codeSnippet && (
              <CodeBlock
                title="C++ Solution"
                content={codeSnippet}
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
      maxSnack={2}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      autoHideDuration={1000}
    >
      <App />
    </SnackbarProvider>
  );
}

export default AppWrapper;
