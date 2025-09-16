import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, reset } from '../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Paper,
  Link as MuiLink,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress,
} from '@mui/material';
import { toast } from 'react-toastify';

const UserRegistration = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isError) toast.error(message);
    if (isSuccess) {
      navigate('/login');
      toast.success('Registration successful! Please check your email for verification.');
    }
    dispatch(reset());
  }, [isError, isSuccess, message, navigate, dispatch]);

  const onSubmit = (data) => {
    dispatch(registerUser(data));
  };

  return (
    <Box
      sx={{
        backgroundColor: 'white',
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={2}
          sx={{
            p: 3,
            borderRadius: 2,
            backgroundColor: '#fff',
          }}
        >
          <Typography variant="h5" align="center" gutterBottom>
            Create Account
          </Typography>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  size="small"
                  {...register('fullName', { required: 'Full name is required' })}
                  error={!!errors.fullName}
                  helperText={errors.fullName?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email Address"
                  size="small"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  size="small"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Mobile Number"
                  type="tel"
                  size="small"
                  {...register('mobile', { required: 'Mobile number is required' })}
                  error={!!errors.mobile}
                  helperText={errors.mobile?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl component="fieldset" error={!!errors.gender}>
                  <FormLabel component="legend">Gender</FormLabel>
                  <RadioGroup row>
                    <FormControlLabel
                      value="female"
                      control={<Radio size="small" />}
                      label="Female"
                      {...register('gender', { required: 'Gender is required' })}
                    />
                    <FormControlLabel
                      value="male"
                      control={<Radio size="small" />}
                      label="Male"
                      {...register('gender', { required: 'Gender is required' })}
                    />
                    <FormControlLabel
                      value="other"
                      control={<Radio size="small" />}
                      label="Other"
                      {...register('gender', { required: 'Gender is required' })}
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
            </Button>

            <Grid container justifyContent="flex-end">
              <Grid item>
                <MuiLink component={Link} to="/login" variant="body2">
                  Already have an account? Sign in
                </MuiLink>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default UserRegistration;