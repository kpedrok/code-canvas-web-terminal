import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { useAuthStore } from '@/lib/auth-store'
import { useProjectsStore } from '@/lib/projects-store'
import { useFileStore } from '@/lib/file-store'
import { useTerminalStore } from '@/lib/terminal-store'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Play, Clock, Terminal } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Slider } from '@/components/ui/slider'
import { ProjectDetailSkeleton } from '@/components/projects/ProjectDetailSkeleton'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Project } from '@/lib/projects-store'

export function ProjectDetail() {
  const { projectId } = useParams<{ projectId: string }>()
  const { isAuthenticated } = useAuthStore()
  const { getProject, updateProject } = useProjectsStore()
  const { files, activeFileId } = useFileStore()
  const { executeCommand } = useTerminalStore()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [maxRuntime, setMaxRuntime] = useState<number>(10)
  const [loading, setLoading] = useState(true)
  const [project, setProject] = useState<Project | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    if (projectId) {
      const timer = setTimeout(() => {
        const projectData = getProject(projectId)
        if (!projectData) {
          navigate('/dashboard')
          return
        }

        setProject(projectData)

        if (projectData.maxRuntime !== undefined) {
          setMaxRuntime(projectData.maxRuntime)
        }

        setLoading(false)
      }, 1200)

      return () => clearTimeout(timer)
    }
  }, [projectId, isAuthenticated, navigate, getProject])

  const handleGoBack = () => {
    navigate('/dashboard')
  }

  const handleRunFile = () => {
    const activeFile = files.find((file) => file.id === activeFileId)
    if (activeFile) {
      const escapedContent = activeFile.content
        .replace(/\\/g, '\\\\') // Escape backslashes
        .replace(/"/g, '\\"') // Escape double quotes for shell

      const runCommand = `python -c "${escapedContent}"`

      // Run the command
      useTerminalStore.getState().executeCommand(runCommand)

      toast({
        title: 'Running code',
        description: `Executing ${activeFile.name} content with ${maxRuntime}s timeout...`,
      })

      if (maxRuntime < 3) {
        setTimeout(() => {
          useTerminalStore.getState().executeCommand('', true)
          toast({
            title: 'Execution terminated',
            description: `Maximum runtime of ${maxRuntime}s exceeded.`,
            variant: 'destructive',
          })
        }, maxRuntime * 1000)
      }
    } else {
      toast({
        title: 'Cannot run file',
        description: 'No file is currently selected.',
        variant: 'destructive',
      })
    }
  }

  const handleMaxRuntimeChange = (value: number[]) => {
    const newValue = value[0]
    setMaxRuntime(newValue)

    if (projectId && project) {
      updateProject(projectId, {
        ...project,
        maxRuntime: newValue,
      })
    }
  }

  const handleOpenTerminal = () => {
    navigate(`/terminal/${projectId}`)
  }

  if (loading) {
    return <ProjectDetailSkeleton />
  }

  return (
    <div className='h-screen flex flex-col'>
      <div className='bg-muted/10 border-b border-border p-4 flex items-center'>
        <Button
          variant='ghost'
          size='icon'
          onClick={handleGoBack}
          className='mr-4'
        >
          <ArrowLeft className='h-5 w-5' />
        </Button>
        <h1 className='text-xl font-bold'>
          {project ? project.name : 'Project'}
        </h1>
        <div className='ml-auto flex items-center gap-3'>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                size='sm'
                className='flex items-center gap-1'
              >
                <Clock className='h-4 w-4' />
                {maxRuntime}s
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-80'>
              <div className='space-y-4'>
                <h4 className='font-medium'>Maximum Runtime</h4>
                <p className='text-sm text-muted-foreground'>
                  Set the maximum time a file can execute before being
                  terminated.
                </p>
                <div className='flex items-center gap-2'>
                  <span className='text-sm'>1s</span>
                  <Slider
                    value={[maxRuntime]}
                    min={1}
                    max={30}
                    step={1}
                    onValueChange={handleMaxRuntimeChange}
                    className='flex-1'
                  />
                  <span className='text-sm'>30s</span>
                </div>
                <div className='text-center text-sm text-muted-foreground'>
                  Current setting: {maxRuntime} seconds
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Button
            onClick={handleOpenTerminal}
            size='sm'
            variant='outline'
            className='flex items-center gap-2'
          >
            <Terminal className='h-4 w-4' />
            Open Terminal
          </Button>

          <Button
            onClick={handleRunFile}
            size='sm'
            className='flex items-center gap-2'
          >
            <Play className='h-4 w-4' />
            Run File
          </Button>
        </div>
      </div>
      <Layout projectId={projectId} />
    </div>
  )
}

export default ProjectDetail
