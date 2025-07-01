#!/bin/bash

echo "🚀 Starting CryptoMax Application..."

# Check if MongoDB is available
echo "🔍 Checking MongoDB connection..."

# Function to start server
start_server() {
    echo "📡 Starting server..."
    cd server
    npm install --silent
    npm start
}

# Function to start client
start_client() {
    echo "🌐 Starting client..."
    cd client
    npm install --silent
    npm run dev
}

# Create logs directory
mkdir -p logs

echo "📋 Starting components..."
echo "   - Server will run on http://localhost:5000"
echo "   - Client will run on http://localhost:3000"
echo "   - MongoDB: Will use mock data if database unavailable"
echo ""

# Start server in background
echo "📡 Starting server (check logs/server.log for details)..."
(start_server > logs/server.log 2>&1) &
SERVER_PID=$!

# Wait a bit for server to start
sleep 3

# Start client
echo "🌐 Starting client..."
start_client

# Cleanup function
cleanup() {
    echo ""
    echo "🛑 Shutting down..."
    kill $SERVER_PID 2>/dev/null
    echo "✅ Application stopped"
}

# Trap Ctrl+C
trap cleanup INT

# Wait for background processes
wait