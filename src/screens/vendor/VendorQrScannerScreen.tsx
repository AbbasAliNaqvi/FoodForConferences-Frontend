// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
// import { Camera, useCameraDevices } from 'react-native-vision-camera';
// import { useScanBarcodes, BarcodeFormat } from 'vision-camera-code-scanner';
// import { useAuth } from '../../context/AuthContext';
// import axios from 'axios';
// import { COLORS, FONTS } from '../../constants/theme';

// const QRScannerScreen = () => {
//   const { token } = useAuth();
//   const devices = useCameraDevices();
//   const device = devices.back;

//   const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE], {
//     checkInverted: true,
//   });
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (barcodes.length > 0 && !loading) {
//       const qrToken = barcodes[0].displayValue;
//       verifyQR(qrToken);
//     }
//   }, [barcodes]);

//   const verifyQR = async (qrToken: string) => {
//     setLoading(true);
//     try {
//       const res = await axios.post(
//         'http://YOUR_LOCAL_IP:5050/api/orders/verify-qr',
//         { token: qrToken },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       if (res.data.ok) {
//         Alert.alert('Success', `Order ${res.data.orderId} verified!`);
//       } else {
//         Alert.alert('Error', 'Invalid QR token');
//       }
//     } catch (err: any) {
//       console.log(err.response?.data || err.message);
//       Alert.alert('Error', 'Something went wrong');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (device == null) return <Text>No camera detected</Text>;

//   return (
//     <View style={styles.container}>
//       <Camera
//         style={StyleSheet.absoluteFill}
//         device={device}
//         isActive={true}
//         frameProcessor={frameProcessor}
//         frameProcessorFps={5}
//       />
//       {loading && (
//         <View style={styles.loadingOverlay}>
//           <ActivityIndicator size="large" color={COLORS.primary} />
//           <Text style={styles.loadingText}>Verifying QR...</Text>
//         </View>
//       )}
//     </View>
//   );
// };

// export default QRScannerScreen;

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   loadingOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(0,0,0,0.6)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: { color: COLORS.light, ...FONTS.body3, marginTop: 10 },
// });
import { View, Text } from 'react-native'
import React from 'react'

export default function VendorQrScannerScreen() {
  return (
    <View>
      <Text>VendorQrScannerScreen</Text>
    </View>
  )
}