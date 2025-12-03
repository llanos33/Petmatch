import React, { useMemo, useState, useEffect } from 'react'
import { useParams, Link, useLocation } from 'react-router-dom'
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
  const location = useLocation()
  const [sortBy, setSortBy] = useState('recomendados')
  const [currentPage, setCurrentPage] = useState(1)
  const [petFilter, setPetFilter] = useState('todos')
  const productsPerPage = 8
  
  // Obtener filtro de tipo desde URL
  const searchParams = new URLSearchParams(location.search)
  const typeFilter = searchParams.get('type')
  const petTypeParam = searchParams.get('pet')

  // Resetear página cuando cambia la categoría o el filtro
  useEffect(() => {
    if (petTypeParam && ['perro', 'gato', 'todos'].includes(petTypeParam)) {
      setPetFilter(petTypeParam)
    } else {
      setPetFilter('todos')
    }
    setCurrentPage(1)
  }, [categoryName, typeFilter, petTypeParam])

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

  // Filtrar por tipo específico (subcategoría) si existe el parámetro en URL
  const filteredByType = filteredByPet.filter(product => {
    if (!typeFilter) return true
    
    const lowerName = (product.name || '').toLowerCase()
    const lowerDesc = (product.description || '').toLowerCase()
    const filter = typeFilter.toLowerCase()

    // Lógica de filtrado por palabras clave según el tipo solicitado
    if (filter === 'concentrado') {
      return lowerName.includes('concentrado') || lowerName.includes('seco') || lowerDesc.includes('croquetas') || lowerDesc.includes('seco')
    }
    if (filter === 'humedo') {
      return lowerName.includes('húmedo') || lowerName.includes('humedo') || lowerDesc.includes('lata') || lowerDesc.includes('paté') || lowerDesc.includes('pouch') || lowerDesc.includes('húmedo')
    }
    if (filter === 'natural') {
      return lowerName.includes('natural') || lowerDesc.includes('natural') || lowerDesc.includes('barf')
    }
    if (filter === 'prescripcion-seco') {
      return (lowerName.includes('prescripcion') || lowerName.includes('medicado') || lowerDesc.includes('veterinary')) && (lowerName.includes('seco') || lowerDesc.includes('croquetas'))
    }
    if (filter === 'prescripcion-humedo') {
      return (lowerName.includes('prescripcion') || lowerName.includes('medicado') || lowerDesc.includes('veterinary')) && (lowerName.includes('húmedo') || lowerName.includes('humedo') || lowerDesc.includes('lata'))
    }
    if (filter === 'snacks') {
      return lowerName.includes('snack') || lowerName.includes('premio') || lowerName.includes('galleta') || lowerDesc.includes('snack')
    }
    
    // Filtros para Juguetes
    if (filter === 'peluche') {
      return lowerName.includes('peluche') || lowerDesc.includes('peluche') || lowerDesc.includes('suave')
    }
    if (filter === 'interactivo') {
      return lowerName.includes('interactivo') || lowerDesc.includes('interactivo') || lowerDesc.includes('inteligencia') || lowerDesc.includes('puzzle')
    }
    if (filter === 'mordedor') {
      return lowerName.includes('mordedor') || lowerName.includes('cuerda') || lowerDesc.includes('mordedor') || lowerDesc.includes('cuerda') || lowerDesc.includes('dental')
    }
    if (filter === 'pelota') {
      return lowerName.includes('pelota') || lowerName.includes('lanzador') || lowerDesc.includes('pelota') || lowerDesc.includes('lanzador') || lowerDesc.includes('bola')
    }
    if (filter === 'rascador') {
      return lowerName.includes('rascador') || lowerName.includes('gimnasio') || lowerDesc.includes('rascador') || lowerDesc.includes('torre')
    }

    // Filtros para Farmapet
    if (filter === 'desparasitante') {
      return lowerName.includes('desparasitante') || lowerDesc.includes('desparasitante') || lowerDesc.includes('vermifugo') || lowerDesc.includes('parasito')
    }
    if (filter === 'suplemento') {
      return lowerName.includes('suplemento') || lowerName.includes('vitamina') || lowerDesc.includes('suplemento') || lowerDesc.includes('vitamina') || lowerDesc.includes('mineral') || lowerDesc.includes('omega')
    }
    if (filter === 'analgesico') {
      return lowerName.includes('analgesico') || lowerName.includes('analgésico') || lowerDesc.includes('dolor') || lowerDesc.includes('calmante')
    }
    if (filter === 'antibiotico') {
      return lowerName.includes('antibiotico') || lowerName.includes('antibiótico') || lowerDesc.includes('infeccion') || lowerDesc.includes('infección')
    }
    if (filter === 'antiinflamatorio') {
      return lowerName.includes('antiinflamatorio') || lowerDesc.includes('inflamacion') || lowerDesc.includes('inflamación')
    }
    if (filter === 'antipulgas') {
      return lowerName.includes('antipulgas') || lowerName.includes('garrapata') || lowerName.includes('pulga') || lowerDesc.includes('pipeta') || lowerDesc.includes('antipulgas')
    }
    if (filter === 'articulacion') {
      return lowerName.includes('articulacion') || lowerName.includes('articulación') || lowerDesc.includes('articulacion') || lowerDesc.includes('movilidad') || lowerDesc.includes('condroitina') || lowerDesc.includes('glucosamina')
    }
    if (filter === 'dermatologico') {
      return lowerName.includes('dermatologico') || lowerName.includes('dermatológico') || lowerDesc.includes('piel') || lowerDesc.includes('alergia') || lowerDesc.includes('dermis')
    }

    // Filtros para Accesorios
    if (filter === 'collar') {
      return lowerName.includes('collar') || lowerName.includes('bozal') || lowerDesc.includes('collar') || lowerDesc.includes('bozal')
    }
    if (filter === 'arnes') {
      return lowerName.includes('arnes') || lowerName.includes('arnés') || lowerName.includes('pechera') || lowerDesc.includes('arnes') || lowerDesc.includes('pechera')
    }
    if (filter === 'correa') {
      return lowerName.includes('correa') || lowerDesc.includes('correa') || lowerDesc.includes('trailla') || lowerDesc.includes('traílla')
    }
    if (filter === 'comedero') {
      return lowerName.includes('comedero') || lowerName.includes('bebedero') || lowerDesc.includes('comedero') || lowerDesc.includes('bebedero') || lowerDesc.includes('plato')
    }
    if (filter === 'ropa') {
      return lowerName.includes('ropa') || lowerName.includes('camisa') || lowerName.includes('buzo') || lowerDesc.includes('ropa') || lowerDesc.includes('vestido')
    }
    if (filter === 'guacal') {
      return lowerName.includes('guacal') || lowerName.includes('maletin') || lowerName.includes('transportador') || lowerDesc.includes('guacal') || lowerDesc.includes('transport')
    }

    // Filtros para Cuidado e Higiene
    if (filter === 'shampoo') {
      return lowerName.includes('shampoo') || lowerName.includes('jabon') || lowerName.includes('jabón') || lowerDesc.includes('shampoo') || lowerDesc.includes('baño')
    }
    if (filter === 'hogar') {
      return lowerName.includes('hogar') || lowerName.includes('entrenamiento') || lowerName.includes('educador') || lowerDesc.includes('limpiador') || lowerDesc.includes('desinfectante')
    }
    if (filter === 'panito') {
      return lowerName.includes('pañito') || lowerName.includes('panito') || lowerName.includes('pañal') || lowerName.includes('panal') || lowerName.includes('tapete') || lowerDesc.includes('absorbente')
    }
    if (filter === 'bolsa') {
      return lowerName.includes('bolsa') || lowerDesc.includes('bolsa') || lowerDesc.includes('residuo') || lowerDesc.includes('poop')
    }
    if (filter === 'oral') {
      return lowerName.includes('oral') || lowerName.includes('dental') || lowerName.includes('diente') || lowerDesc.includes('cepillo') || lowerDesc.includes('crema')
    }
    if (filter === 'piel') {
      return lowerName.includes('piel') || lowerName.includes('pata') || lowerDesc.includes('balsamo') || lowerDesc.includes('bálsamo') || lowerDesc.includes('hidratante')
    }
    if (filter === 'colonia') {
      return lowerName.includes('colonia') || lowerName.includes('perfume') || lowerDesc.includes('locion') || lowerDesc.includes('loción') || lowerDesc.includes('aroma')
    }
    if (filter === 'arena') {
      return lowerName.includes('arena') || lowerDesc.includes('arena') || lowerDesc.includes('aglomerante')
    }
    if (filter === 'arenero') {
      return lowerName.includes('arenero') || lowerName.includes('pala') || lowerDesc.includes('bandeja') || lowerDesc.includes('sanitaria')
    }

    // Para otros tipos, búsqueda genérica
    return lowerName.includes(filter) || lowerDesc.includes(filter)
  })

  // Aplicar descuentos a los productos
  const productsWithDiscounts = filteredByType.map(product => applyDiscountToProduct(product))

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

