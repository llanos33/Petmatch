import React from 'react'
import { Heart } from 'lucide-react'
import { useWishlist } from '../context/WishlistContext'
import './WishlistToggle.css'

function WishlistToggle({ productId, className = '', size = 18 }) {
  const { toggleWishlist, isInWishlist, isAuthenticated } = useWishlist()
  const active = isInWishlist(productId)

  const handleClick = (event) => {
    event.preventDefault()
    event.stopPropagation()
    if (!isAuthenticated) {
      alert('Inicia sesión para guardar productos en tu lista de deseos.')
      return
    }
    toggleWishlist(productId)
  }

  return (
    <button
      type="button"
      className={`wishlist-toggle-btn ${active ? 'is-active' : ''} ${className}`.trim()}
      aria-pressed={active}
      aria-label={active ? 'Quitar de la lista de deseos' : 'Agregar a la lista de deseos'}
      data-requires-auth={!isAuthenticated}
      onClick={handleClick}
    >
      <Heart size={size} {...(active ? { fill: 'currentColor' } : {})} />
    </button>
  )
}

export default WishlistToggle
