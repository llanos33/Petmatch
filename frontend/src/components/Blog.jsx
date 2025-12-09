import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Breadcrumb from './Breadcrumb'
import './Blog.css'
import { 
  ArrowLeft, 
  Heart, 
  Zap, 
  Leaf,
  BookOpen,
  Calendar,
  Crown,
  Edit
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import basePosts from '../data/blogPosts'

const loadEditedPosts = () => {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem('editedBlogPosts')
    return raw ? JSON.parse(raw) : {}
  } catch (e) {
    return {}
  }
}

const getMergedPosts = () => {
  const edits = loadEditedPosts()
  return basePosts.map(p => edits[p.id] ? { ...p, ...edits[p.id] } : p)
}

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState('todos')
  const { user } = useAuth()

  const categories = [
    { id: 'todos', name: 'Todos los Artículos' },
    { id: 'nutricion', name: '🍖 Nutrición' },
    { id: 'salud', name: '💊 Salud' },
    { id: 'productos', name: '🛍️ Productos' },
    { id: 'comportamiento', name: '🐾 Comportamiento' },
    { id: 'premium', name: '💎 Premium', isPremium: true }
  ]

  // Filtrar posts según categoría seleccionada
  const mergedPosts = getMergedPosts()

  let filteredPosts = selectedCategory === 'todos'
    ? mergedPosts
    : mergedPosts.filter(post => post.category === selectedCategory)

  // Si el usuario no es Premium, ocultar artículos premium
  if (!user?.isPremium) {
    filteredPosts = filteredPosts.filter(post => !post.isPremium)
  }

  return (
    <div className="blog-container">
      <Breadcrumb />
      <div className="blog-header">
        <h1 className="blog-title">Consejos</h1>
        <p className="blog-subtitle">Tips y artículos sobre el cuidado de tus mascotas</p>
      </div>

      <div className="blog-content">
        {/* Sidebar con categorías */}
        <aside className="blog-sidebar">
          <div className="categories-section">
            <h3>
              <BookOpen size={20} />
              Categorías
            </h3>
            <div className="category-list">
              {categories.map(cat => {
                const isPremiumLocked = cat.isPremium && !user?.isPremium
                return (
                  <button
                    key={cat.id}
                    className={`category-btn ${selectedCategory === cat.id ? 'active' : ''} ${isPremiumLocked ? 'locked' : ''}`}
                    onClick={() => {
                      if (isPremiumLocked) return
                      setSelectedCategory(cat.id)
                    }}
                    title={isPremiumLocked ? 'Contenido exclusivo para usuarios Premium' : ''}
                  >
                    {cat.name}
                    {isPremiumLocked && <span className="lock-icon">🔒</span>}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="info-box">
            <Heart size={24} />
            <h4>¿Necesitas Ayuda?</h4>
            <p>Consulta nuestra sección de ayuda o contáctanos directamente.</p>
            <Link to="/help" className="info-btn">Ver Ayuda</Link>
          </div>
        </aside>

        {/* Main content con posts */}
        <main className="blog-posts">
          <div className="posts-count">
            Mostrando {filteredPosts.length} artículos
          </div>

          {filteredPosts.length > 0 ? (
            <div className="posts-grid">
              {filteredPosts.map(post => (
                <article key={post.id} className={`blog-post-card ${post.isPremium ? 'premium-post' : ''}`}>
                  <div className="post-image">
                    <img src={post.image} alt={post.title} />
                    <div className="post-category-badge">{
                      categories.find(c => c.id === post.category)?.name || post.category
                    }</div>
                    {post.isPremium && (
                      <div className="premium-post-badge">
                        <Crown size={16} />
                        Premium
                      </div>
                    )}
                  </div>
                  
                  <div className="post-content">
                    <div className="post-header-row">
                      <h2 className="post-title">{post.title}</h2>
                      {user?.isAdmin && (
                        <Link 
                          to={`/blog/${post.id}/edit`} 
                          className="post-edit-btn"
                          title="Editar artículo"
                        >
                          <Edit size={18} />
                        </Link>
                      )}
                    </div>
                    
                    <div className="post-meta">
                      <Calendar size={16} />
                      <span>{post.date}</span>
                    </div>
                    
                    <p className="post-excerpt">{post.excerpt}</p>
                    
                    <Link to={`/blog/${post.id}`} className="read-more-btn">
                      Leer Más
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="no-posts">
              <p>No hay artículos en esta categoría aún.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
