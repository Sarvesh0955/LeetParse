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
    MuiSelect: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: mode === 'light' ? '#E5E7EB' : '#374151',
          },
        },
      },
    },
  },
});
