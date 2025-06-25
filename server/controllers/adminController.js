const User = require('../models/User');
const Crypto = require('../models/Crypto');
const Investment = require('../models/Investment');
const WithdrawalRequest = require('../models/WithdrawalRequest');
const Transaction = require('../models/Transaction');
const Wallet = require('../models/Wallet');

// @route   GET api/admin/users
// @desc    Get all users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error('Admin get users error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @route   GET api/admin/withdrawal-requests
// @desc    Get all withdrawal requests
// @access  Private/Admin
exports.getWithdrawalRequests = async (req, res) => {
  try {
    const withdrawalRequests = await WithdrawalRequest.find()
      .populate('user', 'name email')
      .sort({ requestedAt: -1 });
    
    res.json(withdrawalRequests);
  } catch (err) {
    console.error('Admin get withdrawal requests error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @route   PUT api/admin/withdrawal-requests/:id
// @desc    Process withdrawal request
// @access  Private/Admin
exports.processWithdrawalRequest = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    
    if (!['approved', 'rejected', 'completed'].includes(status)) {
      return res.status(400).json({ msg: 'Invalid status' });
    }
    
    const withdrawalRequest = await WithdrawalRequest.findById(req.params.id);
    
    if (!withdrawalRequest) {
      return res.status(404).json({ msg: 'Withdrawal request not found' });
    }
    
    if (withdrawalRequest.status !== 'pending' && status !== 'completed') {
      return res.status(400).json({ msg: 'Request already processed' });
    }
    
    if (withdrawalRequest.status !== 'approved' && status === 'completed') {
      return res.status(400).json({ msg: 'Request must be approved before completion' });
    }
    
    // Update withdrawal request
    withdrawalRequest.status = status;
    withdrawalRequest.adminNotes = adminNotes || withdrawalRequest.adminNotes;
    withdrawalRequest.processedAt = Date.now();
    withdrawalRequest.processedBy = req.user.id;
    
    await withdrawalRequest.save();
    
    // Find related transaction
    const transaction = await Transaction.findOne({
      user: withdrawalRequest.user,
      type: 'withdrawal',
      amount: withdrawalRequest.amount,
      status: 'pending'
    });
    
    if (!transaction) {
      return res.status(404).json({ msg: 'Related transaction not found' });
    }
    
    // Update wallet and transaction based on status
    const wallet = await Wallet.findOne({ user: withdrawalRequest.user });
    
    if (status === 'rejected') {
      // Return funds to user's wallet
      wallet.balance += withdrawalRequest.amount;
      wallet.pendingWithdrawals -= withdrawalRequest.amount;
      await wallet.save();
      
      // Update transaction
      transaction.status = 'cancelled';
      transaction.description += ' (Rejected by admin)';
      await transaction.save();
    } else if (status === 'completed') {
      // Update wallet
      wallet.pendingWithdrawals -= withdrawalRequest.amount;
      wallet.totalWithdrawn += withdrawalRequest.amount;
      await wallet.save();
      
      // Update transaction
      transaction.status = 'completed';
      transaction.completedAt = Date.now();
      await transaction.save();
    } else if (status === 'approved') {
      // Only update transaction status
      transaction.description += ' (Approved by admin)';
      await transaction.save();
    }
    
    res.json({
      success: true,
      withdrawalRequest
    });
  } catch (err) {
    console.error('Process withdrawal request error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @route   PUT api/admin/crypto/:id
// @desc    Update cryptocurrency settings
// @access  Private/Admin
exports.updateCryptoSettings = async (req, res) => {
  try {
    const { volatility, trend } = req.body;
    
    const crypto = await Crypto.findById(req.params.id);
    
    if (!crypto) {
      return res.status(404).json({ msg: 'Cryptocurrency not found' });
    }
    
    // Update admin settings
    crypto.adminSettings.volatility = volatility || crypto.adminSettings.volatility;
    crypto.adminSettings.trend = trend || crypto.adminSettings.trend;
    crypto.adminSettings.lastUpdated = Date.now();
    
    await crypto.save();
    
    res.json({
      success: true,
      crypto
    });
  } catch (err) {
    console.error('Update crypto settings error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @route   PUT api/admin/investments/:id/adjust
// @desc    Adjust investment profit/loss display
// @access  Private/Admin
exports.adjustInvestment = async (req, res) => {
  try {
    const { enabled, percentage } = req.body;
    
    const investment = await Investment.findById(req.params.id);
    
    if (!investment) {
      return res.status(404).json({ msg: 'Investment not found' });
    }
    
    // Update admin adjustment
    investment.adminAdjustment.enabled = enabled !== undefined ? enabled : investment.adminAdjustment.enabled;
    investment.adminAdjustment.percentage = percentage !== undefined ? percentage : investment.adminAdjustment.percentage;
    investment.adminAdjustment.lastUpdated = Date.now();
    
    await investment.save();
    
    // Recalculate profit/loss if adjustment is enabled
    if (investment.adminAdjustment.enabled) {
      const crypto = await Crypto.findById(investment.crypto);
      const currentValue = investment.quantity * crypto.currentPrice;
      const baseProfitLoss = currentValue - investment.amount;
      const baseProfitLossPercentage = (baseProfitLoss / investment.amount) * 100;
      
      // Apply adjustment
      const adjustedProfitLossPercentage = baseProfitLossPercentage + investment.adminAdjustment.percentage;
      const adjustedProfitLoss = (adjustedProfitLossPercentage / 100) * investment.amount;
      
      investment.currentValue = currentValue;
      investment.profitLoss = adjustedProfitLoss;
      investment.profitLossPercentage = adjustedProfitLossPercentage;
      
      await investment.save();
    }
    
    res.json({
      success: true,
      investment
    });
  } catch (err) {
    console.error('Adjust investment error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @route   GET api/admin/dashboard
// @desc    Get admin dashboard data
// @access  Private/Admin
exports.getDashboardData = async (req, res) => {
  try {
    // Get user count
    const userCount = await User.countDocuments();
    
    // Get total deposits
    const deposits = await Transaction.aggregate([
      { $match: { type: 'deposit', status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    // Get total withdrawals
    const withdrawals = await Transaction.aggregate([
      { $match: { type: 'withdrawal', status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    // Get pending withdrawal requests
    const pendingWithdrawals = await WithdrawalRequest.countDocuments({ status: 'pending' });
    
    // Get active investments
    const activeInvestments = await Investment.countDocuments({ status: 'active' });
    
    // Get total investment amount
    const investmentAmount = await Investment.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    // Get recent transactions
    const recentTransactions = await Transaction.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'name email');
    
    res.json({
      userCount,
      financials: {
        totalDeposits: deposits.length > 0 ? deposits[0].total : 0,
        totalWithdrawals: withdrawals.length > 0 ? withdrawals[0].total : 0,
        pendingWithdrawals,
        activeInvestments,
        totalInvestmentAmount: investmentAmount.length > 0 ? investmentAmount[0].total : 0
      },
      recentTransactions
    });
  } catch (err) {
    console.error('Get admin dashboard data error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};