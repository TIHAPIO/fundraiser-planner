import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Chip,
  OutlinedInput,
  Typography,
  FormHelperText,
} from '@mui/material';

const WeekEditDialog = ({ open, onClose, week, fundraisers, onSave }) => {
  // Form state
  const [formState, setFormState] = useState({
    teamLeader: '',
    selectedFundraisers: [],
  });

  // Validation state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Reset form when dialog opens with new week data
  useEffect(() => {
    if (week && open) {
      setFormState({
        teamLeader: week.teamLeader || '',
        selectedFundraisers: week.fundraisers || [],
      });
      setErrors({});
      setTouched({});
    }
  }, [week, open]);

  const teamLeaders = fundraisers.filter(f => f.role === 'Teamleader');
  const availableFundraisers = fundraisers.filter(f => f.role === 'Fundraiser');

  // Validation functions
  const validateField = (name, value) => {
    switch (name) {
      case 'teamLeader':
        return !value ? 'Teamleiter ist erforderlich' : '';
      case 'selectedFundraisers':
        return !value?.length ? 'Mindestens ein Fundraiser muss ausgewählt werden' : '';
      default:
        return '';
    }
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formState).forEach(key => {
      const error = validateField(key, formState[key]);
      if (error) {
        newErrors[key] = error;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Event handlers
  const handleFieldChange = (field, value) => {
    setFormState(prev => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));
    if (touched[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: validateField(field, value)
      }));
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    setErrors(prev => ({
      ...prev,
      [field]: validateField(field, formState[field])
    }));
  };

  const handleSave = () => {
    try {
      if (!validateForm()) {
        throw new Error('Bitte füllen Sie alle erforderlichen Felder aus');
      }

      onSave({
        ...week,
        teamLeader: formState.teamLeader,
        fundraisers: formState.selectedFundraisers,
      });
    } catch (error) {
      console.error('Error saving week:', error);
      setErrors(prev => ({
        ...prev,
        submit: error.message
      }));
    }
  };

  if (!week) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle>
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          Woche {week.weekNumber} bearbeiten
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ my: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <FormControl 
            fullWidth 
            error={touched.teamLeader && Boolean(errors.teamLeader)}
            size="small"
          >
            <InputLabel>Teamleiter</InputLabel>
            <Select
              value={formState.teamLeader}
              onChange={(e) => handleFieldChange('teamLeader', e.target.value)}
              onBlur={() => handleBlur('teamLeader')}
              label="Teamleiter"
            >
              {teamLeaders.map((leader) => (
                <MenuItem key={leader.id} value={leader.id}>
                  {leader.name}
                </MenuItem>
              ))}
            </Select>
            {touched.teamLeader && errors.teamLeader && (
              <FormHelperText>{errors.teamLeader}</FormHelperText>
            )}
          </FormControl>

          <FormControl 
            fullWidth
            error={touched.selectedFundraisers && Boolean(errors.selectedFundraisers)}
            size="small"
          >
            <InputLabel>Fundraiser</InputLabel>
            <Select
              multiple
              value={formState.selectedFundraisers}
              onChange={(e) => handleFieldChange('selectedFundraisers', e.target.value)}
              onBlur={() => handleBlur('selectedFundraisers')}
              input={<OutlinedInput label="Fundraiser" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={fundraisers.find(f => f.id === value)?.name}
                      size="small"
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
            {touched.selectedFundraisers && errors.selectedFundraisers && (
              <FormHelperText>{errors.selectedFundraisers}</FormHelperText>
            )}
          </FormControl>

          <Box sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
            Zeitraum: {new Date(week.startDate).toLocaleDateString()} - {new Date(week.endDate).toLocaleDateString()}
          </Box>

          {errors.submit && (
            <Typography color="error" variant="body2">
              {errors.submit}
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={onClose} color="inherit">
          Abbrechen
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={Object.keys(errors).length > 0}
        >
          Speichern
        </Button>
      </DialogActions>
    </Dialog>
  );
};

WeekEditDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  week: PropTypes.shape({
    weekNumber: PropTypes.number.isRequired,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    teamLeader: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    fundraisers: PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    ),
  }),
  fundraisers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default WeekEditDialog;
