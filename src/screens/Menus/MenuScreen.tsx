import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, ActivityIndicator, StyleSheet, Button, Alert } from 'react-native';
import { fetchMenusByEvent, createOrder } from '../../api'; // Assuming these functions are correctly set up
import Card from '../../components/Card'; // Assuming the Card component is available
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

interface MenuItem {
  _id: string;
  name: string;
  price: number;
  vendorId?: string; // Added vendorId
  inventory?: { total?: number; sold?: number };
}

interface Menu {
  _id: string;
  title: string;
  items: MenuItem[];
  vendorId?: string; // Added vendorId
}

interface Props {
  navigation: StackNavigationProp<any>;
  route: RouteProp<any, 'Menu'>;
}

const MenuScreen: React.FC<Props> = ({ navigation, route }) => {
  const { eventId } = route.params;
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch menus when component mounts
  useEffect(() => {
    fetchMenusByEvent(eventId)
      .then(res => {
        console.log('Menus fetched:', res.data); // Debugging
        setMenus(res.data);
      })
      .catch(err => {
        console.log('Fetch menus error:', err);
        Alert.alert('Error', 'Unable to fetch menus');
      })
      .finally(() => setLoading(false));
  }, [eventId]);

  // Order handler
  const handleOrder = (menu: Menu) => {
    if (!menu.items || menu.items.length === 0) {
      Alert.alert('No items', 'This menu has no items to order');
      return;
    }

    const item = menu.items[0];

    // Prepare the order payload
    const orderPayload = {
      eventId,
      items: [
        {
          itemId: item._id.toString(),
          qty: 1,
          price: item.price,
          vendorId: item.vendorId?.toString() || menu.vendorId?.toString(), // Use vendorId from item or menu
        }
      ],
    };

    console.log('Creating order payload:', orderPayload);

    // Send the order request
    createOrder(orderPayload)
      .then(res => {
        Alert.alert('Order Placed', 'Your order has been successfully placed');
      })
      .catch(err => {
        console.log('Create order error:', err.response?.data || err.message);
        Alert.alert('Error', 'Unable to place order');
      });
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  // FlatList rendering the menus
  return (
    <View style={styles.container}>
      <FlatList
        data={menus}
        keyExtractor={(item) => item._id.toString()} // Ensure keyExtractor is working with string IDs
        renderItem={({ item }) => (
          <Card title={item.title}>
            <Text>Items: {item.items.map(i => i.name).join(', ')}</Text>
            <Button title="Order Now" onPress={() => handleOrder(item)} />
          </Card>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
});

export default MenuScreen;
