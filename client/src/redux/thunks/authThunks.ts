import { createAsyncThunk } from '@reduxjs/toolkit';
import { loginSuccess, userLoaded, logout } from '../slices/authSlice';
import api, { setAuthToken } from '../../services/api';

// ✅ Load User
export const loadUser = createAsyncThunk('auth/loadUser', async (_, thunkAPI) => {
  try {
    const res = await api.get('/api/auth/user');
    thunkAPI.dispatch(userLoaded(res.data));
    return res.data;
  } catch (err: any) {
    thunkAPI.dispatch(logout());
    return thunkAPI.rejectWithValue('Failed to load user');
  }
});

// ✅ Login User
export const login = createAsyncThunk(
  'auth/loginUser',
  async (credentials: { email: string; password: string }, thunkAPI) => {
    try {
      const res = await api.post('/api/auth/login', credentials);
      const { token } = res.data;

      localStorage.setItem('token', token);
      setAuthToken(token);
      thunkAPI.dispatch(loginSuccess({ token }));
      thunkAPI.dispatch(loadUser());

      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

// ✅ Register User
export const register = createAsyncThunk(
  'auth/registerUser',
  async (
    formData: { name: string; email: string; password: string },
    thunkAPI
  ) => {
    try {
      const res = await api.post('/api/auth/register', formData);
      const { token } = res.data;

      localStorage.setItem('token', token);
      setAuthToken(token);
      thunkAPI.dispatch(loginSuccess({ token }));
      thunkAPI.dispatch(loadUser());

      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Register failed');
    }
  }
);

// ✅ Logout
export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, thunkAPI) => {
  localStorage.removeItem('token');
  setAuthToken(null);
  thunkAPI.dispatch(logout());
});

// ✅ Update Profile
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (
    profileData: { name?: string; email?: string; password?: string },
    thunkAPI
  ) => {
    try {
      const res = await api.put('/api/auth/update', profileData);
      thunkAPI.dispatch(userLoaded(res.data));
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 'Failed to update profile'
      );
    }
  }
);
