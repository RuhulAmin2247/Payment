import React, { useState, useEffect } from 'react';
import { Button, View, StyleSheet, Alert, Text, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WebView } from 'react-native-webview';

const Stack = createNativeStackNavigator();

// 🔧 Update this IP daily (check backend console for Network URL)
const SERVER_URL = 'http://10.5.228.3:3000';

// Home Screen Component
function HomeScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState('Checking server...');

  useEffect(() => {
    checkServer();
  }, []);

  // Check if backend server is running
  const checkServer = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/`);
      const data = await response.json();
      setServerStatus(`✅ ${data.message}`);
    } catch (error) {
      setServerStatus('❌ Server not reachable');
    }
  };

  // Handle payment button press
  const handlePayment = async () => {
    if (serverStatus.includes('❌')) {
      Alert.alert('Error', 'Please start the backend server first!');
      return;
    }

    setLoading(true);
    try {
      // Payment data
      const paymentData = {
        amount: 100,
        name: 'Ruhul Amin',
        email: 'ruhul@example.com',
        phone: '01782315183',
      };

      // Send payment request to backend
      const response = await fetch(`${SERVER_URL}/init`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Navigate to payment screen
        navigation.navigate('PaymentScreen', { 
          url: data.paymentUrl,
          transactionId: data.transactionId 
        });
      } else {
        Alert.alert('Payment Error', data.error || 'Failed to initialize payment');
      }
    } catch (error) {
      Alert.alert('Network Error', 'Could not connect to payment server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💳 SSLCommerz Payment</Text>
      <Text style={styles.status}>{serverStatus}</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <Button 
          title="Pay ৳100 Now" 
          onPress={handlePayment}
          disabled={serverStatus.includes('❌')}
        />
      )}
      
      <Button 
        title="🔄 Check Server" 
        onPress={checkServer}
        color="#666"
      />
    </View>
  );
}

// Payment Screen Component
function PaymentScreen({ route, navigation }) {
  const { url, transactionId } = route.params;
  const [loading, setLoading] = useState(true);
  
  // Handle payment completion
  const handleNavigationChange = (navState) => {
    if (navState.url.includes('payment/success')) {
      Alert.alert('✅ Payment Successful!', `Transaction: ${transactionId}`, [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } else if (navState.url.includes('payment/fail')) {
      Alert.alert('❌ Payment Failed', 'Your payment could not be processed.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } else if (navState.url.includes('payment/cancel')) {
      Alert.alert('🚫 Payment Cancelled', 'You cancelled the payment.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    }
  };

  return (
    <View style={styles.paymentContainer}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text>Loading payment gateway...</Text>
        </View>
      )}
      <WebView 
        source={{ uri: url }}
        onLoad={() => setLoading(false)}
        onNavigationStateChange={handleNavigationChange}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </View>
  );
}

// Main App Component
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Payment App' }}
        />
        <Stack.Screen 
          name="PaymentScreen" 
          component={PaymentScreen} 
          options={{ title: 'Complete Payment' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Clean Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  status: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
    paddingHorizontal: 20,
    color: '#666',
  },
  paymentContainer: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
});
