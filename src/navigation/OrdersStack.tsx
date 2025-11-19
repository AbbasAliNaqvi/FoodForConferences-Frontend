// /navigation/OrdersStack.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OrdersScreen from '../screens/attendee/OrdersScreen'; 
import OrderDetailsScreen from '../screens/attendee/OrderDetailsScreen'; 
import OrderQRScreen from '../screens/attendee/OrderQRScreen';
const Stack = createNativeStackNavigator();

const OrdersStack = () => {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
      }}
    >
      <Stack.Screen name="Orders" component={OrdersScreen} />
    
      <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
      
      <Stack.Screen 
        name="OrderQR" 
        component={OrderQRScreen} 
        options={{ presentation: 'modal' }} 
      />
    </Stack.Navigator>
  );
};

export default OrdersStack;