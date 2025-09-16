import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile } from '../features/auth/authSlice';
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  CircularProgress,
} from '@mui/material';

const UserProfileForm = ({ user }) => {
  const dispatch = useDispatch();
  const { isLoading, isSuccess, isError, message } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      fullName: user?.fullName || '',
      mobileNumber: user?.mobileNumber || '',
    },
  });

  const onSubmit = (data) => {
    const payload = {
      full_name: data.fullName,
      mobile_number: data.mobileNumber,
    };
    dispatch(updateUserProfile(payload));
  };

  // Optional: Reset form after successful update
  React.useEffect(() => {
    if (isSuccess) {
      reset({
        fullName: user?.fullName || '',
        mobileNumber: user?.mobileNumber || '',
      });
    }
  }, [isSuccess, user, reset]);

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
      <Typography variant="h6" gutterBottom>
        Edit Your Profile
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            {...register('fullName', { required: 'Full name is required' })}
            label="Full Name"
            fullWidth
            error={!!errors.fullName}
            helperText={errors.fullName?.message}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            {...register('mobileNumber', { required: 'Mobile number is required' })}
            label="Mobile Number"
            fullWidth
            error={!!errors.mobileNumber}
            helperText={errors.mobileNumber?.message}
          />
        </Grid>
      </Grid>

      <Button
        type="submit"
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={isLoading}
      >
        {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
      </Button>

      {isError && (
        <Typography color="error" variant="body2">
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default UserProfileForm;