import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  FormHelperText
} from '@mui/material';
import { supportedLanguages } from '../../../core/defaultSettings.js';

/**
 * Component for selecting programming language
 * 
 * @param {Object} props
 * @param {string} props.selectedLanguage - Currently selected language
 * @param {Function} props.setSelectedLanguage - Function to update selected language
 * @returns {JSX.Element}
 */
const LanguageSelector = ({ selectedLanguage, setSelectedLanguage }) => {
  return (
    <FormControl fullWidth variant="outlined">
      <InputLabel id="language-select-label">Language</InputLabel>
      <Select
        labelId="language-select-label"
        value={selectedLanguage}
        label="Language"
        onChange={(e) => setSelectedLanguage(e.target.value)}
        size="small"
        sx={{
          bgcolor: 'background.paper',
        }}
      >
        {supportedLanguages.map((language) => (
          <MenuItem 
            key={language.value} 
            value={language.value}
            disabled={language.value !== 'cpp'} // Only C++ is fully implemented
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <span>{language.label}</span>
              {language.value !== 'cpp' && (
                <Typography 
                  variant="caption" 
                  color="text.secondary" 
                  sx={{ ml: 2, fontSize: '0.7rem', opacity: 0.7 }}
                >
                  (Coming soon)
                </Typography>
              )}
            </Box>
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>Select language to parse the problem</FormHelperText>
    </FormControl>
  );
};

export default LanguageSelector;
