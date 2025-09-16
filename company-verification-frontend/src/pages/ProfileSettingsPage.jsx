import React from 'react';
import { useSelector } from 'react-redux';
import { Container, Paper, Typography, Box } from '@mui/material';
import UserProfileForm from '../components/UserProfileForm';

const ProfileSettingsPage = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Profile Settings
        </Typography>
        <Paper sx={{ p: 3 }}>
          <UserProfileForm user={user} />
        </Paper>
      </Box>
    </Container>
  );
};

export default ProfileSettingsPage;
