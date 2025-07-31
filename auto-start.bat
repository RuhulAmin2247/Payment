@echo off
echo 🔧 Auto-fixing IP addresses for SSLCommerz Payment App...
echo.

REM Get current IP address
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr "IPv4" ^| findstr "10\."') do (
    set "NEW_IP=%%a"
    goto :found_ip
)
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr "IPv4" ^| findstr "192\.168\."') do (
    set "NEW_IP=%%a"
    goto :found_ip
)
set "NEW_IP= 127.0.0.1"

:found_ip
set "NEW_IP=%NEW_IP: =%"
echo Current IP detected: %NEW_IP%

REM Update App.js with new IP
echo Updating frontend/App.js with new IP...
powershell -Command "(Get-Content 'frontend\App.js') -replace 'http://[\d\.]+:3000', 'http://%NEW_IP%:3000' | Set-Content 'frontend\App.js'"

echo ✅ Updated frontend/App.js with IP: %NEW_IP%
echo.

REM Start backend if not running
echo Checking if backend is running...
curl -s http://%NEW_IP%:3000/ >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Backend is already running at http://%NEW_IP%:3000
) else (
    echo 🚀 Starting backend server...
    start "Backend Server" cmd /k "cd backend && node server.js"
    timeout /t 3 >nul
)

echo.
echo 🚀 Starting frontend (Expo)...
cd frontend
npm start
