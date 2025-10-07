import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, Animated, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { COLORS, SIZES } from '../constants/theme';
import Icon from 'react-native-vector-icons/Ionicons';

// Navigators
import HomeStack from './HomeStack';
import OrdersStack from './OrdersStack';
// Screens
import CartScreen from '../screens/attendee/CartScreen';
import ProfileScreen from '../screens/attendee/ProfileScreen';
import OrderDetailsScreen from '../screens/attendee/OrderDetailsScreen';

const PlaceholderScreen = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: COLORS.background,
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Text>Coming Soon</Text>
  </View>
);

const Tab = createBottomTabNavigator();

const CustomTabBarIcon = ({ focused, iconName, label }: any) => {
  const widthAnimation = useRef(new Animated.Value(focused ? 110 : 50)).current;
  const opacityAnimation = useRef(new Animated.Value(focused ? 1 : 0)).current;
  const scaleAnimation = useRef(new Animated.Value(focused ? 1.05 : 1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(widthAnimation, {
        toValue: focused ? 110 : 50,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(opacityAnimation, {
        toValue: focused ? 1 : 0,
        duration: 150,
        useNativeDriver: false,
      }),
      Animated.spring(scaleAnimation, {
        toValue: focused ? 1.05 : 1,
        friction: 6,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [focused]);

  return (
    <Animated.View
      style={[
        styles.tabIconContainer,
        {
          width: widthAnimation,
          backgroundColor: focused ? COLORS.light : 'transparent',
        },
      ]}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnimation }] }}>
        <Icon
          name={focused ? iconName : `${iconName}-outline`}
          size={24}
          color={focused ? COLORS.primary : '#ccd9c9ff'}
        />
      </Animated.View>
      {focused && (
        <Animated.View style={{ opacity: opacityAnimation, marginLeft: 6 }}>
          <Text style={styles.activeTabLabel}>{label}</Text>
        </Animated.View>
      )}
    </Animated.View>
  );
};

const AttendeeTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        tabBarItemStyle: styles.tabBarItem,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <CustomTabBarIcon focused={focused} iconName="home" label="Home" />
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <CustomTabBarIcon focused={focused} iconName="cart" label="Cart" />
          ),
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <CustomTabBarIcon
              focused={focused}
              iconName="receipt"
              label="Orders"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <CustomTabBarIcon
              focused={focused}
              iconName="person"
              label="Profile"
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 1,
    left: 10,
    right: 10,
    backgroundColor: COLORS.primary,
      borderTopLeftRadius: SIZES.radius * 2,
  borderTopRightRadius: SIZES.radius * 2,
    height: 90,
    borderTopWidth: 0,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabBarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZES.radius * 1.5,
    height: 55,
    paddingHorizontal: 5,
  },
  activeTabLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
});

export default AttendeeTabs;
