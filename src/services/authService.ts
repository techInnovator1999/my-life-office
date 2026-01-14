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
    mobile?: string | null
    registrationType?: string | null
    primaryLicenseType?: string | null
    residentState?: string | null
    licenseNumber?: string | null
    yearsLicensed?: number | null
    priorProductsSold?: string | null
    currentCompany?: string | null
    createdAt?: string | Date | null
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
 * Login user with email and password
 * Tries CRM login first (for agents), falls back to admin login if needed
 */
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  // Try CRM login first (for agents)
  let response = await fetch(`${API_BASE_URL}/auth/crm/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  })

  let data = await response.json()

  // If CRM login fails with "email not recognized", try admin login
  if (!response.ok && data.message?.includes('email is not recognized')) {
    response = await fetch(`${API_BASE_URL}/auth/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })

    data = await response.json()
  }

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
    mobile: data.mobile || null,
    registrationType: data.registrationType || null,
    primaryLicenseType: data.primaryLicenseType || null,
    residentState: data.residentState || null,
    licenseNumber: data.licenseNumber || null,
    yearsLicensed: data.yearsLicensed || null,
    priorProductsSold: data.priorProductsSold || null,
    currentCompany: data.currentCompany || null,
    createdAt: data.createdAt || null,
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
 * Refresh access token using refresh token
 */
export async function refreshToken(refreshToken: string): Promise<Omit<LoginResponse, 'user'>> {
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${refreshToken}`,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Failed to refresh token')
  }

  return {
    token: data.token,
    refreshToken: data.refreshToken,
    tokenExpires: data.tokenExpires,
  }
}

/**
 * Update user profile
 */
export async function updateProfile(token: string, userId: string, data: {
  firstName?: string
  lastName?: string
  mobile?: string | null
  primaryLicenseType?: string | null
  residentState?: string | null
  licenseNumber?: string | null
  yearsLicensed?: number | null
  priorProductsSold?: string | null
  currentCompany?: string | null
}): Promise<LoginResponse['user']> {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/update-profile`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to update profile')
  }

  const updatedData = await response.json()
  return {
    id: updatedData.id,
    firstName: updatedData.firstName || '',
    lastName: updatedData.lastName || '',
    email: updatedData.email || '',
    mobile: updatedData.mobile || null,
    registrationType: updatedData.registrationType || null,
    primaryLicenseType: updatedData.primaryLicenseType || null,
    residentState: updatedData.residentState || null,
    licenseNumber: updatedData.licenseNumber || null,
    yearsLicensed: updatedData.yearsLicensed || null,
    priorProductsSold: updatedData.priorProductsSold || null,
    currentCompany: updatedData.currentCompany || null,
    createdAt: updatedData.createdAt || null,
    role: updatedData.role || { id: '', name: '' },
    status: updatedData.status || { id: '', name: '' },
    isApproved: updatedData.isApproved || false,
    verificationCode: updatedData.verificationCode,
    verificationExpires: updatedData.verificationExpires,
  }
}

/**
 * Logout user (clear token on server)
 */
export async function logout(): Promise<void> {
  // TODO: Replace with actual API call
  return Promise.resolve()
}

/**
 * Request password reset - sends verification code to email (CRM Agent)
 */
export async function forgotPassword(email: string, isResend?: boolean): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/auth/crm/forgot/password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, isResend: isResend || false }),
  })

  if (!response.ok) {
    // Try to parse error response, but handle empty responses
    let errorMessage = 'Failed to send password reset email'
    try {
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json()
        errorMessage = data.message || errorMessage
      } else {
        const text = await response.text()
        errorMessage = text || errorMessage
      }
    } catch {
      // If parsing fails, use default error message
    }
    throw new Error(errorMessage)
  }

  // Response is successful and empty (void), no need to parse
}

/**
 * Verify password reset code (without resetting password)
 */
export async function verifyPasswordResetCode(email: string, code: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/auth/verify/password-reset-code`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, code }),
  })

  if (!response.ok) {
    // Try to parse error response, but handle empty responses
    let errorMessage = 'Invalid verification code'
    try {
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json()
        errorMessage = data.message || errorMessage
      } else {
        const text = await response.text()
        errorMessage = text || errorMessage
      }
    } catch {
      // If parsing fails, use default error message
    }
    throw new Error(errorMessage)
  }

  // Response is successful and empty (void), no need to parse
}

/**
 * Reset password with verification code
 */
export async function resetPassword(email: string, password: string, code: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/auth/reset/password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, code }),
  })

  if (!response.ok) {
    // Try to parse error response, but handle empty responses
    let errorMessage = 'Failed to reset password'
    try {
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json()
        errorMessage = data.message || errorMessage
      } else {
        const text = await response.text()
        errorMessage = text || errorMessage
      }
    } catch {
      // If parsing fails, use default error message
    }
    throw new Error(errorMessage)
  }

  // Response is successful and empty (void), no need to parse
}

