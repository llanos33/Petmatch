import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import blogPosts from '../data/blogPosts'
import { useAuth } from '../context/AuthContext'
import './BlogPostEdit.css'
import { ArrowLeft, Save, X } from 'lucide-react'

export default function BlogPostEdit() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const postId = parseInt(id)

  const loadEditedPosts = () => {
    if (typeof window === 'undefined') return {}
    try {
      const raw = localStorage.getItem('editedBlogPosts')
      return raw ? JSON.parse(raw) : {}
    } catch (e) {
      return {}
    }
  }

  const [post, setPost] = useState(() => {
    const editedMap = loadEditedPosts()
    const basePost = blogPosts.find(p => p.id === postId)
    return basePost ? { ...basePost, ...(editedMap[postId] || {}) } : null
  })

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    image: ''
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || '',
        excerpt: post.excerpt || '',
        content: post.content || '',
        image: post.image || ''
      })
    }
  }, [postId, post])

  // Verificar permisos
  if (!user?.isAdmin) {
    return (
      <div className="blog-container">
        <div className="blog-header">
          <Link to="/blog" className="blog-back-btn">Volver</Link>
        </div>
        <main className="edit-post-body">
          <div className="edit-access-denied">
            <h2>Acceso Denegado</h2>
            <p>Solo los administradores pueden editar artículos.</p>
            <Link to="/blog" className="back-button">Volver a Consejos</Link>
          </div>
        </main>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="blog-container">
        <div className="blog-header">
          <Link to="/blog" className="blog-back-btn">Volver</Link>
        </div>
        <main className="edit-post-body">
          <div className="edit-access-denied">
            <h2>Artículo no encontrado</h2>
            <p>El artículo que intentas editar no existe.</p>
            <Link to="/blog" className="back-button">Volver a Consejos</Link>
          </div>
        </main>
      </div>
    )
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setMessage('')
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Por ahora guardamos en localStorage como demostración
      // En producción, esto iría a un backend endpoint
      const editedPosts = JSON.parse(localStorage.getItem('editedBlogPosts') || '{}')
      editedPosts[postId] = {
        ...post,
        ...formData,
        editedAt: new Date().toISOString()
      }
      localStorage.setItem('editedBlogPosts', JSON.stringify(editedPosts))

      setMessage('Artículo guardado exitosamente')
      setTimeout(() => {
        navigate(`/blog/${postId}`)
      }, 1500)
    } catch (error) {
      setMessage('Error al guardar el artículo: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="blog-container">
      <div className="blog-header single-post-header">
        <Link to={`/blog/${postId}`} className="blog-back-btn">Volver</Link>
        <div className="single-post-heading">
          <h1 className="blog-title">Editar Artículo</h1>
        </div>
      </div>

      <main className="edit-post-body">
        <form onSubmit={handleSave} className="edit-post-form">
          <div className="form-group">
            <label htmlFor="title" className="form-label">Título del Artículo</label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-input"
              placeholder="Título del artículo"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="image" className="form-label">URL de la Imagen</label>
            <input
              id="image"
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="form-input"
              placeholder="https://..."
            />
            {formData.image && (
              <div className="image-preview">
                <img src={formData.image} alt="Preview" />
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="excerpt" className="form-label">Resumen (Bajada)</label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              className="form-textarea"
              placeholder="Resumen corto del artículo"
              rows="3"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="content" className="form-label">Contenido del Artículo</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="form-textarea"
              placeholder="Contenido principal del artículo"
              rows="12"
              required
            />
          </div>

          {message && (
            <div className={`form-message ${message.includes('Error') ? 'error' : 'success'}`}>
              {message}
            </div>
          )}

          <div className="form-actions">
            <button
              type="submit"
              className="form-btn save-btn"
              disabled={saving}
            >
              <Save size={18} />
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
            <Link to={`/blog/${postId}`} className="form-btn cancel-btn">
              <X size={18} />
              Cancelar
            </Link>
          </div>
        </form>
      </main>
    </div>
  )
}
