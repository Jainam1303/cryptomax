import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { WithdrawalData } from '../../types';

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
  async (data: { amount: number; paymentMethod: string }, thunkAPI) => {
    try {
      const res = await api.post('/api/wallet/deposit', data);
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Deposit failed');
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
  async (data: WithdrawalData, thunkAPI) => {
    try {
      const res = await api.post('/api/wallet/request-withdrawal', data);
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue('Withdrawal request failed');
    }
  }
);
