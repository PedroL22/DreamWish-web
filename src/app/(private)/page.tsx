import Link from 'next/link'

import { Header } from '~/components/header'
import { Button } from '~/components/ui/button'

export default function HomePage() {
  return (
    <div className='flex min-h-screen flex-col'>
      <Header />

      <main className='flex-1'>
        <section className='w-full py-12 md:py-24 lg:py-32'>
          <div className='container px-4 md:px-6'>
            <div className='flex flex-col items-center justify-center space-y-4 text-center'>
              <div className='space-y-2'>
                <h1 className='font-bold text-3xl tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl'>
                  Secure Authentication with Next.js and Hono
                </h1>
                <p className='mx-auto max-w-[700px] text-muted-foreground md:text-xl'>
                  A complete authentication solution with JWT tokens, secure cookies, and protected routes.
                </p>
              </div>
              <div className='space-x-4'>
                <Link href='/login'>
                  <Button size='lg'>Get Started</Button>
                </Link>
                <Link href='/register'>
                  <Button variant='outline' size='lg'>
                    Sign Up
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className='w-full bg-muted py-12 md:py-24 lg:py-32'>
          <div className='container px-4 md:px-6'>
            <div className='mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12'>
              <div className='space-y-4'>
                <h2 className='font-bold text-3xl tracking-tighter md:text-4xl'>Key Features</h2>
                <ul className='grid gap-6'>
                  <li>
                    <div className='grid gap-1'>
                      <h3 className='font-bold text-xl'>Secure Authentication</h3>
                      <p className='text-muted-foreground'>
                        JWT-based authentication with access and refresh tokens for enhanced security.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className='grid gap-1'>
                      <h3 className='font-bold text-xl'>Protected Routes</h3>
                      <p className='text-muted-foreground'>
                        Middleware-based route protection to secure your application.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className='grid gap-1'>
                      <h3 className='font-bold text-xl'>Session Management</h3>
                      <p className='text-muted-foreground'>
                        Automatic token refresh and session persistence across page reloads.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className='flex items-center justify-center'>
                <div className='rounded-lg border bg-background p-8'>
                  <div className='flex flex-col space-y-4 text-center'>
                    <h3 className='font-bold text-2xl'>Ready to get started?</h3>
                    <p className='text-muted-foreground'>Create an account or log in to access the dashboard.</p>
                    <div className='space-y-2'>
                      <Link href='/register' className='w-full'>
                        <Button className='w-full'>Create Account</Button>
                      </Link>
                      <Link href='/login' className='w-full'>
                        <Button variant='outline' className='w-full'>
                          Login
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className='border-t py-6 md:py-0'>
        <div className='container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row'>
          <p className='text-center text-muted-foreground text-sm leading-loose md:text-left'>
            &copy; {new Date().getFullYear()} Next.js Authentication. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
