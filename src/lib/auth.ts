import { jwtVerify } from 'jose'

import { env } from '~/env'
import { api } from '~/lib/api-client'

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
 * Login function that calls the backend using ky wrapper.
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    const result = await api.post<AuthResponse>('/auth/login', {
      json: credentials,
      credentials: 'include',
    })

    const data = result instanceof Response ? await result.json() : result
    return data
  } catch (error: any) {
    throw new Error(error.message || 'Login failed.')
  }
}

/**
 * Logout function that calls the backend using ky wrapper.
 */
export async function logout(): Promise<{ message: string }> {
  try {
    const result = await api.post<{ message: string }>('/auth/logout', {
      credentials: 'include',
    })
    return result instanceof Response ? await result.json() : result
  } catch (error: any) {
    throw new Error(error.message || 'Logout failed.')
  }
}

/**
 * Logout from all devices using ky wrapper.
 */
export async function logoutAll(): Promise<{ message: string }> {
  try {
    const result = await api.post<{ message: string }>('/auth/logout-all', {
      credentials: 'include',
    })
    return result instanceof Response ? await result.json() : result
  } catch (error: any) {
    throw new Error(error.message || 'Logout from all devices failed.')
  }
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
 * Get current user using ky wrapper.
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const data = await api.get<{ user: User }>('/auth/me', {
      credentials: 'include',
    })

    if (data instanceof Response) {
      const jsonData = await data.json()
      return jsonData.user
    }
    return data.user
  } catch (error) {
    console.error('❌ Failed to get current user:', error)
    return null
  }
}
