import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import './Breadcrumb.css'

const routeNames = {
  '/': 'Inicio',
  '/cart': 'Carrito',
  '/checkout': 'Pago',
  '/login': 'Iniciar Sesión',
  '/register': 'Registrarse',
  '/profile': 'Perfil',
  '/help': 'Ayuda',
  '/consultations': 'Consultas Veterinarias',
  '/lista-deseos': 'Lista de Deseos',
  '/promociones': 'Promociones',
  '/exclusivos': 'Productos Exclusivos',
  '/servicios': 'Servicios',
  '/blog': 'Consejos',
  '/premium': 'Hacerse Premium',
  '/buscar': 'Búsqueda',
  '/sobre': 'Sobre Nosotros',
  '/terms': 'Términos y Condiciones',
  '/privacy': 'Política de Privacidad',
  '/faq': 'Preguntas Frecuentes',
  '/delivery': 'Política de Entrega',
  '/sitemap': 'Mapa del Sitio',
  '/admin/dashboard': 'Dashboard Admin',
  '/admin/products': 'Gestión de Productos',
  '/puntos-interes': 'Puntos de Interés'
}

const categoryNames = {
  'alimentos': 'Alimentos',
  'juguetes': 'Juguetes',
  'accesorios': 'Accesorios',
  'medicamentos': 'Medicamentos',
  'higiene': 'Higiene',
  'camas-y-casas': 'Camas y Casas'
}

const petTypeNames = {
  'perro': 'Perros',
  'gato': 'Gatos',
  'perros': 'Perros',
  'gatos': 'Gatos'
}

function Breadcrumb({ customCrumbs = [] }) {
  const location = useLocation()
  
  // Don't show on homepage or auth pages
  if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register') {
    return null
  }

  let crumbs = []

  if (customCrumbs.length > 0) {
    crumbs = customCrumbs
  } else {
    const pathParts = location.pathname.split('/').filter(Boolean)
    
    crumbs = pathParts.map((part, index) => {
      const path = '/' + pathParts.slice(0, index + 1).join('/')
      
      // Check if it's a known route
      if (routeNames[path]) {
        return { label: routeNames[path], path }
      }
      
      // Check category
      if (pathParts[index - 1] === 'category' && categoryNames[part]) {
        return { label: categoryNames[part], path }
      }
      
      // Check pet type
      if (pathParts[index - 1] === 'mascotas' && petTypeNames[part]) {
        return { label: petTypeNames[part], path }
      }
      
      // Check if it's a product ID or blog post ID
      if (pathParts[index - 1] === 'product' || pathParts[index - 1] === 'blog') {
        return null // Will be replaced by custom name
      }
      
      // Default: capitalize
      return { 
        label: part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' '),
        path 
      }
    }).filter(Boolean)
  }

  if (crumbs.length === 0) return null

  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <ol className="breadcrumb-list">
        <li className="breadcrumb-item">
          <Link to="/" className="breadcrumb-link">
            <Home size={16} />
            <span>Inicio</span>
          </Link>
        </li>
        {crumbs.map((crumb, index) => (
          <li key={crumb.path || index} className="breadcrumb-item">
            <ChevronRight size={16} className="breadcrumb-separator" />
            {index === crumbs.length - 1 ? (
              <span className="breadcrumb-current">{crumb.label}</span>
            ) : (
              <Link to={crumb.path} className="breadcrumb-link">
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export default Breadcrumb
