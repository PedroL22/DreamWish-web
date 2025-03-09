import { Analytics } from '@vercel/analytics/react'
import { Geist, Geist_Mono } from 'next/font/google'

import './globals.css'

import type { Metadata } from 'next'
import type { ReactNode } from 'react'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'DreamWish',
  description:
    'Keep track of your wishes effortlessly. Organize, prioritize, and make your dreams a reality with just a few taps.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Analytics />

        {children}
      </body>
    </html>
  )
}
