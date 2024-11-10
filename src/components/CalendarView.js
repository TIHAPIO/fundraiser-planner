import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Paper,
  Typography,
  Fade,
  useTheme,
  Tooltip,
  Badge,
} from '@mui/material';
import TimeUnitSelector from './TimeUnitSelector';
import CampaignSidebar from './CampaignSidebar';
import CampaignDetailsDialog from './CampaignDetailsDialog';
import GroupIcon from '@mui/icons-material/Group';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import HotelIcon from '@mui/icons-material/Hotel';
import WarningIcon from '@mui/icons-material/Warning';

const CalendarView = ({ campaigns = [], onError }) => {
  const theme = useTheme();
  const [timeUnit, setTimeUnit] = useState('year');
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [currentYear] = useState(() => {
    const firstCampaign = campaigns[0];
    return firstCampaign ? new Date(firstCampaign.startDate).getFullYear() : new Date().getFullYear();
  });

  const getCampaignPosition = useCallback((startDate, endDate) => {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new Error('Invalid date format');
      }

      // Calculate position based on the full year
      const yearStart = new Date(currentYear, 0, 1);
      const totalDays = 365; // Use fixed number of days
      
      const startDay = Math.floor((start - yearStart) / (1000 * 60 * 60 * 24));
      const endDay = Math.floor((end - yearStart) / (1000 * 60 * 60 * 24));
      
      const startPercentage = (startDay / totalDays) * 100;
      const widthPercentage = ((endDay - startDay + 1) / totalDays) * 100;

      const position = {
        left: `${startPercentage}%`,
        width: `${widthPercentage}%`,
      };

      console.log('Campaign position calculation:', {
        name: campaigns.find(c => c.startDate === startDate)?.name,
        startDate,
        endDate,
        startDay,
        endDay,
        startPercentage,
        widthPercentage,
        position
      });

      return position;
    } catch (error) {
      onError?.(error);
      return { left: '0%', width: '0%' };
    }
  }, [campaigns, currentYear, onError]);

  // Debug logging
  useEffect(() => {
    console.log('Current Year:', currentYear);
    console.log('Campaigns:', campaigns.map(c => ({
      name: c.name,
      startDate: c.startDate,
      endDate: c.endDate,
      position: getCampaignPosition(c.startDate, c.endDate)
    })));
  }, [campaigns, currentYear, getCampaignPosition]);

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June',
    'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'
  ];

  const quarters = [
    { label: `Q1 - ${currentYear}`, months: [0, 1, 2] },
    { label: `Q2 - ${currentYear}`, months: [3, 4, 5] },
    { label: `Q3 - ${currentYear}`, months: [6, 7, 8] },
    { label: `Q4 - ${currentYear}`, months: [9, 10, 11] },
  ];

  const handleTimeUnitChange = (newUnit) => {
    setTimeUnit(newUnit);
  };

  const handleCampaignClick = (campaign) => {
    setSelectedCampaign(campaign);
    setDetailsOpen(true);
  };

  const getFundraiserStatusColor = (campaign) => {
    const percentage = (campaign.registeredFundraisers / campaign.capacity) * 100;
    if (percentage >= 80) return theme.palette.success.main;
    return theme.palette.error.main;
  };

  const getResourceWarnings = (campaign) => {
    const warnings = [];
    
    const fundraiserPercentage = (campaign.registeredFundraisers / campaign.capacity) * 100;
    if (fundraiserPercentage < 50) {
      warnings.push('Unterbelegung: Weniger als 50% der Plätze belegt');
    } else if (fundraiserPercentage > 90) {
      warnings.push('Überbelegung: Mehr als 90% der Plätze belegt');
    }

    if (!campaign.vehicle) {
      warnings.push('Kein Fahrzeug zugewiesen');
    }
    if (!campaign.accommodation) {
      warnings.push('Keine Unterkunft zugewiesen');
    }

    return warnings;
  };

  const validateCampaign = (campaign) => {
    if (!campaign.id || !campaign.name || !campaign.startDate || !campaign.endDate) {
      console.warn('Invalid campaign data:', campaign);
      return false;
    }
    return true;
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      height: '100%',
      border: '1px solid red', // Debug border
    }}>
      <CampaignSidebar 
        campaigns={campaigns}
        onCampaignClick={handleCampaignClick}
      />

      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        ml: 3,
        border: '1px solid blue', // Debug border
        overflow: 'hidden',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              color: theme.palette.text.primary,
              fontWeight: 500,
              mr: 4,
            }}
          >
            {currentYear} Timeline
          </Typography>
          <TimeUnitSelector value={timeUnit} onChange={handleTimeUnitChange} />
        </Box>
        
        <Paper 
          elevation={0} 
          sx={{ 
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            minHeight: 400,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Headers */}
          <Box>
            {/* Quarters */}
            <Box 
              sx={{ 
                display: 'flex',
                bgcolor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
              }}
            >
              {quarters.map((quarter, index) => (
                <Box
                  key={index}
                  sx={{
                    flex: 1,
                    py: 1.5,
                    px: 2,
                    textAlign: 'center',
                    borderRight: index < 3 ? `1px solid ${theme.palette.primary.dark}` : 'none',
                    typography: 'subtitle2',
                  }}
                >
                  {quarter.label}
                </Box>
              ))}
            </Box>

            {/* Months */}
            <Box 
              sx={{ 
                display: 'flex',
                borderBottom: `1px solid ${theme.palette.divider}`,
                bgcolor: theme.palette.grey[50],
              }}
            >
              {months.map((month, index) => (
                <Box
                  key={index}
                  sx={{
                    flex: 1,
                    py: 1,
                    px: 2,
                    textAlign: 'center',
                    borderRight: index < 11 ? `1px solid ${theme.palette.divider}` : 'none',
                    typography: 'body2',
                    color: theme.palette.text.secondary,
                  }}
                >
                  {month}
                </Box>
              ))}
            </Box>
          </Box>

          {/* Timeline Content */}
          <Box 
            sx={{ 
              flex: 1,
              position: 'relative',
              bgcolor: theme.palette.background.default,
              minHeight: 200,
              border: '1px solid green', // Debug border
              overflowX: 'auto',
              overflowY: 'auto',
            }}
          >
            {/* Timeline Items Container */}
            <Box sx={{ 
              position: 'relative',
              height: '100%',
              minHeight: 400,
              minWidth: '100%',
              width: 'fit-content',
              border: '1px solid yellow', // Debug border
              px: 4,
            }}>
              {/* Grid Lines */}
              <Box 
                sx={{ 
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  pointerEvents: 'none',
                }}
              >
                {months.map((_, index) => (
                  <Box
                    key={index}
                    sx={{
                      flex: 1,
                      borderRight: index < 11 ? `1px solid ${theme.palette.divider}` : 'none',
                    }}
                  />
                ))}
              </Box>

              {/* Test Campaign Items */}
              <Box
                sx={{
                  position: 'absolute',
                  left: '0%',
                  width: '20%',
                  top: '20px',
                  height: 36,
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  borderRadius: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  px: 2,
                  border: `2px solid ${theme.palette.success.main}`,
                  zIndex: 10,
                }}
              >
                Start Test
              </Box>

              <Box
                sx={{
                  position: 'absolute',
                  left: '40%',
                  width: '20%',
                  top: '70px',
                  height: 36,
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  borderRadius: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  px: 2,
                  border: `2px solid ${theme.palette.warning.main}`,
                  zIndex: 10,
                }}
              >
                Middle Test
              </Box>

              <Box
                sx={{
                  position: 'absolute',
                  left: '80%',
                  width: '20%',
                  top: '120px',
                  height: 36,
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  borderRadius: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  px: 2,
                  border: `2px solid ${theme.palette.error.main}`,
                  zIndex: 10,
                }}
              >
                End Test
              </Box>

              {/* Campaign Items */}
              {campaigns
                .filter(validateCampaign)
                .map((campaign, index) => {
                  const position = getCampaignPosition(campaign.startDate, campaign.endDate);
                  const statusColor = getFundraiserStatusColor(campaign);
                  const warnings = getResourceWarnings(campaign);
                  const isSelected = selectedCampaign?.id === campaign.id;

                  return (
                    <Fade key={campaign.id} in={true} timeout={500} style={{ transitionDelay: `${index * 100}ms` }}>
                      <Tooltip
                        title={
                          <Box>
                            <Typography variant="subtitle2">{campaign.name}</Typography>
                            <Typography variant="body2">
                              {campaign.registeredFundraisers} von {campaign.capacity} Plätzen belegt
                            </Typography>
                            {warnings.map((warning, idx) => (
                              <Typography key={idx} variant="body2" color="error">
                                • {warning}
                              </Typography>
                            ))}
                          </Box>
                        }
                      >
                        <Box
                          sx={{
                            position: 'absolute',
                            ...position,
                            top: (index + 4) * 44 + 8,
                            height: 36,
                            display: 'flex',
                            alignItems: 'center',
                            px: 2,
                            borderRadius: '18px',
                            bgcolor: isSelected ? theme.palette.primary.dark : theme.palette.primary.main,
                            color: theme.palette.primary.contrastText,
                            boxShadow: isSelected ? theme.shadows[4] : theme.shadows[2],
                            transition: theme.transitions.create(['transform', 'box-shadow', 'background-color']),
                            cursor: 'pointer',
                            typography: 'body2',
                            fontWeight: 500,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            border: `2px solid ${statusColor}`,
                            zIndex: 2,
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: theme.shadows[4],
                            },
                          }}
                          onClick={() => handleCampaignClick(campaign)}
                        >
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontWeight: 500,
                              mr: 1,
                              flex: 1,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {campaign.name}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            {warnings.length > 0 && (
                              <WarningIcon 
                                sx={{ 
                                  color: theme.palette.warning.main,
                                  fontSize: 20,
                                }}
                              />
                            )}
                            {campaign.vehicle ? (
                              <DirectionsCarIcon sx={{ fontSize: 20 }} />
                            ) : null}
                            {campaign.accommodation ? (
                              <HotelIcon sx={{ fontSize: 20 }} />
                            ) : null}
                            <Badge
                              badgeContent={campaign.registeredFundraisers}
                              max={99}
                              color="default"
                              sx={{
                                '& .MuiBadge-badge': {
                                  bgcolor: statusColor,
                                  color: '#fff',
                                },
                              }}
                            >
                              <GroupIcon fontSize="small" />
                            </Badge>
                          </Box>
                        </Box>
                      </Tooltip>
                    </Fade>
                  );
                })}
            </Box>
          </Box>
        </Paper>
      </Box>

      <CampaignDetailsDialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        campaign={selectedCampaign}
      />
    </Box>
  );
};

CalendarView.propTypes = {
  campaigns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      startDate: PropTypes.string.isRequired,
      endDate: PropTypes.string.isRequired,
      capacity: PropTypes.number.isRequired,
      registeredFundraisers: PropTypes.number.isRequired,
      vehicle: PropTypes.number,
      accommodation: PropTypes.number,
      teamLeader: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      selectedFundraisers: PropTypes.arrayOf(
        PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      ),
    })
  ),
  onError: PropTypes.func,
};

export default CalendarView;
