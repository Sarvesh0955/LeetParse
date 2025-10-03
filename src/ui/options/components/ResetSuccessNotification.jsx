import React from 'react';
import { Snackbar, Alert } from '@mui/material';

/**
 * Success notification component for reset to defaults confirmation
 */
const ResetSuccessNotification = ({ open, onClose }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert onClose={onClose} severity="info">
        Settings reset to defaults successfully!
      </Alert>
    </Snackbar>
  );
};

export default ResetSuccessNotification;
