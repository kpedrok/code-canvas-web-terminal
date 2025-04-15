import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { NavBar } from '@/components/NavBar'
import { Code, Terminal, Lock, Layout } from 'lucide-react'
import { useAuthStore } from '@/lib/auth-store'

const Index = () => {
  const { isAuthenticated } = useAuthStore()

  return (
    <div className='flex min-h-screen flex-col'>
      <NavBar />

      <main className='flex-1'>
        {/* Hero section */}
        <section className='px-4 py-20 text-center'>
          <div className='container mx-auto max-w-4xl'>
            <h1 className='mb-6 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-4xl font-bold text-transparent md:text-6xl'>
              Modern Python Code Execution Platform
            </h1>
            <p className='mx-auto mb-10 max-w-3xl text-xl text-muted-foreground'>
              Write, run, and test your Python code directly in the browser with our powerful online IDE
            </p>
            <div className='flex flex-wrap justify-center gap-4'>
              {isAuthenticated ? (
                <Button size='lg' asChild>
                  <Link to='/dashboard'>My Projects</Link>
                </Button>
              ) : (
                <>
                  <Button size='lg' asChild>
                    <Link to='/register'>Get Started</Link>
                  </Button>
                  <Button size='lg' variant='outline' asChild>
                    <Link to='/login'>Sign In</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Features section */}
        <section className='bg-muted/30 py-20'>
          <div className='container mx-auto px-4'>
            <h2 className='mb-12 text-center text-3xl font-bold'>Key Features</h2>
            <div className='grid gap-8 md:grid-cols-3'>
              <div className='rounded-lg border border-border bg-card p-6'>
                <div className='mb-4 w-fit rounded-full bg-primary/10 p-3'>
                  <Code className='h-6 w-6 text-primary' />
                </div>
                <h3 className='mb-2 text-xl font-bold'>Code Editor</h3>
                <p className='text-muted-foreground'>
                  Powerful editor with syntax highlighting and code completion for Python
                </p>
              </div>
              <div className='rounded-lg border border-border bg-card p-6'>
                <div className='mb-4 w-fit rounded-full bg-primary/10 p-3'>
                  <Terminal className='h-6 w-6 text-primary' />
                </div>
                <h3 className='mb-2 text-xl font-bold'>Integrated Terminal</h3>
                <p className='text-muted-foreground'>
                  Execute commands and see real-time output directly in the browser
                </p>
              </div>
              <div className='rounded-lg border border-border bg-card p-6'>
                <div className='mb-4 w-fit rounded-full bg-primary/10 p-3'>
                  <Lock className='h-6 w-6 text-primary' />
                </div>
                <h3 className='mb-2 text-xl font-bold'>User Authentication</h3>
                <p className='text-muted-foreground'>Secure access to your projects and code from any device</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className='border-t border-border py-6'>
        <div className='container mx-auto px-4 text-center text-muted-foreground'>
          <p>© 2025 CodeCanvas. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Index
