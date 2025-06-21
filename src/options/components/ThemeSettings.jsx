import React from 'react';
import {
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper
} from '@mui/material';

/**
 * Theme settings component
 */
const ThemeSettings = ({ settings, onSettingChange }) => {
  return (
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
          onChange={(e) => onSettingChange('theme', e.target.value)}
        >
          <MenuItem value="light">Light</MenuItem>
          <MenuItem value="dark">Dark</MenuItem>
          <MenuItem value="system">System (Auto)</MenuItem>
        </Select>
      </FormControl>
    </Paper>
  );
};

export default ThemeSettings;
