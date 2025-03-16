'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Loader2, LogOut } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '~/components/ui/dropdown-menu'

import { logout, logoutAll } from '~/lib/auth'

interface LogoutButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
}

export function LogoutButton({ variant = 'default' }: LogoutButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await logout()
      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('❌ Logout failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogoutAll = async () => {
    setIsLoading(true)
    try {
      await logoutAll()
      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('❌ Logout from all devices failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Logging out...
            </>
          ) : (
            <>
              <LogOut className='mr-2 h-4 w-4' />
              Logout
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={handleLogout}>Logout from this device</DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogoutAll}>Logout from all devices</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
