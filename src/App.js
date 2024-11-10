import React, { useState, useCallback, Suspense, useEffect } from 'react';
import { 
  Box, 
  CssBaseline, 
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Container,
  CircularProgress,
  Backdrop,
  Snackbar,
  Alert,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button,
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { de } from 'date-fns/locale';
import HomeIcon from '@mui/icons-material/Home';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import SearchIcon from '@mui/icons-material/Search';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import KeyboardIcon from '@mui/icons-material/Keyboard';

import getTheme from './theme';
import ErrorBoundary from './ErrorBoundary';

// Lazy load components
const CalendarView = React.lazy(() => import('./components/CalendarView'));
const AdminChangeRequests = React.lazy(() => import('./components/AdminChangeRequests'));

const DRAWER_WIDTH = 240;

// Loading component
const LoadingFallback = () => (
  <Backdrop open={true} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
    <CircularProgress color="inherit" />
  </Backdrop>
);

// Keyboard shortcuts help dialog
const ShortcutsDialog = ({ open, onClose }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Keyboard Shortcuts</DialogTitle>
    <DialogContent>
      <DialogContentText component="div">
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2">Navigation</Typography>
          <Typography variant="body2">• Alt + D: Dashboard</Typography>
          <Typography variant="body2">• Alt + A: Admin Panel</Typography>
          <Typography variant="body2">• Alt + S: Focus Search</Typography>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2">Timeline</Typography>
          <Typography variant="body2">• Alt + Left: Previous Month</Typography>
          <Typography variant="body2">• Alt + Right: Next Month</Typography>
          <Typography variant="body2">• Alt + +: Zoom In</Typography>
          <Typography variant="body2">• Alt + -: Zoom Out</Typography>
        </Box>
        <Box>
          <Typography variant="subtitle2">General</Typography>
          <Typography variant="body2">• Alt + T: Toggle Theme</Typography>
          <Typography variant="body2">• Alt + ?: Show This Help</Typography>
        </Box>
      </DialogContentText>
    </DialogContent>
  </Dialog>
);

// Onboarding tour steps
const TOUR_STEPS = [
  {
    target: '.dashboard-nav',
    content: 'Hier finden Sie die Hauptnavigation für Dashboard und Admin-Bereich.',
  },
  {
    target: '.search-bar',
    content: 'Nutzen Sie die Suchfunktion, um schnell Kampagnen zu finden.',
  },
  {
    target: '.timeline-view',
    content: 'Die Timeline-Ansicht zeigt Ihre Kampagnen im Zeitverlauf.',
  },
];

function App() {
  const [selectedWorkspace, setSelectedWorkspace] = useState('Team Captain');
  const [error, setError] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [showTour, setShowTour] = useState(false);

  // Save theme preference
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyboard = (e) => {
      if (e.altKey) {
        switch (e.key) {
          case 'd':
            setSelectedWorkspace('Team Captain');
            break;
          case 'a':
            setSelectedWorkspace('Admin');
            break;
          case 's':
            document.querySelector('.search-input')?.focus();
            break;
          case 't':
            setDarkMode(!darkMode);
            break;
          case '?':
            setShortcutsOpen(true);
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [darkMode]);

  const handleError = useCallback((error, info = {}) => {
    console.error('Error:', error);
    console.error('Additional Info:', info);
    setError({
      message: error.message || 'Ein Fehler ist aufgetreten',
      severity: 'error'
    });
  }, []);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleTourComplete = () => {
    localStorage.setItem('tourCompleted', 'true');
    setShowTour(false);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <HomeIcon />, value: 'Team Captain' },
    { text: 'Admin', icon: <AdminPanelSettingsIcon />, value: 'Admin' },
  ];

  // Create theme based on mode
  const theme = React.useMemo(() => getTheme(darkMode ? 'dark' : 'light'), [darkMode]);

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={de}>
        <ErrorBoundary>
          <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <CssBaseline />
            
            {/* App Bar for small screens */}
            <Box
              component="nav"
              sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: theme.zIndex.drawer + 2,
                display: { sm: 'none' },
                width: '100%',
                bgcolor: 'background.paper',
                borderBottom: '1px solid',
                borderColor: 'divider',
              }}
            >
              <IconButton onClick={toggleDrawer} sx={{ m: 1 }}>
                <MenuIcon />
              </IconButton>
            </Box>

            {/* Sidebar */}
            <Drawer
              variant="permanent"
              open={drawerOpen}
              sx={{
                width: drawerOpen ? DRAWER_WIDTH : theme.spacing(7),
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                  width: drawerOpen ? DRAWER_WIDTH : theme.spacing(7),
                  boxSizing: 'border-box',
                  overflowX: 'hidden',
                  transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen,
                  }),
                },
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: drawerOpen ? 'space-between' : 'center',
                p: 2,
              }}>
                {drawerOpen && (
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Fundr Studio
                  </Typography>
                )}
                <IconButton onClick={toggleDrawer}>
                  {drawerOpen ? <ChevronLeftIcon /> : <MenuIcon />}
                </IconButton>
              </Box>

              <List className="dashboard-nav">
                {menuItems.map((item) => (
                  <ListItem key={item.text} disablePadding>
                    <ListItemButton
                      selected={selectedWorkspace === item.value}
                      onClick={() => setSelectedWorkspace(item.value)}
                      sx={{
                        minHeight: 48,
                        justifyContent: drawerOpen ? 'initial' : 'center',
                        px: 2.5,
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: drawerOpen ? 2 : 'auto',
                          justifyContent: 'center',
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      {drawerOpen && <ListItemText primary={item.text} />}
                    </ListItemButton>
                  </ListItem>
                ))}

                <ListItem disablePadding>
                  <ListItemButton
                    onClick={toggleTheme}
                    sx={{
                      minHeight: 48,
                      justifyContent: drawerOpen ? 'initial' : 'center',
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: drawerOpen ? 2 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
                    </ListItemIcon>
                    {drawerOpen && (
                      <ListItemText primary={darkMode ? 'Light Mode' : 'Dark Mode'} />
                    )}
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => setShortcutsOpen(true)}
                    sx={{
                      minHeight: 48,
                      justifyContent: drawerOpen ? 'initial' : 'center',
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: drawerOpen ? 2 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      <KeyboardIcon />
                    </ListItemIcon>
                    {drawerOpen && <ListItemText primary="Shortcuts" />}
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => setShowTour(true)}
                    sx={{
                      minHeight: 48,
                      justifyContent: drawerOpen ? 'initial' : 'center',
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: drawerOpen ? 2 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      <HelpOutlineIcon />
                    </ListItemIcon>
                    {drawerOpen && <ListItemText primary="Hilfe" />}
                  </ListItemButton>
                </ListItem>
              </List>
            </Drawer>

            {/* Main content */}
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                width: { sm: `calc(100% - ${drawerOpen ? DRAWER_WIDTH : theme.spacing(7)}px)` },
                ml: { sm: `${drawerOpen ? DRAWER_WIDTH : theme.spacing(7)}px` },
                mt: { xs: '48px', sm: 0 },
                transition: theme.transitions.create(['width', 'margin'], {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.enteringScreen,
                }),
              }}
            >
              <Container 
                maxWidth={false} 
                sx={{ 
                  py: 1.5,
                  px: { xs: 1, sm: 2 },
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Search Bar */}
                <Box sx={{ mb: 1.5 }}>
                  <TextField
                    className="search-input"
                    fullWidth
                    size="small"
                    placeholder="Kampagnen durchsuchen..."
                    value={searchQuery}
                    onChange={handleSearch}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ 
                      bgcolor: 'background.paper',
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />
                </Box>

                <Box sx={{ flexGrow: 1, minHeight: 0 }}>
                  <ErrorBoundary>
                    <Suspense fallback={<LoadingFallback />}>
                      {selectedWorkspace === 'Admin' ? (
                        <AdminChangeRequests />
                      ) : (
                        <CalendarView 
                          onError={handleError}
                          drawerOpen={drawerOpen}
                          searchQuery={searchQuery}
                          className="timeline-view"
                        />
                      )}
                    </Suspense>
                  </ErrorBoundary>
                </Box>
              </Container>
            </Box>

            {/* Keyboard Shortcuts Dialog */}
            <ShortcutsDialog
              open={shortcutsOpen}
              onClose={() => setShortcutsOpen(false)}
            />

            {/* Error Snackbar */}
            <Snackbar
              open={Boolean(error)}
              autoHideDuration={6000}
              onClose={() => setError(null)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
              <Alert
                onClose={() => setError(null)}
                severity={error?.severity || 'error'}
                variant="filled"
                sx={{ width: '100%' }}
              >
                {error?.message}
              </Alert>
            </Snackbar>

            {/* Onboarding Tour */}
            {showTour && (
              <Dialog
                open={true}
                onClose={handleTourComplete}
                maxWidth="sm"
                fullWidth
              >
                <DialogTitle>Willkommen bei Fundr Studio!</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Lassen Sie uns einen kurzen Rundgang durch die wichtigsten Funktionen machen.
                  </DialogContentText>
                  <Box sx={{ mt: 2 }}>
                    {TOUR_STEPS.map((step, index) => (
                      <Box key={index} sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          {index + 1}. {step.target.replace('.', '')}
                        </Typography>
                        <Typography variant="body2">
                          {step.content}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </DialogContent>
                <Box sx={{ p: 2 }}>
                  <Button onClick={handleTourComplete} variant="contained">
                    Tour beenden
                  </Button>
                </Box>
              </Dialog>
            )}
          </Box>
        </ErrorBoundary>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
