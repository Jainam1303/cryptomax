const fs = require('fs');
const path = require('path');

// In-memory storage for mock data when database is empty
let mockInvestments = {};
let mockTransactions = {};

// Load shared mock investments from JSON file
const loadSharedMockInvestments = () => {
  try {
    const investmentsPath = path.join(__dirname, '../data/mockInvestments.json');
    if (fs.existsSync(investmentsPath)) {
      const investmentsData = JSON.parse(fs.readFileSync(investmentsPath, 'utf8'));
      console.log('📊 Loaded shared mock investments data');
      return investmentsData;
    }
  } catch (error) {
    console.error('❌ Error loading shared mock investments:', error);
  }
  return [];
};

// Update investment values with current crypto prices
const updateInvestmentValues = (investments, cryptos) => {
  return investments.map(investment => {
    // Find current crypto price
    const currentCrypto = cryptos.find(c => c._id === investment.crypto._id);
    if (currentCrypto) {
      const currentPrice = currentCrypto.currentPrice;
      const currentValue = investment.quantity * currentPrice;
      const profitLoss = currentValue - investment.amount;
      const profitLossPercentage = (profitLoss / investment.amount) * 100;
      
      return {
        ...investment,
        crypto: {
          ...investment.crypto,
          currentPrice: currentPrice
        },
        currentValue: currentValue,
        profitLoss: profitLoss,
        profitLossPercentage: profitLossPercentage
      };
    }
    return investment;
  });
};

// Store mock investment in memory (for user-specific investments)
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

// Get mock investments for user (now returns shared investments + user-specific)
const getMockInvestments = (userId, cryptos = []) => {
  // Get shared investments that all users see
  let sharedInvestments = loadSharedMockInvestments();
  
  // Update with current crypto prices if provided
  if (cryptos.length > 0) {
    sharedInvestments = updateInvestmentValues(sharedInvestments, cryptos);
  }
  
  // Get user-specific investments
  const userInvestments = mockInvestments[userId] || [];
  
  // Combine and return
  return [...sharedInvestments, ...userInvestments];
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
  clearMockData,
  loadSharedMockInvestments,
  updateInvestmentValues
};