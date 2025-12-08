import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import MegaMenu from './MegaMenu'
import { MENU } from '../data/menuData'
import basePosts from '../data/blogPosts'
import './Header.css'

import {
  Shield,
  DollarSign,
  Truck,
  Phone,
  Youtube,
  Facebook,
  Instagram,
  Search,
  User,
  ShoppingCart,
  Star,
  Heart,
  Home,
  Dog,
  Cat,
  Stethoscope,
  Gift,
  FileText,
  LayoutDashboard,
  Boxes
} from 'lucide-react'

const loadEditedPosts = () => {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem('editedBlogPosts')
    return raw ? JSON.parse(raw) : {}
  } catch (e) {
    return {}
  }
}

function Header({ cartItemCount, searchTerm, setSearchTerm, products = [] }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchResults, setSearchResults] = useState({ products: [], posts: [] })
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef(null)

  const escapeRegExp = (str = '') => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  const highlightText = (text = '', query = '') => {
    if (!query) return text
    const safeQuery = escapeRegExp(query)
    const regex = new RegExp(`(${safeQuery})`, 'ig')
    const parts = text.split(regex)
    return parts.map((part, idx) =>
      idx % 2 === 1
        ? <mark className="search-highlight" key={`${part}-${idx}`}>{part}</mark>
        : <span key={`${part}-${idx}`}>{part}</span>
    )
  }

  const handleSearch = (e) => {
    if (e && e.preventDefault) e.preventDefault()
    const term = (searchTerm || '').trim()
    if (!term) {
      setSearchTerm('')
      setShowResults(false)
      navigate('/')
      return
    }
    setSearchTerm(term)
    setShowResults(false)
    navigate(`/buscar?q=${encodeURIComponent(term)}`)
  }

  const handleResultClick = (path) => {
    setShowResults(false)
    setSearchTerm('')
    navigate(path)
  }

  useEffect(() => {
    if (!location.pathname.startsWith('/buscar')) {
      setSearchTerm(prev => (prev ? '' : prev))
    }
    setShowResults(false)
  }, [location.pathname, setSearchTerm])

  useEffect(() => {
    const term = (searchTerm || '').trim()
    if (!term) {
      setSearchResults({ products: [], posts: [] })
      setShowResults(false)
      return
    }

    const handler = setTimeout(() => {
      const lower = term.toLowerCase()
      const productMatches = (products || [])
        .filter(p =>
          (p.name && p.name.toLowerCase().includes(lower)) ||
          (p.description && p.description.toLowerCase().includes(lower))
        )
        .slice(0, 5)

      const edits = loadEditedPosts()
      const mergedPosts = basePosts.map(p => edits[p.id] ? { ...p, ...edits[p.id] } : p)
      const visiblePosts = user?.isPremium ? mergedPosts : mergedPosts.filter(post => !post.isPremium)
      const postMatches = visiblePosts
        .filter(post =>
          (post.title && post.title.toLowerCase().includes(lower)) ||
          (post.excerpt && post.excerpt.toLowerCase().includes(lower)) ||
          (post.content && post.content.toLowerCase().includes(lower))
        )
        .slice(0, 4)

      setSearchResults({ products: productMatches, posts: postMatches })
      setShowResults(true)
    }, 200)

    return () => clearTimeout(handler)
  }, [searchTerm, products, user])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="header">
      {/* Barra superior - Garantías y contacto */}
      <div className="header-top">
        <div className="header-top-container">
          <div className="header-top-left">
            <span className="guarantee-item">
              <Shield size={20} />
              <span>Compras seguras online</span>
            </span>
            <span className="guarantee-item">
              <DollarSign size={20} />
              <span>Pago contra entrega</span>
            </span>
            <span className="guarantee-item">
              <Truck size={20} />
              <span>Entregas el mismo día</span>
            </span>
          </div>
          <div className="header-top-right">
            <span className="phone-text">
              <Phone size={16} style={{ marginRight: '4px' }} />
              Llámanos 320 282 6022
            </span>
            <div className="social-icons">
              <a href="#" className="social-icon" aria-label="YouTube">
                <Youtube size={20} />
              </a>
              <a href="#" className="social-icon" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="https://www.instagram.com/petmatch22/" className="social-icon" aria-label="Instagram">
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Header principal */}
      <div className="header-main">
        <div className="header-main-container">
          <Link to="/" className="logo">
            <span className="logo-icon">🐾</span>
            <span className="logo-text">PetMatch</span>
          </Link>

          <div className="search-wrapper" ref={searchRef}>
            <form className="search-container" onSubmit={handleSearch} role="search">
              <input
                type="text"
                placeholder="¿Qué necesita tu mascota?"
                className="search-input"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setShowResults(true)
                }}
                onFocus={() => searchTerm && setShowResults(true)}
              />
              <button type="submit" className="search-button" aria-label="Buscar" onClick={handleSearch}>
                <Search size={20} color="var(--primary-dark)" />
              </button>
            </form>

            {showResults && searchTerm?.trim() && (
              <div className="search-results" role="listbox">
                {searchResults.products.length > 0 && (
                  <div className="search-group">
                    <div className="search-group-title">Productos</div>
                    {searchResults.products.map(product => (
                      <button
                        key={`product-${product.id}`}
                        className="search-item"
                        onClick={() => handleResultClick(`/product/${product.id}`)}
                        type="button"
                      >
                        <div className="search-item-content">
                          <div className="search-thumb-wrap">
                            {product.image ? (
                              <img src={product.image} alt={product.name} className="search-thumb" />
                            ) : (
                              <div className="search-thumb-fallback">🐾</div>
                            )}
                          </div>
                          <div className="search-item-text">
                            <div className="search-item-title">{highlightText(product.name, searchTerm)}</div>
                            <div className="search-item-sub">{highlightText(product.description?.slice(0, 80) || '', searchTerm)}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {searchResults.posts.length > 0 && (
                  <div className="search-group">
                    <div className="search-group-title">Artículos</div>
                    {searchResults.posts.map(post => (
                      <button
                        key={`post-${post.id}`}
                        className="search-item"
                        onClick={() => handleResultClick(`/blog/${post.id}`)}
                        type="button"
                      >
                        <div className="search-item-content">
                          <div className="search-thumb-wrap">
                            {post.image ? (
                              <img src={post.image} alt={post.title} className="search-thumb" />
                            ) : (
                              <div className="search-thumb-fallback">📄</div>
                            )}
                          </div>
                          <div className="search-item-text">
                            <div className="search-item-title">{highlightText(post.title, searchTerm)}</div>
                            <div className="search-item-sub">{highlightText(post.excerpt?.slice(0, 90) || '', searchTerm)}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {searchResults.products.length === 0 && searchResults.posts.length === 0 && (
                  <div className="search-empty">Sin resultados</div>
                )}
              </div>
            )}
          </div>

          <div className="header-actions">
            <Link to="/lista-deseos" className="wishlist-link" aria-label="Lista de deseos">
              <Heart size={22} />
              <span className="wishlist-label">Lista de deseos</span>
            </Link>
            
            {!user?.isPremium && (
              <Link to="/premium" className="earn-button">
                <Star size={16} fill="currentColor" />
                <span>Hacerse Premium</span>
              </Link>
            )}

            {user ? (
              <div className="user-info">
                <span className="user-name">{user.name.split(' ')[0]}</span>
                <Link to="/profile" className="user-icon">
                  <User size={24} />
                  {user.isPremium && (
                    <span className="premium-star" title="Usuario Premium">
                      <Star size={12} />
                    </span>
                  )}
                </Link>
              </div>
            ) : (
              <Link to="/login" className="user-icon">
                <User size={24} />
              </Link>
            )}

            <Link to="/cart" className="cart-link">
              <ShoppingCart size={24} />
              {cartItemCount > 0 && (
                <span className="cart-badge-count">{cartItemCount}</span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Menú de categorías (barra azul) */}
      <div className="header-menu">
        <div className="header-menu-container">
          <Link to="/" className="menu-item">
            <Home size={18} />
            <span>Inicio</span>
          </Link>

          <MegaMenu 
            label={
              <span className="mega-label">
                <Dog size={18} />
                <span>Perro</span>
              </span>
            }
            sections={MENU.perro}
          />

          <MegaMenu 
            label={
              <span className="mega-label">
                <Cat size={18} />
                <span>Gato</span>
              </span>
            }
            sections={MENU.gato}
          />
          
          <MegaMenu 
            label={
              <span className="mega-label">
                <Stethoscope size={18} />
                <span>Servicios</span>
              </span>
            }
            sections={MENU.servicios}
          />
          
          <Link to="/promociones" className="menu-item">
            <Gift size={18} />
            <span>Promociones</span>
          </Link>
          <Link to="/blog" className="menu-item">
            <FileText size={18} />
            <span>Consejos</span>
          </Link>
          {user?.isAdmin && (
            <Link to="/admin/dashboard" className="menu-item">
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </Link>
          )}
          {user?.isAdmin && (
            <Link to="/admin/products" className="menu-item">
              <Boxes size={18} />
              <span>Productos</span>
            </Link>
          )}
          {user?.isPremium && (
            <Link to="/exclusivos" className="menu-item premium-only">
              <Star size={18} />
              <span>Exclusivos</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
