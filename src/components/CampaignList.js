import React from 'react';
import { 
  Box, 
  List, 
  ListItem, 
  ListItemText, 
  Paper, 
  Typography,
  Button
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const CampaignList = ({ campaigns, onSelectCampaign, onAddCampaign }) => {
  return (
    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Kampagnen</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAddCampaign}
        >
          Neue Kampagne
        </Button>
      </Box>
      <List>
        {campaigns.map((campaign) => (
          <ListItem
            key={campaign.id}
            onClick={() => onSelectCampaign(campaign)}
            sx={{ 
              border: '1px solid #e0e0e0',
              borderRadius: 1,
              mb: 1,
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: '#f5f5f5'
              }
            }}
          >
            <ListItemText
              primary={campaign.name}
              secondary={`${new Date(campaign.startDate).toLocaleDateString()} - ${new Date(campaign.endDate).toLocaleDateString()}`}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default CampaignList;
