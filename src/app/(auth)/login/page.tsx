import type { Metadata } from 'next'

import { Header } from '~/layouts/header'
import { LoginForm } from './components/login-form'

export const metadata: Metadata = {
  title: 'Sign In - DreamWish',
  description: 'Hello there, sign in to continue',
}

export default function LoginPage() {
  return (
    <>
      <Header title='Sign in'>
        <LoginForm />
      </Header>
    </>
  )
}
