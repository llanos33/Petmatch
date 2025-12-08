import React from 'react'
import { useParams, Link } from 'react-router-dom'
import basePosts from '../data/blogPosts'
import { useAuth } from '../context/AuthContext'
import './Blog.css'
import { Calendar, Crown } from 'lucide-react'

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

export default function BlogPost() {
  const { id } = useParams()
  const { user } = useAuth()
  const postId = parseInt(id)
  const posts = getMergedPosts()
  const post = posts.find(p => p.id === postId)

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
      <div className="blog-header single-post-header">
        <Link to="/blog" className="blog-back-btn">Volver</Link>
        <div className="single-post-heading">
          <h1 className="blog-title">{post.title}</h1>
          <div className="single-post-meta">
            <div className="post-meta">
              <Calendar size={16} />
              <span>{post.date}</span>
            </div>
            {post.isPremium && (
              <span className="single-post-premium">
                <Crown size={14} /> Premium
              </span>
            )}
          </div>
        </div>
      </div>

      <main className="single-post-body">
        <div className="single-post-hero">
          <div className="single-post-image">
            <img src={post.image} alt={post.title} />
          </div>
          {post.excerpt && (
            <p className="single-post-excerpt">{post.excerpt}</p>
          )}
        </div>

        <article className="single-post-content">
          <p className="single-post-text">{post.content}</p>
        </article>
      </main>
    </div>
  )
}
