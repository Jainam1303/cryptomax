// client/src/redux/slices/investmentSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface InvestmentState {
  investments: any[];
}

const initialState: InvestmentState = {
  investments: [],
};

const investmentSlice = createSlice({
  name: 'investment',
  initialState,
  reducers: {
    setInvestments: (state, action: PayloadAction<any[]>) => {
      state.investments = action.payload;
    },
  },
});

export const { setInvestments } = investmentSlice.actions;
export default investmentSlice.reducer;
