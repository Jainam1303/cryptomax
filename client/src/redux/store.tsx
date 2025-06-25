import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cryptoReducer from './slices/cryptoSlice';
import walletReducer from './slices/walletSlice';
import investmentReducer from './slices/investmentSlice';
import adminReducer from './slices/adminSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    crypto: cryptoReducer,
    wallet: walletReducer,
    investment: investmentReducer,
    admin: adminReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;