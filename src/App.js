import React, { useState, useCallback, Suspense } from 'react';
import { 
  Container, 
  Box, 
  CssBaseline, 
  AppBar, 
  Toolbar, 
  Select, 
  MenuItem, 
  IconButton,
  Fab,
  Menu,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Alert,
  CircularProgress,
  Backdrop,
  useTheme,
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { de } from 'date-fns/locale';
import SearchIcon from '@mui/icons-material/Search';
import ShareIcon from '@mui/icons-material/Share';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import AddIcon from '@mui/icons-material/Add';
import PeopleIcon from '@mui/icons-material/People';
import CampaignIcon from '@mui/icons-material/Campaign';

import theme from './theme';
import ErrorBoundary from './ErrorBoundary';
import { mockCampaigns, mockFundraisers } from './data/mockData';

// Lazy load components
const CalendarView = React.lazy(() => import('./components/CalendarView'));
const WeekEditDialog = React.lazy(() => import('./components/WeekEditDialog'));
const CampaignDialog = React.lazy(() => import('./components/CampaignDialog'));
const FundraiserManagement = React.lazy(() => import('./components/FundraiserManagement'));

// Loading component
const LoadingFallback = () => (
  <Backdrop open={true} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
    <CircularProgress color="inherit" />
  </Backdrop>
);

// Error logging function
const logError = (error, info = {}) => {
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', error);
    console.error('Additional Info:', info);
  }
};

function App() {
  const muiTheme = useTheme();
  const [loading, setLoading] = useState(false);
  const [campaigns, setCampaigns] = useState(mockCampaigns);
  const [fundraisers, setFundraisers] = useState(mockFundraisers);
  const [editingWeek, setEditingWeek] = useState(null);
  const [isAddingCampaign, setIsAddingCampaign] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState('Team Workspace');
  const [isFundraiserDialogOpen, setIsFundraiserDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [error, setError] = useState(null);

  const handleAction = useCallback(async (action) => {
    setLoading(true);
    try {
      await action();
    } catch (error) {
      setError({
        message: error.message || 'Ein Fehler ist aufgetreten',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const handleError = useCallback((error, info = {}) => {
    logError(error, info);
    setError({
      message: error.message || 'Ein Fehler ist aufgetreten',
      severity: 'error'
    });
  }, []);

  const handleEditWeek = useCallback((week) => {
    handleAction(async () => {
      if (!week || !week.weekNumber) {
        throw new Error('Invalid week data');
      }
      setEditingWeek(week);
    });
  }, [handleAction]);

  const handleSaveWeek = useCallback((updatedWeek) => {
    handleAction(async () => {
      if (!updatedWeek || !updatedWeek.weekNumber) {
        throw new Error('Invalid week data');
      }

      setCampaigns(prevCampaigns => 
        prevCampaigns.map(campaign => {
          const weekIndex = campaign.weeks.findIndex(w => w.weekNumber === updatedWeek.weekNumber);
          if (weekIndex !== -1) {
            const updatedWeeks = [...campaign.weeks];
            updatedWeeks[weekIndex] = updatedWeek;
            return { ...campaign, weeks: updatedWeeks };
          }
          return campaign;
        })
      );
      setEditingWeek(null);
      setError({ message: 'Woche erfolgreich aktualisiert', severity: 'success' });
    });
  }, [handleAction]);

  const handleAddCampaign = useCallback((newCampaign) => {
    handleAction(async () => {
      if (!newCampaign.name || !newCampaign.startDate || !newCampaign.endDate) {
        throw new Error('Invalid campaign data');
      }

      setCampaigns(prev => [...prev, newCampaign]);
      setIsAddingCampaign(false);
      setError({ message: 'Kampagne erfolgreich erstellt', severity: 'success' });
    });
  }, [handleAction]);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={de}>
        <ErrorBoundary>
          <CssBaseline />
          
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <AppBar 
              position="static" 
              elevation={0} 
              sx={{ 
                borderBottom: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
              }}
            >
              <Toolbar sx={{ minHeight: 64 }}>
                <ViewWeekIcon sx={{ mr: 2, color: 'primary.main' }} />
                <Select
                  value={selectedWorkspace}
                  onChange={(e) => setSelectedWorkspace(e.target.value)}
                  variant="standard"
                  sx={{
                    flexGrow: 1,
                    maxWidth: 200,
                    '& .MuiSelect-select': {
                      fontWeight: 500,
                      color: 'text.primary',
                    },
                  }}
                >
                  <MenuItem value="Team Workspace">Team Workspace</MenuItem>
                  <MenuItem value="Personal Workspace">Personal Workspace</MenuItem>
                </Select>
                <Box sx={{ flexGrow: 1 }} />
                <IconButton size="large" sx={{ color: 'text.secondary' }}>
                  <SearchIcon />
                </IconButton>
                <IconButton size="large" sx={{ color: 'text.secondary' }}>
                  <ShareIcon />
                </IconButton>
              </Toolbar>
            </AppBar>

            <Box 
              component="main" 
              sx={{ 
                flexGrow: 1, 
                bgcolor: 'background.default',
                py: 4,
              }}
            >
              <Container maxWidth="xl">
                <Suspense fallback={<LoadingFallback />}>
                  <CalendarView 
                    campaigns={campaigns}
                    fundraisers={fundraisers}
                    onEditWeek={handleEditWeek}
                    onError={handleError}
                  />
                </Suspense>
              </Container>
            </Box>

            {/* Floating Action Button */}
            <Fab
              color="primary"
              aria-label="add"
              sx={{
                position: 'fixed',
                bottom: 32,
                right: 32,
                boxShadow: muiTheme.shadows[3],
              }}
              onClick={handleMenuClick}
            >
              <AddIcon />
            </Fab>

            {/* Add Menu */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              PaperProps={{
                elevation: 3,
                sx: { mt: 1 }
              }}
            >
              <MenuItem onClick={() => {
                setIsAddingCampaign(true);
                handleMenuClose();
              }}>
                <ListItemIcon>
                  <CampaignIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Neue Kampagne</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => {
                setIsFundraiserDialogOpen(true);
                handleMenuClose();
              }}>
                <ListItemIcon>
                  <PeopleIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Fundraiser verwalten</ListItemText>
              </MenuItem>
            </Menu>

            {/* Dialogs */}
            <Suspense fallback={<LoadingFallback />}>
              {editingWeek && (
                <WeekEditDialog
                  open={Boolean(editingWeek)}
                  week={editingWeek}
                  onClose={() => setEditingWeek(null)}
                  onSave={handleSaveWeek}
                  fundraisers={fundraisers}
                />
              )}

              <CampaignDialog
                open={isAddingCampaign}
                onClose={() => setIsAddingCampaign(false)}
                onSave={handleAddCampaign}
              />

              <FundraiserManagement
                open={isFundraiserDialogOpen}
                onClose={() => setIsFundraiserDialogOpen(false)}
                fundraisers={fundraisers}
                onAdd={(newFundraiser) => {
                  setFundraisers([...fundraisers, { ...newFundraiser, id: Date.now() }]);
                }}
                onEdit={(updatedFundraiser) => {
                  setFundraisers(fundraisers.map(f => 
                    f.id === updatedFundraiser.id ? updatedFundraiser : f
                  ));
                }}
                onDelete={(id) => {
                  setFundraisers(fundraisers.filter(f => f.id !== id));
                }}
              />
            </Suspense>

            {/* Loading Backdrop */}
            <Backdrop
              sx={{ 
                color: '#fff', 
                zIndex: theme.zIndex.drawer + 1,
              }}
              open={loading}
            >
              <CircularProgress color="inherit" />
            </Backdrop>

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
