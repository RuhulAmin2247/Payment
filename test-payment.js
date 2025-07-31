const fetch = require('node-fetch');

async function testPayment() {
  try {
    console.log('Testing SSLCommerz Payment Integration...\n');
    
    // Test server connectivity
    console.log('1. Testing server connectivity...');
    const healthResponse = await fetch('http://10.5.231.46:3000/');
    const healthData = await healthResponse.json();
    console.log('✅ Server is running:', healthData.message);
    console.log('   Server IP:', healthData.serverIP);
    console.log('   Port:', healthData.port, '\n');
    
    // Test payment initialization
    console.log('2. Testing payment initialization...');
    const paymentResponse = await fetch('http://10.5.231.46:3000/init', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: 100,
        name: 'Test User',
        email: 'test@example.com',
        phone: '01234567890'
      })
    });
    
    const paymentData = await paymentResponse.json();
    
    if (paymentData.success) {
      console.log('✅ Payment initialization successful!');
      console.log('   Transaction ID:', paymentData.transactionId);
      console.log('   Payment URL:', paymentData.paymentUrl);
      console.log('\n🎉 Integration is working properly!');
      console.log('\nNext steps:');
      console.log('1. Make sure your React Native app uses the server IP: http://10.5.231.46:3000');
      console.log('2. Install required React Native dependencies');
      console.log('3. Run your React Native app');
    } else {
      console.log('❌ Payment initialization failed:', paymentData);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testPayment();
