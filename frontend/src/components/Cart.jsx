import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Cart.css'
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Package
} from 'lucide-react'

function Cart({ cart, products, removeFromCart, updateQuantity }) {
  const navigate = useNavigate()
  const { user } = useAuth()

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(price)
  }

  const getPricing = () => {
    return cart.reduce((acc, item) => {
      const product = products.find(p => p.id === item.productId)
      const basePrice = product?.price || 0
      const effectivePrice = item.price ?? basePrice
      const discountPerUnit = Math.max(0, basePrice - effectivePrice)

      acc.totalSinDescuento += basePrice * item.quantity
      acc.totalConDescuento += effectivePrice * item.quantity
      acc.totalDescuento += discountPerUnit * item.quantity
      return acc
    }, { totalSinDescuento: 0, totalConDescuento: 0, totalDescuento: 0 })
  }

  const { totalSinDescuento, totalConDescuento, totalDescuento } = getPricing()
  // Envío: gratis para Premium, tarifa estándar para no-Premium
  const STANDARD_SHIPPING = 8000
  const shippingCost = user?.isPremium ? 0 : STANDARD_SHIPPING
  // Descuento Premium: 10% aplicado sobre el totalConDescuento para usuarios Premium
  const premiumDiscountOnTotal = (user?.isPremium && totalConDescuento > 0)
    ? Math.round(totalConDescuento * 0.10)
    : 0

  if (cart.length === 0) {
    return (
      <div className="cart-container">
        <div className="empty-cart">
          <ShoppingCart size={64} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <h2>Tu carrito está vacío</h2>
          <p>Agrega productos para continuar</p>
          <Link to="/" className="continue-shopping-btn">Seguir Comprando</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-container">
      <h1>Carrito de Compras</h1>

      <div className="cart-content">
        <div className="cart-items">
          {cart.map(item => {
            const product = products.find(p => p.id === item.productId)
            if (!product) return null

            const basePrice = product.price
            const itemPrice = item.price ?? basePrice
            const hasDiscount = itemPrice < basePrice

            return (
              <div key={item.productId} className="cart-item">
                <img
                  src={product.image || 'https://via.placeholder.com/150x150?text=Producto'}
                  alt={product.name}
                  className="cart-item-image"
                />
                <div className="cart-item-info">
                  <div className="cart-item-name-row">
                    <h3 className="cart-item-name">{product.name}</h3>
                    {product.exclusive && user?.isPremium && (
                      <span className="exclusive-chip">Exclusivo</span>
                    )}
                  </div>
                  <div className="cart-item-price">
                    {hasDiscount ? (
                      <>
                        <span className="price-old">{formatPrice(basePrice)}</span>
                        <span className="price-new">{formatPrice(itemPrice)}</span>
                        <span className="badge-discount">
                          -{Math.round(100 - (itemPrice / basePrice) * 100)}%
                        </span>
                      </>
                    ) : (
                      <span className="price-new">{formatPrice(itemPrice)}</span>
                    )}
                  </div>
                  <div className="cart-item-controls">
                    <div className="quantity-controls">
                      <button
                        className="quantity-btn"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="quantity-value">{item.quantity}</span>
                      <button
                        className="quantity-btn"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        disabled={item.quantity >= product.stock}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() => removeFromCart(item.productId)}
                    >
                      <Trash2 size={16} style={{ marginRight: '4px' }} />
                      Eliminar
                    </button>
                  </div>
                </div>
                <div className="cart-item-total">
                  <p className="item-total-price">
                    {formatPrice(itemPrice * item.quantity)}
                  </p>
                  {hasDiscount && (
                    <p className="item-total-savings">
                      Ahorras {formatPrice((basePrice - itemPrice) * item.quantity)}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div className="cart-summary">
          <h2>Resumen de Compra</h2>
          <div className="summary-row">
            <span>Subtotal (sin descuento):</span>
            <span>{formatPrice(totalSinDescuento)}</span>
          </div>
          <div className="summary-row">
            <span>Descuento aplicado (productos):</span>
            <span className="summary-discount">- {formatPrice(totalDescuento)}</span>
          </div>
          {premiumDiscountOnTotal > 0 && (
            <div className="summary-row">
              <span>Descuento Premium (10% sobre total):</span>
              <span className="summary-discount">- {formatPrice(premiumDiscountOnTotal)}</span>
            </div>
          )}
          <div className="summary-row">
            <span>
              <Package size={16} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
              Envío:
            </span>
            <span>{shippingCost === 0 ? 'Gratis (Premium)' : formatPrice(shippingCost)}</span>
          </div>
          <div className="summary-row total">
            <span>Total:</span>
            <span>{formatPrice(totalConDescuento - premiumDiscountOnTotal + shippingCost)}</span>
          </div>
          <button
            className="checkout-btn"
            onClick={() => navigate('/checkout')}
          >
            Proceder al Pago
            <ArrowRight size={18} style={{ marginLeft: '8px' }} />
          </button>
          <Link to="/" className="continue-shopping-link">
            Seguir Comprando
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Cart
