import React, { useMemo, useCallback, useState } from 'react';
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
  const { addToCart, cart } = useCart();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

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
          vendorName: menu.title || `Vendor ${menu.vendorId.slice(-4)}`,
          menus: [],
        };
      }
      grouped[menu.vendorId].menus.push(menu);
    });

    return Object.values(grouped);
  }, [menus]);

  const allTags = useMemo(() => {
    if (!menus) return [];
    const tags = new Set<string>();
    menus.forEach(menu => {
      menu.items.forEach(item => {
        item.tags?.forEach(tag => tags.add(tag));
      });
    });
    return ['all', ...Array.from(tags).map(tag => tag.toLowerCase())]; 
  }, [menus]);

  const handleBuyAndGoToCart = useCallback((item: MenuItem) => {
    addToCart(item, eventId);
    navigation.navigate('Cart' as never);
  }, [eventId, addToCart, navigation]);

  const getCartItemCount = useCallback((itemId: string): number => {
    return cart?.filter(ci => ci.eventId === eventId && ci.item._id === itemId)
               .reduce((sum, ci) => sum + ci.quantity, 0) || 0;
  }, [cart, eventId]);

  const cartItemsCount = useMemo(() => {
    return cart?.filter(ci => ci.eventId === eventId)
               .reduce((sum, item) => sum + item.quantity, 0) || 0;
  }, [cart, eventId]);

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading delicious menus...</Text>
      </View>
    );
  }

  if (isError || !menus) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Icon name="restaurant-outline" size={80} color={COLORS.gray} />
          <Text style={styles.errorText}>Unable to load menus</Text>
          <Text style={styles.errorSubtext}>Please try again later</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={COLORS.dark} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle} numberOfLines={1}>{eventTitle}</Text>
          <Text style={styles.headerSubtitle}>Food & Beverages</Text>
        </View>
        <TouchableOpacity 
          style={styles.cartButton}
          onPress={() => navigation.navigate('Cart' as never)}
        >
          <Icon name="cart" size={24} color={COLORS.dark} />
          {cartItemsCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartItemsCount > 99 ? '99+' : cartItemsCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      {allTags.length > 1 && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}
        >
          {allTags.map(tag => (
            <TouchableOpacity
              key={tag}
              style={[
                styles.filterChip,
                selectedFilter === tag && styles.filterChipActive
              ]}
              onPress={() => setSelectedFilter(tag)}
            >
              <Text style={[
                styles.filterChipText,
                selectedFilter === tag && styles.filterChipTextActive
              ]}>
                {tag.charAt(0).toUpperCase() + tag.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {vendorsWithMenus.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="fast-food-outline" size={80} color={COLORS.gray} />
            <Text style={styles.emptyText}>No menus available yet</Text>
            <Text style={styles.emptySubtext}>Check back soon for delicious options!</Text>
          </View>
        ) : (
          vendorsWithMenus.map(vendorGroup => (
            <View key={vendorGroup.vendorId} style={styles.vendorSection}>
              {/* Vendor Header */}
              <View style={styles.vendorHeader}>
                <View style={styles.vendorIconContainer}>
                  <Icon name="restaurant" size={20} color={COLORS.primary} />
                </View>
                <Text style={styles.vendorName}>{vendorGroup.vendorName}</Text>
              </View>

              {/* Menu Items */}
              {vendorGroup.menus.flatMap(menu =>
                menu.items
                  .filter(item => 
                    selectedFilter === 'all' || 
                    item.tags?.includes(selectedFilter)
                  )
                  .map(item => {
                    const cartCount = getCartItemCount(item._id);
                    const availableStock = item.inventory.total - item.inventory.sold;
                    const stockPercentage = (availableStock / item.inventory.total) * 100;
                    const isLowStock = stockPercentage > 0 && stockPercentage < 20;
                    const isOutOfStock = availableStock <= 0;

                    const displayTags = item.tags ? item.tags.slice(0, 2) : [];
                    const isVegetarian = item.tags?.includes('vegetarian');

                    return (
                      <View key={item._id} style={styles.menuItemCard}>
                        {/* Item Image */}
                        <View style={styles.imageContainer}>
                          <Image 
                            source={{ uri: item.imageUrl || 'https://via.placeholder.com/120' }} 
                            style={styles.itemImage} 
                          />
                          {/* Use tagBadge for the main veg/non-veg indicator */}
                          {isVegetarian !== undefined && ( 
                            <View style={styles.tagBadge}>
                              <Icon 
                                name={isVegetarian ? 'leaf' : 'nutrition'} 
                                size={10} 
                                color={COLORS.light} 
                              />
                            </View>
                          )}
                          {isLowStock && (
                            <View style={styles.lowStockBadge}>
                              <Text style={styles.lowStockText}>Low Stock</Text>
                            </View>
                          )}
                          {isOutOfStock && ( // Add out of stock overlay
                            <View style={styles.outOfStockOverlay}>
                               <Text style={styles.outOfStockText}>Sold Out</Text>
                            </View>
                          )}
                        </View>

                        {/* Item Details */}
                        <View style={styles.itemDetails}>
                          <View style={styles.itemHeader}>
                            <Text style={styles.itemName} numberOfLines={1}>
                              {item.name}
                            </Text>
                            {displayTags.length > 0 && ( 
                              <View style={styles.tagContainer}>
                                {displayTags.map((tag, idx) => (
                                  (tag !== 'vegetarian' && tag !== 'non-vegetarian') && (
                                    <View key={idx} style={styles.miniTag}>
                                      <Text style={styles.miniTagText}>{tag.charAt(0).toUpperCase() + tag.slice(1)}</Text>
                                    </View>
                                  )
                                ))}
                              </View>
                            )}
                          </View>
                          
                          <Text style={styles.itemDescription} numberOfLines={2}>
                            {item.description}
                          </Text>
                          <View style={styles.priceRow}>
                            <View>
                              <Text style={styles.itemPrice}>
                                ₹{item.price.toFixed(0)}
                              </Text>
                              <Text style={styles.stockText}>
                                {availableStock > 0 ? `${availableStock} available` : 'Sold Out'}
                              </Text>
                            </View>

                            {/* Buy Button */}
                            <TouchableOpacity
                              style={[
                                styles.buyButton,
                                isOutOfStock && styles.buyButtonDisabled,
                                cartCount > 0 && styles.buyButtonActive // Kept same color for consistency
                              ]}
                              onPress={() => !isOutOfStock && handleBuyAndGoToCart(item)}
                              disabled={isOutOfStock}
                            >
                              {isOutOfStock ? (
                                <Text style={styles.buyButtonTextDisabled}>Sold Out</Text>
                              ) : cartCount > 0 ? (
                                <View style={styles.addedContainer}>
                                  <Icon name="checkmark-circle" size={18} color={COLORS.white} />
                                  <Text style={styles.buyButtonText}>{cartCount} Added</Text>
                                </View>
                              ) : (
                                <View style={styles.addContainer}>
                                  <Icon name="add-circle-outline" size={18} color={COLORS.white} />
                                  <Text style={styles.buyButtonText}>Add</Text>
                                </View>
                              )}
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    );
                  })
              )}
            </View>
          ))
        )}
        
        {/* Bottom Spacing */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Floating Cart Button */}
      {cartItemsCount > 0 && (
        <TouchableOpacity 
          style={styles.floatingCartButton}
          onPress={() => navigation.navigate('Cart' as never)}
        >
          <View style={styles.floatingCartContent}>
            <View style={styles.floatingCartLeft}>
              <Icon name="cart" size={24} color={COLORS.white} />
              <Text style={styles.floatingCartText}>{cartItemsCount} item{cartItemsCount !== 1 ? 's' : ''}</Text>
            </View>
            <View style={styles.floatingCartRight}>
              <Text style={styles.floatingCartLabel}>View Cart</Text>
              <Icon name="arrow-forward" size={20} color={COLORS.white} />
            </View>
          </View>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

// ---
// Style Sheet

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.background 
  },
  centerContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: SIZES.padding * 2,
  },
  loadingText: {
    ...FONTS.body3,
    color: COLORS.gray,
    marginTop: SIZES.padding,
  },
  errorText: { 
    ...FONTS.h3, 
    color: COLORS.dark,
    marginTop: SIZES.padding,
    fontWeight: '700',
  },
  errorSubtext: {
    ...FONTS.body3,
    color: COLORS.gray,
    marginTop: SIZES.base,
  },
  retryButton: {
    marginTop: SIZES.padding * 2,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.padding * 2,
    paddingVertical: SIZES.base * 1.5,
    borderRadius: SIZES.radius * 2,
  },
  retryButtonText: {
    ...FONTS.body3,
    color: COLORS.white,
    fontWeight: '700',
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base * 1.5,
    backgroundColor: COLORS.white,
    borderBottomWidth: 0.1,
    borderColor: COLORS.primary,
  },
  backButton: { 
    padding: SIZES.base,
    marginRight: SIZES.base,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: { 
    ...FONTS.h3, 
    color: COLORS.dark,
    fontWeight: '700',
  },
  headerSubtitle: {
    ...FONTS.body4,
    color: COLORS.gray,
    marginTop: 2,
  },
  cartButton: {
    padding: SIZES.base,
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    ...FONTS.body5,
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '700',
  },

  // Filters
  filterContainer: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: 0.2445,
    // gap: SIZES.base,

  },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 7,
    borderRadius: SIZES.radius * 2,
    // backgroundColor: COLORS.lightGray + '50',
    marginRight: SIZES.base, 
  },
  filterChipActive: {
    backgroundColor: "#ced2ca94",
  },
  filterChipText: {
    ...FONTS.h3,
    color: COLORS.dark,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: COLORS.white,
  },

  // Content
  scrollContent: { 
    padding: SIZES.padding,
    paddingBottom: SIZES.padding * 8,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: SIZES.padding * 4,
  },
  emptyText: { 
    ...FONTS.h3,
    color: COLORS.dark,
    marginTop: SIZES.padding,
    fontWeight: '700',
  },
  emptySubtext: {
    ...FONTS.body3,
    color: COLORS.gray,
    marginTop: SIZES.base,
  },

  // Vendor Section
  vendorSection: { 
    // marginBottom: SIZES.padding * 2,
  },
  vendorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.padding * 1.5,
    paddingBottom: SIZES.base,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary + '30',
  },
  vendorIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.base,
  },
  vendorName: { 
    ...FONTS.h2, 
    color: COLORS.dark,
    fontWeight: '900',
  },
  
  menuItemCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius * 2,
    padding: SIZES.base * 1.5,
    marginBottom: SIZES.padding,
    shadowColor: '#ffededff',
    shadowOpacity: 0.00001, 
    shadowRadius: 1,    
    elevation: 0.1,      
    borderColor:COLORS.primary,
    borderBottomWidth:5,
    borderRightWidth:5,
  },
  imageContainer: {
    position: 'relative',
    width: 110, 
    height: 110,
    marginRight: SIZES.base,
  },
  itemImage: { 
    width: '100%',
    height: '100%',
    borderRadius: SIZES.radius * 1.5,
    backgroundColor: COLORS.lightGray,
  },
  tagBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lowStockBadge: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: COLORS.danger,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  lowStockText: {
    ...FONTS.body5,
    fontSize: 9,
    color: COLORS.white,
    fontWeight: '700',
  },
  outOfStockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: SIZES.radius * 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outOfStockText: {
    ...FONTS.h4,
    color: COLORS.white,
    fontWeight: '700',
  },
  
  itemDetails: { 
    flex: 1,
    marginLeft: SIZES.base, 
    justifyContent: 'space-between',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemName: { 
    ...FONTS.h4,
    color: COLORS.dark,
    fontWeight: '700',
    flex: 1,
    marginRight: SIZES.base,
    lineHeight: 22, 
  },
  tagContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  miniTag: {
    backgroundColor: COLORS.primary + '15',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  miniTagText: {
    ...FONTS.body5,
    fontSize: 9,
    color: COLORS.primary,
    fontWeight: '600',
  },
  itemDescription: { 
    ...FONTS.body4,
    color: COLORS.gray,
    lineHeight: 18,
    marginTop: 4,
    flexShrink: 1, 
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end', 
    marginTop: SIZES.base,
  },
  itemPrice: { 
    ...FONTS.h3,
    color: COLORS.dark,
    fontWeight: '800',
  },
  stockText: {
    ...FONTS.body5,
    color: COLORS.gray,
    fontSize: 11,
    marginTop: 2,
    fontWeight: '500', 
  },
  
  // Buy Button
  buyButton: {
    backgroundColor: '#e3e3e374',
    borderRadius: SIZES.radius * 1.5,
    paddingVertical: 8, 
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 100,
    height: 40,
  },
  buyButtonActive: {
    backgroundColor: COLORS.primary,
  },
  buyButtonDisabled: {
    backgroundColor: COLORS.gray + '50',
  },
  buyButtonText: { 
    ...FONTS.body4,
    color: COLORS.white,
    fontWeight: '700',
    marginLeft: 4,
    fontSize: 12, 
  },
  buyButtonTextDisabled: {
    ...FONTS.body4,
    color: COLORS.gray,
    fontWeight: '700',
    fontSize: 12,
  },
  addContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Floating Cart
  floatingCartButton: {
    position: 'absolute',
    bottom: SIZES.padding * 2,
    left: SIZES.padding,
    right: SIZES.padding,
    backgroundColor: COLORS.dark,
    borderRadius: SIZES.radius * 2,
    paddingVertical: SIZES.padding,
    paddingHorizontal: SIZES.padding * 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  floatingCartContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  floatingCartLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  floatingCartText: {
    ...FONTS.h4,
    color: COLORS.white,
    fontWeight: '700',
    marginLeft: SIZES.base,
  },
  floatingCartRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  floatingCartLabel: {
    ...FONTS.body3,
    color: COLORS.white,
    fontWeight: '600',
    marginRight: SIZES.base,
  },

  bottomSpacer: {
    height: SIZES.padding * 2,
  },
});

export default EventMenuScreen;