const Investment = require('../models/Investment');
const Crypto = require('../models/Crypto');
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const fs = require('fs');
const path = require('path');

const { 
  storeMockInvestment, 
  storeMockTransaction, 
  getMockInvestments, 
  getMockTransactions 
} = require('../utils/mockDataManager');

// Load mock crypto data when database is unavailable
const loadMockCryptos = () => {
  try {
    const mockDataPath = path.join(__dirname, '../data/cryptos.json');
    if (fs.existsSync(mockDataPath)) {
      return JSON.parse(fs.readFileSync(mockDataPath, 'utf8'));
    }
  } catch (error) {
    console.log('❌ Could not load mock crypto data');
  }
  return [];
};

// @route   GET api/investments
// @desc    Get user investments
// @access  Private
exports.getInvestments = async (req, res) => {
  try {
    // Use mock data if USE_MOCK_INVESTMENTS is true or database is not available
    if (process.env.USE_MOCK_INVESTMENTS === 'true' || !process.env.MONGO_URI) {
      const cryptos = loadMockCryptos();
      const investments = getMockInvestments(req.user.id, cryptos);
      return res.json(investments);
    }
    // Try to fetch from database
    const investments = await Investment.find({ 
      user: req.user.id,
      status: 'active'
    }).populate('crypto', 'name symbol currentPrice image priceChangePercentage24h');
    res.json(investments);
  } catch (err) {
    console.error('Get investments error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @route   POST api/investments
// @desc    Create new investment
// @access  Private
exports.createInvestment = async (req, res) => {
  try {
    const { cryptoId, amount } = req.body;
    if (amount <= 0) {
      return res.status(400).json({ msg: 'Amount must be greater than 0' });
    }
    // Get crypto details
    const crypto = await Crypto.findById(cryptoId);
    if (!crypto) {
      return res.status(404).json({ msg: 'Cryptocurrency not found' });
    }
    // Check wallet balance
    const wallet = await Wallet.findOne({ user: req.user.id });
    if (!wallet) {
      return res.status(404).json({ msg: 'Wallet not found' });
    }
    if (wallet.balance < amount) {
      return res.status(400).json({ msg: 'Insufficient funds' });
    }
    // Calculate quantity based on current price
    const quantity = amount / crypto.currentPrice;
    // Create investment in database
    const investment = new Investment({
      user: req.user.id,
      crypto: cryptoId,
      amount,
      quantity,
      buyPrice: crypto.currentPrice,
      currentValue: amount,
      profitLoss: 0,
      profitLossPercentage: 0
    });
    await investment.save();
    // Deduct from wallet
    wallet.balance -= amount;
    await wallet.save();
    // Create transaction record
    const transaction = new Transaction({
      user: req.user.id,
      type: 'investment',
      amount,
      status: 'completed',
      description: `Investment in ${crypto.name} (${crypto.symbol})`,
      completedAt: Date.now(),
      createdAt: new Date()
    });
    await transaction.save();
    res.json(investment);
  } catch (err) {
    console.error('Create investment error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @route   PUT api/investments/:id/sell
// @desc    Sell investment
// @access  Private
exports.sellInvestment = async (req, res) => {
  try {
    const investment = await Investment.findById(req.params.id).populate('crypto');
    if (!investment) {
      return res.status(404).json({ msg: 'Investment not found' });
    }
    if (investment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    if (investment.status !== 'active') {
      return res.status(400).json({ msg: 'Investment already sold or cancelled' });
    }
    // Use sellPrice from frontend if provided, else fallback to backend price
    const sellPrice = req.body.sellPrice !== undefined ? Number(req.body.sellPrice) : investment.crypto.currentPrice;
    const currentValue = investment.quantity * sellPrice;
    const profitLoss = currentValue - investment.amount;
    // Update investment
    investment.currentValue = currentValue;
    investment.profitLoss = profitLoss;
    investment.profitLossPercentage = (profitLoss / investment.amount) * 100;
    investment.status = 'sold';
    investment.soldAt = Date.now();
    await investment.save();
    // Create transaction record
    const transaction = new Transaction({
      user: req.user.id,
      type: profitLoss >= 0 ? 'profit' : 'loss',
      amount: Math.abs(profitLoss),
      status: 'completed',
      description: `Sold investment in ${investment.crypto.name} (${investment.crypto.symbol})`,
      completedAt: Date.now()
    });
    await transaction.save();
    // Update wallet
    const wallet = await Wallet.findOne({ user: req.user.id });
    wallet.balance += currentValue;
    await wallet.save();
    res.json({
      success: true,
      investment,
      transaction
    });
  } catch (err) {
    console.error('Sell investment error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @route   GET api/investments/portfolio
// @desc    Get portfolio summary
// @access  Private
exports.getPortfolio = async (req, res) => {
  try {
    // Use mock data if USE_MOCK_INVESTMENTS is true or database is not available
    if (process.env.USE_MOCK_INVESTMENTS === 'true' || !process.env.MONGO_URI) {
      const cryptos = loadMockCryptos();
      const investments = getMockInvestments(req.user.id, cryptos);
      return res.json({ investments, summary: {} });
    }
    // Try to fetch from database
    const investments = await Investment.find({ 
      user: req.user.id,
      status: 'active'
    }).populate('crypto', 'name symbol currentPrice image');
    let totalInvested = 0;
    let totalCurrentValue = 0;
    let totalProfitLoss = 0;
    const updatedInvestments = await Promise.all(investments.map(async (investment) => {
      let currentPrice = Number(investment.crypto.currentPrice) || 0;
      const quantity = Number(investment.quantity) || 0;
      const amount = Number(investment.amount) || 0;
      const currentValue = quantity * currentPrice;
      const profitLoss = currentValue - amount;
      const profitLossPercentage = amount !== 0 ? (profitLoss / amount) * 100 : 0;
      let adjustedProfitLoss = profitLoss;
      let adjustedProfitLossPercentage = profitLossPercentage;
      const adminAdjustment = investment.adminAdjustment || { enabled: false, percentage: 0 };
      if (adminAdjustment.enabled) {
        adjustedProfitLossPercentage = profitLossPercentage + (adminAdjustment.percentage || 0);
        adjustedProfitLoss = (adjustedProfitLossPercentage / 100) * amount;
      }
      investment.currentValue = isNaN(currentValue) ? 0 : currentValue;
      investment.profitLoss = isNaN(adjustedProfitLoss) ? 0 : adjustedProfitLoss;
      investment.profitLossPercentage = isNaN(adjustedProfitLossPercentage) ? 0 : adjustedProfitLossPercentage;
      await investment.save();
      totalInvested += amount;
      totalCurrentValue += currentValue;
      totalProfitLoss += adjustedProfitLoss;
      return investment;
    }));
    const totalProfitLossPercentage = totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0;
    res.json({
      investments: updatedInvestments,
      summary: {
        totalInvested,
        totalCurrentValue,
        totalProfitLoss,
        totalProfitLossPercentage
      }
    });
  } catch (err) {
    console.error('Get portfolio error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};