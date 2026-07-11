import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Load initial cart data from localStorage if available
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('HaatBariexpress_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Keep localStorage perfectly synced with cart state adjustments
  useEffect(() => {
    localStorage.setItem('HaatBariexpress_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // 1. Add item to cart or increment quantity if it exists
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item._id === product._id);
      if (existingItem) {
        return prevItems.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      // 🚀 Type-safety patch: Ensure price is handled cleanly as a number to avoid NaN errors
      return [...prevItems, { ...product, quantity: 1, price: Number(product.price) }];
    });
  };

  // 2. Update quantity directly (for +/- counter buttons)
  const updateQuantity = (productId, amount) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) => {
          if (item._id === productId) {
            return { ...item, quantity: item.quantity + amount };
          }
          return item;
        })
        // 🚀 Logic patch: If quantity drops to 0, filter it out to clear it from the basket
        .filter((item) => item.quantity > 0)
    );
  };

  // 3. Remove item from cart completely via trash icon
  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== productId));
  };

  // 4. Wipe cart clean
  const clearCart = () => {
    setCartItems([]);
  };

  // Derived state values calculated automatically on state changes
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);