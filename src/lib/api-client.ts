import ky, { type Options } from 'ky'

import { env } from '~/env'

const kyInstance = ky.create({
  prefixUrl: env.NEXT_PUBLIC_API_URL,
})

interface ExtendedOptions extends Options {
  returnResponse?: boolean
}

async function requestWithRefresh<T>(url: string, options?: ExtendedOptions): Promise<T | Response> {
  let response = await kyInstance(url.startsWith('/') ? url.slice(1) : url, options)

  if (response.status === 401) {
    const refreshResponse = await kyInstance('auth/refresh', { method: 'POST' })

    if (refreshResponse.ok) {
      response = await kyInstance(url, options)
    } else {
      throw new Error('Authentication expired, please log in again.')
    }
  }

  if (options?.returnResponse) {
    return response
  }

  return response.json() as Promise<T>
}

export const api = {
  request: requestWithRefresh,

  get: <T>(url: string, options?: ExtendedOptions) => requestWithRefresh<T>(url, { ...options, method: 'GET' }),

  post: <T>(url: string, options?: ExtendedOptions) => requestWithRefresh<T>(url, { ...options, method: 'POST' }),

  put: <T>(url: string, options?: ExtendedOptions) => requestWithRefresh<T>(url, { ...options, method: 'PUT' }),

  delete: <T>(url: string, options?: ExtendedOptions) => requestWithRefresh<T>(url, { ...options, method: 'DELETE' }),
}
