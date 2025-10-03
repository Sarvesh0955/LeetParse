import React from 'react';
import {
  Typography,
  Button,
  Paper,
  Stack,
  Divider
} from '@mui/material';
import { Save as SaveIcon, RestorePageOutlined as ResetIcon } from '@mui/icons-material';

/**
 * Action buttons component for save/reset functionality
 */
const OptionsActionButtons = ({ hasChanges, onSave, onReset }) => {
  return (
    <>
      <Divider sx={{ my: 4 }} />
      
      <Paper sx={{ p: 3 }}>
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button
            variant="outlined"
            startIcon={<ResetIcon />}
            onClick={onReset}
            color="secondary"
          >
            Reset to Defaults
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={onSave}
            disabled={!hasChanges}
            color="primary"
          >
            Save Settings
          </Button>
        </Stack>
        
        {hasChanges && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            You have unsaved changes
          </Typography>
        )}
      </Paper>
    </>
  );
};

export default OptionsActionButtons;
