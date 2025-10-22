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
        A powerful Chrome extension that streamlines competitive programming by parsing LeetCode problems and generating ready-to-use code templates with test cases:
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
            <strong>One-Click Problem Parsing:</strong> Extract problem details and generate complete code templates with sample test cases
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
            <strong>Custom Test Case Extraction:</strong> Parse and format your custom test cases from LeetCode's test section
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
            <strong>Multi-Language Support:</strong> Generate templates for C++, Java, and Python with proper I/O handling
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
            4
          </Box>
          <Typography variant="body2">
            <strong>VS Code Integration:</strong> Seamlessly export to VS Code with Competitive Programming Helper (CPH) extension
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
            5
          </Box>
          <Typography variant="body2">
            <strong>Complex Data Structures:</strong> Handle linked lists, binary trees, nested arrays, and custom objects
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
};

export default AboutLeetParse;
