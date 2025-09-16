import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { createCompanyProfile, updateCompanyProfile } from '../features/company/companySlice';
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  CircularProgress,
  InputLabel
} from '@mui/material';
import { toast } from 'react-toastify';
import axios from 'axios';

// Helper function to upload a file to Cloudinary
const uploadFileToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData
    );
    return response.data.secure_url;
  } catch (error) {
    console.error('Cloudinary upload failed:', error);
    toast.error('Image upload failed. Please try again.');
    return null;
  }
};

const CompanyProfileForm = ({ existingProfile, onSuccess }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: existingProfile || {},
  });
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.company);
  const [isUploading, setIsUploading] = useState(false);

  const onSubmit = async (data) => {
    // --- DIAGNOSTIC LOG 1 ---
    console.log('Checkpoint 1: onSubmit function has been triggered.');
    console.log('Form data:', data);
    // -------------------------

    setIsUploading(true);
    let logoUrl = existingProfile?.logo_url || '';
    let bannerUrl = existingProfile?.banner_url || '';

    if (data.logo_url && data.logo_url[0]) {
      toast.info('Uploading company logo...');
      logoUrl = await uploadFileToCloudinary(data.logo_url[0]);
      if (!logoUrl) {
        setIsUploading(false);
        return;
      }
    }

    if (data.banner_url && data.banner_url[0]) {
      toast.info('Uploading company banner...');
      bannerUrl = await uploadFileToCloudinary(data.banner_url[0]);
      if (!bannerUrl) {
        setIsUploading(false);
        return;
      }
    }
    
    setIsUploading(false);

    const profileData = {
      ...data,
      logo_url: logoUrl,
      banner_url: bannerUrl,
    };

    let actionResult;
    if (existingProfile) {
      // --- DIAGNOSTIC LOG 2 (for editing) ---
      console.log('Checkpoint 2: Dispatching updateCompanyProfile action.');
      // ------------------------------------
      actionResult = await dispatch(updateCompanyProfile({ ...profileData, id: existingProfile.id }));
    } else {
      // --- DIAGNOSTIC LOG 3 (for creating) ---
      console.log('Checkpoint 3: Dispatching createCompanyProfile action.');
      // -------------------------------------
      actionResult = await dispatch(createCompanyProfile(profileData));
    }

    if (actionResult.type.endsWith('/fulfilled')) {
      // --- DIAGNOSTIC LOG 4 ---
      console.log('Checkpoint 4: Action was successful. Calling onSuccess callback.');
      // -------------------------
      if (onSuccess) {
        onSuccess();
      }
    } else {
      // --- DIAGNOSTIC LOG 5 ---
      console.log('Checkpoint 5: Action failed or was rejected.');
      console.log('Action result:', actionResult);
      // -------------------------
    }
  };

  const totalLoading = isLoading || isUploading;

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
      <Typography variant="h6" gutterBottom>
        {existingProfile ? 'Edit Company Profile' : 'Create New Company Profile'}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField {...register('company_name', { required: 'Company name is required' })} label="Company Name" fullWidth error={!!errors.company_name} helperText={errors.company_name?.message} />
        </Grid>
        <Grid item xs={12}>
          <TextField {...register('address', { required: 'Address is required' })} label="Address" fullWidth error={!!errors.address} helperText={errors.address?.message} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField {...register('city', { required: 'City is required' })} label="City" fullWidth error={!!errors.city} helperText={errors.city?.message} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField {...register('state', { required: 'State is required' })} label="State" fullWidth error={!!errors.state} helperText={errors.state?.message} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField {...register('country', { required: 'Country is required' })} label="Country" fullWidth error={!!errors.country} helperText={errors.country?.message} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField {...register('zip_code', { required: 'Zip code is required' })} label="Zip Code" fullWidth error={!!errors.zip_code} helperText={errors.zip_code?.message} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputLabel htmlFor="logo_url">Company Logo</InputLabel>
          <TextField type="file" fullWidth id="logo_url" {...register('logo_url')} />
           {existingProfile?.logo_url && <img src={existingProfile.logo_url} alt="logo preview" style={{ maxWidth: '100px', marginTop: '10px' }} />}
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputLabel htmlFor="banner_url">Company Banner</InputLabel>
          <TextField type="file" fullWidth id="banner_url" {...register('banner_url')} />
           {existingProfile?.banner_url && <img src={existingProfile.banner_url} alt="banner preview" style={{ maxWidth: '100px', marginTop: '10px' }} />}
        </Grid>
      </Grid>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={totalLoading}
      >
        {totalLoading ? <CircularProgress size={24} color="inherit" /> : (existingProfile ? 'Save Changes' : 'Create Profile')}
      </Button>
    </Box>
  );
};

export default CompanyProfileForm;