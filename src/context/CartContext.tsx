import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';
import { Alert } from 'react-native';
import { MenuItem } from '../types'; 

interface CartItem {
  item: MenuItem;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  eventId: string | null;
  addToCart: (item: MenuItem, eventId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalPrice: number;
  totalItems: number;
}

const CartContext = createContext<CartContextType>({} as CartContextType);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [eventId, setEventId] = useState<string | null>(null);

  const addToCart = (itemToAdd: MenuItem, newEventId: string) => {
    // === PROFESSIONAL RESILIENCE CHECK ===
    // If the item itself is missing the required vendorId, prevent corruption.
    if (!itemToAdd.vendorId) {
        console.error('CART CONTEXT ERROR: Attempted to add MenuItem without vendorId.', itemToAdd);
        Alert.alert('Error', 'This menu item is missing vendor information and cannot be added to the cart.');
        return;
    }
    // =====================================

    if (eventId && eventId !== newEventId) {
      Alert.alert(
        "Start a New Cart?",
        "You have items from a different event. Would you like to clear your current cart and start a new one?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Yes, Start New",
            onPress: () => {
              setCartItems([{ item: itemToAdd, quantity: 1 }]);
              setEventId(newEventId);
            },
          },
        ]
      );
      return;
    }

    if (!eventId) setEventId(newEventId);

    setCartItems(prevItems => {
      const existingItem = prevItems.find(ci => ci.item._id === itemToAdd._id);
      if (existingItem) {
        return prevItems.map(ci =>
          ci.item._id === itemToAdd._id ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [...prevItems, { item: itemToAdd, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems(prevItems => prevItems.filter(ci => ci.item._id !== itemId));
    } else {
      setCartItems(prevItems =>
        prevItems.map(ci => (ci.item._id === itemId ? { ...ci, quantity } : ci))
      );
    }
    if (cartItems.length === 1 && quantity <= 0) setEventId(null);
  };
  
  const clearCart = () => {
    setCartItems([]);
    setEventId(null);
  };

  const totalPrice = useMemo(() => 
    cartItems.reduce((sum, ci) => sum + ci.item.price * ci.quantity, 0),
    [cartItems]
  );
  
  const totalItems = useMemo(() => 
    cartItems.reduce((sum, ci) => sum + ci.quantity, 0),
    [cartItems]
  );

  return (
    <CartContext.Provider value={{ cartItems, eventId, addToCart, updateQuantity, clearCart, totalPrice, totalItems }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);