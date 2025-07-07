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
    // Check if database has investments
    let investments = [];
    
    try {
      const investmentCount = await Investment.countDocuments();
      if (investmentCount === 0) {
        console.log('📊 No investments in database - using shared mock investments');
        // Load crypto data for price calculations
        const cryptos = loadMockCryptos();
        // Get shared mock investments for all users
        investments = getMockInvestments(req.user.id, cryptos);
      } else {
        investments = await Investment.find({ 
          user: req.user.id,
          status: 'active'
        }).populate('crypto', 'name symbol currentPrice image priceChangePercentage24h');
      }
    } catch (dbError) {
      console.log('⚠️ Database unavailable - using shared mock investments');
      // Load crypto data for price calculations
      const cryptos = loadMockCryptos();
      // Get shared mock investments for all users
      investments = getMockInvestments(req.user.id, cryptos);
    }
    
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
    
    // Get crypto details - handle both ObjectId and string IDs
    let crypto;
    let dbEmpty = false;
    
    // First check if database has any cryptos
    try {
      const cryptoCount = await Crypto.countDocuments();
      if (cryptoCount === 0) {
        dbEmpty = true;
        console.log('📊 Database empty, using mock cryptocurrency data for investment');
      }
    } catch (countError) {
      dbEmpty = true;
      console.log('⚠️ Database unavailable, using mock cryptocurrency data for investment');
    }
    
    if (dbEmpty) {
      // Go straight to mock data
      const mockCryptos = loadMockCryptos();
      crypto = mockCryptos.find(c => 
        c._id === cryptoId || 
        c.symbol.toLowerCase() === cryptoId.toLowerCase() ||
        c.name.toLowerCase() === cryptoId.toLowerCase()
      );
    } else {
      // Try database first
      try {
        crypto = await Crypto.findById(cryptoId);
      } catch (objectIdError) {
        // Try to find by symbol or name if ObjectId fails
        crypto = await Crypto.findOne({
          $or: [
            { symbol: cryptoId.toUpperCase() },
            { name: { $regex: new RegExp(cryptoId, 'i') } }
          ]
        });
      }
      
      // If still not found in database, try mock data
      if (!crypto) {
        const mockCryptos = loadMockCryptos();
        crypto = mockCryptos.find(c => 
          c._id === cryptoId || 
          c.symbol.toLowerCase() === cryptoId.toLowerCase() ||
          c.name.toLowerCase() === cryptoId.toLowerCase()
        );
      }
    }
    
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
    
    // Create investment - handle mock data scenarios
    let investment;
    
    if (dbEmpty || !crypto._id || typeof crypto._id === 'string') {
      // For mock data or string IDs, create a simulated investment record
      // Store crypto info directly instead of trying to reference non-existent DB record
      investment = {
        _id: Date.now().toString(), // Simple ID for mock
        user: req.user.id,
        crypto: {
          _id: crypto._id,
          name: crypto.name,
          symbol: crypto.symbol,
          currentPrice: crypto.currentPrice,
          image: crypto.image
        },
        amount,
        quantity,
        buyPrice: crypto.currentPrice,
        currentValue: amount,
        profitLoss: 0,
        profitLossPercentage: 0,
        status: 'active',
        createdAt: new Date()
      };
      
      // Store the mock investment
      storeMockInvestment(req.user.id, investment);
      console.log('📊 Created mock investment record (database empty/unavailable)');
    } else {
      // Normal database investment
      investment = new Investment({
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
    }
    
    // Create transaction record
    let transaction;
    
    if (dbEmpty) {
      // Mock transaction for empty database
      transaction = {
        _id: Date.now().toString() + '_tx',
        user: req.user.id,
        type: 'investment',
        amount,
        status: 'completed',
        description: `Investment in ${crypto.name} (${crypto.symbol})`,
        completedAt: Date.now(),
        createdAt: new Date()
      };
      // Store the mock transaction
      storeMockTransaction(req.user.id, transaction);
      console.log('📊 Created mock transaction record');
    } else {
      transaction = new Transaction({
        user: req.user.id,
        type: 'investment',
        amount,
        status: 'completed',
        description: `Investment in ${crypto.name} (${crypto.symbol})`,
        completedAt: Date.now()
      });
      
      await transaction.save();
    }
    
    // Update wallet
    wallet.balance -= amount;
    await wallet.save();
    
    res.json({
      success: true,
      investment,
      transaction
    });
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
    
    // Calculate current value
    const currentPrice = investment.crypto.currentPrice;
    const currentValue = investment.quantity * currentPrice;
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
    let investments = [];
    
    try {
      const investmentCount = await Investment.countDocuments();
      if (investmentCount === 0) {
        console.log('📊 No investments in database - using shared mock investments for portfolio');
        // Load crypto data for price calculations
        const cryptos = loadMockCryptos();
        investments = getMockInvestments(req.user.id, cryptos);
      } else {
        investments = await Investment.find({ 
          user: req.user.id,
          status: 'active'
        }).populate('crypto', 'name symbol currentPrice image');
      }
    } catch (dbError) {
      console.log('⚠️ Database unavailable - using shared mock investments for portfolio');
      // Load crypto data for price calculations
      const cryptos = loadMockCryptos();
      investments = getMockInvestments(req.user.id, cryptos);
    }
    
    let totalInvested = 0;
    let totalCurrentValue = 0;
    let totalProfitLoss = 0;
    
    // Update current values based on latest prices
    const updatedInvestments = await Promise.all(investments.map(async (investment) => {
      // Get current crypto price (for mock investments, use the stored crypto data)
      let currentPrice = investment.crypto.currentPrice;
      
      // For mock investments, try to get updated price from mock data
      if (!investment.save && investment.crypto._id) {
        const mockCryptos = loadMockCryptos();
        const updatedCrypto = mockCryptos.find(c => c._id === investment.crypto._id);
        if (updatedCrypto) {
          currentPrice = updatedCrypto.currentPrice;
          // Update the crypto data in the investment
          investment.crypto.currentPrice = currentPrice;
        }
      }
      
      const currentValue = investment.quantity * currentPrice;
      const profitLoss = currentValue - investment.amount;
      const profitLossPercentage = (profitLoss / investment.amount) * 100;
      
      // Apply admin adjustment if enabled
      let adjustedProfitLoss = profitLoss;
      let adjustedProfitLossPercentage = profitLossPercentage;
      
      if (investment.adminAdjustment && investment.adminAdjustment.enabled) {
        adjustedProfitLossPercentage = profitLossPercentage + investment.adminAdjustment.percentage;
        adjustedProfitLoss = (adjustedProfitLossPercentage / 100) * investment.amount;
      }
      
      // Update investment with latest values
      investment.currentValue = currentValue;
      investment.profitLoss = adjustedProfitLoss;
      investment.profitLossPercentage = adjustedProfitLossPercentage;
      
      // Save only if it's a real DB record
      if (investment.save) {
        await investment.save();
      }
      
      totalInvested += investment.amount;
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