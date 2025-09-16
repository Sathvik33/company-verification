import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';

// Helper function to get the auth config with the token
const getAuthConfig = (getState) => {
  const token = getState().auth.token;
  if (token) {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }
  return {};
};

// Thunk to get ALL profiles for a user
export const getCompanyProfiles = createAsyncThunk(
  'company/getProfiles',
  async (_, { getState, rejectWithValue }) => {
    try {
      const config = getAuthConfig(getState);
      const response = await axiosInstance.get('/company/profiles', config);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      if (error.response?.status !== 404) toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Thunk to create a SINGLE new profile
export const createCompanyProfile = createAsyncThunk(
  'company/createProfile',
  async (profileData, { getState, rejectWithValue }) => {
    try {
      const config = getAuthConfig(getState);
      const response = await axiosInstance.post('/company/register', profileData, config);
      toast.success('Company profile created successfully!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Thunk to update a SINGLE profile
export const updateCompanyProfile = createAsyncThunk(
  'company/updateProfile',
  async (profileData, { getState, rejectWithValue }) => {
    try {
      const config = getAuthConfig(getState);
      const response = await axiosInstance.put(`/company/profile/${profileData.id}`, profileData, config);
      toast.success('Company profile updated successfully!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Thunk to delete a SINGLE profile
export const deleteCompanyProfile = createAsyncThunk(
  'company/deleteProfile',
  async (profileId, { getState, rejectWithValue }) => {
    try {
      const config = getAuthConfig(getState);
      await axiosInstance.delete(`/company/profile/${profileId}`, config);
      toast.success('Company profile deleted successfully!');
      return profileId;
    } catch (error)      {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  profiles: [], // Manages an array of profiles
  isLoading: false,
  isError: false,
  message: '',
};

export const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All Profiles
      .addCase(getCompanyProfiles.pending, (state) => { state.isLoading = true; })
      .addCase(getCompanyProfiles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profiles = action.payload;
      })
      .addCase(getCompanyProfiles.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Create Profile
      .addCase(createCompanyProfile.pending, (state) => { state.isLoading = true; })
      .addCase(createCompanyProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profiles.push(action.payload); // Add new profile to the array
      })
      .addCase(createCompanyProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Update Profile
      .addCase(updateCompanyProfile.pending, (state) => { state.isLoading = true; })
      .addCase(updateCompanyProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.profiles.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.profiles[index] = action.payload; // Update profile in the array
        }
      })
      .addCase(updateCompanyProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Delete Profile
      .addCase(deleteCompanyProfile.pending, (state) => { state.isLoading = true; })
      .addCase(deleteCompanyProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profiles = state.profiles.filter((p) => p.id !== action.payload); // Remove from array
      })
      .addCase(deleteCompanyProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = companySlice.actions;
export default companySlice.reducer;