import api from './api';

// Get wallet
const getWallet = async () => {
  const response = await api.get('/api/wallet');
  return response.data;
};

// Get transactions
const getTransactions = async () => {
  const response = await api.get('/api/wallet/transactions');
  return response.data;
};

// Deposit funds
const deposit = async (depositData) => {
  const response = await api.post('/api/wallet/deposit', depositData);
  return response.data;
};

// Request withdrawal
const requestWithdrawal = async (withdrawalData) => {
  const response = await api.post('/api/wallet/withdraw', withdrawalData);
  return response.data;
};

const walletService = {
  getWallet,
  getTransactions,
  deposit,
  requestWithdrawal
};

export default walletService;