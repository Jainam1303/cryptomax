import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// ✅ Get wallet balance & summary
export const getWallet = createAsyncThunk(
  'wallet/getWallet',
  async (_, thunkAPI) => {
    try {
      const res = await api.get('/api/wallet');
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue('Failed to fetch wallet');
    }
  }
);

// ✅ Get transaction history
export const getTransactions = createAsyncThunk(
  'wallet/getTransactions',
  async (_, thunkAPI) => {
    try {
      const res = await api.get('/api/wallet/transactions');
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue('Failed to fetch transactions');
    }
  }
);

// ✅ Deposit funds
export const deposit = createAsyncThunk(
  'wallet/deposit',
  async (amount: number, thunkAPI) => {
    try {
      const res = await api.post('/api/wallet/deposit', { amount });
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue('Deposit failed');
    }
  }
);

// ✅ Withdraw funds immediately
export const withdraw = createAsyncThunk(
  'wallet/withdraw',
  async (amount: number, thunkAPI) => {
    try {
      const res = await api.post('/api/wallet/withdraw', { amount });
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue('Withdrawal failed');
    }
  }
);

// ✅ Request withdrawal (used for admin approval flow)
export const requestWithdrawal = createAsyncThunk(
  'wallet/requestWithdrawal',
  async (amount: number, thunkAPI) => {
    try {
      const res = await api.post('/api/wallet/request-withdrawal', { amount });
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue('Withdrawal request failed');
    }
  }
);
