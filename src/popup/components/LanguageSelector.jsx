import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  FormHelperText
} from '@mui/material';

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
        <MenuItem value="cpp">C++</MenuItem>
        <MenuItem value="python" disabled>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <span>Python</span>
            <Typography 
              variant="caption" 
              color="text.secondary" 
              sx={{ ml: 2, fontSize: '0.7rem', opacity: 0.7 }}
            >
              (Coming soon)
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem value="java" disabled>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <span>Java</span>
            <Typography 
              variant="caption" 
              color="text.secondary" 
              sx={{ ml: 2, fontSize: '0.7rem', opacity: 0.7 }}
            >
              (Coming soon)
            </Typography>
          </Box>
        </MenuItem>
      </Select>
      <FormHelperText>Select language to parse the problem</FormHelperText>
    </FormControl>
  );
};

export default LanguageSelector;
