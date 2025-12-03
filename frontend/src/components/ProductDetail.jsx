import React, { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import './ProductDetail.css'
import { 
  ArrowLeft, 
  ShoppingCart, 
  Package,
  Plus,
  Minus
} from 'lucide-react'
import { applyDiscountToProduct, applyPremiumDiscount } from '../utils/productDiscounts'
import { useAuth } from '../context/AuthContext'
import WishlistToggle from './WishlistToggle'
import ProductReviews from './ProductReviews'

function ProductDetail({ products, addToCart }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const product = products.find(p => p.id === parseInt(id))
  const [quantity, setQuantity] = useState(1)
  const { user } = useAuth()

  if (!product) {
    return (
      <div className="product-detail-container">
        <div className="not-found">
          <h2>Producto no encontrado</h2>
        </div>
      </div>
    )
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(price)
  }

  const productWithDiscount = product ? applyDiscountToProduct(product) : null

  const handleAddToCart = () => {
    if (!productWithDiscount) return
    // prevent non-premium users from adding exclusive products
    if (product.exclusive && !user?.isPremium) {
      // navigate to premium page or show upgrade
      navigate('/premium')
      return
    }
    const priceToAdd = user?.isPremium
      ? applyPremiumDiscount(product, true).discountedPrice
      : productWithDiscount.discountedPrice
    const productToAdd = { ...product, price: priceToAdd }
    for (let i = 0; i < quantity; i++) {
      addToCart(productToAdd)
    }
    navigate('/cart')
  }

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value) || 1
    const maxQuantity = Math.min(value, product.stock)
    setQuantity(maxQuantity)
  }

  return (
    <div className="product-detail-container">
      
      
      <div className="product-detail">
        <div className="product-detail-image" style={{ position: 'relative' }}>
          <WishlistToggle productId={product.id} className="wishlist-toggle-detail" size={20} />
          <img
            src={product.image || 'https://via.placeholder.com/500x500?text=Producto'}
            alt={product.name}
          />
          {productWithDiscount.discountPercentage > 0 && (
            <span style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: '#EF4444',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '50px',
              fontWeight: '700',
              fontSize: '1.25rem',
              boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)'
            }}>
              -{productWithDiscount.discountPercentage}%
            </span>
          )}
        </div>
        
        <div className="product-detail-info">
          <span className="product-detail-category">{product.category} • {product.petType === 'ambos' ? 'Perros y Gatos' : product.petType}</span>
          <h1 className="product-detail-name">{product.name}</h1>
          {productWithDiscount.discountPercentage > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
              <span style={{ textDecoration: 'line-through', color: '#94A3B8', fontSize: '1.25rem' }}>
                {formatPrice(productWithDiscount.originalPrice)}
              </span>
              <p className="product-detail-price" style={{ color: '#EF4444', fontSize: '2rem' }}>
                {formatPrice(productWithDiscount.discountedPrice)}
              </p>
            </div>
          ) : (
            <p className="product-detail-price">{formatPrice(product.price)}</p>
          )}
          
          <div className="product-detail-description">
            <h3>Descripción</h3>
            <p>{product.description}</p>
          </div>

          <div className="product-detail-stock">
            <Package size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            {product.stock > 0 ? <span>{product.stock} unidades</span> : <span className="out-of-stock">Agotado</span>}
          </div>

          {product.exclusive && !user?.isPremium ? (
            <div className="exclusive-cta">
              <p>Este producto es exclusivo para usuarios Premium.</p>
              <Link to="/premium" className="btn">Hazte Premium</Link>
            </div>
          ) : product.stock > 0 ? (
            <div className="product-detail-actions">
              <div className="quantity-selector">
                <label htmlFor="quantity">Cantidad:</label>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="quantity-input"
                />
              </div>
              <button
                className="add-to-cart-btn-large"
                onClick={handleAddToCart}
              >
                <ShoppingCart size={20} style={{ marginRight: '8px' }} />
                Agregar al Carrito
              </button>
            </div>
          ) : (
            <div className="out-of-stock">
              <p>Este producto está agotado</p>
            </div>
          )}
        </div>
      </div>
      
      <ProductReviews productId={product.id} />
    </div>
  )
}

export default ProductDetail


