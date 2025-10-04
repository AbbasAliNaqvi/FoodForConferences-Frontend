import Icon from 'react-native-vector-icons/Ionicons'; // Example for Ionicons

const BottomTabNavigator = () => (
  <Tab.Navigator
    initialRouteName="Events"
    screenOptions={{
      headerShown: false, // Hide header for tabs
    }}
  >
    <Tab.Screen
      name="Events"
      component={EventListScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="ios-list" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Menu"
      component={MenuScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="ios-fast-food" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Orders"
      component={OrderScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="ios-cart" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="ios-person" size={size} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
);
