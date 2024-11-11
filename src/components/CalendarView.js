import React, { useState, useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Paper,
  Typography,
  Fade,
  useTheme,
  Tooltip,
  Badge,
  IconButton,
  Button,
} from '@mui/material';
import TimeUnitSelector from './TimeUnitSelector';
import CampaignSidebar from './CampaignSidebar';
import CampaignDetailsDialog from './CampaignDetailsDialog';
import GroupIcon from '@mui/icons-material/Group';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import HotelIcon from '@mui/icons-material/Hotel';
import WarningIcon from '@mui/icons-material/Warning';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const CalendarView = ({ campaigns = [], onError }) => {
  const theme = useTheme();
  const timelineRef = useRef(null);
  const [timeUnit, setTimeUnit] = useState('year');
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [currentYear, setCurrentYear] = useState(() => {
    const firstCampaign = campaigns[0];
    return firstCampaign ? new Date(firstCampaign.startDate).getFullYear() : new Date().getFullYear();
  });
  const [currentMonth, setCurrentMonth] = useState(() => new Date().getMonth());
  const [currentQuarter, setCurrentQuarter] = useState(() => Math.floor(new Date().getMonth() / 3));
  const [currentWeek, setCurrentWeek] = useState(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const days = Math.floor((now - start) / (24 * 60 * 60 * 1000));
    return Math.ceil(days / 7);
  });

  // Reset scroll position when dialog closes
  useEffect(() => {
    if (!detailsOpen && timelineRef.current) {
      timelineRef.current.scrollLeft = 0;
    }
  }, [detailsOpen]);

  // Sort campaigns by start date
  const sortedCampaigns = [...campaigns].sort((a, b) => 
    new Date(a.startDate) - new Date(b.startDate)
  );

  const navigateToToday = () => {
    const today = new Date();
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    setCurrentQuarter(Math.floor(today.getMonth() / 3));
    const start = new Date(today.getFullYear(), 0, 1);
    const days = Math.floor((today - start) / (24 * 60 * 60 * 1000));
    setCurrentWeek(Math.ceil(days / 7));
  };

  const handleNavigate = (direction) => {
    const increment = direction === 'next' ? 1 : -1;
    
    switch (timeUnit) {
      case 'year':
        setCurrentYear(prev => prev + increment);
        break;
      case 'quarter':
        if (currentQuarter + increment > 3) {
          setCurrentQuarter(0);
          setCurrentYear(prev => prev + 1);
        } else if (currentQuarter + increment < 0) {
          setCurrentQuarter(3);
          setCurrentYear(prev => prev - 1);
        } else {
          setCurrentQuarter(prev => prev + increment);
        }
        break;
      case 'month':
        if (currentMonth + increment > 11) {
          setCurrentMonth(0);
          setCurrentYear(prev => prev + 1);
        } else if (currentMonth + increment < 0) {
          setCurrentMonth(11);
          setCurrentYear(prev => prev - 1);
        } else {
          setCurrentMonth(prev => prev + increment);
        }
        break;
      case 'week':
        const newWeek = currentWeek + increment;
        if (newWeek > 52) {
          setCurrentWeek(1);
          setCurrentYear(prev => prev + 1);
        } else if (newWeek < 1) {
          setCurrentWeek(52);
          setCurrentYear(prev => prev - 1);
        } else {
          setCurrentWeek(newWeek);
        }
        break;
      default:
        break;
    }
  };

  const months = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
  ];

  const monthsShort = [
    'Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun',
    'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'
  ];

  const getTimelineHeaders = () => {
    const headerStyles = {
      display: 'flex',
      borderBottom: `1px solid ${theme.palette.divider}`,
      bgcolor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      '& > div': {
        py: 1.5,
        px: 2,
        textAlign: 'center',
        typography: 'subtitle2',
        fontWeight: 500,
        flex: 1,
        borderRight: `1px solid ${theme.palette.primary.dark}`,
        '&:last-child': {
          borderRight: 'none',
        },
      },
    };

    switch (timeUnit) {
      case 'year':
        return (
          <Box sx={headerStyles}>
            {months.map((month, index) => (
              <Box key={index}>
                {monthsShort[index]}
              </Box>
            ))}
          </Box>
        );
      
      case 'quarter': {
        const quarterMonths = [
          currentQuarter * 3,
          currentQuarter * 3 + 1,
          currentQuarter * 3 + 2
        ];
        return (
          <Box sx={headerStyles}>
            {quarterMonths.map((monthIndex) => (
              <Box key={monthIndex}>
                {months[monthIndex]}
              </Box>
            ))}
          </Box>
        );
      }
      
      case 'month': {
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const weeks = Math.ceil(daysInMonth / 7);
        return (
          <Box sx={headerStyles}>
            {Array.from({ length: weeks }).map((_, index) => {
              const weekStart = index * 7 + 1;
              const weekEnd = Math.min(weekStart + 6, daysInMonth);
              return (
                <Box key={index}>
                  {`${weekStart}. - ${weekEnd}. ${months[currentMonth]}`}
                </Box>
              );
            })}
          </Box>
        );
      }
      
      case 'week': {
        const weekStart = new Date(currentYear, 0, 1 + (currentWeek - 1) * 7);
        return (
          <Box sx={headerStyles}>
            {Array.from({ length: 7 }).map((_, index) => {
              const day = new Date(weekStart);
              day.setDate(weekStart.getDate() + index);
              return (
                <Box key={index}>
                  {`${day.getDate()}. ${monthsShort[day.getMonth()]}`}
                </Box>
              );
            })}
          </Box>
        );
      }
      
      default:
        return null;
    }
  };

  const getCampaignPosition = useCallback((startDate, endDate) => {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new Error('Invalid date format');
      }

      let position = { left: '0%', width: '0%' };

      switch (timeUnit) {
        case 'year': {
          const yearStart = new Date(currentYear, 0, 1);
          const totalDays = 365;
          const startDay = Math.floor((start - yearStart) / (1000 * 60 * 60 * 24));
          const endDay = Math.floor((end - yearStart) / (1000 * 60 * 60 * 24));
          position = {
            left: `${(startDay / totalDays) * 100}%`,
            width: `${((endDay - startDay + 1) / totalDays) * 100}%`,
          };
          break;
        }
        
        case 'quarter': {
          const quarterStart = new Date(currentYear, currentQuarter * 3, 1);
          const quarterEnd = new Date(currentYear, (currentQuarter + 1) * 3, 0);
          const totalDays = Math.floor((quarterEnd - quarterStart) / (1000 * 60 * 60 * 24)) + 1;
          const startDay = Math.max(0, Math.floor((start - quarterStart) / (1000 * 60 * 60 * 24)));
          const endDay = Math.min(totalDays - 1, Math.floor((end - quarterStart) / (1000 * 60 * 60 * 24)));
          position = {
            left: `${(startDay / totalDays) * 100}%`,
            width: `${((endDay - startDay + 1) / totalDays) * 100}%`,
          };
          break;
        }
        
        case 'month': {
          const monthStart = new Date(currentYear, currentMonth, 1);
          const monthEnd = new Date(currentYear, currentMonth + 1, 0);
          const totalDays = monthEnd.getDate();
          const startDay = Math.max(0, Math.floor((start - monthStart) / (1000 * 60 * 60 * 24)));
          const endDay = Math.min(totalDays - 1, Math.floor((end - monthStart) / (1000 * 60 * 60 * 24)));
          position = {
            left: `${(startDay / totalDays) * 100}%`,
            width: `${((endDay - startDay + 1) / totalDays) * 100}%`,
          };
          break;
        }
        
        case 'week': {
          const weekStart = new Date(currentYear, 0, 1 + (currentWeek - 1) * 7);
          const totalDays = 7;
          const startDay = Math.max(0, Math.floor((start - weekStart) / (1000 * 60 * 60 * 24)));
          const endDay = Math.min(6, Math.floor((end - weekStart) / (1000 * 60 * 60 * 24)));
          position = {
            left: `${(startDay / totalDays) * 100}%`,
            width: `${((endDay - startDay + 1) / totalDays) * 100}%`,
          };
          break;
        }
        
        default:
          break;
      }

      return position;
    } catch (error) {
      onError?.(error);
      return { left: '0%', width: '0%' };
    }
  }, [currentYear, currentMonth, currentQuarter, currentWeek, timeUnit, onError]);

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
      position: 'relative',
    }}>
      <Box sx={{ 
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        width: 280,
        zIndex: 2,
        bgcolor: theme.palette.background.paper,
        borderRight: `1px solid ${theme.palette.divider}`,
      }}>
        <CampaignSidebar 
          campaigns={sortedCampaigns}
          onCampaignClick={handleCampaignClick}
        />
      </Box>

      <Box sx={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        ml: '280px',
        pl: 3,
        overflow: 'hidden',
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          mb: 2,
          mt: 1,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Typography 
              variant="h4" 
              sx={{ 
                color: theme.palette.text.primary,
                fontWeight: 500,
              }}
            >
              {timeUnit === 'year' ? currentYear :
               timeUnit === 'quarter' ? `Q${currentQuarter + 1} ${currentYear}` :
               timeUnit === 'month' ? `${months[currentMonth]} ${currentYear}` :
               `KW ${currentWeek}, ${currentYear}`}
            </Typography>
            <TimeUnitSelector value={timeUnit} onChange={handleTimeUnitChange} />
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              variant="outlined"
              onClick={navigateToToday}
              sx={{ minWidth: 100 }}
            >
              Heute
            </Button>
            <IconButton onClick={() => handleNavigate('prev')}>
              <ChevronLeftIcon />
            </IconButton>
            <IconButton onClick={() => handleNavigate('next')}>
              <ChevronRightIcon />
            </IconButton>
          </Box>
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
          {getTimelineHeaders()}

          {/* Timeline Content */}
          <Box 
            ref={timelineRef}
            sx={{ 
              flex: 1,
              position: 'relative',
              bgcolor: theme.palette.background.default,
              minHeight: 200,
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
              px: 4,
              pt: 2,
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
                {Array.from({ length: timeUnit === 'year' ? 12 : timeUnit === 'quarter' ? 3 : timeUnit === 'month' ? Math.ceil(new Date(currentYear, currentMonth + 1, 0).getDate() / 7) : 7 }).map((_, index, array) => (
                  <Box
                    key={index}
                    sx={{
                      flex: 1,
                      borderRight: index < array.length - 1 ? `1px solid ${theme.palette.divider}` : 'none',
                    }}
                  />
                ))}
              </Box>

              {/* Campaign Items */}
              {sortedCampaigns
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
                            top: index * 42,
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
