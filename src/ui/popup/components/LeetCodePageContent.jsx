import React from 'react';
import { Stack, Button } from '@mui/material';
import { Settings as SettingsIcon } from '@mui/icons-material';
import { useSnackbar } from 'notistack';

// Components
import LanguageSelector from './LanguageSelector';
import ActionButtons from './ActionButtons';
import TestCaseInstructions from './TestCaseInstructions';
import CodeBlock from './CodeBlock';
import LoadingIndicator from './LoadingIndicator';
import VSCodeIntegration from './VSCodeIntegration';

/**
 * Component rendered when user is on a LeetCode problem page
 */
const LeetCodePageContent = ({
  selectedLanguage,
  setSelectedLanguage,
  parseLoading,
  extractLoading,
  handleParseProblem,
  handleExtractTestCasesOnly,
  testCase,
  codeSnippet
}) => {
  const { enqueueSnackbar } = useSnackbar();

  const handleOpenTemplateSettings = () => {
    chrome.tabs.create({
      url: chrome.runtime.getURL('options.html')
    });
  };

  return (
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
        <VSCodeIntegration
          selectedLanguage={selectedLanguage}
          testCase={testCase}
          codeSnippet={codeSnippet}
          parseLoading={parseLoading}
          extractLoading={extractLoading}
        />
        <Button
          variant="outlined"
          startIcon={<SettingsIcon />}
          onClick={handleOpenTemplateSettings}
          sx={{ 
            width: '100%',
            borderColor: 'primary.main',
            color: 'primary.main',
            '&:hover': {
              borderColor: 'primary.dark',
              bgcolor: 'primary.main',
              color: 'white',
            },
          }}
        >
          Change Template
        </Button>
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
          title={`${selectedLanguage.toUpperCase()} Code Snippet`}
          content={codeSnippet}
          type="code"
          onCopy={() => enqueueSnackbar('Code copied to clipboard', { variant: 'success' })}
        />
      )}
    </>
  );
};

export default LeetCodePageContent;
