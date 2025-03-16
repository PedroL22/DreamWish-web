import { type NextRequest, NextResponse } from 'next/server'

import { env } from '~/env'
import { api } from '~/lib/api-client'

/**
 * This route handler is used to log out the user.
 * It proxies the request to the backend and forwards the cookies.
 */
export async function POST(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('access_token')?.value
    const refreshToken = request.cookies.get('refresh_token')?.value

    const data = await api.post<{ message: string }>('/auth/logout', {
      headers: {
        'Content-Type': 'application/json',
        Cookie: `access_token=${accessToken}; refresh_token=${refreshToken}`,
      },
    })

    const nextResponse = NextResponse.json(data)

    nextResponse.cookies.set({
      name: 'access_token',
      value: '',
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    })

    nextResponse.cookies.set({
      name: 'refresh_token',
      value: '',
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    })

    return nextResponse
  } catch (error) {
    console.error('❌ Error logging out:', error)
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 })
  }
}
