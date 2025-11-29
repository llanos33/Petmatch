import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, ShoppingBag, Users, Package, RefreshCw, AlertCircle, Star, Image } from 'lucide-react'
import './AdminDashboard.css'
import { useAuth } from '../context/AuthContext'
import { apiPath } from '../config/api'

const currencyFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0
})

const dateFormatter = new Intl.DateTimeFormat('es-CO', {
  dateStyle: 'medium',
  timeStyle: 'short'
})

function formatCurrency(value) {
  const safeValue = Number.isFinite(Number(value)) ? Number(value) : 0
  return currencyFormatter.format(safeValue)
}

const AdminDashboard = () => {
  const { user, getAuthToken, loading } = useAuth()
  const [metrics, setMetrics] = useState(null)
  const [error, setError] = useState('')
  const [loadingMetrics, setLoadingMetrics] = useState(true)
  const [lastFetched, setLastFetched] = useState(null)

  const loadMetrics = useCallback(async () => {
    if (!user?.isAdmin) {
      setLoadingMetrics(false)
      return
    }

    try {
      setLoadingMetrics(true)
      setError('')
      const token = getAuthToken()

      if (!token) {
        throw new Error('No se encontró un token de autenticación. Inicia sesión nuevamente.')
      }

      const response = await fetch(apiPath('/api/admin/dashboard'), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const payload = await response.json()

      if (!response.ok || payload.success === false) {
        throw new Error(payload.error || 'No se pudieron obtener las métricas del dashboard.')
      }

      setMetrics(payload.data || payload)
      setLastFetched(new Date())
    } catch (err) {
      console.error('Error al cargar métricas del dashboard:', err)
      const message = err?.message || 'Error inesperado al cargar las métricas.'
      setError(message)
    } finally {
      setLoadingMetrics(false)
    }
  }, [getAuthToken, user?.isAdmin])

  useEffect(() => {
    loadMetrics()
  }, [loadMetrics])

  const summaryCards = useMemo(() => {
    if (!metrics) return []
    return [
      {
        id: 'total-sales',
        label: 'Ventas totales',
        value: formatCurrency(metrics.totalSales),
        icon: <TrendingUp size={28} />,
        accent: 'accent-sales'
      },
      {
        id: 'orders',
        label: 'Pedidos totales',
        value: metrics.totalOrders ?? 0,
        icon: <ShoppingBag size={28} />,
        accent: 'accent-orders'
      },
      {
        id: 'users',
        label: 'Usuarios registrados',
        value: metrics.totalUsers ?? 0,
        icon: <Users size={28} />,
        accent: 'accent-users'
      },
      {
        id: 'low-stock',
        label: 'Inventario crítico',
        value: metrics.lowStockProducts?.length ?? 0,
        icon: <Package size={28} />,
        accent: 'accent-stock'
      }
    ]
  }, [metrics])

  if (loading || loadingMetrics) {
    return (
      <div className="admin-dashboard admin-dashboard--loading">
        <div className="admin-dashboard__card">
          <span className="admin-dashboard__spinner" aria-hidden="true" />
          <p>Cargando panel administrativo...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="admin-dashboard admin-dashboard--center">
        <div className="admin-dashboard__card">
          <h2>Necesitas iniciar sesión</h2>
          <p>Inicia sesión con una cuenta de administrador para ver el panel.</p>
          <Link className="admin-dashboard__button" to="/login">Ir a iniciar sesión</Link>
        </div>
      </div>
    )
  }

  if (!user.isAdmin) {
    return (
      <div className="admin-dashboard admin-dashboard--center">
        <div className="admin-dashboard__card">
          <h2>Acceso restringido</h2>
          <p>Este panel es exclusivo para administradores de PetMatch.</p>
          <Link className="admin-dashboard__button" to="/">Volver al inicio</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-dashboard__header">
        <div>
          <h1>Panel administrativo</h1>
          <p>Monitorea las métricas clave de PetMatch en tiempo real.</p>
        </div>
        <div className="admin-dashboard__header-actions">
          <Link to="/admin/contenido" className="admin-dashboard__refresh admin-dashboard__refresh-link">
            <Image size={18} />
            <span>Gestionar contenido</span>
          </Link>
          {lastFetched && (
            <span className="admin-dashboard__timestamp">
              Última actualización: {dateFormatter.format(lastFetched)}
            </span>
          )}
          <button type="button" className="admin-dashboard__refresh" onClick={loadMetrics}>
            <RefreshCw size={18} />
            <span>Actualizar</span>
          </button>
        </div>
      </header>

      {error && (
        <div className="admin-dashboard__alert">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <section className="admin-dashboard__summary">
        {summaryCards.map(card => (
          <article key={card.id} className={`admin-dashboard__summary-card ${card.accent}`}>
            <div className="admin-dashboard__summary-icon">{card.icon}</div>
            <div>
              <span className="admin-dashboard__summary-label">{card.label}</span>
              <strong className="admin-dashboard__summary-value">{card.value}</strong>
            </div>
          </article>
        ))}
      </section>

      <section className="admin-dashboard__grid">
        <article className="admin-dashboard__panel">
          <header className="admin-dashboard__panel-header">
            <h2>Pedidos recientes</h2>
            <span>Ultimos 5 pedidos confirmados</span>
          </header>
          {metrics?.recentOrders?.length ? (
            <table className="admin-dashboard__table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {metrics.recentOrders.map(order => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>
                      <span className="admin-dashboard__customer">{order.customer}</span>
                      {order.email && <span className="admin-dashboard__customer-email">{order.email}</span>}
                    </td>
                    <td>{formatCurrency(order.total)}</td>
                    <td>
                      <span className={`admin-dashboard__status admin-dashboard__status--${order.status || 'pendiente'}`}>
                        {order.status || 'pendiente'}
                      </span>
                    </td>
                    <td>{order.date ? dateFormatter.format(new Date(order.date)) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="admin-dashboard__empty">Todavía no hay pedidos registrados.</p>
          )}
        </article>

        <article className="admin-dashboard__panel">
          <header className="admin-dashboard__panel-header">
            <h2>Inventario crítico</h2>
            <span>Productos por debajo de {metrics?.lowStockThreshold ?? 10} unidades</span>
          </header>
          {metrics?.lowStockProducts?.length ? (
            <ul className="admin-dashboard__list">
              {metrics.lowStockProducts.map(product => (
                <li key={product.id} className="admin-dashboard__list-item">
                  <div>
                    <p className="admin-dashboard__list-title">{product.name}</p>
                    <span className="admin-dashboard__list-subtitle">{product.category}</span>
                  </div>
                  <span className="admin-dashboard__badge">{product.stock} en stock</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="admin-dashboard__empty">Excelente noticia, no hay productos en niveles críticos.</p>
          )}
        </article>
      </section>

      <section className="admin-dashboard__panel admin-dashboard__panel--wide">
        <header className="admin-dashboard__panel-header">
          <h2>Métricas adicionales</h2>
          <span>Profundiza en el desempeño general</span>
        </header>
        <div className="admin-dashboard__metrics-extra">
          <div className="admin-dashboard__extra-card">
            <Star size={22} />
            <div>
              <span className="admin-dashboard__extra-label">Usuarios premium</span>
              <strong>{metrics?.premiumUsers ?? 0}</strong>
            </div>
          </div>
          <div className="admin-dashboard__extra-card">
            <TrendingUp size={22} />
            <div>
              <span className="admin-dashboard__extra-label">Ticket promedio</span>
              <strong>{formatCurrency(metrics?.averageOrderValue ?? 0)}</strong>
            </div>
          </div>
          <div className="admin-dashboard__extra-card">
            <ShoppingBag size={22} />
            <div>
              <span className="admin-dashboard__extra-label">Pedidos mensuales (total)</span>
              <strong>{metrics?.totalOrders ?? 0}</strong>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AdminDashboard
