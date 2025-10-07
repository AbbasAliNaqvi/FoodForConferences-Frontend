import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack'; 
import HomeScreen from '../screens/attendee/HomeScreen';
import EventDetailScreen from '../screens/attendee/EventDetailScreen';
import MenuItemDetailScreen from '../screens/attendee/MenuItemDetailScreen';
import CartScreen from '../screens/attendee/CartScreen';
import QRScannerScreen from '../screens/shared/QRScannerScreen';
import EventMenuScreen from '../screens/attendee/EventMenuScreen'; 
import OrderDetailsScreen from '../screens/attendee/OrderDetailsScreen';
import MapScreen from '../screens/attendee/MapScreen';
const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeFeed" component={HomeScreen} />
      <Stack.Screen name="EventDetail" component={EventDetailScreen} />
      <Stack.Screen name="EventMenu" component={EventMenuScreen} /> 
      <Stack.Screen name="MenuItemDetail" component={MenuItemDetailScreen} />
      <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} /> 
      <Stack.Screen name="Map" component={MapScreen} /> 
      <Stack.Screen name="Cart" component={CartScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="QRScanner" component={QRScannerScreen} options={{ presentation: 'modal' }} />
    </Stack.Navigator>
  );
};

export default HomeStack;