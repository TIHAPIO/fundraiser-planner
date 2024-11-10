import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Paper,
  LinearProgress,
  Tooltip,
  IconButton,
  Chip,
  useTheme,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import HomeIcon from '@mui/icons-material/Home';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import GroupIcon from '@mui/icons-material/Group';

const CampaignSidebar = ({ campaigns, onCampaignClick }) => {
  const theme = useTheme();

  const getCapacityColor = (registered, total) => {
    const percentage = (registered / total) * 100;
    if (percentage >= 100) return theme.palette.success.main;
    if (percentage >= 75) return theme.palette.warning.main;
    if (percentage >= 50) return theme.palette.error.main;
    return theme.palette.grey[400];
  };

  const getCapacityVariant = (registered, total) => {
    const percentage = (registered / total) * 100;
    if (percentage >= 100) return 'success';
    if (percentage >= 75) return 'warning';
    if (percentage >= 50) return 'error';
    return 'default';
  };

  return (
    <Box 
      sx={{ 
        width: 280,
        flexShrink: 0,
        mr: 3,
        overflow: 'auto',
      }}
    >
      <Typography 
        variant="subtitle2" 
        sx={{ 
          mb: 2,
          color: theme.palette.text.secondary,
          fontWeight: 500,
        }}
      >
        KAMPAGNEN
      </Typography>

      {campaigns.map((campaign) => {
        const capacityPercentage = (campaign.registeredFundraisers / campaign.capacity) * 100;
        const capacityColor = getCapacityColor(campaign.registeredFundraisers, campaign.capacity);

        return (
          <Paper
            key={campaign.id}
            elevation={0}
            sx={{
              p: 2,
              mb: 2,
              border: `1px solid ${theme.palette.divider}`,
              cursor: 'pointer',
              transition: theme.transitions.create(['box-shadow', 'transform']),
              '&:hover': {
                boxShadow: theme.shadows[2],
                transform: 'translateY(-1px)',
              },
            }}
            onClick={() => onCampaignClick(campaign)}
          >
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 500, flex: 1 }}>
                  {campaign.name}
                </Typography>
                <Tooltip title="Details anzeigen">
                  <IconButton size="small">
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                <GroupIcon fontSize="small" sx={{ color: theme.palette.text.secondary }} />
                <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                  {campaign.registeredFundraisers} von {campaign.capacity} Plätzen belegt
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                {campaign.accommodation && (
                  <Tooltip title="Unterkunft verfügbar">
                    <HomeIcon fontSize="small" sx={{ color: theme.palette.success.main }} />
                  </Tooltip>
                )}
                {campaign.vehicle && (
                  <Tooltip title="Fahrzeug verfügbar">
                    <DirectionsCarIcon fontSize="small" sx={{ color: theme.palette.success.main }} />
                  </Tooltip>
                )}
              </Box>
            </Box>

            <Box sx={{ mt: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <LinearProgress
                  variant="determinate"
                  value={capacityPercentage}
                  sx={{
                    flex: 1,
                    mr: 1,
                    height: 6,
                    borderRadius: 3,
                    bgcolor: theme.palette.grey[200],
                    '& .MuiLinearProgress-bar': {
                      bgcolor: capacityColor,
                    },
                  }}
                />
                <Chip
                  label={`${Math.round(capacityPercentage)}%`}
                  size="small"
                  variant="outlined"
                  color={getCapacityVariant(campaign.registeredFundraisers, campaign.capacity)}
                  sx={{ minWidth: 60 }}
                />
              </Box>
            </Box>
          </Paper>
        );
      })}
    </Box>
  );
};

CampaignSidebar.propTypes = {
  campaigns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      capacity: PropTypes.number.isRequired,
      registeredFundraisers: PropTypes.number.isRequired,
      accommodation: PropTypes.number,
      vehicle: PropTypes.number,
    })
  ).isRequired,
  onCampaignClick: PropTypes.func.isRequired,
};

export default CampaignSidebar;
