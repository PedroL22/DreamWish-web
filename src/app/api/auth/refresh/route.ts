import { type NextRequest, NextResponse } from 'next/server'

import { env } from '~/env'
import { api } from '~/lib/api-client'

/**
 * This route handler is used to refresh the access token.
 * It proxies the request to the backend and forwards the cookies.
 */
export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get('refresh_token')?.value

    if (!refreshToken) {
      return NextResponse.json({ message: 'Refresh token required.' }, { status: 401 })
    }

    const response = await api.request<Response>('/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `refresh_token=${refreshToken}`,
      },
      returnResponse: true,
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({ message: data.message || 'Failed to refresh token.' }, { status: response.status })
    }

    const nextResponse = NextResponse.json(data)
    const cookiesFromBackend = response.headers.getSetCookie()

    if (cookiesFromBackend && cookiesFromBackend.length > 0) {
      for (const cookie of cookiesFromBackend) {
        const [name, ...parts] = cookie.split('=')
        const value = parts.join('=').split(';')[0]

        let expires: Date | undefined
        const maxAgeMatch = cookie.match(/Max-Age=(\d+)/i)
        const expiresMatch = cookie.match(/Expires=([^;]+)/i)

        if (maxAgeMatch?.[1]) {
          expires = new Date(Date.now() + Number.parseInt(maxAgeMatch[1]) * 1000)
        } else if (expiresMatch?.[1]) {
          expires = new Date(expiresMatch[1])
        }

        if (name === 'access_token' || name === 'refresh_token') {
          nextResponse.cookies.set({
            name,
            value,
            httpOnly: true,
            secure: env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            expires,
          })
        }
      }
    }

    return nextResponse
  } catch (error) {
    console.error('❌ Error refreshing token:', error)
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 })
  }
}
