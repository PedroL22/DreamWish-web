import { jwtVerify } from 'jose'
import { NextResponse } from 'next/server'

import { env } from '~/env'

import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  const authRoutes = ['/login', '/register']
  const isAuthRoute = authRoutes.includes(request.nextUrl.pathname)

  if (!isAuthRoute) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
      const secret = new TextEncoder().encode(env.JWT_SECRET)
      await jwtVerify(token, secret)

      return NextResponse.next()
    } catch (error) {
      request.cookies.delete('token')

      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('token')

      return response
    }
  } else if (token) {
    try {
      const secret = new TextEncoder().encode(env.JWT_SECRET)
      await jwtVerify(token, secret)

      return NextResponse.redirect(new URL('/', request.url))
    } catch {
      return NextResponse.next()
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
}
