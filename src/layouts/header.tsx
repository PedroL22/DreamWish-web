import Link from 'next/link'
import type { ReactNode } from 'react'

import { CaretLeft } from '@phosphor-icons/react/dist/ssr'

type HeaderProps = {
  title: string
  backUrl?: string
  children?: ReactNode
}

export const Header = ({ title, backUrl, children }: HeaderProps) => {
  return (
    <div className='flex min-h-screen flex-col'>
      <header className='-mb-5 flex h-24 items-center space-x-2 bg-primary px-6 pb-5 text-white'>
        <Link href={backUrl || '..'} prefetch>
          <CaretLeft size={20} weight='bold' />
        </Link>

        <span className='mb-0.5 font-semibold text-xl'>{title}</span>
      </header>

      <div className='flex-1 rounded-t-3xl bg-white p-6'>{children}</div>
    </div>
  )
}
