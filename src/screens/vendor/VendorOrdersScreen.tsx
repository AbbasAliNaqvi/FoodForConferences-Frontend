import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import API from '../../api';
import { socket } from '../socket';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { StackNavigationProp } from '@react-navigation/stack';

interface MenuItem {
  _id: string;
  menu: { _id: string; name: string; };
  quantity: number;
}
interface Order {
  _id: string;
  user: { _id:string; name: string; };
  items: MenuItem[];
  orderStatus: 'pending' | 'preparing' | 'ready' | 'picked';
  createdAt: string;
}
interface VendorOrdersScreenProps {
    navigation: StackNavigationProp<any>;
}
const fetchVendorOrders = async (): Promise<Order[]> => {
  const { data } = await API.get('/orders/vendor');
  return data;
};

const VendorOrdersScreen: React.FC<VendorOrdersScreenProps> = ({ navigation }) => {
  const queryClient = useQueryClient();

  const { data: orders, isLoading, isError } = useQuery({
    queryKey: ['vendorOrders'],
    queryFn: fetchVendorOrders,
  });

  useEffect(() => {
    if (!isLoading) {
      console.log('API RESPONSE IN APP:', JSON.stringify(orders, null, 2));
    }
  }, [orders, isLoading]);

  useEffect(() => {
    const handleOrderUpdate = () => {
      console.log('[Socket] Received order update. Refetching...');
      queryClient.invalidateQueries({ queryKey: ['vendorOrders'] });
    };
    socket.on('orderUpdate', handleOrderUpdate);
    return () => {
      socket.off('orderUpdate', handleOrderUpdate);
    };
  }, [queryClient]);

  if (isError) {
    Alert.alert("Error", "Could not fetch orders. Please try again later.");
  }
  
const renderOrderCard = ({ item }: { item: Order }) => ( // Use the correct type
    <View style={styles.card}>
        <View style={{flex: 1}}>
            <Text style={styles.cardOrderId}>Order #{item._id.slice(-6).toUpperCase()}</Text>
            <Text style={styles.cardUser}>For: {item.user?.name || 'N/A'}</Text>
            <Text style={styles.cardDate}>{new Date(item.createdAt).toLocaleTimeString()}</Text>
            
            {/* Changes are in this map function */}
            {item.items.map((menuItem, index) => (
                <Text key={index} style={styles.cardItem}>
                    - {menuItem.qty}x {menuItem.name} 
                </Text>
            ))}
        </View>
        <TouchableOpacity 
            style={styles.verifyButton}
            onPress={() => navigation.navigate('QrScannerScreen', { orderId: item._id })}
        >
            <Text style={styles.verifyButtonText}>Verify Pickup</Text>
        </TouchableOpacity>
    </View>
);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Incoming Orders</Text>
      {isLoading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderCard}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: SIZES.padding }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No active orders right now.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  title: { ...FONTS.h1, paddingHorizontal: SIZES.padding, paddingTop: SIZES.padding, color: COLORS.dark },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: SIZES.padding * 5, },
  emptyText: { textAlign: 'center', ...FONTS.body3, color: COLORS.gray },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.light, borderRadius: SIZES.radius, padding: SIZES.padding, marginBottom: SIZES.padding, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  cardOrderId: { ...FONTS.h3, color: COLORS.dark },
  cardUser: { ...FONTS.body4, color: COLORS.gray, marginVertical: 4 },
  cardDate: { ...FONTS.body4, color: COLORS.gray, marginBottom: 8 },
  cardItem: { ...FONTS.body4, color: COLORS.dark, marginLeft: 8 },
  verifyButton: { backgroundColor: COLORS.success, padding: SIZES.base * 2, borderRadius: SIZES.radius, marginLeft: SIZES.padding, justifyContent: 'center', alignItems: 'center', height: 60, },
  verifyButtonText: { ...FONTS.body3, color: COLORS.light, fontWeight: 'bold' }
});

export default VendorOrdersScreen;