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
  OpenInNew as OpenInNewIcon
} from '@mui/icons-material';
import { SnackbarProvider, useSnackbar } from 'notistack';

const CodeBlock = ({ title, content, onCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    onCopy();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        mt: 2,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Box sx={{ 
        p: 1.5, 
        borderBottom: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="subtitle2" fontWeight="medium">
          {title}
        </Typography>
        <IconButton size="small" onClick={handleCopy}>
          {copied ? <CheckIcon fontSize="small\" color="success" /> : <ContentCopyIcon fontSize="small" />}
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
          fontFamily: 'monospace',
          bgcolor: 'background.paper',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'action.hover',
            borderRadius: '4px',
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
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('leetcode-parser-theme');
    return savedMode || (prefersDarkMode ? 'dark' : 'light');
  });
  const { enqueueSnackbar } = useSnackbar();

  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'light' ? '#2E7D32' : '#4CAF50',
        light: mode === 'light' ? '#4CAF50' : '#66BB6A',
        dark: mode === 'light' ? '#1B5E20' : '#388E3C',
      },
      secondary: {
        main: mode === 'light' ? '#0288D1' : '#29B6F6',
        light: mode === 'light' ? '#29B6F6' : '#4FC3F7',
        dark: mode === 'light' ? '#01579B' : '#0288D1',
      },
      success: {
        main: mode === 'light' ? '#2E7D32' : '#4CAF50',
      },
      error: {
        main: '#D32F2F',
      },
      background: {
        default: mode === 'light' ? '#F8FAFC' : '#121212',
        paper: mode === 'light' ? '#FFFFFF' : '#1E1E1E',
        code: mode === 'light' ? '#F1F5F9' : '#262626',
      },
      text: {
        primary: mode === 'light' ? '#1A2027' : '#E0E0E0',
        secondary: mode === 'light' ? '#3E5060' : '#A0AEC0',
      },
      divider: mode === 'light' ? '#E2E8F0' : '#2D3748',
    },
    typography: {
      fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: '8px',
            fontWeight: 500,
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
            borderRadius: '12px',
            backgroundImage: 'none',
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
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
    localStorage.setItem('leetcode-parser-theme', newMode);
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
          mb: 2
        }}>
          <Typography variant="h6" component="h1" fontWeight="bold">
            LeetCode Parser
          </Typography>
          <IconButton onClick={toggleTheme} size="small">
            {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
        </Box>

        {!isLeetCodeProblem ? (
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              textAlign: 'center',
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider'
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
        ) : (
          <>
            <Button
              variant="contained"
              disabled={loading}
              onClick={handleParseProblem}
              sx={{ mb: 2 }}
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

            <Fade in={loading}>
              <Box sx={{ 
                display: loading ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
                my: 2
              }}>
                <CircularProgress size={24} />
                <Typography variant="body2" color="text.secondary">
                  Parsing problem, please wait...
                </Typography>
              </Box>
            </Fade>

            {cfInput && (
              <CodeBlock
                title="Input"
                content={cfInput}
                onCopy={() => enqueueSnackbar('Input copied to clipboard', { variant: 'success' })}
              />
            )}

            {boilerplateCode && (
              <CodeBlock
                title="Boilerplate Code"
                content={boilerplateCode}
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