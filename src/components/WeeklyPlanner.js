import React, { useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import WeekEditDialog from './WeekEditDialog';

const WeeklyPlanner = ({ campaign, fundraisers, onEditWeek }) => {
  const [editingWeek, setEditingWeek] = useState(null);

  const getWeekDates = (startDate, endDate) => {
    return `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`;
  };

  const getFundraiserNames = (fundraiserIds) => {
    return fundraiserIds
      .map(id => fundraisers.find(f => f.id === id)?.name || '')
      .filter(name => name)
      .join(', ');
  };

  const getTeamLeaderName = (teamLeaderId) => {
    return fundraisers.find(f => f.id === teamLeaderId)?.name || '';
  };

  const handleEditClick = (week) => {
    setEditingWeek(week);
  };

  const handleSaveWeek = (updatedWeek) => {
    onEditWeek(updatedWeek);
    setEditingWeek(null);
  };

  return (
    <>
      <Paper elevation={3} sx={{ p: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">{campaign.name} - Wochenplanung</Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Woche</TableCell>
                <TableCell>Zeitraum</TableCell>
                <TableCell>Teamleiter</TableCell>
                <TableCell>Fundraiser</TableCell>
                <TableCell>Aktionen</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {campaign.weeks.map((week, index) => (
                <TableRow key={index}>
                  <TableCell>{week.weekNumber}</TableCell>
                  <TableCell>{getWeekDates(week.startDate, week.endDate)}</TableCell>
                  <TableCell>{getTeamLeaderName(week.teamLeader)}</TableCell>
                  <TableCell>{getFundraiserNames(week.fundraisers)}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditClick(week)}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <WeekEditDialog
        open={editingWeek !== null}
        week={editingWeek}
        onClose={() => setEditingWeek(null)}
        onSave={handleSaveWeek}
        fundraisers={fundraisers}
      />
    </>
  );
};

export default WeeklyPlanner;
