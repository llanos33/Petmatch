import React, { useMemo, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Breadcrumb from './Breadcrumb'
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
  const [useVetCoupon, setUseVetCoupon] = useState(false)
  const [vetRewards, setVetRewards] = useState(null)
  // Cargar recompensas del veterinario para detectar cupón emitido este mes
  useEffect(() => {
    const loadVetRewards = async () => {
      try {
        if (!user?.isVeterinarian || !user?.id) return
        const token = localStorage.getItem('token')
        const res = await fetch(`/api/veterinarians/${user.id}/rewards`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (res.ok) {
          const payload = await res.json()
          setVetRewards(payload.data)
        }
      } catch (e) {
        // Silenciar errores en el carrito
      }
    }
    loadVetRewards()
  }, [user?.isVeterinarian, user?.id])

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

  // Detectar si el veterinario tiene cupón activo del mes
  const hasVetCoupon = useMemo(() => {
    if (!user?.isVeterinarian) return false
    // Preferir dato del endpoint de recompensas (solo si no está usado)
    if (vetRewards?.couponIssued && vetRewards?.coupon?.used !== true) return true
    // Fallback al arreglo en el perfil si existe
    const coupons = Array.isArray(user?.coupons) ? user.coupons : []
    const now = new Date()
    const m = now.getMonth() + 1
    const y = now.getFullYear()
    return coupons.some(c => (c.month === m) && (c.year === y) && c.redeemed !== true)
  }, [user, vetRewards])

  // Descuento del cupón: 5% sobre la compra total (incluye envío) tras descuentos de producto y premium
  const couponDiscount = useMemo(() => {
    if (!useVetCoupon || !hasVetCoupon) return 0
    const base = Math.max(0, totalConDescuento - premiumDiscountOnTotal + shippingCost)
    return Math.round(base * 0.05)
  }, [useVetCoupon, hasVetCoupon, totalConDescuento, premiumDiscountOnTotal])

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
      <Breadcrumb />
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
          {hasVetCoupon && (
            <div style={{
              background: '#ECFDF5',
              border: '1px solid #A7F3D0',
              color: '#065F46',
              padding: '12px 14px',
              borderRadius: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px'
            }}>
              <span style={{ fontWeight: 700 }}>Cupón de Veterinario disponible (5% sobre total)</span>
              {!useVetCoupon ? (
                <button
                  className="apply-coupon-btn"
                  onClick={() => setUseVetCoupon(true)}
                  style={{ background: '#10B981', color: 'white', fontWeight: 700, border: 'none', borderRadius: '8px', padding: '8px 12px' }}
                >
                  Usar cupón
                </button>
              ) : (
                <span style={{ fontWeight: 700 }}>Aplicado ✓</span>
              )}
            </div>
          )}
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
          {hasVetCoupon && (
            <div className="summary-row">
              <span>Cupón Veterinario (5% sobre total):</span>
              {useVetCoupon ? (
                <span className="summary-discount">- {formatPrice(couponDiscount)}</span>
              ) : (
                <button
                  className="apply-coupon-btn"
                  onClick={() => setUseVetCoupon(true)}
                  style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#F8FAFC', fontWeight: 600 }}
                >
                  Usar cupón
                </button>
              )}
            </div>
          )}
          {/* Si es elegible pero aún no tiene cupón emitido, permitir generarlo rápidamente */}
          {!hasVetCoupon && vetRewards?.eligible && (
            <div className="summary-row">
              <span>Elegible para cupón (5%):</span>
              <button
                className="apply-coupon-btn"
                onClick={async () => {
                  try {
                    const token = localStorage.getItem('token')
                    const res = await fetch(`/api/veterinarians/${user.id}/coupons`, {
                      method: 'POST',
                      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
                    })
                    const payload = await res.json()
                    if (res.ok && payload.success) {
                      setVetRewards(prev => ({ ...(prev || {}), couponIssued: true }))
                      setUseVetCoupon(true)
                    }
                  } catch (e) {}
                }}
                style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#F8FAFC', fontWeight: 600 }}
              >
                Generar y usar cupón
              </button>
            </div>
          )}
          <div className="summary-row total">
            <span>Total:</span>
            <span>{formatPrice(totalConDescuento - premiumDiscountOnTotal + shippingCost - couponDiscount)}</span>
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
