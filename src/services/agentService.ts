const API_BASE_URL = '/api/v1'

type Agent = {
  id: string
  firstName: string
  lastName: string
  email: string
  mobile?: string | null
  primaryLicenseType?: string | null
  registrationType?: string | null
  isApproved: boolean
  status?: {
    id: string
    name: string
  }
  createdAt: string
}

type AgentsResponse = {
  data: Agent[]
  hasNextPage: boolean
  current: number
  limit: number
  total: number
}

/**
 * Get all CRM agents
 */
export async function getCrmAgents(page: number = 1, limit: number = 10): Promise<AgentsResponse> {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token')
  
  if (!token) {
    throw new Error('No authentication token found')
  }

  const response = await fetch(`${API_BASE_URL}/users/crm-agents?page=${page}&limit=${limit}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.message || 'Failed to fetch agents')
  }

  return await response.json()
}

/**
 * Get pending CRM agents (not approved)
 */
export async function getPendingCrmAgents(page: number = 1, limit: number = 10): Promise<AgentsResponse> {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token')
  
  if (!token) {
    throw new Error('No authentication token found')
  }

  const response = await fetch(`${API_BASE_URL}/users/crm-agents/pending?page=${page}&limit=${limit}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.message || 'Failed to fetch pending agents')
  }

  return await response.json()
}

/**
 * Approve a CRM agent
 */
export async function approveAgent(agentId: string): Promise<void> {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token')
  
  if (!token) {
    throw new Error('No authentication token found')
  }

  const response = await fetch(`${API_BASE_URL}/users/${agentId}/approve`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.message || 'Failed to approve agent')
  }
}

