import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchCart = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const response = await api.get('/cart');
      const items = response.data.items.map(item => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        name: item.product.name,
        price: item.product.discountPrice || item.product.price,
        originalPrice: item.product.price,
        image: item.product.imageUrls[0] || 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800',
        stock: item.product.stock,
        brand: item.product.brand
      }));
      setCart(items);
    } catch (error) {
      console.error('Error fetching cart from server:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sync cart when user signs in or out
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCart([]);
    }
  }, [isAuthenticated]);

  const addToCart = async (product, quantity = 1) => {
    if (!isAuthenticated) {
      return { success: false, message: 'Please login to add items to your cart.' };
    }

    try {
      await api.post('/cart/add', { productId: product.id, quantity });
      await fetchCart(); // Refresh cart
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add item to cart.'
      };
    }
  };

  const updateCartQuantity = async (productId, quantity) => {
    if (!isAuthenticated) return;

    try {
      await api.put('/cart/update', { productId, quantity });
      await fetchCart();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update quantity.'
      };
    }
  };

  const removeFromCart = async (productId) => {
    if (!isAuthenticated) return;

    try {
      await api.delete('/cart/remove', { data: { productId } });
      await fetchCart();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to remove item.'
      };
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  // Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartTax = Math.round(cartSubtotal * 0.18 * 100) / 100;
  const shippingCharge = cartSubtotal > 0 ? 100 : 0;
  const cartTotal = cartSubtotal + cartTax + shippingCharge;
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        fetchCart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartSubtotal,
        cartTax,
        shippingCharge,
        cartTotal,
        cartCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
export default CartContext;
