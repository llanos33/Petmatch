import React from 'react'
import { useParams, Link } from 'react-router-dom'
import blogPosts from '../data/blogPosts'
import { useAuth } from '../context/AuthContext'
import './Blog.css'
import { Calendar, Crown } from 'lucide-react'

export default function BlogPost() {
  const { id } = useParams()
  const { user } = useAuth()
  const postId = parseInt(id)
  const post = blogPosts.find(p => p.id === postId)

  if (!post) {
    return (
      <div className="blog-container">
        <div className="blog-header">
          <Link to="/blog">Volver</Link>
        </div>
        <div style={{ padding: '2rem' }}>
          <h2>Artículo no encontrado</h2>
          <p>Lo sentimos, el artículo que buscas no existe.</p>
        </div>
      </div>
    )
  }

  if (post.isPremium && !user?.isPremium) {
    return (
      <div className="blog-container">
        <div className="blog-header">
          <Link to="/blog">Volver</Link>
        </div>
        <main className="blog-posts" style={{ padding: '2rem' }}>
          <h2>Contenido exclusivo</h2>
          <p>Este artículo es exclusivo para usuarios Premium. Hazte Premium para acceder a este y otros artículos.</p>
          <Link to="/premium" className="upgrade-button">Ver Planes Premium</Link>
        </main>
      </div>
    )
  }

  return (
    <div className="blog-container">
      <div className="blog-header">
        <Link to="/blog" className="blog-back-btn">Volver</Link>
        <h1 className="blog-title">{post.title}</h1>
        <div className="post-meta" style={{ marginTop: '0.5rem' }}>
          <Calendar size={16} /> <span style={{ marginLeft: 8 }}>{post.date}</span>
          {post.isPremium && (
            <span style={{ marginLeft: 12, color: '#b45309', display: 'inline-flex', alignItems: 'center' }}>
              <Crown size={14} style={{ marginRight: 6 }} /> Premium
            </span>
          )}
        </div>
      </div>

      <main className="blog-posts" style={{ padding: '2rem' }}>
        <div className="single-post-image" style={{ marginBottom: '1.25rem' }}>
          <img src={post.image} alt={post.title} style={{ width: '100%', borderRadius: 8 }} />
        </div>
        <article className="single-post-content">
          <p style={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>{post.content}</p>
        </article>
      </main>
    </div>
  )
}
