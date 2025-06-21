import React from 'react';
import { 
  ThemeProvider, 
  CssBaseline,
  Box
} from '@mui/material';
import { SnackbarProvider } from 'notistack';

// Components
import { AppHeader, LeetCodePageContent, NonLeetCodePageContent } from './components';

// Common hooks and theme
import useThemeMode from '../common/hooks/useThemeMode';
import { createAppTheme } from '../common/theme/theme';

// Local hooks
import { usePopupState, useBackgroundConnection, usePopupActions } from './hooks';

function App() {
  // Theme
  const [mode, toggleTheme] = useThemeMode();
  const theme = createAppTheme(mode);

  // Popup state management
  const {
    isLeetCodeProblem,
    parseLoading,
    extractLoading,
    testCase,
    codeSnippet,
    selectedLanguage,
    setParseLoading,
    setExtractLoading,
    setTestCase,
    setCodeSnippet,
    setSelectedLanguage
  } = usePopupState();

  // Background communication
  useBackgroundConnection({
    setParseLoading,
    setExtractLoading,
    setTestCase,
    setCodeSnippet
  });

  // Action handlers
  const {
    handleParseProblem,
    handleExtractTestCasesOnly,
    handleGoToLeetCode
  } = usePopupActions({
    selectedLanguage,
    setParseLoading,
    setExtractLoading,
    setTestCase,
    setCodeSnippet
  });

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
          <NonLeetCodePageContent handleGoToLeetCode={handleGoToLeetCode} />
        ) : (
          <LeetCodePageContent
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            parseLoading={parseLoading}
            extractLoading={extractLoading}
            handleParseProblem={handleParseProblem}
            handleExtractTestCasesOnly={handleExtractTestCasesOnly}
            testCase={testCase}
            codeSnippet={codeSnippet}
          />
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
