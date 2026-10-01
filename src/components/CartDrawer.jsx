import React from 'react';
import { useCart } from '../context/CartContext';
import './CartDrawer.css';

export default function CartDrawer({
  isOpen: propIsOpen,
  onClose: propOnClose,
  cartItems: propCartItems,
  onUpdateQuantity: propOnUpdateQuantity,
  onNavigate,
}) {
  const cartContext = useCart();

  const isCartOpen = propIsOpen !== undefined ? propIsOpen : cartContext.isCartOpen;
  const onClose = propOnClose || (() => cartContext.setIsCartOpen(false));
  const cartItems = propCartItems !== undefined ? propCartItems : cartContext.cartItems;
  const onUpdateQuantity = propOnUpdateQuantity || cartContext.updateQuantity;
  const { handleCheckout, checkoutLoading, getSubtotal } = cartContext;

  if (!isCartOpen) return null;

  const total = getSubtotal ? getSubtotal() : cartItems.reduce((acc, item) => acc + (item.priceNum || 0) * (item.quantity || 1), 0);

  return (
    <div className="cart-drawer-overlay" onClick={onClose}>
      <aside className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="cart-drawer-header">
          <div className="cart-drawer-title-wrap">
            <span className="cart-drawer-eyebrow">Tu Selección</span>
            <h2 className="cart-drawer-title">Bolsa de Rituales</h2>
          </div>
          <button className="cart-drawer-close" onClick={onClose} aria-label="Cerrar bolsa">✕</button>
        </div>

        <div className="cart-drawer-content">
          {cartItems.length === 0 ? (
            <div className="cart-empty-state">
              <div className="cart-empty-icon">✧</div>
              <h3>Tu bolsa está vacía</h3>
              <p>Aún no has elegido tus elementos de bienestar para hoy.</p>
              <button 
                className="cart-btn-explore"
                onClick={() => {
                  onClose();
                  if (onNavigate) onNavigate('shop');
                }}
              >
                Explorar la Tienda
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item.key || item._id || item.id} className="cart-item-card">
                  <img src={item.img} alt={item.name} className="cart-item-img" />
                  <div className="cart-item-info">
                    <span className="cart-item-mood">{item.emotionalName || (item.variant ? `Opción: ${item.variant}` : 'SUTRA')}</span>
                    <h4 className="cart-item-name">{item.name}</h4>
                    <span className="cart-item-price">{item.price || `$${Number(item.priceNum || 0).toLocaleString()} MXN`}</span>
                    
                    <div className="cart-item-actions">
                      <div className="cart-qty-control">
                        <button 
                          onClick={() => onUpdateQuantity(item.key || item._id || item.id, Math.max(0, item.quantity - 1))}
                          aria-label="Restar una unidad"
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button 
                          onClick={() => onUpdateQuantity(item.key || item._id || item.id, item.quantity + 1)}
                          aria-label="Añadir una unidad"
                        >
                          +
                        </button>
                      </div>
                      <button 
                        className="cart-remove-btn" 
                        onClick={() => onUpdateQuantity(item.key || item._id || item.id, 0)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-shipping-notice">
              <span>✦ Envío gratuito a todo México en compras superiores a $1,200 MXN</span>
            </div>
            <div className="cart-subtotal-row">
              <span>Subtotal estimado</span>
              <strong>${Number(total || 0).toLocaleString()} MXN</strong>
            </div>
            <p className="cart-tax-notice">Impuestos y pasarela de pago segura operada por Wix eCommerce.</p>
            <button
              className="cart-btn-checkout"
              onClick={handleCheckout}
              disabled={checkoutLoading}
            >
              {checkoutLoading ? 'Conectando con Wix Checkout...' : 'Proceder al Pago Seguro'}
            </button>
            <button 
              className="cart-btn-continue" 
              onClick={() => {
                onClose();
                if (onNavigate) onNavigate('shop');
              }}
            >
              Continuar viendo la tienda
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
