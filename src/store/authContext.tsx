import { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react'
import { login as loginService, getCurrentUser, logout as logoutService, refreshToken as refreshTokenService } from '@/services/authService'

type User = {
  id: string
  firstName: string
  lastName: string
  email: string
  mobile?: string | null
  registrationType?: string | null
  primaryLicenseType?: string | null
  residentState?: string | null
  licenseNumber?: string | null
  yearsLicensed?: number | null
  priorProductsSold?: string | null
  currentCompany?: string | null
  createdAt?: string | Date | null
  role: {
    id: string
    name?: string
  }
  status: {
    id: string
    name?: string
  }
  isApproved: boolean
  verificationCode?: string | null
  verificationExpires?: Date | null
}

type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

// Helper function to get storage (checks which one has the token)
const getStorage = () => {
  if (localStorage.getItem('token')) return localStorage
  if (sessionStorage.getItem('token')) return sessionStorage
  return localStorage // default
}

// Check if token is expired or about to expire (within 1 hour)
const isTokenExpiringSoon = (tokenExpires: number): boolean => {
  const now = Date.now()
  const oneHour = 60 * 60 * 1000 // 1 hour in milliseconds
  return tokenExpires - now < oneHour
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const refreshIntervalRef = useRef<number | null>(null)

  // Refresh token function
  const refreshAccessToken = useCallback(async () => {
    const storage = getStorage()
    const refreshToken = storage.getItem('refreshToken')
    
    if (!refreshToken) {
      return false
    }

    try {
      const response = await refreshTokenService(refreshToken)
      
      // Store new tokens
      storage.setItem('token', response.token)
      if (response.refreshToken) {
        storage.setItem('refreshToken', response.refreshToken)
      }
      storage.setItem('tokenExpires', response.tokenExpires.toString())
      
      return true
    } catch (error) {
      // Refresh failed, clear tokens and logout
      console.error('Token refresh failed:', error)
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('tokenExpires')
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('refreshToken')
      sessionStorage.removeItem('tokenExpires')
      setUser(null)
      return false
    }
  }, [])

  // Set up automatic token refresh interval
  useEffect(() => {
    const setupTokenRefresh = () => {
      // Clear existing interval
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
      }

      const storage = getStorage()
      const tokenExpires = storage.getItem('tokenExpires')
      
      if (!tokenExpires) return

      const expiresAt = parseInt(tokenExpires, 10)
      
      // Check if token needs refresh
      if (isTokenExpiringSoon(expiresAt)) {
        refreshAccessToken()
      }

      // Set up interval to check every 30 minutes
      refreshIntervalRef.current = setInterval(() => {
        const currentStorage = getStorage()
        const currentTokenExpires = currentStorage.getItem('tokenExpires')
        
        if (currentTokenExpires) {
          const expiresAt = parseInt(currentTokenExpires, 10)
          if (isTokenExpiringSoon(expiresAt)) {
            refreshAccessToken()
          }
        }
      }, 30 * 60 * 1000) // Check every 30 minutes
    }

    setupTokenRefresh()

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
      }
    }
  }, [user, refreshAccessToken])

  useEffect(() => {
    // Check for stored token on mount (check both localStorage and sessionStorage)
    const storage = getStorage()
    const token = storage.getItem('token')
    const tokenExpires = storage.getItem('tokenExpires')
    
    if (token) {
      // Check if token is expired
      if (tokenExpires) {
        const expiresAt = parseInt(tokenExpires, 10)
        if (Date.now() >= expiresAt) {
          // Token expired, try to refresh
          refreshAccessToken().then((refreshed) => {
            if (refreshed) {
              // Token refreshed, get user
              const newStorage = getStorage()
              const newToken = newStorage.getItem('token')
              if (newToken) {
                getCurrentUser(newToken)
                  .then((userData) => {
                    setUser(userData)
                  })
                  .catch(() => {
                    setUser(null)
                  })
                  .finally(() => {
                    setIsLoading(false)
                  })
              } else {
                setIsLoading(false)
              }
            } else {
              // Refresh failed
              setIsLoading(false)
            }
          })
          return
        }
      }

      // Token is valid, verify and get user
      getCurrentUser(token)
        .then((userData) => {
          setUser(userData)
        })
        .catch(async () => {
          // Token might be invalid, try to refresh
          const refreshed = await refreshAccessToken()
          if (refreshed) {
            const newStorage = getStorage()
            const newToken = newStorage.getItem('token')
            if (newToken) {
              try {
                const userData = await getCurrentUser(newToken)
                setUser(userData)
              } catch {
                // Still failed, clear everything
                localStorage.removeItem('token')
                localStorage.removeItem('refreshToken')
                localStorage.removeItem('tokenExpires')
                sessionStorage.removeItem('token')
                sessionStorage.removeItem('refreshToken')
                sessionStorage.removeItem('tokenExpires')
                setUser(null)
              }
            }
          } else {
            // Invalid token, clear it from both storages
            localStorage.removeItem('token')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('tokenExpires')
            sessionStorage.removeItem('token')
            sessionStorage.removeItem('refreshToken')
            sessionStorage.removeItem('tokenExpires')
            setUser(null)
          }
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }
  }, [])

  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    const response = await loginService({ email, password })
    
    // Choose storage based on rememberMe preference
    const storage = rememberMe ? localStorage : sessionStorage
    
    // Clear tokens from both storages first to avoid conflicts
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('tokenExpires')
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('refreshToken')
    sessionStorage.removeItem('tokenExpires')
    
    // Store tokens in the appropriate storage
    storage.setItem('token', response.token)
    if (response.refreshToken) {
      storage.setItem('refreshToken', response.refreshToken)
    }
    if (response.tokenExpires) {
      storage.setItem('tokenExpires', response.tokenExpires.toString())
    }
    
    // Set user
    setUser(response.user)
  }

  const logout = async () => {
    try {
      await logoutService()
    } catch (error) {
      // Ignore logout errors
    } finally {
      // Clear refresh interval
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
        refreshIntervalRef.current = null
      }
      
      // Clear tokens from both storages
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('tokenExpires')
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('refreshToken')
      sessionStorage.removeItem('tokenExpires')
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

