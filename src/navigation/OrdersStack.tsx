import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OrdersScreen from '../screens/attendee/OrdersScreen';
import OrderQRScreen from '../screens/attendee/OrderQRScreen';

const Stack = createNativeStackNavigator();

const OrdersStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OrdersList" component={OrdersScreen} />
      <Stack.Screen name="OrderQR" component={OrderQRScreen} />
    </Stack.Navigator>
  );
};

export default OrdersStack;