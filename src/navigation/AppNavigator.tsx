import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import AuthStack from './AuthStack';
import AttendeeTabs from './AttendeeTabs'; 
import VendorTabs from './VendorTabs';
// import OrganizerTabs from './OrganizerTabs';
import { ActivityIndicator, View } from 'react-native';
import { COLORS } from '../constants/theme';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { token, role, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const renderAppStack = () => {
    switch (role) {
      case 'attendee':
        return <Stack.Screen name="AttendeeApp" component={AttendeeTabs} />;
      case 'vendor':
        return <Stack.Screen name="VendorApp" component={VendorTabs} />;
      // case 'organizer':
      //   return <Stack.Screen name="OrganizerApp" component={OrganizerTabs} />;
      default:
        // This case should ideally not be hit if a role is always present post-login
        return <Stack.Screen name="Auth" component={AuthStack} />;
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {token && role ? renderAppStack() : <Stack.Screen name="Auth" component={AuthStack} />}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;