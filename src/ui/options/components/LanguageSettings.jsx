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
                {language.value === 'cpp' ? (
                  <Chip 
                    label="Fully Supported" 
                    size="small" 
                    color="success" 
                    variant="outlined" 
                  />
                ) : (
                  <Chip 
                    label="Coming Soon" 
                    size="small" 
                    color="warning" 
                    variant="outlined" 
                  />
                )}
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      
      <Alert severity="info" sx={{ mt: 2 }}>
        <Typography variant="body2">
          <strong>Language Support Status:</strong>
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          • <strong>C++:</strong> Fully implemented with complete code generation<br/>
          • <strong>Java, Python, JavaScript:</strong> Framework ready, implementation coming soon
        </Typography>
      </Alert>
    </Paper>
  );
};

export default LanguageSettings;
