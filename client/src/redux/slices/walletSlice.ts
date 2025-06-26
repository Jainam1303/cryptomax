// client/src/redux/slices/walletSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WalletState {
  wallet: any;
  transactions: any[];
  error: string | null;
  loading: boolean;
}

const initialState: WalletState = {
  wallet: null,
  transactions: [],
  error: null,
  loading: false,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setWallet: (state, action: PayloadAction<any>) => {
      state.wallet = action.payload;
    },
    setTransactions: (state, action: PayloadAction<any[]>) => {
      state.transactions = action.payload;
    },
    setWalletLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setWalletError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setWallet, setTransactions, setWalletLoading, setWalletError } = walletSlice.actions;
export default walletSlice.reducer;
