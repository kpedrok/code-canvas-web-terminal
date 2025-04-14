import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { ProjectCardSkeleton } from '@/components/projects/ProjectCardSkeleton'
import { NewProjectDialog } from '@/components/projects/NewProjectDialog'
import { useAuthStore } from '@/lib/auth-store'
import { useProjectsStore } from '@/lib/projects-store'
import { Button } from '@/components/ui/button'
import { Code, LogOut, Plus, Terminal } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

export function Dashboard() {
  const { isAuthenticated, user, logout } = useAuthStore()
  const { getProjects } = useProjectsStore()
  const projects = getProjects()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [newProjectDialogOpen, setNewProjectDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated, navigate])

  useEffect(() => {
    // Simulate data loading from backend
    const timer = setTimeout(() => {
      setLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  const handleLogout = () => {
    logout()
    toast({
      title: 'Logged out successfully',
      description: 'You have been logged out of your account.',
    })
    navigate('/login')
  }

  if (!user) {
    return null
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-background to-background/80'>
      <div className='container mx-auto py-12 px-4 max-w-6xl'>
        <div className='flex flex-col md:flex-row md:items-center justify-between mb-12'>
          <div className='mb-6 md:mb-0'>
            <div className='flex items-center gap-3 mb-2'>
              <Code className='h-8 w-8 text-primary' />
              <h1 className='text-4xl font-bold text-gradient'>My Projects</h1>
            </div>
            <p className='text-muted-foreground text-lg'>
              Manage and access your coding projects
            </p>
          </div>
          <div className='flex items-center gap-4'>
            <NewProjectDialog
              open={newProjectDialogOpen}
              onOpenChange={setNewProjectDialogOpen}
            />
            <Button variant='outline' onClick={handleLogout}>
              <LogOut className='h-4 w-4 mr-2 group-hover:text-primary transition-colors' />
              <span>Logout</span>
            </Button>
          </div>
        </div>

        {loading ? (
          <div className='grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
            {[...Array(3)].map((_, index) => (
              <ProjectCardSkeleton key={`skeleton-${index}`} />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className='text-center py-16 border border-dashed rounded-xl border-border glass flex flex-col items-center justify-center'>
            <h3 className='text-2xl font-medium mb-3 text-gradient'>
              No projects yet
            </h3>
            <p className='text-muted-foreground mb-6 max-w-md'>
              Create your first project to get started with CodeCanvas
            </p>
            <Button
              className='hover-scale btn-pulse'
              size='lg'
              onClick={() => setNewProjectDialogOpen(true)}
            >
              <Plus className='h-5 w-5 mr-2' />
              Create Project
            </Button>
          </div>
        ) : (
          <div className='grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
