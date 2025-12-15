import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, ShoppingBag, Users, Package, RefreshCw, AlertCircle, Star, FileText, X } from 'lucide-react'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
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
  const [invoices, setInvoices] = useState([])
  const [invoiceError, setInvoiceError] = useState('')
  const [loadingInvoices, setLoadingInvoices] = useState(true)
  const [invoiceModal, setInvoiceModal] = useState({ open: false, loading: false, error: '', invoice: null })
  const [activeTab, setActiveTab] = useState('ventas')

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

  const loadInvoices = useCallback(async () => {
    if (!user?.isAdmin) {
      setLoadingInvoices(false)
      return
    }

    try {
      setLoadingInvoices(true)
      setInvoiceError('')
      const token = getAuthToken()

      if (!token) {
        throw new Error('No se encontró un token de autenticación. Inicia sesión nuevamente.')
      }

      const response = await fetch(apiPath('/api/admin/invoices'), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const payload = await response.json()

      if (!response.ok || payload.success === false) {
        throw new Error(payload.error || 'No se pudieron obtener las facturas.')
      }

      const data = Array.isArray(payload.data) ? payload.data : []
      const sorted = [...data].sort((a, b) => new Date(b.issuedAt || b.date || 0) - new Date(a.issuedAt || a.date || 0))
      setInvoices(sorted)
    } catch (err) {
      console.error('Error al cargar facturas:', err)
      const message = err?.message || 'Error inesperado al cargar las facturas.'
      setInvoiceError(message)
    } finally {
      setLoadingInvoices(false)
    }
  }, [getAuthToken, user?.isAdmin])

  const openInvoiceForOrder = useCallback(async (orderId) => {
    if (!user?.isAdmin) return
    setInvoiceModal({ open: true, loading: true, error: '', invoice: null })

    try {
      const token = getAuthToken()
      if (!token) {
        throw new Error('No se encontró un token de autenticación. Inicia sesión nuevamente.')
      }

      const response = await fetch(apiPath(`/api/admin/orders/${orderId}/invoice`), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const payload = await response.json()
      if (!response.ok || payload.success === false) {
        throw new Error(payload.error || 'No se pudo obtener la factura de esta orden.')
      }

      setInvoiceModal({ open: true, loading: false, error: '', invoice: payload.data })
    } catch (err) {
      console.error('Error al abrir factura:', err)
      const message = err?.message || 'Error inesperado al obtener la factura.'
      setInvoiceModal({ open: true, loading: false, error: message, invoice: null })
    }
  }, [getAuthToken, user?.isAdmin])

  useEffect(() => {
    loadMetrics()
    loadInvoices()
  }, [loadMetrics, loadInvoices])

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

  // Chart data: Payment method distribution
  const paymentMethodData = useMemo(() => {
    if (!invoices || invoices.length === 0) return []
    const methods = {}
    invoices.forEach(inv => {
      const method = inv.paymentMethod || 'Sin especificar'
      methods[method] = (methods[method] || 0) + 1
    })
    return Object.entries(methods).map(([name, value]) => ({ name, value }))
  }, [invoices])

  // Chart data: Sales trend (last 7 days)
  const salesTrendData = useMemo(() => {
    if (!invoices || invoices.length === 0) return []
    const dailySales = {}
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().slice(0, 10)
      dailySales[dateStr] = 0
    }
    
    invoices.forEach(inv => {
      const dateStr = inv.issuedAt?.slice(0, 10) || new Date().toISOString().slice(0, 10)
      if (dailySales.hasOwnProperty(dateStr)) {
        dailySales[dateStr] += inv.total || 0
      }
    })
    
    return Object.entries(dailySales).map(([date, total]) => {
      const d = new Date(date)
      return {
        date: d.toLocaleDateString('es-CO', { month: 'short', day: 'numeric' }),
        total: Math.round(total)
      }
    })
  }, [invoices])

  // Chart data: Top 5 products
  const topProductsData = useMemo(() => {
    if (!invoices || invoices.length === 0) return []
    const products = {}
    
    invoices.forEach(inv => {
      inv.items?.forEach(item => {
        const productKey = item.productName || `Producto #${item.productId}`
        products[productKey] = (products[productKey] || 0) + item.quantity
      })
    })
    
    return Object.entries(products)
      .map(([name, qty]) => ({
        name: name.length > 30 ? name.substring(0, 27) + '...' : name,
        quantity: qty,
        fullName: name
      }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5)
  }, [invoices])

  // Chart colors
  const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F']

  const closeInvoiceModal = () => setInvoiceModal({ open: false, loading: false, error: '', invoice: null })

  if (loading || loadingMetrics || loadingInvoices) {
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
          <Link to="/admin/products" className="admin-dashboard__header-link">
            Gestionar productos
          </Link>
          <Link to="/admin/veterinarian-requests" className="admin-dashboard__header-link">
            Verificar veterinarios
          </Link>
          {lastFetched && (
            <span className="admin-dashboard__timestamp">
              Última actualización: {dateFormatter.format(lastFetched)}
            </span>
          )}
          <button
            type="button"
            className="admin-dashboard__refresh"
            onClick={() => {
              loadMetrics()
              loadInvoices()
            }}
          >
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

      <nav className="admin-dashboard__tabs">
        <button 
          className={`admin-dashboard__tab ${activeTab === 'ventas' ? 'admin-dashboard__tab--active' : ''}`}
          onClick={() => setActiveTab('ventas')}
        >
          <TrendingUp size={18} />
          <span>Ventas</span>
        </button>
        <button 
          className={`admin-dashboard__tab ${activeTab === 'ordenes' ? 'admin-dashboard__tab--active' : ''}`}
          onClick={() => setActiveTab('ordenes')}
        >
          <ShoppingBag size={18} />
          <span>Órdenes</span>
        </button>
        <button 
          className={`admin-dashboard__tab ${activeTab === 'inventario' ? 'admin-dashboard__tab--active' : ''}`}
          onClick={() => setActiveTab('inventario')}
        >
          <Package size={18} />
          <span>Inventario</span>
        </button>
        <button 
          className={`admin-dashboard__tab ${activeTab === 'metricas' ? 'admin-dashboard__tab--active' : ''}`}
          onClick={() => setActiveTab('metricas')}
        >
          <Star size={18} />
          <span>Métricas Adicionales</span>
        </button>
      </nav>

      <section className="admin-dashboard__content">
        {/* TAB: Ventas */}
        {activeTab === 'ventas' && (
          <div className="admin-dashboard__tab-content">
            <section className="admin-dashboard__grid admin-dashboard__grid--single-column">
              <article className="admin-dashboard__panel">
                <header className="admin-dashboard__panel-header">
                  <h2>Tendencia de ventas</h2>
                  <span>Últimos 7 días</span>
                </header>
                <div className="admin-dashboard__chart-container">
                  {salesTrendData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={450}>
                      <LineChart data={salesTrendData} margin={{ top: 5, right: 30, left: 30, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => formatCurrency(value)}
                          contentStyle={{ backgroundColor: '#f9f9f9', border: '1px solid #e0e0e0' }}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="total" 
                          stroke="#4f59b4ff" 
                          dot={{ fill: '#364497ff', r: 5 }}
                          activeDot={{ r: 7 }}
                          name="Ventas"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="admin-dashboard__chart-empty">No hay datos de ventas disponibles</p>
                  )}
                </div>
              </article>

              <article className="admin-dashboard__panel">
                <header className="admin-dashboard__panel-header">
                  <h2>Distribución de métodos de pago</h2>
                  <span>Órdenes por método</span>
                </header>
                <div className="admin-dashboard__chart-container">
                  {paymentMethodData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={450}>
                      <PieChart>
                        <Pie
                          data={paymentMethodData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}`}
                          outerRadius={180}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {paymentMethodData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="admin-dashboard__chart-empty">No hay datos de métodos de pago</p>
                  )}
                </div>
              </article>

              <article className="admin-dashboard__panel">
                <header className="admin-dashboard__panel-header">
                  <h2>Top 5 productos más vendidos</h2>
                  <span>Por cantidad</span>
                </header>
                <div className="admin-dashboard__chart-container">
                  {topProductsData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={450}>
                      <BarChart data={topProductsData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis 
                          dataKey="name" 
                          angle={-45}
                          textAnchor="end"
                          height={100}
                        />
                        <YAxis />
                        <Tooltip 
                          cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
                          content={({ active, payload }) => {
                            if (active && payload && payload[0]) {
                              return (
                                <div style={{ backgroundColor: '#f9f9f9', border: '1px solid #e0e0e0', padding: '8px', borderRadius: '4px' }}>
                                  <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#666' }}>{payload[0].payload.fullName}</p>
                                  <p style={{ margin: '0', fontWeight: 'bold' }}>Cantidad: {payload[0].value}</p>
                                </div>
                              )
                            }
                            return null
                          }}
                        />
                        <Bar dataKey="quantity" fill="#4ECDC4" radius={[8, 8, 0, 0]} name="Cantidad vendida" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="admin-dashboard__chart-empty">No hay datos de productos</p>
                  )}
                </div>
              </article>
            </section>
          </div>
        )}

        {/* TAB: Órdenes */}
        {activeTab === 'ordenes' && (
          <div className="admin-dashboard__tab-content">
            <section className="admin-dashboard__grid">
              <article className="admin-dashboard__panel">
                <header className="admin-dashboard__panel-header">
                  <h2>Pedidos recientes</h2>
                  <span>Ultimos 5 pedidos confirmados</span>
                </header>
                {metrics?.recentOrders?.length ? (
                  <div className="admin-dashboard__table-wrap">
                    <table className="admin-dashboard__table admin-dashboard__table--orders">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Cliente</th>
                        <th>Total</th>
                        <th>Estado</th>
                        <th>Fecha</th>
                        <th>Factura</th>
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
                          <td>
                            <button
                              type="button"
                              className="admin-dashboard__icon-button"
                              title="Ver factura"
                              onClick={() => openInvoiceForOrder(order.id)}
                            >
                              <FileText size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="admin-dashboard__empty">Todavía no hay pedidos registrados.</p>
                )}
              </article>

              <article className="admin-dashboard__panel">
                <header className="admin-dashboard__panel-header">
                  <h2>Facturas recientes</h2>
                  <span>Ultimas facturas emitidas</span>
                </header>
                {invoiceError && (
                  <div className="admin-dashboard__alert">
                    <AlertCircle size={18} />
                    <span>{invoiceError}</span>
                  </div>
                )}
                {invoices?.length ? (
                  <div className="admin-dashboard__table-wrap">
                    <table className="admin-dashboard__table admin-dashboard__table--invoices">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Cliente</th>
                          <th>Total</th>
                          <th>Estado</th>
                          <th>Fecha</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoices.slice(0, 5).map(inv => (
                          <tr key={inv.id}>
                            <td>
                              <div className="admin-dashboard__invoice-id">
                                <FileText size={16} />
                                <span>{inv.invoiceNumber || `Factura #${inv.id}`}</span>
                                <span className="admin-dashboard__muted">Orden #{inv.orderId}</span>
                              </div>
                            </td>
                            <td>
                              <span className="admin-dashboard__customer">{inv.customerName || 'Cliente'}</span>
                              {inv.customerEmail && (
                                <span className="admin-dashboard__customer-email">{inv.customerEmail}</span>
                              )}
                            </td>
                            <td>{formatCurrency(inv.total)}</td>
                            <td>
                              <span className={`admin-dashboard__status admin-dashboard__status--${inv.status || 'emitida'}`}>
                                {inv.status || 'emitida'}
                              </span>
                            </td>
                            <td>{inv.issuedAt ? dateFormatter.format(new Date(inv.issuedAt)) : '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="admin-dashboard__empty">Todavía no hay facturas emitidas.</p>
                )}
              </article>
            </section>
          </div>
        )}

        {/* TAB: Inventario */}
        {activeTab === 'inventario' && (
          <div className="admin-dashboard__tab-content">
            <section className="admin-dashboard__grid">
              <article className="admin-dashboard__panel admin-dashboard__panel--wide">
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
          </div>
        )}

        {/* TAB: Métricas Adicionales */}
        {activeTab === 'metricas' && (
          <div className="admin-dashboard__tab-content">
            <section className="admin-dashboard__grid admin-dashboard__grid--single-column">
              <article className="admin-dashboard__panel admin-dashboard__panel--wide">
                <header className="admin-dashboard__panel-header">
                  <h2>Métricas adicionales</h2>
                  <span>Profundiza en el desempeño general</span>
                </header>
                <div className="admin-dashboard__metrics-extra admin-dashboard__metrics-extra--large">
                  <div className="admin-dashboard__extra-card admin-dashboard__extra-card--large">
                    <Star size={40} />
                    <div>
                      <span className="admin-dashboard__extra-label">Usuarios premium</span>
                      <strong className="admin-dashboard__extra-value">{metrics?.premiumUsers ?? 0}</strong>
                      <span className="admin-dashboard__extra-subtitle">Clientes premium activos</span>
                    </div>
                  </div>
                  <div className="admin-dashboard__extra-card admin-dashboard__extra-card--large">
                    <TrendingUp size={40} />
                    <div>
                      <span className="admin-dashboard__extra-label">Ticket promedio</span>
                      <strong className="admin-dashboard__extra-value">{formatCurrency(metrics?.averageOrderValue ?? 0)}</strong>
                      <span className="admin-dashboard__extra-subtitle">Valor promedio por orden</span>
                    </div>
                  </div>
                  <div className="admin-dashboard__extra-card admin-dashboard__extra-card--large">
                    <ShoppingBag size={40} />
                    <div>
                      <span className="admin-dashboard__extra-label">Pedidos totales</span>
                      <strong className="admin-dashboard__extra-value">{metrics?.totalOrders ?? 0}</strong>
                      <span className="admin-dashboard__extra-subtitle">Órdenes completadas</span>
                    </div>
                  </div>
                </div>
              </article>
            </section>
          </div>
        )}
      </section>

      {invoiceModal.open && (
        <div 
          className="admin-dashboard__modal-backdrop" 
          role="dialog" 
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeInvoiceModal()
            }
          }}
        >
          <div className="admin-dashboard__modal">
            <button className="admin-dashboard__modal-close" onClick={closeInvoiceModal} aria-label="Cerrar">
              <X size={20} />
            </button>

            {invoiceModal.loading && (
              <div className="admin-dashboard__modal-body">
                <span className="admin-dashboard__spinner" aria-hidden="true" />
                <p>Cargando factura...</p>
              </div>
            )}

            {!invoiceModal.loading && invoiceModal.error && (
              <div className="admin-dashboard__modal-body">
                <div className="admin-dashboard__alert">
                  <AlertCircle size={18} />
                  <span>{invoiceModal.error}</span>
                </div>
              </div>
            )}

            {!invoiceModal.loading && invoiceModal.invoice && (
              <div className="admin-dashboard__modal-body">
                <header className="admin-dashboard__modal-header">
                  <div>
                    <p className="admin-dashboard__muted">Factura</p>
                    <h3>{invoiceModal.invoice.invoiceNumber || `Factura #${invoiceModal.invoice.id}`}</h3>
                    <p className="admin-dashboard__muted">Orden #{invoiceModal.invoice.orderId}</p>
                  </div>
                  <div className="admin-dashboard__status-badge">
                    <span className={`admin-dashboard__status admin-dashboard__status--${invoiceModal.invoice.status || 'emitida'}`}>
                      {invoiceModal.invoice.status || 'emitida'}
                    </span>
                    <span className="admin-dashboard__muted">{invoiceModal.invoice.issuedAt ? dateFormatter.format(new Date(invoiceModal.invoice.issuedAt)) : ''}</span>
                  </div>
                </header>

                <div className="admin-dashboard__modal-grid">
                  <div>
                    <p className="admin-dashboard__muted">Cliente</p>
                    <p className="admin-dashboard__strong">{invoiceModal.invoice.customerName || 'Cliente'}</p>
                    {invoiceModal.invoice.customerEmail && (
                      <p className="admin-dashboard__muted">{invoiceModal.invoice.customerEmail}</p>
                    )}
                  </div>
                  <div>
                    <p className="admin-dashboard__muted">Total</p>
                    <p className="admin-dashboard__strong">{formatCurrency(invoiceModal.invoice.total)}</p>
                    <p className="admin-dashboard__muted">Método: {invoiceModal.invoice.paymentMethod || '—'}</p>
                  </div>
                </div>

                <div className="admin-dashboard__items">
                  <div className="admin-dashboard__items-header">
                    <span>Producto</span>
                    <span>Cant.</span>
                    <span>Precio</span>
                    <span>Subtotal</span>
                  </div>
                  {invoiceModal.invoice.items?.map((item, idx) => (
                    <div key={`${item.productId}-${idx}`} className="admin-dashboard__item-row">
                      <span>{item.productName || `Producto #${item.productId}`}</span>
                      <span>x{item.quantity}</span>
                      <span>{formatCurrency(item.price)}</span>
                      <span>{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="admin-dashboard__totals">
                  <div>
                    <span>Productos</span>
                    <strong>{formatCurrency(invoiceModal.invoice.itemsTotal || 0)}</strong>
                  </div>
                  <div>
                    <span>Envío</span>
                    <strong>{formatCurrency(invoiceModal.invoice.shippingCost || 0)}</strong>
                  </div>
                  {invoiceModal.invoice.premiumDiscount > 0 && (
                    <div>
                      <span>Descuento Premium</span>
                      <strong>-{formatCurrency(invoiceModal.invoice.premiumDiscount || 0)}</strong>
                    </div>
                  )}
                  {invoiceModal.invoice.couponDiscount > 0 && (
                    <div>
                      <span>Cupón Veterinario (5%)</span>
                      <strong>-{formatCurrency(invoiceModal.invoice.couponDiscount || 0)}</strong>
                    </div>
                  )}
                  <div className="admin-dashboard__total-line">
                    <span>Total</span>
                    <strong>{formatCurrency(invoiceModal.invoice.total || 0)}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
