import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { apiGet, apiPost, clearToken, clearUser, getToken, getUser, setToken, setUser } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(getUser())
  const [loading, setLoading] = useState(Boolean(getToken()))

  useEffect(() => {
    if (!getToken()) {
      setLoading(false)
      return
    }

    apiGet('/me')
      .then((data) => {
        setUserState(data.user)
        setUser(data.user)
      })
      .catch(() => {
        clearToken()
        clearUser()
        setUserState(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (credentials) => {
    const data = await apiPost('/login', credentials)
    setToken(data.token)
    setUserState(data.user)
    setUser(data.user)
    return data.user
  }, [])

  const logout = useCallback(async () => {
    try {
      const token = getToken()
      if (token) await apiPost('/logout')
    } catch {
      // ignora falhas de logout
    }
    clearToken()
    clearUser()
    setUserState(null)
  }, [])

  const updateUser = useCallback((nextUser) => {
    setUserState(nextUser)
    setUser(nextUser)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}

export function useIsAdmin() {
  const { user } = useAuth()
  return Boolean(user?.role === 'admin')
}