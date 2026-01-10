/**
 * Authentication Service
 * 
 * Handles API calls for authentication
 */

type LoginCredentials = {
  email: string
  password: string
}

type LoginResponse = {
  token: string
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
    role: 'ADMIN' | 'AGENT'
  }
}

/**
 * Login user with email and password
 */
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (credentials.email && credentials.password.length >= 6) {
        resolve({
          token: 'mock-jwt-token-' + Date.now(),
          user: {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: credentials.email,
            role: 'AGENT',
          },
        })
      } else {
        reject(new Error('Invalid email or password'))
      }
    }, 1000)
  })
}

/**
 * Get current user from token
 */
export async function getCurrentUser(token: string): Promise<LoginResponse['user']> {
  // TODO: Replace with actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'user@example.com',
        role: 'AGENT',
      })
    }, 500)
  })
}

/**
 * Logout user (clear token on server)
 */
export async function logout(): Promise<void> {
  // TODO: Replace with actual API call
  return Promise.resolve()
}

