import React from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  Chip,
  IconButton,
  Link,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import GroupIcon from '@mui/icons-material/Group';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { mockAccommodations, mockVehicles } from '../data/mockData';

const CampaignDetailsDialog = ({ open, onClose, campaign }) => {
  if (!campaign) return null;

  const accommodation = mockAccommodations.find(a => a.id === campaign.accommodation);
  const vehicle = mockVehicles.find(v => v.id === campaign.vehicle);

  const getCapacityColor = (registered, total) => {
    const percentage = (registered / total) * 100;
    if (percentage >= 100) return 'success';
    if (percentage >= 75) return 'warning';
    if (percentage >= 50) return 'error';
    return 'default';
  };

  const InfoSection = ({ title, children }) => (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
        {title}
      </Typography>
      {children}
    </Box>
  );

  const ContactInfo = ({ icon, primary, secondary, href }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
      {icon}
      <Box sx={{ ml: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {primary}
        </Typography>
        {href ? (
          <Link href={href} variant="body2" target="_blank" rel="noopener">
            {secondary}
          </Link>
        ) : (
          <Typography variant="body2">{secondary}</Typography>
        )}
      </Box>
    </Box>
  );

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
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">{campaign.name}</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Campaign Info */}
          <Grid item xs={12}>
            <InfoSection title="Kampagnen-Details">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Chip
                  icon={<GroupIcon />}
                  label={`${campaign.registeredFundraisers} von ${campaign.capacity} Plätzen belegt`}
                  color={getCapacityColor(campaign.registeredFundraisers, campaign.capacity)}
                />
                <Chip
                  icon={<CalendarTodayIcon />}
                  label={`${new Date(campaign.startDate).toLocaleDateString()} - ${new Date(campaign.endDate).toLocaleDateString()}`}
                />
              </Box>
              {campaign.notes && (
                <Typography variant="body2" color="text.secondary">
                  {campaign.notes}
                </Typography>
              )}
            </InfoSection>
          </Grid>

          {/* Accommodation Info */}
          {accommodation && (
            <Grid item xs={12} md={6}>
              <InfoSection title="Unterkunft">
                <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 1 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    {accommodation.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {accommodation.address}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        Check-in: {accommodation.checkIn} • Check-out: {accommodation.checkOut}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <GroupIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        Kapazität: {accommodation.capacity} Personen
                      </Typography>
                    </Box>
                  </Box>

                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Kontakt:</Typography>
                  <ContactInfo
                    icon={<EmailIcon fontSize="small" sx={{ color: 'text.secondary' }} />}
                    primary="E-Mail"
                    secondary={accommodation.contact.email}
                    href={`mailto:${accommodation.contact.email}`}
                  />
                  <ContactInfo
                    icon={<PhoneIcon fontSize="small" sx={{ color: 'text.secondary' }} />}
                    primary="Telefon"
                    secondary={accommodation.contact.phone}
                    href={`tel:${accommodation.contact.phone}`}
                  />

                  {accommodation.link && (
                    <Button
                      variant="outlined"
                      size="small"
                      href={accommodation.link}
                      target="_blank"
                      startIcon={<HomeIcon />}
                      sx={{ mt: 1 }}
                    >
                      Unterkunft ansehen
                    </Button>
                  )}
                </Box>
              </InfoSection>
            </Grid>
          )}

          {/* Vehicle Info */}
          {vehicle && (
            <Grid item xs={12} md={6}>
              <InfoSection title="Fahrzeug">
                <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 1 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    {vehicle.model}
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Kennzeichen: {vehicle.licensePlate}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Kapazität: {vehicle.capacity} Personen
                    </Typography>
                  </Box>

                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    {vehicle.rentalCompany}
                  </Typography>
                  <ContactInfo
                    icon={<EmailIcon fontSize="small" sx={{ color: 'text.secondary' }} />}
                    primary="E-Mail"
                    secondary={vehicle.contact.email}
                    href={`mailto:${vehicle.contact.email}`}
                  />
                  <ContactInfo
                    icon={<PhoneIcon fontSize="small" sx={{ color: 'text.secondary' }} />}
                    primary="Telefon"
                    secondary={vehicle.contact.phone}
                    href={`tel:${vehicle.contact.phone}`}
                  />

                  {vehicle.notes && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {vehicle.notes}
                    </Typography>
                  )}
                </Box>
              </InfoSection>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">
          Schließen
        </Button>
      </DialogActions>
    </Dialog>
  );
};

CampaignDetailsDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  campaign: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    capacity: PropTypes.number.isRequired,
    registeredFundraisers: PropTypes.number.isRequired,
    accommodation: PropTypes.number,
    vehicle: PropTypes.number,
    notes: PropTypes.string,
  }),
};

export default CampaignDetailsDialog;
