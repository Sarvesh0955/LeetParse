import { Box, Stack, Typography, IconButton } from '@mui/material';
import { 
  DarkMode as DarkModeIcon, 
  LightMode as LightModeIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';

/**
 * Header component for the Options page
 * 
 * @param {Object} props
 * @param {string} props.mode - Current theme mode ('light'|'dark')
 * @param {Function} props.toggleTheme - Function to toggle between light and dark theme
 * @returns {JSX.Element}
 */
const OptionsHeader = ({ mode, toggleTheme }) => {
  return (
    <Box sx={{ 
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      mb: 4
    }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <SettingsIcon color="primary" sx={{ fontSize: 28 }} />
        <Typography variant="h5" component="h1" fontWeight="bold">
          LeetParse Settings
        </Typography>
      </Stack>
      <IconButton 
        onClick={toggleTheme} 
        size="large"
        sx={{ 
          bgcolor: 'background.code',
          '&:hover': {
            bgcolor: mode === 'light' ? 'grey.200' : 'grey.800',
          },
        }}
      >
        {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
      </IconButton>
    </Box>
  );
};

export default OptionsHeader;
