import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import API from '../../api';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import Icon from 'react-native-vector-icons/Ionicons';

type RootStackParamList = {
  OrderDetails: { orderId: string };
};

type OrdersScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'OrderDetails'
>;

interface OrdersScreenProps {
  navigation: OrdersScreenNavigationProp;
}

export const fetchMyOrders = () => API.get('/orders');

const getStatusProps = (status: string) => {
  const normalizedStatus = status ? status.toLowerCase() : 'queued';

  switch (normalizedStatus) {
    case 'completed':
      return { color: COLORS.success, icon: 'checkmark-done-circle', bgColor: COLORS.success + '15' };
    case 'ready':
    case 'picked':
      return { color: COLORS.info, icon: 'bag-check', bgColor: COLORS.info + '15' };
    case 'preparing':
      return { color: COLORS.warning, icon: 'timer', bgColor: COLORS.warning + '15' };
    case 'cancelled':
    case 'failed':
      return { color: COLORS.error, icon: 'close-circle', bgColor: COLORS.error + '15' };
    case 'queued':
    default:
      return { color: COLORS.gray, icon: 'ellipsis-horizontal-circle', bgColor: COLORS.gray + '15' };
  }
};

const OrdersScreen = ({ navigation }: OrdersScreenProps) => {
  const { data: ordersResponse, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['myOrders'],
    queryFn: fetchMyOrders,
    staleTime: 1000,
    refetchOnWindowFocus: true,
  });

  const orders = ordersResponse?.data?.data || ordersResponse?.data || [];

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const renderOrderCard = ({ item }: { item: any }) => {
    const currentStatus = item.orderStatus || item.status || 'queued';
    const statusProps = getStatusProps(currentStatus);
    const firstItemName = item.items?.[0]?.name;
    const orderTitle = firstItemName || `Order with ${item.items?.length || 0} items`;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('OrderDetails', { orderId: item._id })}
      >
        <View style={styles.contentLeft}>
          <Text style={styles.cardOrderTitle} numberOfLines={1}>
            {orderTitle}
          </Text>

          <View style={styles.detailRow}>
            <Text style={styles.cardTotal}>
              <Text style={{ color: COLORS.dark }}>Total: </Text>${(item.total ?? 0).toFixed(2)}
            </Text>
            <View style={styles.separator} />
            <Text style={styles.cardDate}>
              {item.createdAt
                ? new Date(item.createdAt).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                  })
                : 'N/A'}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.statusPillContainer,
            { borderColor: statusProps.color, backgroundColor: statusProps.bgColor },
          ]}
        >
          <Icon name={statusProps.icon} size={16} color={statusProps.color} />
          <Text style={[styles.cardStatus, { color: statusProps.color }]}>
            {currentStatus.toUpperCase()}
          </Text>
          <Icon
            name="chevron-forward-outline"
            size={18}
            color={COLORS.gray}
            style={{ marginLeft: SIZES.base / 2 }}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <View style={styles.header}>
        <Text style={styles.title}>My Orders</Text>
      </View>

      {isLoading && orders.length === 0 ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={styles.loadingIndicator} />
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderCard}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.flatListContent}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} tintColor={COLORS.primary} />
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>You haven't placed any orders yet. 🛒</Text>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray || '#F0F0F0',
  },
  header: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding * 1.3,
    backgroundColor: COLORS.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
  title: {
    ...FONTS.h1,
    color: COLORS.light,
    fontWeight: 'bold',
  },
  flatListContent: {
    padding: SIZES.padding,
  },
  loadingIndicator: {
    flex: 1,
    marginTop: SIZES.padding * 4,
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
    backgroundColor: COLORS.white || '#FFFFFF',
    borderRadius: SIZES.radius * 2,
    padding: SIZES.padding * 1.5,
    marginBottom: SIZES.padding,
    shadowColor: COLORS.dark || '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 6,
    borderLeftWidth: 5,
    borderLeftColor: COLORS.primary,
  },
  contentLeft: {
    flex: 1,
    marginRight: SIZES.padding,
  },
  cardOrderTitle: {
    ...FONTS.h3,
    color: COLORS.dark,
    fontWeight: '700',
    marginBottom: SIZES.base,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    width: 1,
    height: '80%',
    backgroundColor: COLORS.lightGray,
    marginHorizontal: SIZES.base,
  },
  cardTotal: {
    ...FONTS.body3,
    color: COLORS.primary,
    fontWeight: '600',
  },
  cardDate: {
    ...FONTS.body4,
    color: COLORS.gray,
  },
  statusPillContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.base,
    paddingVertical: SIZES.base / 2,
    borderRadius: SIZES.radius * 2,
    borderWidth: 1,
  },
  cardStatus: {
    ...FONTS.body5,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginLeft: SIZES.base / 2,
  },
});

export default OrdersScreen;
