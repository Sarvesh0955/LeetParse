import React from 'react';
import { Stack } from '@mui/material';
import { useSnackbar } from 'notistack';

// Components
import LanguageSelector from './LanguageSelector';
import ActionButtons from './ActionButtons';
import TestCaseInstructions from './TestCaseInstructions';
import CodeBlock from './CodeBlock';
import LoadingIndicator from './LoadingIndicator';

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
  );
};

export default LeetCodePageContent;
