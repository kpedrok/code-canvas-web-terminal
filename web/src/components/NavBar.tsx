import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/lib/auth-store'
import { LogOut, Code } from 'lucide-react'

export function NavBar() {
  const { user, isAuthenticated, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
  }

  return (
    <div className='border-b border-border bg-background'>
      <div className='container mx-auto flex h-16 items-center px-4'>
        <Link to='/' className='flex items-center'>
          <Code className='mr-2 h-6 w-6 text-primary' />
          <span className='bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-xl font-bold text-transparent'>
            CodeCanvas
          </span>
        </Link>

        <div className='ml-auto flex items-center space-x-4'>
          {isAuthenticated ? (
            <>
              <Link to='/dashboard'>
                <Button variant='ghost' size='sm'>
                  My Projects
                </Button>
              </Link>
              <span className='text-sm text-muted-foreground'>{user?.name}</span>
              <Button variant='ghost' size='sm' onClick={handleLogout}>
                <LogOut className='mr-1 h-4 w-4' />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to='/login'>
                <Button variant='ghost' size='sm'>
                  Login
                </Button>
              </Link>
              <Link to='/register'>
                <Button variant='default' size='sm'>
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
