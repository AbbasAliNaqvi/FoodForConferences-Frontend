// // /screens/attendee/OrderDetailsScreen.tsx

// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, Alert, ScrollView } from 'react-native';
// import { NativeStackScreenProps } from '@react-navigation/native-stack';
// import QRCode from 'react-native-qrcode-svg'; 
// import { fetchOrderById } from '../../api';
// import { COLORS, FONTS, SIZES } from '../../constants/theme';
// import { Order } from '../../types';

// // Extended type based on your backend response
// interface OrderWithToken extends Order {
//   qrToken: string;
//   total: number; // Field name from your logs
//   orderStatus: string; // Field name from your logs
//   items: Array<{
//     menuItemId: string;
//     quantity: number;
//     price: number;
//     qty: number; // Field name from your logs
//     name: string; // Field name from your logs
//   }>;
// }

// type RootStackParamList = {
//   OrderDetails: { orderId: string };
// };
// type Props = NativeStackScreenProps<RootStackParamList, 'OrderDetails'>;

// const OrderDetailsScreen = ({ route }: Props) => {
//   const { orderId } = route.params;
//   const [order, setOrder] = useState<OrderWithToken | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const loadOrder = async () => {
//       try {
//         // fetchOrderById now returns Promise<Order> (raw data object)
//         const orderData = await fetchOrderById(orderId); 
        
//         // Final validation check to catch missing critical fields
//         if (!orderData || !orderData.qrToken) {
//            throw new Error('QR token or order data missing.');
//         }

//         setOrder(orderData as OrderWithToken);
        
//       } catch (error: any) {
//         console.error('OrderDetailsScreen: FAILED to fetch order.', error.message);
//         // Do not use Alert here, let the UI render the error state
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     loadOrder();
//   }, [orderId]);

//   if (isLoading) {
//     return (
//       <View style={styles.centerContainer}>
//         <ActivityIndicator size="large" color={COLORS.primary} />
//         <Text style={styles.loadingText}>Fetching order details...</Text>
//       </View>
//     );
//   }

//   // This block executes if order fetch failed or data is invalid/missing
//   if (!order || !order.qrToken) {
//     return (
//       <View style={styles.centerContainer}>
//         <Text style={styles.errorTitle}>Order Not Found</Text>
//         <Text style={styles.errorText}>
//           Could not load order details. Please try again.
//         </Text>
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView contentContainerStyle={styles.scrollContent}>
//         <Text style={styles.title}>Order Confirmed 🎉</Text>
//         <Text style={styles.orderIdText}>Order ID: <Text style={styles.orderIdHighlight}>#{order._id.slice(-6).toUpperCase()}</Text></Text>

//         <View style={styles.qrCard}>
//           <Text style={styles.qrLabel}>SCAN FOR PICKUP</Text>
          
//           <View style={styles.qrCodeWrapper}>
//             <QRCode
//               value={order.qrToken}
//               size={220}
//               color={COLORS.dark}
//               backgroundColor={COLORS.light}
//               quietZone={10}
//             />
//           </View>
//           <Text style={[styles.statusText, { color: order.orderStatus === 'queued' ? COLORS.primary : COLORS.success }]}>
//             STATUS: {order.orderStatus.toUpperCase()}
//           </Text>
//         </View>

//         <View style={styles.summarySection}>
//           <Text style={styles.summaryTitle}>Summary</Text>
//           {order.items.map((item, index) => (
//             <View key={index} style={styles.itemRow}>
//               <Text style={styles.itemQuantity}>{item.qty}x</Text> 
//               <Text style={styles.itemName}>{item.name || `Item ID: ${item.menuItemId.slice(-8)}`}</Text> 
//               <Text style={styles.itemPrice}>${(item.price * item.qty).toFixed(2)}</Text>
//             </View>
//           ))}
//           <View style={styles.separator} />
//           <View style={styles.totalRow}>
//             <Text style={styles.totalLabel}>Total Paid:</Text>
//             <Text style={styles.totalPrice}>${order.total.toFixed(2)}</Text>
//           </View>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };
// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: COLORS.background },
//   scrollContent: { padding: SIZES.padding, alignItems: 'center', paddingBottom: SIZES.padding * 4 },
//   centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
//   loadingText: { ...FONTS.body3, color: COLORS.gray, marginTop: 10 },
//   errorTitle: { ...FONTS.h2, color: COLORS.dark, marginBottom: 8 }, 
//   errorText: { ...FONTS.body3, color: COLORS.gray, textAlign: 'center', maxWidth: '80%' }, 
//   title: { ...FONTS.h1, color: COLORS.dark, marginVertical: SIZES.padding },
//   orderIdText: { ...FONTS.body3, color: COLORS.gray, marginBottom: SIZES.padding },
//   orderIdHighlight: { fontWeight: 'bold', color: COLORS.dark },
//   qrCard: {
//     width: '100%',
//     alignItems: 'center',
//     padding: SIZES.padding * 2,
//     backgroundColor: COLORS.light,
//     borderRadius: SIZES.radius * 2,
//     marginBottom: SIZES.padding * 2,
//     shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 5,
//   },
//   qrLabel: { ...FONTS.h2, color: COLORS.dark, marginBottom: SIZES.base, fontWeight: 'bold' },
//   statusText: { ...FONTS.h3, marginTop: SIZES.padding, fontWeight: 'bold' },
//   qrCodeWrapper: {
//     marginVertical: SIZES.padding,
//     borderWidth: 1,
//     borderColor: '#EFEFEF',
//     borderRadius: SIZES.radius,
//     padding: 10,
//   },
//   summarySection: {
//     width: '100%',
//     padding: SIZES.padding,
//     backgroundColor: COLORS.light,
//     borderRadius: SIZES.radius,
//     marginBottom: SIZES.padding,
//   },
//   summaryTitle: { ...FONTS.h3, color: COLORS.dark, marginBottom: SIZES.padding, fontWeight: 'bold' },
//   itemRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
//   itemQuantity: { ...FONTS.body3, color: COLORS.gray, width: '10%' },
//   itemName: { ...FONTS.body3, color: COLORS.dark, flex: 1 },
//   itemPrice: { ...FONTS.body3, color: COLORS.dark, fontWeight: 'bold', width: '25%', textAlign: 'right' },
//   separator: { height: 1, backgroundColor: '#E0E0E0', marginVertical: SIZES.base },
//   totalRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingTop: SIZES.base,
//   },
//   totalLabel: { ...FONTS.h2, color: COLORS.dark },
//   totalPrice: { ...FONTS.h2, color: COLORS.primary, fontWeight: 'bold' },
// });

// export default OrderDetailsScreen;
import { View, Text } from 'react-native'
import React from 'react'

export default function OrderDetailsScreen() {
  return (
    <View>
      <Text>OrderDetailsScreen</Text>
    </View>
  )
}