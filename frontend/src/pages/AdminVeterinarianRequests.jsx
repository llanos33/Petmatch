import React, { useEffect, useState, useCallback } from 'react'
import { AlertCircle, CheckCircle, XCircle, RefreshCw } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { apiPath } from '../config/api'
import './AdminVeterinarianRequests.css'

const dateFormatter = new Intl.DateTimeFormat('es-CO', {
  dateStyle: 'medium',
  timeStyle: 'short'
})

const AdminVeterinarianRequests = () => {
  const { user, getAuthToken, loading } = useAuth()
  const [requests, setRequests] = useState([])
  const [loadingRequests, setLoadingRequests] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [processingId, setProcessingId] = useState(null)

  const loadRequests = useCallback(async () => {
    if (!user?.isAdmin) {
      setLoadingRequests(false)
      return
    }

    try {
      setLoadingRequests(true)
      setError('')
      const token = getAuthToken()

      if (!token) {
        throw new Error('No se encontró un token de autenticación.')
      }

      const response = await fetch(apiPath('/api/admin/veterinarian-requests'), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const payload = await response.json()

      if (!response.ok || payload.success === false) {
        throw new Error(payload.error || 'No se pudieron obtener las solicitudes.')
      }

      setRequests(payload.data || [])
    } catch (err) {
      console.error('Error al cargar solicitudes:', err)
      setError(err?.message || 'Error inesperado al cargar las solicitudes.')
    } finally {
      setLoadingRequests(false)
    }
  }, [getAuthToken, user?.isAdmin])

  useEffect(() => {
    loadRequests()
  }, [loadRequests])

  const handleApprove = async (requestId) => {
    try {
      setProcessingId(requestId)
      setError('')
      const token = getAuthToken()

      const response = await fetch(apiPath(`/api/admin/veterinarian-requests/${requestId}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'approved' })
      })

      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.error || 'Error al aprobar solicitud.')
      }

      setSuccess('Solicitud aprobada exitosamente.')
      await loadRequests()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      console.error('Error al aprobar:', err)
      setError(err?.message || 'Error al aprobar la solicitud.')
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async (requestId) => {
    if (!window.confirm('¿Estás seguro de que deseas rechazar esta solicitud?')) {
      return
    }

    try {
      setProcessingId(requestId)
      setError('')
      const token = getAuthToken()

      const response = await fetch(apiPath(`/api/admin/veterinarian-requests/${requestId}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'rejected' })
      })

      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.error || 'Error al rechazar solicitud.')
      }

      setSuccess('Solicitud rechazada.')
      await loadRequests()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      console.error('Error al rechazar:', err)
      setError(err?.message || 'Error al rechazar la solicitud.')
    } finally {
      setProcessingId(null)
    }
  }

  if (loading || loadingRequests) {
    return (
      <div className="vet-requests vet-requests--loading">
        <div className="vet-requests__spinner-container">
          <span className="vet-requests__spinner" aria-hidden="true" />
          <p>Cargando solicitudes...</p>
        </div>
      </div>
    )
  }

  if (!user?.isAdmin) {
    return (
      <div className="vet-requests vet-requests--center">
        <div className="vet-requests__card">
          <h2>Acceso restringido</h2>
          <p>Solo los administradores pueden revisar solicitudes de veterinarios.</p>
        </div>
      </div>
    )
  }

  const pendingRequests = requests.filter(r => r.status === 'pending')
  const approvedRequests = requests.filter(r => r.status === 'approved')
  const rejectedRequests = requests.filter(r => r.status === 'rejected')

  return (
    <div className="vet-requests">
      <header className="vet-requests__header">
        <div>
          <h1>Solicitudes de verificación de veterinarios</h1>
          <p>Revisa y aprueba solicitudes de verificación de profesionales veterinarios.</p>
        </div>
        <button
          type="button"
          className="vet-requests__refresh"
          onClick={loadRequests}
          disabled={loadingRequests}
        >
          <RefreshCw size={18} />
          <span>Actualizar</span>
        </button>
      </header>

      {error && (
        <div className="vet-requests__alert vet-requests__alert--error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="vet-requests__alert vet-requests__alert--success">
          <CheckCircle size={18} />
          <span>{success}</span>
        </div>
      )}

      <div className="vet-requests__stats">
        <div className="vet-requests__stat-card">
          <span className="vet-requests__stat-badge vet-requests__stat-badge--pending">
            {pendingRequests.length}
          </span>
          <div>
            <span className="vet-requests__stat-label">Pendientes</span>
            <span className="vet-requests__stat-value">Por revisar</span>
          </div>
        </div>
        <div className="vet-requests__stat-card">
          <span className="vet-requests__stat-badge vet-requests__stat-badge--approved">
            {approvedRequests.length}
          </span>
          <div>
            <span className="vet-requests__stat-label">Aprobadas</span>
            <span className="vet-requests__stat-value">Verificadas</span>
          </div>
        </div>
        <div className="vet-requests__stat-card">
          <span className="vet-requests__stat-badge vet-requests__stat-badge--rejected">
            {rejectedRequests.length}
          </span>
          <div>
            <span className="vet-requests__stat-label">Rechazadas</span>
            <span className="vet-requests__stat-value">No verificadas</span>
          </div>
        </div>
      </div>

      {/* SOLICITUDES PENDIENTES */}
      <section className="vet-requests__section">
        <h2 className="vet-requests__section-title">Solicitudes pendientes de revisión</h2>
        {pendingRequests.length > 0 ? (
          <div className="vet-requests__list">
            {pendingRequests.map(request => (
              <article key={request.id} className="vet-requests__card">
                <div className="vet-requests__card-header">
                  <div>
                    <h3 className="vet-requests__card-name">{request.userName}</h3>
                    <p className="vet-requests__card-email">{request.userEmail}</p>
                  </div>
                  <span className="vet-requests__card-status vet-requests__card-status--pending">
                    Pendiente
                  </span>
                </div>

                <div className="vet-requests__card-content">
                  <div className="vet-requests__info-group">
                    <label className="vet-requests__label">Cédula Profesional</label>
                    <p className="vet-requests__value">{request.licenseNumber}</p>
                  </div>

                  <div className="vet-requests__info-group">
                    <label className="vet-requests__label">Colegio/Licencia</label>
                    <p className="vet-requests__value">
                      {request.professionalLicense || 'No especificado'}
                    </p>
                  </div>

                  <div className="vet-requests__info-group">
                    <label className="vet-requests__label">Clínica/Consultorio</label>
                    <p className="vet-requests__value">{request.clinic}</p>
                  </div>

                  <div className="vet-requests__info-group">
                    <label className="vet-requests__label">Especialidades</label>
                    <p className="vet-requests__value">
                      {request.specialties || 'No especificadas'}
                    </p>
                  </div>

                  {request.certificatePath && (
                    <div className="vet-requests__info-group">
                      <label className="vet-requests__label">Certificado Profesional</label>
                      <a 
                        href={apiPath(request.certificatePath)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="vet-requests__certificate-link"
                      >
                        📄 Ver {request.certificateFileName || 'Certificado'}
                      </a>
                    </div>
                  )}

                  <div className="vet-requests__info-group">
                    <label className="vet-requests__label">Fecha de solicitud</label>
                    <p className="vet-requests__value">
                      {dateFormatter.format(new Date(request.submittedAt))}
                    </p>
                  </div>
                </div>

                <div className="vet-requests__card-actions">
                  <button
                    type="button"
                    className="vet-requests__btn vet-requests__btn--approve"
                    onClick={() => handleApprove(request.id)}
                    disabled={processingId === request.id}
                  >
                    <CheckCircle size={16} />
                    Aprobar
                  </button>
                  <button
                    type="button"
                    className="vet-requests__btn vet-requests__btn--reject"
                    onClick={() => handleReject(request.id)}
                    disabled={processingId === request.id}
                  >
                    <XCircle size={16} />
                    Rechazar
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="vet-requests__empty">No hay solicitudes pendientes de revisión.</p>
        )}
      </section>

      {/* SOLICITUDES APROBADAS */}
      {approvedRequests.length > 0 && (
        <section className="vet-requests__section">
          <h2 className="vet-requests__section-title">Solicitudes aprobadas</h2>
          <div className="vet-requests__list vet-requests__list--approved">
            {approvedRequests.map(request => (
              <article key={request.id} className="vet-requests__card">
                <div className="vet-requests__card-header">
                  <div>
                    <h3 className="vet-requests__card-name">{request.userName}</h3>
                    <p className="vet-requests__card-email">{request.userEmail}</p>
                  </div>
                  <span className="vet-requests__card-status vet-requests__card-status--approved">
                    Aprobada
                  </span>
                </div>

                <div className="vet-requests__card-content">
                  <div className="vet-requests__info-group">
                    <label className="vet-requests__label">Clínica/Consultorio</label>
                    <p className="vet-requests__value">{request.clinic}</p>
                  </div>
                  
                  {request.certificatePath && (
                    <div className="vet-requests__info-group">
                      <label className="vet-requests__label">Certificado Profesional</label>
                      <a 
                        href={apiPath(request.certificatePath)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="vet-requests__certificate-link"
                      >
                        📄 Ver {request.certificateFileName || 'Certificado'}
                      </a>
                    </div>
                  )}
                  
                  <div className="vet-requests__info-group">
                    <label className="vet-requests__label">Aprobada el</label>
                    <p className="vet-requests__value">
                      {request.reviewedAt
                        ? dateFormatter.format(new Date(request.reviewedAt))
                        : 'Recientemente'}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* SOLICITUDES RECHAZADAS */}
      {rejectedRequests.length > 0 && (
        <section className="vet-requests__section">
          <h2 className="vet-requests__section-title">Solicitudes rechazadas</h2>
          <div className="vet-requests__list vet-requests__list--rejected">
            {rejectedRequests.map(request => (
              <article key={request.id} className="vet-requests__card">
                <div className="vet-requests__card-header">
                  <div>
                    <h3 className="vet-requests__card-name">{request.userName}</h3>
                    <p className="vet-requests__card-email">{request.userEmail}</p>
                  </div>
                  <span className="vet-requests__card-status vet-requests__card-status--rejected">
                    Rechazada
                  </span>
                </div>

                <div className="vet-requests__card-content">
                  {request.certificatePath && (
                    <div className="vet-requests__info-group">
                      <label className="vet-requests__label">Certificado Profesional</label>
                      <a 
                        href={apiPath(request.certificatePath)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="vet-requests__certificate-link"
                      >
                        📄 Ver {request.certificateFileName || 'Certificado'}
                      </a>
                    </div>
                  )}
                  
                  <div className="vet-requests__info-group">
                    <label className="vet-requests__label">Rechazada el</label>
                    <p className="vet-requests__value">
                      {request.reviewedAt
                        ? dateFormatter.format(new Date(request.reviewedAt))
                        : 'Recientemente'}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default AdminVeterinarianRequests
