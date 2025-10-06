import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCart } from '../../context/CartContext';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { createOrder } from '../../api';
import Icon from 'react-native-vector-icons/Ionicons';
import { MenuItem } from '../../types';

interface CartItem {
  item: MenuItem;
  quantity: number;
}

type RootStackParamList = {
  Cart: undefined;
  Orders: undefined;
};
type Props = NativeStackScreenProps<RootStackParamList, 'Cart'>;

const CartScreen = ({ navigation }: Props) => {
  const { cartItems, updateQuantity, totalPrice, clearCart, eventId } =
    useCart();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const handleCreateOrder = async () => {
    const validCartItems = cartItems.filter(ci => ci.item?._id && ci.quantity > 0);

    if (validCartItems.length === 0 || !eventId) {
      console.error('API CALL PREVENTED: Cart is empty or invalid.');
      Alert.alert('Error', 'Cart is empty or event is missing.');
      return;
    }
    
    // Vendor ID is guaranteed to be the same for all items by CartContext logic
    const vendorId = validCartItems[0].item.vendorId;

    const itemsPayload = validCartItems.map(ci => {
      return {
        itemId: ci.item._id.toString(), 
        vendorId: ci.item.vendorId, // <--- FIX APPLIED HERE: ci.item.vendorId
        qty: ci.quantity,
        price: ci.item.price,
      };
    });

    const payload = {
      eventId,
      vendorId, 
      items: itemsPayload,
      totalAmount: totalPrice,
    };
    
    console.log('API CALL START: Creating Order');
    console.log('PAYLOAD:', JSON.stringify(payload, null, 2));

    setIsPlacingOrder(true);
    try {
      const response = await createOrder(payload);
      
      console.log('API CALL SUCCESS: Order created.', response.data);

      clearCart();
      Alert.alert('Order Placed!', `Your order has been confirmed.`, [
        {
          text: 'VIEW ORDER',
          onPress: () => navigation.navigate('Orders' as never),
        },
      ]);
    } catch (error: any) {
      console.error('API CALL FAILED: Order creation failed.', error.response?.data || error.message);
      
      const errorMessage =
        error.response?.data?.message ||
        'We could not process your order. Please try again.';
      Alert.alert('Error Placing Order', errorMessage);
    } finally {
      console.log('API CALL END: Order transaction finished.');
      setIsPlacingOrder(false);
    }
  };

  const handleClearCart = () => {
    Alert.alert('Clear Cart', 'Are you sure you want to remove all items?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Yes, Clear', onPress: clearCart, style: 'destructive' },
    ]);
  };

  const renderItem = ({ item }: { item: CartItem }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.item.name}</Text>
        <Text style={styles.itemPrice}>
          ${(item.item.price * item.quantity).toFixed(2)}
        </Text>
      </View>
      <View style={styles.quantitySelector}>
        <TouchableOpacity
          onPress={() => updateQuantity(item.item._id, item.quantity - 1)}
          style={styles.quantityButton}
          disabled={isPlacingOrder}
        >
          <Icon name="remove-outline" size={20} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.quantityText}>{item.quantity}</Text>
        <TouchableOpacity
          onPress={() => updateQuantity(item.item._id, item.quantity + 1)}
          style={styles.quantityButton}
          disabled={isPlacingOrder}
        >
          <Icon name="add-outline" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Checkout</Text>
        {cartItems.length > 0 && (
          <TouchableOpacity
            onPress={handleClearCart}
            style={styles.clearButton}
            disabled={isPlacingOrder}
          >
            <Icon name="trash-outline" size={24} color={COLORS.danger} />
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={item => item.item._id}
        contentContainerStyle={
          cartItems.length === 0 ? styles.listEmptyContent : null
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>Your cart is empty.</Text>
        }
      />
      {cartItems.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalPrice}>${totalPrice.toFixed(2)}</Text>
          </View>
          <TouchableOpacity
            style={[
              styles.checkoutButton,
              isPlacingOrder && styles.checkoutButtonDisabled,
            ]}
            onPress={handleCreateOrder}
            disabled={isPlacingOrder}
          >
            {isPlacingOrder ? (
              <ActivityIndicator size="small" color={COLORS.light} />
            ) : (
              <Text style={styles.checkoutButtonText}>Place Order & Pay</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  title: { ...FONTS.h1, color: COLORS.dark },
  clearButton: { padding: SIZES.base },
  listEmptyContent: { flexGrow: 1, justifyContent: 'center' },
  emptyText: {
    textAlign: 'center',
    ...FONTS.body3,
    color: COLORS.gray,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
  },
  itemDetails: { flex: 1 },
  itemName: { ...FONTS.h3, color: COLORS.dark },
  itemPrice: { ...FONTS.body3, color: COLORS.gray, marginTop: 4 },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: SIZES.radius,
  },
  quantityButton: { padding: 8 },
  quantityText: { ...FONTS.body2, color: COLORS.dark, paddingHorizontal: 12 },
  footer: {
    padding: SIZES.padding,
    borderTopWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: COLORS.light,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.padding,
  },
  totalLabel: { ...FONTS.h3, color: COLORS.gray },
  totalPrice: { ...FONTS.h2, color: COLORS.dark, fontWeight: 'bold' },
  checkoutButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    marginBottom:80,
    borderRadius: SIZES.radius,
    alignItems: 'center',
  },
  checkoutButtonDisabled: {
    backgroundColor: COLORS.gray,
  },
  checkoutButtonText: { ...FONTS.h3, color: COLORS.light, fontWeight: 'bold' },
});

export default CartScreen;