const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const admin = require('../../middleware/admin');
const adminController = require('../../controllers/adminController');

// All routes in this file require both auth and admin middleware
router.use(auth);
router.use(admin);

// @route   GET api/admin/users
// @desc    Get all users
// @access  Private/Admin
router.get('/users', adminController.getUsers);

// @route   GET api/admin/withdrawal-requests
// @desc    Get all withdrawal requests
// @access  Private/Admin
router.get('/withdrawal-requests', adminController.getWithdrawalRequests);

// @route   PUT api/admin/withdrawal-requests/:id
// @desc    Process withdrawal request
// @access  Private/Admin
router.put('/withdrawal-requests/:id', adminController.processWithdrawalRequest);

// @route   PUT api/admin/crypto/:id
// @desc    Update cryptocurrency settings
// @access  Private/Admin
router.put('/crypto/:id', adminController.updateCryptoSettings);

// @route   PUT api/admin/investments/:id/adjust
// @desc    Adjust investment profit/loss display
// @access  Private/Admin
router.put('/investments/:id/adjust', adminController.adjustInvestment);

// @route   GET api/admin/dashboard
// @desc    Get admin dashboard data
// @access  Private/Admin
router.get('/dashboard', adminController.getDashboardData);

module.exports = router;