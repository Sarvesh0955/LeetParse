import React from 'react';
import { Snackbar, Alert } from '@mui/material';

/**
 * Success notification component for save confirmation
 */
const SaveSuccessNotification = ({ open, onClose }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert onClose={onClose} severity="success">
        Settings saved successfully!
      </Alert>
    </Snackbar>
  );
};

export default SaveSuccessNotification;
