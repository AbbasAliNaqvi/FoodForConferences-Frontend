import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StatusBar,
  Image,
} from 'react-native';
import {
  NativeStackScreenProps,
  StackActions,
} from '@react-navigation/native-stack';
import { useStripe, PaymentSheetError } from '@stripe/stripe-react-native';
import { useCart } from '../../context/CartContext';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import {
  createOrder,
  createPaymentIntent,
  markOrderAsPaid,
  ApiResponse,
} from '../../api';
import Icon from 'react-native-vector-icons/Ionicons';
import { MenuItem, Order } from '../../types';

interface MenuItem {
  _id: string;
  name: string;
  price: number;
  vendorId: string;
  imageUrl?: string;
}
interface CartItem {
  item: MenuItem;
  quantity: number;
}
interface CreateOrderResponseData extends Order {
  _id: string;
}
interface CreateIntentResponse {
  clientSecret: string;
  intentId: string;
}

type RootStackParamList = {
  Cart: undefined;
  Orders: undefined;
  OrderDetails: { orderId: string };
};
type Props = NativeStackScreenProps<RootStackParamList, 'Cart'>;

const CartScreen = ({ navigation }: Props) => {
  const { cartItems, updateQuantity, totalPrice, clearCart, eventId } =
    useCart();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const executePaymentFlow = async (orderId: string, amount: number) => {
    const intentResponse = (await createPaymentIntent(
      Math.round(amount * 100),
    )) as ApiResponse<CreateIntentResponse>;

    const { clientSecret, intentId } = intentResponse.data;

    if (!clientSecret) {
      throw new Error('Payment service failed to provide a client secret.');
    }

    const { error: initError } = await initPaymentSheet({
      paymentIntentClientSecret: clientSecret,
      merchantDisplayName: 'Your Food Vendor',
      allowsDelayedPaymentMethods: true,
    });

    if (initError) {
      throw new Error(initError.message || 'Payment setup failed.');
    }

    const { error: paymentError } = await presentPaymentSheet();

    if (paymentError) {
      if (paymentError.code === PaymentSheetError.Canceled) {
        throw new Error('Payment was cancelled by the user.');
      }

      throw new Error(paymentError.message || 'Payment failed.');
    }

    return markOrderAsPaid(orderId, intentId);
  };

  const handleCreateOrder = async () => {
    const validCartItems = cartItems.filter(
      ci => ci.item?._id && ci.quantity > 0,
    );
    if (validCartItems.length === 0 || !eventId) {
      Alert.alert('Error', 'Cart is empty or event is missing.');
      return;
    }

    const vendorId = validCartItems[0].item.vendorId;
    const itemsPayload = validCartItems.map(ci => ({
      itemId: ci.item._id.toString(),
      vendorId: ci.item.vendorId,
      qty: ci.quantity,
      price: ci.item.price,
    }));
    const payload = {
      eventId,
      vendorId,
      items: itemsPayload,
      totalAmount: totalPrice,
    };

    setIsPlacingOrder(true);
    let orderIdToCleanup: string | null = null;

    try {
      const orderCreationResponse = (await createOrder(
        payload,
      )) as ApiResponse<CreateOrderResponseData>;
      const orderId = orderCreationResponse.data._id;
      orderIdToCleanup = orderId;

      await executePaymentFlow(orderId, totalPrice);

      clearCart();

      Alert.alert('Order Placed!', `Your order has been confirmed.`, [
        {
          text: 'VIEW ORDER',
          onPress: () => {
            navigation.replace('Orders', { orderId: orderId });
          },
        },
      ]);
    } catch (error: any) {
      const errorMsg = error.message || 'An unknown error occurred.';

      if (orderIdToCleanup) {
        console.warn(
          `Order ${orderIdToCleanup} created but payment failed/cancelled. Needs cleanup.`,
        );
      }

      const alertTitle = errorMsg.includes('cancelled')
        ? 'Payment Cancelled'
        : 'Payment Failed';
      Alert.alert(alertTitle, errorMsg);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const handleClearCart = () => {
    Alert.alert('Clear Cart', 'Are you sure you want to remove all items?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Yes, Clear', onPress: clearCart, style: 'destructive' },
    ]);
  };

  const renderItem = ({ item }: { item: CartItem }) => {
    const itemImage = item.item.imageUrl;

    return (
      <View style={styles.itemContainer}>
        {itemImage ? (
          <Image
            source={{ uri: itemImage }}
            style={styles.itemImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.itemImagePlaceholder}>
            <Icon name="image-outline" size={28} color={COLORS.gray} />
          </View>
        )}

        <View style={styles.itemDetails}>
          <Text style={styles.itemName} numberOfLines={2}>
            {item.item.name}
          </Text>
          <Text style={styles.itemVendor}>
            Vendor ID: {item.item.vendorId.slice(-4)}
          </Text>
        </View>

        <View style={styles.quantityPriceArea}>
          <Text style={styles.itemTotalPrice}>
            INR {(item.item.price * item.quantity).toFixed(2)}
          </Text>

          <View style={styles.quantitySelector}>
            <TouchableOpacity
              onPress={() => updateQuantity(item.item._id, item.quantity - 1)}
              style={styles.quantityButton}
              disabled={isPlacingOrder || item.quantity <= 1}
            >
              <Icon name="remove-outline" size={18} color={COLORS.primary} />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{item.quantity}</Text>
            <TouchableOpacity
              onPress={() => updateQuantity(item.item._id, item.quantity + 1)}
              style={styles.quantityButton}
              disabled={isPlacingOrder}
            >
              <Icon name="add-outline" size={18} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <View style={styles.primaryHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          disabled={isPlacingOrder}
        >
          <Icon name="arrow-back-outline" size={24} color={COLORS.light} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Your Cart</Text>
      </View>

      <View style={styles.contentArea}>
        <View style={styles.headerInner}>
          <Text style={styles.title}>Review Order</Text>
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
            cartItems.length === 0
              ? styles.listEmptyContent
              : styles.flatListContent
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon
                name="cart-outline"
                size={80}
                color={COLORS.gray}
                style={{ marginBottom: SIZES.padding }}
              />
              <Text style={styles.emptyText}>
                Your cart is empty. Start adding items!
              </Text>
            </View>
          }
          style={styles.flatList}
        />
      </View>

      {cartItems.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalSubPrice}>
              INR {totalPrice.toFixed(2)}
            </Text>
          </View>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Fees & Taxes</Text>
            <Text style={styles.totalSubPrice}>INR 2.00</Text>
          </View>
          <View style={styles.totalSeparator} />
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabelFinal}>Total Payable</Text>
            <Text style={styles.totalPriceFinal}>
              INR {(totalPrice + 2.0).toFixed(2)}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.checkoutButton,
              isPlacingOrder || totalPrice <= 0
                ? styles.checkoutButtonDisabled
                : null,
            ]}
            onPress={handleCreateOrder}
            disabled={isPlacingOrder || totalPrice <= 0}
          >
            {isPlacingOrder ? (
              <ActivityIndicator size="small" color={COLORS.light} />
            ) : (
              <Text style={styles.checkoutButtonText}>Proceed to Payment</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray || '#F0F0F0',
  },

  // --- HEADER STYLES ---
  primaryHeader: {
    paddingTop: SIZES.padding * 2.5,
    paddingBottom: SIZES.padding * 1.5,
    paddingHorizontal: SIZES.padding,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: SIZES.radius * 3,
    borderBottomRightRadius: SIZES.radius * 3,
    elevation: 10,
    shadowColor: COLORS.dark,
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  headerTitle: {
    ...FONTS.h2,
    color: COLORS.light,
    fontWeight: '800',
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    left: SIZES.padding,
    top: SIZES.padding * 2.5,
    zIndex: 10,
  },

  contentArea: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
    backgroundColor: COLORS.lightGray || '#F0F0F0',
    overflow: 'visible',
  },

  headerInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.padding,
    marginBottom: SIZES.base,
  },
  title: { ...FONTS.h2, color: COLORS.dark, fontWeight: '700' },
  clearButton: { padding: SIZES.base },

  // --- LIST STYLES ---
  flatList: {
    flex: 1,
    marginTop: SIZES.base,
    overflow: 'visible',
  },
  flatListContent: {
    paddingBottom: SIZES.padding,
    overflow: 'visible',
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 300,
  },
  emptyText: {
    textAlign: 'center',
    ...FONTS.body3,
    color: COLORS.gray,
    fontWeight: '500',
  },

  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius * 1.5,
    marginBottom: SIZES.padding,

    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderBottomWidth: 3,
    borderBottomColor: COLORS.lightGray,
    overflow: 'hidden',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: SIZES.radius,
    marginRight: SIZES.padding,
  },
  itemImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.lightGray,
    marginRight: SIZES.padding,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  itemDetails: { flex: 1, marginRight: SIZES.base },
  itemName: { ...FONTS.h3, color: COLORS.dark, fontWeight: '700' },
  itemVendor: { ...FONTS.body4, color: COLORS.gray, marginTop: 2 },

  quantityPriceArea: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 60,
  },
  itemTotalPrice: {
    ...FONTS.h3,
    color: COLORS.dark,
    fontWeight: '900',
    marginBottom: SIZES.base / 2,
  },

  // Quantity Selector
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: SIZES.radius * 2,
    overflow: 'hidden',
  },
  quantityButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: COLORS.white,
  },
  quantityText: {
    ...FONTS.body3,
    color: COLORS.dark,
    paddingHorizontal: 10,
    fontWeight: 'bold',
    backgroundColor: COLORS.lightGray,
    paddingVertical: 4,
  },

  footer: {
    padding: SIZES.padding * 1.5,
    paddingVertical: 50,
    borderRadius: 40,
    paddingBottom: SIZES.padding * 4,
    borderTopLeftRadius: SIZES.radius * 3,
    borderTopRightRadius: SIZES.radius * 3,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.base * 0.75,
  },
  totalSeparator: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    marginVertical: SIZES.base * 1.5,
  },
  totalLabel: { ...FONTS.body3, color: COLORS.gray, fontWeight: '500' },
  totalSubPrice: { ...FONTS.body3, color: COLORS.dark, fontWeight: '600' },

  totalLabelFinal: { ...FONTS.h3, color: COLORS.dark, fontWeight: '800' },
  totalPriceFinal: { ...FONTS.h3, color: COLORS.primary, fontWeight: '900' },

  checkoutButton: {
    backgroundColor: COLORS.primary,
    padding: 18,
    marginTop: SIZES.padding * 1.5,
    borderRadius: SIZES.radius * 3,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 10,
  },
  checkoutButtonDisabled: {
    backgroundColor: COLORS.gray,
    shadowColor: COLORS.dark,
    shadowOpacity: 0.1,
  },
  checkoutButtonText: { ...FONTS.h3, color: COLORS.light, fontWeight: 'bold' },
});

export default CartScreen;
