@echo off
echo 🚀 Starting SSLCommerz Payment App...
echo.

echo 1. Detecting current IP address...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr "IPv4" ^| findstr "10\."') do (
    set "SERVER_IP=%%a"
    goto :found_ip
)
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr "IPv4" ^| findstr "192\.168\."') do (
    set "SERVER_IP=%%a"
    goto :found_ip
)
set "SERVER_IP= 127.0.0.1"

:found_ip
set "SERVER_IP=%SERVER_IP: =%"
echo Current IP: %SERVER_IP%

echo 2. Checking backend status...
curl -s http://%SERVER_IP%:3000/ >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Backend is running at http://%SERVER_IP%:3000
) else (
    echo ❌ Backend is not running. Please start it manually:
    echo    cd backend
    echo    node server.js
    echo.
    echo Press any key to continue anyway...
    pause >nul
)

echo.
echo 3. Starting frontend ^(Expo^)...
cd frontend
npm start
