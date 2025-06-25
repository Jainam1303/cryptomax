const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const WithdrawalRequest = require('../models/WithdrawalRequest');

// @route   GET api/wallet
// @desc    Get user wallet
// @access  Private
exports.getWallet = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ user: req.user.id });
    
    if (!wallet) {
      return res.status(404).json({ msg: 'Wallet not found' });
    }
    
    res.json(wallet);
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
    
    const wallet = await Wallet.findOne({ user: req.user.id });
    
    if (!wallet) {
      return res.status(404).json({ msg: 'Wallet not found' });
    }
    
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
    
    const wallet = await Wallet.findOne({ user: req.user.id });
    
    if (!wallet) {
      return res.status(404).json({ msg: 'Wallet not found' });
    }
    
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
    const transactions = await Transaction.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    
    res.json(transactions);
  } catch (err) {
    console.error('Get transactions error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};