import React from 'react';
import { Typography, Paper } from '@mui/material';

/**
 * Options page header component
 */
const OptionsHeader = () => {
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h4" gutterBottom color="primary" fontWeight="bold">
        LeetParse Settings
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Configure your preferences for the LeetCode parser extension
      </Typography>
    </Paper>
  );
};

export default OptionsHeader;
