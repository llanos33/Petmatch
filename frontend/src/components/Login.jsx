import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const highlights = [
    'Guarda tus direcciones favoritas y agiliza tus pedidos.',
    'Recibe recomendaciones personalizadas para tu mascota.',
    'Accede a tu historial y seguimiento de compras en segundos.'
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(email, password)

    if (result.success) {
      navigate('/')
    } else {
      setError(result.error || 'Error al iniciar sesión')
    }
    setLoading(false)
  }

  return (
    <div className="auth-container auth-container-login">
      <div className="auth-card auth-card-split">
        <div className="auth-panel">
          <span className="auth-panel-badge">🐾 Bienvenido de vuelta</span>
          <h2>Tu cuenta, tu mundo PetMatch</h2>
          <p className="auth-panel-text">
            Administra tus pedidos, guarda favoritos y recibe alertas personalizadas para engreír a tu peludo.
          </p>
          <ul className="auth-panel-list">
            {highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="auth-panel-note">
            ¿Aún no eres parte de la familia? <Link to="/register">Regístrate gratis</Link>
          </p>
        </div>

        <div className="auth-form-wrapper">
          <h1>Iniciar sesión</h1>
          <p className="auth-subtitle">Ingresa tus datos para continuar</p>

          {error && (
            <div className="auth-error">
              {error.includes('credenciales') ? 'Usuario no encontrado' : error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="nombre@correo.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Ingresa tu contraseña"
              />
            </div>

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>

          <p className="auth-footer">
            ¿Olvidaste tu contraseña? Escríbenos a <a href="mailto:soporte@petmatch.co">soporte@petmatch.co</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login

