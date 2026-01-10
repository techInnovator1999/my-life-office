import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { login as loginService, getCurrentUser, logout as logoutService } from '@/services/authService'

type User = {
  id: string
  firstName: string
  lastName: string
  email: string
  role: 'ADMIN' | 'AGENT'
}

type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored token on mount
    const token = localStorage.getItem('token')
    if (token) {
      // Verify token and get user
      getCurrentUser(token)
        .then((userData) => {
          setUser(userData)
        })
        .catch(() => {
          // Invalid token, clear it
          localStorage.removeItem('token')
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    const response = await loginService({ email, password })
    
    // Store token
    localStorage.setItem('token', response.token)
    
    // Set user
    setUser(response.user)
  }

  const logout = async () => {
    try {
      await logoutService()
    } catch (error) {
      // Ignore logout errors
    } finally {
      localStorage.removeItem('token')
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

