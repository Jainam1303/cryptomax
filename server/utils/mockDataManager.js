// In-memory storage for mock data when database is empty
let mockInvestments = {};
let mockTransactions = {};

// Store mock investment in memory
const storeMockInvestment = (userId, investment) => {
  if (!mockInvestments[userId]) {
    mockInvestments[userId] = [];
  }
  mockInvestments[userId].push(investment);
  console.log('📊 Stored mock investment for user:', userId);
};

// Store mock transaction in memory
const storeMockTransaction = (userId, transaction) => {
  if (!mockTransactions[userId]) {
    mockTransactions[userId] = [];
  }
  mockTransactions[userId].push(transaction);
  console.log('📊 Stored mock transaction for user:', userId);
};

// Get mock investments for user
const getMockInvestments = (userId) => {
  return mockInvestments[userId] || [];
};

// Get mock transactions for user
const getMockTransactions = (userId) => {
  return mockTransactions[userId] || [];
};

// Clear mock data for user (useful for testing)
const clearMockData = (userId) => {
  delete mockInvestments[userId];
  delete mockTransactions[userId];
  console.log('🗑️ Cleared mock data for user:', userId);
};

module.exports = {
  storeMockInvestment,
  storeMockTransaction,
  getMockInvestments,
  getMockTransactions,
  clearMockData
};