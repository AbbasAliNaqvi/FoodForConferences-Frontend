// import React from 'react';
// import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useQuery } from '@tanstack/react-query';
// import QRCode from 'react-native-qrcode-svg';
// import { fetchOrderById } from '../../api';
// import { COLORS, FONTS, SIZES } from '../../constants/theme';

// const OrderQRScreen = ({ route }: any) => {
//   const { orderId } = route.params;

//   const {
//     data: orderResponse,
//     isLoading,
//     isError,
//   } = useQuery({
//     queryKey: ['order', orderId],
//     queryFn: () => fetchOrderById(orderId),
//   });

//   // ✅ FIX: Use the order directly (your API returns the order object, not { data: ... })
//   const order = orderResponse;

//   console.log('API Response for Order:', JSON.stringify(order, null, 2));

//   // ✅ Loading state
//   if (isLoading) {
//     return (
//       <SafeAreaView style={[styles.container, styles.centerContent]}>
//         <ActivityIndicator size="large" color={COLORS.light} />
//       </SafeAreaView>
//     );
//   }

//   // ✅ FIX: Check for _id (your order object doesn't have orderId)
//   if (isError || !order || !order._id) {
//     return (
//       <SafeAreaView style={[styles.container, styles.centerContent]}>
//         <Text style={styles.header}>Order Not Found</Text>
//         <Text style={styles.subHeader}>
//           Could not load order details. Please try again.
//         </Text>
//       </SafeAreaView>
//     );
//   }

//   // ✅ Generate QR value
//   const qrValue = JSON.stringify({
//     orderId: order._id,
//     verificationToken: order.qrToken,
//   });

//   return (
//     <SafeAreaView style={styles.container}>
//       <Text style={styles.header}>Ready for Pickup</Text>
//       <Text style={styles.subHeader}>Present this QR code to the vendor</Text>

//       <View style={styles.qrContainer}>
//         <QRCode value={qrValue} size={SIZES.width * 0.7} />
//       </View>

//       {/* ✅ Show order ID and total */}
//       <Text style={styles.orderId}>Order #{order._id.slice(-6)}</Text>
//       <Text style={styles.total}>Total: ${order.total.toFixed(2)}</Text>
//       <Text style={styles.status}>
//         Status: {order.orderStatus?.toUpperCase() || 'UNKNOWN'}
//       </Text>
//     </SafeAreaView>
//   );
// };

// // --- 💅 Styles ---
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.primary,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: SIZES.padding,
//   },
//   centerContent: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   header: {
//     ...FONTS.h1,
//     color: COLORS.light,
//     textAlign: 'center',
//   },
//   subHeader: {
//     ...FONTS.body3,
//     color: `${COLORS.light}90`,
//     textAlign: 'center',
//     marginTop: SIZES.base,
//   },
//   qrContainer: {
//     backgroundColor: COLORS.light,
//     padding: SIZES.padding * 1.5,
//     borderRadius: SIZES.radius * 2,
//     marginVertical: SIZES.padding * 2,
//   },
//   orderId: {
//     ...FONTS.h2,
//     color: COLORS.light,
//     marginTop: SIZES.base,
//   },
//   total: {
//     ...FONTS.h3,
//     color: `${COLORS.light}90`,
//     marginTop: 4,
//   },
//   status: {
//     ...FONTS.body3,
//     color: `${COLORS.light}80`,
//     marginTop: 2,
//   },
// });

// export default OrderQRScreen;
import { View, Text } from 'react-native'
import React from 'react'

export default function OrderQRScreen() {
  return (
    <View>
      <Text>OrderQRScreennnnnnnn</Text>
    </View>
  )
}