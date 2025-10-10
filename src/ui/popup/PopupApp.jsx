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

function PopupApp() {
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
    sampleOutputs,
    setParseLoading,
    setExtractLoading,
    setTestCase,
    setCodeSnippet,
    setSelectedLanguage,
    setSampleOutputs
  } = usePopupState();

  // Background communication
  useBackgroundConnection({
    setParseLoading,
    setExtractLoading,
    setTestCase,
    setCodeSnippet,
    setSampleOutputs
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
    setCodeSnippet,
    setSampleOutputs
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
            sampleOutputs={sampleOutputs}
          />
        )}
      </Box>
    </ThemeProvider>
  );
}

function PopupAppWrapper() {
  return (
    <SnackbarProvider 
      maxSnack={2}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      autoHideDuration={1000}
    >
      <PopupApp />
    </SnackbarProvider>
  );
}

export default PopupAppWrapper;
