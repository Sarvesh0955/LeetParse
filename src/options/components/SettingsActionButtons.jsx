import { Stack, Button } from '@mui/material';

/**
 * Component for settings action buttons
 * 
 * @param {Object} props
 * @param {Function} props.resetSettings - Function to reset settings to defaults
 * @param {Function} props.saveSettings - Function to save settings
 * @returns {JSX.Element}
 */
const SettingsActionButtons = ({ resetSettings, saveSettings }) => {
  return (
    <Stack direction="row" spacing={2} justifyContent="flex-end">
      <Button
        variant="outlined"
        onClick={resetSettings}
        color="inherit"
        sx={{
          borderColor: 'divider',
          '&:hover': {
            borderColor: 'primary.main',
            bgcolor: 'background.code',
          },
        }}
      >
        Reset to Defaults
      </Button>
      <Button
        variant="contained"
        onClick={saveSettings}
        color="primary"
      >
        Save Settings
      </Button>
    </Stack>
  );
};

export default SettingsActionButtons;
