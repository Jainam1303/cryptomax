const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const WithdrawalRequest = require('../models/WithdrawalRequest');
const { getMockTransactions } = require('../utils/mockDataManager');

// @route   GET api/wallet
// @desc    Get user wallet
// @access  Private
exports.getWallet = async (req, res) => {
  try {
    // Wallet is ensured by middleware and attached to req.wallet
    res.json(req.wallet);
  } catch (err) {
    console.error('Get wallet error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @route   POST api/wallet/deposit
// @desc    Deposit funds to wallet
// @access  Private
exports.deposit = async (req, res) => {
  try {
    const { amount, paymentMethod } = req.body;
    
    if (amount <= 0) {
      return res.status(400).json({ msg: 'Amount must be greater than 0' });
    }
    
    // Use wallet from middleware
    const wallet = req.wallet;
    
    // In a real app, you would integrate with a payment processor here
    // For this demo, we'll simulate an instant deposit
    
    // Create transaction record
    const transaction = new Transaction({
      user: req.user.id,
      type: 'deposit',
      amount,
      status: 'completed',
      description: `Deposit via ${paymentMethod}`,
      completedAt: Date.now()
    });
    
    await transaction.save();
    
    // Update wallet
    wallet.balance += amount;
    wallet.totalDeposited += amount;
    await wallet.save();
    
    res.json({
      success: true,
      wallet,
      transaction
    });
  } catch (err) {
    console.error('Deposit error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @route   POST api/wallet/withdraw
// @desc    Request withdrawal
// @access  Private
exports.requestWithdrawal = async (req, res) => {
  try {
    const { amount, paymentMethod, paymentDetails } = req.body;
    
    if (amount <= 0) {
      return res.status(400).json({ msg: 'Amount must be greater than 0' });
    }
    
    // Use wallet from middleware
    const wallet = req.wallet;
    
    if (wallet.balance < amount) {
      return res.status(400).json({ msg: 'Insufficient funds' });
    }
    
    // Create withdrawal request
    const withdrawalRequest = new WithdrawalRequest({
      user: req.user.id,
      amount,
      paymentMethod,
      paymentDetails
    });
    
    await withdrawalRequest.save();
    
    // Create transaction record (pending)
    const transaction = new Transaction({
      user: req.user.id,
      type: 'withdrawal',
      amount,
      status: 'pending',
      description: `Withdrawal request via ${paymentMethod}`
    });
    
    await transaction.save();
    
    // Update wallet (hold the funds)
    wallet.pendingWithdrawals += amount;
    wallet.balance -= amount;
    await wallet.save();
    
    res.json({
      success: true,
      withdrawalRequest,
      transaction
    });
  } catch (err) {
    console.error('Withdrawal request error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @route   GET api/wallet/transactions
// @desc    Get user transactions
// @access  Private
exports.getTransactions = async (req, res) => {
  try {
    // Only use mock data if USE_MOCK_INVESTMENTS env variable is true
    if (process.env.USE_MOCK_INVESTMENTS === 'true') {
      const transactions = getMockTransactions(req.user.id);
      return res.json(transactions);
    }
    // Always fetch from database
    const transactions = await Transaction.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    // Remove debug logging code
    res.json(transactions);
  } catch (err) {
    console.error('Get transactions error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};