import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from '../../config/firebaseConfig';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';

const getAuthConfig = (getState) => {
  const token = getState().auth.token;
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const { email, password, fullName, gender, mobile } = userData;
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);

      const backendUserData = {
        firebase_uid: userCredential.user.uid,
        email,
        full_name: fullName,
        gender,
        mobile_number: mobile,
      };
      await axiosInstance.post('/auth/register', backendUserData);

      return userCredential.user;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Registration failed';
      return rejectWithValue(message);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (userData, { rejectWithValue }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, userData.email, userData.password);

      if (!userCredential.user.emailVerified) {
        toast.warn('Please verify your email before logging in.');
        return rejectWithValue('Please verify your email to log in.');
      }

      const idToken = await userCredential.user.getIdToken();
      const response = await axiosInstance.post('/auth/login', { idToken });

      if (response.data?.token) {
        localStorage.setItem('token', JSON.stringify(response.data.token));
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error) {
      let errorMessage = 'Login failed. Please check your credentials.';
      if (
        error.code === 'auth/user-not-found' ||
        error.code === 'auth/wrong-password' ||
        error.code === 'auth/invalid-credential'
      ) {
        errorMessage = 'Invalid email or password.';
      } else {
        errorMessage = error.response?.data?.message || error.message;
      }
      return rejectWithValue(errorMessage);
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  await signOut(auth);
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  toast.success('You have been logged out.');
});

export const updateUserProfile = createAsyncThunk(
  'auth/updateProfile',
  async (userData, { getState, rejectWithValue }) => {
    try {
      const config = getAuthConfig(getState);
      const response = await axiosInstance.put('/auth/profile', userData, config);

      if (!response.data?.user) {
        throw new Error('Invalid response from server');
      }

      const updatedUser = response.data.user;

      return {
        fullName: updatedUser.full_name,
        mobileNumber: updatedUser.mobile_number,
        email: updatedUser.email,
        firebase_uid: updatedUser.firebase_uid,
      };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(`Update failed: ${message}`);
      return rejectWithValue(message);
    }
  }
);

let user = null;
let token = null;
try {
  user = JSON.parse(localStorage.getItem('user'));
  token = JSON.parse(localStorage.getItem('token'));
} catch (e) {
  console.error('Failed to parse localStorage:', e);
}

const initialState = {
  user: user || null,
  token: token || null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => { state.isLoading = true; })
      .addCase(registerUser.fulfilled, (state) => { state.isLoading = false; state.isSuccess = true; })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(loginUser.pending, (state) => { state.isLoading = true; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.token = null;
        state.user = null;
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      })

      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('user', JSON.stringify(state.user));
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;