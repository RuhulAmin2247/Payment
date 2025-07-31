#!/bin/bash

echo "🚀 Starting SSLCommerz Payment App..."
echo ""

# Check if backend is running
echo "1. Checking backend status..."
if curl -s http://10.5.231.46:3000/ > /dev/null; then
    echo "✅ Backend is running at http://10.5.231.46:3000"
else
    echo "❌ Backend is not running. Starting backend..."
    cd backend
    node server.js &
    cd ..
    sleep 3
fi

echo ""
echo "2. Starting frontend (Expo)..."
cd frontend
npm start
