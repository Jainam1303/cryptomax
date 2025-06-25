// client/src/redux/slices/adminSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AdminState {
  users: any[];
  withdrawalRequests: any[];
}

const initialState: AdminState = {
  users: [],
  withdrawalRequests: [],
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
  },
});

export const { setUsers, setWithdrawalRequests } = adminSlice.actions;
export default adminSlice.reducer;
