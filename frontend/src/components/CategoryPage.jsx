import React, { useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import './CategoryPage.css'
import WishlistToggle from './WishlistToggle'
import { applyDiscountToProduct } from '../utils/productDiscounts'
import {
  UtensilsCrossed,
  Gamepad2,
  Sparkles,
  Pill,
  SprayCan,
  BedDouble
} from 'lucide-react'

function CategoryPage({ products, addToCart }) {
  const { categoryName } = useParams()
  const [sortBy, setSortBy] = useState('recomendados')
  const [currentPage, setCurrentPage] = useState(1)
  const [petFilter, setPetFilter] = useState('todos')
  const productsPerPage = 8
  

  // Normalizar nombre de categoría
  const normalizedCategory = categoryName?.toLowerCase().replace(/-/g, ' ')
  
  // Filtrar productos por categoría (excluir exclusivos)
  const categoryProducts = products.filter(product => {
    if (product.exclusive) return false
    const productCategory = product.category.toLowerCase()
    return normalizedCategory === 'alimentos' && productCategory === 'alimentos' ||
           normalizedCategory === 'juguetes' && productCategory === 'juguetes' ||
           normalizedCategory === 'accesorios' && productCategory === 'accesorios' ||
           normalizedCategory === 'medicamentos' && productCategory === 'medicamentos' ||
           normalizedCategory === 'higiene' && productCategory === 'higiene' ||
           normalizedCategory === 'camas' && (productCategory === 'camas y casas' || productCategory.includes('cama'))
  })

  // Filtrar por tipo de mascota usando la selección actual
  const filteredByPet = categoryProducts.filter(product => {
    if (petFilter === 'todos') return true
    if (petFilter === 'perro') return product.petType === 'perro' || product.petType === 'ambos'
    if (petFilter === 'gato') return product.petType === 'gato' || product.petType === 'ambos'
    return true
  })

  // Aplicar descuentos a los productos
  const productsWithDiscounts = filteredByPet.map(product => applyDiscountToProduct(product))

  // Ordenar productos (usando precio descontado si hay descuento)
  const sortedProducts = [...productsWithDiscounts].sort((a, b) => {
    const priceA = a.discountedPrice || a.price
    const priceB = b.discountedPrice || b.price
    
    switch (sortBy) {
      case 'precio-asc':
        return priceA - priceB
      case 'precio-desc':
        return priceB - priceA
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

  const categoryMeta = useMemo(() => {
    const metaMap = {
      'alimentos': {
        title: 'Alimentos para Mascotas',
        subtitle: 'Recetas nutritivas para cada edad y tamaño',
        icon: UtensilsCrossed
      },
      'juguetes': {
        title: 'Juguetes para Mascotas',
        subtitle: 'Diversión segura para liberar energía positiva',
        icon: Gamepad2
      },
      'accesorios': {
        title: 'Accesorios para Mascotas',
        subtitle: 'Collares, comederos y estilo que acompaña su rutina',
        icon: Sparkles
      },
      'medicamentos': {
        title: 'Medicamentos para Mascotas',
        subtitle: 'Botiquín y soporte veterinario siempre a la mano',
        icon: Pill
      },
      'higiene': {
        title: 'Productos de Higiene',
        subtitle: 'Rutinas de limpieza y cuidado del hogar pet-friendly',
        icon: SprayCan
      },
      'camas': {
        title: 'Camas y Casas para Mascotas',
        subtitle: 'Sueño profundo, refugios cálidos y espacios cómodos',
        icon: BedDouble
      }
    }

    return metaMap[normalizedCategory] || {
      title: 'Productos',
      subtitle: 'Encuentra lo mejor para tu compañero de vida',
      icon: Sparkles
    }
  }, [normalizedCategory])

  return (
    <div className="category-page">
      {/* Encabezado hero */}
      <div className="category-hero">
        <div className="category-hero-left">
          <div className="category-hero-icon">
            {categoryMeta.icon && React.createElement(categoryMeta.icon, { size: 26 })}
          </div>
          <div className="category-hero-copy">
            <h1>{categoryMeta.title}</h1>
            <p>{categoryMeta.subtitle}</p>
          </div>
        </div>
        <div className="category-hero-count">
          <span>{sortedProducts.length}</span>
          <span>productos</span>
        </div>
      </div>

      {/* Barra de ordenamiento y paginación */}
      <div className="filter-bar">
        <div className="filter-controls">
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

          <div className="sort-section">
            <label htmlFor="sort-select">Ordenar por:</label>
            <select 
              id="sort-select"
              value={sortBy} 
              onChange={(e) => {
                setSortBy(e.target.value)
                setCurrentPage(1)
              }}
              className="sort-select"
            >
              <option value="recomendados">Recomendados</option>
              <option value="precio-asc">Precio: Menor a Mayor</option>
              <option value="precio-desc">Precio: Mayor a Menor</option>
              <option value="nombre-asc">Nombre: A-Z</option>
              <option value="nombre-desc">Nombre: Z-A</option>
            </select>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="pagination-top">
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              ‹
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
              ›
            </button>
          </div>
        )}
      </div>

      {/* Grid de productos */}
      {paginatedProducts.length === 0 ? (
        <div className="no-products">
          <h2>No hay productos en esta categoría</h2>
          <Link to="/" className="back-button">Volver a productos</Link>
        </div>
      ) : (
        <>
          <div className="products-grid-category">
            {paginatedProducts.map(product => {
              const productWithDiscount = applyDiscountToProduct(product)
              return (
                <div key={product.id} className="product-card-category">
                  <Link to={`/product/${product.id}`} className="product-link-category">
                    <div className="product-image-wrapper">
                      <WishlistToggle productId={product.id} />
                      <img
                        src={product.image || 'https://via.placeholder.com/300x300?text=Producto'}
                        alt={product.name}
                        className="product-image-category"
                      />
                      {productWithDiscount.discountPercentage > 0 && (
                        <span className="stock-badge-category" style={{ background: '#EF4444' }}>
                          -{productWithDiscount.discountPercentage}%
                        </span>
                      )}
                      {product.stock <= 10 && !productWithDiscount.discountPercentage && (
                        <span className="stock-badge-category">¡Últimas unidades!</span>
                      )}
                    </div>
                    <div className="product-info-category">
                      <p className="product-brand">{product.petType === 'ambos' ? 'PERROS Y GATOS' : product.petType.toUpperCase()}</p>
                      <h3 className="product-name-category">{product.name}</h3>
                      <p className="product-seller">Por PetMatch</p>
                      <div className="product-pricing">
                        {productWithDiscount.discountPercentage > 0 ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            <span style={{ textDecoration: 'line-through', color: '#94A3B8', fontSize: '0.875rem' }}>
                              {formatPrice(productWithDiscount.originalPrice)}
                            </span>
                            <span className="current-price" style={{ color: '#EF4444' }}>
                              {formatPrice(productWithDiscount.discountedPrice)}
                            </span>
                          </div>
                        ) : (
                          <span className="current-price">{formatPrice(product.price)}</span>
                        )}
                      </div>
                      {product.stock > 0 ? (
                        <p className="product-stock-info">{product.stock} disponibles</p>
                      ) : (
                        <p className="product-stock-info out-of-stock">Agotado</p>
                      )}
                    </div>
                  </Link>
                  <button
                    className="add-to-cart-category"
                    onClick={() => addToCart({ ...product, price: productWithDiscount.discountedPrice })}
                    disabled={product.stock === 0}
                  >
                    Agregar al Carrito
                  </button>
                </div>
              )
            })}
          </div>

          {/* Paginación inferior */}
          {totalPages > 1 && (
            <div className="pagination-bottom">
              <button
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                ‹
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
                ›
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default CategoryPage

