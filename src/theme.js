import { createTheme } from '@mui/material/styles';

const getTheme = (mode = 'dark') => createTheme({
  palette: {
    mode,
    primary: {
      main: '#3366FF',
      light: '#6690FF',
      dark: '#1939B7',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#38B6FF',
      light: '#5CC8FF',
      dark: '#0095E8',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#FF3366',
      light: '#FF6B91',
      dark: '#C4264E',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#FFBA08',
      light: '#FFD03D',
      dark: '#CC9500',
      contrastText: '#000000',
    },
    success: {
      main: '#4CAF50',
      light: '#80E27E',
      dark: '#087F23',
      contrastText: '#FFFFFF',
    },
    background: {
      default: mode === 'dark' ? '#0A1929' : '#F5F5F5',
      paper: mode === 'dark' ? '#132F4C' : '#FFFFFF',
    },
    text: {
      primary: mode === 'dark' ? '#FFFFFF' : '#000000',
      secondary: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
      disabled: mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
    },
    divider: mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 500,
    },
    subtitle2: {
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.43,
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0,0,0,0.2)',
    '0px 4px 8px rgba(0,0,0,0.2)',
    '0px 8px 16px rgba(0,0,0,0.2)',
    '0px 12px 24px rgba(0,0,0,0.2)',
    '0px 16px 32px rgba(0,0,0,0.2)',
    '0px 20px 40px rgba(0,0,0,0.2)',
    '0px 24px 48px rgba(0,0,0,0.2)',
    '0px 28px 56px rgba(0,0,0,0.2)',
    '0px 32px 64px rgba(0,0,0,0.2)',
    '0px 36px 72px rgba(0,0,0,0.2)',
    '0px 40px 80px rgba(0,0,0,0.2)',
    '0px 44px 88px rgba(0,0,0,0.2)',
    '0px 48px 96px rgba(0,0,0,0.2)',
    '0px 52px 104px rgba(0,0,0,0.2)',
    '0px 56px 112px rgba(0,0,0,0.2)',
    '0px 60px 120px rgba(0,0,0,0.2)',
    '0px 64px 128px rgba(0,0,0,0.2)',
    '0px 68px 136px rgba(0,0,0,0.2)',
    '0px 72px 144px rgba(0,0,0,0.2)',
    '0px 76px 152px rgba(0,0,0,0.2)',
    '0px 80px 160px rgba(0,0,0,0.2)',
    '0px 84px 168px rgba(0,0,0,0.2)',
    '0px 88px 176px rgba(0,0,0,0.2)',
    '0px 92px 184px rgba(0,0,0,0.2)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
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
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: mode === 'dark' ? 'rgba(0, 0, 0, 0.85)' : 'rgba(97, 97, 97, 0.92)',
          padding: '8px 12px',
          fontSize: '0.75rem',
        },
      },
    },
  },
});

export default getTheme;
