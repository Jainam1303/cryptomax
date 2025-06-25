// client/src/redux/slices/cryptoSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CryptoState {
  coins: any[];
  loading: boolean;
}

const initialState: CryptoState = {
  coins: [],
  loading: false,
};

const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {
    setCoins: (state, action: PayloadAction<any[]>) => {
      state.coins = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setCoins, setLoading } = cryptoSlice.actions;
export default cryptoSlice.reducer;
