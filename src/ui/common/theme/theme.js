// Theme configuration for the LeetParse Extension
import { createTheme } from '@mui/material';

/**
 * Creates a theme based on the light/dark mode preference
 * @param {string} mode - 'light' or 'dark'
 * @returns {Object} MUI theme object
 */
export const createAppTheme = (mode) => createTheme({
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
      default: mode === 'light' ? '#FAFDD6' : '#111827',
      paper: mode === 'light' ? '#AED6CF' : '#1F2937',
      code: mode === 'light' ? '#91ADC8' : '#374151',
      surface: mode === 'light' ? '#AED6CF' : '#1F2937',
      accent: mode === 'light' ? '#647FBC' : '#1E3A8A',
    },
    text: {
      primary: mode === 'light' ? '#111827' : '#F9FAFB',
      secondary: mode === 'light' ? '#4B5563' : '#9CA3AF',
    },
    divider: mode === 'light' ? '#91ADC8' : '#374151',
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
          ...(mode === 'light' && {
            backgroundColor: '#AED6CF',
            border: '1px solid #91ADC8',
            boxShadow: '0 1px 3px 0 rgba(100, 127, 188, 0.1), 0 1px 2px 0 rgba(100, 127, 188, 0.06)',
          }),
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          ...(mode === 'light' && {
            backgroundColor: '#AED6CF',
            '&:before': {
              display: 'none',
            },
            border: '1px solid #91ADC8',
          }),
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          ...(mode === 'light' && {
            backgroundColor: '#91ADC8',
            '&:hover': {
              backgroundColor: '#647FBC',
            },
          }),
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: mode === 'light' ? '#91ADC8' : '#374151',
          },
        },
      },
    },
  },
});
