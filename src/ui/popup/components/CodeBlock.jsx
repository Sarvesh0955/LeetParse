import { useState } from 'react';
import { 
  Paper,
  Box,
  Typography,
  IconButton,
  Stack
} from '@mui/material';
import { 
  ContentCopy as ContentCopyIcon,
  Check as CheckIcon,
  Code as CodeIcon,
  Terminal as TerminalIcon,
} from '@mui/icons-material';

/**
 * Component to display code or test cases with a copy button
 * 
 * @param {Object} props
 * @param {string} props.title - Title of the code block
 * @param {string} props.content - Content of the code block
 * @param {Function} props.onCopy - Function to call when content is copied
 * @param {('code'|'terminal')} [props.type='code'] - Type of content to display
 * @returns {JSX.Element}
 */
const CodeBlock = ({ title, content, onCopy, type = 'code' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    onCopy();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        mt: 2,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.code',
      }}
    >
      <Box sx={{ 
        p: 1.5, 
        borderBottom: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        bgcolor: 'background.paper',
      }}>
        <Stack direction="row" spacing={1} alignItems="center">
          {type === 'code' ? (
            <CodeIcon fontSize="small" color="primary" />
          ) : (
            <TerminalIcon fontSize="small" color="secondary" />
          )}
          <Typography variant="subtitle2" fontWeight="medium">
            {title}
          </Typography>
        </Stack>
        <IconButton 
          size="small" 
          onClick={handleCopy}
          sx={{
            bgcolor: copied ? 'success.main' : 'background.code',
            color: copied ? 'white' : 'inherit',
            '&:hover': {
              bgcolor: copied ? 'success.dark' : 'action.hover',
            },
          }}
        >
          {copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
        </IconButton>
      </Box>
      <Box
        component="pre"
        sx={{
          m: 0,
          p: 2,
          maxHeight: 200,
          overflow: 'auto',
          fontSize: '0.875rem',
          fontFamily: '"Fira Code", "Consolas", monospace',
          bgcolor: 'background.default',
          color: type === 'code' ? 'text.primary' : 'text.secondary',
          lineHeight: 1.5,
          '& .keyword': { color: '#C678DD' },
          '& .type': { color: '#E5C07B' },
          '& .string': { color: '#98C379' },
          '& .comment': { color: '#7F848E', fontStyle: 'italic' },
          '& .number': { color: '#D19A66' },
          '& .operator': { color: '#56B6C2' },
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'action.hover',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'background.paper',
          },
        }}
      >
        <code>{content}</code>
      </Box>
    </Paper>
  );
};

export default CodeBlock;
