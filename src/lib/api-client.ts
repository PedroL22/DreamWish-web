import ky, { type Options } from 'ky'

/**
 * Wrapper around ky to automatically refresh tokens if they are expired.
 */
async function requestWithRefresh<T>(url: string, options?: Options): Promise<T> {
  let response = await ky(url, options)

  if (response.status === 401) {
    const refreshResponse = await ky.post('/api/auth/refresh')

    if (refreshResponse.ok) {
      response = await ky(url, options)
    } else {
      throw new Error('Authentication expired, please log in again.')
    }
  }

  return response.json() as Promise<T>
}

/**
 * API object that contains all the methods to interact with the backend.
 */
export const api = {
  request: requestWithRefresh,

  get: <T>(url: string, options?: Options) => requestWithRefresh<T>(url, { ...options, method: 'GET' }),

  post: <T>(url: string, options?: Options) => requestWithRefresh<T>(url, { ...options, method: 'POST' }),

  put: <T>(url: string, options?: Options) => requestWithRefresh<T>(url, { ...options, method: 'PUT' }),

  delete: <T>(url: string, options?: Options) => requestWithRefresh<T>(url, { ...options, method: 'DELETE' }),
}
