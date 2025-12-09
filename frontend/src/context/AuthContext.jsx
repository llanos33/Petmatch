import React, { createContext, useState, useEffect, useContext, useCallback } from 'react'
import { apiPath } from '../config/api'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children, clearCart }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(null)

  useEffect(() => {
    // Verificar si hay un token guardado
    const token = localStorage.getItem('token')
    if (token) {
      setToken(token)
      fetchProfile(token)
    } else {
      setLoading(false)
    }
  }, [])

  const handleSessionDrop = useCallback(() => {
    localStorage.removeItem('token')
    setUser(null)
    setToken(null)
    try {
      if (typeof clearCart === 'function') clearCart()
    } catch (e) {
      console.warn('clearCart failed during session drop', e)
    }
  }, [clearCart])

  const loadPremiumMap = () => {
    try {
      const raw = localStorage.getItem('premiumUsers')
      if (!raw) return {}
      return JSON.parse(raw) || {}
    } catch (e) {
      return {}
    }
  }

  const savePremiumMap = (map) => {
    try {
      localStorage.setItem('premiumUsers', JSON.stringify(map))
    } catch (e) {
      console.warn('No se pudo guardar premiumUsers', e)
    }
  }

  const syncPremiumFlag = (data) => {
    const map = loadPremiumMap()
    const emailKey = data?.email || ''
    const backendPremium = data?.isPremium === true
    let changed = false

    if (emailKey) {
      if (backendPremium) {
        if (map[emailKey] !== true) {
          map[emailKey] = true
          changed = true
        }
      } else if (map[emailKey]) {
        delete map[emailKey]
        changed = true
      }
    }

    if (changed) {
      savePremiumMap(map)
    }

    const localPremium = emailKey && map[emailKey] === true
    const isPremium = backendPremium || localPremium || false
    const isAdmin = data?.isAdmin === true || false
    return { ...data, isPremium, isAdmin }
  }

  const fetchProfile = async (token) => {
    try {
      const response = await fetch(apiPath('/api/auth/profile'), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const userData = await response.json()
        setUser(syncPremiumFlag(userData))
        setToken(token)
      } else {
        handleSessionDrop()
      }
    } catch (error) {
      console.error('Error al obtener perfil:', error)
      handleSessionDrop()
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!user?.id || !token) return

    let cancelled = false
    let sessionCleared = false
    let failureCount = 0
    const MAX_FAILURES = 3 // Permitir 3 fallos consecutivos antes de cerrar sesión

    const verifySession = async () => {
      const activeToken = localStorage.getItem('token')
      if (!activeToken || cancelled || sessionCleared) return

      try {
        const response = await fetch(apiPath('/api/auth/profile'), {
          headers: {
            'Authorization': `Bearer ${activeToken}`
          }
        })

        if (response.ok) {
          // Sesión válida, resetear contador de fallos
          failureCount = 0
        } else if (response.status === 401 || response.status === 403) {
          // Token inválido o expirado, cerrar sesión inmediatamente
          if (!cancelled && !sessionCleared) {
            sessionCleared = true
            handleSessionDrop()
          }
        } else {
          // Otro error (500, etc), incrementar contador
          failureCount++
          if (failureCount >= MAX_FAILURES && !cancelled && !sessionCleared) {
            sessionCleared = true
            handleSessionDrop()
          }
        }
      } catch (error) {
        // Error de red, incrementar contador pero no cerrar inmediatamente
        failureCount++
        if (failureCount >= MAX_FAILURES && !cancelled && !sessionCleared) {
          console.warn('Sesión cerrada por múltiples fallos de conexión', error)
          sessionCleared = true
          handleSessionDrop()
        }
      }
    }

    // Verificar sesión cada 5 minutos en lugar de 30 segundos
    const intervalId = setInterval(verifySession, 300000)
    const handleVisibility = () => {
      if (!document.hidden) {
        verifySession()
      }
    }

    verifySession()
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      cancelled = true
      clearInterval(intervalId)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [user?.id, handleSessionDrop])

  const refreshProfile = async () => {
    const token = localStorage.getItem('token')
    if (!token) return null
    await fetchProfile(token)
    return user
  }

  const login = async (email, password) => {
    try {
      const response = await fetch(apiPath('/api/auth/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('token', data.token)
        setToken(data.token)
        setUser(syncPremiumFlag(data.user))
        return { success: true }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      console.error('Error de conexión:', error)
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        return { success: false, error: 'No se pudo conectar al servidor. Verifica que el backend esta corriendo en la URL configurada.' }
      }
      return { success: false, error: `Error de conexión: ${error.message}` }
    }
  }

  const register = async (name, email, password, phone) => {
    try {
      const response = await fetch(apiPath('/api/auth/register'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password, phone })
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('token', data.token)
        setToken(data.token)
        setUser(syncPremiumFlag(data.user))
        return { success: true }
      } else {
        return { success: false, error: data.error || 'Error al registrarse' }
      }
    } catch (error) {
      console.error('Error de conexión:', error)
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        return { success: false, error: 'No se pudo conectar al servidor. Verifica que el backend esta corriendo en la URL configurada.' }
      }
      return { success: false, error: `Error de conexión: ${error.message}` }
    }
  }

  const logout = () => {
    handleSessionDrop()
  }

  const markPremium = (value = true, emailParam) => {
    const map = loadPremiumMap()
    const email = emailParam || user?.email
    if (email) {
      if (value) {
        if (map[email] !== true) {
          map[email] = true
          savePremiumMap(map)
        }
      } else if (map[email]) {
        delete map[email]
        savePremiumMap(map)
      }
    }
    setUser(prev => {
      if (!prev) return prev
      const premiumSince = value ? (prev.premiumSince || new Date().toISOString()) : null
      return { ...prev, isPremium: value, premiumSince }
    })
  }

  const getAuthToken = () => {
    return localStorage.getItem('token')
  }

  const value = {
    user,
    token,
    login,
    register,
    logout,
    markPremium,
    getAuthToken,
    loading,
    refreshProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

