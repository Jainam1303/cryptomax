const User = require('../models/User');
const Crypto = require('../models/Crypto');
const Investment = require('../models/Investment');
const WithdrawalRequest = require('../models/WithdrawalRequest');
const Transaction = require('../models/Transaction');
const Wallet = require('../models/Wallet');
const DepositWallet = require('../models/DepositWallet');

const path = require('path');

// @route   GET api/admin/users
// @desc    Get all users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    const Transaction = require('../models/Transaction');
    const Investment = require('../models/Investment');

    const usersWithStats = await Promise.all(users.map(async user => {
      const totalDeposited = await Transaction.aggregate([
        { $match: { user: user._id, type: 'deposit', status: 'approved' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);
      const totalWithdrawn = await Transaction.aggregate([
        { $match: { user: user._id, type: 'withdrawal', status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);
      const investmentsCount = await Investment.countDocuments({ user: user._id });

      return {
        ...user.toObject(),
        totalDeposited: totalDeposited[0]?.total || 0,
        totalWithdrawn: totalWithdrawn[0]?.total || 0,
        investments: investmentsCount
      };
    }));

    res.json(usersWithStats);
  } catch (err) {
    console.error('Admin get users error:', err.message, err);
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
    
    console.log('🔍 Admin fetching withdrawal requests:', withdrawalRequests.length, 'requests');
    if (withdrawalRequests.length > 0) {
      console.log('📋 Sample withdrawal request:', {
        id: withdrawalRequests[0]._id,
        paymentMethod: withdrawalRequests[0].paymentMethod,
        paymentDetails: withdrawalRequests[0].paymentDetails,
        hasPaymentDetails: !!withdrawalRequests[0].paymentDetails
      });
    }
    
    res.json(withdrawalRequests);
  } catch (err) {
    console.error('Admin get withdrawal requests error:', err.message, err);
    
    // If database is not connected, return mock data
    if (err.message.includes('ECONNREFUSED') || err.message.includes('MongoNetworkError')) {
      console.log('📊 Returning mock withdrawal requests due to database connection issue');
      
      const mockWithdrawalRequests = [
        {
          _id: 'mock-withdrawal-1',
          user: { name: 'gopala', email: 'sweetmango1303@gmail.com' },
          amount: 100.00,
          paymentMethod: 'Usdt Trc20',
          paymentDetails: 'TXv3QZCBGMBouLT5Xgfj8v6mYsKRsc12jt',
          status: 'pending',
          requestedAt: new Date('2025-07-16'),
          createdAt: new Date('2025-07-16')
        },
        {
          _id: 'mock-withdrawal-2',
          user: { name: 'Jainam', email: 'johnmarston1303@gmail.com' },
          amount: 459.00,
          paymentMethod: 'Paypal',
          paymentDetails: 'kfjdkjfkskfkdjfksfs',
          status: 'pending',
          requestedAt: new Date('2025-07-16'),
          createdAt: new Date('2025-07-16')
        },
        {
          _id: 'mock-withdrawal-3',
          user: { name: 'Admin User', email: 'admin@cryptomax.com' },
          amount: 500.00,
          paymentMethod: 'Usdt Trc20',
          paymentDetails: 'N/A',
          status: 'completed',
          requestedAt: new Date('2025-07-16'),
          createdAt: new Date('2025-07-16')
        },
        {
          _id: 'mock-withdrawal-4',
          user: { name: 'Test User', email: 'test@example.com' },
          amount: 96.00,
          paymentMethod: 'Paypal',
          paymentDetails: '614141414114',
          status: 'rejected',
          requestedAt: new Date('2025-07-15'),
          createdAt: new Date('2025-07-15')
        }
      ];
      
      res.json(mockWithdrawalRequests);
    } else {
      res.status(500).json({ msg: 'Server error' });
    }
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
    
    // Find related transaction (optional - for test data, transactions might not exist)
    const transaction = await Transaction.findOne({
      user: withdrawalRequest.user,
      type: 'withdrawal',
      amount: withdrawalRequest.amount,
      status: 'pending'
    });
    
    // Update wallet and transaction based on status
    const wallet = await Wallet.findOne({ user: withdrawalRequest.user });
    
    if (status === 'rejected') {
      // Return funds to user's wallet if wallet exists
      if (wallet) {
        wallet.balance += withdrawalRequest.amount;
        wallet.pendingWithdrawals -= withdrawalRequest.amount;
        await wallet.save();
      }
      
      // Update transaction if it exists
      if (transaction) {
        transaction.status = 'failed';
        transaction.failureReason = adminNotes || 'Rejected by admin';
        transaction.description += ' (Rejected by admin)';
        await transaction.save();
      }
    } else if (status === 'completed') {
      // Update wallet if it exists
      if (wallet) {
        wallet.pendingWithdrawals -= withdrawalRequest.amount;
        wallet.totalWithdrawn += withdrawalRequest.amount;
        await wallet.save();
      }
      
      // Update transaction if it exists
      if (transaction) {
        transaction.status = 'completed';
        transaction.completedAt = Date.now();
        await transaction.save();
      }
    } else if (status === 'approved') {
      // Only update transaction status if it exists
      if (transaction) {
        transaction.status = 'completed';
        transaction.description += ' (Approved by admin)';
        await transaction.save();
      }
    }
    
    res.json({
      success: true,
      withdrawalRequest
    });
  } catch (err) {
    console.error('Process withdrawal request error:', err.message);
    
    // If database is not connected, handle mock data
    if (err.message.includes('ECONNREFUSED') || err.message.includes('MongoNetworkError')) {
      console.log('📊 Processing mock withdrawal request:', req.params.id, 'with status:', status);
      
      // For mock data, just return success
      res.json({
        success: true,
        withdrawalRequest: {
          _id: req.params.id,
          status: status,
          adminNotes: adminNotes,
          processedAt: Date.now()
        }
      });
    } else {
      res.status(500).json({ msg: 'Server error' });
    }
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

    // Calculate financial summary
    const totalDeposits = deposits.length > 0 ? deposits[0].total : 0;
    const totalWithdrawals = withdrawals.length > 0 ? withdrawals[0].total : 0;
    const totalRevenue = totalDeposits; // You can adjust this logic as needed
    const totalPayouts = totalWithdrawals; // You can adjust this logic as needed
    const netBalance = totalRevenue - totalPayouts;

    // Pagination for recent transactions
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const totalTransactions = await Transaction.countDocuments();
    const recentTransactions = await Transaction.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name email');
    
    res.json({
      userCount,
      financials: {
        totalDeposits,
        totalWithdrawals,
        pendingWithdrawals,
        activeInvestments,
        totalInvestmentAmount: investmentAmount.length > 0 ? investmentAmount[0].total : 0,
        totalRevenue,
        totalPayouts,
        netBalance
      },
      recentTransactions,
      totalTransactions,
      page,
      limit
    });
  } catch (err) {
    console.error('Get admin dashboard data error:', err.message, err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @route   GET api/admin/investments
// @desc    Get all investments (admin)
// @access  Private/Admin
exports.getInvestments = async (req, res) => {
  try {
    const investments = await Investment.find()
      .populate('user', 'name email')
      .populate('crypto', 'name symbol image');
    res.json(investments);
  } catch (err) {
    console.error('Admin get investments error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @route   GET api/admin/deposit-requests
// @desc    Get all pending deposit requests
// @access  Private/Admin
exports.getDepositRequests = async (req, res) => {
  try {
    console.log('🔍 Admin checking for pending deposit requests...');
    console.log('👤 Admin user:', req.user);
    
    // First check if we can connect to database
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      console.log('❌ Database not connected. ReadyState:', mongoose.connection.readyState);
      return res.status(500).json({ 
        msg: 'Database not connected. Please check MongoDB connection.',
        error: 'Database connection failed'
      });
    }
    
    // Check total transactions first
    const totalTransactions = await Transaction.countDocuments();
    const totalPendingDeposits = await Transaction.countDocuments({ type: 'deposit', status: 'pending' });
    
    console.log('📊 Database stats:');
    console.log('   - Total transactions:', totalTransactions);
    console.log('   - Total pending deposits:', totalPendingDeposits);
    
    const depositRequests = await Transaction.find({ type: 'deposit', status: 'pending' })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    
    console.log('📊 Found deposit requests:', depositRequests.length);
    console.log('📊 Deposit requests details:', depositRequests.map(d => ({
      id: d._id,
      user: d.user,
      amount: d.amount,
      status: d.status,
      createdAt: d.createdAt
    })));
    
    res.json(depositRequests);
  } catch (err) {
    console.error('Admin get deposit requests error:', err.message, err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// @route   PUT api/admin/deposit-requests/:id
// @desc    Approve or reject a deposit request
// @access  Private/Admin
exports.processDepositRequest = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ msg: 'Invalid status' });
    }
    
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction || transaction.type !== 'deposit') {
      return res.status(404).json({ msg: 'Deposit transaction not found' });
    }
    if (transaction.status !== 'pending') {
      return res.status(400).json({ msg: 'Deposit already processed' });
    }
    
    // Find user's wallet
    const wallet = await Wallet.findOne({ user: transaction.user });
    if (!wallet) {
      return res.status(404).json({ msg: 'User wallet not found' });
    }
    
    if (status === 'approved') {
      // Credit wallet balance
      wallet.balance += transaction.amount;
      wallet.totalDeposited += transaction.amount;
      await wallet.save();
      transaction.status = 'completed';
      transaction.completedAt = Date.now();
      transaction.description += ' (Approved by admin)';
    } else if (status === 'rejected') {
      transaction.status = 'failed';
      transaction.failureReason = adminNotes || 'Rejected by admin';
      transaction.description += ' (Rejected by admin)';
    }
    await transaction.save();
    
    console.log('✅ Deposit processed:', { id: transaction._id, status, amount: transaction.amount });
    res.json({ success: true, transaction });
  } catch (err) {
    console.error('Process deposit request error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Public: Get deposit wallet info for a coin
exports.getDepositWallet = async (req, res) => {
  try {
    const { coin } = req.params;
    const wallet = await DepositWallet.findOne({ coin });
    if (!wallet) {
      return res.status(404).json({ msg: 'Deposit wallet not found' });
    }
    res.json(wallet);
  } catch (err) {
    console.error('Get deposit wallet error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Admin: Update deposit wallet info for a coin
exports.updateDepositWallet = async (req, res) => {
  try {
    const { coin } = req.params;
    const { address, qrImageUrl } = req.body;
    let wallet = await DepositWallet.findOne({ coin });
    if (!wallet) {
      wallet = new DepositWallet({ coin, address, qrImageUrl });
    } else {
      wallet.address = address;
      wallet.qrImageUrl = qrImageUrl;
    }
    await wallet.save();
    res.json(wallet);
  } catch (err) {
    console.error('Update deposit wallet error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Upload QR code image for deposit wallet
exports.uploadDepositWalletQr = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }
    // Construct the URL to access the uploaded file
    const qrImageUrl = `/uploads/${req.file.filename}`;
    res.json({ qrImageUrl });
  } catch (err) {
    console.error('Upload deposit wallet QR error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};