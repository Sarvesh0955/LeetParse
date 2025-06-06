import { Box, Typography, IconButton } from '@mui/material';
import { 
  DarkMode as DarkModeIcon, 
  LightMode as LightModeIcon
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
      <IconButton 
        onClick={toggleTheme} 
        size="small"
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

export default AppHeader;
