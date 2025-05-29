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
  Stack
} from '@mui/material';
import { 
  DarkMode as DarkModeIcon, 
  LightMode as LightModeIcon,
  ContentCopy as ContentCopyIcon,
  Check as CheckIcon,
  OpenInNew as OpenInNewIcon,
  Code as CodeIcon,
  Terminal as TerminalIcon
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

function App() {
  const [isLeetCodeProblem, setIsLeetCodeProblem] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cfInput, setCfInput] = useState('');
  const [boilerplateCode, setBoilerplateCode] = useState('');
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState(prefersDarkMode ? 'dark' : 'light');
  
  // Initialize mode from chrome storage on component mount
  useEffect(() => {
    chrome.storage.sync.get(['theme'], (result) => {
      let themeToUse = result.theme || 'system';
      if (themeToUse === 'system') {
        themeToUse = prefersDarkMode ? 'dark' : 'light';
      }
      setMode(themeToUse);
    });
    
    // Listen for theme changes in storage
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
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0]?.url || '';
      setIsLeetCodeProblem(url.match(/^https:\/\/leetcode\.com\/problems\//) !== null);
    });

    const messageListener = (message) => {
      if (message.action === "codeGenerated") {
        setLoading(false);
        
        if (message.error) {
          setError(message.error);
          enqueueSnackbar(message.error, { variant: 'error' });
        } else {
          setBoilerplateCode(message.boilerplateCode || '');
          setCfInput(message.testCase || '');
          setError('');
        }
      }
    };
    
    chrome.runtime.onMessage.addListener(messageListener);
    return () => chrome.runtime.onMessage.removeListener(messageListener);
  }, [enqueueSnackbar]);

  const handleParseProblem = () => {
    setLoading(true);
    setError('');
    setCfInput('');
    setBoilerplateCode('');
    
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]?.id) {
        setLoading(false);
        enqueueSnackbar('Cannot access the current tab', { variant: 'error' });
        return;
      }
      
      chrome.tabs.sendMessage(tabs[0].id, { action: "parseProblem" }, (response) => {
        if (chrome.runtime.lastError) {
          setLoading(false);
          enqueueSnackbar('Please refresh the page and try again', { variant: 'error' });
        }
      });
    });
  };

  const handleGoToLeetCode = () => {
    chrome.tabs.create({ url: 'https://leetcode.com/problemset/all/' });
  };

  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    chrome.storage.sync.set({ theme: newMode }, () => {
      console.log('Theme saved to chrome.storage.sync');
    });
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
            LeetCode Parser
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
                About LeetCode Parser
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
              <Button
              variant="contained"
              disabled={loading}
              onClick={handleParseProblem}
              sx={{ 
                mb: 2,
                bgcolor: 'primary.main',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              }}
            >
              {loading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={16} color="inherit" />
                  <span>Parsing...</span>
                </Box>
              ) : (
                'Parse Problem'
              )}
            </Button>
            {!cfInput && !boilerplateCode ? (
              <>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 3, 
                    bgcolor: 'background.code',
                    border: '1px solid',
                    borderColor: 'divider',
                    mb: 2
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                    Ready to parse this LeetCode problem!
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    This extension will extract the problem details and generate:
                  </Typography>
                  
                  <Stack spacing={1} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box 
                        sx={{ 
                          width: 6, 
                          height: 6, 
                          borderRadius: '50%', 
                          bgcolor: 'primary.main' 
                        }} 
                      />
                      <Typography variant="body2">
                        Complete C++ boilerplate with input/output handling
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box 
                        sx={{ 
                          width: 6, 
                          height: 6, 
                          borderRadius: '50%', 
                          bgcolor: 'primary.main' 
                        }} 
                      />
                      <Typography variant="body2">
                        Formatted test cases for direct testing
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box 
                        sx={{ 
                          width: 6, 
                          height: 6, 
                          borderRadius: '50%', 
                          bgcolor: 'primary.main' 
                        }} 
                      />
                      <Typography variant="body2">
                        Support for special data structures (ListNode, TreeNode)
                      </Typography>
                    </Box>
                  </Stack>
                  
                  <Typography variant="caption" color="text.secondary">
                    Click the button below to start parsing the current problem
                  </Typography>
                </Paper>
              </>
            ) : null}
            

            <Fade in={loading}>
              <Box sx={{ 
                display: loading ? 'flex' : 'none',
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