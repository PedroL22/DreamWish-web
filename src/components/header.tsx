import { cookies } from 'next/headers'
import Link from 'next/link'

import { LogoutButton } from '~/components/logout-button'
import { Button } from '~/components/ui/button'

import { verifyToken } from '~/lib/auth'

export async function Header() {
  const cookieStore = cookies()
  const accessToken = (await cookieStore).get('access_token')?.value

  let isAuthenticated = false

  if (accessToken) {
    try {
      isAuthenticated = await verifyToken(accessToken)
    } catch (error) {
      console.error('❌ Token verification failed:', error)
    }
  }

  return (
    <header className='border-b'>
      <div className='container flex h-16 items-center justify-between'>
        <Link href='/' className='font-bold text-xl'>
          Next Auth
        </Link>

        <nav className='flex items-center gap-4'>
          {isAuthenticated ? (
            <>
              <Link href='/dashboard'>
                <Button variant='ghost'>Dashboard</Button>
              </Link>
              <Link href='/profile'>
                <Button variant='ghost'>Profile</Button>
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href='/login'>
                <Button variant='ghost'>Login</Button>
              </Link>
              <Link href='/register'>
                <Button variant='secondary'>Sign Up</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
