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
        mb: 2,
        borderRadius: 2,
        background: (theme) => theme.palette.mode === 'light' 
          ? 'linear-gradient(135deg, #AED6CF 0%, #FAFDD6 100%)'
          : theme.palette.background.paper,
      }}
    >
      <Typography variant="subtitle1" fontWeight="medium" mb={1.5} sx={{ 
        color: 'primary.main',
        borderLeft: '4px solid',
        borderColor: 'primary.main',
        paddingLeft: 2,
      }}>
        How to Use LeetParse
      </Typography>
      
      <Accordion 
        expanded={expanded === 'panel1'} 
        onChange={handleChange('panel1')}
        sx={{ 
          bgcolor: (theme) => theme.palette.mode === 'light' ? '#FAFDD6' : 'background.surface',
          border: '1px solid',
          borderColor: (theme) => theme.palette.mode === 'light' ? '#AED6CF' : 'divider',
          borderRadius: 1.5,
          mb: 1,
          '&:before': { display: 'none' },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
          sx={{ 
            bgcolor: (theme) => theme.palette.mode === 'light' ? '#AED6CF' : 'background.paper',
            borderBottom: expanded === 'panel1' ? '1px solid' : 'none',
            borderColor: (theme) => theme.palette.mode === 'light' ? '#91ADC8' : 'divider',
            borderRadius: expanded === 'panel1' ? '6px 6px 0 0' : '6px',
            '&:hover': {
              bgcolor: (theme) => theme.palette.mode === 'light' ? '#91ADC8' : undefined,
            },
          }}
        >
          <Typography variant="body2" sx={{ width: '100%', flexShrink: 0 }}>
            Parse with Sample Tests
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" color="text.secondary">
            Click "Parse with sample tests" to automatically extract the problem and generate code template with example test cases from the problem description.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion 
        expanded={expanded === 'panel2'} 
        onChange={handleChange('panel2')}
        sx={{ 
          bgcolor: (theme) => theme.palette.mode === 'light' ? '#91ADC8' : 'background.surface',
          border: '1px solid',
          borderColor: (theme) => theme.palette.mode === 'light' ? '#647FBC' : 'divider',
          borderRadius: 1.5,
          mb: 1,
          '&:before': { display: 'none' },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2bh-content"
          id="panel2bh-header"
          sx={{ 
            bgcolor: (theme) => theme.palette.mode === 'light' ? '#647FBC' : 'background.paper',
            borderBottom: expanded === 'panel2' ? '1px solid' : 'none',
            borderColor: (theme) => theme.palette.mode === 'light' ? '#647FBC' : 'divider',
            borderRadius: expanded === 'panel2' ? '6px 6px 0 0' : '6px',
            color: (theme) => theme.palette.mode === 'light' ? 'white' : 'inherit',
            '&:hover': {
              bgcolor: (theme) => theme.palette.mode === 'light' ? '#5A6BA8' : undefined,
            },
          }}
        >
          <Typography variant="body2" sx={{ width: '100%', flexShrink: 0 }}>
            Extract Custom Test Cases
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" color="text.secondary">
            Add custom test cases in LeetCode's test case section, then click "Extract test cases only" to parse and format them for your IDE.
          </Typography>
        </AccordionDetails>
      </Accordion>
      
      <Accordion 
        expanded={expanded === 'panel3'} 
        onChange={handleChange('panel3')}
        sx={{ 
          bgcolor: (theme) => theme.palette.mode === 'light' ? '#AED6CF' : 'background.surface',
          border: '1px solid',
          borderColor: (theme) => theme.palette.mode === 'light' ? '#91ADC8' : 'divider',
          borderRadius: 1.5,
          mb: 1,
          '&:before': { display: 'none' },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3bh-content"
          id="panel3bh-header"
          sx={{ 
            bgcolor: (theme) => theme.palette.mode === 'light' ? '#91ADC8' : 'background.paper',
            borderBottom: expanded === 'panel3' ? '1px solid' : 'none',
            borderColor: (theme) => theme.palette.mode === 'light' ? '#647FBC' : 'divider',
            borderRadius: expanded === 'panel3' ? '6px 6px 0 0' : '6px',
            '&:hover': {
              bgcolor: (theme) => theme.palette.mode === 'light' ? '#647FBC' : undefined,
            },
          }}
        >
          <Typography variant="body2" sx={{ width: '100%', flexShrink: 0 }}>
            Custom Test Case Input Format
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
              <Box component="pre" sx={{ 
                mt: 0.5, 
                p: 1.5, 
                bgcolor: (theme) => theme.palette.mode === 'light' ? '#647FBC' : 'background.code',
                color: (theme) => theme.palette.mode === 'light' ? '#FAFDD6' : 'inherit',
                borderRadius: 1, 
                fontSize: '0.75rem',
                border: '1px solid',
                borderColor: (theme) => theme.palette.mode === 'light' ? '#91ADC8' : 'divider',
              }}>
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
              <Box component="pre" sx={{ 
                mt: 0.5, 
                p: 1.5, 
                bgcolor: (theme) => theme.palette.mode === 'light' ? '#647FBC' : 'background.code',
                color: (theme) => theme.palette.mode === 'light' ? '#FAFDD6' : 'inherit',
                borderRadius: 1, 
                fontSize: '0.75rem',
                border: '1px solid',
                borderColor: (theme) => theme.palette.mode === 'light' ? '#91ADC8' : 'divider',
              }}>
                <code>{`2
2
1 2
2
3 4`}</code>
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
              <Box component="pre" sx={{ 
                mt: 0.5, 
                p: 1.5, 
                bgcolor: (theme) => theme.palette.mode === 'light' ? '#647FBC' : 'background.code',
                color: (theme) => theme.palette.mode === 'light' ? '#FAFDD6' : 'inherit',
                borderRadius: 1, 
                fontSize: '0.75rem',
                border: '1px solid',
                borderColor: (theme) => theme.palette.mode === 'light' ? '#91ADC8' : 'divider',
              }}>
                <code>{`3
1 2 3`}</code>
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
              <Box component="pre" sx={{ 
                mt: 0.5, 
                p: 1.5, 
                bgcolor: (theme) => theme.palette.mode === 'light' ? '#647FBC' : 'background.code',
                color: (theme) => theme.palette.mode === 'light' ? '#FAFDD6' : 'inherit',
                borderRadius: 1, 
                fontSize: '0.75rem',
                border: '1px solid',
                borderColor: (theme) => theme.palette.mode === 'light' ? '#91ADC8' : 'divider',
              }}>
                <code>{`7
1 2 3 null 4 5 null`}</code>
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
