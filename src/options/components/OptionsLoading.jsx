import React from 'react';
import { ThemeProvider, CssBaseline, Box, Typography } from '@mui/material';

/**
 * Loading state component for options page
 */
const OptionsLoading = ({ theme }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography>Loading settings...</Typography>
      </Box>
    </ThemeProvider>
  );
};

export default OptionsLoading;
