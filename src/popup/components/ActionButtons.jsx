import { Button, Stack, Box, CircularProgress } from '@mui/material';

/**
 * Component for displaying action buttons (Parse and Extract)
 * 
 * @param {Object} props
 * @param {boolean} props.parseLoading - Whether parsing is in progress
 * @param {boolean} props.extractLoading - Whether extraction is in progress
 * @param {Function} props.handleParseProblem - Function to handle parse button click
 * @param {Function} props.handleExtractTestCasesOnly - Function to handle extract test cases button click
 * @returns {JSX.Element}
 */
const ActionButtons = ({ 
  parseLoading, 
  extractLoading, 
  handleParseProblem, 
  handleExtractTestCasesOnly 
}) => {
  return (
    <Stack direction="row" spacing={1.5} width="100%">
      <Button
        variant="contained"
        disabled={parseLoading || extractLoading}
        onClick={handleParseProblem}
        sx={{ 
          flex: 1,
          bgcolor: 'primary.main',
          '&:hover': {
            bgcolor: 'primary.dark',
          },
        }}
      >
        {parseLoading ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CircularProgress size={16} color="inherit" />
            <span>Parsing...</span>
          </Box>
        ) : (
          'Parse with sample tests'
        )}
      </Button>
      <Button
        variant="contained"
        disabled={parseLoading || extractLoading}
        onClick={handleExtractTestCasesOnly}
        sx={{ 
          flex: 1,
          bgcolor: 'primary.main',
          '&:hover': {
            bgcolor: 'primary.dark',
          },
        }}
      >
        {extractLoading ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CircularProgress size={16} color="inherit" />
            <span>Extracting...</span>
          </Box>
        ) : (
          'Extract test cases only'
        )}
      </Button>
    </Stack>
  );
};

export default ActionButtons;
