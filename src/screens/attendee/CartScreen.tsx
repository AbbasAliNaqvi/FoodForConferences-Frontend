import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useCart } from '../../context/CartContext';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { createOrder } from '../../api';
import Icon from 'react-native-vector-icons/Ionicons';

const CartScreen = ({ navigation }: any) => {
  const { cartItems, updateQuantity, totalPrice, clearCart } = useCart();

  const handleCreateOrder = async () => {
    const payload = {
      items: cartItems.map(ci => ({
        menuId: ci.item._id,
        quantity: ci.quantity,
      })),
      total: totalPrice,
    };

    try {
      const { data } = await createOrder(payload);
      clearCart();
      Alert.alert(
        'Order Placed!',
        `Your order #${data.orderId} has been confirmed.`,
        [{ text: 'OK', onPress: () => navigation.navigate('Orders') }],
      );
    } catch (error) {
      Alert.alert('Error', 'Could not place order. Please try again.');
    }
  };

  const renderItem = ({ item }: any) => (
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
        >
          <Icon name="remove-outline" size={20} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.quantityText}>{item.quantity}</Text>
        <TouchableOpacity
          onPress={() => updateQuantity(item.item._id, item.quantity + 1)}
          style={styles.quantityButton}
        >
          <Icon name="add-outline" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>My Cart</Text>
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={item => item.item._id}
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
            style={styles.checkoutButton}
            onPress={handleCreateOrder}
          >
            <Text style={styles.checkoutButtonText}>Place Order</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  title: { ...FONTS.h1, padding: SIZES.padding, color: COLORS.dark },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
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
    borderRadius: SIZES.radius,
    alignItems: 'center',
  },
  checkoutButtonText: { ...FONTS.h3, color: COLORS.light, fontWeight: 'bold' },
});

export default CartScreen;
