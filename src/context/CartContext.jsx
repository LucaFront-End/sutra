import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useWixClient } from './WixContext';
import { WIX_STORES_APP_ID } from '../lib/wixClient';

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { wixClient, isReady } = useWixClient();
  const [wixCart, setWixCart] = useState(null);
  const [localCart, setLocalCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Fetch the current cart from Wix Headless
  const refreshCart = useCallback(async () => {
    if (!isReady || !wixClient) return;
    try {
      const currentCart = await wixClient.currentCart.getCurrentCart();
      setWixCart(currentCart);
    } catch (err) {
      if (err?.details?.applicationError?.code !== 'OWNED_CART_NOT_FOUND') {
        console.warn('[Cart] Note on fetching Wix cart:', err);
      }
      setWixCart(null);
    }
  }, [wixClient, isReady]);

  // Fetch cart once SDK is ready
  useEffect(() => {
    if (isReady) {
      refreshCart();
    }
  }, [isReady, refreshCart]);

  /**
   * Add a product to the Wix eCommerce cart with local fallback.
   */
  const addToCart = async (product, quantity = 1, selectedVariant = null) => {
    setIsLoading(true);
    let addedToWix = false;

    if (isReady && wixClient && (product._wixId || product.isWixProduct)) {
      try {
        let resolvedVariantId = null;

        if (product.wixVariants && product.wixVariants.length > 0) {
          if (selectedVariant) {
            const matched = product.wixVariants.find((v) => {
              if (!v.choices) return false;
              return Object.values(v.choices).some((val) => val === selectedVariant);
            });
            if (matched) resolvedVariantId = matched._id;
          }
          if (!resolvedVariantId && product.wixVariants.length === 1) {
            resolvedVariantId = product.wixVariants[0]._id;
          }
        }

        const catalogReference = {
          appId: WIX_STORES_APP_ID,
          catalogItemId: product._wixId || product.id,
        };

        if (resolvedVariantId) {
          catalogReference.options = { variantId: resolvedVariantId };
        }

        await wixClient.currentCart.addToCurrentCart({
          lineItems: [{ catalogReference, quantity }],
        });

        await refreshCart();
        addedToWix = true;
      } catch (err) {
        console.warn('[Cart] Wix add failed, falling back to local session cart:', err?.message || err);
      }
    }

    // If not added to Wix (e.g. mock product before Wix sync or offline)
    if (!addedToWix) {
      setLocalCart((prev) => {
        const itemKey = `${product.id}-${selectedVariant || 'default'}`;
        const existing = prev.find((item) => item.key === itemKey);
        if (existing) {
          return prev.map((item) =>
            item.key === itemKey ? { ...item, quantity: item.quantity + quantity } : item
          );
        }
        return [
          ...prev,
          {
            ...product,
            key: itemKey,
            quantity,
            selectedVariant,
            priceNum: product.priceNum || parseFloat(String(product.price || '0').replace(/[^0-9.]/g, '')) || 0,
          },
        ];
      });
    }

    setIsLoading(false);
    setIsCartOpen(true);
  };

  /**
   * Remove item from cart
   */
  const removeFromCart = async (lineItemId) => {
    setIsLoading(true);
    const isWixItem = wixCart?.lineItems?.some((i) => i._id === lineItemId);
    if (isWixItem && wixClient) {
      try {
        const response = await wixClient.currentCart.removeLineItemsFromCurrentCart([lineItemId]);
        setWixCart(response.cart);
      } catch (err) {
        console.error('[Cart] Error removing from Wix cart:', err);
      }
    } else {
      setLocalCart((prev) => prev.filter((i) => (i.key || i.id || i._id) !== lineItemId));
    }
    setIsLoading(false);
  };

  /**
   * Update quantity
   */
  const updateQuantity = async (lineItemId, quantity) => {
    if (quantity <= 0) {
      await removeFromCart(lineItemId);
      return;
    }
    setIsLoading(true);
    const isWixItem = wixCart?.lineItems?.some((i) => i._id === lineItemId);
    if (isWixItem && wixClient) {
      try {
        const response = await wixClient.currentCart.updateCurrentCartLineItemQuantity([
          { _id: lineItemId, quantity },
        ]);
        setWixCart(response.cart);
      } catch (err) {
        console.error('[Cart] Error updating Wix quantity:', err);
      }
    } else {
      setLocalCart((prev) =>
        prev.map((i) => ((i.key || i.id || i._id) === lineItemId ? { ...i, quantity } : i))
      );
    }
    setIsLoading(false);
  };

  /**
   * Clear cart
   */
  const clearCart = async () => {
    setIsLoading(true);
    if (wixClient) {
      try {
        await wixClient.currentCart.deleteCurrentCart();
      } catch (err) {
        console.error('[Cart] Error clearing Wix cart:', err);
      }
    }
    setWixCart(null);
    setLocalCart([]);
    setIsLoading(false);
  };

  /**
   * Redirect to Wix Checkout
   */
  const handleCheckout = async () => {
    setCheckoutLoading(true);
    try {
      if (wixCart?.lineItems?.length && wixClient) {
        const checkout = await wixClient.currentCart.createCheckoutFromCurrentCart({
          channelType: 'WEB',
        });

        const { redirectSession } = await wixClient.redirects.createRedirectSession({
          ecomCheckout: { checkoutId: checkout.checkoutId },
          callbacks: {
            postFlowUrl: window.location.origin,
            thankYouPageUrl: `${window.location.origin}/`,
          },
        });

        if (redirectSession?.fullUrl) {
          window.location.href = redirectSession.fullUrl;
          return;
        }
      }

      alert('Iniciando pasarela de compra segura con Wix eCommerce SUTRA...');
    } catch (err) {
      console.error('[Cart] Checkout redirect error:', err);
      alert('Error al iniciar el checkout de Wix. Por favor intenta nuevamente.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  // Harmonize Wix items & Local items
  const wixLineItems = useMemo(() => {
    return (wixCart?.lineItems || []).map((item) => {
      let image = '/images/cera-blanca.jpg';
      const rawImage = item.image;
      if (typeof rawImage === 'string') {
        if (rawImage.startsWith('http')) {
          image = rawImage;
        } else if (rawImage.startsWith('wix:image://')) {
          const match = rawImage.match(/wix:image:\/\/v1\/([^/]+)\//);
          if (match && match[1]) {
            image = `https://static.wixstatic.com/media/${match[1]}`;
          }
        }
      } else if (rawImage?.url) {
        image = rawImage.url;
      }

      const price = Number(item.price?.amount || 0);

      return {
        id: item._id,
        _id: item._id,
        key: item._id,
        name: item.productName?.translated || item.productName?.original || 'Producto SUTRA',
        price: `$${price.toLocaleString()} MXN`,
        priceNum: price,
        quantity: item.quantity,
        img: image,
        variant: item.descriptionLines?.[0]?.plainText?.translated
          || item.descriptionLines?.[0]?.plainText?.original
          || null,
        isWix: true,
      };
    });
  }, [wixCart]);

  const cartItems = useMemo(() => [...wixLineItems, ...localCart], [wixLineItems, localCart]);

  const getSubtotal = useCallback(() => {
    const wixSubtotal = wixCart?.subtotal?.amount ? Number(wixCart.subtotal.amount) : 0;
    const localSubtotal = localCart.reduce(
      (total, item) => total + (item.priceNum || 0) * (item.quantity || 1),
      0
    );
    return wixSubtotal + localSubtotal;
  }, [wixCart, localCart]);

  const getItemCount = useCallback(() => cartItems.reduce((total, item) => total + (item.quantity || 1), 0), [cartItems]);

  const value = useMemo(() => ({
    cart: wixCart,
    cartItems,
    isCartOpen,
    setIsCartOpen,
    isLoading,
    checkoutLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    handleCheckout,
    getSubtotal,
    getItemCount,
    refreshCart,
  }), [
    wixCart,
    cartItems,
    isCartOpen,
    isLoading,
    checkoutLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    handleCheckout,
    getSubtotal,
    getItemCount,
    refreshCart,
  ]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    return {
      cart: null,
      cartItems: [],
      isCartOpen: false,
      setIsCartOpen: () => {},
      isLoading: false,
      checkoutLoading: false,
      addToCart: () => {},
      removeFromCart: () => {},
      updateQuantity: () => {},
      clearCart: () => {},
      handleCheckout: () => {},
      getSubtotal: () => 0,
      getItemCount: () => 0,
      refreshCart: () => {},
    };
  }
  return context;
};
