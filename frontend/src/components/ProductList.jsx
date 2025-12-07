import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './ProductList.css'
import WishlistToggle from './WishlistToggle'
import { 
  ChevronLeft, 
  ChevronRight, 
  ShoppingCart,
  UtensilsCrossed,
  Gamepad2,
  Sparkles,
  Pill,
  SprayCan,
  BedDouble
} from 'lucide-react'
import { applyDiscountToProduct } from '../utils/productDiscounts'
import { useAuth } from '../context/AuthContext'

function ProductList({ products, addToCart, searchTerm = '' }) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const { user } = useAuth()

  // Seleccionar productos variados de todas las categorías
  const getFeaturedProducts = () => {
    if (products.length === 0) return []
    // Excluir productos exclusivos de listados generales
    const publicProducts = products.filter(p => !p.exclusive)
    
    const categories = ['Alimentos', 'Juguetes', 'Accesorios', 'Medicamentos', 'Higiene', 'Camas y Casas']
    const featured = []
    const usedIds = new Set()
    
    // Tomar 1 producto de cada categoría
    categories.forEach((category, index) => {
      const categoryProducts = publicProducts.filter(p => p.category === category && !usedIds.has(p.id))
      if (categoryProducts.length > 0) {
        // Seleccionar el primer producto disponible de cada categoría
        const product = categoryProducts[0]
        featured.push(product)
        usedIds.add(product.id)
      }
    })
    
    // Si no hay suficientes, agregar más productos de diferentes categorías
    while (featured.length < 8 && featured.length < publicProducts.length) {
      const remainingProducts = publicProducts.filter(p => !usedIds.has(p.id))
      if (remainingProducts.length > 0) {
        // Seleccionar productos de categorías que aún no están bien representadas
        const categoryCounts = {}
        featured.forEach(p => {
          categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1
        })
        
        const availableCategories = categories.filter(cat => {
          const catProducts = remainingProducts.filter(p => p.category === cat)
          return catProducts.length > 0
        })
        
        if (availableCategories.length > 0) {
          // Buscar categoría con menos productos o usar la primera disponible
          let selectedCategory = availableCategories[0]
          if (Object.keys(categoryCounts).length > 0) {
            const minCount = Math.min(...Object.values(categoryCounts))
            const minCategory = availableCategories.find(cat => {
              return (categoryCounts[cat] || 0) === minCount
            })
            if (minCategory) selectedCategory = minCategory
          }
          
          const catProducts = remainingProducts.filter(p => p.category === selectedCategory)
          if (catProducts.length > 0) {
            featured.push(catProducts[0])
            usedIds.add(catProducts[0].id)
            continue
          }
        }
        
        // Si no hay más categorías disponibles, agregar cualquier producto
        featured.push(remainingProducts[0])
        usedIds.add(remainingProducts[0].id)
      } else {
        break
      }
    }
    
    return featured.slice(0, 8)
  }

  const featuredProducts = React.useMemo(() => getFeaturedProducts(), [products])
  const filteredProducts = React.useMemo(() => {
    const term = (searchTerm || '').trim().toLowerCase()
    if (!term) return []
    return products.filter(p => {
      // Exclude exclusive products from public search
      if (p.exclusive) return false
      const name = (p.name || '').toLowerCase()
      const category = (p.category || '').toLowerCase()
      const description = (p.description || '').toLowerCase()
      const petType = (p.petType || '').toLowerCase()
      return (
        name.includes(term) ||
        category.includes(term) ||
        description.includes(term) ||
        petType.includes(term)
      )
    })
  }, [products, searchTerm])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(price)
  }

  const categories = [
    {
      id: 'alimentos',
      name: 'Alimentos',
      icon: UtensilsCrossed,
      image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400',
      color: '#3B82F6',
      description: 'Nutrición balanceada para cada etapa'
    },
    {
      id: 'juguetes',
      name: 'Juguetes',
      icon: Gamepad2,
      image: 'https://media.istockphoto.com/id/1447483608/es/foto/bolas-de-juguete-para-perros-hueso-y-cuerda-aisladas-sobre-blanco.jpg?s=612x612&w=0&k=20&c=WkaUumpyt49jXaLTO915ZSAygRFO2e1dytx07ogDjLU=',
      color: '#10B981',
      description: 'Diversión interactiva y duradera'
    },
    {
      id: 'accesorios',
      name: 'Accesorios',
      icon: Sparkles,
      image: 'https://img.freepik.com/foto-gratis/primer-plano-accesorios-perros_23-2150959988.jpg?ga=GA1.1.1451161761.1754453851&semt=ais_hybrid&w=740&q=80',
      color: 'var(--accent)',
      description: 'Todo para su estilo y comodidad'
    },
    {
      id: 'medicamentos',
      name: 'Medicamentos',
      icon: Pill,
      image: 'https://img.freepik.com/foto-gratis/algunas-vitaminas-cachorros-pequenos_329181-14493.jpg?ga=GA1.1.1451161761.1754453851&semt=ais_hybrid&w=740&q=80',
      color: '#EF4444',
      description: 'Cuidados y botiquín supervisado'
    },
    {
      id: 'higiene',
      name: 'Higiene',
      icon: SprayCan,
      image: 'https://img.freepik.com/foto-gratis/hermosos-retratos-mascotas-perros_23-2149218454.jpg?ga=GA1.1.1451161761.1754453851&semt=ais_hybrid&w=740&q=80',
      color: '#8B5CF6',
      description: 'Rutinas frescas para el hogar'
    },
    {
      id: 'camas',
      name: 'Camas y Casas',
      icon: BedDouble,
      image: 'https://media.istockphoto.com/id/1306167086/es/foto/hermoso-jack-russell-terrier-de-pura-raza.jpg?s=612x612&w=0&k=20&c=KbDLSfLIX_lgu7Ghh7nLFaBZ1uN7egx9Zhh3uMIV57M=',
      color: '#EC4899',
      description: 'Sueño profundo y abrigo seguro'
    }
  ]

  const categoryMap = {
    'alimentos': 'Alimentos',
    'juguetes': 'Juguetes',
    'accesorios': 'Accesorios',
    'medicamentos': 'Medicamentos',
    'higiene': 'Higiene',
    'camas': 'Camas y Casas'
  }


  // Imágenes para el carrusel
  const carouselImages = [
    {
      id: 0,
      src: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=1600&q=80',
      title: 'Sabías que en PetMatch hacemos más por tu peludo?',
      subtitle: 'Acompañamos a miles de tutores cada día con asesoría confiable, entregas al instante y mimos extra para toda la familia.',
      logo: 'Historias PetMatch',
      showLogo: true,
      highlights: ['+98% clientes felices', 'Soporte humano 24/7', 'Diagnósticos y tips personalizados'],
      note: 'Somos el aliado en cada etapa de tu mascota'
    },
    {
      id: 1,
      src: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=1200&q=80',
      title: 'PetMatch Premium: más beneficios para tu peludo',
      subtitle: 'Únete y recibe envíos ilimitados, descuentos exclusivos y asesoría prioritaria todo el año.',
      logo: 'PetMatch Premium',
      showLogo: true,
      highlights: ['2 meses gratis en plan anual', 'Entrega rápida incluida', 'Masterclasses con expertos'],
      note: 'Actívalo desde la sección Premium'
    },
    {
      id: 2,
      src: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1200&q=80',
      title: 'Servicios integrales que cuidan a tu familia peluda',
      subtitle: 'Reserva baños, grooming, teleconsultas veterinarias y urgencias 24/7 en un solo clic.',
      logo: 'PetMatch Servicios',
      showLogo: true,
      highlights: ['Agenda en línea sin llamadas', 'Veterinarios certificados', 'Cobertura en Pereira y Dosquebradas'],
      note: 'Descubre más en la página de Servicios'
    }
  ]

  // Auto-avanzar el carrusel
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length)
    }, 5000) // Cambia cada 5 segundos

    return () => clearInterval(interval)
  }, [carouselImages.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)
  }

  return (
    <div className="product-list-container product-list-flush">
      {/* Banner Hero - Carrusel */}
      <div className="hero-carousel-wrapper">
        <div className="hero-carousel">
          <div className="carousel-container">
            {carouselImages.map((image, index) => (
              <div
                key={image.id}
                className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
              >
                <img 
                  src={image.src} 
                  alt={image.title}
                  className="hero-image"
                />
                <div className="carousel-overlay">
                  <div className="carousel-content">
                    {image.showLogo && (
                      <div className="carousel-logo">{image.logo}</div>
                    )}
                    <h3 className="carousel-title">{image.title}</h3>
                    <p className="carousel-subtitle">{image.subtitle}</p>
                    {image.highlights && (
                      <div className="carousel-tags">
                        {image.highlights.map((item) => (
                          <span key={item} className="carousel-tag">
                            {item}
                          </span>
                        ))}
                      </div>
                    )}
                    {image.note && <p className="carousel-note">{image.note}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Controles del carrusel */}
          <button className="carousel-btn carousel-prev" onClick={prevSlide}>
            <ChevronLeft size={32} />
          </button>
          <button className="carousel-btn carousel-next" onClick={nextSlide}>
            <ChevronRight size={32} />
          </button>
        </div>
      </div>

      <div className="product-list-content">
        {/* Sección de Categorías */}
        <div className="categories-section">
          <h2 className="section-title-large">Explora nuestras Categorías</h2>
          <div className="categories-grid">
            {categories.map(category => (
              <Link
                key={category.id}
                to={`/category/${category.id}`}
                className="category-card"
                style={{ '--category-color': category.color }}
              >
                <div className="category-image-wrapper">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="category-image"
                  />
                  <div className="category-overlay"></div>
                  <span className="category-badge">{category.name}</span>
                </div>
                <div className="category-content">
                  <span className="category-icon">
                    {category.icon && React.createElement(category.icon, { size: 36 })}
                  </span>
                  <h3 className="category-name">{category.name}</h3>
                  <p className="category-description">{category.description}</p>
                  <span className="category-cta">Ver productos</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Sección de Productos */}
        <div className="products-section">
        <div className="products-header">
          <h2>{(searchTerm || '').trim() ? 'Resultados de búsqueda' : 'Productos Destacados'}</h2>
          {(searchTerm || '').trim() && (
            <p className="search-summary">{filteredProducts.length} resultado{filteredProducts.length !== 1 ? 's' : ''}</p>
          )}
        </div>

        {(() => {
          const isSearching = (searchTerm || '').trim()
          const productsToShow = isSearching ? filteredProducts : featuredProducts

          if (productsToShow.length === 0) {
            return (
              <div className="no-products">
                <p>No se encontraron productos</p>
              </div>
            )
          }

          return (
            <div className="products-grid">
              {/** Mostrar primero los disponibles */}
              {productsToShow.slice().sort((a, b) => ((b.stock > 0) ? 1 : 0) - ((a.stock > 0) ? 1 : 0)).map(product => {
                const productWithDiscount = applyDiscountToProduct(product)
                return (
                  <div key={product.id} className={`product-card ${product.stock === 0 ? 'out-of-stock' : ''}`}>
                    <Link to={`/product/${product.id}`} className="product-link">
                      <div className="product-image-container">
                        <WishlistToggle productId={product.id} />
                        <img
                          src={product.image || 'https://via.placeholder.com/300x300?text=Producto'}
                          alt={product.name}
                          className="product-image"
                        />
                        {productWithDiscount.discountPercentage > 0 && (
                          <span className="stock-badge" style={{ background: '#EF4444' }}>
                            -{productWithDiscount.totalDiscountPercentage || productWithDiscount.discountPercentage}%
                          </span>
                        )}
                        {/* Premium advantage is shown only in cart; do not show badge here */}
                        {product.stock <= 10 && !productWithDiscount.discountPercentage && product.stock > 0 && (
                          <span className="stock-badge">¡Últimas unidades!</span>
                        )}

                        {/* Insignia de disponibilidad */}
                        {/* Removed single-word "Disponible" badge per UI request. */}
                      </div>
                      <div className="product-info">
                        <h3 className="product-name">{product.name}</h3>
                        <p className="product-category">{product.category} • {product.petType === 'ambos' ? 'Perros y Gatos' : product.petType}</p>
                        <p className="product-description">{product.description}</p>
                        <div className="product-footer">
                          {productWithDiscount.discountPercentage > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ textDecoration: 'line-through', color: '#94A3B8', fontSize: '0.875rem' }}>
                                  {formatPrice(productWithDiscount.originalPrice)}
                                </span>
                                <span className="product-price" style={{ color: '#EF4444' }}>
                                  {formatPrice(productWithDiscount.discountedPrice)}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <span className="product-price">{formatPrice(product.price)}</span>
                          )}
                          <span className="product-stock">
                            {product.stock > 0 ? `${product.stock} disponibles` : 'Agotado'}
                          </span>
                        </div>
                      </div>
                    </Link>
                    <button
                      className="add-to-cart-btn"
                      onClick={() => addToCart({ ...product, price: productWithDiscount.discountedPrice })}
                      disabled={product.stock === 0}
                    >
                      <ShoppingCart size={18} style={{ marginRight: '8px' }} />
                      {product.stock > 0 ? 'Agregar al Carrito' : 'Agotado'}
                    </button>
                  </div>
                )
              })}
            </div>
          )
        })()}
        </div>
      </div>
    </div>
  )
}

export default ProductList


