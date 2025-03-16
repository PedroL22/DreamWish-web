import { jwtVerify } from 'jose'

import { env } from '~/env'

const API_URL = env.NEXT_PUBLIC_API_URL

interface LoginCredentials {
  credential: string
  password: string
}

export interface User {
  id: string
  email: string
  username: string
  role: string
}

interface AuthResponse {
  message: string
  user?: User
}

/**
 * Login function that calls the backend.
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
    credentials: 'include',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Login failed.')
  }

  return response.json()
}

/**
 * Logout function that calls the backend.
 */
export async function logout(): Promise<{ message: string }> {
  const response = await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Logout failed.')
  }

  return response.json()
}

/**
 * Logout from all devices.
 */
export async function logoutAll(): Promise<{ message: string }> {
  const response = await fetch(`${API_URL}/auth/logout-all`, {
    method: 'POST',
    credentials: 'include',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Logout from all devices failed.')
  }

  return response.json()
}

/**
 * Verify JWT token.
 */
export async function verifyToken(token: string): Promise<boolean> {
  try {
    const JWT_SECRET = env.JWT_SECRET

    const secretKey = new TextEncoder().encode(JWT_SECRET)

    const { payload } = await jwtVerify(token, secretKey)

    const currentTime = Math.floor(Date.now() / 1000)
    if (payload.exp && payload.exp < currentTime) {
      return false
    }

    if (payload.type !== 'access') {
      return false
    }

    return true
  } catch (error) {
    console.error('❌ Token verification failed:', error)
    return false
  }
}

/**
 * Get current user from cookies (client-side).
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await fetch(`${API_URL}/me`, {
      credentials: 'include',
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.user
  } catch (error) {
    console.error('❌ Failed to get current user:', error)
    return null
  }
}
