import { createTheme } from '@mui/material/styles';

const getTheme = (mode) => createTheme({
  palette: {
    mode,
    ...(mode === 'dark' ? {
      // Dark theme
      background: {
        default: '#0A0E17',
        paper: '#141B2D',
      },
      primary: {
        main: '#3461FF',
        dark: '#2D54DB',
        light: '#4B74FF',
        contrastText: '#fff',
      },
      text: {
        primary: '#fff',
        secondary: 'rgba(255, 255, 255, 0.7)',
      },
      divider: 'rgba(255, 255, 255, 0.12)',
    } : {
      // Light theme
      background: {
        default: '#F8F9FA',
        paper: '#FFFFFF',
      },
      primary: {
        main: '#3461FF',
        dark: '#2D54DB',
        light: '#4B74FF',
        contrastText: '#fff',
      },
      text: {
        primary: '#1A2027',
        secondary: 'rgba(0, 0, 0, 0.6)',
      },
      divider: 'rgba(0, 0, 0, 0.12)',
    }),
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: (theme) => ({
        body: {
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
        },
      }),
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: (({ theme }) => ({
          backgroundColor: theme.palette.background.default,
          borderRight: `1px solid ${theme.palette.divider}`,
        })),
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: (({ theme }) => ({
          borderRadius: '8px',
          margin: '4px 8px',
          '&.Mui-selected': {
            backgroundColor: theme.palette.mode === 'dark' ? '#1A2138' : '#E3F2FD',
            '&:hover': {
              backgroundColor: theme.palette.mode === 'dark' ? '#1E2642' : '#BBDEFB',
            },
          },
          '&:hover': {
            backgroundColor: theme.palette.mode === 'dark' ? '#1A2138' : '#E3F2FD',
          },
        })),
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 16px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: (({ theme }) => ({
          backgroundColor: theme.palette.background.paper,
          borderRadius: '12px',
        })),
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: (({ theme }) => ({
          backgroundColor: theme.palette.background.default,
          borderBottom: `1px solid ${theme.palette.divider}`,
        })),
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
});

export default getTheme;
