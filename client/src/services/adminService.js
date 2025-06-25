import api from './api';

// Get all users
const getUsers = async () => {
  const response = await api.get('/api/admin/users');
  return response.data;
};

// Get withdrawal requests
const getWithdrawalRequests = async () => {
  const response = await api.get('/api/admin/withdrawal-requests');
  return response.data;
};

// Process withdrawal request
const processWithdrawalRequest = async ({ id, status, adminNotes }) => {
  const response = await api.put(`/api/admin/withdrawal-requests/${id}`, { 
    status, 
    adminNotes 
  });
  return response.data.withdrawalRequest;
};

// Get investments (admin view)
const getInvestments = async () => {
  const response = await api.get('/api/admin/investments');
  return response.data;
};

// Adjust investment profit/loss
const adjustInvestment = async ({ id, enabled, percentage }) => {
  const response = await api.put(`/api/admin/investments/${id}/adjust`, {
    enabled,
    percentage
  });
  return response.data.investment;
};

// Get cryptocurrencies (admin view)
const getCryptos = async () => {
  const response = await api.get('/api/admin/cryptos');
  return response.data;
};

// Update cryptocurrency settings
const updateCryptoSettings = async ({ id, volatility, trend }) => {
  const response = await api.put(`/api/admin/crypto/${id}`, {
    volatility,
    trend
  });
  return response.data.crypto;
};

// Get admin dashboard data
const getDashboardData = async () => {
  const response = await api.get('/api/admin/dashboard');
  return response.data;
};

const adminService = {
  getUsers,
  getWithdrawalRequests,
  processWithdrawalRequest,
  getInvestments,
  adjustInvestment,
  getCryptos,
  updateCryptoSettings,
  getDashboardData
};

export default adminService;