import React from 'react';
import {
  Paper,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import { format, isWithinInterval } from 'date-fns';
import { de } from 'date-fns/locale';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';

const DailyView = ({ campaigns, fundraisers, onEditWeek, currentDate = new Date() }) => {
  const getActiveCampaigns = () => {
    return campaigns.filter(campaign => {
      const campaignStart = new Date(campaign.startDate);
      const campaignEnd = new Date(campaign.endDate);
      return isWithinInterval(currentDate, { start: campaignStart, end: campaignEnd });
    });
  };

  const getActiveWeek = (campaign) => {
    return campaign.weeks.find(week => {
      const weekStart = new Date(week.startDate);
      const weekEnd = new Date(week.endDate);
      return isWithinInterval(currentDate, { start: weekStart, end: weekEnd });
    });
  };

  const activeCampaigns = getActiveCampaigns();

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">
          Aktive Kampagnen - {format(currentDate, 'EEEE, dd. MMMM yyyy', { locale: de })}
        </Typography>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Kampagne</TableCell>
              <TableCell>Teamleiter</TableCell>
              <TableCell>Aktive Fundraiser</TableCell>
              <TableCell>Aktionen</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {activeCampaigns.map(campaign => {
              const activeWeek = getActiveWeek(campaign);
              const teamLeader = activeWeek 
                ? fundraisers.find(f => f.id === activeWeek.teamLeader)
                : null;
              const activeFundraisers = activeWeek
                ? activeWeek.fundraisers.map(id => fundraisers.find(f => f.id === id)).filter(Boolean)
                : [];

              return (
                <TableRow key={campaign.id}>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {campaign.name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {format(new Date(campaign.startDate), 'dd.MM.yyyy')} - {format(new Date(campaign.endDate), 'dd.MM.yyyy')}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {teamLeader ? (
                      <Chip
                        icon={<PersonIcon />}
                        label={teamLeader.name}
                        color="primary"
                        variant="outlined"
                      />
                    ) : '-'}
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1} flexWrap="wrap">
                      {activeFundraisers.map(fundraiser => (
                        <Chip
                          key={fundraiser.id}
                          icon={<GroupsIcon />}
                          label={fundraiser.name}
                          color="secondary"
                          variant="outlined"
                          size="small"
                        />
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {activeWeek && (
                      <Tooltip title="Woche bearbeiten">
                        <IconButton onClick={() => onEditWeek(activeWeek)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
            {activeCampaigns.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography color="textSecondary">
                    Keine aktiven Kampagnen für heute
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default DailyView;
