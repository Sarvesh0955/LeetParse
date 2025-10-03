import { Box, Typography, IconButton } from '@mui/material';
import { 
  DarkMode as DarkModeIcon, 
  LightMode as LightModeIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';

/**
 * Header component for the LeetParse extension
 * 
 * @param {Object} props
 * @param {string} props.mode - Current theme mode ('light'|'dark')
 * @param {Function} props.toggleTheme - Function to toggle between light and dark theme
 * @returns {JSX.Element}
 */
const AppHeader = ({ mode, toggleTheme }) => {
  const handleOpenOptions = () => {
    // Open the options page in a new tab
    chrome.tabs.create({
      url: chrome.runtime.getURL('options.html')
    });
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between',
      alignItems: 'center',
      mb: 3
    }}>
      <Typography variant="h6" component="h1" fontWeight="bold">
        LeetParse
      </Typography>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <IconButton 
          onClick={handleOpenOptions} 
          size="small"
          sx={{ 
            bgcolor: 'background.code',
            '&:hover': {
              bgcolor: mode === 'light' ? 'grey.200' : 'grey.800',
            },
          }}
          title="Open Settings"
        >
          <SettingsIcon />
        </IconButton>
        <IconButton 
          onClick={toggleTheme} 
          size="small"
          sx={{ 
            bgcolor: 'background.code',
            '&:hover': {
              bgcolor: mode === 'light' ? 'grey.200' : 'grey.800',
            },
          }}
          title={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
        </IconButton>
      </Box>
    </Box>
  );
};

export default AppHeader;
