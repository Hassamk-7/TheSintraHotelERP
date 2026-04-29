import { createContext, useContext, useState, useEffect } from 'react'
import axios from '../utils/axios.js'

const AuthContext = createContext()

const clearStoredAuth = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('user')
}

const persistAuth = ({ token, refreshToken, user }) => {
  if (token) {
    localStorage.setItem('token', token)
  }

  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken)
  }

  if (user) {
    localStorage.setItem('user', JSON.stringify(user))
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token')
      const refreshToken = localStorage.getItem('refreshToken')
      const userData = localStorage.getItem('user')

      if (!token || !userData) {
        setLoading(false)
        return
      }

      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)

        const response = await axios.get('/auth/me')
        const currentUser = response?.data?.user
        if (currentUser) {
          localStorage.setItem('user', JSON.stringify(currentUser))
          setUser(currentUser)
        }
      } catch (error) {
        console.error('AuthContext: Failed to initialize auth', error)

        if (refreshToken) {
          try {
            const refreshResponse = await axios.post('/auth/refresh-token', { refreshToken })
            const refreshedUser = refreshResponse?.data?.user
            const newToken = refreshResponse?.data?.token
            const newRefreshToken = refreshResponse?.data?.refreshToken

            if (newToken && refreshedUser) {
              persistAuth({
                token: newToken,
                refreshToken: newRefreshToken,
                user: refreshedUser
              })
              setUser(refreshedUser)
              return
            }
          } catch (refreshError) {
            console.error('AuthContext: Refresh token recovery failed', refreshError)
          }
        }

        clearStoredAuth()
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = async (email, password) => {
    try {
      const response = await axios.post('/auth/login', { email, password })
      const { token, refreshToken, user: userData } = response.data

      persistAuth({ token, refreshToken, user: userData })
      setUser(userData)
      
      return { success: true }
    } catch (error) {
      console.error('Login failed:', error)
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed. Please check your credentials.' 
      }
    }
  }

  const logout = () => {
    axios.post('/auth/logout').catch(() => {})
    clearStoredAuth()
    setUser(null)
  }

  const register = async (userData) => {
    try {
      await axios.post('/auth/register', userData)
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      }
    }
  }

  const value = {
    user,
    login,
    logout,
    register,
    loading,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
