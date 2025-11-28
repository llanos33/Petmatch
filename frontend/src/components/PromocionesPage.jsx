import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './PromocionesPage.css'
import { Tag, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react'
import BackHomeButton from './BackHomeButton'
import { applyDiscountsToProducts } from '../utils/productDiscounts'
import WishlistToggle from './WishlistToggle'

function PromocionesPage({ products, addToCart }) {
  const [sortBy, setSortBy] = useState('recomendados')
  const [currentPage, setCurrentPage] = useState(1)
  const [petFilter, setPetFilter] = useState('todos')
  const productsPerPage = 8
  

  // Aplicar descuentos a todos los productos usando la función utilitaria
  const discountProducts = applyDiscountsToProducts(products)

  // Filtrar solo productos con descuento > 0 (excluir exclusivos)
  const productsWithDiscount = discountProducts
    .filter(p => p.discountPercentage > 0 && !p.exclusive)
    .filter(p => {
      if (petFilter === 'todos') return true
      if (petFilter === 'perro') return p.petType === 'perro' || p.petType === 'ambos'
      if (petFilter === 'gato') return p.petType === 'gato' || p.petType === 'ambos'
      return true
    })

  // Ordenar productos
  const sortedProducts = [...productsWithDiscount].sort((a, b) => {
    switch (sortBy) {
      case 'precio-asc':
        return a.discountedPrice - b.discountedPrice
      case 'precio-desc':
        return b.discountedPrice - a.discountedPrice
      case 'descuento-desc':
        return b.discountPercentage - a.discountPercentage
      case 'nombre-asc':
        return a.name.localeCompare(b.name)
      case 'nombre-desc':
        return b.name.localeCompare(a.name)
      default:
        return 0
    }
  })

  // Paginación
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage)
  const startIndex = (currentPage - 1) * productsPerPage
  const endIndex = startIndex + productsPerPage
  const paginatedProducts = sortedProducts.slice(startIndex, endIndex)

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(price)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="promociones-page">
      <BackHomeButton />

      {/* Header de la página */}
      <div className="promociones-header">
        <div className="promociones-title-wrapper">
          <Tag size={32} className="promociones-icon" />
          <div>
            <h1>Promociones y Ofertas Especiales</h1>
            <p className="promociones-subtitle">Aprovecha estos increíbles descuentos</p>
          </div>
        </div>
        <p className="promociones-count">{sortedProducts.length} productos en oferta</p>
      </div>

      {/* Barra de ordenamiento y paginación */}
      <div className="filter-bar">
        <div className="pet-filter">
          <label>Ver:</label>
          <div className="pet-filter-buttons">
            <button
              className={`pet-filter-btn ${petFilter === 'todos' ? 'active' : ''}`}
              onClick={() => {
                setPetFilter('todos')
                setCurrentPage(1)
              }}
            >
              Todos
            </button>
            <button
              className={`pet-filter-btn ${petFilter === 'perro' ? 'active' : ''}`}
              onClick={() => {
                setPetFilter('perro')
                setCurrentPage(1)
              }}
            >
              Perro
            </button>
            <button
              className={`pet-filter-btn ${petFilter === 'gato' ? 'active' : ''}`}
              onClick={() => {
                setPetFilter('gato')
                setCurrentPage(1)
              }}
            >
              Gato
            </button>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="pagination-top">
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={20} />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (currentPage <= 3) {
                pageNum = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = currentPage - 2 + i
              }
              return (
                <button
                  key={pageNum}
                  className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </button>
              )
            })}
            {totalPages > 5 && currentPage < totalPages - 2 && <span className="pagination-ellipsis">...</span>}
            {totalPages > 5 && (
              <button
                className="pagination-btn"
                onClick={() => handlePageChange(totalPages)}
              >
                {totalPages}
              </button>
            )}
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      {/* Grid de productos con descuento */}
      {paginatedProducts.length === 0 ? (
        <div className="no-products">
          <h2>No hay promociones disponibles en este momento</h2>
          <Link to="/" className="back-button">Volver a productos</Link>
        </div>
      ) : (
        <>
          <div className="promociones-grid">
            {paginatedProducts.map(product => (
              <div key={product.id} className="promocion-card">
                <Link to={`/product/${product.id}`} className="promocion-link">
                  <div className="promocion-image-wrapper">
                    <WishlistToggle productId={product.id} />
                    <img
                      src={product.image || 'https://via.placeholder.com/300x300?text=Producto'}
                      alt={product.name}
                      className="promocion-image"
                    />
                    {product.discountPercentage > 0 && (
                      <div className="promocion-badge">
                        -{product.discountPercentage}%
                      </div>
                    )}
                    {product.stock <= 10 && (
                      <span className="promocion-stock-badge">¡Últimas unidades!</span>
                    )}
                  </div>
                  <div className="promocion-info">
                    <p className="promocion-brand">{product.petType === 'ambos' ? 'PERROS Y GATOS' : product.petType.toUpperCase()}</p>
                    <h3 className="promocion-name">{product.name}</h3>
                    <p className="promocion-seller">Por PetMatch</p>
                    <div className="promocion-pricing">
                      <span className="promocion-original-price">
                        {formatPrice(product.originalPrice)}
                      </span>
                      <span className="promocion-current-price">
                        {formatPrice(product.discountedPrice)}
                      </span>
                    </div>
                    {product.stock > 0 ? (
                      <p className="promocion-stock-info">{product.stock} disponibles</p>
                    ) : (
                      <p className="promocion-stock-info out-of-stock">Agotado</p>
                    )}
                  </div>
                </Link>
                <button
                  className="promocion-add-to-cart"
                  onClick={() => addToCart({ ...product, price: product.discountedPrice })}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart size={18} style={{ marginRight: '8px' }} />
                  {product.stock > 0 ? 'Agregar al Carrito' : 'Agotado'}
                </button>
              </div>
            ))}
          </div>

          {/* Paginación inferior */}
          {totalPages > 1 && (
            <div className="pagination-bottom">
              <button
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={20} />
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }
                return (
                  <button
                    key={pageNum}
                    className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                )
              })}
              {totalPages > 5 && currentPage < totalPages - 2 && <span className="pagination-ellipsis">...</span>}
              {totalPages > 5 && (
                <button
                  className="pagination-btn"
                  onClick={() => handlePageChange(totalPages)}
                >
                  {totalPages}
                </button>
              )}
              <button
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default PromocionesPage

