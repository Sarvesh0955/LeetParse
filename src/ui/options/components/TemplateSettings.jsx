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
    return `// Your custom code here
// Add your commonly used imports, macros, typedefs, and utility functions
// This will be inserted into the main template

// C++ Example:
// #define ll long long
// #define vi vector<int>

// Java Example:  
// import java.math.BigInteger;
// public static final int MOD = 1000000007;

// Example utility functions:
// int gcd(int a, int b) { return b ? gcd(b, a % b) : a; }
`;
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="text.primary" fontWeight="600">
        User Template
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Add your custom code that will be inserted into the main template. This can include imports, macros, typedefs, utility functions, etc.
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
        Your custom template will be inserted into the main code template at the designated location. 
        Leave empty to use no additional template code.
      </Alert>
    </Paper>
  );
};

export default TemplateSettings;
