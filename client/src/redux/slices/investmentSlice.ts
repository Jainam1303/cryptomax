// client/src/redux/slices/investmentSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface InvestmentState {
  portfolio: any;
  investments: any[];
  loading: boolean;
  error: string | null;
}

const initialState: InvestmentState = {
  portfolio: null,
  investments: [],
  loading: false,
  error: null,
};

const investmentSlice = createSlice({
  name: 'investment',
  initialState,
  reducers: {
    setInvestments: (state, action: PayloadAction<any[]>) => {
      state.investments = action.payload;
    },
    setPortfolio: (state, action: PayloadAction<any>) => {
      state.portfolio = action.payload;
    },
    setInvestmentLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setInvestmentError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setInvestments,
  setPortfolio,
  setInvestmentLoading,
  setInvestmentError,
} = investmentSlice.actions;
export default investmentSlice.reducer;
