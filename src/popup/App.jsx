import { useState, useEffect } from 'react';
import { 
  ThemeProvider, 
  createTheme, 
  CssBaseline,
  Box,
  Button,
  Typography,
  Paper,
  IconButton,
  CircularProgress,
  Fade,
  useMediaQuery,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText
} from '@mui/material';
import { 
  DarkMode as DarkModeIcon, 
  LightMode as LightModeIcon,
  ContentCopy as ContentCopyIcon,
  Check as CheckIcon,
  OpenInNew as OpenInNewIcon,
  Code as CodeIcon,
  Terminal as TerminalIcon,
  ExpandMore as ExpandMoreIcon,
  LiveHelp as LiveHelpIcon
} from '@mui/icons-material';
import { SnackbarProvider, useSnackbar } from 'notistack';

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
            <CodeIcon fontSize="small\" color="primary" />
          ) : (
            <TerminalIcon fontSize="small\" color="secondary" />
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

function App() {
  const [isLeetCodeProblem, setIsLeetCodeProblem] = useState(false);
  const [parseLoading, setParseLoading] = useState(false);
  const [extractLoading, setExtractLoading] = useState(false);
  const [error, setError] = useState('');
  const [cfInput, setCfInput] = useState('');
  const [boilerplateCode, setBoilerplateCode] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('cpp');
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState(prefersDarkMode ? 'dark' : 'light');
  
  useEffect(() => {
    chrome.storage.sync.get(['theme'], (result) => {
      let themeToUse = result.theme || 'system';
      if (themeToUse === 'system') {
        themeToUse = prefersDarkMode ? 'dark' : 'light';
      }
      setMode(themeToUse);
    });
    
    const handleStorageChange = (changes, area) => {
      if (area === 'sync' && changes.theme) {
        let themeToUse = changes.theme.newValue;
        if (themeToUse === 'system') {
          themeToUse = prefersDarkMode ? 'dark' : 'light';
        }
        setMode(themeToUse);
      }
    };
    
    chrome.storage.onChanged.addListener(handleStorageChange);
    
    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, [prefersDarkMode]);
  const { enqueueSnackbar } = useSnackbar();

  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'light' ? '#0A84FF' : '#60A5FA',
        light: mode === 'light' ? '#3B82F6' : '#93C5FD',
        dark: mode === 'light' ? '#1D4ED8' : '#2563EB',
      },
      secondary: {
        main: mode === 'light' ? '#8B5CF6' : '#A78BFA',
        light: mode === 'light' ? '#A78BFA' : '#C4B5FD',
        dark: mode === 'light' ? '#6D28D9' : '#7C3AED',
      },
      success: {
        main: mode === 'light' ? '#10B981' : '#34D399',
        light: mode === 'light' ? '#34D399' : '#6EE7B7',
        dark: mode === 'light' ? '#059669' : '#10B981',
      },
      error: {
        main: '#EF4444',
        light: '#F87171',
        dark: '#DC2626',
      },
      background: {
        default: mode === 'light' ? '#F9FAFB' : '#111827',
        paper: mode === 'light' ? '#FFFFFF' : '#1F2937',
        code: mode === 'light' ? '#F3F4F6' : '#374151',
      },
      text: {
        primary: mode === 'light' ? '#111827' : '#F9FAFB',
        secondary: mode === 'light' ? '#4B5563' : '#9CA3AF',
      },
      divider: mode === 'light' ? '#E5E7EB' : '#374151',
    },
    typography: {
      fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
      h1: { fontWeight: 700 },
      h2: { fontWeight: 600 },
      h3: { fontWeight: 600 },
      h4: { fontWeight: 600 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
            padding: '10px 20px',
          },
          contained: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
    },
  });

  useEffect(() => {
    chrome.storage.sync.get(['preferredLanguage'], (result) => {
      if (result.preferredLanguage) {
        setSelectedLanguage(result.preferredLanguage);
      }
    });
    
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      try {
        const url = tabs[0]?.url || '';
        setIsLeetCodeProblem(url.match(/^https:\/\/leetcode\.com\/problems\//) !== null);
      } catch (err) {
        console.error('Error checking URL:', err);
        enqueueSnackbar('Failed to check current page', { variant: 'error' });
      }
    });

    const messageListener = (message) => {
      if (message.action === "codeGenerated") {
        setParseLoading(false);
        
        if (message.error) {
          setError(message.error);
          enqueueSnackbar(message.error, { variant: 'error' });
        } else {
          setBoilerplateCode(message.boilerplateCode || '');
          setCfInput(message.testCase || '');
          setError('');
        }
      }
      else if(message.action === "otherTestsGenerated") {
        setExtractLoading(false);
        
        if (message.error) {
          setError(message.error);
          enqueueSnackbar(message.error, { variant: 'error' });
        } else {
          setCfInput(message.testCase || '');
          setError('');
        }
      }
    };
    
    chrome.runtime.onMessage.addListener(messageListener);
    return () => chrome.runtime.onMessage.removeListener(messageListener);
  }, [enqueueSnackbar]);

  const handleParseProblem = () => {
    try {
      setParseLoading(true);
      setError('');
      setCfInput('');
      setBoilerplateCode('');
      const language = selectedLanguage;
      
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs[0]?.id) {
          setParseLoading(false);
          enqueueSnackbar('Cannot access the current tab', { variant: 'error' });
          return;
        }
        
        chrome.tabs.sendMessage(tabs[0].id, { 
          action: "parseProblem",
          language: language
        }, (response) => {
          if (chrome.runtime.lastError) {
            setParseLoading(false);
            enqueueSnackbar('Please refresh the page and try again', { variant: 'error' });
          }
        });
      });
    } catch (err) {
      setParseLoading(false);
      console.error('Error parsing problem:', err);
      enqueueSnackbar('Failed to parse problem', { variant: 'error' });
    }
  };

  const handleExtractTestCasesOnly = () => {
    try {
      setExtractLoading(true);
      setError('');
      setCfInput('');
      setBoilerplateCode('');
      const language = selectedLanguage;
      
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs[0]?.id) {
          setExtractLoading(false);
          enqueueSnackbar('Cannot access the current tab', { variant: 'error' });
          return;
        }
        
        chrome.tabs.sendMessage(tabs[0].id, { 
          action: "otherTests",
          language: language
        }, (response) => {
          if (chrome.runtime.lastError) {
            setExtractLoading(false);
            enqueueSnackbar('Please refresh the page and try again', { variant: 'error' });
          }
        });
      });
    } catch (err) {
      setExtractLoading(false);
      console.error('Error extracting test cases:', err);
      enqueueSnackbar('Failed to extract test cases', { variant: 'error' });
    }
  };

  const handleGoToLeetCode = () => {
    try {
      chrome.tabs.create({ url: 'https://leetcode.com/problemset/all/' });
    } catch (err) {
      console.error('Error opening LeetCode:', err);
      enqueueSnackbar('Failed to open LeetCode', { variant: 'error' });
    }
  };

  const toggleTheme = () => {
    try {
      const newMode = mode === 'light' ? 'dark' : 'light';
      setMode(newMode);
      chrome.storage.sync.set({ theme: newMode });
    } catch (err) {
      console.error('Error toggling theme:', err);
      enqueueSnackbar('Failed to change theme', { variant: 'error' });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        width: 400,
        p: 2,
        minHeight: 200,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3
        }}>
          <Typography variant="h6" component="h1" fontWeight="bold">
            LeetParse
          </Typography>
          <IconButton 
            onClick={toggleTheme} 
            size="small"
            sx={{ 
              bgcolor: 'background.code',
              '&:hover': {
                bgcolor: mode === 'light' ? 'grey.200' : 'grey.800',
              },
            }}
          >
            {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
        </Box>

        {!isLeetCodeProblem ? (
          <>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                textAlign: 'center',
                bgcolor: 'background.code',
                border: '1px solid',
                borderColor: 'divider',
                mb: 2
              }}
            >
              <Typography variant="h6" gutterBottom>
                Not on a LeetCode Problem Page
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Navigate to a LeetCode problem to use this extension
              </Typography>
              <Stack spacing={2} direction="column" alignItems="center">
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<OpenInNewIcon />}
                  onClick={handleGoToLeetCode}
                  fullWidth
                >
                  Go to LeetCode Problems
                </Button>
                <Typography variant="caption" color="text.secondary">
                  Or open any LeetCode problem page to get started
                </Typography>
              </Stack>
            </Paper>
            
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
                This extension helps you solve LeetCode problems in your preferred C++ environment by:
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
                    Automatically extracting problem details and generating boilerplate code
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
          </>
        ) : (
          <>
            <Stack spacing={2} sx={{ mb: 2 }}>
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
              <Stack direction="row" spacing={1.5} width="100%">
                <Button
                  variant="contained"
                  disabled={parseLoading || extractLoading}
                  onClick={handleParseProblem}
                  sx={{ 
                    flex: 1,
                    bgcolor: 'primary.main',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                  }}
                >
                  {parseLoading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={16} color="inherit" />
                      <span>Parsing...</span>
                    </Box>
                  ) : (
                    'Parse with sample tests'
                  )}
                </Button>
                <Button
                  variant="contained"
                  disabled={parseLoading || extractLoading}
                  onClick={handleExtractTestCasesOnly}
                  sx={{ 
                    flex: 1,
                    bgcolor: 'primary.main',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                  }}
                >
                  {extractLoading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={16} color="inherit" />
                      <span>Extracting...</span>
                    </Box>
                  ) : (
                    'Extract test cases only'
                  )}
                </Button>
              </Stack>
            </Stack>

            {!cfInput && !boilerplateCode ? (
              <>
                <TestCaseInstructions />
              </>
            ) : null}
            

            <Fade in={parseLoading || extractLoading}>
              <Box sx={{ 
                display: parseLoading || extractLoading ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
                my: 2
              }}>
              </Box>
            </Fade>

            {cfInput && (
              <CodeBlock
                title="Test Cases"
                content={cfInput}
                type="terminal"
                onCopy={() => enqueueSnackbar('Test cases copied to clipboard', { variant: 'success' })}
              />
            )}

            {boilerplateCode && (
              <CodeBlock
                title="C++ Solution"
                content={boilerplateCode}
                type="code"
                onCopy={() => enqueueSnackbar('Code copied to clipboard', { variant: 'success' })}
              />
            )}

          </>
        )}
      </Box>
    </ThemeProvider>
  );
}

function AppWrapper() {
  return (
    <SnackbarProvider 
      maxSnack={3}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      autoHideDuration={2000}
    >
      <App />
    </SnackbarProvider>
  );
}

export default AppWrapper;