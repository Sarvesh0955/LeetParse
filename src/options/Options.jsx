import React, { useState, useEffect } from 'react';
import {
  ThemeProvider,
  CssBaseline,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Paper,
  Stack,
  Divider,
  Alert,
  Snackbar
} from '@mui/material';
import { Save as SaveIcon, RestorePageOutlined as ResetIcon } from '@mui/icons-material';

// Common hooks and theme
import useThemeMode from '../common/hooks/useThemeMode';
import { createAppTheme } from '../common/theme/theme';
import { defaultSettings } from '../utils/defaultSettings';

function Options() {
  // Theme
  const [mode, toggleTheme, setMode] = useThemeMode();
  const theme = createAppTheme(mode);

  // Settings state
  const [settings, setSettings] = useState(defaultSettings);
  const [userTemplate, setUserTemplate] = useState('');
  const [savedSettings, setSavedSettings] = useState(defaultSettings); // Track saved settings
  const [hasChanges, setHasChanges] = useState(false);
  
  // UI state
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load settings from storage
  useEffect(() => {
    chrome.storage.sync.get(['theme', 'preferredLanguage', 'userTemplate'], (result) => {
      const loadedSettings = {
        theme: result.theme || defaultSettings.theme,
        preferredLanguage: result.preferredLanguage || defaultSettings.preferredLanguage,
        userTemplate: result.userTemplate || defaultSettings.userTemplate
      };
      setSettings(loadedSettings);
      setSavedSettings(loadedSettings); // Track what's currently saved
      setUserTemplate(loadedSettings.userTemplate);
      setLoading(false);
    });
  }, []);

  // Track changes
  useEffect(() => {
    const hasChanged = 
      settings.theme !== savedSettings.theme ||
      settings.preferredLanguage !== savedSettings.preferredLanguage ||
      userTemplate !== savedSettings.userTemplate;
    setHasChanges(hasChanged);
  }, [settings, userTemplate, savedSettings]);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = async () => {
    try {
      const settingsToSave = {
        ...settings,
        userTemplate: userTemplate
      };
      
      await chrome.storage.sync.set(settingsToSave);
      setSavedSettings(settingsToSave); // Update saved settings tracker
      setSaveSuccess(true);
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const handleResetToDefaults = () => {
    setSettings(defaultSettings);
    setUserTemplate(defaultSettings.userTemplate);
    setSavedSettings(defaultSettings); // Update saved settings tracker
    chrome.storage.sync.set(defaultSettings);
  };

  const getDefaultTemplate = () => {
    return `// Your custom C++ code here
// Add your commonly used macros, typedefs, and utility functions
// This will be inserted into the main template

#define ll long long
#define vi vector<int>
#define vll vector<long long>
#define pii pair<int, int>
#define pb push_back
#define mp make_pair

// Example utility functions:
// int gcd(int a, int b) { return b ? gcd(b, a % b) : a; }
// int power(int a, int b, int mod) { ... }
`;
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography>Loading settings...</Typography>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        minHeight: '100vh',
        bgcolor: 'background.default',
        p: 4
      }}>
        <Box sx={{ maxWidth: 800, mx: 'auto' }}>
          {/* Header */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h4" gutterBottom color="primary" fontWeight="bold">
              LeetParse Settings
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Configure your preferences for the LeetCode parser extension
            </Typography>
          </Paper>

          {/* Settings Sections */}
          <Stack spacing={3}>
            {/* Language Settings */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom color="text.primary" fontWeight="600">
                Language Preferences
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Choose your default programming language for code generation
              </Typography>
              
              <FormControl fullWidth>
                <InputLabel>Default Language</InputLabel>
                <Select
                  value={settings.preferredLanguage}
                  label="Default Language"
                  onChange={(e) => handleSettingChange('preferredLanguage', e.target.value)}
                >
                  <MenuItem value="cpp">C++</MenuItem>
                  {/* Currently only C++ is available as requested */}
                </Select>
              </FormControl>
              
              <Alert severity="info" sx={{ mt: 2 }}>
                Currently, only C++ is supported. More languages will be added in future updates.
              </Alert>
            </Paper>

            {/* Theme Settings */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom color="text.primary" fontWeight="600">
                Appearance
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Customize the visual theme of the extension
              </Typography>
              
              <FormControl fullWidth>
                <InputLabel>Theme</InputLabel>
                <Select
                  value={settings.theme}
                  label="Theme"
                  onChange={(e) => handleSettingChange('theme', e.target.value)}
                >
                  <MenuItem value="light">Light</MenuItem>
                  <MenuItem value="dark">Dark</MenuItem>
                  <MenuItem value="system">System (Auto)</MenuItem>
                </Select>
              </FormControl>
            </Paper>

            {/* Template Settings */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom color="text.primary" fontWeight="600">
                User Template
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Add your custom C++ code that will be inserted into the main template. This can include macros, typedefs, utility functions, etc.
              </Typography>
              
              <TextField
                fullWidth
                multiline
                rows={12}
                value={userTemplate}
                onChange={(e) => setUserTemplate(e.target.value)}
                placeholder={getDefaultTemplate()}
                variant="outlined"
                sx={{
                  '& .MuiInputBase-input': {
                    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                    fontSize: '0.875rem'
                  }
                }}
              />
              
              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setUserTemplate(getDefaultTemplate())}
                >
                  Load Example Template
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setUserTemplate('')}
                >
                  Clear Template
                </Button>
              </Stack>
              
              <Alert severity="info" sx={{ mt: 2 }}>
                Your custom template will be inserted into the main C++ template at the designated location. 
                Leave empty to use no additional template code.
              </Alert>
            </Paper>
          </Stack>

          <Divider sx={{ my: 4 }} />

          {/* Action Buttons */}
          <Paper sx={{ p: 3 }}>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                startIcon={<ResetIcon />}
                onClick={handleResetToDefaults}
                color="secondary"
              >
                Reset to Defaults
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSaveSettings}
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

          {/* Success Snackbar */}
          <Snackbar
            open={saveSuccess}
            autoHideDuration={3000}
            onClose={() => setSaveSuccess(false)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert onClose={() => setSaveSuccess(false)} severity="success">
              Settings saved successfully!
            </Alert>
          </Snackbar>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default Options;