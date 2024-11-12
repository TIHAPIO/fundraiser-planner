// React imports
import React from 'react';
import { useState, useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

// MUI Components
import {
  Badge,
  Box,
  Button,
  Fade,
  IconButton,
  Paper,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';

// MUI Icons
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import GroupIcon from '@mui/icons-material/Group';
import HotelIcon from '@mui/icons-material/Hotel';
import WarningIcon from '@mui/icons-material/Warning';

// Local components
import CampaignDetailsDialog from './CampaignDetailsDialog';
import CampaignSidebar from './CampaignSidebar';
import TimeUnitSelector from './TimeUnitSelector';

const CalendarView = ({ campaigns = [], onError, drawerOpen }) => {
  const theme = useTheme();
  const timelineRef = useRef(null);
  const [timeUnit, setTimeUnit] = useState('week');
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

  useEffect(() => {
    if (!detailsOpen && timelineRef.current) {
      timelineRef.current.scrollLeft = 0;
    }
  }, [detailsOpen]);

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
      borderBottom: `2px solid ${theme.palette.divider}`,
      bgcolor: theme.palette.background.paper,
      color: theme.palette.text.primary,
      position: 'sticky',
      top: 0,
      zIndex: 3,
      boxShadow: theme.shadows[2],
      '& > div': {
        py: 2,
        px: 2,
        textAlign: 'center',
        typography: 'subtitle1',
        fontWeight: 600,
        flex: 1,
        borderRight: `1px solid ${theme.palette.divider}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0.5,
        '&:last-child': {
          borderRight: 'none',
        },
      },
    };

    const getDayLabel = (date) => {
      const days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
      return days[date.getDay()];
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
                  <Typography variant="caption" color="text.secondary">
                    KW {Math.ceil(weekStart / 7)}
                  </Typography>
                  <Typography variant="subtitle2">
                    {`${weekStart}. - ${weekEnd}.`}
                  </Typography>
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
              const isToday = new Date().toDateString() === day.toDateString();
              return (
                <Box 
                  key={index}
                  sx={{
                    position: 'relative',
                    '&::after': isToday ? {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '24px',
                      height: '3px',
                      bgcolor: theme.palette.primary.main,
                      borderRadius: '2px',
                    } : {},
                  }}
                >
                  <Typography 
                    variant="caption" 
                    color={isToday ? 'primary' : 'text.secondary'}
                    sx={{ fontWeight: isToday ? 600 : 400 }}
                  >
                    {getDayLabel(day)}
                  </Typography>
                  <Typography 
                    variant="subtitle2"
                    color={isToday ? 'primary' : 'text.primary'}
                    sx={{ fontWeight: isToday ? 600 : 500 }}
                  >
                    {`${day.getDate()}. ${monthsShort[day.getMonth()]}`}
                  </Typography>
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
    if (percentage >= 90) return theme.palette.error.main; // Überbelegung
    if (percentage >= 80) return theme.palette.success.main; // Gut belegt
    if (percentage >= 50) return theme.palette.warning.main; // Mittelmäßig belegt
    return theme.palette.error.main; // Unterbelegung
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
      width: '100%',
      position: 'relative',
    }}>
      {/* Main Content */}
      <Box sx={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        height: '100%',
      }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          mb: 2,
          mt: 2,
          py: 1,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Typography 
              variant="h4" 
              sx={{ 
                color: theme.palette.text.primary,
                fontWeight: 600,
                letterSpacing: '-0.5px',
              }}
            >
              {timeUnit === 'year' ? currentYear :
               timeUnit === 'quarter' ? `Q${currentQuarter + 1} ${currentYear}` :
               timeUnit === 'month' ? `${months[currentMonth]} ${currentYear}` :
               `KW ${currentWeek}, ${currentYear}`}
            </Typography>
            <TimeUnitSelector value={timeUnit} onChange={handleTimeUnitChange} />
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant="contained"
              onClick={navigateToToday}
              sx={{ 
                minWidth: 100,
                bgcolor: theme.palette.primary.main,
                '&:hover': {
                  bgcolor: theme.palette.primary.dark,
                },
              }}
            >
              Heute
            </Button>
            <Box sx={{ 
              display: 'flex',
              gap: 0.5,
              bgcolor: theme.palette.background.paper,
              borderRadius: 1,
              p: 0.5,
            }}>
              <IconButton 
                onClick={() => handleNavigate('prev')}
                sx={{ 
                  color: theme.palette.text.primary,
                  '&:hover': {
                    bgcolor: theme.palette.action.hover,
                  },
                }}
              >
                <ChevronLeftIcon />
              </IconButton>
              <IconButton 
                onClick={() => handleNavigate('next')}
                sx={{ 
                  color: theme.palette.text.primary,
                  '&:hover': {
                    bgcolor: theme.palette.action.hover,
                  },
                }}
              >
                <ChevronRightIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
        
        {/* Timeline */}
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
            bgcolor: theme.palette.background.paper,
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
              px: 2,
              pt: 2,
              pb: 4,
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
                      bgcolor: index % 2 === 0 ? 'rgba(0, 0, 0, 0.02)' : 'transparent',
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
                  const hasWarnings = warnings.length > 0;
                  const percentage = (campaign.registeredFundraisers / campaign.capacity) * 100;

                  return (
                    <Fade key={campaign.id} in={true} timeout={300} style={{ transitionDelay: `${index * 50}ms` }}>
                      <Tooltip
                        title={
                          <Box sx={{ p: 0.5 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>{campaign.name}</Typography>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: percentage >= 90 ? theme.palette.error.light :
                                       percentage >= 80 ? theme.palette.success.light :
                                       theme.palette.warning.light
                              }}
                            >
                              {campaign.registeredFundraisers} von {campaign.capacity} Plätzen belegt
                            </Typography>
                            {warnings.map((warning, idx) => (
                              <Typography 
                                key={idx} 
                                variant="body2" 
                                sx={{ 
                                  color: theme.palette.error.light,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 0.5,
                                  mt: 0.5
                                }}
                              >
                                <WarningIcon sx={{ fontSize: 16 }} />
                                {warning}
                              </Typography>
                            ))}
                          </Box>
                        }
                        placement="top"
                      >
                        <Box
                          sx={{
                            position: 'absolute',
                            ...position,
                            top: index * 46 + 4,
                            height: 38,
                            display: 'flex',
                            alignItems: 'center',
                            px: 1.5,
                            borderRadius: '19px',
                            bgcolor: hasWarnings ? theme.palette.error.dark : theme.palette.primary.main,
                            color: '#fff',
                            boxShadow: isSelected ? theme.shadows[8] : theme.shadows[2],
                            transition: theme.transitions.create(
                              ['transform', 'box-shadow', 'background-color'],
                              { duration: 200 }
                            ),
                            cursor: 'pointer',
                            typography: 'body2',
                            fontWeight: 500,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            border: `2px solid ${statusColor}`,
                            zIndex: isSelected ? 3 : 2,
                            '&:hover': {
                              transform: 'translateY(-1px)',
                              boxShadow: theme.shadows[8],
                              bgcolor: hasWarnings ? theme.palette.error.main : theme.palette.primary.dark,
                            },
                          }}
                          onClick={() => handleCampaignClick(campaign)}
                        >
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontWeight: 600,
                              mr: 1,
                              flex: 1,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              color: hasWarnings ? '#fff' : 'inherit',
                            }}
                          >
                            {campaign.name}
                          </Typography>
                          <Box sx={{ 
                            display: 'flex', 
                            gap: 0.75,
                            alignItems: 'center',
                            '& .MuiSvgIcon-root': {
                              fontSize: 18,
                              color: hasWarnings ? '#fff' : 'inherit',
                            }
                          }}>
                            {warnings.length > 0 && (
                              <WarningIcon 
                                sx={{ 
                                  color: `${theme.palette.warning.light} !important`,
                                  animation: 'pulse 2s infinite',
                                  '@keyframes pulse': {
                                    '0%': { opacity: 1 },
                                    '50%': { opacity: 0.6 },
                                    '100%': { opacity: 1 },
                                  },
                                }}
                              />
                            )}
                            {campaign.vehicle ? (
                              <DirectionsCarIcon />
                            ) : null}
                            {campaign.accommodation ? (
                              <HotelIcon />
                            ) : null}
                            <Badge
                              badgeContent={campaign.registeredFundraisers}
                              max={99}
                              color="default"
                              sx={{
                                '& .MuiBadge-badge': {
                                  bgcolor: statusColor,
                                  color: '#fff',
                                  fontWeight: 600,
                                  minWidth: 20,
                                  height: 20,
                                },
                              }}
                            >
                              <GroupIcon />
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
  drawerOpen: PropTypes.bool,
};

export default CalendarView;
