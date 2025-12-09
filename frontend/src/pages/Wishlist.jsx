import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Sparkles, Clock, Gift, ShoppingCart, CheckCircle, XCircle, Lock } from 'lucide-react'
import Breadcrumb from '../components/Breadcrumb'
import './Wishlist.css'
import { useWishlist } from '../context/WishlistContext'
import { applyDiscountToProduct } from '../utils/productDiscounts'
import { useAuth } from '../context/AuthContext'

function Wishlist({ products = [], addToCart }) {
  const {
    wishlistIds,
    storageError,
    removeFromWishlist,
    clearWishlist
  } = useWishlist()
  const { user } = useAuth()
  const requiresAuth = !user

  const wishlistItems = useMemo(() => {
    const items = wishlistIds
      .map(id => {
        const product = products.find(p => p.id === id)
        return product ? applyDiscountToProduct(product) : null
      })
      .filter(Boolean)
    return items
  }, [wishlistIds, products])

  const totalValue = useMemo(() => {
    return wishlistItems.reduce((sum, product) => {
      const effectivePrice = product?.discountedPrice ?? product?.price ?? 0
      return sum + effectivePrice
    }, 0)
  }, [wishlistItems])

  const handleRemove = (id) => {
    removeFromWishlist(id)
  }

  const handleClear = () => {
    clearWishlist()
  }

  const handleAddToCart = (product) => {
    if (!product) return
    const priceToUse = product.discountedPrice ?? product.price
    addToCart?.({ ...product, price: priceToUse })
  }

  const emptyState = wishlistItems.length === 0

  const recommended = useMemo(() => {
    return products
      .filter(product => !wishlistIds.includes(product.id))
      .slice(0, 4)
  }, [products, wishlistIds])

  if (requiresAuth) {
    return (
      <div className="wishlist">
        <section className="wishlist-locked">
          <div className="wishlist-locked-card">
            <div className="wishlist-locked-icon">
              <Lock size={32} />
            </div>
            <h1>Inicia sesión para guardar tus favoritos</h1>
            <p>
              Para usar tu lista de deseos necesitamos identificarte. Inicia sesión o crea una cuenta y tendrás tus productos guardados en todos tus dispositivos.
            </p>
            <div className="wishlist-locked-actions">
              <Link to="/login" className="wishlist-locked-cta">Iniciar sesión</Link>
              <Link to="/register" className="wishlist-locked-secondary">Crear cuenta</Link>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="wishlist">
      <Breadcrumb />
      <section className="wishlist-hero">
        <div className="wishlist-hero-content">
          <span className="wishlist-pill"><Heart size={16} fill="currentColor" stroke="currentColor" /> Tus favoritos en un solo lugar</span>
          <h1>Lista de deseos</h1>
          <p>
            Guarda productos para regresar cuando estés listo para comprar. Comparte la lista con tu familia
            o úsala como guía para consentir a tu mascota más adelante.
          </p>
          <div className="wishlist-stats">
            <div className="wishlist-stat">
              <Sparkles size={20} />
              <div>
                <span className="wishlist-stat-value">{wishlistItems.length}</span>
                <span className="wishlist-stat-label">Productos guardados</span>
              </div>
            </div>
            <div className="wishlist-stat">
              <Clock size={20} />
              <div>
                <span className="wishlist-stat-value">{wishlistItems.length ? 'Lista activa' : 'Vacía'}</span>
                <span className="wishlist-stat-label">Estado</span>
              </div>
            </div>
            <div className="wishlist-stat">
              <Gift size={20} />
              <div>
                <span className="wishlist-stat-value">${totalValue.toLocaleString('es-CO')}</span>
                <span className="wishlist-stat-label">Valor estimado</span>
              </div>
            </div>
          </div>
          <div className="wishlist-actions">
            <Link to="/" className="wishlist-browse">Descubrir más productos</Link>
            {!emptyState && (
              <button type="button" className="wishlist-clear" onClick={handleClear}>
                Limpiar lista
              </button>
            )}
          </div>
          {storageError && (
            <div className="wishlist-warning" role="alert">
              <XCircle size={18} />
              <span>No pudimos sincronizar tu lista con este dispositivo. Intentaremos de nuevo en el próximo cambio.</span>
            </div>
          )}
        </div>
        <div className="wishlist-hero-card">
          <div className="wishlist-hero-inner">
            <h3>Consejo rápido</h3>
            <p>Haz clic en el corazón de un producto para guardarlo aquí y recibir recordatorios de stock.</p>
            <ul>
              <li>Organiza tus compras por mascota</li>
              <li>Comparte la lista con quien te ayuda</li>
              <li>Recibe alertas de promociones especiales</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="wishlist-content">
        <header className="wishlist-content-header">
          <h2>Tus productos guardados</h2>
          <p>{emptyState ? 'Aún no has agregado favoritos. Explora la tienda y toca el ícono de corazón en cada producto.' : 'Revisa disponibilidad, agrega al carrito o pon recordatorios para más tarde.'}</p>
        </header>

        {emptyState ? (
          <div className="wishlist-empty">
            <div className="wishlist-empty-icon">
              <Heart size={36} fill="currentColor" stroke="currentColor" />
            </div>
            <h3>Tu lista aún está vacía</h3>
            <p>Guarda los productos que llamen tu atención para tenerlos a mano cuando quieras comprarlos.</p>
            <Link to="/" className="wishlist-empty-cta">Ver productos destacados</Link>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlistItems.map(product => (
              <article className="wishlist-card" key={product.id}>
                <div className="wishlist-card-image">
                  <img src={product.image} alt={product.name} loading="lazy" />
                  <button type="button" className="wishlist-remove" onClick={() => handleRemove(product.id)} aria-label="Eliminar de la lista">
                    <Heart size={18} fill="currentColor" stroke="currentColor" />
                  </button>
                </div>
                <div className="wishlist-card-body">
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <div className="wishlist-card-footer">
                    <div>
                      {product.discountPercentage > 0 && (
                        <span className="wishlist-original-price">${product.originalPrice.toLocaleString('es-CO')}</span>
                      )}
                      <span className="wishlist-price">${(product.discountedPrice ?? product.price).toLocaleString('es-CO')}</span>
                    </div>
                    <div className="wishlist-card-actions">
                      <button type="button" className="wishlist-add" onClick={() => handleAddToCart(product)}>
                        <ShoppingCart size={18} /> Añadir al carrito
                      </button>
                      <button type="button" className="wishlist-remove-text" onClick={() => handleRemove(product.id)}>
                        Quitar
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="wishlist-how-it-works">
        <div className="wishlist-how-card">
          <h2>¿Cómo funciona?</h2>
          <div className="wishlist-steps">
            <div className="wishlist-step">
              <span className="wishlist-step-number">1</span>
              <div>
                <h4>Marca tus favoritos</h4>
                <p>Desde cualquier producto, toca el corazón para guardarlo y sincronizarlo con esta lista.</p>
              </div>
            </div>
            <div className="wishlist-step">
              <span className="wishlist-step-number">2</span>
              <div>
                <h4>Organiza y prioriza</h4>
                <p>Clasifica por mascota, ocasión especial o necesidad y mantén tus compras bajo control.</p>
              </div>
            </div>
            <div className="wishlist-step">
              <span className="wishlist-step-number">3</span>
              <div>
                <h4>Compra en el mejor momento</h4>
                <p>Revisa disponibilidad y agrega al carrito cuando aparezca una promoción o tengas todo listo.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="wishlist-badge-card">
          <CheckCircle size={42} />
          <h3>Próximamente</h3>
          <p>Recibirás alertas de precio y podrás compartir tu lista con quien quieras para coordinar compras.</p>
        </div>
      </section>
    </div>
  )
}

export default Wishlist
