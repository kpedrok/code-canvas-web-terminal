import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
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
  const { fetchProjects, loading, projects: storeProjects } = useProjectsStore()
  const navigate = useNavigate()
  const location = useLocation()
  const { toast } = useToast()
  const [newProjectDialogOpen, setNewProjectDialogOpen] = useState(false)
  const [projects, setProjects] = useState([])

  // Function to load projects
  const loadProjects = async () => {
    if (!user) return;
    
    try {
      const fetchedProjects = await fetchProjects();
      setProjects(fetchedProjects);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      toast({
        title: 'Error loading projects',
        description: 'Could not load your projects. Please try again.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Load projects when the component mounts or when location changes
    // (which happens when returning from project creation)
    loadProjects();
  }, [isAuthenticated, location.key]);

  // Also listen for changes in the projects store
  useEffect(() => {
    if (storeProjects && storeProjects.length > 0) {
      setProjects(storeProjects);
    }
  }, [storeProjects]);

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
      <div className='container mx-auto max-w-6xl px-4 py-12'>
        <div className='mb-12 flex flex-col justify-between md:flex-row md:items-center'>
          <div className='mb-6 md:mb-0'>
            <div className='mb-2 flex items-center gap-3'>
              <Code className='h-8 w-8 text-primary' />
              <h1 className='text-gradient text-4xl font-bold'>My Projects</h1>
            </div>
            <p className='text-lg text-muted-foreground'>Manage and access your coding projects</p>
          </div>
          <div className='flex items-center gap-4'>
            <NewProjectDialog open={newProjectDialogOpen} onOpenChange={setNewProjectDialogOpen} />
            <Button variant='outline' onClick={handleLogout}>
              <LogOut className='mr-2 h-4 w-4 transition-colors group-hover:text-primary' />
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
          <div className='glass flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center'>
            <h3 className='text-gradient mb-3 text-2xl font-medium'>No projects yet</h3>
            <p className='mb-6 max-w-md text-muted-foreground'>
              Create your first project to get started with CodeCanvas
            </p>
            <Button className='hover-scale btn-pulse' size='lg' onClick={() => setNewProjectDialogOpen(true)}>
              <Plus className='mr-2 h-5 w-5' />
              Create Project
            </Button>
          </div>
        ) : (
          <div className='grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
            {projects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
