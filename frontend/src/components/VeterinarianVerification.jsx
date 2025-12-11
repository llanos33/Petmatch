import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { CheckCircle, AlertCircle, Stethoscope } from 'lucide-react'
import { apiPath } from '../config/api'
import './VeterinarianVerification.css'

function VeterinarianVerification() {
  const { user, getAuthToken } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    professionalLicense: '',
    licenseNumber: '',
    clinic: '',
    specialties: '',
    certificate: null
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validar que sea un archivo válido (PDF, JPG, PNG)
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
      if (!validTypes.includes(file.type)) {
        setError('Por favor sube un archivo en formato PDF, JPG o PNG')
        return
      }
      // Validar tamaño máximo (2MB para archivos base64)
      if (file.size > 2 * 1024 * 1024) {
        setError('El archivo debe ser menor a 2MB. Por favor comprime tu imagen o reduce el tamaño del PDF.')
        return
      }
      setFormData(prev => ({
        ...prev,
        certificate: file
      }))
      setError(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (!formData.licenseNumber || !formData.clinic) {
      setError('Por favor completa todos los campos requeridos')
      setLoading(false)
      return
    }

    if (!formData.certificate) {
      setError('Por favor sube un certificado o copia de tu tarjeta profesional')
      setLoading(false)
      return
    }

    try {
      const token = getAuthToken()
      
      // Convertir archivo a base64 usando Promise
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = () => reject(new Error('Error al procesar el archivo'))
        reader.readAsDataURL(formData.certificate)
      })

      const fileName = formData.certificate.name
      const fileType = formData.certificate.type

      console.log('Enviando solicitud de verificación...', { fileName, fileType })

      const response = await fetch(apiPath('/api/veterinarian/verify'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          professionalLicense: formData.professionalLicense,
          licenseNumber: formData.licenseNumber,
          clinic: formData.clinic,
          specialties: formData.specialties,
          certificateFile: base64,
          certificateFileName: fileName,
          certificateFileType: fileType
        })
      })

      console.log('Respuesta del servidor:', response.status)

      const data = await response.json()

      console.log('Datos de respuesta:', data)

      if (response.ok && data.success) {
        setSuccess(true)
        setTimeout(() => {
          navigate('/')
        }, 2000)
      } else {
        setError(data.error || 'Error al enviar la solicitud')
      }
      setLoading(false)
    } catch (err) {
      console.error('Error:', err)
      setError(err.message || 'Error al enviar la solicitud. Por favor intenta de nuevo.')
      setLoading(false)
    }
  }

  if (!user) {
    navigate('/login')
    return null
  }

  if (success) {
    return (
      <div className="vet-verification-container">
        <div className="vet-success-card">
          <div className="success-icon">
            <CheckCircle size={64} />
          </div>
          <h2>¡Solicitud enviada exitosamente!</h2>
          <p>Hemos recibido tu solicitud de verificación. Nuestro equipo la revisará en un plazo de 2-3 días hábiles.</p>
          <p>Te notificaremos por correo electrónico sobre el estado de tu verificación.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="vet-verification-container">
      <div className="vet-verification-card">
        <div className="vet-header">
          <Stethoscope size={40} />
          <h1>Verificación de Veterinario</h1>
          <p>Para ser parte de nuestro programa de veterinarios, necesitamos verificar tu profesionalidad</p>
        </div>

        {error && (
          <div className="verification-error">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="vet-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="professionalLicense">Colegio Profesional</label>
              <input
                type="text"
                id="professionalLicense"
                name="professionalLicense"
                value={formData.professionalLicense}
                onChange={handleInputChange}
                placeholder="Ej: Colegio de Médicos Veterinarios"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="licenseNumber">Número de Cédula Profesional *</label>
              <input
                type="text"
                id="licenseNumber"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleInputChange}
                placeholder="Ej: 123456789"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="clinic">Clínica/Consultorio *</label>
              <input
                type="text"
                id="clinic"
                name="clinic"
                value={formData.clinic}
                onChange={handleInputChange}
                placeholder="Nombre de tu clínica o consultorio"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="specialties">Especialidades</label>
              <input
                type="text"
                id="specialties"
                name="specialties"
                value={formData.specialties}
                onChange={handleInputChange}
                placeholder="Ej: Cirugía, Dermatología, etc."
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="certificate">Certificado/Tarjeta Profesional *</label>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  id="certificate"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  required
                />
                <div className="file-label">
                  {formData.certificate ? (
                    <>
                      <span className="file-name">✓ {formData.certificate.name}</span>
                    </>
                  ) : (
                    <>
                      <span>PDF, JPG o PNG (máx 2MB)</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Enviando solicitud...' : 'Enviar solicitud de verificación'}
          </button>
        </form>

        <div className="vet-info">
          <p><strong>Nota:</strong> La verificación puede tomar 2-3 días hábiles. Una vez aprobada, podrás acceder a funcionalidades especiales para veterinarios.</p>
        </div>
      </div>
    </div>
  )
}

export default VeterinarianVerification
