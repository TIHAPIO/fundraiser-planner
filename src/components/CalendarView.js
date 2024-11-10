import React, { useState } from 'react';
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

const CalendarView = ({ campaigns = [], onError }) => {
  const theme = useTheme();
  const [timeUnit, setTimeUnit] = useState('month');
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June',
    'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'
  ];

  const quarters = [
    { label: 'Q1 - FY', months: [0, 1, 2] },
    { label: 'Q2 - FY', months: [3, 4, 5] },
    { label: 'Q3 - FY', months: [6, 7, 8] },
    { label: 'Q4 - FY', months: [9, 10, 11] },
  ];

  const handleCampaignClick = (campaign) => {
    setSelectedCampaign(campaign);
    setDetailsOpen(true);
  };

  const getCampaignPosition = (startDate, endDate) => {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new Error('Invalid date format');
      }

      const startMonth = start.getMonth();
      const endMonth = end.getMonth();
      
      const startPercentage = (startMonth / 12) * 100;
      const duration = ((endMonth - startMonth + 1) / 12) * 100;

      return {
        left: `${startPercentage}%`,
        width: `${duration}%`,
      };
    } catch (error) {
      onError?.(error);
      return { left: '0%', width: '0%' };
    }
  };

  const getCapacityColor = (registered, total) => {
    const percentage = (registered / total) * 100;
    if (percentage >= 100) return theme.palette.success.main;
    if (percentage >= 75) return theme.palette.warning.main;
    if (percentage >= 50) return theme.palette.error.main;
    return theme.palette.grey[400];
  };

  const validateCampaign = (campaign) => {
    if (!campaign.id || !campaign.name || !campaign.startDate || !campaign.endDate) {
      console.warn('Invalid campaign data:', campaign);
      return false;
    }
    return true;
  };

  const GridLines = () => (
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
  );

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <CampaignSidebar 
          campaigns={campaigns}
          onCampaignClick={handleCampaignClick}
        />

        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Typography 
              variant="h4" 
              sx={{ 
                color: theme.palette.text.primary,
                fontWeight: 500,
                mr: 4,
              }}
            >
              Fiscal Year
            </Typography>
            <TimeUnitSelector value={timeUnit} onChange={setTimeUnit} />
          </Box>
          
          <Paper 
            elevation={0} 
            sx={{ 
              overflow: 'hidden',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
            }}
          >
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

            {/* Campaign Timeline */}
            <Box 
              sx={{ 
                position: 'relative',
                minHeight: '140px',
                bgcolor: theme.palette.background.default,
                p: 2,
              }}
            >
              <GridLines />
              {campaigns
                .filter(validateCampaign)
                .map((campaign, index) => {
                  const position = getCampaignPosition(campaign.startDate, campaign.endDate);
                  const capacityColor = getCapacityColor(campaign.registeredFundraisers, campaign.capacity);
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
                          </Box>
                        }
                      >
                        <Box
                          sx={{
                            position: 'absolute',
                            ...position,
                            top: index * 44,
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
                            zIndex: isSelected ? 2 : 1,
                            border: isSelected ? `2px solid ${theme.palette.primary.dark}` : 'none',
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
                          <Badge
                            badgeContent={campaign.registeredFundraisers}
                            max={99}
                            color="default"
                            sx={{
                              '& .MuiBadge-badge': {
                                bgcolor: capacityColor,
                                color: '#fff',
                              },
                            }}
                          >
                            <GroupIcon fontSize="small" />
                          </Badge>
                        </Box>
                      </Tooltip>
                    </Fade>
                  );
                })}
            </Box>
          </Paper>
        </Box>
      </Box>

      <CampaignDetailsDialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        campaign={selectedCampaign}
      />
    </>
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
      teamLeader: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      selectedFundraisers: PropTypes.arrayOf(
        PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      ),
    })
  ),
  onError: PropTypes.func,
};

export default CalendarView;
