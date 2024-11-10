import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { de } from 'date-fns/locale';
import { mockFundraisers } from '../data/mockData';

const CampaignDialog = ({ open, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    startDate: null,
    endDate: null,
    teamLeader: "",
    selectedFundraisers: [],
  });

  const teamLeaders = mockFundraisers.filter(f => f.role === "Teamleader");
  const availableFundraisers = mockFundraisers.filter(f => f.role === "Fundraiser");

  const handleSave = () => {
    if (formData.name && formData.startDate && formData.endDate && formData.teamLeader && formData.selectedFundraisers.length > 0) {
      const startDate = formData.startDate.toISOString().split("T")[0];
      const endDate = formData.endDate.toISOString().split("T")[0];
      
      onSave({
        ...formData,
        id: Date.now(),
        startDate,
        endDate,
        weeks: generateWeeks(startDate, endDate, formData.teamLeader, formData.selectedFundraisers),
      });
      onClose();
    }
  };

  const generateWeeks = (startDate, endDate, teamLeader, fundraisers) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const weeks = [];
    let currentDate = start;
    let weekNumber = 1;

    while (currentDate <= end) {
      const weekEnd = new Date(currentDate);
      weekEnd.setDate(weekEnd.getDate() + 6);

      weeks.push({
        weekNumber,
        startDate: currentDate.toISOString().split("T")[0],
        endDate: weekEnd.toISOString().split("T")[0],
        teamLeader,
        fundraisers
      });

      currentDate = new Date(weekEnd);
      currentDate.setDate(currentDate.getDate() + 1);
      weekNumber++;
    }

    return weeks;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={de}>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Neue Kampagne</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField
              label="Kampagnenname"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            
            <DatePicker
              label="Startdatum"
              value={formData.startDate}
              onChange={(date) => setFormData({ ...formData, startDate: date })}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
            
            <DatePicker
              label="Enddatum"
              value={formData.endDate}
              onChange={(date) => setFormData({ ...formData, endDate: date })}
              renderInput={(params) => <TextField {...params} fullWidth />}
              minDate={formData.startDate}
            />

            <FormControl fullWidth>
              <InputLabel>Teamleiter</InputLabel>
              <Select
                value={formData.teamLeader}
                label="Teamleiter"
                onChange={(e) => setFormData({ ...formData, teamLeader: e.target.value })}
              >
                {teamLeaders.map((leader) => (
                  <MenuItem key={leader.id} value={leader.id}>
                    {leader.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Fundraiser</InputLabel>
              <Select
                multiple
                value={formData.selectedFundraisers}
                label="Fundraiser"
                onChange={(e) => setFormData({ ...formData, selectedFundraisers: e.target.value })}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip
                        key={value}
                        label={availableFundraisers.find(f => f.id === value)?.name}
                      />
                    ))}
                  </Box>
                )}
              >
                {availableFundraisers.map((fundraiser) => (
                  <MenuItem key={fundraiser.id} value={fundraiser.id}>
                    {fundraiser.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Abbrechen</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={
              !formData.name ||
              !formData.startDate ||
              !formData.endDate ||
              !formData.teamLeader ||
              formData.selectedFundraisers.length === 0
            }
          >
            Kampagne erstellen
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default CampaignDialog;
