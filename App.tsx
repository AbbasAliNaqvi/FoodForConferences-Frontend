import React from 'react';
import { LogBox } from 'react-native';
import { AuthProvider } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext'; 
import AppNavigator from './src/navigation/AppNavigator';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StripeProvider } from '@stripe/stripe-react-native';
import { STRIPE_PUBLISHABLE_KEY } from './apistripe';

LogBox.ignoreAllLogs(true);

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <StripeProvider 
        publishableKey={STRIPE_PUBLISHABLE_KEY} 
        merchantIdentifier="merchant.com.foodforconferences" 
      >
        <AuthProvider>
          <CartProvider> 
            <AppNavigator />
          </CartProvider>
        </AuthProvider>
      </StripeProvider>
    </QueryClientProvider>
  );
};

export default App;
