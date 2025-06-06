import { 
  Paper, 
  Stack, 
  Typography, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem 
} from '@mui/material';

/**
 * Component for language preference settings
 * 
 * @param {Object} props
 * @param {Object} props.settings - Current settings object
 * @param {Function} props.setSettings - Function to update settings
 * @param {Array} props.supportedLanguages - Array of supported languages
 * @param {string} props.mode - Current theme mode ('light'|'dark')
 * @returns {JSX.Element}
 */
const LanguagePreferencesSection = ({ settings, setSettings, supportedLanguages, mode }) => {
  return (
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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 -960 960 960"
          width="24"
          fill={mode === 'light' ? '#0A84FF' : '#60A5FA'}
          style={{ flexShrink: 0 }}
        >
          <path d="M320-240v-480l440 240-440 240Zm80-240Zm0 100 210-100-210-100v200Z"/>
        </svg>
        <Typography variant="h6">
          Language Preferences
        </Typography>
      </Stack>
      <FormControl fullWidth variant="outlined">
        <InputLabel id="language-select-label">Default Language</InputLabel>
        <Select
          labelId="language-select-label"
          value={settings.preferredLanguage}
          label="Default Language"
          onChange={(e) => {
            const newLang = e.target.value;
            setSettings(prev => ({ ...prev, preferredLanguage: newLang }));
          }}
          sx={{
            bgcolor: 'background.paper',
          }}
        >
          {supportedLanguages.map((lang) => (
            <MenuItem 
              key={lang.value} 
              value={lang.value}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%'
              }}
              disabled={lang.value === 'java' || lang.value === 'python'}
            >
              <span>{lang.label}</span>
              {lang.value !== 'cpp' && (
                <Typography 
                  variant="caption" 
                  color="text.secondary" 
                  sx={{ ml: 2, fontSize: '0.7rem', opacity: 0.7 }}
                >
                  (Coming soon)
                </Typography>
              )}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Paper>
  );
};

export default LanguagePreferencesSection;
