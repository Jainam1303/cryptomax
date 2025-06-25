import api from './api';

// Get all cryptocurrencies
const getCryptos = async () => {
  const response = await api.get('/api/crypto');
  return response.data;
};

// Get cryptocurrency by ID
const getCryptoById = async (id) => {
  const response = await api.get(`/api/crypto/${id}`);
  return response.data;
};

// Get cryptocurrency price history
const getPriceHistory = async (id, timeframe) => {
  const response = await api.get(`/api/crypto/${id}/price-history?timeframe=${timeframe}`);
  return response.data;
};

// Get market data
const getMarketData = async () => {
  const response = await api.get('/api/crypto/market-data');
  return response.data;
};

const cryptoService = {
  getCryptos,
  getCryptoById,
  getPriceHistory,
  getMarketData
};

export default cryptoService;