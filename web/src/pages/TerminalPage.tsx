import React from 'react'
import { Terminal } from '@/components/Terminal'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Terminal as TerminalIcon, RefreshCw } from 'lucide-react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useTerminalStore } from '@/lib/terminal-store'
import { useProjectsStore } from '@/lib/projects-store'
import { useEffect, useState } from 'react'

export function TerminalPage() {
  const { connected, connectWebSocket, setProjectId: setTerminalProjectId } = useTerminalStore()
  const { projectId: projectIdParam } = useParams<{ projectId?: string }>()
  const { activeProject, getProject } = useProjectsStore()
  const [projectId, setProjectId] = useState<string>('default')
  const navigate = useNavigate()

  // Determine which project ID to use
  useEffect(() => {
    if (projectIdParam) {
      // Verify the project exists
      const project = getProject(projectIdParam)
      if (project) {
        setProjectId(projectIdParam)
        // Explicitly set the project ID in the terminal store
        setTerminalProjectId(projectIdParam)
      } else {
        // If project doesn't exist, default to the active project or dashboard
        if (activeProject) {
          setProjectId(activeProject.id)
          setTerminalProjectId(activeProject.id)
        } else {
          navigate('/dashboard')
        }
      }
    } else if (activeProject) {
      setProjectId(activeProject.id)
      setTerminalProjectId(activeProject.id)
    }
  }, [projectIdParam, activeProject, getProject, setTerminalProjectId, navigate])

  const handleReconnect = () => {
    // Ensure terminal reconnects with the current project ID
    setTerminalProjectId(projectId)
    connectWebSocket()
  }

  const goBackPath = projectIdParam
    ? `/project/${projectIdParam}`
    : activeProject
      ? `/project/${activeProject.id}`
      : '/dashboard'

  return (
    <div className='flex h-screen flex-col'>
      <div className='flex items-center justify-between border-b border-border bg-muted/10 p-4'>
        <div className='flex items-center'>
          <Link to={goBackPath}>
            <Button variant='outline' size='sm' className='mr-4'>
              <ArrowLeft className='mr-2 h-4 w-4' />
              Back to Project
            </Button>
          </Link>
          <div className='flex items-center'>
            <TerminalIcon className='mr-2 h-5 w-5 text-primary' />
            <h1 className='text-xl font-semibold'>Terminal</h1>
            {projectId !== 'default' && (
              <span className='ml-3 text-sm text-muted-foreground'>Project: {projectId}</span>
            )}
          </div>
        </div>

        {!connected && (
          <Button variant='outline' size='sm' className='ml-auto' onClick={handleReconnect}>
            <RefreshCw className='mr-2 h-4 w-4' />
            Reconnect
          </Button>
        )}
      </div>

      <div className='flex flex-1 flex-col'>
        <Terminal projectId={projectId} />
      </div>
    </div>
  )
}

export default TerminalPage
