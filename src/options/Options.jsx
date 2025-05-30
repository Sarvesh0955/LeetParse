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
  useMediaQuery,
  Stack,
  Divider
} from '@mui/material';
import {
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Settings as SettingsIcon,
  Palette as PaletteIcon
} from '@mui/icons-material';
import { SnackbarProvider, useSnackbar } from 'notistack';

function Options() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState(prefersDarkMode ? 'dark' : 'light');

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
        main: mode === 'light' ? '#0A84FF' : '#60A5FA',
        light: mode === 'light' ? '#3B82F6' : '#93C5FD',
        dark: mode === 'light' ? '#1D4ED8' : '#2563EB',
      },
      secondary: {
        main: mode === 'light' ? '#8B5CF6' : '#A78BFA',
        light: mode === 'light' ? '#A78BFA' : '#C4B5FD',
        dark: mode === 'light' ? '#6D28D9' : '#7C3AED',
      },
      success: {
        main: mode === 'light' ? '#10B981' : '#34D399',
        light: mode === 'light' ? '#34D399' : '#6EE7B7',
        dark: mode === 'light' ? '#059669' : '#10B981',
      },
      error: {
        main: '#EF4444',
        light: '#F87171',
        dark: '#DC2626',
      },
      background: {
        default: mode === 'light' ? '#F9FAFB' : '#111827',
        paper: mode === 'light' ? '#FFFFFF' : '#1F2937',
        code: mode === 'light' ? '#F3F4F6' : '#374151',
      },
      text: {
        primary: mode === 'light' ? '#111827' : '#F9FAFB',
        secondary: mode === 'light' ? '#4B5563' : '#9CA3AF',
      },
      divider: mode === 'light' ? '#E5E7EB' : '#374151',
    },
    typography: {
      fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
      h1: {
        fontWeight: 700,
      },
      h2: {
        fontWeight: 600,
      },
      h3: {
        fontWeight: 600,
      },
      h4: {
        fontWeight: 600,
      },
      h5: {
        fontWeight: 600,
      },
      h6: {
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
            padding: '10px 20px',
          },
          contained: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: mode === 'light' ? '#E5E7EB' : '#374151',
            },
          },
        },
      },
    },
  });

  useEffect(() => {
    chrome.storage.sync.get(defaultSettings, (items) => {
      try {
        setSettings(items || defaultSettings);
        let themeToUse = items?.theme || 'system';
        if (themeToUse === 'system') {
          themeToUse = prefersDarkMode ? 'dark' : 'light';
        }
        setMode(themeToUse);
      } catch (error) {
        console.error('Failed to load settings:', error);
        setSettings(defaultSettings);
        setMode(prefersDarkMode ? 'dark' : 'light');
      }
    });
    
    const handleStorageChange = (changes, area) => {
      if (area === 'sync' && changes.theme) {
        try {
          let themeToUse = changes.theme.newValue;
          if (themeToUse === 'system') {
            themeToUse = prefersDarkMode ? 'dark' : 'light';
          }
          setMode(themeToUse);
          setSettings(prev => ({ ...prev, theme: changes.theme.newValue }));
        } catch (error) {
          console.error('Failed to handle theme change:', error);
        }
      }
    };
    
    try {
      chrome.storage.onChanged.addListener(handleStorageChange);
    } catch (error) {
      console.error('Failed to set up storage listener:', error);
    }
    
    return () => {
      try {
        chrome.storage.onChanged.removeListener(handleStorageChange);
      } catch (error) {
        console.error('Failed to remove storage listener:', error);
      }
    };
  }, [prefersDarkMode]);

  const saveSettings = () => {
    try {
      chrome.storage.sync.set(settings, () => {
        if (chrome.runtime.lastError) {
          console.error('Save settings error:', chrome.runtime.lastError);
          enqueueSnackbar('Failed to save settings', { variant: 'error' });
          return;
        }
        enqueueSnackbar('Settings saved successfully', { variant: 'success' });
        let themeToUse = settings.theme;
        if (themeToUse === 'system') {
          themeToUse = prefersDarkMode ? 'dark' : 'light';
        }
        setMode(themeToUse);
      });
    } catch (error) {
      console.error('Failed to save settings:', error);
      enqueueSnackbar('Failed to save settings', { variant: 'error' });
    }
  };

  const resetSettings = () => {
    try {
      setSettings(defaultSettings);
      chrome.storage.sync.set(defaultSettings, () => {
        if (chrome.runtime.lastError) {
          console.error('Reset settings error:', chrome.runtime.lastError);
          enqueueSnackbar('Failed to reset settings', { variant: 'error' });
          return;
        }
        enqueueSnackbar('Settings reset to defaults', { variant: 'info' });
        
        let themeToUse = defaultSettings.theme;
        if (themeToUse === 'system') {
          themeToUse = prefersDarkMode ? 'dark' : 'light';
        }
        setMode(themeToUse);
      });
    } catch (error) {
      console.error('Failed to reset settings:', error);
      enqueueSnackbar('Failed to reset settings', { variant: 'error' });
    }
  };

  const toggleTheme = () => {
    try {
      const newMode = mode === 'light' ? 'dark' : 'light';
      setMode(newMode);
      const newSettings = { ...settings, theme: newMode };
      setSettings(newSettings);
    } catch (error) {
      console.error('Failed to toggle theme:', error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
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

          <Stack spacing={4}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                borderRadius: 2,
                bgcolor: 'background.code',
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                <PaletteIcon color="primary" />
                <Typography variant="h6">
                  Appearance
                </Typography>
              </Stack>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="theme-select-label">Theme</InputLabel>
                <Select
                  labelId="theme-select-label"
                  value={settings.theme}
                  label="Theme"
                  onChange={(e) => {
                    const newTheme = e.target.value;
                    setMode(newTheme === 'system' ? (prefersDarkMode ? 'dark' : 'light') : newTheme);
                    setSettings(prev => ({ ...prev, theme: newTheme }));
                  }}
                  sx={{
                    bgcolor: 'background.paper',
                  }}
                >
                  <MenuItem value="system">System Default</MenuItem>
                  <MenuItem value="light">Light</MenuItem>
                  <MenuItem value="dark">Dark</MenuItem>
                </Select>
              </FormControl>
            </Paper>

            <Divider />

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
          </Stack>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}

function OptionsWrapper() {
  return (
    <SnackbarProvider 
      maxSnack={3}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      autoHideDuration={3000}
    >
      <Options />
    </SnackbarProvider>
  );
}

export default OptionsWrapper;