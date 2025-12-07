import React, { useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import MegaMenu from './MegaMenu'
import { MENU } from '../data/menuData'
import './Header.css'

// ⬇️ Nuevo: mega menú + data
// Iconos de Lucide
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
  MessageCircle,
  LayoutDashboard,
  Boxes
} from 'lucide-react'

function Header({ cartItemCount, searchTerm, setSearchTerm }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSearch = (e) => {
    if (e && e.preventDefault) e.preventDefault()
    const term = (searchTerm || '').trim()
    if (!term) {
      setSearchTerm('')
      navigate('/')
      return
    }
    setSearchTerm(term)
    navigate(`/buscar?q=${encodeURIComponent(term)}`)
  }

  useEffect(() => {
    if (!location.pathname.startsWith('/buscar')) {
      setSearchTerm(prev => (prev ? '' : prev))
    }
  }, [location.pathname, setSearchTerm])

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

          <form className="search-container" onSubmit={handleSearch} role="search">
            <input
              type="text"
              placeholder="¿Qué necesita tu mascota?"
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="search-button" aria-label="Buscar" onClick={handleSearch}>
              <Search size={20} color="var(--primary-dark)" />
            </button>
          </form>

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
