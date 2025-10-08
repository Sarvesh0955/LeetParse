import { Paper, Typography, Box, Stack } from '@mui/material';

/**
 * Component that displays information about the LeetParse extension
 * 
 * @returns {JSX.Element}
 */
const AboutLeetParse = () => {
  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3, 
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Typography variant="subtitle1" fontWeight="medium" mb={1.5}>
        About LeetParse
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        This extension helps you solve LeetCode problems in your preferred development environment by:
      </Typography>
      
      <Stack spacing={1.5}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
          <Box 
            sx={{ 
              width: 24, 
              height: 24, 
              borderRadius: 1, 
              bgcolor: 'primary.light',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'background.paper',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              mt: 0.5
            }} 
          >
            1
          </Box>
          <Typography variant="body2">
            Automatically extracting problem details and generating Snippet code
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
          <Box 
            sx={{ 
              width: 24, 
              height: 24, 
              borderRadius: 1, 
              bgcolor: 'primary.light',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'background.paper',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              mt: 0.5
            }} 
          >
            2
          </Box>
          <Typography variant="body2">
            Formatting test cases for immediate testing in your IDE
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
          <Box 
            sx={{ 
              width: 24, 
              height: 24, 
              borderRadius: 1, 
              bgcolor: 'primary.light',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'background.paper',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              mt: 0.5
            }} 
          >
            3
          </Box>
          <Typography variant="body2">
            Supporting complex data structures like linked lists and binary trees
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
};

export default AboutLeetParse;
