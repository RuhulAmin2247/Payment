// server.js
const express = require('express');
const cors = require('cors');
const SSLCommerzPayment = require('sslcommerz-lts');

const app = express();
const port = 3000;

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for development
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Your SSLCOMMERZ sandbox credentials
const store_id = 'ruhul688512ffac678';
const store_passwd = 'ruhul688512ffac678@ssl';
const is_live = false; // false for sandbox, true for live

// Get server IP address
const os = require('os');
const networkInterfaces = os.networkInterfaces();
let serverIP = 'localhost';

for (const name of Object.keys(networkInterfaces)) {
  for (const net of networkInterfaces[name]) {
    if (net.family === 'IPv4' && !net.internal) {
      serverIP = net.address;
      break;
    }
  }
  
}

app.get('/', (req, res) => {
  res.json({ 
    message: 'SSLCommerz Backend is running!', 
    serverIP: serverIP,
    port: port 
  });
});


app.post('/init', async (req, res) => {
  try {
    console.log('Received payment init request:', req.body);

    const { amount, name, email, phone } = req.body;

    // Enhanced validation
    if (!amount || !name || !email || !phone) {
      console.log('Missing required fields:', { amount, name, email, phone });
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['amount', 'name', 'email', 'phone'],
        received: { amount, name, email, phone }
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate amount
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Amount must be a positive number' });
    }

    const transactionId = 'TRAN_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);

    const data = {
      total_amount: parseFloat(amount),
      currency: 'BDT',
      tran_id: transactionId,
      success_url: `http://${serverIP}:${port}/payment/success`,
      fail_url: `http://${serverIP}:${port}/payment/fail`,
      cancel_url: `http://${serverIP}:${port}/payment/cancel`,
      ipn_url: `http://${serverIP}:${port}/payment/ipn`,
      shipping_method: 'No',
      product_name: 'Demo Product',
      product_category: 'Demo',
      product_profile: 'general',
      cus_name: name,
      cus_email: email,
      cus_add1: 'Dhaka',
      cus_add2: 'Dhaka',
      cus_city: 'Dhaka',
      cus_state: 'Dhaka',
      cus_postcode: '1000',
      cus_country: 'Bangladesh',
      cus_phone: phone,
      cus_fax: '',
      ship_name: name,
      ship_add1: 'Dhaka',
      ship_add2: 'Dhaka',
      ship_city: 'Dhaka',
      ship_state: 'Dhaka',
      ship_postcode: '1000',
      ship_country: 'Bangladesh',
    };

    console.log('Sending data to SSLCommerz:', data);

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const apiResponse = await sslcz.init(data);

    console.log('SSLCOMMERZ Response:', apiResponse);

    if (apiResponse && apiResponse.GatewayPageURL) {
      return res.status(200).json({ 
        success: true,
        paymentUrl: apiResponse.GatewayPageURL,
        transactionId: transactionId 
      });
    } else {
      console.log('No GatewayPageURL in SSLCOMMERZ response!');
      return res.status(400).json({ 
        error: 'Payment gateway URL not found', 
        sslcommerzResponse: apiResponse 
      });
    }
  } catch (error) {
    console.error('Error in /init:', error);
    return res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message,
      stack: is_live ? undefined : error.stack 
    });
  }
});

// Payment callback routes
app.post('/payment/success', (req, res) => {
  console.log('Payment Success:', req.body);
  res.redirect('myapp://payment/success?' + new URLSearchParams(req.body).toString());
});

app.post('/payment/fail', (req, res) => {
  console.log('Payment Failed:', req.body);
  res.redirect('myapp://payment/fail?' + new URLSearchParams(req.body).toString());
});

app.post('/payment/cancel', (req, res) => {
  console.log('Payment Cancelled:', req.body);
  res.redirect('myapp://payment/cancel?' + new URLSearchParams(req.body).toString());
});

app.post('/payment/ipn', (req, res) => {
  console.log('Payment IPN:', req.body);
  res.status(200).send('OK');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`✅ SSLCommerz backend running on:`);
  console.log(`   Local: http://localhost:${port}`);
  console.log(`   Network: http://${serverIP}:${port}`);
  console.log(`   Use the Network URL in your React Native app`);
});
