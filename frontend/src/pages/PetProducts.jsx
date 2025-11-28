import React, { useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShoppingCart, Cat, Dog } from 'lucide-react'
import './PetProducts.css'
import { applyDiscountToProduct } from '../utils/productDiscounts'
import WishlistToggle from '../components/WishlistToggle'

const CATEGORY_FILTERS = ['Alimentos', 'Juguetes', 'Accesorios', 'Medicamentos', 'Higiene', 'Camas y Casas']

function PetProducts({ products = [], addToCart }) {
  const { petType } = useParams()
  const [selectedCategory, setSelectedCategory] = useState('Todos')

  const normalizedPet = (petType || '').toLowerCase()

  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        const pet = (p.petType || '').toLowerCase()
        return pet === normalizedPet || pet === 'ambos'
      })
      .filter(p => {
        if (selectedCategory === 'Todos') return true
        return (p.category || '').toLowerCase() === selectedCategory.toLowerCase()
      })
      .map(p => applyDiscountToProduct(p))
  }, [products, normalizedPet, selectedCategory])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(price)
  }

  const isCat = normalizedPet === 'gato'
  const title = isCat ? 'Productos para Gatos' : 'Productos para Perros'
  const PetIcon = isCat ? Cat : Dog

  return (
    <div className="pet-products-page">

      <div className="pet-products-header">
        <div className="pet-header-left">
          <div className="pet-title-row">
            <div className="pet-icon-pill">
              <PetIcon size={24} />
            </div>
            <h1>{title}</h1>
          </div>
          <p className="pet-products-subtitle">Filtra por categoría y encuentra justo lo que necesitas</p>
        </div>
        <p className="pet-products-count">{filteredProducts.length} productos</p>
      </div>

      <div className="pet-filter-bar">
        <button
          className={`pet-filter-btn ${selectedCategory === 'Todos' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('Todos')}
        >
          Todos
        </button>
        {CATEGORY_FILTERS.map(cat => (
          <button
            key={cat}
            className={`pet-filter-btn ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="no-products">
          <h2>No encontramos productos para esta combinación</h2>
          <p>Prueba con otra categoría</p>
        </div>
      ) : (
        <div className="pet-products-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className="pet-product-card">
              <Link to={`/product/${product.id}`} className="pet-product-link">
                <div className="pet-image-wrapper">
                  <WishlistToggle productId={product.id} />
                  <img
                    src={product.image || 'https://via.placeholder.com/300x300?text=Producto'}
                    alt={product.name}
                    className="pet-image"
                  />
                  {product.discountPercentage > 0 && (
                    <div className="pet-discount-badge">-{product.discountPercentage}%</div>
                  )}
                </div>
                <div className="pet-info">
                  <p className="pet-category">{product.category} • {product.petType === 'ambos' ? 'Perros y Gatos' : product.petType}</p>
                  <h3 className="pet-name">{product.name}</h3>
                  <p className="pet-description">{product.description}</p>
                  <div className="pet-pricing">
                    {product.discountPercentage > 0 && (
                      <span className="pet-original-price">{formatPrice(product.originalPrice)}</span>
                    )}
                    <span className="pet-current-price">{formatPrice(product.discountedPrice)}</span>
                  </div>
                  <p className={`pet-stock ${product.stock === 0 ? 'out' : ''}`}>
                    {product.stock > 0 ? `${product.stock} disponibles` : 'Agotado'}
                  </p>
                </div>
              </Link>
              <button
                className="pet-add-to-cart"
                onClick={() => addToCart({ ...product, price: product.discountedPrice })}
                disabled={product.stock === 0}
              >
                <ShoppingCart size={18} style={{ marginRight: '8px' }} />
                {product.stock > 0 ? 'Agregar al Carrito' : 'Agotado'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PetProducts
