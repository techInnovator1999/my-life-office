/**
 * License Type Service
 * 
 * Handles API calls for license types lookup
 */

export type LicenseType = {
  id: string
  label: string
  value: string
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
}

// Use proxy if in dev mode, otherwise use full URL
const API_BASE_URL = import.meta.env.DEV 
  ? '/api/v1'  // Use Vite proxy in development
  : (import.meta.env.VITE_API_URL || 'http://localhost:3002/api/v1')

/**
 * Get all license types
 */
export async function getLicenseTypes(search?: string): Promise<LicenseType[]> {
  const params = new URLSearchParams()
  if (search) {
    params.append('search', search)
  }
  params.append('isActive', 'true')

  const url = `${API_BASE_URL}/license-types?${params}`

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Failed to fetch license types:', errorText)
      throw new Error(`Failed to fetch license types: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('License types fetch error:', error)
    throw error
  }
}

