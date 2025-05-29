import { useState, useEffect } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  Container,
  Typography,
  IconButton,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Fade,
  useMediaQuery
} from '@mui/material';
import {
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
} from '@mui/icons-material';
import { SnackbarProvider, useSnackbar } from 'notistack';

function Options() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('leetcode-parser-theme');
    return savedMode || (prefersDarkMode ? 'dark' : 'light');
  });

  const defaultSettings = {
    theme: 'system',
    preferredLanguage: 'cpp',
  };

  const [settings, setSettings] = useState(defaultSettings);
  const { enqueueSnackbar } = useSnackbar();

  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'light' ? '#2cbb5d' : '#3dd56d',
      },
      background: {
        default: mode === 'light' ? '#f5f5f5' : '#1e1e1e',
        paper: mode === 'light' ? '#ffffff' : '#2a2a2a',
      },
    },
    typography: {
      fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
          },
        },
      },
    },
  });

  useEffect(() => {
    chrome.storage.sync.get(defaultSettings, (items) => {
      setSettings(items);
      let themeToUse = items.theme;
      if (themeToUse === 'system') {
        themeToUse = prefersDarkMode ? 'dark' : 'light';
      }
      setMode(themeToUse);
    });
  }, [prefersDarkMode]);

  const saveSettings = () => {
    chrome.storage.sync.set(settings, () => {
      enqueueSnackbar('Settings saved successfully', { variant: 'success' });
      let themeToUse = settings.theme;
      if (themeToUse === 'system') {
        themeToUse = prefersDarkMode ? 'dark' : 'light';
      }
      setMode(themeToUse);
    });
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    chrome.storage.sync.set(defaultSettings, () => {
      enqueueSnackbar('Settings reset to defaults', { variant: 'info' });
    });
  };

  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    setSettings(prev => ({ ...prev, theme: newMode }));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
          <Box sx={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4
          }}>
            <Typography variant="h5" component="h1" fontWeight="bold">
              LeetCode Parser Settings
            </Typography>
            <IconButton onClick={toggleTheme} size="large">
              {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Box>

          <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Appearance
            </Typography>
            <Box sx={{ mt: 2 }}>
              <FormControl fullWidth>
                <InputLabel id="theme-select-label">Theme</InputLabel>
                <Select
                  labelId="theme-select-label"
                  value={settings.theme}
                  label="Theme"
                  onChange={(e) => setSettings(prev => ({ ...prev, theme: e.target.value }))}
                >
                  <MenuItem value="system">System Default</MenuItem>
                  <MenuItem value="light">Light</MenuItem>
                  <MenuItem value="dark">Dark</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Paper>

          <Box sx={{ 
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2,
            mt: 4
          }}>
            <Button
              variant="outlined"
              onClick={resetSettings}
              color="inherit"
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
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}

function OptionsWrapper() {
  return (
    <SnackbarProvider 
      maxSnack={3}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      autoHideDuration={3000}
    >
      <Options />
    </SnackbarProvider>
  );
}

export default OptionsWrapper;