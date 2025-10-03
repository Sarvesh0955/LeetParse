import React from 'react';
import {
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  Alert
} from '@mui/material';

/**
 * User template settings component
 */
const TemplateSettings = ({ userTemplate, onUserTemplateChange }) => {
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

  return (
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
        onChange={(e) => onUserTemplateChange(e.target.value)}
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
          onClick={() => onUserTemplateChange(getDefaultTemplate())}
        >
          Load Example Template
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={() => onUserTemplateChange('')}
        >
          Clear Template
        </Button>
      </Stack>
      
      <Alert severity="info" sx={{ mt: 2 }}>
        Your custom template will be inserted into the main C++ template at the designated location. 
        Leave empty to use no additional template code.
      </Alert>
    </Paper>
  );
};

export default TemplateSettings;
