import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCompanyProfiles, deleteCompanyProfile } from '../features/company/companySlice';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Paper,
  Button,
  Grid,
  Divider,
  Collapse
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CompanyProfileForm from '../components/CompanyProfileForm';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profiles, isLoading: isCompanyLoading } = useSelector((state) => state.company);
  const { token } = useSelector((state) => state.auth);

  const [editingProfile, setEditingProfile] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    dispatch(getCompanyProfiles());
  }, [dispatch, token, navigate]);

  const handleDelete = (profileId) => {
    if (window.confirm('Are you sure you want to delete this company profile?')) {
      dispatch(deleteCompanyProfile(profileId));
    }
  };

  const handleFormSuccess = () => {
      setShowCreateForm(false);
      setEditingProfile(null);
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>Company Dashboard</Typography>
      </Box>

      <Typography variant="h5" gutterBottom>Your Company Profiles</Typography>
      
      <Box sx={{mb: 3}}>
          <Button variant="contained" onClick={() => { setShowCreateForm(!showCreateForm); setEditingProfile(null); }}>
              {showCreateForm ? 'Cancel New Profile' : 'Create New Company Profile'}
          </Button>
      </Box>

      <Collapse in={showCreateForm}>
        <Paper sx={{p: 3, mb: 3}}>
          <CompanyProfileForm onSuccess={handleFormSuccess} />
        </Paper>
      </Collapse>

      <Divider sx={{mb: 3}} />

      {isCompanyLoading && !profiles.length ? (
        <CircularProgress />
      ) : profiles.length > 0 ? (
        <Grid container spacing={3}>
          {profiles.map((profile) => (
            <Grid item xs={12} key={profile.id}>
              <Paper sx={{ p: 3, borderRadius: 2 }}>
                {editingProfile?.id === profile.id ? (
                   <CompanyProfileForm existingProfile={editingProfile} onSuccess={handleFormSuccess} />
                ) : (
                  <>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <Typography variant="h6">{profile.company_name}</Typography>
                      <Box>
                        <Button size="small" onClick={() => { setEditingProfile(profile); setShowCreateForm(false); }}>Edit</Button>
                        <Button size="small" color="error" onClick={() => handleDelete(profile.id)}>Delete</Button>
                      </Box>
                    </Box>
                    <Typography variant="body2">{`${profile.address}, ${profile.city}`}</Typography>
                    {profile.logo_url && <img src={profile.logo_url} alt="company logo" style={{ maxWidth: '100px', marginTop: '10px' }} />}
                  </>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography>You have not created any company profiles yet.</Typography>
      )}
    </Container>
  );
};

export default DashboardPage;