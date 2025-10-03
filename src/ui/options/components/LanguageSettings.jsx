import React from 'react';
import {
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Alert
} from '@mui/material';

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
          <MenuItem value="cpp">C++</MenuItem>
          {/* Currently only C++ is available as requested */}
        </Select>
      </FormControl>
      
      <Alert severity="info" sx={{ mt: 2 }}>
        Currently, only C++ is supported. More languages will be added in future updates.
      </Alert>
    </Paper>
  );
};

export default LanguageSettings;
