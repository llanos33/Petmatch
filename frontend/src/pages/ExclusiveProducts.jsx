import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { applyDiscountToProduct } from '../utils/productDiscounts'
import { ShoppingCart, Star } from 'lucide-react'
import BackHomeButton from '../components/BackHomeButton'
import './ExclusiveProducts.css'
import WishlistToggle from '../components/WishlistToggle'

function ExclusiveProducts({ products = [], addToCart }) {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="exclusive-page">
        <div className="exclusive-cta">
          <Star size={32} />
          <div>
            <h2>Productos Exclusivos</h2>
            <p>Debes iniciar sesión para ver esta sección.</p>
            <Link to="/login" className="back-button">Iniciar sesión</Link>
          </div>
        </div>
      </div>
    )
  }

  if (!user.isPremium) {
    return (
      <div className="exclusive-page">
        <div className="exclusive-cta">
          <Star size={32} />
          <div>
            <h2>Productos Exclusivos</h2>
            <p>Esta sección está reservada para usuarios Premium.</p>
            <Link to="/premium" className="back-button">Hacerse Premium</Link>
          </div>
        </div>
      </div>
    )
  }

  const [petFilter, setPetFilter] = React.useState('todos')

  const exclusiveProducts = products
    .filter(p => p.exclusive)
    .filter(p => {
      if (petFilter === 'todos') return true
      if (petFilter === 'perro') return p.petType === 'perro' || p.petType === 'ambos'
      if (petFilter === 'gato') return p.petType === 'gato' || p.petType === 'ambos'
      return true
    })

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(price)
  }

  return (
    <div className="exclusive-page">
      <BackHomeButton />

      {/* Header */}
      <div className="exclusive-header">
        <div className="exclusive-title-wrapper">
          <Star size={32} className="exclusive-icon" />
          <div>
            <h1>Productos Exclusivos</h1>
            <p className="exclusive-subtitle">Solo para miembros Premium</p>
          </div>
        </div>
        <p className="exclusive-count">{exclusiveProducts.length} productos exclusivos</p>
      </div>

      <div className="exclusive-filter">
        <span>Ver:</span>
        <div className="exclusive-filter-buttons">
          <button
            className={`exclusive-filter-btn ${petFilter === 'todos' ? 'active' : ''}`}
            onClick={() => setPetFilter('todos')}
          >
            Todos
          </button>
          <button
            className={`exclusive-filter-btn ${petFilter === 'perro' ? 'active' : ''}`}
            onClick={() => setPetFilter('perro')}
          >
            Perro
          </button>
          <button
            className={`exclusive-filter-btn ${petFilter === 'gato' ? 'active' : ''}`}
            onClick={() => setPetFilter('gato')}
          >
            Gato
          </button>
        </div>
      </div>

      {exclusiveProducts.length === 0 ? (
        <div className="no-products">
          <h2>No hay productos exclusivos disponibles por el momento</h2>
          <Link to="/" className="back-button">Volver a productos</Link>
        </div>
      ) : (
        <div className="exclusive-grid">
          {exclusiveProducts.map(product => {
            const p = applyDiscountToProduct(product)
            const displayPrice = p.discountPercentage > 0 ? p.discountedPrice : product.price
            return (
              <div key={product.id} className="exclusive-card">
                <Link to={`/product/${product.id}`} className="exclusive-link">
                  <div className="exclusive-image-wrapper">
                    <WishlistToggle productId={product.id} />
                    <img
                      src={product.image || 'https://via.placeholder.com/300x300?text=Producto'}
                      alt={product.name}
                      className="exclusive-image"
                    />
                    <div className="exclusive-badge">Exclusivo</div>
                    {p.discountPercentage > 0 && (
                      <div className="exclusive-discount-badge">-{p.discountPercentage}%</div>
                    )}
                    {product.stock <= 10 && (
                      <span className="exclusive-stock-badge">¡Últimas unidades!</span>
                    )}
                  </div>
                  <div className="exclusive-info">
                    <p className="exclusive-brand">{product.petType === 'ambos' ? 'PERROS Y GATOS' : (product.petType || '').toUpperCase()}</p>
                    <h3 className="exclusive-name">{product.name}</h3>
                    <p className="exclusive-seller">Acceso preferencial para Premium</p>
                    <div className="exclusive-pricing">
                      {p.discountPercentage > 0 && (
                        <span className="exclusive-original-price">
                          {formatPrice(p.originalPrice)}
                        </span>
                      )}
                      <span className="exclusive-current-price">
                        {formatPrice(displayPrice)}
                      </span>
                    </div>
                    <p className={`exclusive-stock-info ${product.stock === 0 ? 'out-of-stock' : ''}`}>
                      {product.stock > 0 ? `${product.stock} disponibles` : 'Agotado'}
                    </p>
                  </div>
                </Link>
                <button
                  className="exclusive-add-to-cart"
                  onClick={() => addToCart({ ...product, price: displayPrice })}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart size={18} style={{ marginRight: '8px' }} />
                  {product.stock > 0 ? 'Agregar al Carrito' : 'Agotado'}
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ExclusiveProducts
