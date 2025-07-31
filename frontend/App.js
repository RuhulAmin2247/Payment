import React, { useState, useEffect } from 'react';
import { Button, View, StyleSheet, Alert, Text, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WebView } from 'react-native-webview';

const Stack = createNativeStackNavigator();

// Replace with your actual server IP - check the backend console for the Network URL
const SERVER_URL = 'http://10.5.230.125:3000'; // Update this with your actual IP

function HomeScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState('Checking...');

  useEffect(() => {
    checkServerConnection();
  }, []);

  const checkServerConnection = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/`, {
        method: 'GET',
        timeout: 5000,
      });
      const data = await response.json();
      setServerStatus(`✅ Connected - ${data.message}`);
    } catch (error) {
      console.error('Server connection error:', error);
      setServerStatus('❌ Server not reachable');
    }
  };

  const handlePayment = async () => {
    if (serverStatus.includes('❌')) {
      Alert.alert(
        'Connection Error', 
        'Backend server is not reachable. Please check if the server is running and update the SERVER_URL in App.js with your correct IP address.'
      );
      return;
    }

    setLoading(true);
    try {
      console.log('Initiating payment...');
      
      const paymentData = {
        amount: 100,
        name: 'Ruhul Amin',
        email: 'ruhul@example.com',
        phone: '01782315183',
      };

      console.log('Sending payment data:', paymentData);

      const res = await fetch(`${SERVER_URL}/init`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(paymentData),
        timeout: 10000,
      });

      const data = await res.json();
      console.log("API Response:", data);

      if (res.ok && data.success && data.paymentUrl) {
        console.log('Navigating to payment URL:', data.paymentUrl);
        navigation.navigate('PaymentScreen', { 
          url: data.paymentUrl,
          transactionId: data.transactionId 
        });
      } else {
        console.error('Payment initialization failed:', data);
        Alert.alert(
          'Payment Error', 
          data.error || 'Failed to initialize payment. Please try again.',
          [
            { text: 'Retry', onPress: () => handlePayment() },
            { text: 'Cancel', style: 'cancel' }
          ]
        );
      }
    } catch (error) {
      console.error("Frontend error:", error);
      Alert.alert(
        'Network Error', 
        'Could not connect to payment server. Please check your internet connection and try again.',
        [
          { text: 'Retry', onPress: () => handlePayment() },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SSLCommerz Payment Demo</Text>
      <Text style={styles.status}>{serverStatus}</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button 
          title="Pay ৳100 Now" 
          onPress={handlePayment}
          disabled={serverStatus.includes('❌')}
        />
      )}
      
      <Button 
        title="Check Server Status" 
        onPress={checkServerConnection}
        color="#666"
      />
    </View>
  );
}

function PaymentScreen({ route, navigation }) {
  const { url, transactionId } = route.params;
  const [loading, setLoading] = useState(true);
  
  const handleNavigationStateChange = (navState) => {
    console.log('WebView navigation:', navState.url);
    
    // Handle payment result URLs
    if (navState.url.includes('payment/success')) {
      Alert.alert(
        'Payment Successful!', 
        `Transaction ID: ${transactionId}`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } else if (navState.url.includes('payment/fail')) {
      Alert.alert(
        'Payment Failed', 
        'Your payment could not be processed.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } else if (navState.url.includes('payment/cancel')) {
      Alert.alert(
        'Payment Cancelled', 
        'You cancelled the payment.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }
  };

  return (
    <View style={styles.paymentContainer}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Loading payment gateway...</Text>
        </View>
      )}
      <WebView 
        source={{ uri: url }}
        onLoad={() => setLoading(false)}
        onNavigationStateChange={handleNavigationStateChange}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
      />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  status: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
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
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
});
