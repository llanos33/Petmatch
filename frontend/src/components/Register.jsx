import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const perks = [
    'Descuentos especiales y regalos de bienvenida.',
    'Seguimiento de pedidos en tiempo real y recordatorios.',
    'Recomendaciones según la edad y estilo de vida de tu mascota.'
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const trimmedName = name.trim()
    if (trimmedName.length === 0 || trimmedName.length > 20) {
      setError('El nombre debe tener máximo 20 caracteres')
      return
    }

    const numericPhone = phone.replace(/\D/g, '')
    if (numericPhone.length !== 10) {
      setError('El teléfono debe tener exactamente 10 dígitos')
      return
    }

    const passwordPolicy = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,}$/
    if (!passwordPolicy.test(password)) {
      setError('La contraseña debe tener mínimo 6 caracteres, con 1 mayúscula, 1 número y 1 caracter especial')
      return
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    setLoading(true)

    const result = await register(trimmedName, email, password, numericPhone)

    if (result.success) {
      navigate('/')
    } else {
      setError(result.error || 'Error al registrarse')
    }
    setLoading(false)
  }

  return (
    <div className="auth-container auth-container-register">
      <div className="auth-card auth-card-split">
        <div className="auth-panel">
          <span className="auth-panel-badge">✨ Bienvenido a PetMatch</span>
          <h2>Crea tu cuenta y consiente a tu peludo</h2>
          <p className="auth-panel-text">
            Llena tus datos y comienza a disfrutar de beneficios pensados para cada etapa de tu compañero fiel.
          </p>
          <ul className="auth-panel-list">
            {perks.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="auth-panel-note">
            ¿Ya estás registrado? <Link to="/login">Inicia sesión aquí</Link>
          </p>
        </div>

        <div className="auth-form-wrapper">
          <h1>Crear cuenta</h1>
          <p className="auth-subtitle">Completa el formulario y únete a la comunidad PetMatch</p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="name">Nombre completo</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={30}
                placeholder="Nombre y apellido"
              />
            </div>

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
              <label htmlFor="phone">Teléfono</label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                inputMode="numeric"
                pattern="\d{10}"
                maxLength={10}
                placeholder="3001234567"
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
                placeholder="Mínimo 6 caracteres, 1 mayúscula, 1 número y 1 símbolo"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar contraseña</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Repite tu contraseña"
              />
            </div>

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>

          <button
            type="button"
            className="auth-secondary-button"
            onClick={() => navigate(-1)}
          >
            Regresar
          </button>

          <p className="auth-footer">
            Al continuar aceptas nuestros <Link to="/terms">Términos y Condiciones</Link> y la <Link to="/privacy">Política de Privacidad</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
