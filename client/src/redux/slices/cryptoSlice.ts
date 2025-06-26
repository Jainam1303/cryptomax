// client/src/redux/slices/cryptoSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CryptoState {
  cryptos: any[];
  selectedCrypto: any;
  marketData: any;
  priceHistory: any[];
  loading: boolean;
  error: string | null;
}

const initialState: CryptoState = {
  cryptos: [],
  selectedCrypto: null,
  marketData: null,
  priceHistory: [],
  loading: false,
  error: null,
};

const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {
    setCryptos: (state, action: PayloadAction<any[]>) => {
      state.cryptos = action.payload;
    },
    setSelectedCrypto: (state, action: PayloadAction<any>) => {
      state.selectedCrypto = action.payload;
    },
    setMarketData: (state, action: PayloadAction<any>) => {
      state.marketData = action.payload;
    },
    setPriceHistory: (state, action: PayloadAction<any[]>) => {
      state.priceHistory = action.payload;
    },
    setCryptoLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setCryptoError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setCryptos,
  setSelectedCrypto,
  setMarketData,
  setPriceHistory,
  setCryptoLoading,
  setCryptoError,
} = cryptoSlice.actions;
export default cryptoSlice.reducer;
