import React from 'react';
import {
  ThemeProvider,
  CssBaseline,
  Box,
  Stack
} from '@mui/material';

// Common hooks and theme
import useThemeMode from '../common/hooks/useThemeMode';
import { createAppTheme } from '../common/theme/theme';

// Local hooks
import { useSettings } from './hooks';

// Components
import {
  OptionsHeader,
  LanguageSettings,
  ThemeSettings,
  TemplateSettings,
  OptionsActionButtons,
  OptionsLoading,
  SaveSuccessNotification,
  ResetSuccessNotification
} from './components';

function OptionsApp() {
  // Theme
  const [mode] = useThemeMode();
  const theme = createAppTheme(mode);

  // Settings management
  const {
    settings,
    userTemplates,
    hasChanges,
    loading,
    saveSuccess,
    resetSuccess,
    handleSettingChange,
    handleUserTemplateChange,
    handleSaveSettings,
    handleResetToDefaults,
    closeSaveSuccess,
    closeResetSuccess
  } = useSettings();

  if (loading) {
    return <OptionsLoading theme={theme} />;
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
          <OptionsHeader />

          {/* Settings Sections */}
          <Stack spacing={3}>
            <LanguageSettings 
              settings={settings}
              onSettingChange={handleSettingChange}
            />

            <ThemeSettings 
              settings={settings}
              onSettingChange={handleSettingChange}
            />

            <TemplateSettings 
              userTemplates={userTemplates}
              selectedLanguage={settings.preferredLanguage}
              onUserTemplateChange={handleUserTemplateChange}
            />
          </Stack>

          <OptionsActionButtons 
            hasChanges={hasChanges}
            onSave={handleSaveSettings}
            onReset={handleResetToDefaults}
          />

          <SaveSuccessNotification 
            open={saveSuccess}
            onClose={closeSaveSuccess}
          />

          <ResetSuccessNotification 
            open={resetSuccess}
            onClose={closeResetSuccess}
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default OptionsApp;
