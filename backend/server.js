// Simple SSLCommerz Payment Server
const express = require('express');
const cors = require('cors');
const SSLCommerzPayment = require('sslcommerz-lts');
const os = require('os');

const app = express();
const PORT = 3000;

// SSLCommerz sandbox credentials
const STORE_ID = 'ruhul688512ffac678';
const STORE_PASSWORD = 'ruhul688512ffac678@ssl';
const IS_LIVE = false; // sandbox mode

// Get server IP address automatically
function getServerIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'localhost';
}

const SERVER_IP = getServerIP();

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'SSLCommerz Payment Server Running!', 
    serverIP: SERVER_IP,
    port: PORT
  });
});

// Payment initialization endpoint
app.post('/init', async (req, res) => {
  try {
    const { amount, name, email, phone } = req.body;

    // Validate required fields
    if (!amount || !name || !email || !phone) {
      return res.status(400).json({ 
        error: 'Missing required fields: amount, name, email, phone' 
      });
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Generate unique transaction ID
    const transactionId = 'TRAN_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);

    // Payment data for SSLCommerz
    const paymentData = {
      total_amount: parseFloat(amount),
      currency: 'BDT',
      tran_id: transactionId,
      success_url: `http://${SERVER_IP}:${PORT}/payment/success`,
      fail_url: `http://${SERVER_IP}:${PORT}/payment/fail`,
      cancel_url: `http://${SERVER_IP}:${PORT}/payment/cancel`,
      ipn_url: `http://${SERVER_IP}:${PORT}/payment/ipn`,
      shipping_method: 'No',
      product_name: 'Demo Product',
      product_category: 'Demo',
      product_profile: 'general',
      cus_name: name,
      cus_email: email,
      cus_add1: 'Dhaka',
      cus_city: 'Dhaka',
      cus_state: 'Dhaka',
      cus_postcode: '1000',
      cus_country: 'Bangladesh',
      cus_phone: phone,
      ship_name: name,
      ship_add1: 'Dhaka',
      ship_city: 'Dhaka',
      ship_state: 'Dhaka',
      ship_postcode: '1000',
      ship_country: 'Bangladesh',
    };

    // Initialize payment with SSLCommerz
    const sslcz = new SSLCommerzPayment(STORE_ID, STORE_PASSWORD, IS_LIVE);
    const apiResponse = await sslcz.init(paymentData);

    if (apiResponse?.GatewayPageURL) {
      res.json({ 
        success: true,
        paymentUrl: apiResponse.GatewayPageURL,
        transactionId: transactionId 
      });
    } else {
      res.status(400).json({ 
        error: 'Payment gateway URL not found' 
      });
    }
  } catch (error) {
    console.error('Payment initialization error:', error);
    res.status(500).json({ 
      error: 'Payment initialization failed',
      message: error.message
    });
  }
});

// Payment callback handlers
app.post('/payment/success', (req, res) => {
  console.log('✅ Payment Success:', req.body);
  res.redirect('myapp://payment/success?' + new URLSearchParams(req.body).toString());
});

app.post('/payment/fail', (req, res) => {
  console.log('❌ Payment Failed:', req.body);
  res.redirect('myapp://payment/fail?' + new URLSearchParams(req.body).toString());
});

app.post('/payment/cancel', (req, res) => {
  console.log('🚫 Payment Cancelled:', req.body);
  res.redirect('myapp://payment/cancel?' + new URLSearchParams(req.body).toString());
});

app.post('/payment/ipn', (req, res) => {
  console.log('📋 Payment IPN:', req.body);
  res.status(200).send('OK');
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log('\n🚀 SSLCommerz Payment Server Started!');
  console.log(`   Local:   http://localhost:${PORT}`);
  console.log(`   Network: http://${SERVER_IP}:${PORT}`);
  console.log('\n💡 Use the Network URL in your React Native app\n');
});
