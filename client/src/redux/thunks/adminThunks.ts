import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// ✅ Get admin dashboard statistics
export const getDashboardData = createAsyncThunk(
  'admin/getDashboardData',
  async (_, thunkAPI) => {
    try {
      const res = await api.get('/api/admin/dashboard');
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue('Failed to fetch dashboard data');
    }
  }
);

// ✅ Get all users
export const getAllUsers = createAsyncThunk(
  'admin/getAllUsers',
  async (_, thunkAPI) => {
    try {
      const res = await api.get('/api/admin/users');
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue('Failed to fetch users');
    }
  }
);

// ✅ Alias
export { getAllUsers as getUsers };

// ✅ Update user role
export const updateUserRole = createAsyncThunk(
  'admin/updateUserRole',
  async ({ userId, role }: { userId: string; role: string }, thunkAPI) => {
    try {
      const res = await api.put(`/api/admin/users/${userId}/role`, { role });
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue('Failed to update user role');
    }
  }
);

// ✅ Get withdrawal requests
export const getWithdrawalRequests = createAsyncThunk(
  'admin/getWithdrawalRequests',
  async (_, thunkAPI) => {
    try {
      const res = await api.get('/api/admin/withdrawals');
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue('Failed to fetch withdrawal requests');
    }
  }
);

// ✅ Process withdrawal request with adminNotes
export const processWithdrawalRequest = createAsyncThunk(
  'admin/processWithdrawalRequest',
  async (
    {
      requestId,
      status,
      adminNotes,
    }: { requestId: string; status: string; adminNotes?: string },
    thunkAPI
  ) => {
    try {
      const res = await api.put(`/api/admin/withdrawals/${requestId}`, {
        status,
        adminNotes,
      });
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue('Failed to update withdrawal status');
    }
  }
);

// ✅ Adjust investment profit/loss
export const adjustInvestment = createAsyncThunk(
  'admin/adjustInvestment',
  async ({ investmentId, adjustment }: { investmentId: string; adjustment: number }, thunkAPI) => {
    try {
      const res = await api.put(`/api/admin/investments/${investmentId}/adjust`, {
        adjustment,
      });
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue('Failed to adjust investment');
    }
  }
);

// ✅ Get all investments (admin scope)
export const getInvestments = createAsyncThunk(
  'admin/getInvestments',
  async (_, thunkAPI) => {
    try {
      const res = await api.get('/api/admin/investments');
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue('Failed to fetch investments');
    }
  }
);

// ✅ Get cryptos (forwarded from cryptoThunks)
export { getCryptos } from './cryptoThunks';

// ✅ Update system-wide crypto settings (e.g., fees, limits, global config)
export const updateCryptoSettings = createAsyncThunk(
  'admin/updateCryptoSettings',
  async (settings: Record<string, any>, thunkAPI) => {
    try {
      const res = await api.put('/api/admin/settings/crypto', settings);
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue('Failed to update crypto settings');
    }
  }
);
