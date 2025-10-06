import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import API from '../../api';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import Icon from 'react-native-vector-icons/Ionicons';

export const fetchMyOrders = () => API.get('/orders/my-orders');

const OrdersScreen = ({ navigation }: any) => {
  const { data: ordersResponse, isLoading } = useQuery({
    queryKey: ['myOrders'],
    queryFn: fetchMyOrders,
  });

  const orders = ordersResponse?.data || [];

  const renderOrderCard = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('OrderQR', { orderId: item._id })}
    >
      <View>
        <Text style={styles.cardOrderId}>Order #{item.orderId}</Text>
        <Text style={styles.cardDate}>
          {new Date(item.createdAt).toLocaleString()}
        </Text>
        <Text style={styles.cardTotal}>${item.total.toFixed(2)}</Text>
      </View>
      <View style={styles.statusContainer}>
        <Text style={styles.cardStatus}>{item.status}</Text>
        <Icon name="chevron-forward-outline" size={24} color={COLORS.primary} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>My Orders</Text>
      {isLoading ? (
        <ActivityIndicator size="large" color={COLORS.primary} />
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderCard}
          keyExtractor={item => item._id}
          contentContainerStyle={{ padding: SIZES.padding }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              You haven't placed any orders yet.
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  title: {
    ...FONTS.h1,
    paddingHorizontal: SIZES.padding,
    paddingTop: SIZES.padding,
    color: COLORS.dark,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    ...FONTS.body3,
    color: COLORS.gray,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.light,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardOrderId: { ...FONTS.h3, color: COLORS.dark },
  cardDate: { ...FONTS.body4, color: COLORS.gray, marginVertical: 4 },
  cardTotal: { ...FONTS.h3, color: COLORS.primary, fontWeight: 'bold' },
  statusContainer: { alignItems: 'center' },
  cardStatus: {
    ...FONTS.body4,
    color: COLORS.dark,
    fontWeight: '600',
    textTransform: 'capitalize',
    marginBottom: 4,
  },
});

export default OrdersScreen;
