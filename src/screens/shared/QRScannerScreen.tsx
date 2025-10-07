// // src/screens/attendee/OrderQRScreen.tsx
// import React from 'react';
// import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useQuery } from '@tanstack/react-query';
// import { fetchOrderById } from '../../api';
// import QRCode from 'react-native-qrcode-svg';
// import { COLORS, FONTS, SIZES } from '../../constants/theme';

// const OrderQRScreen = ({ route }: any) => {
//     const { orderId } = route.params;

//     const { data: orderResponse, isLoading, isError } = useQuery({
//         queryKey: ['order', orderId],
//         queryFn: () => fetchOrderById(orderId),
//     });

//     const order = orderResponse?.data;
    
//     console.log("API Response for Order:", JSON.stringify(order, null, 2));

//     if (isLoading) {
//         return (
//             <SafeAreaView style={[styles.container, styles.centerContent]}>
//                 <ActivityIndicator size="large" color={COLORS.light} />
//             </SafeAreaView>
//         );
//     }

//     // --- THE HARDENED FIX ---
//     // This now checks if the 'order' object has the properties we need.
//     if (isError || !order || !order.orderId) {
//         return (
//             <SafeAreaView style={[styles.container, styles.centerContent]}>
//                 <Text style={styles.header}>Order Not Found</Text>
//                 <Text style={styles.subHeader}>Could not load order details. Please try again.</Text>
//             </SafeAreaView>
//         );
//     }
    
//     const qrValue = JSON.stringify({ orderId: order._id, verificationToken: order.qrToken });

//     return (
//         <SafeAreaView style={styles.container}>
//             <Text style={styles.header}>Ready for Pickup</Text>
//             <Text style={styles.subHeader}>Present this QR code to the vendor</Text>
//             <View style={styles.qrContainer}>
//                 <QRCode value={qrValue} size={SIZES.width * 0.7} />
//             </View>
//             <Text style={styles.orderId}>Order #{order.orderId}</Text>
//             <Text style={styles.total}>Total: ${order.total.toFixed(2)}</Text>
//         </SafeAreaView>
//     );
// };

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', padding: SIZES.padding },
//     centerContent: { justifyContent: 'center', alignItems: 'center' },
//     header: { ...FONTS.h1, color: COLORS.light, textAlign: 'center' },
//     subHeader: { ...FONTS.body3, color: `${COLORS.light}90`, textAlign: 'center', marginTop: SIZES.base },
//     qrContainer: { backgroundColor: COLORS.light, padding: SIZES.padding * 1.5, borderRadius: SIZES.radius * 2, marginVertical: SIZES.padding * 2 },
//     orderId: { ...FONTS.h2, color: COLORS.light },
//     total: { ...FONTS.h3, color: `${COLORS.light}90` }
// });

// export default OrderQRScreen;
import { View, Text } from 'react-native'
import React from 'react'

export default function QRScannerScreen() {
  return (
    <View>
      <Text>QRScannerScreen</Text>
    </View>
  )
}