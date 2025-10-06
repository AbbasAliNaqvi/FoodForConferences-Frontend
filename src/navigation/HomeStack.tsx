import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack'; 
import HomeScreen from '../screens/attendee/HomeScreen';
import EventDetailScreen from '../screens/attendee/EventDetailScreen';
import MenuItemDetailScreen from '../screens/attendee/MenuItemDetailScreen';
import CartScreen from '../screens/attendee/CartScreen';
import QRScannerScreen from '../screens/shared/QRScannerScreen';

const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeFeed" component={HomeScreen} />
      <Stack.Screen name="EventDetail" component={EventDetailScreen} />
      <Stack.Screen name="MenuItemDetail" component={MenuItemDetailScreen} />
      <Stack.Screen name="Cart" component={CartScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="QRScanner" component={QRScannerScreen} options={{ presentation: 'modal' }} />
    </Stack.Navigator>
  );
};

export default HomeStack;