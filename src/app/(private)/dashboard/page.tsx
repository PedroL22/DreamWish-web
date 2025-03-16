import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { api } from '~/lib/api-client'
import { verifyToken } from '~/lib/auth'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Your account dashboard',
}

async function getUserData() {
  const cookieStore = cookies()
  const accessToken = (await cookieStore).get('access_token')?.value

  if (!accessToken) {
    return null
  }

  try {
    const isValid = await verifyToken(accessToken)
    if (!isValid) {
      return null
    }

    const result = await api.get<{ user: { username: string; email: string; role: string } }>('/auth/me', {
      headers: {
        Cookie: `access_token=${accessToken}`,
      },
      next: { revalidate: 60 },
    })

    const data = result instanceof Response ? await result.json() : result

    return data
  } catch (error) {
    console.error('❌ Error fetching user data:', error)
    return null
  }
}

export default async function DashboardPage() {
  const userData = await getUserData()

  if (!userData) {
    redirect('/login')
  }

  return (
    <div className='container py-10'>
      <h1 className='mb-6 font-bold text-3xl'>Dashboard</h1>

      <div className='grid gap-6'>
        <div className='rounded-lg border bg-card p-6'>
          <h2 className='mb-4 font-semibold text-xl'>Welcome, {userData.user.username}!</h2>
          <p className='text-muted-foreground'>You are now logged in to your account.</p>
        </div>

        <div className='rounded-lg border bg-card p-6'>
          <h2 className='mb-4 font-semibold text-xl'>Account Information</h2>
          <div className='space-y-2'>
            <p>
              <strong>Email:</strong> {userData.user.email}
            </p>
            <p>
              <strong>Username:</strong> {userData.user.username}
            </p>
            <p>
              <strong>Role:</strong> {userData.user.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
