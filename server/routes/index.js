const express = require('express');
const router = express.Router();

// API Routes
router.use('/api/auth', require('./api/auth'));
router.use('/api/wallet', require('./api/wallet'));
router.use('/api/investments', require('./api/investments'));
router.use('/api/crypto', require('./api/crypto'));
router.use('/api/admin', require('./api/admin'));

module.exports = router;