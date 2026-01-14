/**
 * Product Sold Service
 * 
 * Handles API calls for product sold lookup
 */

export type ProductSold = {
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
 * Get all products sold
 */
export async function getProductsSold(search?: string): Promise<ProductSold[]> {
  const params = new URLSearchParams()
  if (search) {
    params.append('search', search)
  }
  params.append('isActive', 'true')

  const url = `${API_BASE_URL}/product-sold?${params}`

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to fetch products sold: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    throw error
  }
}

