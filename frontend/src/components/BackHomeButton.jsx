import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import './BackHomeButton.css'

function BackHomeButton() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  // Oculta en la portada para no duplicar la navegación principal
  if (isHome) return null

  return (
    <Link to="/" className="back-home-button" aria-label="Volver al inicio">
      <ArrowLeft size={18} strokeWidth={2.5} />
      <span>Volver</span>
    </Link>
  )
}

export default BackHomeButton
