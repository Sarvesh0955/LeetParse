import { useState } from 'react';
import { 
  Paper,
  Typography,
  Stack,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';

/**
 * Component that displays instructions for adding test cases
 * @returns {JSX.Element}
 */
const TestCaseInstructions = () => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3, 
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        mb: 2
      }}
    >
      <Typography variant="subtitle1" fontWeight="medium" mb={1.5}>
        How to Add Your Own Test Cases
      </Typography>
      
      <Accordion 
        expanded={expanded === 'panel1'} 
        onChange={handleChange('panel1')}
        sx={{ 
          bgcolor: 'background.default',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          mb: 1
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
          sx={{ 
            bgcolor: 'background.paper',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant="body2" sx={{ width: '100%', flexShrink: 0 }}>
            Using the Editor
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" color="text.secondary">
            You can directly edit the test cases in the provided editor after parsing the problem. Just click on the test case box to modify it.
          </Typography>
        </AccordionDetails>
      </Accordion>
      
      <Accordion 
        expanded={expanded === 'panel3'} 
        onChange={handleChange('panel3')}
        sx={{ 
          bgcolor: 'background.default',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          mb: 1
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3bh-content"
          id="panel3bh-header"
          sx={{ 
            bgcolor: 'background.paper',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant="body2" sx={{ width: '100%', flexShrink: 0 }}>
            Custom Test case Input Guidelines
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            <Box>
              <Typography variant="body2" fontWeight="medium" gutterBottom>
                1. Strings
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Enter strings on a single line without quotes:
              </Typography>
              <Box component="pre" sx={{ mt: 0.5, p: 1, bgcolor: 'background.code', borderRadius: 1, fontSize: '0.75rem' }}>
                <code>hello</code>
              </Box>
            </Box>
            
            <Box>
              <Typography variant="body2" fontWeight="medium" gutterBottom>
                2. Arrays / Vectors
              </Typography>
              <Typography variant="body2" color="text.secondary">
                For nested arrays, specify the dimension before each line:
              </Typography>
              <Box component="pre" sx={{ mt: 0.5, p: 1, bgcolor: 'background.code', borderRadius: 1, fontSize: '0.75rem' }}>
                <code>2
                    2
                    1 2
                    2
                    3 4</code>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                This represents a 2D vector: [[1,2], [3,4]]
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="body2" fontWeight="medium" gutterBottom>
                3. Linked Lists
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Enter as normal arrays, with the first number indicating the length:
              </Typography>
              <Box component="pre" sx={{ mt: 0.5, p: 1, bgcolor: 'background.code', borderRadius: 1, fontSize: '0.75rem' }}>
                <code>3
1 2 3</code>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                This creates the linked list: 1 → 2 → 3
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="body2" fontWeight="medium" gutterBottom>
                4. Binary Trees
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Enter in level-order traversal format, with the first number indicating the number of nodes:
              </Typography>
              <Box component="pre" sx={{ mt: 0.5, p: 1, bgcolor: 'background.code', borderRadius: 1, fontSize: '0.75rem' }}>
                <code>7
1 2 3 null 4 5 null</code>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                This creates a binary tree with root 1, left child 2, right child 3, etc.
              </Typography>
            </Box>
          </Stack>
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
};

export default TestCaseInstructions;
