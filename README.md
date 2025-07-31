# SSLCommerz React Native Payment Integration Setup

## Prerequisites
- Node.js installed on your system
- React Native development environment setup
- Android Studio / Xcode for mobile development

## Setup Instructions

### 1. Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the backend server:
```bash
npm start
```

4. Note the Network IP address shown in the console (e.g., `http://192.168.1.100:3000`)

### 2. Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Update the SERVER_URL in `App.js`:
   - Open `frontend/App.js`
   - Replace `http://192.168.1.100:3000` with your actual backend IP address from step 1.4

4. Ensure you have these dependencies in your package.json:
```json
{
  "@react-navigation/native": "^6.x.x",
  "@react-navigation/native-stack": "^6.x.x",
  "react-native-webview": "^13.x.x",
  "react-native-screens": "^3.x.x",
  "react-native-safe-area-context": "^4.x.x"
}
```

5. For React Native CLI projects, install iOS pods (if using iOS):
```bash
cd ios && pod install && cd ..
```

### 3. Running the Application

1. Make sure the backend server is running
2. Start the React Native application:

For Android:
```bash
npx react-native run-android
```

For iOS:
```bash
npx react-native run-ios
```

## Important Notes

### For Expo Projects:
If you're using Expo, you'll need to eject or use Expo Dev Build because `react-native-webview` requires native code.

### Network Configuration:
- Ensure your mobile device/emulator and backend server are on the same network
- For Android emulator, you might need to use `10.0.2.2` instead of `localhost`
- For iOS simulator, `localhost` should work

### SSLCommerz Credentials:
- The current credentials are for sandbox testing
- Replace with your actual SSLCommerz credentials for production
- Update `is_live` to `true` in `server.js` for production

### Testing:
1. Check server connectivity using the "Check Server Status" button
2. Test payment with the sandbox credentials
3. Monitor console logs for debugging

## Troubleshooting

### Common Issues:

1. **Server not reachable**: 
   - Verify the IP address in App.js matches your backend server
   - Check if Windows Firewall is blocking the port
   - Ensure both devices are on the same network

2. **Payment gateway not loading**:
   - Check internet connectivity
   - Verify SSLCommerz credentials
   - Check console logs for API errors

3. **WebView not working**:
   - Ensure react-native-webview is properly installed
   - For Android, check if cleartext traffic is allowed

### Debug Commands:

Test backend connectivity:
```bash
curl http://YOUR_IP:3000/
```

Check network interfaces:
```bash
ipconfig  # Windows
ifconfig  # macOS/Linux
```

## File Structure
```
├── backend/
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── App.js
│   └── package.json
└── README.md
```
