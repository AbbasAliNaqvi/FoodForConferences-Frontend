import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import API from '../../api';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import Icon from 'react-native-vector-icons/Ionicons';

const fetchVendorOrders = () => API.get('/orders/vendor');

const VendorOrdersScreen = ({ navigation }: any) => {
    const { data: ordersResponse, isLoading } = useQuery({
        queryKey: ['vendorOrders'],
        queryFn: fetchVendorOrders,
    });

    const orders = ordersResponse?.data || [];
    
    const renderOrderCard = ({ item }: any) => (
        <View style={styles.card}>
            <View style={{flex: 1}}>
                <Text style={styles.cardOrderId}>Order #{item.orderId}</Text>
                <Text style={styles.cardUser}>For: {item.user?.name || 'N/A'}</Text>
                <Text style={styles.cardDate}>{new Date(item.createdAt).toLocaleTimeString()}</Text>
                {item.items.map((menuItem: any) => (
                    <Text key={menuItem._id} style={styles.cardItem}>- {menuItem.quantity}x {menuItem.menu?.name}</Text>
                ))}
            </View>
            <TouchableOpacity style={styles.verifyButton}>
                <Text style={styles.verifyButtonText}>Verify Pickup</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Incoming Orders</Text>
            {isLoading ? (
                <ActivityIndicator size="large" color={COLORS.primary} style={{marginTop: 50}} />
            ) : (
                <FlatList
                    data={orders}
                    renderItem={renderOrderCard}
                    keyExtractor={item => item._id}
                    contentContainerStyle={{ padding: SIZES.padding }}
                    ListEmptyComponent={<Text style={styles.emptyText}>No active orders right now.</Text>}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    title: { ...FONTS.h1, paddingHorizontal: SIZES.padding, paddingTop: SIZES.padding, color: COLORS.dark },
    emptyText: { textAlign: 'center', marginTop: 50, ...FONTS.body3, color: COLORS.gray },
    card: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.light, borderRadius: SIZES.radius, padding: SIZES.padding, marginBottom: SIZES.padding, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
    cardOrderId: { ...FONTS.h3, color: COLORS.dark },
    cardUser: { ...FONTS.body4, color: COLORS.gray, marginVertical: 4 },
    cardDate: { ...FONTS.body4, color: COLORS.gray, marginBottom: 8},
    cardItem: { ...FONTS.body4, color: COLORS.dark, marginLeft: 8 },
    verifyButton: { backgroundColor: COLORS.success, padding: SIZES.base * 2, borderRadius: SIZES.radius, marginLeft: SIZES.padding },
    verifyButtonText: { ...FONTS.body3, color: COLORS.light, fontWeight: 'bold' }
});


export default VendorOrdersScreen;