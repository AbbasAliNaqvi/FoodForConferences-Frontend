import React, { useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';

import { useCart } from '../../context/CartContext';
import { fetchMenusByEvent } from '../../api';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { Menu, MenuItem } from '../../types';

type RootStackParamList = {
  EventMenu: { eventId: string; eventTitle: string };
  Cart: undefined; 
};
type Props = NativeStackScreenProps<RootStackParamList, 'EventMenu'>;

interface VendorWithMenus {
  vendorId: string;
  vendorName: string;
  menus: Menu[];
}

const EventMenuScreen = ({ route, navigation }: Props) => {
  const { eventId, eventTitle } = route.params;
  const { addToCart } = useCart();

  const {
    data: menus,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['menus', eventId],
    queryFn: () => fetchMenusByEvent(eventId),
    select: response => response.data as Menu[],
    staleTime: 5 * 60 * 1000,
  });

  const vendorsWithMenus = useMemo((): VendorWithMenus[] => {
    if (!menus) return [];
    const grouped: { [vendorId: string]: VendorWithMenus } = {};

    menus.forEach(menu => {
      if (!grouped[menu.vendorId]) {
        grouped[menu.vendorId] = {
          vendorId: menu.vendorId,
          vendorName: `Vendor ${menu.vendorId.slice(-4)}`,
          menus: [],
        };
      }
      grouped[menu.vendorId].menus.push(menu);
    });

    return Object.values(grouped);
  }, [menus]);

  const handleBuyAndGoToCart = useCallback((item: MenuItem) => {
    // Add the item to the context
    addToCart(item, eventId);

    // Immediately navigate to the Cart/Checkout screen
    navigation.navigate('Cart' as never);

  }, [eventId, addToCart, navigation]);

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (isError || !menus) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Failed to load menus.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back-outline" size={24} color={COLORS.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{eventTitle}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {vendorsWithMenus.length === 0 ? (
          <Text style={styles.emptyText}>No menus available for this event yet.</Text>
        ) : (
          vendorsWithMenus.map(vendorGroup => (
            <View key={vendorGroup.vendorId} style={styles.vendorSection}>
              <Text style={styles.vendorName}>{vendorGroup.vendorName}</Text>
              {vendorGroup.menus.flatMap(menu =>
                menu.items.map(item => {
                    return (
                        <View key={item._id} style={styles.menuItemCard}>
                          <Image source={{ uri: item.imageUrl || 'https://via.placeholder.com/100' }} style={styles.itemImage} />
                          <View style={styles.itemDetails}>
                            <Text style={styles.itemName}>{item.name}</Text>
                            <Text style={styles.itemDescription} numberOfLines={2}>{item.description}</Text>
                            <Text style={styles.itemPrice}>₹{item.price.toFixed(2)}</Text>
                          </View>
                          <TouchableOpacity
                            style={styles.buyButton}
                            onPress={() => handleBuyAndGoToCart(item)}
                          >
                            <Text style={styles.buyButtonText}>BUY</Text>
                          </TouchableOpacity>
                        </View>
                    );
                }),
              )}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { ...FONTS.body3, color: COLORS.danger },
  emptyText: { textAlign: 'center', marginTop: SIZES.padding * 2, ...FONTS.body3 },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  backButton: { padding: SIZES.base },
  headerTitle: { ...FONTS.h2, color: COLORS.dark, marginLeft: SIZES.padding, flex: 1 },

  scrollContent: { padding: SIZES.padding },
  vendorSection: { marginBottom: SIZES.padding * 2 },
  vendorName: { ...FONTS.h1, color: COLORS.dark, marginBottom: SIZES.padding },
  
  menuItemCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.base,
    marginBottom: SIZES.padding,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  itemImage: { width: 80, height: 80, borderRadius: SIZES.radius * 0.5 },
  itemDetails: { flex: 1, marginLeft: SIZES.padding, justifyContent: 'center' },
  itemName: { ...FONTS.h4, color: COLORS.dark, fontWeight: 'bold' },
  itemDescription: { ...FONTS.body5, color: COLORS.gray, marginVertical: 4 },
  itemPrice: { ...FONTS.h4, color: COLORS.primary, fontWeight: 'bold' },
  
  buyButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignSelf: 'center',
    minWidth: 80,
  },
  buyButtonText: { ...FONTS.body4, color: COLORS.white, fontWeight: 'bold', textAlign: 'center' },
});

export default EventMenuScreen;