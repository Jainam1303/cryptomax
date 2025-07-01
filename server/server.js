require('dotenv').config(); // 👈 Load .env first

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const routes = require('./routes');
const authRoutes = require('./routes/api/auth'); 

// Initialize Express
const app = express();

// Connect to MongoDB
connectDB(); // 👈 uses process.env.MONGO_URI

// Middleware
app.use(express.json({ extended: false }));
app.use(cors());

// Routes
app.use('/', routes);

// Error handler middleware (must be after routes)
app.use(errorHandler);

// Define port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

