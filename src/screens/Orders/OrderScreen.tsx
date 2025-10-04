import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { createOrder, fetchOrderById } from '../../api';

const OrderScreen = ({ route }: any) => {
  const { eventId } = route.params; // Assuming eventId is passed as param

  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);

  const handleCreateOrder = async () => {
    if (!quantity) {
      Alert.alert('Error', 'Please enter a quantity');
      return;
    }

    setLoading(true);
    try {
      const response = await createOrder({ eventId, quantity });
      setOrder(response.data); // Assuming response contains the order details
      Alert.alert('Success', 'Order created successfully');
    } catch (error) {
      console.error('Error creating order:', error);
      Alert.alert('Error', 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  const handleFetchOrder = async (orderId: string) => {
    setLoading(true);
    try {
      const response = await fetchOrderById(orderId);
      setOrder(response.data);
    } catch (error) {
      console.error('Error fetching order:', error);
      Alert.alert('Error', 'Failed to fetch order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <Text>Order for Event {eventId}</Text>
      <TextInput
        placeholder="Enter quantity"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />
      <Button title="Create Order" onPress={handleCreateOrder} />
      {loading && <Text>Loading...</Text>}
      {order && (
        <View>
          <Text>Order ID: {order.id}</Text>
          <Text>Quantity: {order.quantity}</Text>
        </View>
      )}
    </View>
  );
};

export default OrderScreen;
