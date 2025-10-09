import React from 'react';
import {
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Alert,
  Chip,
  Box
} from '@mui/material';
import { supportedLanguages } from '../../../core/defaultSettings.js';

/**
 * Language preferences settings component
 */
const LanguageSettings = ({ settings, onSettingChange }) => {
  return (
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
          onChange={(e) => onSettingChange('preferredLanguage', e.target.value)}
        >
          {supportedLanguages.map((language) => (
            <MenuItem key={language.value} value={language.value}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {language.label}
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Paper>
  );
};

export default LanguageSettings;
