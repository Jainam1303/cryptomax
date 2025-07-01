const mongoose = require('mongoose');

const connectDB = async () => {
  // Check if we're in mock mode
  if (process.env.MOCK_MODE === 'true') {
    console.log('🧪 Running in MOCK MODE - No database connection needed');
    console.log('📊 Using sample cryptocurrency data');
    return;
  }

  try {
    // Try to connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s
    });

    console.log('✅ MongoDB Connected...');
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected. App will continue with mock data.');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected.');
    });

  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('⚠️ App will continue without database (using mock data).');
    // Don't exit the process - let the app continue with mock data
  }
};

module.exports = connectDB;
