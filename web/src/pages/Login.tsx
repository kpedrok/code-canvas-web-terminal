import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LoginForm } from '@/components/auth/LoginForm'
import { useAuthStore } from '@/lib/auth-store'

export function Login() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  return (
    <div className='flex min-h-screen items-center justify-center px-4'>
      <LoginForm />
    </div>
  )
}

export default Login
