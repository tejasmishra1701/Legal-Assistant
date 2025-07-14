import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [token, setToken] = useState(sessionStorage.getItem('token'))

  const login = (newToken) => {
    setToken(newToken)
    sessionStorage.setItem('token', newToken)
  }

  const logout = () => {
    setToken(null)
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('userEmail')
    sessionStorage.removeItem('sessionId')
  }

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)