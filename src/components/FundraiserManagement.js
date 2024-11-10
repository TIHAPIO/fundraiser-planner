import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Divider,
  Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const FundraiserManagement = ({ open, onClose, fundraisers, onAdd, onEdit, onDelete }) => {
  const [newFundraiser, setNewFundraiser] = useState({
    name: '',
    role: 'Fundraiser',
    email: '',
    phone: '',
  });

  const [editingFundraiser, setEditingFundraiser] = useState(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open]);

  const resetForm = () => {
    setNewFundraiser({
      name: '',
      role: 'Fundraiser',
      email: '',
      phone: '',
    });
    setEditingFundraiser(null);
    setErrors({});
    setTouched({});
    setSubmitError(null);
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        return !value.trim() ? 'Name ist erforderlich' : '';
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) return 'E-Mail ist erforderlich';
        if (!emailRegex.test(value)) return 'Ungültige E-Mail-Adresse';
        return '';
      case 'phone':
        const phoneRegex = /^[+]?[\d\s-]{8,}$/;
        if (!value.trim()) return 'Telefonnummer ist erforderlich';
        if (!phoneRegex.test(value)) return 'Ungültige Telefonnummer';
        return '';
      case 'role':
        return !value ? 'Rolle ist erforderlich' : '';
      default:
        return '';
    }
  };

  const validateForm = (data) => {
    const newErrors = {};
    Object.keys(data).forEach(key => {
      const error = validateField(key, data[key]);
      if (error) {
        newErrors[key] = error;
      }
    });
    return newErrors;
  };

  const handleFieldChange = (field, value, isEditing = false) => {
    const targetState = isEditing ? editingFundraiser : newFundraiser;
    const setterFunction = isEditing ? setEditingFundraiser : setNewFundraiser;

    setterFunction({
      ...targetState,
      [field]: value,
    });

    setTouched(prev => ({ ...prev, [field]: true }));
    
    const error = validateField(field, value);
    setErrors(prev => ({
      ...prev,
      [field]: error,
    }));
  };

  const handleAddFundraiser = () => {
    try {
      const validationErrors = validateForm(newFundraiser);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        setTouched(Object.keys(newFundraiser).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
        throw new Error('Bitte füllen Sie alle Pflichtfelder korrekt aus');
      }

      if (fundraisers.some(f => f.email === newFundraiser.email)) {
        throw new Error('Diese E-Mail-Adresse wird bereits verwendet');
      }

      onAdd(newFundraiser);
      resetForm();
    } catch (error) {
      setSubmitError(error.message);
    }
  };

  const handleSaveEdit = () => {
    try {
      const validationErrors = validateForm(editingFundraiser);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        setTouched(Object.keys(editingFundraiser).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
        throw new Error('Bitte füllen Sie alle Pflichtfelder korrekt aus');
      }

      if (fundraisers.some(f => f.email === editingFundraiser.email && f.id !== editingFundraiser.id)) {
        throw new Error('Diese E-Mail-Adresse wird bereits verwendet');
      }

      onEdit(editingFundraiser);
      setEditingFundraiser(null);
    } catch (error) {
      setSubmitError(error.message);
    }
  };

  const handleDelete = (id) => {
    try {
      onDelete(id);
    } catch (error) {
      setSubmitError(error.message);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle>
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          Fundraiser verwalten
        </Typography>
      </DialogTitle>
      <DialogContent>
        {submitError && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setSubmitError(null)}>
            {submitError}
          </Alert>
        )}

        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
            Neuer Fundraiser
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <TextField
              label="Name"
              value={newFundraiser.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              error={touched.name && Boolean(errors.name)}
              helperText={touched.name && errors.name}
              size="small"
            />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Rolle</InputLabel>
              <Select
                value={newFundraiser.role}
                label="Rolle"
                onChange={(e) => handleFieldChange('role', e.target.value)}
              >
                <MenuItem value="Fundraiser">Fundraiser</MenuItem>
                <MenuItem value="Teamleader">Teamleader</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="E-Mail"
              value={newFundraiser.email}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              error={touched.email && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              size="small"
            />
            <TextField
              label="Telefon"
              value={newFundraiser.phone}
              onChange={(e) => handleFieldChange('phone', e.target.value)}
              error={touched.phone && Boolean(errors.phone)}
              helperText={touched.phone && errors.phone}
              size="small"
            />
            <Button
              variant="contained"
              onClick={handleAddFundraiser}
              disabled={Object.keys(errors).length > 0}
            >
              Hinzufügen
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
          Aktuelle Fundraiser
        </Typography>
        <List>
          {fundraisers.map((fundraiser) => (
            <ListItem
              key={fundraiser.id}
              sx={{
                bgcolor: 'background.paper',
                mb: 1,
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              {editingFundraiser?.id === fundraiser.id ? (
                <Box sx={{ display: 'flex', gap: 2, width: '100%', pr: 8 }}>
                  <TextField
                    label="Name"
                    value={editingFundraiser.name}
                    onChange={(e) => handleFieldChange('name', e.target.value, true)}
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                    size="small"
                  />
                  <FormControl size="small">
                    <InputLabel>Rolle</InputLabel>
                    <Select
                      value={editingFundraiser.role}
                      label="Rolle"
                      onChange={(e) => handleFieldChange('role', e.target.value, true)}
                    >
                      <MenuItem value="Fundraiser">Fundraiser</MenuItem>
                      <MenuItem value="Teamleader">Teamleader</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    label="E-Mail"
                    value={editingFundraiser.email}
                    onChange={(e) => handleFieldChange('email', e.target.value, true)}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    size="small"
                  />
                  <TextField
                    label="Telefon"
                    value={editingFundraiser.phone}
                    onChange={(e) => handleFieldChange('phone', e.target.value, true)}
                    error={touched.phone && Boolean(errors.phone)}
                    helperText={touched.phone && errors.phone}
                    size="small"
                  />
                </Box>
              ) : (
                <ListItemText
                  primary={fundraiser.name}
                  secondary={
                    <React.Fragment>
                      <Typography component="span" variant="body2" color="text.primary">
                        {fundraiser.role}
                      </Typography>
                      {` — ${fundraiser.email} • ${fundraiser.phone}`}
                    </React.Fragment>
                  }
                />
              )}
              <ListItemSecondaryAction>
                {editingFundraiser?.id === fundraiser.id ? (
                  <>
                    <IconButton
                      edge="end"
                      onClick={handleSaveEdit}
                      disabled={Object.keys(errors).length > 0}
                      sx={{ mr: 1 }}
                    >
                      <SaveIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      onClick={() => setEditingFundraiser(null)}
                    >
                      <CancelIcon />
                    </IconButton>
                  </>
                ) : (
                  <>
                    <IconButton
                      edge="end"
                      onClick={() => setEditingFundraiser(fundraiser)}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      onClick={() => handleDelete(fundraiser.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </>
                )}
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={onClose} color="inherit">
          Schließen
        </Button>
      </DialogActions>
    </Dialog>
  );
};

FundraiserManagement.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  fundraisers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      phone: PropTypes.string.isRequired,
    })
  ).isRequired,
  onAdd: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default FundraiserManagement;
