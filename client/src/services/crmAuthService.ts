/**
 * CRM Authentication Service
 * 
 * Handles API calls for CRM agent registration
 */

export type CrmRegisterDto = {
  firstName: string
  lastName: string
  email: string
  password: string
  confirm_password: string
  primaryLicenseType: string
}

export type CrmRegisterResponse = {
  success: boolean
  message: string
  data?: {
    id: string
    email: string
  }
}

// Use proxy if in dev mode, otherwise use full URL
const API_BASE_URL = import.meta.env.DEV 
  ? '/api/v1'  // Use Vite proxy in development
  : (import.meta.env.VITE_API_URL || 'http://localhost:3002/api/v1')

/**
 * Register a new CRM agent
 */
export async function crmRegister(data: CrmRegisterDto): Promise<CrmRegisterResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/crm/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || result.error || 'Registration failed')
  }

  return result
}

