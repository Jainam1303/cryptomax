const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const routes = require('./routes');
const config = require('config');

// Initialize Express
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json({ extended: false }));
app.use(cors());

// Routes
app.use('/', routes);

// Error handler middleware (must be after routes)
app.use(errorHandler);

// Define port
const PORT = process.env.PORT || config.get('port') || 5000;

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));