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
import { mockCampaigns } from './data/mockData';

const CalendarView = React.lazy(() => import('./components/CalendarView'));
const AdminChangeRequests = React.lazy(() => import('./components/AdminChangeRequests'));

const DRAWER_WIDTH = 240;
const COLLAPSED_DRAWER_WIDTH = 64; // 8 spacing units

const LoadingFallback = () => (
  <Backdrop open={true} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
    <CircularProgress color="inherit" />
  </Backdrop>
);

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
  const [filteredCampaigns, setFilteredCampaigns] = useState(mockCampaigns);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = mockCampaigns.filter(campaign =>
        campaign.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCampaigns(filtered);
    } else {
      setFilteredCampaigns(mockCampaigns);
    }
  }, [searchQuery]);

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

  const menuItems = [
    { text: 'Dashboard', icon: <HomeIcon />, value: 'Team Captain' },
    { text: 'Admin', icon: <AdminPanelSettingsIcon />, value: 'Admin' },
  ];

  const theme = React.useMemo(() => getTheme(darkMode ? 'dark' : 'light'), [darkMode]);

  const drawerWidth = drawerOpen ? DRAWER_WIDTH : COLLAPSED_DRAWER_WIDTH;

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={de}>
        <ErrorBoundary>
          <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <CssBaseline />
            
            {/* Mobile App Bar */}
            <Box
              component="nav"
              sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: theme.zIndex.drawer + 2,
                display: { sm: 'none' },
                bgcolor: 'background.paper',
                borderBottom: '1px solid',
                borderColor: 'divider',
                px: 1,
                py: 0.5,
              }}
            >
              <IconButton onClick={toggleDrawer} edge="start">
                <MenuIcon />
              </IconButton>
            </Box>

            {/* Sidebar */}
            <Drawer
              variant="permanent"
              open={drawerOpen}
              sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                  width: drawerWidth,
                  boxSizing: 'border-box',
                  overflowX: 'hidden',
                  transition: theme.transitions.create(['width', 'margin'], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.standard,
                  }),
                },
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: drawerOpen ? 'space-between' : 'center',
                p: 2,
                minHeight: 64, // Consistent header height
              }}>
                {drawerOpen && (
                  <Typography variant="h6" noWrap sx={{ fontWeight: 600 }}>
                    Fundr Studio
                  </Typography>
                )}
                <IconButton onClick={toggleDrawer}>
                  {drawerOpen ? <ChevronLeftIcon /> : <MenuIcon />}
                </IconButton>
              </Box>

              <List component="nav" sx={{ px: 1 }}>
                {menuItems.map((item) => (
                  <ListItem key={item.text} disablePadding>
                    <ListItemButton
                      selected={selectedWorkspace === item.value}
                      onClick={() => setSelectedWorkspace(item.value)}
                      sx={{
                        minHeight: 48,
                        justifyContent: drawerOpen ? 'initial' : 'center',
                        px: 2,
                        borderRadius: 1,
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
                      px: 2,
                      borderRadius: 1,
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
                      px: 2,
                      borderRadius: 1,
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
                    onClick={() => {}}
                    sx={{
                      minHeight: 48,
                      justifyContent: drawerOpen ? 'initial' : 'center',
                      px: 2,
                      borderRadius: 1,
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
                height: '100vh',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                width: `calc(100% - ${drawerWidth}px)`,
                ml: `${drawerWidth}px`,
                mt: { xs: '48px', sm: 0 },
                transition: theme.transitions.create(['width', 'margin'], {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.standard,
                }),
              }}
            >
              <Container 
                maxWidth={false} 
                sx={{ 
                  py: 2,
                  px: { xs: 2, sm: 3 },
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                }}
              >
                {/* Search Bar */}
                <Box sx={{ mb: 2 }}>
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

                <Box sx={{ 
                  flexGrow: 1, 
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                }}>
                  <ErrorBoundary>
                    <Suspense fallback={<LoadingFallback />}>
                      {selectedWorkspace === 'Admin' ? (
                        <AdminChangeRequests />
                      ) : (
                        <CalendarView 
                          campaigns={filteredCampaigns}
                          onError={handleError}
                          drawerOpen={drawerOpen}
                          searchQuery={searchQuery}
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
          </Box>
        </ErrorBoundary>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
