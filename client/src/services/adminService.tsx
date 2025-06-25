import api from './api';
import { 
  User, 
  WithdrawalRequest, 
  Investment, 
  Crypto, 
  DashboardData 
} from '../types';

// Get all users
const getUsers = async (): Promise<User[]> => {
  const response = await api.get<User[]>('/api/admin/users');
  return response.data;
};

// Get withdrawal requests
const getWithdrawalRequests = async (): Promise<WithdrawalRequest[]> => {
  const response = await api.get<WithdrawalRequest[]>('/api/admin/withdrawal-requests');
  return response.data;
};

// Process withdrawal request
const processWithdrawalRequest = async ({ id, status, adminNotes }: { id: string; status: string; adminNotes?: string }): Promise<WithdrawalRequest> => {
  const response = await api.put<{ withdrawalRequest: WithdrawalRequest }>(`/api/admin/withdrawal-requests/${id}`, { 
    status, 
    adminNotes 
  });
  return response.data.withdrawalRequest;
};

// Get investments (admin view)
const getInvestments = async (): Promise<Investment[]> => {
  const response = await api.get<Investment[]>('/api/admin/investments');
  return response.data;
};

// Adjust investment profit/loss
const adjustInvestment = async ({ id, enabled, percentage }: { id: string; enabled: boolean; percentage: number }): Promise<Investment> => {
  const response = await api.put<{ investment: Investment }>(`/api/admin/investments/${id}/adjust`, {
    enabled,
    percentage
  });
  return response.data.investment;
};

// Get cryptocurrencies (admin view)
const getCryptos = async (): Promise<Crypto[]> => {
  const response = await api.get<Crypto[]>('/api/admin/cryptos');
  return response.data;
};

// Update cryptocurrency settings
const updateCryptoSettings = async ({ id, volatility, trend }: { id: string; volatility: number; trend: number }): Promise<Crypto> => {
  const response = await api.put<{ crypto: Crypto }>(`/api/admin/crypto/${id}`, {
    volatility,
    trend
  });
  return response.data.crypto;
};

// Get admin dashboard data
const getDashboardData = async (): Promise<DashboardData> => {
  const response = await api.get<DashboardData>('/api/admin/dashboard');
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