import React, { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShoppingCart, Search as SearchIcon } from 'lucide-react'
import Breadcrumb from '../components/Breadcrumb'
import './SearchResults.css'
import { applyDiscountToProduct } from '../utils/productDiscounts'
import WishlistToggle from '../components/WishlistToggle'

function SearchResults({ products = [], addToCart, searchTerm = '', setSearchTerm }) {
  const location = useLocation()
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 8

  const queryTerm = useMemo(() => {
    const params = new URLSearchParams(location.search)
    return params.get('q') || ''
  }, [location.search])

  // Sync query param with shared search state so header input reflects it
  useEffect(() => {
    setCurrentPage(1)
    setSearchTerm(prev => (prev === queryTerm ? prev : queryTerm))
  }, [queryTerm, setSearchTerm])

  const normalizedTerm = (queryTerm || '').trim().toLowerCase()

  const searchResults = useMemo(() => {
    if (!normalizedTerm) return []
    return products
      .filter(p => !p.exclusive)
      .filter(p => {
        const name = (p.name || '').toLowerCase()
        const category = (p.category || '').toLowerCase()
        const description = (p.description || '').toLowerCase()
        const petType = (p.petType || '').toLowerCase()
        return (
          name.includes(normalizedTerm) ||
          category.includes(normalizedTerm) ||
          description.includes(normalizedTerm) ||
          petType.includes(normalizedTerm)
        )
      })
  }, [products, normalizedTerm])

  const totalPages = Math.ceil(searchResults.length / productsPerPage) || 1
  const startIndex = (currentPage - 1) * productsPerPage
  const endIndex = startIndex + productsPerPage
  const paginatedProducts = searchResults.slice(startIndex, endIndex)

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
    <div className="search-page">
      <Breadcrumb />

      {/* Header */}
      <div className="search-header">
        <div className="search-title-wrapper">
          <SearchIcon size={32} className="search-icon" />
          <div>
            <h1>Resultados de búsqueda</h1>
            <p className="search-subtitle">
              {normalizedTerm ? `Coincidencias para "${queryTerm}"` : 'Escribe el producto que necesitas'}
            </p>
          </div>
        </div>
        <p className="search-count">
          {searchResults.length} resultado{searchResults.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Grid de resultados */}
      {normalizedTerm && paginatedProducts.length === 0 ? (
        <div className="no-products">
          <h2>No encontramos coincidencias</h2>
          <Link to="/" className="back-button">Volver a productos</Link>
        </div>
      ) : (
        <div className="search-grid">
          {paginatedProducts.map(product => {
            const p = applyDiscountToProduct(product)
            const displayPrice = p.discountPercentage > 0 ? p.discountedPrice : product.price
            return (
              <div key={product.id} className="search-card">
                <Link to={`/product/${product.id}`} className="search-link">
                  <div className="search-image-wrapper">
                    <WishlistToggle productId={product.id} />
                    <img
                      src={product.image || 'https://via.placeholder.com/300x300?text=Producto'}
                      alt={product.name}
                      className="search-image"
                    />
                    {p.discountPercentage > 0 && (
                      <div className="search-discount-badge">-{p.discountPercentage}%</div>
                    )}
                    {product.stock <= 10 && (
                      <span className="search-stock-badge">¡Últimas unidades!</span>
                    )}
                  </div>
                  <div className="search-info">
                    <p className="search-brand">{product.petType === 'ambos' ? 'PERROS Y GATOS' : (product.petType || '').toUpperCase()}</p>
                    <h3 className="search-name">{product.name}</h3>
                    <p className="search-category">{product.category}</p>
                    <div className="search-pricing">
                      {p.discountPercentage > 0 && (
                        <span className="search-original-price">
                          {formatPrice(p.originalPrice)}
                        </span>
                      )}
                      <span className="search-current-price">
                        {formatPrice(displayPrice)}
                      </span>
                    </div>
                    <p className={`search-stock-info ${product.stock === 0 ? 'out-of-stock' : ''}`}>
                      {product.stock > 0 ? `${product.stock} disponibles` : 'Agotado'}
                    </p>
                  </div>
                </Link>
                <button
                  className="search-add-to-cart"
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

      {/* Paginación */}
      {normalizedTerm && totalPages > 1 && (
        <div className="pagination-bottom">
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Anterior
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
            <button
              key={pageNum}
              className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
              onClick={() => handlePageChange(pageNum)}
            >
              {pageNum}
            </button>
          ))}
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  )
}

export default SearchResults
