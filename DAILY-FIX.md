# 🔧 Daily IP Fix Guide

## Problem: IP Address Changed
When you restart your computer or reconnect to WiFi, your IP address changes and the app stops working.

## Quick Fix (2 minutes):

### Method 1: Use Auto-Start (Recommended)
```bash
# Just double-click this file:
auto-start.bat
```
This automatically:
- Detects your current IP
- Updates App.js 
- Starts backend and frontend

### Method 2: Manual Fix
1. **Find your current IP:**
   ```cmd
   ipconfig | findstr "IPv4"
   ```
   Look for something like: `10.5.228.169`

2. **Update App.js:**
   Open `frontend/App.js` and change line 11:
   ```javascript
   const SERVER_URL = 'http://YOUR_NEW_IP:3000';
   ```

3. **Start backend:**
   ```cmd
   cd backend
   node server.js
   ```

4. **Start frontend:**
   ```cmd
   cd frontend
   npm start
   ```

## Current Status:
- ✅ Backend IP: `10.5.228.169:3000`
- ✅ Frontend updated
- ✅ Ready to run!

## Quick Test:
```cmd
curl http://10.5.228.169:3000/
```
Should return: `{"message":"SSLCommerz Backend is running!"...}`
