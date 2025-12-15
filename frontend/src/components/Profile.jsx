import React, { useState, useEffect } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Breadcrumb from './Breadcrumb'
import { Crown, Truck, Percent, BookOpen, Sparkles, MessageCircle, CheckCircle, Clock, Stethoscope } from 'lucide-react'
import './Profile.css'
import { apiPath } from '../config/api'

function Profile() {
  const { user, logout } = useAuth()
  const [orders, setOrders] = useState([])
  const [consultations, setConsultations] = useState([])
  const [vetRewards, setVetRewards] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [consultationsLoading, setConsultationsLoading] = useState(true)
  const [searchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState('orders')
  const navigate = useNavigate()

  useEffect(() => {
    const tabParam = searchParams.get('tab')
    if (tabParam === 'consultas') {
      setActiveTab('consultas')
    }
  }, [searchParams])

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    fetchProducts()
    fetchOrders()
    fetchConsultations()
    if (user?.isVeterinarian) {
      fetchVetRewards()
    }
  }, [user, navigate])

  const fetchProducts = async () => {
    try {
      const response = await fetch(apiPath('/api/products'))
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Error al cargar productos:', error)
    }
  }

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(apiPath('/api/auth/orders'), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
      console.error('Error al cargar órdenes:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchConsultations = async () => {
    try {
      const token = localStorage.getItem('token')
      console.log('Fetching consultations with token:', token ? 'exists' : 'missing')
      
      const response = await fetch(apiPath('/api/auth/consultations'), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      console.log('Consultations response status:', response.status)

      if (response.ok) {
        const data = await response.json()
        console.log('Consultations data received:', data)
        setConsultations(data)
      } else {
        console.error('Failed to fetch consultations:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('Error al cargar consultas:', error)
    } finally {
      setConsultationsLoading(false)
    }
  }

  const fetchVetRewards = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(apiPath(`/api/veterinarians/${user.id}/rewards`), {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        const payload = await response.json()
        setVetRewards(payload.data)
      }
    } catch (e) {
      console.error('Error cargando recompensas de veterinario', e)
    }
  }

  const claimVetCoupon = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(apiPath(`/api/veterinarians/${user.id}/coupons`), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      const payload = await response.json()
      if (response.ok && payload.success) {
        // Refresh rewards to reflect issued coupon
        fetchVetRewards()
        alert(`Cupón generado: ${payload.data.code}`)
      } else {
        alert(payload.error || 'No fue posible generar el cupón')
      }
    } catch (e) {
      alert('Error al generar el cupón')
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(price)
  }

  const getItemPrice = (item) => {
    const product = products.find(p => p.id === item.productId)
    const basePrice = product?.price || 0
    return item.price ?? basePrice
  }

  const getOrderTotal = (order) => {
    const itemsTotal = order.items.reduce((total, item) => {
      const price = getItemPrice(item)
      return total + price * item.quantity
    }, 0)

    const shipping = typeof order.shippingCost === 'number'
      ? order.shippingCost
      : (user?.isPremium ? 0 : 8000)
    const premiumDiscountStored = typeof order.premiumDiscount === 'number' ? order.premiumDiscount : null

    // Si el backend ya guardó total, úsalo cuando existan shipping/premiumDiscount coherentes
    if (typeof order.total === 'number' && premiumDiscountStored !== null) {
      return order.total
    }

    // Si no hay premiumDiscount almacenado pero el usuario es premium, aplica el 10% sobre los precios ya descontados
    const premiumDiscount = premiumDiscountStored !== null
      ? premiumDiscountStored
      : (user?.isPremium ? Math.round(itemsTotal * 0.10) : 0)

    return itemsTotal - premiumDiscount + shipping
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId)
    return product ? product.name : `Producto ID: ${productId}`
  }

  if (!user) {
    return null
  }

  return (
    <div className="profile-container">
      <Breadcrumb />
      <div className="profile-header">
        <h1>Mi Perfil</h1>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <Link to="/pets" className="shop-button">
            Mis Mascotas
          </Link>
          <button onClick={handleLogout} className="logout-button">
            Cerrar Sesion
          </button>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-info-card">
          <h2>Informacion Personal</h2>
          <div className="info-item">
            <span className="info-label">Estado de cuenta:</span>
            <span className={`info-value premium-status ${user.isPremium ? 'premium' : 'no-premium'}`}>
              {user.isPremium ? 'Premium' : 'No-Premium'}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Nombre:</span>
            <span className="info-value">{user.name}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Email:</span>
            <span className="info-value">{user.email}</span>
          </div>
          {user.phone && (
            <div className="info-item">
              <span className="info-label">Telefono:</span>
              <span className="info-value">{user.phone}</span>
            </div>
          )}
          
        </div>

        {/* Sección de Beneficios Premium */}
        <div className="profile-cards-wrapper">
        {user.isPremium ? (
          <div className="premium-benefits-card">
            <div className="premium-benefits-header">
              <Crown size={28} className="crown-icon" />
              <h2>Tus Beneficios Premium</h2>
            </div>
            <p className="benefits-subtitle">Disfruta de ventajas exclusivas como miembro Premium</p>
            <div className="benefits-grid">
              <div className="benefit-item">
                <div className="benefit-icon">
                  <Percent size={24} />
                </div>
                <div className="benefit-content">
                  <h3>10% Descuento Extra</h3>
                  <p>Ahorro adicional en productos con descuento</p>
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">
                  <Truck size={24} />
                </div>
                <div className="benefit-content">
                  <h3>Envío Gratis</h3>
                  <p>En todas tus compras, sin mínimo</p>
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">
                  <BookOpen size={24} />
                </div>
                <div className="benefit-content">
                  <h3>Contenido Exclusivo</h3>
                  <p>Acceso a artículos premium en el Blog</p>
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">
                  <Sparkles size={24} />
                </div>
                <div className="benefit-content">
                  <h3>Soporte Prioritario</h3>
                  <p>Atención preferencial en tus consultas</p>
                </div>
              </div>
            </div>
            <div className="premium-since">
              <p>Miembro Premium desde {user.premiumSince ? formatDate(user.premiumSince) : 'hoy'}</p>
            </div>
          </div>
        ) : (
          <div className="premium-cta-card">
            <Crown size={40} className="cta-crown" />
            <h2>Hazte Premium</h2>
            <p>Desbloquea beneficios exclusivos: descuentos adicionales, envío gratis y contenido premium</p>
            <Link to="/premium" className="upgrade-button">
              Ver Planes Premium
            </Link>
          </div>
        )}
        </div>

        {/* Tarea mensual y Perfil Veterinario en una fila */}
        {user.isVeterinarian && (
          <div className="vet-row">
            <div className="vet-rewards-card">
              <div className="vet-rewards-header">
                <Stethoscope size={28} color="white" strokeWidth={2.5} />
                <div>
                  <h3 className="vet-rewards-title">Tarea mensual: Responde 10 consultas</h3>
                </div>
              </div>
              <p className="vet-rewards-subtitle">Por cada 10 consultas contestadas en el mes, ganas un cupón del 5% para cualquier producto. ¡Sigue ayudando a nuestros usuarios!</p>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${Math.round((vetRewards?.progress || 0) * 100)}%` }} />
              </div>
              <div className="progress-info">
                <span>📋 {vetRewards ? `${vetRewards.count} / ${vetRewards.threshold} consultas` : 'Cargando...'}</span>
                <span>⭐ {vetRewards ? `${Math.round((vetRewards.progress) * 100)}%` : ''}</span>
              </div>
              <button className="coupon-button" disabled={!vetRewards || (!vetRewards.eligible)} onClick={claimVetCoupon}>
                {vetRewards?.couponIssued ? '✓ Cupón ya emitido este mes' : (vetRewards?.eligible ? '🎁 Generar cupón 5%' : '⏳ Sigue respondiendo consultas')}
              </button>
            </div>

            <div className="veterinarian-section-card">
              <div className="veterinarian-header">
                <Stethoscope size={28} className="stethoscope-icon" />
                <div>
                  <h2>Perfil Veterinario</h2>
                  {user.isVerifiedVeterinarian ? (
                    <p className="vet-status verified">✓ Cuenta Verificada</p>
                  ) : (
                    <p className="vet-status pending">Pendiente de Verificación</p>
                  )}
                </div>
              </div>

              {!user.isVerifiedVeterinarian && (
                <div className="vet-info-card">
                  {user.rejectedRequests && user.rejectedRequests.length > 0 ? (
                    <>
                      <p style={{ color: '#dc2626', fontWeight: '600' }}>Tu solicitud fue rechazada</p>
                      <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>{user.rejectedRequests[user.rejectedRequests.length - 1].reason}</p>
                      {(() => {
                        const lastRejection = user.rejectedRequests[user.rejectedRequests.length - 1];
                        const rejectedDate = new Date(lastRejection.rejectedAt);
                        const now = new Date();
                        const canReapply = new Date(rejectedDate.getTime() + 30 * 24 * 60 * 60 * 1000);
                        const daysRemaining = Math.ceil((canReapply - now) / (24 * 60 * 60 * 1000));
                        if (daysRemaining > 0) {
                          return <p style={{ fontSize: '0.85rem', opacity: 0.9 }}>Podrás volver a intentar en <strong>{daysRemaining} días</strong></p>;
                        } else {
                          return (
                            <Link to="/veterinarian-verification" className="verify-button">
                              Intentar de Nuevo
                            </Link>
                          );
                        }
                      })()}
                    </>
                  ) : (
                    <>
                      <p>Tu cuenta de veterinario está pendiente de verificación. Completa el proceso para acceder a todas las funcionalidades.</p>
                      <Link to="/veterinarian-verification" className="verify-button">
                        Verificar Cuenta
                      </Link>
                    </>
                  )}
                </div>
              )}

              {user.isVerifiedVeterinarian && user.veterinarianDetails && (
                <div className="vet-details">
                  <div className="vet-detail-item">
                    <span className="detail-label">Clínica/Consultorio:</span>
                    <span className="detail-value">{user.veterinarianDetails.clinic}</span>
                  </div>
                  {user.veterinarianDetails.specialties && (
                    <div className="vet-detail-item">
                      <span className="detail-label">Especialidades:</span>
                      <span className="detail-value">{user.veterinarianDetails.specialties}</span>
                    </div>
                  )}
                  {user.veterinarianDetails.licenseNumber && (
                    <div className="vet-detail-item">
                      <span className="detail-label">Cédula Profesional:</span>
                      <span className="detail-value">{user.veterinarianDetails.licenseNumber}</span>
                    </div>
                  )}
                  {user.veterinarianDetails.approvedAt && (
                    <div className="vet-detail-item">
                      <span className="detail-label">Verificado el:</span>
                      <span className="detail-value">{formatDate(user.veterinarianDetails.approvedAt)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Pestañas de navegación */}
        <div className="profile-tabs">
          <button 
            className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <Truck size={20} />
            Mis Compras
          </button>
          <button 
            className={`tab-button ${activeTab === 'consultas' ? 'active' : ''}`}
            onClick={() => setActiveTab('consultas')}
          >
            <MessageCircle size={20} />
            Mis Consultas
          </button>
        </div>

        {/* Sección de Compras */}
        {activeTab === 'orders' && (
          <div className="orders-section">
            <h2>Mis Compras</h2>
            {loading ? (
              <p>Cargando...</p>
            ) : orders.length === 0 ? (
              <div className="no-orders">
                <p>No has realizado ninguna compra aún</p>
                <button onClick={() => navigate('/')} className="shop-button">
                  Ir a Comprar
                </button>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map(order => (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <div>
                        <h3>Orden #{order.id}</h3>
                        <p className="order-date">Fecha: {formatDate(order.date)}</p>
                      </div>
                      <div className="order-status">
                        <span className={`status-badge status-${order.status}`}>
                          {order.status}
                        </span>
                        <span className="order-total">{formatPrice(getOrderTotal(order))}</span>
                      </div>
                    </div>
                    
                    <div className="order-items">
                      <h4>Productos:</h4>
                      <ul>
                        {order.items.map((item, index) => (
                          <li key={index}>
                            <span>{item.quantity}x</span>
                            <span>{getProductName(item.productId)}</span>
                            <span className="order-item-price">{formatPrice(getItemPrice(item))}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="order-address">
                      <h4>Dirección de entrega:</h4>
                      <p>{order.customerInfo.address}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Sección de Consultas */}
        {activeTab === 'consultas' && (
          <div className="consultations-section">
            <h2>Mis Consultas Veterinarias</h2>
            {consultationsLoading ? (
              <p>Cargando...</p>
            ) : consultations.length === 0 ? (
              <div className="no-consultations">
                <MessageCircle size={48} />
                <p>No has realizado ninguna consulta aún</p>
                <button onClick={() => navigate('/consultations')} className="shop-button">
                  Hacer una Consulta
                </button>
              </div>
            ) : (
              <div className="consultations-list">
                {consultations.map(consultation => (
                  <div key={consultation.id} className="consultation-card">
                    <div className="consultation-header">
                      <div>
                        <h3>{consultation.title}</h3>
                        <p className="consultation-date">
                          {formatDate(consultation.createdAt)}
                        </p>
                        <span className="pet-type-badge">{consultation.petType}</span>
                        {consultation.petName && (
                          <span className="pet-linked-badge">
                            {consultation.petPhoto && (
                              <img
                                className="pet-mini-avatar"
                                src={consultation.petPhoto}
                                alt={consultation.petName}
                                loading="lazy"
                              />
                            )}
                            Mascota: {consultation.petName}
                          </span>
                        )}
                      </div>
                      <div className={`consultation-status ${consultation.status}`}>
                        {consultation.status === 'answered' ? (
                          <>
                            <CheckCircle size={20} />
                            <span>Respondida</span>
                          </>
                        ) : (
                          <>
                            <Clock size={20} />
                            <span>Pendiente</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="consultation-question">
                      <h4>Tu pregunta:</h4>
                      <p>{consultation.question}</p>
                    </div>

                    {consultation.answer && (
                      <div className="consultation-answer">
                        <h4>Respuesta del veterinario:</h4>
                        <p>{consultation.answer}</p>
                        {consultation.answeredAt && (
                          <p className="answered-date">
                            Respondida el {formatDate(consultation.answeredAt)}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile


