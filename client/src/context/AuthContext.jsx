import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { authApi } from '../axiosCalls/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    authApi.me()
      .then(({ data }) => setCustomer(data.authenticatedCustomer))
      .catch(() => setCustomer(null))
      .finally(() => setLoading(false))
  }, [])

  const login = async (credentials) => {
    await authApi.login(credentials)
    const { data } = await authApi.me()
    setCustomer(data.authenticatedCustomer)
  }

  const logout = useCallback(async () => {
    await authApi.logout()
    setCustomer(null)
  }, [])

  return <AuthContext.Provider value={{ customer, setCustomer, loading, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
