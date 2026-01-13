/**
 * Authentication Service
 * 
 * Handles API calls for authentication
 */

type LoginCredentials = {
  email: string
  password: string
}

export type UserStatus = {
  id: string
  name?: string
}

export type UserRole = {
  id: string
  name?: string
}

export type LoginResponse = {
  token: string
  refreshToken: string
  tokenExpires: number
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
    role: UserRole
    status: UserStatus
    isApproved: boolean
    verificationCode?: string | null
    verificationExpires?: Date | null
  }
}

// Use proxy if in dev mode, otherwise use full URL
const API_BASE_URL = import.meta.env.DEV 
  ? '/api/v1'  // Use Vite proxy in development
  : (import.meta.env.VITE_API_URL || 'http://localhost:3002/api/v1')

/**
 * Login user with email and password (CRM Agent)
 */
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/crm/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  })

  const data = await response.json()

  if (!response.ok) {
    // Check if it's a verification error
    if (response.status === 403 && data.data?.verificationRequired) {
      throw new Error('EMAIL_NOT_VERIFIED')
    }
    throw new Error(data.message || 'Invalid email or password')
  }

  return data
}

/**
 * Get current user from token
 */
export async function getCurrentUser(token: string): Promise<LoginResponse['user']> {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to get current user')
  }

  const data = await response.json()
  // Transform the response to match LoginResponse['user'] structure
  return {
    id: data.id,
    firstName: data.firstName || '',
    lastName: data.lastName || '',
    email: data.email || '',
    role: data.role || { id: '', name: '' },
    status: data.status || { id: '', name: '' },
    isApproved: data.isApproved || false,
    verificationCode: data.verificationCode,
    verificationExpires: data.verificationExpires,
  }
}

/**
 * Confirm email with verification code
 */
export async function confirmEmail(email: string, code: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/auth/confirm`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, code }),
  })

  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.message || 'Invalid verification code')
  }
}

/**
 * Logout user (clear token on server)
 */
export async function logout(): Promise<void> {
  // TODO: Replace with actual API call
  return Promise.resolve()
}

