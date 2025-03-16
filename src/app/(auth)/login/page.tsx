import type { Metadata } from 'next'

import { LoginForm } from './components/login-form'

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login to your account',
}

export default function LoginPage() {
  return (
    <div className='container flex h-screen w-screen flex-col items-center justify-center'>
      <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
        <div className='flex flex-col space-y-2 text-center'>
          <h1 className='font-semibold text-2xl tracking-tight'>Welcome back</h1>
          <p className='text-muted-foreground text-sm'>Enter your credentials to continue</p>
        </div>

        <LoginForm />
      </div>
    </div>
  )
}
