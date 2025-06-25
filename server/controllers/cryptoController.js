const Crypto = require('../models/Crypto');

// @route   GET api/crypto
// @desc    Get all cryptocurrencies
// @access  Private
exports.getCryptos = async (req, res) => {
  try {
    const cryptos = await Crypto.find({ isActive: true })
      .select('-priceHistory -adminSettings')
      .sort({ marketCap: -1 });
    
    res.json(cryptos);
  } catch (err) {
    console.error('Get cryptos error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @route   GET api/crypto/:id
// @desc    Get cryptocurrency by ID
// @access  Private
exports.getCryptoById = async (req, res) => {
  try {
    const crypto = await Crypto.findById(req.params.id);
    
    if (!crypto) {
      return res.status(404).json({ msg: 'Cryptocurrency not found' });
    }
    
    res.json(crypto);
  } catch (err) {
    console.error('Get crypto by ID error:', err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Cryptocurrency not found' });
    }
    
    res.status(500).json({ msg: 'Server error' });
  }
};

// @route   GET api/crypto/:id/price-history
// @desc    Get cryptocurrency price history
// @access  Private
exports.getPriceHistory = async (req, res) => {
  try {
    const crypto = await Crypto.findById(req.params.id);
    
    if (!crypto) {
      return res.status(404).json({ msg: 'Cryptocurrency not found' });
    }
    
    // Get price history for the specified timeframe
    const { timeframe } = req.query;
    let priceHistory;
    
    switch (timeframe) {
      case '1d':
        // Last 24 hours (assuming hourly data points)
        priceHistory = crypto.priceHistory.slice(-24);
        break;
      case '7d':
        // Last 7 days (assuming hourly data points)
        priceHistory = crypto.priceHistory.slice(-168);
        break;
      case '30d':
        // Last 30 days (assuming hourly data points)
        priceHistory = crypto.priceHistory.slice(-720);
        break;
      case '1y':
        // Last year (assuming daily data points)
        priceHistory = crypto.priceHistory.filter((p, i) => i % 24 === 0).slice(-365);
        break;
      default:
        // Default to last 24 hours
        priceHistory = crypto.priceHistory.slice(-24);
    }
    
    res.json(priceHistory);
  } catch (err) {
    console.error('Get price history error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @route   GET api/crypto/market-data
// @desc    Get market overview data
// @access  Private
exports.getMarketData = async (req, res) => {
  try {
    const cryptos = await Crypto.find({ isActive: true })
      .select('name symbol currentPrice priceChangePercentage24h marketCap volume24h')
      .sort({ marketCap: -1 })
      .limit(10);
    
    // Calculate total market cap and 24h volume
    const totalMarketCap = cryptos.reduce((sum, crypto) => sum + crypto.marketCap, 0);
    const total24hVolume = cryptos.reduce((sum, crypto) => sum + crypto.volume24h, 0);
    
    // Calculate market dominance for top cryptocurrencies
    const marketDominance = cryptos.map(crypto => ({
      name: crypto.name,
      symbol: crypto.symbol,
      dominance: (crypto.marketCap / totalMarketCap) * 100
    }));
    
    res.json({
      topCryptos: cryptos,
      marketOverview: {
        totalMarketCap,
        total24hVolume,
        marketDominance
      }
    });
  } catch (err) {
    console.error('Get market data error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};