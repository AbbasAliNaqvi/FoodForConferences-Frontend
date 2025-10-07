// /screens/attendee/OrderDetailsScreen.tsx

import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, StatusBar, Dimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
// REMOVED: import QRCode from 'react-native-qrcode-svg'; 
import API from '../../api';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import Icon from 'react-native-vector-icons/Ionicons';

// --- Type Definitions (Ensuring strict structure) ---

interface OrderItem {
  menuItemId: string;
  quantity: number; 
  price: number;
  qty: number; 
  name: string; 
}

interface OrderWithToken {
  _id: string;
  qrToken: string; // Critical information, will be displayed as text
  total: number;
  orderStatus: string;
  items: OrderItem[];
  createdAt: string;
}

export const fetchOrderById = (orderId: string) => API.get(`/orders/${orderId}`);

type RootStackParamList = {
  OrderDetails: { orderId: string }; 
};

type Props = NativeStackScreenProps<RootStackParamList, 'OrderDetails'>;

// Helper to determine status color (copied for consistency)
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
      return { color: COLORS.primary, icon: 'ellipsis-horizontal-circle', bgColor: COLORS.primary + '15' };
  }
};


const OrderDetailsScreen = ({ route }: Props) => {
  const { orderId } = route.params;

  const { data: orderResponse, isLoading, isError, error } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => fetchOrderById(orderId),
    select: (response) => response.data as OrderWithToken, 
    enabled: !!orderId, 
  });
  
  const order = orderResponse;

  // --- Loading State ---
  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Fetching order details...</Text>
      </View>
    );
  }

  // --- Error/Not Found State ---
  if (isError || !order || !order.qrToken || !order.items?.length) {
    console.error('OrderDetailsScreen: Order data missing or fetch failed.', error);
    return (
      // Using a standard View instead of SafeAreaView to avoid dependency error
      <View style={styles.centerContainer}>
         <StatusBar barStyle="dark-content" backgroundColor={COLORS.lightGray} />
        <Icon name="sad-outline" size={60} color={COLORS.gray} style={{ marginBottom: SIZES.padding }} />
        <Text style={styles.errorTitle}>Order Not Found</Text>
        <Text style={styles.errorText}>
          We couldn't load the details for this order. Please try again later.
        </Text>
      </View>
    );
  }

  const { color: statusColor, bgColor: statusBgColor } = getStatusProps(order.orderStatus);
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

  // --- Main Content ---
  return (
    // Using a standard View instead of SafeAreaView to avoid dependency error
    <View style={styles.container}> 
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.lightGray} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header/Title */}
        <View style={styles.header}>
            <Text style={styles.title}>Order Confirmed 🎉</Text>
            <Text style={styles.orderIdText}>Order ID: <Text style={styles.orderIdHighlight}>#{order._id.slice(-6).toUpperCase()}</Text></Text>
            <View style={[styles.statusPillContainer, { borderColor: statusColor, backgroundColor: statusBgColor }]}>
                <Text style={[styles.statusText, { color: statusColor }]}>
                    STATUS: {order.orderStatus.toUpperCase()}
                </Text>
            </View>
        </View>


        {/* QR Code Section - Replaced with Placeholder/Token Display */}
        <View style={styles.qrCard}>
          <Text style={styles.qrLabel}>PICKUP TOKEN</Text>
          
          <View style={styles.qrCodeWrapperFallback}>
            <Icon 
                name="barcode-outline" 
                size={70} 
                color={COLORS.gray} 
                style={{ marginBottom: SIZES.base }}
            />
            {/* Display the QR Token in a prominent, monospace font */}
            <Text style={styles.qrTokenText}>
                {order.qrToken.toUpperCase()}
            </Text>
            <Text style={styles.qrCodeFallbackText}>
                (QR Code disabled: Use this token for pickup)
            </Text>
          </View>
        </View>

        {/* Summary/Item List */}
        <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>Order Items</Text>
          {order.items.map((item, index) => (
            // Using index as fallback key only if menuItemId is not unique/stable
            <View key={item.menuItemId + index} style={styles.itemRow}> 
              <Text style={styles.itemQuantity}>{item.qty}x</Text> 
              <Text style={styles.itemName} numberOfLines={1}>{item.name || `Item ID: ${item.menuItemId.slice(-8)}`}</Text> 
              <Text style={styles.itemPrice}>${(item.price * item.qty).toFixed(2)}</Text>
            </View>
          ))}
          
          <View style={styles.separator} />
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Paid:</Text>
            <Text style={styles.totalPrice}>${order.total.toFixed(2)}</Text>
          </View>

          <View style={styles.dateRow}>
             <Icon name="calendar-outline" size={16} color={COLORS.gray} style={{ marginRight: SIZES.base }} />
             <Text style={styles.dateText}>Order placed on {orderDate}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

// --- Stylesheet (Refined) ---
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.lightGray || '#F0F0F0',
  },
  centerContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: COLORS.lightGray || '#F0F0F0',
    paddingTop: 50, // Manual safe area compensation
  },
  scrollContent: { 
    padding: SIZES.padding, 
    alignItems: 'center', 
    paddingBottom: SIZES.padding * 4,
  },
  loadingText: { 
    ...FONTS.body3, 
    color: COLORS.gray, 
    marginTop: 10 
  },
  errorTitle: { 
    ...FONTS.h2, 
    color: COLORS.dark, 
    marginBottom: 8 
  }, 
  errorText: { 
    ...FONTS.body3, 
    color: COLORS.gray, 
    textAlign: 'center', 
    maxWidth: '80%' 
  }, 
  
  header: {
    width: '100%',
    alignItems: 'center',
    marginBottom: SIZES.padding * 2,
    marginTop: SIZES.padding,
  },
  title: { 
    ...FONTS.h1, 
    color: COLORS.dark, 
    marginBottom: SIZES.base 
  },
  orderIdText: { 
    ...FONTS.body3, 
    color: COLORS.gray, 
    marginBottom: SIZES.base 
  },
  orderIdHighlight: { 
    fontWeight: 'bold', 
    color: COLORS.dark 
  },
  
  statusPillContainer: { 
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base,
    borderRadius: SIZES.radius * 2,
    borderWidth: 1,
    marginTop: SIZES.base,
  },
  statusText: { 
    ...FONTS.body4, 
    fontWeight: '700', 
    textTransform: 'uppercase' 
  },

  // QR Code Card
  qrCard: {
    width: '100%',
    alignItems: 'center',
    padding: SIZES.padding * 2,
    backgroundColor: COLORS.white || '#FFFFFF',
    borderRadius: SIZES.radius * 2,
    marginBottom: SIZES.padding * 2,
    shadowColor: COLORS.dark || '#000',
    shadowOffset: { width: 0, height: 5 }, 
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 6,
    borderLeftWidth: 5,
    borderLeftColor: COLORS.primary,
  },
  qrLabel: { 
    ...FONTS.h2, 
    color: COLORS.dark, 
    marginBottom: SIZES.base, 
    fontWeight: 'bold' 
  },
  
  // New Fallback QR/Token Display Styles
  qrCodeWrapperFallback: {
    marginVertical: SIZES.padding,
    borderWidth: 2,
    borderColor: COLORS.lightGray,
    borderRadius: SIZES.radius,
    padding: SIZES.padding * 2,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 250,
  },
  qrTokenText: {
    ...FONTS.h2,
    fontWeight: 'bold',
    color: COLORS.dark,
    textAlign: 'center',
    letterSpacing: 1.5,
    marginBottom: SIZES.base,
  },
  qrCodeFallbackText: {
    ...FONTS.body4,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: SIZES.base,
  },
  
  // Summary Section
  summarySection: {
    width: '100%',
    padding: SIZES.padding * 1.5,
    backgroundColor: COLORS.white || '#FFFFFF',
    borderRadius: SIZES.radius * 2,
    shadowColor: COLORS.dark || '#000',
    shadowOffset: { width: 0, height: 3 }, 
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  summaryTitle: { 
    ...FONTS.h3, 
    color: COLORS.dark, 
    marginBottom: SIZES.padding, 
    fontWeight: 'bold' 
  },
  itemRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingVertical: 8,
    alignItems: 'center',
  },
  itemQuantity: { 
    ...FONTS.body3, 
    color: COLORS.gray, 
    width: '10%', 
    fontWeight: '600'
  },
  itemName: { 
    ...FONTS.body3, 
    color: COLORS.dark, 
    flex: 1,
    paddingRight: SIZES.base,
  },
  itemPrice: { 
    ...FONTS.body3, 
    color: COLORS.dark, 
    fontWeight: 'bold', 
    width: '25%', 
    textAlign: 'right' 
  },
  separator: { 
    height: 1, 
    backgroundColor: COLORS.lightGray || '#E0E0E0', 
    marginVertical: SIZES.base 
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SIZES.base * 2,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray || '#E0E0E0',
  },
  totalLabel: { 
    ...FONTS.h2, 
    color: COLORS.dark,
    fontWeight: '700',
  },
  totalPrice: { 
    ...FONTS.h2, 
    color: COLORS.primary, 
    fontWeight: 'bold',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES.padding,
  },
  dateText: {
     ...FONTS.body4,
     color: COLORS.gray,
  }
});

export default OrderDetailsScreen;