import api from './api';

// Get investments
const getInvestments = async () => {
  const response = await api.get('/api/investments');
  return response.data;
};

// Get portfolio
const getPortfolio = async () => {
  const response = await api.get('/api/investments/portfolio');
  return response.data;
};

// Create investment
const createInvestment = async (investmentData) => {
  const response = await api.post('/api/investments', investmentData);
  return response.data;
};

// Sell investment
const sellInvestment = async (id) => {
  const response = await api.put(`/api/investments/${id}/sell`);
  return response.data;
};

const investmentService = {
  getInvestments,
  getPortfolio,
  createInvestment,
  sellInvestment
};

export default investmentService;