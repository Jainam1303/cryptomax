import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AdminState {
  users: any[];
  withdrawalRequests: any[];
  investments: any[];
  cryptos: any[];
  dashboardData: any;
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  users: [],
  withdrawalRequests: [],
  investments: [],
  cryptos: [],
  dashboardData: null,
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<any[]>) => {
      state.users = action.payload;
    },
    setWithdrawalRequests: (state, action: PayloadAction<any[]>) => {
      state.withdrawalRequests = action.payload;
    },
    setInvestments: (state, action: PayloadAction<any[]>) => {
      state.investments = action.payload;
    },
    setCryptos: (state, action: PayloadAction<any[]>) => {
      state.cryptos = action.payload;
    },
    setDashboardData: (state, action: PayloadAction<any>) => {
      state.dashboardData = action.payload;
    },
    setAdminLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setAdminError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setUsers,
  setWithdrawalRequests,
  setInvestments,
  setCryptos,
  setDashboardData,
  setAdminLoading,
  setAdminError
} = adminSlice.actions;

export default adminSlice.reducer;
