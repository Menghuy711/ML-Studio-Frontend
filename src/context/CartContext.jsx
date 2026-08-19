import { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { products } from '../data/products';

// oxlint-disable-next-line react/only-export-components
export const CartContext = createContext();

const getVariantKey = (id, color) => `${id}::${color || ''}`;

// When a product is added without an explicit color (e.g. from a product card),
// resolve it to the product's default color variant from the local product data.
const resolveDefaultVariant = (product) => {
  const p = products.find((prod) => prod.id === product.id);
  const colors = p && p.colors && p.colors.length ? p.colors : undefined;
  if (!colors) return product;
  const defaultColor = colors[0];
  const name = typeof defaultColor === 'string' ? defaultColor : defaultColor?.name;
  const image =
    typeof defaultColor === 'object' && defaultColor?.image
      ? defaultColor.image
      : p.image;
  return {
    ...product,
    color: product.color || name,
    image: product.color ? product.image : image,
  };
};

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  // Load from local storage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cartItems');
    if (!savedCart) return;
    let parsed;
    try {
      parsed = JSON.parse(savedCart);
    } catch {
      localStorage.removeItem('cartItems');
      return;
    }
    if (!Array.isArray(parsed)) return;
    const productImages = Object.fromEntries(
      products.map((p) => [p.id, p.image])
    );
    const migrated = parsed.map((item) => ({
      ...item,
      variantKey: item.variantKey || getVariantKey(item.id, item.color),
      image: item.color
        ? item.image || productImages[item.id]
        : productImages[item.id] || item.image,
    }));
    setCartItems(migrated);
  }, []);

  // Save to local storage whenever cartItems change
  useEffect(() => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch {
      // Storage full / unavailable — ignore, cart still works in-memory.
    }
  }, [cartItems]);

  const addToCart = useCallback((product) => {
    const variant = resolveDefaultVariant(product);
    setCartItems((prevItems) => {
      const key = getVariantKey(variant.id, variant.color);
      const existingItem = prevItems.find((item) => item.variantKey === key);
      if (existingItem) {
        return prevItems.map((item) =>
          item.variantKey === key
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...variant, variantKey: key, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((variantKey) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.variantKey !== variantKey)
    );
  }, []);

  const clearCart = useCallback(() => setCartItems([]), []);

  const updateQuantity = useCallback((variantKey, amount) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.variantKey === variantKey) {
          const newQuantity = Math.max(1, item.quantity + amount);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  }, []);

  const cartTotal = useMemo(
    () =>
      cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ),
    [cartItems]
  );

  const cartCount = useMemo(
    () => cartItems.reduce((count, item) => count + item.quantity, 0),
    [cartItems]
  );

  const value = useMemo(
    () => ({
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      cartCount,
    }),
    [
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      cartCount,
    ]
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}
