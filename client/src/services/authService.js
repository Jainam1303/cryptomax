import api from './api';

// Register user
const register = async (userData) => {
  const response = await api.post('/api/auth/register', userData);
  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await api.post('/api/auth/login', userData);
  return response.data;
};

// Get user data
const getUser = async () => {
  const response = await api.get('/api/auth/user');
  return response.data;
};

// Update user profile
const updateProfile = async (userData) => {
  const response = await api.put('/api/users/profile', userData);
  return response.data;
};

const authService = {
  register,
  login,
  getUser,
  updateProfile
};

export default authService;