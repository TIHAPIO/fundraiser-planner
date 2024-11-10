import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Grid,
  ButtonGroup,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import GroupIcon from '@mui/icons-material/Group';
import HomeIcon from '@mui/icons-material/Home';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

import { getPendingChangeRequests, updateChangeRequestStatus } from '../data/mockData';

const getRequestTypeLabel = (type) => {
  switch (type) {
    case 'STATUS_CHANGE': return 'Status Änderung';
    case 'RESOURCE_CHANGE': return 'Ressourcen Änderung';
    case 'CAPACITY_CHANGE': return 'Kapazität Änderung';
    case 'DATE_CHANGE': return 'Datum Änderung';
    default: return type;
  }
};

const getRequestIcon = (type) => {
  switch (type) {
    case 'STATUS_CHANGE': return <GroupIcon />;
    case 'RESOURCE_CHANGE': return <HomeIcon />;
    case 'CAPACITY_CHANGE': return <GroupIcon />;
    case 'DATE_CHANGE': return <CalendarTodayIcon />;
    default: return null;
  }
};

const getRequestDescription = (request) => {
  switch (request.type) {
    case 'STATUS_CHANGE':
      return `Status ändern von "${request.data.fromStatus}" zu "${request.data.toStatus}"`;
    case 'RESOURCE_CHANGE':
      return `${request.data.resourceType === 'accommodation' ? 'Unterkunft' : 'Fahrzeug'} ändern`;
    case 'CAPACITY_CHANGE':
      return `Kapazität ändern von ${request.data.fromCapacity} auf ${request.data.toCapacity}`;
    case 'DATE_CHANGE':
      return `Datum ändern von ${new Date(request.data.fromStartDate).toLocaleDateString()} - ${new Date(request.data.fromEndDate).toLocaleDateString()} zu ${new Date(request.data.toStartDate).toLocaleDateString()} - ${new Date(request.data.toEndDate).toLocaleDateString()}`;
    default:
      return 'Unbekannte Änderung';
  }
};

const AdminChangeRequests = () => {
  const [pendingRequests, setPendingRequests] = useState(getPendingChangeRequests());

  const handleApprove = (request) => {
    updateChangeRequestStatus(request.id, 'approved');
    setPendingRequests(getPendingChangeRequests());
  };

  const handleReject = (request) => {
    updateChangeRequestStatus(request.id, 'rejected');
    setPendingRequests(getPendingChangeRequests());
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Ausstehende Änderungsanfragen
      </Typography>

      {pendingRequests.length === 0 ? (
        <Paper 
          sx={{ 
            p: 3, 
            textAlign: 'center',
            bgcolor: 'background.paper',
          }}
        >
          <Typography color="text.secondary">
            Keine ausstehenden Änderungsanfragen
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {pendingRequests.map((request) => (
            <Grid item xs={12} key={request.id}>
              <Paper 
                sx={{ 
                  p: 3,
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                  },
                  transition: 'background-color 0.2s',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Chip
                        icon={getRequestIcon(request.type)}
                        label={getRequestTypeLabel(request.type)}
                        sx={{
                          bgcolor: 'rgba(255, 255, 255, 0.08)',
                          '& .MuiChip-icon': { color: 'inherit' },
                        }}
                      />
                      <Typography variant="subtitle1">
                        Kampagne: {request.campaignId}
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {getRequestDescription(request)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Angefragt von {request.requestedBy} am {new Date(request.createdAt).toLocaleString()}
                    </Typography>
                  </Box>
                  <ButtonGroup orientation="vertical" sx={{ minWidth: 150 }}>
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<CheckCircleIcon />}
                      onClick={() => handleApprove(request)}
                      sx={{ mb: 1 }}
                    >
                      Genehmigen
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<CancelIcon />}
                      onClick={() => handleReject(request)}
                    >
                      Ablehnen
                    </Button>
                  </ButtonGroup>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default AdminChangeRequests;
