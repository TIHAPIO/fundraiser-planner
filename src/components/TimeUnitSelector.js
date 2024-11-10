import React from 'react';
import PropTypes from 'prop-types';
import {
  ToggleButtonGroup,
  ToggleButton,
  Box,
  useTheme,
} from '@mui/material';

const timeUnits = [
  { value: 'year', label: 'Jahr' },
  { value: 'quarter', label: 'Quartal' },
  { value: 'month', label: 'Monat' },
  { value: 'week', label: 'Woche' },
];

const TimeUnitSelector = ({ value, onChange }) => {
  const theme = useTheme();

  return (
    <Box sx={{ mb: 3 }}>
      <ToggleButtonGroup
        value={value}
        exclusive
        onChange={(e, newValue) => newValue && onChange(newValue)}
        aria-label="Zeiteinheit"
        size="small"
        sx={{
          bgcolor: theme.palette.background.paper,
          '& .MuiToggleButton-root': {
            px: 3,
            py: 1,
            color: theme.palette.text.secondary,
            '&.Mui-selected': {
              color: theme.palette.primary.main,
              bgcolor: theme.palette.primary.light + '20',
              '&:hover': {
                bgcolor: theme.palette.primary.light + '30',
              },
            },
          },
        }}
      >
        {timeUnits.map((unit) => (
          <ToggleButton 
            key={unit.value} 
            value={unit.value}
            aria-label={unit.label}
          >
            {unit.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
};

TimeUnitSelector.propTypes = {
  value: PropTypes.oneOf(['year', 'quarter', 'month', 'week']).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default TimeUnitSelector;
