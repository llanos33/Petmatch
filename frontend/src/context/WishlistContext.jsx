import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from './AuthContext'

const STORAGE_KEY = 'petmatch_wishlist_map'
const GUEST_KEY = 'guest'

const normalizeIds = (input) => {
  if (!Array.isArray(input)) return []
  return Array.from(new Set(
    input
      .map(value => Number(value))
      .filter(value => Number.isFinite(value))
  ))
}

const sanitizeKey = (value) => {
  if (!value || typeof value !== 'string') return GUEST_KEY
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '') || GUEST_KEY
}

const readWishlistMap = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed
    }
  } catch (error) {
    console.error('No se pudo leer el mapa de listas de deseos:', error)
  }
  return {}
}

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const { user } = useAuth()
  const [wishlistIds, setWishlistIds] = useState([])
  const [storageError, setStorageError] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  const isAuthenticated = Boolean(user?.email)

  const profileKey = useMemo(() => {
    if (isAuthenticated && user?.email) {
      return `user_${sanitizeKey(user.email)}`
    }
    return null
  }, [isAuthenticated, user?.email])

  useEffect(() => {
    let isMounted = true
    setHydrated(false)

    if (!isAuthenticated || !profileKey) {
      if (isMounted) {
        setWishlistIds([])
        setStorageError(false)
        setHydrated(true)
      }
      return () => {
        isMounted = false
      }
    }

    try {
      const map = readWishlistMap()
      const storedList = normalizeIds(map[profileKey])
      if (isMounted) {
        setWishlistIds(storedList)
        setStorageError(false)
      }
    } catch (error) {
      console.error('No se pudo leer la lista de deseos:', error)
      if (isMounted) {
        setWishlistIds([])
        setStorageError(true)
      }
    } finally {
      if (isMounted) {
        setHydrated(true)
      }
    }
    return () => {
      isMounted = false
    }
  }, [profileKey, isAuthenticated])

  useEffect(() => {
    if (!hydrated || !isAuthenticated || !profileKey) return
    try {
      const map = readWishlistMap()
      map[profileKey] = wishlistIds
      localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
      setStorageError(false)
    } catch (error) {
      console.error('No se pudo guardar la lista de deseos:', error)
      setStorageError(true)
    }
  }, [wishlistIds, profileKey, hydrated])

  const addToWishlist = useCallback((id) => {
    if (!isAuthenticated) return false
    const numericId = Number(id)
    if (!Number.isFinite(numericId)) return
    setWishlistIds(prev => (prev.includes(numericId) ? prev : [...prev, numericId]))
    return true
  }, [isAuthenticated])

  const removeFromWishlist = useCallback((id) => {
    if (!isAuthenticated) return false
    const numericId = Number(id)
    if (!Number.isFinite(numericId)) return
    setWishlistIds(prev => prev.filter(itemId => itemId !== numericId))
    return true
  }, [isAuthenticated])

  const toggleWishlist = useCallback((id) => {
    if (!isAuthenticated) return false
    const numericId = Number(id)
    if (!Number.isFinite(numericId)) return
    setWishlistIds(prev => (
      prev.includes(numericId)
        ? prev.filter(itemId => itemId !== numericId)
        : [...prev, numericId]
    ))
    return true
  }, [isAuthenticated])

  const clearWishlist = useCallback(() => {
    if (!isAuthenticated) return false
    setWishlistIds([])
    return true
  }, [isAuthenticated])

  const value = useMemo(() => ({
    wishlistIds,
    storageError,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
    isAuthenticated,
    isInWishlist: (id) => wishlistIds.includes(Number(id))
  }), [wishlistIds, storageError, addToWishlist, removeFromWishlist, toggleWishlist, clearWishlist, isAuthenticated])

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist debe usarse dentro de un WishlistProvider')
  }
  return context
}
