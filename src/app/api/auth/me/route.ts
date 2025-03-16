import { type NextRequest, NextResponse } from 'next/server'

import { env } from '~/env'

const API_URL = env.NEXT_PUBLIC_API_URL

/**
 * This route handler is used to get the current user
 * It proxies the request to the backend and forwards the cookies.
 */
export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('access_token')?.value

    if (!accessToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `access_token=${accessToken}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({ message: data.message || 'Failed to get user data.' }, { status: response.status })
    }

    const nextResponse = NextResponse.json(data)

    const cookies = response.headers.getSetCookie()
    if (cookies.length > 0) {
      for (const cookie of cookies) {
        const [name, ...parts] = cookie.split('=')
        const value = parts.join('=').split(';')[0]

        if (name === 'access_token' || name === 'refresh_token') {
          const maxAgeMatch = cookie.match(/Max-Age=(\d+)/i)
          const expiresMatch = cookie.match(/Expires=([^;]+)/i)

          let expires: Date | undefined
          if (maxAgeMatch?.[1]) {
            expires = new Date(Date.now() + Number.parseInt(maxAgeMatch[1]) * 1000)
          } else if (expiresMatch?.[1]) {
            expires = new Date(expiresMatch[1])
          }

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
    console.error('❌ Error getting user data:', error)
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 })
  }
}
