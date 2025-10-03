import { Paper, Typography, Stack, Button } from '@mui/material';
import { OpenInNew as OpenInNewIcon } from '@mui/icons-material';

/**
 * Component displayed when not on a LeetCode problem page
 * 
 * @param {Object} props
 * @param {Function} props.handleGoToLeetCode - Function to navigate to LeetCode problems page
 * @returns {JSX.Element}
 */
const NotOnLeetcodePage = ({ handleGoToLeetCode }) => {
  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3, 
        textAlign: 'center',
        bgcolor: 'background.code',
        border: '1px solid',
        borderColor: 'divider',
        mb: 2
      }}
    >
      <Typography variant="h6" gutterBottom>
        Not on a LeetCode Problem Page
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Navigate to a LeetCode problem to use this extension
      </Typography>
      <Stack spacing={2} direction="column" alignItems="center">
        <Button
          variant="contained"
          color="primary"
          startIcon={<OpenInNewIcon />}
          onClick={handleGoToLeetCode}
          fullWidth
        >
          Go to LeetCode Problems
        </Button>
        <Typography variant="caption" color="text.secondary">
          Or open any LeetCode problem page to get started
        </Typography>
      </Stack>
    </Paper>
  );
};

export default NotOnLeetcodePage;
