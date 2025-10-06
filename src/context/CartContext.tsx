import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Alert } from 'react-native';

// Define types for clarity
interface MenuItem {
  _id: string;
  name: string;
  price: number;
}

interface CartItem {
  item: MenuItem;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: MenuItem) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  totalPrice: number;
  totalItems: number;
}

const CartContext = createContext<CartContextType>({} as CartContextType);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (itemToAdd: MenuItem) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem.item._id === itemToAdd._id);
      if (existingItem) {
        return prevItems.map(cartItem =>
          cartItem.item._id === itemToAdd._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevItems, { item: itemToAdd, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(cartItem =>
          cartItem.item._id === itemId ? { ...cartItem, quantity } : cartItem
        )
      );
    }
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(prevItems => prevItems.filter(cartItem => cartItem.item._id !== itemId));
  };
  
  const clearCart = () => setCartItems([]);

  const totalPrice = cartItems.reduce((sum, cartItem) => sum + cartItem.item.price * cartItem.quantity, 0);
  const totalItems = cartItems.reduce((sum, cartItem) => sum + cartItem.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCart, totalPrice, totalItems }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);