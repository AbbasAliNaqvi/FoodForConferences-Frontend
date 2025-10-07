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
import { NativeStackScreenProps, StackActions } from '@react-navigation/native-stack';
import { useStripe, PaymentSheetError } from '@stripe/stripe-react-native'; // NEW: Import Stripe hooks
import { useCart } from '../../context/CartContext';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { 
  createOrder, 
  createPaymentIntent, 
  markOrderAsPaid, 
  ApiResponse 
} from '../../api'; 
import Icon from 'react-native-vector-icons/Ionicons';
import { MenuItem, Order } from '../../types'; 

// --- TYPES ---
interface CartItem { item: MenuItem; quantity: number; }
interface CreateOrderResponseData extends Order { _id: string; }
interface CreateIntentResponse { clientSecret: string; intentId: string; }

type RootStackParamList = {
  Cart: undefined;
  Orders: undefined;
  OrderDetails: { orderId: string }; 
};
type Props = NativeStackScreenProps<RootStackParamList, 'Cart'>;

const CartScreen = ({ navigation }: Props) => {
  const { cartItems, updateQuantity, totalPrice, clearCart, eventId } = useCart();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  
  // PROFESSIONALLY: Use the Stripe hooks
  const { initPaymentSheet, presentPaymentSheet } = useStripe(); 

  /**
   * Executes the secure Stripe Payment Sheet flow.
   * @param orderId The ID of the pre-created order.
   * @param amount The total amount to be charged.
   * @returns A Promise that resolves when the order is marked as paid on the backend.
   */
  const executePaymentFlow = async (orderId: string, amount: number) => {
    // 1. Create a Payment Intent on your backend
    // Amount must be in cents. API response should contain clientSecret.
    const intentResponse = 
      await createPaymentIntent(Math.round(amount * 100)) as ApiResponse<CreateIntentResponse>;
    
    const { clientSecret, intentId } = intentResponse.data;
    
    if (!clientSecret) {
      throw new Error('Payment service failed to provide a client secret.');
    }

    // 2. Initialize the Payment Sheet UI
    const { error: initError } = await initPaymentSheet({
      paymentIntentClientSecret: clientSecret,
      merchantDisplayName: 'Your Food Vendor', // REQUIRED by Stripe
      allowsDelayedPaymentMethods: true, // Allows payment methods that take time
      // customerId: 'cus_xyz', // Include if you support saved cards
      // customerEphemeralKeySecret: 'ek_xyz', // Include if you support saved cards
    });

    if (initError) {
      console.error('Stripe Init Error:', initError);
      throw new Error(initError.message || 'Payment setup failed.');
    }

    // 3. Present the Payment Sheet UI to the user
    const { error: paymentError } = await presentPaymentSheet();

    if (paymentError) {
      // Handle user cancellation (common case)
      if (paymentError.code === PaymentSheetError.Canceled) {
        throw new Error('Payment was cancelled by the user.');
      }
      
      // Handle other payment errors (e.g., declined card)
      console.error('Stripe Payment Error:', paymentError);
      throw new Error(paymentError.message || 'Payment failed.');
    }

    // 4. Payment succeeded client-side - Finalize order on the backend
    // We use the intentId from our backend's creation response, 
    // but in a real-world scenario, you might also rely on the webhook.
    // However, marking it paid here provides immediate feedback.
    return markOrderAsPaid(orderId, intentId);
  };

  const handleCreateOrder = async () => {
    const validCartItems = cartItems.filter(ci => ci.item?._id && ci.quantity > 0);
    if (validCartItems.length === 0 || !eventId) {
      Alert.alert('Error', 'Cart is empty or event is missing.');
      return;
    }
    
    // PROFESSIONALLY: Ensure vendorId logic is robust (e.g., all items belong to one vendor)
    const vendorId = validCartItems[0].item.vendorId;
    const itemsPayload = validCartItems.map(ci => ({
      itemId: ci.item._id.toString(),
      vendorId: ci.item.vendorId,
      qty: ci.quantity,
      price: ci.item.price,
    }));
    const payload = { eventId, vendorId, items: itemsPayload, totalAmount: totalPrice };

    setIsPlacingOrder(true);
    let orderIdToCleanup: string | null = null; 

    try {
      // 1. Create the Order in PENDING status
      const orderCreationResponse = 
        await createOrder(payload) as ApiResponse<CreateOrderResponseData>;
      const orderId = orderCreationResponse.data._id;
      orderIdToCleanup = orderId; // Save ID in case payment fails
      
      // 2. Execute Payment Flow - This will block until the user pays or cancels
      await executePaymentFlow(orderId, totalPrice);

      // 3. Finalize and Navigate (Only reached if payment and markOrderAsPaid succeed)
      clearCart();
      
      Alert.alert('Order Placed!', `Your order has been confirmed.`, [
        {
          text: 'VIEW ORDER',
          onPress: () => {
            navigation.dispatch(
              StackActions.replace('Orders', { orderId: orderId }) 
            );
          },
        },
      ]);
    } catch (error: any) {
      const errorMsg = error.message || 'An unknown error occurred.';
      
      // PROFESSIONALLY: If order was created but payment failed/cancelled, 
      // you should handle the cleanup (e.g., cancel the order on the backend).
      if (orderIdToCleanup) {
        // Here you would call an API like: await cancelOrder(orderIdToCleanup);
        console.warn(`Order ${orderIdToCleanup} created but payment failed. Needs cleanup.`);
      }

      // Provide user-friendly message
      const alertTitle = errorMsg.includes('cancelled') ? 'Payment Cancelled' : 'Payment Failed';
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
          disabled={isPlacingOrder || item.quantity <= 1}
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
    marginTop:30,
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