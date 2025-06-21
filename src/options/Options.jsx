import {
  ThemeProvider,
  CssBaseline,
  Container,
  Paper,
  Stack,
  Divider,
  useMediaQuery
} from '@mui/material';
import { SnackbarProvider } from 'notistack';

// Components
import OptionsHeader from './components/OptionsHeader';
import LanguagePreferencesSection from './components/LanguagePreferencesSection';
import SettingsActionButtons from './components/SettingsActionButtons';

// Common theme and hooks
import { createAppTheme } from '../common/theme/theme';
import useThemeMode from '../common/hooks/useThemeMode';
import useOptionsSettings from './hooks/useOptionsSettings';

import { defaultSettings, supportedLanguages} from '../utils/defaultSettings';

function Options() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, toggleTheme, setMode] = useThemeMode();

  const { settings, setSettings, saveSettings, resetSettings } = useOptionsSettings(
    defaultSettings, 
    prefersDarkMode, 
    setMode
  );

  const theme = createAppTheme(mode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
          <OptionsHeader mode={mode} toggleTheme={toggleTheme} />

          <Stack spacing={4}>

            <LanguagePreferencesSection 
              settings={settings}
              setSettings={setSettings}
              supportedLanguages={supportedLanguages}
              mode={mode}
            />

            <Divider />

            <SettingsActionButtons 
              resetSettings={resetSettings}
              saveSettings={saveSettings}
            />
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
